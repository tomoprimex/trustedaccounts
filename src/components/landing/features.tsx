"use client";

import { motion } from "framer-motion";
import { BadgeCheck, Headphones, LockKeyhole, RefreshCcw, ShieldCheck, Zap } from "lucide-react";
import { FadeIn } from "./fade-in";

const features = [
  { icon: ShieldCheck, number: "01", title: "Verified before listing", copy: "Every account is checked before it appears in the marketplace." },
  { icon: Zap, number: "02", title: "Instant delivery", copy: "Your purchase is available in your dashboard after payment." },
  { icon: LockKeyhole, number: "03", title: "Secure transactions", copy: "Checkout is handled through protected payment processing." },
  { icon: RefreshCcw, number: "04", title: "Replacement guarantee", copy: "If an account doesn't work, our replacement promise has your back." },
  { icon: Headphones, number: "05", title: "Real human support", copy: "Our support team is available around the clock." },
  { icon: BadgeCheck, number: "06", title: "Clear seller details", copy: "See platform, price, and availability before you commit." },
];

export function Features() {
  return (
    <section id="features" className="relative bg-white px-4 py-12 lg:px-6 lg:py-16">
      <div className="mx-auto max-w-7xl">
        <FadeIn className="max-w-2xl">
          <p className="text-[10px] font-bold uppercase tracking-[.18em] text-blue-900">Built around trust</p>
          <h2 className="mt-3 text-2xl font-extrabold leading-[1.02] tracking-[-.07em] bg-gradient-to-r from-blue-900 to-indigo-900 bg-clip-text text-transparent sm:text-3xl">
            Everything important,<br />
            <span className="font-serif font-semibold italic text-blue-900">visible upfront.</span>
          </h2>
          <p className="mt-4 text-xs leading-6 text-slate-500 sm:text-sm">
            A marketplace should make the important details easy to understand. TrustedAccounts keeps quality, price, and delivery clear from the first click.
          </p>
        </FadeIn>
        <div className="mt-8 grid gap-px overflow-hidden rounded-xl border border-slate-200 bg-slate-200 sm:grid-cols-2 lg:grid-cols-3">
          {features.map(({ icon: Icon, number, title, copy }, index) => (
            <FadeIn key={title} delay={index * .06}>
              <motion.article 
                whileHover={{ y: -3 }} 
                className="group relative min-h-[140px] bg-white p-4 transition-shadow hover:z-10 hover:shadow-lg sm:p-5"
              >
                <div className="flex items-start justify-between">
                  <span className="grid h-8 w-8 place-items-center rounded-lg bg-blue-50 text-blue-900 transition-colors group-hover:bg-gradient-to-br group-hover:from-blue-900 group-hover:to-indigo-900 group-hover:text-white">
                    <Icon size={14} />
                  </span>
                  <span className="font-mono text-[9px] font-bold text-slate-300">{number}</span>
                </div>
                <h3 className="mt-4 text-sm font-extrabold tracking-[-.04em] text-slate-900">{title}</h3>
                <p className="mt-2 text-[10px] leading-5 text-slate-500">{copy}</p>
              </motion.article>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
