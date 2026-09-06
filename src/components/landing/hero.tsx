"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight, Shield, Zap, CheckCircle2 } from "lucide-react";

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.2 } },
};

const item = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.21, 0.47, 0.32, 0.98] as const } },
};

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden Pt-20">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-blue-50/30"></div>
      
      {/* Decorative elements */}
      <div className="absolute top-20 right-0 w-96 h-96 bg-gradient-to-br from-blue-400/10 to-indigo-400/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 left-0 w-96 h-96 bg-gradient-to-tr from-indigo-400/10 to-purple-400/10 rounded-full blur-3xl"></div>
      
      {/* Grid pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(15,23,42,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(15,23,42,0.02)_1px,transparent_1px)] bg-[size:64px_64px]"></div>

      <div className="relative mx-auto max-w-7xl px-6 lg:px-8 py-20 lg:py-32">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <motion.div initial="hidden" animate="visible" variants={container} className="text-center lg:text-left">
            <motion.div variants={item} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-100 mb-6">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
              </span>
              <span className="text-sm font-medium text-blue-700">Trusted by 10,000+ customers</span>
            </motion.div>

            <motion.h1
              variants={item}
              className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-slate-900 leading-[1.1] sm:leading-[1.15]"
            >
              Premium Verified
              <span className="block bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Social Media Accounts
              </span>
            </motion.h1>

            <motion.p
              variants={item}
              className="mt-6 text-lg sm:text-xl text-slate-600 leading-relaxed max-w-2xl mx-auto lg:mx-0"
            >
              Access verified, high-quality accounts for Facebook, YouTube, Instagram, TikTok & more. 
              Instant delivery, secure transactions, and 24/7 dedicated support.
            </motion.p>

            <motion.div variants={item} className="mt-10 flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="w-full sm:w-auto">
                <Link href="/signup">
                  <Button
                    size="lg"
                    className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 rounded-full px-8 py-6 text-base shadow-xl shadow-blue-500/25 hover:shadow-blue-500/40 transition-all"
                  >
                    Get Started Now
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              </motion.div>
              <Link
                href="#pricing"
                className="text-base font-semibold text-slate-700 hover:text-slate-900 flex items-center gap-2 group"
              >
                View pricing
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>

            <motion.div variants={item} className="mt-12 grid grid-cols-3 gap-6 max-w-lg mx-auto lg:mx-0">
              <div className="text-center lg:text-left">
                <div className="flex items-center justify-center lg:justify-start gap-2 mb-1">
                  <Shield className="h-5 w-5 text-blue-600" />
                  <span className="text-2xl font-bold text-slate-900">100%</span>
                </div>
                <p className="text-sm text-slate-600">Verified</p>
              </div>
              <div className="text-center lg:text-left">
                <div className="flex items-center justify-center lg:justify-start gap-2 mb-1">
                  <Zap className="h-5 w-5 text-blue-600" />
                  <span className="text-2xl font-bold text-slate-900">&lt;5min</span>
                </div>
                <p className="text-sm text-slate-600">Delivery</p>
              </div>
              <div className="text-center lg:text-left">
                <div className="flex items-center justify-center lg:justify-start gap-2 mb-1">
                  <CheckCircle2 className="h-5 w-5 text-blue-600" />
                  <span className="text-2xl font-bold text-slate-900">24/7</span>
                </div>
                <p className="text-sm text-slate-600">Support</p>
              </div>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="relative"
          >
            <HeroCard />
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function HeroCard() {
  return (
    <div className="relative">
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl blur-2xl opacity-20"></div>
      <div className="relative bg-white rounded-3xl shadow-2xl shadow-slate-200/50 border border-slate-200/50 p-8">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center">
            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <div>
            <h3 className="font-semibold text-slate-900">Account Verified</h3>
            <p className="text-sm text-slate-500">Premium quality guaranteed</p>
          </div>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl">
            <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="font-medium text-slate-900">Email Verified</p>
              <p className="text-sm text-slate-500">Confirmed & active</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl">
            <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="font-medium text-slate-900">Phone Verified</p>
              <p className="text-sm text-slate-500">2FA enabled</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl">
            <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="font-medium text-slate-900">Profile Complete</p>
              <p className="text-sm text-slate-500">Ready to use</p>
            </div>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Starting from</p>
              <p className="text-2xl font-bold text-slate-900">$15</p>
            </div>
            <Link href="/signup">
              <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 rounded-full">
                Browse Now
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}