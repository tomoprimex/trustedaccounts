"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { FadeIn } from "./fade-in";
import Link from "next/link";
import { Check, ArrowRight, Shield, Zap, Headphones, RefreshCw } from "lucide-react";

const features = [
  {
    icon: Shield,
    title: "Verified Accounts",
    description: "Every account is fully verified and tested before listing",
  },
  {
    icon: Zap,
    title: "Instant Delivery",
    description: "Credentials delivered immediately after payment",
  },
  {
    icon: Headphones,
    title: "24/7 Support",
    description: "Round-the-clock assistance for any issues",
  },
  {
    icon: RefreshCw,
    title: "Replacement Guarantee",
    description: "Free replacement if account doesn't work as expected",
  },
];

export function Pricing() {
  return (
    <section id="pricing" className="relative py-24 lg:py-32 bg-white">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <FadeIn className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-slate-900">
            Browse available
            <span className="block bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mt-2">
              verified accounts
            </span>
          </h2>
          <p className="mt-6 text-lg sm:text-xl text-slate-600 leading-relaxed max-w-2xl mx-auto">
            Each account is individually priced by sellers. Browse our marketplace to find verified logins for your preferred platforms.
          </p>
        </FadeIn>

        <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-4 max-w-5xl mx-auto mb-16">
          {features.map((feature, i) => (
            <FadeIn key={feature.title} delay={i * 0.1}>
              <motion.div
                whileHover={{ y: -4 }}
                transition={{ duration: 0.3 }}
                className="text-center p-6 rounded-2xl bg-slate-50 border border-slate-100 hover:border-blue-200 hover:shadow-lg hover:shadow-blue-500/10 transition-all"
              >
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 mb-4">
                  <feature.icon className="w-6 h-6 text-blue-600" strokeWidth={1.5} />
                </div>
                <h3 className="font-semibold text-slate-900 mb-2">{feature.title}</h3>
                <p className="text-sm text-slate-600">{feature.description}</p>
              </motion.div>
            </FadeIn>
          ))}
        </div>

        <FadeIn delay={0.3}>
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="max-w-2xl mx-auto"
          >
            <Link href="/signup">
              <Button
                size="lg"
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 rounded-full px-8 py-6 text-base font-semibold shadow-xl shadow-blue-500/25 hover:shadow-blue-500/40 transition-all"
              >
                Browse Available Accounts
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <p className="mt-4 text-center text-sm text-slate-500">
              Prices are set by individual sellers in Nigerian Naira (₦)
            </p>
          </motion.div>
        </FadeIn>
      </div>
    </section>
  );
}