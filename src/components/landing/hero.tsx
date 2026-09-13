"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Check, ChevronRight, Clock3, LockKeyhole, ShieldCheck, ShoppingBag, Zap, Sparkles, Mail, Lock, Loader2 } from "lucide-react";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

const platforms = ["Instagram", "YouTube", "TikTok", "Facebook", "Twitter", "LinkedIn"];

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-slate-50 to-blue-50 pt-24 lg:pt-36">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(30,58,138,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(30,58,138,0.03)_1px,transparent_1px)] bg-[size:72px_72px]" />
      <div className="absolute -right-40 top-16 h-[520px] w-[520px] rounded-full bg-blue-900/20 blur-3xl" />
      <div className="absolute -left-48 bottom-0 h-[420px] w-[420px] rounded-full bg-indigo-900/20 blur-3xl" />
      <div className="relative mx-auto max-w-7xl px-5 pb-20 lg:px-8 lg:pb-28">
        <div className="grid items-center gap-14 lg:grid-cols-[.92fr_1.08fr]">
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
            
            {/* Mobile Login Form */}
            <div className="lg:hidden mt-6">
              <LoginForm compact={true} />
            </div>
            
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
          
          {/* Desktop Login Form */}
          <div className="hidden lg:block">
            <LoginForm compact={false} />
          </div>
        </div>
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

function LoginForm({ compact = false }: { compact?: boolean }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const supabase = createClient();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      if (data.user) {
        router.push("/dashboard");
        router.refresh();
      }
    } catch (err: any) {
      setError(err.message || "Failed to sign in");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, x: 35, rotate: !compact ? 2 : 0 }} 
      animate={{ opacity: 1, x: 0, rotate: !compact ? 2 : 0 }} 
      transition={{ duration: .8, delay: .15 }} 
      className="relative mx-auto w-full max-w-[560px]"
    >
      <div className="absolute -inset-5 rounded-[2rem] bg-blue-900/25 blur-2xl" />
      <div className={`relative rounded-[1.5rem] border border-white/90 bg-white/70 shadow-[0_30px_80px_rgba(30,58,138,.18)] backdrop-blur-2xl ${!compact ? 'p-4 sm:p-6' : 'p-3 sm:p-4'}`}>
        <div className={`border-b border-slate-200/80 ${!compact ? 'pb-5' : 'pb-3'}`}>
          <p className="text-[10px] font-bold uppercase tracking-[.16em] text-blue-900">Sign in</p>
          <h2 className={`mt-1 font-extrabold tracking-[-.05em] text-slate-900 ${!compact ? 'text-xl' : 'text-lg'}`}>Welcome back</h2>
        </div>
        <form onSubmit={handleLogin} className={`space-y-4 ${!compact ? 'mt-5' : 'mt-3'}`}>
          {error && (
            <div className="p-2 rounded-lg bg-red-50 border border-red-200">
              <p className="text-[10px] text-red-600">{error}</p>
            </div>
          )}
          <div>
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Email</label>
            <div className={`mt-1.5 relative ${!compact ? '' : 'mt-1'}`}>
              <Mail size={!compact ? 14 : 12} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
                className={`w-full rounded-xl border border-slate-200 bg-white/75 text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-900/20 focus:border-blue-900 ${!compact ? 'pl-9 pr-3 py-2.5' : 'pl-8 pr-2.5 py-2'}`}
              />
            </div>
          </div>
          <div>
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Password</label>
            <div className={`mt-1.5 relative ${!compact ? '' : 'mt-1'}`}>
              <Lock size={!compact ? 14 : 12} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className={`w-full rounded-xl border border-slate-200 bg-white/75 text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-900/20 focus:border-blue-900 ${!compact ? 'pl-9 pr-3 py-2.5' : 'pl-8 pr-2.5 py-2'}`}
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={loading}
            className={`w-full rounded-xl bg-gradient-to-r from-blue-900 to-indigo-900 text-xs font-extrabold text-white shadow-lg shadow-blue-900/20 transition hover:from-blue-800 hover:to-indigo-800 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 ${!compact ? 'mt-2 px-4 py-3' : 'mt-1.5 px-3 py-2.5'}`}
          >
            {loading ? (
              <>
                <Loader2 size={14} className="animate-spin" />
                Signing in...
              </>
            ) : (
              "Sign In"
            )}
          </button>
        </form>
        <div className={`text-center ${!compact ? 'mt-4' : 'mt-3'}`}>
          <p className="text-[10px] text-slate-500">
            Don't have an account?{" "}
            <Link href="/signup" className="font-bold text-blue-900 hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </div>
      {!compact && (
        <>
          <motion.div 
            animate={{ y: [0, -8, 0] }} 
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }} 
            className="absolute -left-4 top-10 hidden items-center gap-2 rounded-lg border border-white bg-white/85 px-3 py-2 text-[10px] font-extrabold text-slate-900 shadow-xl backdrop-blur lg:flex"
          >
            <Clock3 size={14} className="text-blue-900" /> 
            Quick access
          </motion.div>
          <motion.div 
            animate={{ y: [0, 7, 0] }} 
            transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: .7 }} 
            className="absolute -right-3 bottom-10 hidden items-center gap-2 rounded-lg border border-white bg-white/85 px-3 py-2 text-[10px] font-extrabold text-slate-900 shadow-xl backdrop-blur lg:flex"
          >
            <ShieldCheck size={14} className="text-blue-900" /> 
            Secure login
          </motion.div>
        </>
      )}
    </motion.div>
  );
}