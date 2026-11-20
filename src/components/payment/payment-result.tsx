import Link from "next/link";
import { CheckCircle2, Clock, RotateCcw, XCircle } from "lucide-react";
import type { SettleOutcome } from "@/lib/payments/server";
import { AutoRefresh } from "./auto-refresh";

const naira = (kobo?: number) =>
  kobo === undefined ? "" : `₦${(kobo / 100).toLocaleString("en-NG", { maximumFractionDigits: 2 })}`;

export function PaymentResult({ outcome }: { outcome: SettleOutcome }) {
  const kind = outcome.kind;
  const amount = naira(outcome.amountKobo);

  const view = {
    success: {
      icon: CheckCircle2,
      tone: "text-emerald-600 bg-emerald-50 ring-emerald-100",
      title: kind === "deposit" ? "Wallet funded" : "Payment successful",
      body:
        kind === "deposit"
          ? `${amount} has been added to your wallet.`
          : kind === "order"
          ? "Your account is ready. You can view the login details in My Accounts."
          : "Your purchase is complete.",
      primary: kind === "deposit" ? { href: "/dashboard/wallet", label: "Go to wallet" } : kind === "order" ? { href: "/dashboard/accounts", label: "View my accounts" } : { href: "/library", label: "Open library" },
    },
    refunded: {
      icon: RotateCcw,
      tone: "text-amber-600 bg-amber-50 ring-amber-100",
      title: "Account no longer available",
      body: `Another buyer completed checkout first. ${amount} has been credited to your wallet so you can pick another account.`,
      primary: { href: "/marketplace", label: "Browse marketplace" },
    },
    pending: {
      icon: Clock,
      tone: "text-blue-600 bg-blue-50 ring-blue-100",
      title: "Confirming your payment",
      body: "This usually takes a few seconds. This page will update automatically. You won't be charged twice.",
      primary: { href: "/dashboard", label: "Go to dashboard" },
    },
    failed: {
      icon: XCircle,
      tone: "text-red-600 bg-red-50 ring-red-100",
      title: "Payment not completed",
      body: ("message" in outcome && outcome.message) || "The payment was cancelled or declined. No money was taken from your wallet.",
      primary: kind === "deposit" ? { href: "/dashboard/wallet/add-money", label: "Try again" } : { href: "/marketplace", label: "Back to marketplace" },
    },
  }[outcome.status];

  const Icon = view.icon;

  return (
    <main className="grid min-h-screen place-items-center bg-slate-50 px-4 py-10">
      {outcome.status === "pending" && <AutoRefresh />}
      <section className="app-surface w-full max-w-md p-6 text-center sm:p-8" aria-live="polite">
        <div className={`mx-auto mb-5 grid h-16 w-16 place-items-center rounded-full ring-8 ${view.tone}`}>
          <Icon size={30} className={outcome.status === "pending" ? "animate-pulse" : ""} />
        </div>
        <h1 className="text-xl font-extrabold tracking-tight text-slate-900">{view.title}</h1>
        <p className="mt-2 text-sm leading-6 text-slate-600">{view.body}</p>
        <div className="mt-7 flex flex-col gap-2 sm:flex-row">
          <Link
            href={view.primary.href}
            className="flex-1 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700"
          >
            {view.primary.label}
          </Link>
          <Link
            href="/dashboard"
            className="flex-1 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
          >
            Dashboard
          </Link>
        </div>
      </section>
    </main>
  );
}
