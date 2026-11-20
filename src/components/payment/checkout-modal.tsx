"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { AlertCircle, CheckCircle2, CreditCard, Loader2, Lock, ShieldCheck, Wallet, X, Zap } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { getWalletBalance } from "@/lib/supabase/queries";

type Method = "wallet" | "paystack" | "ercas";

export interface CheckoutAccount {
  id: string;
  platform: string;
  username?: string;
  price_cents: number;
}

interface CheckoutModalProps {
  account: CheckoutAccount;
  onClose: () => void;
  /** Called after a successful wallet purchase (gateway payments redirect away). */
  onPurchased: (accountId: string) => void;
}

export const formatNaira = (kobo: number) =>
  `₦${(kobo / 100).toLocaleString("en-NG", { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`;

const methods: { id: Method; title: string; caption: string; icon: typeof Wallet; accent: string }[] = [
  { id: "wallet", title: "Wallet balance", caption: "Instant, no fees", icon: Wallet, accent: "from-blue-500 to-blue-600" },
  { id: "paystack", title: "Paystack", caption: "Card, bank transfer, USSD", icon: CreditCard, accent: "from-emerald-500 to-emerald-600" },
  { id: "ercas", title: "Ercas Pay", caption: "Card, transfer, USSD, QR", icon: Zap, accent: "from-violet-500 to-violet-600" },
];

export function CheckoutModal({ account, onClose, onPurchased }: CheckoutModalProps) {
  const [method, setMethod] = useState<Method | null>(null);
  const [balance, setBalance] = useState<number | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const { data } = await createClient().auth.getUser();
        if (!data.user) return;
        const wallet = await getWalletBalance(data.user.id);
        if (!cancelled) setBalance(wallet.balance_cents);
      } catch {
        if (!cancelled) setBalance(0);
      }
    })();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && !busy && onClose();
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      cancelled = true;
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const price = account.price_cents;
  const canAfford = balance !== null && balance >= price;

  useEffect(() => {
    if (balance === null || method) return;
    setMethod(canAfford ? "wallet" : "paystack");
  }, [balance, canAfford, method]);

  async function pay() {
    if (!method || busy) return;
    setBusy(true);
    setError("");
    try {
      const { data: auth } = await createClient().auth.getSession();
      const res = await fetch(method === "wallet" ? "/api/purchase-from-wallet" : "/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(auth.session ? { Authorization: `Bearer ${auth.session.access_token}` } : {}),
        },
        body: JSON.stringify(
          method === "wallet" ? { accountId: account.id } : { type: "account", provider: method, accountId: account.id }
        ),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || data.success === false) {
        if (res.status === 401) {
          window.location.href = "/login";
          return;
        }
        throw new Error(data.error || "Payment could not be started");
      }
      if (method === "wallet") {
        setDone(true);
        setBusy(false);
        onPurchased(account.id);
        return;
      }
      window.location.href = data.checkoutUrl;
    } catch (e) {
      setError(e instanceof Error ? e.message : "Payment failed");
      setBusy(false);
    }
  }

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[60] flex items-end justify-center bg-slate-950/60 p-0 backdrop-blur-sm sm:items-center sm:p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={() => !busy && onClose()}
      >
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-labelledby="checkout-title"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 24 }}
          transition={{ type: "spring", damping: 26, stiffness: 320 }}
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-md rounded-t-3xl border border-slate-200 bg-white p-5 shadow-2xl sm:rounded-3xl sm:p-6"
        >
          {done ? (
            <div className="py-4 text-center">
              <div className="mx-auto mb-4 grid h-16 w-16 place-items-center rounded-full bg-emerald-50 text-emerald-600 ring-8 ring-emerald-50/60">
                <CheckCircle2 size={30} />
              </div>
              <h2 className="text-lg font-extrabold text-slate-900">Purchase complete</h2>
              <p className="mt-1 text-sm text-slate-600">The login details are now in My Accounts.</p>
              <div className="mt-6 flex flex-col gap-2 sm:flex-row">
                <Link href="/dashboard/accounts" className="flex-1 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700">
                  View account
                </Link>
                <button onClick={onClose} className="flex-1 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-100">
                  Keep browsing
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="mb-5 flex items-start justify-between gap-4">
                <div>
                  <h2 id="checkout-title" className="text-lg font-extrabold tracking-tight text-slate-900">Checkout</h2>
                  <p className="mt-0.5 text-xs capitalize text-slate-500">
                    {account.platform}
                    {account.username ? ` · @${account.username.replace(/^@/, "")}` : ""}
                  </p>
                </div>
                <button
                  onClick={onClose}
                  disabled={busy}
                  aria-label="Close checkout"
                  className="rounded-full p-2 text-slate-500 transition hover:bg-slate-100 disabled:opacity-40"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="mb-5 flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3">
                <span className="text-sm text-slate-600">Total</span>
                <span className="text-2xl font-extrabold tracking-tight text-slate-900">{formatNaira(price)}</span>
              </div>

              <fieldset className="space-y-2" disabled={busy}>
                <legend className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">Pay with</legend>
                {methods.map((m) => {
                  const Icon = m.icon;
                  const selected = method === m.id;
                  const disabled = m.id === "wallet" && !canAfford;
                  return (
                    <label
                      key={m.id}
                      className={`flex cursor-pointer items-center gap-3 rounded-2xl border-2 p-3 transition ${
                        selected ? "border-blue-500 bg-blue-50" : "border-slate-200 hover:border-slate-300"
                      } ${disabled ? "cursor-not-allowed opacity-60" : ""}`}
                    >
                      <input
                        type="radio"
                        name="method"
                        className="sr-only"
                        checked={selected}
                        disabled={disabled}
                        onChange={() => setMethod(m.id)}
                      />
                      <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-gradient-to-br ${m.accent} text-white`}>
                        <Icon size={18} />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block text-sm font-bold text-slate-900">{m.title}</span>
                        <span className="block text-xs text-slate-500">
                          {m.id === "wallet"
                            ? balance === null
                              ? "Loading balance…"
                              : `${formatNaira(balance)} available${canAfford ? "" : " · insufficient"}`
                            : m.caption}
                        </span>
                      </span>
                      <span
                        aria-hidden
                        className={`grid h-5 w-5 place-items-center rounded-full border-2 ${selected ? "border-blue-600" : "border-slate-300"}`}
                      >
                        {selected && <span className="h-2.5 w-2.5 rounded-full bg-blue-600" />}
                      </span>
                    </label>
                  );
                })}
              </fieldset>

              {method === "wallet" && balance !== null && canAfford && (
                <p className="mt-3 text-xs text-slate-500">
                  Balance after purchase: <strong className="text-slate-700">{formatNaira(balance - price)}</strong>
                </p>
              )}
              {balance !== null && !canAfford && (
                <p className="mt-3 text-xs text-slate-500">
                  Need more in your wallet?{" "}
                  <Link href="/dashboard/wallet/add-money" className="font-semibold text-blue-600 hover:underline">
                    Add money
                  </Link>
                </p>
              )}

              {error && (
                <div role="alert" className="mt-4 flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-red-700">
                  <AlertCircle size={16} className="mt-0.5 shrink-0" />
                  {error}
                </div>
              )}

              <button
                onClick={pay}
                disabled={!method || busy || (method === "wallet" && !canAfford)}
                className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-bold text-white shadow-lg shadow-blue-600/25 transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {busy ? <Loader2 size={16} className="animate-spin" /> : <Lock size={15} />}
                {busy
                  ? method === "wallet"
                    ? "Processing…"
                    : "Redirecting to secure checkout…"
                  : `Pay ${formatNaira(price)}`}
              </button>
              <p className="mt-3 flex items-center justify-center gap-1.5 text-[11px] text-slate-500">
                <ShieldCheck size={13} /> Payments are verified server-side before delivery
              </p>
            </>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
