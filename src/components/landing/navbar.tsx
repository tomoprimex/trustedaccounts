"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Menu, ShieldCheck, X } from "lucide-react";
import { motion } from "framer-motion";

const links = [
  { label: "Why TrustedAccounts", href: "#features" },
  { label: "How it works", href: "#how-it-works" },
  { label: "Customer stories", href: "#testimonials" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 16);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${scrolled ? "border-b border-slate-200/70 bg-white/85 shadow-[0_8px_30px_rgba(10,35,66,0.06)] backdrop-blur-xl" : "bg-transparent"}`}>
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 lg:px-8">
        <Link href="/" className="flex items-center gap-2.5" onClick={() => setOpen(false)}>
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-[#0a2342] text-white shadow-[4px_4px_0_#b9d5ff]"><ShieldCheck size={19} strokeWidth={2.5} /></span>
          <span className="text-[15px] font-extrabold tracking-[-0.06em] text-[#0a2342] sm:text-lg">Trusted<span className="text-[#2563eb]">Accounts</span></span>
        </Link>
        <div className="hidden items-center gap-8 md:flex">
          {links.map((link) => <a key={link.href} href={link.href} className="text-xs font-bold text-slate-500 transition-colors hover:text-[#0a2342]">{link.label}</a>)}
        </div>
        <div className="flex items-center gap-3">
          <Link href="/login" className="hidden text-xs font-bold text-slate-500 hover:text-[#0a2342] sm:block">Sign in</Link>
          <Link href="/signup" className="rounded-lg bg-[#0a2342] px-4 py-2.5 text-xs font-extrabold text-white shadow-lg shadow-[#0a2342]/15 transition hover:-translate-y-0.5 hover:bg-[#12365f]">Browse accounts</Link>
          <button type="button" className="grid h-9 w-9 place-items-center text-[#0a2342] md:hidden" aria-label={open ? "Close menu" : "Open menu"} onClick={() => setOpen(!open)}>{open ? <X size={20} /> : <Menu size={20} />}</button>
        </div>
      </nav>
      {open && <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="border-t border-slate-200/70 bg-white/95 px-5 py-5 backdrop-blur-xl md:hidden"><div className="mx-auto flex max-w-7xl flex-col gap-5">{links.map((link) => <a key={link.href} href={link.href} className="text-sm font-bold text-slate-600" onClick={() => setOpen(false)}>{link.label}</a>)}<Link href="/login" className="text-sm font-bold text-slate-600" onClick={() => setOpen(false)}>Sign in</Link></div></motion.div>}
    </header>
  );
}
