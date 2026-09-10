"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Sparkles, Shield, ShoppingCart, TrendingUp, ChevronRight, Menu, X } from "lucide-react";
import { useState } from "react";

export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const features = [
    {
      icon: Shield,
      title: "Verified Accounts",
      description: "All accounts are verified and tested",
    },
    {
      icon: ShoppingCart,
      title: "Instant Delivery",
      description: "Get credentials immediately after purchase",
    },
    {
      icon: TrendingUp,
      title: "Best Prices",
      description: "Competitive pricing on all platforms",
    },
  ];

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 font-sans text-slate-900">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-white/30">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-gradient-to-br from-blue-900 to-indigo-900 rounded-lg">
              <Sparkles size={12} className="text-white" />
            </div>
            <span className="text-sm font-bold bg-gradient-to-r from-blue-900 to-indigo-900 bg-clip-text text-transparent">
              TrustedAccounts
            </span>
          </div>
          
          <div className="hidden md:flex items-center gap-4">
            <Link href="/login" className="text-[10px] text-slate-600 hover:text-blue-900 transition-colors">
              Sign In
            </Link>
            <Link 
              href="/signup" 
              className="px-3 py-1.5 bg-gradient-to-r from-blue-900 to-indigo-900 text-white rounded-lg text-[10px] font-medium shadow-lg shadow-blue-900/20"
            >
              Get Started
            </Link>
          </div>

          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-1.5 bg-white/50 rounded-lg"
          >
            {mobileMenuOpen ? <X size={16} /> : <Menu size={16} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="md:hidden bg-white/90 backdrop-blur-xl border-t border-white/30 p-4 space-y-3"
          >
            <Link href="/login" className="block text-[10px] text-slate-600 hover:text-blue-900 transition-colors">
              Sign In
            </Link>
            <Link 
              href="/signup" 
              className="block px-3 py-1.5 bg-gradient-to-r from-blue-900 to-indigo-900 text-white rounded-lg text-[10px] font-medium text-center"
            >
              Get Started
            </Link>
          </motion.div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="pt-24 pb-12 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-blue-900/10 to-indigo-900/10 rounded-full mb-4">
              <Sparkles size={12} className="text-blue-900" />
              <span className="text-[10px] font-medium text-blue-900">Premium Verified Accounts</span>
            </div>
            
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-900 to-indigo-900 bg-clip-text text-transparent mb-4">
              Buy & Sell Verified Social Media Accounts
            </h1>
            
            <p className="text-sm text-slate-600 mb-6 max-w-lg mx-auto">
              Secure marketplace for buying and selling verified social media accounts with instant delivery and guaranteed quality.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link 
                href="/signup" 
                className="px-6 py-2.5 bg-gradient-to-r from-blue-900 to-indigo-900 text-white rounded-xl text-sm font-medium shadow-lg shadow-blue-900/20 hover:shadow-blue-900/30 transition-all"
              >
                Get Started Free
                <ChevronRight size={14} />
              </Link>
              <Link 
                href="/marketplace" 
                className="px-6 py-2.5 bg-white/80 backdrop-blur border border-white/30 rounded-xl text-sm font-medium text-slate-700 hover:bg-white transition-all"
              >
                Browse Marketplace
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-center mb-8"
          >
            <h2 className="text-xl font-bold text-slate-900 mb-2">Why Choose Us</h2>
            <p className="text-xs text-slate-500">Features that set us apart</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                className="relative"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-blue-900/10 to-indigo-900/10 rounded-xl blur-md" />
                <div className="relative bg-white/80 backdrop-blur-xl rounded-xl p-4 border border-white/30 shadow-sm">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-900 to-indigo-900 flex items-center justify-center mb-3">
                    <feature.icon size={16} className="text-white" />
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 mb-1">{feature.title}</h3>
                  <p className="text-[10px] text-slate-500">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="relative"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 to-indigo-900/20 rounded-2xl blur-xl" />
            <div className="relative bg-gradient-to-r from-blue-900 to-indigo-900 rounded-2xl p-6 border border-white/30 shadow-lg">
              <div className="text-center">
                <h2 className="text-lg font-bold text-white mb-2">Ready to Get Started?</h2>
                <p className="text-[10px] text-white/80 mb-4">Join thousands of satisfied customers today</p>
                <Link 
                  href="/signup" 
                  className="inline-flex items-center gap-2 px-6 py-2.5 bg-white text-blue-900 rounded-xl text-sm font-medium shadow-lg hover:bg-white/90 transition-all"
                >
                  Create Free Account
                  <ChevronRight size={14} />
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-6 px-4 border-t border-white/30">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-[10px] text-slate-500">
            © 2024 TrustedAccounts. All rights reserved.
          </p>
        </div>
      </footer>
    </main>
  );
}