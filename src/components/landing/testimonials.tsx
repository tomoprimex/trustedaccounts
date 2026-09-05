"use client";

import { FadeIn } from "./fade-in";

const testimonials = [
  {
    quote:
      "Needed multiple social media accounts for my marketing agency. The bundle deal was perfect and delivery was instant. Highly recommend!",
    name: "Alex M.",
    context: "Marketing Agency Owner",
  },
  {
    quote:
      "The accounts are exactly as described - fully verified and working. Customer support helped me set everything up quickly.",
    name: "Sarah K.",
    context: "Content Creator",
  },
  {
    quote:
      "Best prices I've found anywhere. The replacement guarantee gave me peace of mind. Will definitely be ordering again.",
    name: "James T.",
    context: "Digital Marketer",
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
    <section className="bg-white py-24">
      <div className="mx-auto max-w-6xl px-6 lg:px-8">
        <FadeIn className="max-w-xl">
          <h2 className="text-3xl font-semibold tracking-tight text-[#1E3A8A] sm:text-4xl">
            What our customers say
          </h2>
        </FadeIn>

        <div className="mt-14 grid gap-6 lg:grid-cols-3">
          {testimonials.map((t, i) => (
            <FadeIn key={t.name} delay={i * 0.1}>
              <figure className="flex h-full flex-col justify-between rounded-2xl border border-slate-200 bg-white p-7 shadow-[0_1px_2px_rgba(15,31,61,0.04)]">
                <blockquote className="text-[15px] leading-relaxed text-slate-700">
                  "{t.quote}"
                </blockquote>
                <figcaption className="mt-6 border-t border-slate-100 pt-4">
                  <div className="text-sm font-semibold text-[#1E3A8A]">{t.name}</div>
                  <div className="text-sm text-slate-500">{t.context}</div>
                </figcaption>
              </figure>
            </FadeIn>
          ))}
        </div>

        <FadeIn delay={0.2}>
          <div className="mt-16 flex flex-wrap items-center justify-center gap-x-10 gap-y-4 rounded-2xl bg-[#F5F6F8] px-8 py-8">
            {trustPoints.map((point) => (
              <div key={point.label} className="flex items-center gap-2.5 text-sm font-medium text-[#1E3A8A]">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                  <path d="M3 8.5l3 3 7-7" stroke="#1E3A8A" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                {point.label}
              </div>
            ))}
          </div>
        </FadeIn>
      </div>
    </section>
  );
}