"use client";

import { motion } from "framer-motion";
import { FadeIn } from "./fade-in";
import { Shield, Globe, Zap, Headphones, Lock, RefreshCw } from "lucide-react";

const features = [
  {
    title: "Verified Accounts Only",
    description:
      "Every login we sell is fully verified and tested. You get working credentials that are ready to use immediately.",
    icon: Shield,
  },
  {
    title: "All Major Platforms",
    description:
      "Facebook, YouTube, Instagram, TikTok, Twitter, LinkedIn, and more. We have logins for every platform you need.",
    icon: Globe,
  },
  {
    title: "Instant Delivery",
    description:
      "Get your login credentials immediately after purchase. No waiting, no delays - start using your accounts right away.",
    icon: Zap,
  },
  {
    title: "24/7 Support",
    description:
      "Our support team is available around the clock to help with any issues or questions about your purchased accounts.",
    icon: Headphones,
  },
  {
    title: "Secure Transactions",
    description:
      "Your payments are protected with enterprise-grade encryption. We prioritize your security and privacy above all else.",
    icon: Lock,
  },
  {
    title: "Replacement Guarantee",
    description:
      "If any account doesn't work as expected, we'll replace it free of charge. Your satisfaction is our priority.",
    icon: RefreshCw,
  },
];

export function Features() {
  return (
    <section id="features" className="relative py-24 lg:py-32 bg-gradient-to-b from-white to-slate-50">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <FadeIn className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-slate-900">
            Everything you need for
            <span className="block bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mt-2">
              seamless account access
            </span>
          </h2>
          <p className="mt-6 text-lg sm:text-xl text-slate-600 leading-relaxed max-w-2xl mx-auto">
            Get premium, verified logins for all your favorite platforms with fast delivery, full support, and complete peace of mind.
          </p>
        </FadeIn>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, i) => (
            <FadeIn key={feature.title} delay={i * 0.1}>
              <motion.div
                whileHover={{ y: -8 }}
                transition={{ duration: 0.3 }}
                className="group h-full p-8 rounded-3xl bg-white border border-slate-200/50 shadow-sm hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300"
              >
                <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 group-hover:from-blue-100 group-hover:to-indigo-100 transition-colors duration-300">
                  <feature.icon className="h-7 w-7 text-blue-600" strokeWidth={1.5} />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-3">{feature.title}</h3>
                <p className="text-base leading-relaxed text-slate-600">
                  {feature.description}
                </p>
              </motion.div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}