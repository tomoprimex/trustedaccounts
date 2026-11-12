import { NextResponse } from "next/server";
import crypto from "crypto";
import { verifyTransaction } from "@/lib/ercas";
import { createAdminClient } from "@/lib/supabase/admin";
import { getErcasPayPublicKey } from "@/lib/ercas-key";

function verifyRsaSignature(rawBody: string, signature: string, publicKey: string): boolean {
  try {
    const verify = crypto.createVerify("RSA-SHA256");
    verify.update(rawBody, "utf8");
    verify.end();

    const signatureBuffer = Buffer.from(signature, "base64");
    const publicKeyBuffer = Buffer.from(publicKey);

    return verify.verify(
      {
        key: publicKeyBuffer,
        format: "pem",
        type: "spki",
      },
      signatureBuffer
    );
  } catch (error) {
    console.error("RSA signature verification error:", error);
    return false;
  }
}

export async function POST(request: Request) {
  const rawBody = await request.text();
  const received = request.headers.get("x-ercaspay-signature") ?? "";

  let publicKey: string;
  try {
    publicKey = getErcasPayPublicKey();
  } catch (error) {
    console.error("Failed to get Ercas Pay public key:", error);
    return new NextResponse("Server configuration error", { status: 500 });
  }

  const isValidSignature = verifyRsaSignature(rawBody, received, publicKey);
  if (!isValidSignature) {
    return new NextResponse("Invalid signature", { status: 401 });
  }

  const event = JSON.parse(rawBody);

  // Re-verify with the API as the final authority
  const result = await verifyTransaction(event.transaction_reference);

  // Look up the order or deposit, and if it's not already marked paid, mark it paid + fulfil
  // (webhooks can arrive more than once, so make this idempotent)
  const supabase = createAdminClient();

  // Check if it's a purchase
  const { data: purchase } = await supabase
    .from("purchases")
    .select("id, website_id, amount_kobo, status, user_id")
    .eq("ercas_reference", event.transaction_reference)
    .maybeSingle();

  if (purchase) {
    if (purchase.status === "paid") {
      return NextResponse.json({ received: true });
    }

    await supabase
      .from("purchases")
      .update({ status: "paid" })
      .eq("id", purchase.id);

    return NextResponse.json({ received: true });
  }

  // Check if it's a wallet deposit
  const { data: deposit } = await supabase
    .from("deposits")
    .select("id, user_id, amount_cents, status")
    .eq("payment_reference", event.transaction_reference)
    .maybeSingle();

  if (deposit) {
    if (deposit.status === "completed") {
      return NextResponse.json({ received: true });
    }

    // Update deposit status
    await supabase
      .from("deposits")
      .update({ status: "completed" })
      .eq("id", deposit.id);

    // Update wallet balance
    const { data: wallet } = await supabase
      .from("wallets")
      .select("id, balance_cents")
      .eq("user_id", deposit.user_id)
      .single();

    if (wallet) {
      await supabase
        .from("wallets")
        .update({ balance_cents: wallet.balance_cents + deposit.amount_cents })
        .eq("id", wallet.id);
    } else {
      // Create wallet if it doesn't exist
      await supabase
        .from("wallets")
        .insert({
          user_id: deposit.user_id,
          balance_cents: deposit.amount_cents,
        });
    }

    return NextResponse.json({ received: true });
  }

  return NextResponse.json({ received: true });
}
