"use client";

import { motion } from "framer-motion";
import { BadgeCheck, Headphones, LockKeyhole, RefreshCcw, ShieldCheck, Zap } from "lucide-react";
import { FadeIn } from "./fade-in";

const features = [
  { icon: ShieldCheck, number: "01", title: "Verified before listing", copy: "Every account is checked before it appears in the marketplace, so you know what you are buying." },
  { icon: Zap, number: "02", title: "Instant delivery", copy: "Once payment clears, your purchase is available in your dashboard without a waiting period." },
  { icon: LockKeyhole, number: "03", title: "Secure transactions", copy: "Checkout is handled through protected payment processing. Your credentials stay private." },
  { icon: RefreshCcw, number: "04", title: "Replacement guarantee", copy: "If an account does not work as described, our replacement promise has your back." },
  { icon: Headphones, number: "05", title: "Real human support", copy: "Questions after purchase? Our support team is available around the clock." },
  { icon: BadgeCheck, number: "06", title: "Clear seller details", copy: "See platform, price, availability, and verification status before you commit." },
];

export function Features() {
  return <section id="features" className="relative bg-white px-5 py-24 lg:px-8 lg:py-36"><div className="mx-auto max-w-7xl"><FadeIn className="max-w-2xl"><p className="text-[10px] font-bold uppercase tracking-[.18em] text-blue-600">Built around trust</p><h2 className="mt-4 text-4xl font-extrabold leading-[1.02] tracking-[-.07em] text-[#0a2342] sm:text-5xl">Everything important,<br /><span className="font-serif font-semibold italic text-blue-600">visible upfront.</span></h2><p className="mt-6 text-sm leading-7 text-slate-500 sm:text-base">A marketplace should make the important details easy to understand. TrustedAccounts keeps quality, price, and delivery clear from the first click.</p></FadeIn><div className="mt-14 grid gap-px overflow-hidden rounded-2xl border border-slate-200 bg-slate-200 sm:grid-cols-2 lg:grid-cols-3">{features.map(({ icon: Icon, number, title, copy }, index) => <FadeIn key={title} delay={index * .06}><motion.article whileHover={{ y: -5 }} className="group relative min-h-[230px] bg-white p-6 transition-shadow hover:z-10 hover:shadow-2xl sm:p-7"><div className="flex items-start justify-between"><span className="grid h-11 w-11 place-items-center rounded-xl bg-blue-50 text-blue-600 transition-colors group-hover:bg-[#0a2342] group-hover:text-white"><Icon size={21} /></span><span className="font-mono text-[10px] font-bold text-slate-300">{number}</span></div><h3 className="mt-9 text-lg font-extrabold tracking-[-.04em] text-[#0a2342]">{title}</h3><p className="mt-3 text-xs leading-6 text-slate-500">{copy}</p></motion.article></FadeIn>)}</div></div></section>;
}
