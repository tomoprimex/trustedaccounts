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
    <header className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${scrolled ? "border-b border-slate-200/70 bg-white/85 shadow-[0_8px_30px_rgba(30,58,138,0.06)] backdrop-blur-xl" : "bg-transparent"}`}>
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 lg:px-6">
        <Link href="/" className="flex items-center gap-2" onClick={() => setOpen(false)}>
          <span className="grid h-8 w-8 place-items-center rounded-xl bg-gradient-to-br from-blue-900 to-indigo-900 text-white shadow-[4px_4px_0_#b9d5ff]">
            <ShieldCheck size={16} strokeWidth={2.5} />
          </span>
          <span className="text-[13px] font-extrabold tracking-[-0.06em] text-blue-900 sm:text-sm">
            Trusted<span className="text-blue-600">Accounts</span>
          </span>
        </Link>
        <div className="hidden items-center gap-6 md:flex">
          {links.map((link) => (
            <a key={link.href} href={link.href} className="text-[10px] font-bold text-slate-500 transition-colors hover:text-blue-900">
              {link.label}
            </a>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <Link href="/login" className="hidden text-[10px] font-bold text-slate-500 hover:text-blue-900 sm:block">
            Sign in
          </Link>
          <Link 
            href="/signup" 
            className="rounded-lg bg-gradient-to-r from-blue-900 to-indigo-900 px-3 py-2 text-[10px] font-extrabold text-white shadow-lg shadow-blue-900/15 transition hover:-translate-y-0.5 hover:from-blue-800 hover:to-indigo-800"
          >
            Browse accounts
          </Link>
          <button 
            type="button" 
            className="grid h-8 w-8 place-items-center text-blue-900 md:hidden" 
            aria-label={open ? "Close menu" : "Open menu"} 
            onClick={() => setOpen(!open)}
          >
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </nav>
      {open && (
        <motion.div 
          initial={{ opacity: 0, y: -8 }} 
          animate={{ opacity: 1, y: 0 }} 
          className="border-t border-slate-200/70 bg-white/95 px-4 py-4 backdrop-blur-xl md:hidden"
        >
          <div className="mx-auto flex max-w-7xl flex-col gap-4">
            {links.map((link) => (
              <a key={link.href} href={link.href} className="text-xs font-bold text-slate-600" onClick={() => setOpen(false)}>
                {link.label}
              </a>
            ))}
            <Link href="/login" className="text-xs font-bold text-slate-600" onClick={() => setOpen(false)}>
              Sign in
            </Link>
          </div>
        </motion.div>
      )}
    </header>
  );
}
