"use client";

import { motion } from "framer-motion";
import { FadeIn } from "./fade-in";
import { Search, ShoppingCart, CreditCard, Rocket } from "lucide-react";

const steps = [
  {
    icon: Search,
    title: "Choose your platform",
    description:
      "Browse our available accounts and select the platform you need - Facebook, YouTube, Instagram, TikTok, and more.",
  },
  {
    icon: ShoppingCart,
    title: "Select your plan",
    description:
      "Pick a single account or save with a bundle. All accounts are verified and ready to use.",
  },
  {
    icon: CreditCard,
    title: "Complete purchase",
    description:
      "Secure payment processing with instant delivery. Your login credentials are sent immediately after payment.",
  },
  {
    icon: Rocket,
    title: "Start using your account",
    description:
      "Log in and start using your new account right away. Our support team is available 24/7 if you need help.",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="relative py-24 lg:py-32 bg-white">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <FadeIn className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-slate-900">
            Get your login in
            <span className="block bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mt-2">
              four simple steps
            </span>
          </h2>
          <p className="mt-6 text-lg sm:text-xl text-slate-600 leading-relaxed max-w-2xl mx-auto">
            From selection to delivery in minutes. Instant access to verified accounts.
          </p>
        </FadeIn>

        <div className="relative mt-16">
          <div className="grid gap-8 lg:grid-cols-4">
            {steps.map((step, i) => (
              <FadeIn key={step.title} delay={i * 0.1}>
                <motion.div
                  whileHover={{ y: -8 }}
                  transition={{ duration: 0.3 }}
                  className="relative group"
                >
                  <div className="flex flex-col items-center text-center">
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-indigo-400 rounded-2xl blur-xl opacity-20 group-hover:opacity-40 transition-opacity"></div>
                      <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 group-hover:from-blue-100 group-hover:to-indigo-100 transition-colors flex items-center justify-center border border-blue-100">
                        <step.icon className="w-8 h-8 text-blue-600" strokeWidth={1.5} />
                      </div>
                      <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold text-sm">
                        {i + 1}
                      </div>
                    </div>
                    <h3 className="mt-6 text-lg font-semibold text-slate-900">
                      {step.title}
                    </h3>
                    <p className="mt-3 text-base leading-relaxed text-slate-600">
                      {step.description}
                    </p>
                  </div>
                  
                  {/* Connector line for desktop */}
                  {i < steps.length - 1 && (
                    <div className="hidden lg:block absolute top-8 left-[60%] w-[80%] h-0.5 bg-gradient-to-r from-blue-200 to-indigo-200"></div>
                  )}
                </motion.div>
              </FadeIn>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}