"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { AlertCircle, ArrowLeft, CreditCard, Loader2, Lock, ShieldCheck, Zap } from "lucide-react";
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { createClient } from "@/lib/supabase/client";

type Provider = "paystack" | "ercas";

const PRESETS = [1000, 2500, 5000, 10000, 25000, 50000];
const MIN = 100;
const MAX = 5_000_000;

const providers: { id: Provider; title: string; caption: string; icon: typeof CreditCard; accent: string }[] = [
  { id: "paystack", title: "Paystack", caption: "Card, bank transfer, USSD", icon: CreditCard, accent: "from-emerald-500 to-emerald-600" },
  { id: "ercas", title: "Ercas Pay", caption: "Card, transfer, USSD, QR", icon: Zap, accent: "from-violet-500 to-violet-600" },
];

export default function AddMoneyPage() {
  const [amount, setAmount] = useState("");
  const [provider, setProvider] = useState<Provider>("paystack");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const value = Number(amount);
  const valid = Number.isFinite(value) && value >= MIN && value <= MAX;

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!valid) {
      setError(`Enter an amount between ₦${MIN.toLocaleString()} and ₦${MAX.toLocaleString()}`);
      return;
    }
    setBusy(true);
    setError("");
    try {
      const { data: auth } = await createClient().auth.getSession();
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(auth.session ? { Authorization: `Bearer ${auth.session.access_token}` } : {}),
        },
        body: JSON.stringify({ type: "deposit", provider, amount: value }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.status === 401) {
        window.location.href = "/login";
        return;
      }
      if (!res.ok || !data.checkoutUrl) throw new Error(data.error || "Could not start payment");
      window.location.href = data.checkoutUrl;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not start payment");
      setBusy(false);
    }
  }

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-xl">
        <motion.header initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="mb-6 flex items-center gap-3">
          <Link
            href="/dashboard/wallet"
            aria-label="Back to wallet"
            className="grid h-9 w-9 place-items-center rounded-xl border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-100"
          >
            <ArrowLeft size={16} />
          </Link>
          <div>
            <h1 className="app-page-title">Add money</h1>
            <p className="app-page-subtitle">Top up your wallet to buy accounts instantly.</p>
          </div>
        </motion.header>

        <motion.form
          onSubmit={submit}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="app-surface space-y-6 p-5 sm:p-6"
        >
          <div>
            <label htmlFor="amount" className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-500">
              Amount
            </label>
            <div className="relative">
              <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-xl font-bold text-slate-400">₦</span>
              <input
                id="amount"
                inputMode="decimal"
                autoFocus
                value={amount}
                onChange={(e) => setAmount(e.target.value.replace(/[^\d.]/g, ""))}
                placeholder="0"
                className="w-full rounded-2xl border-2 border-slate-200 bg-white py-4 pl-10 pr-4 text-3xl font-extrabold tracking-tight text-slate-900 outline-none transition placeholder:text-slate-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
              />
            </div>
            <div className="mt-3 grid grid-cols-3 gap-2">
              {PRESETS.map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setAmount(String(p))}
                  className={`rounded-xl border px-2 py-2 text-xs font-semibold transition ${
                    value === p ? "border-blue-500 bg-blue-50 text-blue-700" : "border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50"
                  }`}
                >
                  ₦{p.toLocaleString()}
                </button>
              ))}
            </div>
          </div>

          <fieldset>
            <legend className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-500">Pay with</legend>
            <div className="grid gap-2 sm:grid-cols-2">
              {providers.map((p) => {
                const Icon = p.icon;
                const selected = provider === p.id;
                return (
                  <label
                    key={p.id}
                    className={`flex cursor-pointer items-center gap-3 rounded-2xl border-2 p-3 transition ${
                      selected ? "border-blue-500 bg-blue-50" : "border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    <input type="radio" name="provider" className="sr-only" checked={selected} onChange={() => setProvider(p.id)} />
                    <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-gradient-to-br ${p.accent} text-white`}>
                      <Icon size={18} />
                    </span>
                    <span className="min-w-0">
                      <span className="block text-sm font-bold text-slate-900">{p.title}</span>
                      <span className="block text-xs text-slate-500">{p.caption}</span>
                    </span>
                  </label>
                );
              })}
            </div>
          </fieldset>

          {error && (
            <div role="alert" className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-red-700">
              <AlertCircle size={16} className="mt-0.5 shrink-0" />
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={busy || !valid}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-bold text-white shadow-lg shadow-blue-600/25 transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {busy ? <Loader2 size={16} className="animate-spin" /> : <Lock size={15} />}
            {busy ? "Redirecting to secure checkout…" : valid ? `Add ₦${value.toLocaleString()}` : "Add money"}
          </button>
          <p className="flex items-center justify-center gap-1.5 text-[11px] text-slate-500">
            <ShieldCheck size={13} /> Your wallet is credited only after the payment is verified
          </p>
        </motion.form>
      </div>
    </DashboardLayout>
  );
}
