"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Check, ChevronRight, Clock3, LockKeyhole, ShieldCheck, ShoppingBag, Zap, Sparkles } from "lucide-react";

const platforms = ["Instagram", "YouTube", "TikTok", "Facebook", "Twitter", "LinkedIn"];

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-slate-50 to-blue-50 pt-24 lg:pt-36">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(30,58,138,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(30,58,138,0.03)_1px,transparent_1px)] bg-[size:72px_72px]" />
      <div className="absolute -right-40 top-16 h-[520px] w-[520px] rounded-full bg-blue-900/20 blur-3xl" />
      <div className="absolute -left-48 bottom-0 h-[420px] w-[420px] rounded-full bg-indigo-900/20 blur-3xl" />
      <div className="relative mx-auto grid max-w-7xl items-center gap-14 px-5 pb-20 lg:grid-cols-[.92fr_1.08fr] lg:px-8 lg:pb-28">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .65 }}>
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-200 bg-white/70 px-3 py-2 text-[10px] font-bold uppercase tracking-[.12em] text-blue-900 shadow-sm backdrop-blur">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-blue-900" /> 
            The verified account marketplace
          </div>
          <h1 className="max-w-2xl text-[clamp(3rem,6vw,5.7rem)] font-extrabold leading-[.95] tracking-[-.085em] bg-gradient-to-r from-blue-900 to-indigo-900 bg-clip-text text-transparent">
            The right account.<br />
            <span className="font-serif font-semibold italic text-blue-900">Right when you need it.</span>
          </h1>
          <p className="mt-7 max-w-xl text-base leading-8 text-slate-600 sm:text-lg">
            Browse fully verified social media accounts from trusted sellers. Pay securely, get instant delivery, and move forward with confidence.
          </p>
          <div className="mt-8 flex flex-col items-start gap-4 sm:flex-row sm:items-center">
            <Link href="/signup" className="group inline-flex items-center gap-8 rounded-xl bg-gradient-to-r from-blue-900 to-indigo-900 px-5 py-4 text-sm font-extrabold text-white shadow-xl shadow-blue-900/20 transition hover:-translate-y-1 hover:from-blue-800 hover:to-indigo-800">
              Browse available accounts 
              <ArrowRight size={17} className="transition-transform group-hover:translate-x-1" />
            </Link>
            <a href="#how-it-works" className="inline-flex items-center gap-2 text-sm font-bold text-blue-900">
              How it works 
              <ChevronRight size={16} />
            </a>
          </div>
          <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3 text-xs font-bold text-slate-500">
            <span className="inline-flex items-center gap-2">
              <ShieldCheck size={16} className="text-blue-900" /> 
              Verified listings
            </span>
            <span className="inline-flex items-center gap-2">
              <Zap size={16} className="text-blue-900" /> 
              Instant delivery
            </span>
            <span className="inline-flex items-center gap-2">
              <LockKeyhole size={16} className="text-blue-900" /> 
              Secure checkout
            </span>
          </div>
        </motion.div>
        <HeroMarketplaceCard />
      </div>
      <div className="relative border-y border-slate-200/80 bg-white/55">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-x-7 gap-y-3 px-5 py-5 lg:px-8">
          <span className="mr-2 text-[10px] font-bold uppercase tracking-[.12em] text-slate-400">Find your platform</span>
          {platforms.map((platform, index) => (
            <span key={platform} className="inline-flex items-center gap-2 text-xs font-extrabold text-slate-500">
              <i className="text-base not-italic text-blue-900">{["◎", "▶", "♪", "f", "𝕏", "in"][index]}</i>
              {platform}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

function HeroMarketplaceCard() {
  return (
    <motion.div 
      initial={{ opacity: 0, x: 35, rotate: 2 }} 
      animate={{ opacity: 1, x: 0, rotate: 2 }} 
      transition={{ duration: .8, delay: .15 }} 
      className="relative mx-auto w-full max-w-[560px] lg:mr-0"
    >
      <div className="absolute -inset-5 rounded-[2rem] bg-blue-900/25 blur-2xl" />
      <div className="relative rounded-[1.5rem] border border-white/90 bg-white/70 p-4 shadow-[0_30px_80px_rgba(30,58,138,.18)] backdrop-blur-2xl sm:p-6">
        <div className="flex items-center justify-between border-b border-slate-200/80 pb-5">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[.16em] text-blue-900">Featured listing</p>
            <h2 className="mt-1 text-xl font-extrabold tracking-[-.05em] text-slate-900">Creator starter pack</h2>
          </div>
          <span className="rounded-full bg-blue-50 px-3 py-1.5 text-[10px] font-bold text-blue-900">Available</span>
        </div>
        <div className="mt-5 grid grid-cols-[auto_1fr_auto] items-center gap-3 rounded-xl border border-slate-200 bg-white/75 p-3">
          <div className="grid h-11 w-11 place-items-center rounded-xl bg-gradient-to-br from-blue-900 to-indigo-900 text-white">
            <ShieldCheck size={22} />
          </div>
          <div>
            <p className="text-sm font-extrabold text-slate-900">Instagram Pro</p>
            <p className="mt-1 text-[10px] text-slate-500">Verified email · Phone ready</p>
          </div>
          <Check size={18} className="text-blue-900" />
        </div>
        <div className="mt-3 grid grid-cols-[auto_1fr_auto] items-center gap-3 rounded-xl border border-slate-200 bg-white/75 p-3">
          <div className="grid h-11 w-11 place-items-center rounded-xl bg-gradient-to-br from-indigo-900 to-blue-900 text-white">
            <Zap size={22} />
          </div>
          <div>
            <p className="text-sm font-extrabold text-slate-900">YouTube Brand</p>
            <p className="mt-1 text-[10px] text-slate-500">Verified email · Ready to use</p>
          </div>
          <Check size={18} className="text-blue-900" />
        </div>
        <div className="mt-6 flex items-end justify-between border-t border-slate-200/80 pt-5">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Bundle price</p>
            <p className="mt-1 text-2xl font-extrabold tracking-[-.06em] text-slate-900">₦24,900</p>
          </div>
          <Link href="/signup" className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-blue-900 to-indigo-900 px-4 py-3 text-xs font-extrabold text-white shadow-lg shadow-blue-900/20 transition hover:from-blue-800 hover:to-indigo-800">
            <ShoppingBag size={15} /> 
            View listing
          </Link>
        </div>
      </div>
      <motion.div 
        animate={{ y: [0, -8, 0] }} 
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }} 
        className="absolute -left-4 top-10 hidden items-center gap-2 rounded-lg border border-white bg-white/85 px-3 py-2 text-[10px] font-extrabold text-slate-900 shadow-xl backdrop-blur sm:flex"
      >
        <Clock3 size={14} className="text-blue-900" /> 
        Delivered in minutes
      </motion.div>
      <motion.div 
        animate={{ y: [0, 7, 0] }} 
        transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: .7 }} 
        className="absolute -right-3 bottom-10 hidden items-center gap-2 rounded-lg border border-white bg-white/85 px-3 py-2 text-[10px] font-extrabold text-slate-900 shadow-xl backdrop-blur sm:flex"
      >
        <ShieldCheck size={14} className="text-blue-900" /> 
        Protected purchase
      </motion.div>
    </motion.div>
  );
}
