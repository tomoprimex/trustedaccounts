"use client";

import Link from "next/link";
import { ArrowRight, Check, CircleDollarSign, Headphones, RefreshCcw, ShieldCheck, Zap } from "lucide-react";
import { FadeIn } from "./fade-in";

const assurances = [
  { icon: ShieldCheck, title: "Verified accounts", copy: "Checked before listing" },
  { icon: Zap, title: "Instant delivery", copy: "Access after payment" },
  { icon: RefreshCcw, title: "Replacement promise", copy: "Support when needed" },
  { icon: Headphones, title: "24/7 assistance", copy: "Real help, anytime" },
];

export function Pricing() {
  return (
    <section id="pricing" className="relative overflow-hidden bg-gradient-to-br from-blue-900 to-indigo-900 px-4 py-12 text-white lg:px-6 lg:py-16">
      <div className="absolute -right-24 -top-28 h-96 w-96 rounded-full border border-blue-300/20" />
      <div className="absolute -right-12 -top-16 h-72 w-72 rounded-full border border-blue-300/10" />
      <div className="relative mx-auto max-w-7xl">
        <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
          <FadeIn>
            <p className="text-[10px] font-bold uppercase tracking-[.18em] text-blue-300">Ready to find yours?</p>
            <h2 className="mt-4 max-w-2xl text-2xl font-extrabold leading-[1.03] tracking-[-.07em] sm:text-4xl">
              Your next account<br />
              <span className="font-serif font-semibold italic text-cyan-300">is waiting.</span>
            </h2>
            <p className="mt-4 max-w-lg text-xs leading-6 text-blue-100/70 sm:text-sm">
              Prices are set by individual sellers in Nigerian naira. Browse the marketplace and choose the listing that works for you.
            </p>
          </FadeIn>
          <FadeIn delay={.1}>
            <Link 
              href="/signup" 
              className="group inline-flex items-center gap-6 rounded-xl bg-white px-4 py-3 text-[10px] font-extrabold text-blue-900 shadow-xl transition hover:-translate-y-1 hover:bg-blue-50"
            >
              Browse available accounts 
              <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
            </Link>
          </FadeIn>
        </div>
        <div className="mt-10 grid gap-px overflow-hidden rounded-xl border border-blue-200/15 bg-blue-200/15 sm:grid-cols-2 lg:grid-cols-4">
          {assurances.map(({ icon: Icon, title, copy }) => (
            <div key={title} className="bg-blue-800/50 backdrop-blur p-4">
              <Icon size={16} className="text-cyan-300" />
              <h3 className="mt-3 text-xs font-extrabold">{title}</h3>
              <p className="mt-1 text-[10px] text-blue-100/60">{copy}</p>
            </div>
          ))}
        </div>
        <div className="mt-6 flex flex-wrap gap-x-4 gap-y-2 text-[10px] text-blue-100/60">
          <span className="inline-flex items-center gap-1">
            <CircleDollarSign size={12} /> 
            Transparent seller pricing
          </span>
          <span className="inline-flex items-center gap-1">
            <Check size={12} /> 
            No hidden marketplace fees
          </span>
        </div>
      </div>
    </section>
  );
}