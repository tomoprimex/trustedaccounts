"use client";

import { motion } from "framer-motion";
import { FadeIn } from "./fade-in";

const features = [
  {
    title: "Verified accounts only",
    description:
      "Every login we sell is fully verified and tested. You get working credentials that are ready to use immediately.",
    icon: (
      <path d="M12 12a4 4 0 100-8 4 4 0 000 8zM5 20c0-3.9 3.1-7 7-7s7 3.1 7 7" />
    ),
  },
  {
    title: "All major platforms",
    description:
      "Facebook, YouTube, Instagram, TikTok, Twitter, and more. We have logins for every platform you need.",
    icon: (
      <path d="M4 6h16v12H4zM4 6l8 7 8-7" />
    ),
  },
  {
    title: "Instant delivery",
    description:
      "Get your login credentials immediately after purchase. No waiting, no delays - start using your accounts right away.",
    icon: (
      <path d="M12 3l7 3v6c0 4.5-3 7.8-7 9-4-1.2-7-4.5-7-9V6l7-3zM9 12l2 2 4-4" />
    ),
  },
  {
    title: "24/7 support",
    description:
      "Our support team is available around the clock to help with any issues or questions about your purchased accounts.",
    icon: (
      <path d="M4 19V5a1 1 0 011-1h11l4 4v11a1 1 0 01-1 1H5a1 1 0 01-1-1zM8 12h8M8 16h5M8 8h4" />
    ),
  },
];

export function Features() {
  return (
    <section id="features" className="bg-white py-24">
      <div className="mx-auto max-w-6xl px-6 lg:px-8">
        <FadeIn className="max-w-xl">
          <h2 className="text-3xl font-semibold tracking-tight text-[#1E3A8A] sm:text-4xl">
            Why choose TrustedAccounts
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-slate-600">
            Get premium, verified logins for all your favorite platforms with fast delivery and full support.
          </p>
        </FadeIn>

        <div className="mt-14 grid gap-6 sm:grid-cols-2">
          {features.map((feature, i) => (
            <FadeIn key={feature.title} delay={i * 0.1}>
              <motion.div
                whileHover={{ y: -4 }}
                transition={{ duration: 0.2 }}
                className="group h-full rounded-2xl border border-slate-200 bg-white p-7 shadow-[0_1px_2px_rgba(15,31,61,0.04)] transition-shadow duration-200 hover:shadow-[0_12px_32px_rgba(15,31,61,0.08)]"
              >
                <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl bg-[#1E3A8A]/[0.06] transition-colors duration-200 group-hover:bg-[#1E3A8A]/[0.1]">
                  <svg
                    width="22"
                    height="22"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#1E3A8A"
                    strokeWidth="1.7"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    {feature.icon}
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-[#1E3A8A]">{feature.title}</h3>
                <p className="mt-2.5 text-[15px] leading-relaxed text-slate-600">
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