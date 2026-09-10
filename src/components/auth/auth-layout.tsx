"use client";

import { ReactNode } from "react";
import { motion } from "framer-motion";
import { Key } from "lucide-react";
import Link from "next/link";

interface AuthLayoutProps { children: ReactNode; title: string; subtitle: string; showBackLink?: boolean; backLinkText?: string; backLinkHref?: string; }

export function AuthLayout({ children, title, subtitle, showBackLink = true, backLinkText = "Back to Home", backLinkHref = "/" }: AuthLayoutProps) {
  return <div className="auth-shell relative flex min-h-screen items-center justify-center overflow-hidden bg-[#f5f7fb] p-3 sm:p-6"><div className="absolute inset-0 bg-[linear-gradient(rgba(10,35,66,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(10,35,66,0.04)_1px,transparent_1px)] bg-[size:56px_56px]"><motion.div animate={{ scale: [1, 1.15, 1], rotate: [0, 90, 0] }} transition={{ duration: 22, repeat: Infinity, ease: "linear" }} className="absolute -right-1/2 -top-1/2 h-full w-full rounded-full bg-blue-200/25 blur-3xl" /><motion.div animate={{ scale: [1.15, 1, 1.15], rotate: [90, 0, 90] }} transition={{ duration: 26, repeat: Infinity, ease: "linear" }} className="absolute -bottom-1/2 -left-1/2 h-full w-full rounded-full bg-cyan-100/40 blur-3xl" /></div><motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="relative z-10 w-full max-w-[410px]"><div className="mb-5 flex justify-center sm:mb-6"><div className="grid h-14 w-14 place-items-center rounded-2xl bg-[#0a2342] text-white shadow-xl shadow-blue-900/15 sm:h-16 sm:w-16"><Key size={26} /></div></div><motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .1 }} className="rounded-2xl border border-slate-200 bg-white/90 p-4 shadow-2xl shadow-slate-300/30 backdrop-blur-xl sm:p-7"><div className="mb-6 text-center sm:mb-7"><h1 className="mb-2 text-2xl font-extrabold tracking-tight text-[#0a2342] sm:text-3xl">{title}</h1><p className="text-xs leading-6 text-slate-500 sm:text-sm">{subtitle}</p></div>{children}{showBackLink && <div className="mt-6 text-center"><Link href={backLinkHref} className="text-xs font-bold text-slate-500 transition hover:text-blue-600">{backLinkText}</Link></div>}</motion.div><p className="mt-5 text-center text-xs text-slate-400">TrustedAccounts</p></motion.div></div>;
}
