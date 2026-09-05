"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { FadeIn } from "./fade-in";
import Link from "next/link"

const plans = [
  {
    name: "Starter",
    price: "$15",
    unit: "per account",
    description: "Perfect for personal use on a single platform.",
    features: [
      "1 verified login",
      "Platform of your choice",
      "Instant delivery",
      "24/7 support",
    ],
    highlighted: false,
  },
  {
    name: "Bundle",
    price: "$49",
    unit: "per bundle",
    description: "Get logins for multiple platforms at a discounted rate.",
    features: [
      "5 verified logins",
      "Mix & match platforms",
      "Priority delivery",
      "Replacement guarantee",
    ],
    highlighted: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    unit: "contact us",
    description: "For agencies and bulk buyers needing large quantities.",
    features: [
      "Bulk pricing available",
      "Custom platform selection",
      "Dedicated account manager",
      "API access",
    ],
    highlighted: false,
  },
];

export function Pricing() {
  return (
    <section id="pricing" className="bg-[#F5F6F8] py-24">
      <div className="mx-auto max-w-6xl px-6 lg:px-8">
        <FadeIn className="max-w-xl">
          <h2 className="text-3xl font-semibold tracking-tight text-[#1E3A8A] sm:text-4xl">
            Simple, transparent pricing
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-slate-600">
            Choose the plan that fits your needs. All accounts are verified and come with full support.
          </p>
        </FadeIn>

        <div className="mt-14 grid gap-6 lg:grid-cols-3">
          {plans.map((plan, i) => (
            <FadeIn key={plan.name} delay={i * 0.1}>
              <motion.div
                whileHover={{ y: -4 }}
                transition={{ duration: 0.2 }}
                className={`flex h-full flex-col rounded-2xl p-7 ${
                  plan.highlighted
                    ? "border-2 border-[#1E3A8A] bg-white shadow-[0_16px_40px_rgba(15,31,61,0.12)]"
                    : "border border-slate-200 bg-white shadow-[0_1px_2px_rgba(15,31,61,0.04)]"
                }`}
              >
                {plan.highlighted && (
                  <span className="mb-4 w-fit rounded-full bg-[#1E3A8A] px-3 py-1 text-xs font-semibold text-white">
                    Most chosen
                  </span>
                )}
                <h3 className="text-lg font-semibold text-[#1E3A8A]">{plan.name}</h3>
                <p className="mt-1 text-sm text-slate-500">{plan.description}</p>
                <div className="mt-6 flex items-baseline gap-2">
                  <span className="text-3xl font-semibold text-[#1E3A8A]">{plan.price}</span>
                  <span className="text-sm text-slate-500">{plan.unit}</span>
                </div>

                <ul className="mt-6 flex-1 space-y-3">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2.5 text-sm text-slate-600">
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="mt-0.5 shrink-0" aria-hidden="true">
                        <path d="M3 8.5l3 3 7-7" stroke="#1E3A8A" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>

                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="mt-8">
                  <Link href="/signup">
                    <Button
                      className={`w-full rounded-full ${
                        plan.highlighted
                          ? "bg-[#1E3A8A] text-white hover:bg-[#1E40AF]"
                          : "bg-white text-[#1E3A8A] border border-slate-300 hover:bg-slate-50"
                      }`}
                    >
                      Buy Now
                    </Button>
                  </Link>
                </motion.div>
              </motion.div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}