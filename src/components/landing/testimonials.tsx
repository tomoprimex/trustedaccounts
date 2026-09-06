"use client";

import { motion } from "framer-motion";
import { FadeIn } from "./fade-in";
import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    quote:
      "Needed multiple social media accounts for my marketing agency. The bundle deal was perfect and delivery was instant. Highly recommend!",
    name: "Alex M.",
    context: "Marketing Agency Owner",
    rating: 5,
  },
  {
    quote:
      "The accounts are exactly as described - fully verified and working. Customer support helped me set everything up quickly.",
    name: "Sarah K.",
    context: "Content Creator",
    rating: 5,
  },
  {
    quote:
      "Best prices I've found anywhere. The replacement guarantee gave me peace of mind. Will definitely be ordering again.",
    name: "James T.",
    context: "Digital Marketer",
    rating: 5,
  },
];

const trustPoints = [
  { label: "Verified accounts only" },
  { label: "Instant delivery" },
  { label: "24/7 customer support" },
  { label: "Replacement guarantee" },
];

export function Testimonials() {
  return (
    <section className="relative py-24 lg:py-32 bg-gradient-to-b from-slate-50 to-white">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <FadeIn className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-slate-900">
            Loved by thousands of
            <span className="block bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mt-2">
              satisfied customers
            </span>
          </h2>
        </FadeIn>

        <div className="mt-14 grid gap-8 lg:grid-cols-3">
          {testimonials.map((t, i) => (
            <FadeIn key={t.name} delay={i * 0.1}>
              <motion.div
                whileHover={{ y: -8 }}
                transition={{ duration: 0.3 }}
                className="flex h-full flex-col justify-between rounded-3xl border border-slate-200/50 bg-white p-8 shadow-sm hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300"
              >
                <div>
                  <div className="flex gap-1 mb-4">
                    {[...Array(t.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-amber-400 fill-amber-400" />
                    ))}
                  </div>
                  <blockquote className="text-base leading-relaxed text-slate-700">
                    "{t.quote}"
                  </blockquote>
                </div>
                <figcaption className="mt-6 pt-6 border-t border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center">
                      <span className="text-lg font-semibold text-blue-600">{t.name.charAt(0)}</span>
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-slate-900">{t.name}</div>
                      <div className="text-sm text-slate-500">{t.context}</div>
                    </div>
                  </div>
                </figcaption>
              </motion.div>
            </FadeIn>
          ))}
        </div>

        <FadeIn delay={0.2}>
          <div className="mt-16 flex flex-wrap items-center justify-center gap-x-8 gap-y-4 rounded-3xl bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 px-8 py-8 max-w-4xl mx-auto">
            {trustPoints.map((point) => (
              <div key={point.label} className="flex items-center gap-2.5 text-sm font-medium text-slate-700">
                <div className="w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center">
                  <svg width="10" height="10" viewBox="0 0 16 16" fill="none" className="text-white">
                    <path d="M3 8.5l3 3 7-7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                {point.label}
              </div>
            ))}
          </div>
        </FadeIn>
      </div>
    </section>
  );
}