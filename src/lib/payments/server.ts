import "server-only";
import { randomUUID } from "crypto";
import type { SupabaseClient, User } from "@supabase/supabase-js";
import { createClient as createSupabaseJsClient } from "@supabase/supabase-js";
import { createClient as createServerClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import * as paystack from "@/lib/paystack";
import * as ercas from "@/lib/ercas";

export type Provider = "paystack" | "ercas";
export type PaymentKind = "deposit" | "order" | "purchase";

export const MIN_DEPOSIT_KOBO = 100 * 100; // ₦100
export const MAX_DEPOSIT_KOBO = 5_000_000 * 100; // ₦5,000,000

export class PaymentError extends Error {
  constructor(message: string, public status = 400) {
    super(message);
  }
}

/* ------------------------------------------------------------------ */
/* Auth + helpers                                                      */
/* ------------------------------------------------------------------ */

/** Resolves the signed-in user from the Supabase cookie session, or a Bearer token. */
export async function getRequestUser(request: Request): Promise<User | null> {
  const auth = request.headers.get("authorization");
  if (auth?.startsWith("Bearer ")) {
    const anon = createSupabaseJsClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      { auth: { persistSession: false, autoRefreshToken: false } }
    );
    const { data } = await anon.auth.getUser(auth.slice(7));
    if (data.user) return data.user;
  }
  const supabase = await createServerClient();
  const { data } = await supabase.auth.getUser();
  return data.user ?? null;
}

export function siteUrl(request?: Request) {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/+$/, "");
  if (fromEnv) return fromEnv;
  if (request) return new URL(request.url).origin;
  return "http://localhost:3000";
}

function customerName(user: User) {
  const meta = user.user_metadata as { full_name?: string } | undefined;
  return meta?.full_name?.trim() || user.email?.split("@")[0] || "Customer";
}

function newReference(prefix: string) {
  return `${prefix}-${Date.now().toString(36)}-${randomUUID().replace(/-/g, "").slice(0, 10)}`.toUpperCase();
}

function orderNumber() {
  const date = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  return `ORD-${date}-${randomUUID().replace(/-/g, "").slice(0, 6).toUpperCase()}`;
}

/* ------------------------------------------------------------------ */
/* Wallet                                                              */
/* ------------------------------------------------------------------ */

/**
 * Atomically adds `deltaKobo` (may be negative) to a user's wallet using
 * optimistic concurrency, so concurrent credits/debits can't be lost.
 */
export async function adjustWallet(db: SupabaseClient, userId: string, deltaKobo: number) {
  for (let attempt = 0; attempt < 6; attempt++) {
    const { data: wallet, error } = await db
      .from("wallets")
      .select("id, balance_cents")
      .eq("user_id", userId)
      .maybeSingle();
    if (error) throw error;

    if (!wallet) {
      if (deltaKobo < 0) throw new PaymentError("Insufficient wallet balance");
      const { error: insertError } = await db
        .from("wallets")
        .insert({ user_id: userId, balance_cents: deltaKobo, currency: "NGN" });
      if (!insertError) {
        await syncProfileBalance(db, userId, deltaKobo);
        return deltaKobo;
      }
      if (insertError.code === "23505") continue; // created concurrently — retry as update
      throw insertError;
    }

    const next = wallet.balance_cents + deltaKobo;
    if (next < 0) throw new PaymentError("Insufficient wallet balance");

    const { data: updated, error: updateError } = await db
      .from("wallets")
      .update({ balance_cents: next })
      .eq("id", wallet.id)
      .eq("balance_cents", wallet.balance_cents)
      .select("id");
    if (updateError) throw updateError;
    if (updated && updated.length > 0) {
      await syncProfileBalance(db, userId, next);
      return next;
    }
  }
  throw new PaymentError("Your wallet is busy, please try again", 409);
}

async function syncProfileBalance(db: SupabaseClient, userId: string, balance: number) {
  // Mirror column kept for older UI; the wallets table is the source of truth.
  await db.from("profiles").update({ wallet_balance_cents: balance }).eq("id", userId);
}

/* ------------------------------------------------------------------ */
/* Fulfilment (idempotent — safe to call from callback AND webhook)    */
/* ------------------------------------------------------------------ */

export type SettleOutcome =
  | { status: "success"; kind: PaymentKind; amountKobo: number }
  | { status: "refunded"; kind: PaymentKind; amountKobo: number }
  | { status: "pending" | "failed"; kind?: PaymentKind; amountKobo?: number; message?: string };

export async function completeDeposit(db: SupabaseClient, depositId: string, paidKobo: number): Promise<SettleOutcome> {
  const { data: deposit } = await db.from("deposits").select("*").eq("id", depositId).maybeSingle();
  if (!deposit) return { status: "failed", message: "Deposit not found" };
  if (deposit.status === "completed") return { status: "success", kind: "deposit", amountKobo: deposit.amount_cents };
  if (paidKobo < deposit.amount_cents) {
    await db.from("deposits").update({ status: "failed" }).eq("id", deposit.id).eq("status", "pending");
    return { status: "failed", kind: "deposit", message: "Amount paid is less than the deposit amount" };
  }

  // Claim the deposit; only the caller that flips pending -> completed credits the wallet.
  const { data: claimed } = await db
    .from("deposits")
    .update({ status: "completed" })
    .eq("id", deposit.id)
    .neq("status", "completed")
    .select("id");
  if (claimed && claimed.length > 0) {
    await adjustWallet(db, deposit.user_id, deposit.amount_cents);
  }
  return { status: "success", kind: "deposit", amountKobo: deposit.amount_cents };
}

export async function fulfillOrder(db: SupabaseClient, orderId: string, paidKobo: number): Promise<SettleOutcome> {
  const { data: order } = await db.from("orders").select("*").eq("id", orderId).maybeSingle();
  if (!order) return { status: "failed", message: "Order not found" };
  if (order.status === "completed") return { status: "success", kind: "order", amountKobo: order.amount_cents };
  if (order.status === "refunded") return { status: "refunded", kind: "order", amountKobo: order.amount_cents };
  // A "failed" order can still be fulfilled if the gateway later confirms payment (e.g. abandoned then completed).
  if (order.status !== "pending" && order.status !== "failed") return { status: "pending", kind: "order" };

  if (paidKobo < order.amount_cents) {
    await db.from("orders").update({ status: "failed", notes: "Underpaid" }).eq("id", order.id).eq("status", "pending");
    return { status: "failed", kind: "order", message: "Amount paid is less than the order amount" };
  }

  // Claim the order so concurrent callback/webhook don't both fulfil it.
  const { data: claimed } = await db
    .from("orders")
    .update({ status: "processing" })
    .eq("id", order.id)
    .eq("status", order.status)
    .select("id");
  if (!claimed || claimed.length === 0) return settledOrderState(db, order.id);

  const { data: account } = await db
    .from("accounts")
    .update({ status: "sold" })
    .eq("id", order.account_id)
    .in("status", ["available", "reserved"])
    .select("id, platform");

  if (!account || account.length === 0) {
    // Someone else bought it first — never lose the customer's money.
    await adjustWallet(db, order.customer_id, order.amount_cents);
    await db
      .from("orders")
      .update({ status: "refunded", notes: "Account was sold before payment confirmed. Amount credited to wallet." })
      .eq("id", order.id);
    return { status: "refunded", kind: "order", amountKobo: order.amount_cents };
  }

  await db.from("orders").update({ status: "completed", delivery_status: "delivered" }).eq("id", order.id);
  await recordRevenue(db, order.id, order.amount_cents, account[0].platform);
  return { status: "success", kind: "order", amountKobo: order.amount_cents };
}

async function settledOrderState(db: SupabaseClient, orderId: string): Promise<SettleOutcome> {
  const { data } = await db.from("orders").select("status, amount_cents").eq("id", orderId).maybeSingle();
  if (data?.status === "completed") return { status: "success", kind: "order", amountKobo: data.amount_cents };
  if (data?.status === "refunded") return { status: "refunded", kind: "order", amountKobo: data.amount_cents };
  return { status: "pending", kind: "order" };
}

async function recordRevenue(db: SupabaseClient, orderId: string, amountKobo: number, platform?: string) {
  const { error } = await db.from("revenue").insert({
    order_id: orderId,
    amount_cents: amountKobo,
    currency: "NGN",
    platform: platform ?? null,
    date: new Date().toISOString().split("T")[0],
  });
  if (error) console.error("Revenue record failed:", error.message);
}

export async function completeWebsitePurchase(db: SupabaseClient, purchaseId: string, paidKobo: number): Promise<SettleOutcome> {
  const { data: purchase } = await db.from("purchases").select("*").eq("id", purchaseId).maybeSingle();
  if (!purchase) return { status: "failed", message: "Purchase not found" };
  if (purchase.status === "paid") return { status: "success", kind: "purchase", amountKobo: purchase.amount_kobo };
  if (paidKobo < purchase.amount_kobo) return { status: "failed", kind: "purchase", message: "Underpaid" };
  await db.from("purchases").update({ status: "paid" }).eq("id", purchase.id).neq("status", "paid");
  return { status: "success", kind: "purchase", amountKobo: purchase.amount_kobo };
}

/* ------------------------------------------------------------------ */
/* Lookup + verify + settle                                            */
/* ------------------------------------------------------------------ */

interface PaymentRecord {
  kind: PaymentKind;
  id: string;
  userId: string;
  provider: Provider;
  providerReference: string;
}

/** Finds the deposit / order / website purchase that a gateway reference belongs to. */
export async function findRecordByReference(db: SupabaseClient, reference: string): Promise<PaymentRecord | null> {
  const { data: deposit } = await db
    .from("deposits")
    .select("id, user_id, payment_method, payment_reference")
    .eq("payment_reference", reference)
    .maybeSingle();
  if (deposit) {
    return {
      kind: "deposit",
      id: deposit.id,
      userId: deposit.user_id,
      provider: deposit.payment_method === "ercas" ? "ercas" : "paystack",
      providerReference: deposit.payment_reference,
    };
  }

  const { data: order } = await db
    .from("orders")
    .select("id, customer_id, payment_method, payment_reference")
    .eq("payment_reference", reference)
    .maybeSingle();
  if (order) {
    return {
      kind: "order",
      id: order.id,
      userId: order.customer_id,
      provider: order.payment_method === "ercas" ? "ercas" : "paystack",
      providerReference: order.payment_reference,
    };
  }

  for (const [column, provider] of [["paystack_reference", "paystack"], ["ercas_reference", "ercas"]] as const) {
    const { data: purchase } = await db.from("purchases").select("id, user_id").eq(column, reference).maybeSingle();
    if (purchase) {
      return { kind: "purchase", id: purchase.id, userId: purchase.user_id, provider, providerReference: reference };
    }
  }
  return null;
}

export async function findRecordById(db: SupabaseClient, kind: PaymentKind, id: string): Promise<PaymentRecord | null> {
  if (kind === "deposit") {
    const { data } = await db.from("deposits").select("id, user_id, payment_method, payment_reference").eq("id", id).maybeSingle();
    return data
      ? { kind, id: data.id, userId: data.user_id, provider: data.payment_method === "ercas" ? "ercas" : "paystack", providerReference: data.payment_reference }
      : null;
  }
  if (kind === "order") {
    const { data } = await db.from("orders").select("id, customer_id, payment_method, payment_reference").eq("id", id).maybeSingle();
    return data
      ? { kind, id: data.id, userId: data.customer_id, provider: data.payment_method === "ercas" ? "ercas" : "paystack", providerReference: data.payment_reference }
      : null;
  }
  const { data } = await db.from("purchases").select("id, user_id, paystack_reference, ercas_reference").eq("id", id).maybeSingle();
  if (!data) return null;
  return data.ercas_reference
    ? { kind, id: data.id, userId: data.user_id, provider: "ercas", providerReference: data.ercas_reference }
    : { kind, id: data.id, userId: data.user_id, provider: "paystack", providerReference: data.paystack_reference };
}

/** Verifies a record's payment with its gateway (the only source of truth) and fulfils it. */
export async function verifyAndSettle(db: SupabaseClient, record: PaymentRecord): Promise<SettleOutcome> {
  if (!record.providerReference) return { status: "pending", kind: record.kind, message: "Payment was not started" };

  let verified: { paid: boolean; amountKobo: number; status: string };
  try {
    verified =
      record.provider === "ercas"
        ? await ercas.verifyTransaction(record.providerReference)
        : await paystack.verifyTransaction(record.providerReference);
  } catch (error) {
    console.error(`[payments] verify failed for ${record.kind} ${record.id}:`, error);
    return { status: "pending", kind: record.kind, message: "We could not confirm this payment yet" };
  }

  if (!verified.paid) {
    const failed = ["failed", "abandoned", "reversed", "cancelled", "canceled", "declined"].includes(verified.status);
    if (failed) await markFailed(db, record);
    return { status: failed ? "failed" : "pending", kind: record.kind };
  }

  if (record.kind === "deposit") return completeDeposit(db, record.id, verified.amountKobo);
  if (record.kind === "order") return fulfillOrder(db, record.id, verified.amountKobo);
  return completeWebsitePurchase(db, record.id, verified.amountKobo);
}

async function markFailed(db: SupabaseClient, record: PaymentRecord) {
  if (record.kind === "deposit") {
    await db.from("deposits").update({ status: "failed" }).eq("id", record.id).eq("status", "pending");
  } else if (record.kind === "order") {
    await db.from("orders").update({ status: "failed" }).eq("id", record.id).eq("status", "pending");
  }
}

/* ------------------------------------------------------------------ */
/* Checkout initialisation                                             */
/* ------------------------------------------------------------------ */

async function startGateway(opts: {
  provider: Provider;
  user: User;
  amountKobo: number;
  reference: string;
  callbackUrl: string;
  description: string;
  metadata: Record<string, unknown>;
}): Promise<{ checkoutUrl: string; providerReference: string }> {
  if (opts.provider === "ercas") {
    const result = await ercas.initializeTransaction({
      amountKobo: opts.amountKobo,
      paymentReference: opts.reference,
      customerName: customerName(opts.user),
      customerEmail: opts.user.email!,
      redirectUrl: opts.callbackUrl,
      description: opts.description,
      metadata: opts.metadata,
    });
    return { checkoutUrl: result.checkoutUrl, providerReference: result.transactionReference };
  }
  const result = await paystack.initializeTransaction({
    email: opts.user.email!,
    amountKobo: opts.amountKobo,
    reference: opts.reference,
    callbackUrl: opts.callbackUrl,
    metadata: opts.metadata,
  });
  return { checkoutUrl: result.authorization_url, providerReference: opts.reference };
}

function callbackUrl(base: string, provider: Provider, kind: PaymentKind, id: string) {
  // Path-based so whatever query string the gateway appends can't break it.
  return `${base}/payment/callback/${provider}/${kind}/${id}`;
}

export async function startDeposit(request: Request, user: User, provider: Provider, amountKobo: number) {
  if (!Number.isInteger(amountKobo) || amountKobo < MIN_DEPOSIT_KOBO || amountKobo > MAX_DEPOSIT_KOBO) {
    throw new PaymentError("Enter an amount between ₦100 and ₦5,000,000");
  }
  const db = createAdminClient();
  const reference = newReference("DEP");
  const { data: deposit, error } = await db
    .from("deposits")
    .insert({
      user_id: user.id,
      amount_cents: amountKobo,
      currency: "NGN",
      payment_method: provider === "ercas" ? "ercas" : "card",
      payment_reference: reference,
      status: "pending",
    })
    .select("id")
    .single();
  if (error || !deposit) {
    console.error("[payments] deposit insert failed:", error);
    throw new PaymentError("Could not create deposit", 500);
  }

  try {
    const started = await startGateway({
      provider,
      user,
      amountKobo,
      reference,
      callbackUrl: callbackUrl(siteUrl(request), provider, "deposit", deposit.id),
      description: "TrustedAccounts wallet top-up",
      metadata: { kind: "deposit", deposit_id: deposit.id, user_id: user.id },
    });
    if (started.providerReference !== reference) {
      await db.from("deposits").update({ payment_reference: started.providerReference }).eq("id", deposit.id);
    }
    return { checkoutUrl: started.checkoutUrl };
  } catch (err) {
    await db.from("deposits").update({ status: "failed" }).eq("id", deposit.id);
    console.error("[payments] gateway init failed:", err);
    throw new PaymentError("Payment provider is unavailable. Please try again or use another method.", 502);
  }
}

export async function startAccountCheckout(request: Request, user: User, provider: Provider, accountId: string) {
  const db = createAdminClient();
  const { data: account } = await db
    .from("accounts")
    .select("id, platform, username, price_cents, status")
    .eq("id", accountId)
    .maybeSingle();
  if (!account) throw new PaymentError("Account not found", 404);
  if (account.status !== "available") throw new PaymentError("This account is no longer available", 409);
  if (!account.price_cents || account.price_cents <= 0) throw new PaymentError("This account has no valid price", 400);

  const reference = newReference("ORD");
  const { data: order, error } = await db
    .from("orders")
    .insert({
      order_number: orderNumber(),
      customer_id: user.id,
      account_id: account.id,
      amount_cents: account.price_cents,
      currency: "NGN",
      status: "pending",
      delivery_status: "pending",
      payment_method: provider,
      payment_reference: reference,
    })
    .select("id")
    .single();
  if (error || !order) {
    console.error("[payments] order insert failed:", error);
    throw new PaymentError("Could not create order", 500);
  }

  try {
    const started = await startGateway({
      provider,
      user,
      amountKobo: account.price_cents,
      reference,
      callbackUrl: callbackUrl(siteUrl(request), provider, "order", order.id),
      description: `${account.platform} account @${account.username}`,
      metadata: { kind: "order", order_id: order.id, user_id: user.id },
    });
    if (started.providerReference !== reference) {
      await db.from("orders").update({ payment_reference: started.providerReference }).eq("id", order.id);
    }
    return { checkoutUrl: started.checkoutUrl };
  } catch (err) {
    await db.from("orders").update({ status: "failed" }).eq("id", order.id);
    console.error("[payments] gateway init failed:", err);
    throw new PaymentError("Payment provider is unavailable. Please try again or use another method.", 502);
  }
}

export async function startWebsiteCheckout(request: Request, user: User, provider: Provider, websiteId: string) {
  const db = createAdminClient();
  const { data: website } = await db.from("websites").select("id, price_kobo, is_published").eq("id", websiteId).maybeSingle();
  if (!website || !website.is_published) throw new PaymentError("Website not found", 404);

  const { data: existing } = await db
    .from("purchases")
    .select("id, status")
    .eq("user_id", user.id)
    .eq("website_id", website.id)
    .maybeSingle();
  if (existing?.status === "paid") throw new PaymentError("Already purchased", 409);

  const reference = newReference("WEB");
  let purchaseId = existing?.id as string | undefined;
  if (!purchaseId) {
    const { data, error } = await db
      .from("purchases")
      .insert({ user_id: user.id, website_id: website.id, status: "pending", amount_kobo: website.price_kobo })
      .select("id")
      .single();
    if (error || !data) throw new PaymentError("Could not create purchase", 500);
    purchaseId = data.id;
  }

  try {
    const started = await startGateway({
      provider,
      user,
      amountKobo: website.price_kobo,
      reference,
      callbackUrl: callbackUrl(siteUrl(request), provider, "purchase", purchaseId!),
      description: "TrustedAccounts website purchase",
      metadata: { kind: "purchase", purchase_id: purchaseId, user_id: user.id, website_id: String(website.id) },
    });
    await db
      .from("purchases")
      .update(
        provider === "ercas"
          ? { ercas_reference: started.providerReference, paystack_reference: null, status: "pending", amount_kobo: website.price_kobo }
          : { paystack_reference: started.providerReference, ercas_reference: null, status: "pending", amount_kobo: website.price_kobo }
      )
      .eq("id", purchaseId!);
    return { checkoutUrl: started.checkoutUrl };
  } catch (err) {
    console.error("[payments] gateway init failed:", err);
    throw new PaymentError("Payment provider is unavailable. Please try again.", 502);
  }
}

/* ------------------------------------------------------------------ */
/* Wallet purchase                                                     */
/* ------------------------------------------------------------------ */

export async function purchaseWithWallet(user: User, accountId: string) {
  const db = createAdminClient();
  const { data: account } = await db
    .from("accounts")
    .select("id, platform, price_cents, status")
    .eq("id", accountId)
    .maybeSingle();
  if (!account) throw new PaymentError("Account not found", 404);
  if (account.status !== "available") throw new PaymentError("This account is no longer available", 409);

  // 1. Reserve the account so two buyers can't both get it.
  const { data: reserved } = await db
    .from("accounts")
    .update({ status: "reserved" })
    .eq("id", account.id)
    .eq("status", "available")
    .select("id");
  if (!reserved || reserved.length === 0) throw new PaymentError("This account is no longer available", 409);

  const release = () => db.from("accounts").update({ status: "available" }).eq("id", account.id).eq("status", "reserved");

  // 2. Debit the wallet (fails cleanly on insufficient funds).
  try {
    await adjustWallet(db, user.id, -account.price_cents);
  } catch (err) {
    await release();
    throw err;
  }

  // 3. Create the order; refund on failure.
  const { data: order, error } = await db
    .from("orders")
    .insert({
      order_number: orderNumber(),
      customer_id: user.id,
      account_id: account.id,
      amount_cents: account.price_cents,
      currency: "NGN",
      status: "completed",
      delivery_status: "delivered",
      payment_method: "wallet",
      payment_reference: newReference("WAL"),
    })
    .select("id")
    .single();

  if (error || !order) {
    console.error("[payments] wallet order insert failed:", error);
    await adjustWallet(db, user.id, account.price_cents);
    await release();
    throw new PaymentError("Could not complete purchase. Your wallet was not charged.", 500);
  }

  await db.from("accounts").update({ status: "sold" }).eq("id", account.id);
  await recordRevenue(db, order.id, account.price_cents, account.platform);
  return { orderId: order.id };
}

export async function isAdmin(userId: string) {
  const db = createAdminClient();
  const { data } = await db.from("profiles").select("role").eq("id", userId).maybeSingle();
  return data?.role === "admin";
}
