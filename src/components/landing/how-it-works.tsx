"use client";

import { motion } from "framer-motion";
import { CreditCard, Search, ShieldCheck, ShoppingCart, Timer } from "lucide-react";
import { FadeIn } from "./fade-in";

const steps = [
  { icon: Search, label: "Explore", title: "Choose your platform", copy: "Browse available listings for Instagram, YouTube, TikTok, Facebook, and more." },
  { icon: ShieldCheck, label: "Review", title: "Check the details", copy: "See the platform, verification status, seller-set price, and availability before purchase." },
  { icon: CreditCard, label: "Purchase", title: "Pay securely", copy: "Complete your checkout through our secure payment flow in Nigerian naira." },
  { icon: Timer, label: "Receive", title: "Get instant access", copy: "Your credentials are delivered to your account after successful payment." },
];

export function HowItWorks() {
  return <section id="how-it-works" className="bg-[#f6f9fd] px-5 py-24 lg:px-8 lg:py-36"><div className="mx-auto max-w-7xl"><div className="grid gap-14 lg:grid-cols-[.7fr_1.3fr] lg:items-end"><FadeIn><p className="text-[10px] font-bold uppercase tracking-[.18em] text-blue-600">From browse to delivered</p><h2 className="mt-4 text-4xl font-extrabold leading-[1.02] tracking-[-.07em] text-[#0a2342] sm:text-5xl">Simple by design.<br /><span className="font-serif font-semibold italic text-blue-600">Clear at every step.</span></h2></FadeIn><FadeIn delay={.1}><p className="max-w-md text-sm leading-7 text-slate-500 lg:justify-self-end">No confusing handoffs or hidden steps. Find what fits, pay safely, and receive your account quickly.</p></FadeIn></div><div className="relative mt-16 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">{steps.map(({ icon: Icon, label, title, copy }, index) => <FadeIn key={title} delay={index * .1}><motion.div whileHover={{ y: -6 }} className="relative"><div className="mb-6 flex items-center justify-between"><span className="grid h-14 w-14 place-items-center rounded-2xl bg-[#0a2342] text-white shadow-lg shadow-[#0a2342]/15"><Icon size={23} /></span><span className="font-mono text-[10px] font-bold text-blue-600">0{index + 1}</span></div><p className="text-[10px] font-bold uppercase tracking-[.15em] text-slate-400">{label}</p><h3 className="mt-2 text-lg font-extrabold tracking-[-.04em] text-[#0a2342]">{title}</h3><p className="mt-3 text-xs leading-6 text-slate-500">{copy}</p>{index < steps.length - 1 && <div className="absolute right-[-24px] top-7 hidden h-px w-12 bg-blue-200 lg:block" />}</motion.div></FadeIn>)}</div><div className="mt-14 flex flex-wrap items-center gap-6 border-t border-slate-200 pt-6 text-xs font-bold text-slate-500"><span className="inline-flex items-center gap-2"><ShoppingCart size={15} className="text-blue-600" /> Marketplace-first buying</span><span className="inline-flex items-center gap-2"><ShieldCheck size={15} className="text-blue-600" /> Protected purchase</span></div></div></section>;
}
