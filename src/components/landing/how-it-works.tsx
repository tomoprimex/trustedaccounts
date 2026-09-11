"use client";

import { motion } from "framer-motion";
import { CreditCard, Search, ShieldCheck, ShoppingCart, Timer } from "lucide-react";
import { FadeIn } from "./fade-in";

const steps = [
  { icon: Search, label: "Explore", title: "Choose your platform", copy: "Browse available listings for Instagram, YouTube, TikTok, Facebook, and more." },
  { icon: ShieldCheck, label: "Review", title: "Check the details", copy: "See the platform, verification status, seller-set price, and availability." },
  { icon: CreditCard, label: "Purchase", title: "Pay securely", copy: "Complete your checkout through our secure payment flow in Nigerian naira." },
  { icon: Timer, label: "Receive", title: "Get instant access", copy: "Your credentials are delivered to your account after successful payment." },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="bg-gradient-to-br from-slate-50 to-blue-50 px-4 py-12 lg:px-6 lg:py-16">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-8 lg:grid-cols-[.7fr_1.3fr] lg:items-end">
          <FadeIn>
            <p className="text-[10px] font-bold uppercase tracking-[.18em] text-blue-900">From browse to delivered</p>
            <h2 className="mt-3 text-2xl font-extrabold leading-[1.02] tracking-[-.07em] bg-gradient-to-r from-blue-900 to-indigo-900 bg-clip-text text-transparent sm:text-3xl">
              Simple by design.<br />
              <span className="font-serif font-semibold italic text-blue-900">Clear at every step.</span>
            </h2>
          </FadeIn>
          <FadeIn delay={.1}>
            <p className="max-w-md text-xs leading-6 text-slate-500 lg:justify-self-end sm:text-sm">
              No confusing handoffs or hidden steps. Find what fits, pay safely, and receive your account quickly.
            </p>
          </FadeIn>
        </div>
        <div className="relative mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map(({ icon: Icon, label, title, copy }, index) => (
            <FadeIn key={title} delay={index * .1}>
              <motion.div whileHover={{ y: -4 }} className="relative">
                <div className="mb-4 flex items-center justify-between">
                  <span className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-blue-900 to-indigo-900 text-white shadow-lg shadow-blue-900/15">
                    <Icon size={16} />
                  </span>
                  <span className="font-mono text-[9px] font-bold text-blue-900">0{index + 1}</span>
                </div>
                <p className="text-[9px] font-bold uppercase tracking-[.15em] text-slate-400">{label}</p>
                <h3 className="mt-1 text-sm font-extrabold tracking-[-.04em] text-slate-900">{title}</h3>
                <p className="mt-2 text-[10px] leading-5 text-slate-500">{copy}</p>
                {index < steps.length - 1 && <div className="absolute right-[-20px] top-6 hidden h-px w-10 bg-blue-900/20 lg:block" />}
              </motion.div>
            </FadeIn>
          ))}
        </div>
        <div className="mt-10 flex flex-wrap items-center gap-4 border-t border-slate-200 pt-4 text-[10px] font-bold text-slate-500">
          <span className="inline-flex items-center gap-1">
            <ShoppingCart size={12} className="text-blue-900" /> 
            Marketplace-first buying
          </span>
          <span className="inline-flex items-center gap-1">
            <ShieldCheck size={12} className="text-blue-900" /> 
            Verified credentials
          </span>
          <span className="inline-flex items-center gap-1">
            <Timer size={12} className="text-blue-900" /> 
            Instant delivery
          </span>
        </div>
      </div>
    </section>
  );
}