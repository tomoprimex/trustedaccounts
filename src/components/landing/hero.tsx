"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
};

const item = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.21, 0.47, 0.32, 0.98] as const } },
};

export function Hero() {
  return (
    <section id="top" className="relative overflow-hidden bg-white">
      <div className="mx-auto grid max-w-6xl items-center gap-8 sm:gap-12 lg:gap-16 px-4 sm:px-6 py-12 sm:py-16 lg:py-20 lg:px-8 lg:grid-cols-[1.05fr_1fr]">
        <motion.div initial="hidden" animate="visible" variants={container}>
          <motion.p
            variants={item}
            className="mb-4 text-xs sm:text-sm font-medium text-[#1E3A8A]/70"
          >
            Premium logins for all major platforms
          </motion.p>

          <motion.h1
            variants={item}
            className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold leading-[1.1] sm:leading-[1.1] tracking-tight text-[#1E3A8A]"
          >
            Get verified logins for Facebook, YouTube, Instagram, TikTok & more
          </motion.h1>

          <motion.p
            variants={item}
            className="mt-4 sm:mt-6 max-w-lg text-sm sm:text-base lg:text-lg leading-relaxed text-slate-600"
          >
            Access premium, verified accounts for all your favorite social media platforms. Fast delivery, secure transactions, and 24/7 support.
          </motion.p>

          <motion.div variants={item} className="mt-6 sm:mt-9 flex flex-wrap items-center gap-3 sm:gap-4">
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
              <Link href="/signup">
                <Button
                  size="lg"
                  className="rounded-full bg-[#1E3A8A] px-5 sm:px-7 text-sm sm:text-base text-white hover:bg-[#1E40AF]"
                >
                  Browse Available Logins
                </Button>
              </Link>
            </motion.div>
            <Link
              href="#pricing"
              className="text-sm sm:text-base font-medium text-[#1E3A8A] underline decoration-slate-300 underline-offset-4 transition-colors hover:decoration-[#1E3A8A]"
            >
              View Pricing
            </Link>
          </motion.div>

          <motion.div variants={item} className="mt-6 sm:mt-10 flex flex-wrap items-center gap-4 sm:gap-6 text-xs sm:text-sm text-slate-500">
            <div className="flex items-center gap-2">
              <svg width="14" height="14" className="sm:w-4 sm:h-4" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path d="M8 1.5l1.9 3.85 4.25.62-3.08 3 .73 4.24L8 11.3l-3.8 1.99.73-4.24-3.08-3 4.25-.62L8 1.5z" fill="#1E3A8A" />
              </svg>
              10,000+ satisfied customers
            </div>
            <div className="flex items-center gap-2">
              <svg width="14" height="14" className="sm:w-4 sm:h-4" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path d="M8 1.5L2 4v4.2c0 3.6 2.5 6.4 6 7.3 3.5-.9 6-3.7 6-7.3V4L8 1.5z" stroke="#1E3A8A" strokeWidth="1.3" />
              </svg>
              Instant delivery available
            </div>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.3, ease: [0.21, 0.47, 0.32, 0.98] as const }}
          className="relative mx-auto w-full max-w-md order-first lg:order-last"
        >
          <HeroIllustration />
        </motion.div>
      </div>
    </section>
  );
}

function HeroIllustration() {
  return (
    <svg viewBox="0 0 420 420" className="w-full" role="img" aria-label="Illustration of an account being restored">
      <defs>
        <linearGradient id="navyFade" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#F5F6F8" />
          <stop offset="100%" stopColor="#EAEDF2" />
        </linearGradient>
      </defs>

      <circle cx="210" cy="210" r="190" fill="url(#navyFade)" />

      {/* orbiting restore path */}
      <circle cx="210" cy="210" r="130" fill="none" stroke="#C7D0DE" strokeWidth="1.5" strokeDasharray="4 8" />

      {/* back card */}
      <rect x="120" y="150" width="150" height="100" rx="12" fill="#DCE3EE" transform="rotate(-6 195 200)" />

      {/* front card: account panel */}
      <rect x="140" y="165" width="150" height="100" rx="12" fill="#FFFFFF" stroke="#D7DEE9" strokeWidth="1" />
      <circle cx="165" cy="192" r="10" fill="#1E3A8A" />
      <rect x="184" y="186" width="70" height="7" rx="3.5" fill="#1E3A8A" opacity="0.85" />
      <rect x="184" y="198" width="50" height="6" rx="3" fill="#AEB8C8" />
      <rect x="155" y="222" width="115" height="6" rx="3" fill="#E3E7EE" />
      <rect x="155" y="234" width="90" height="6" rx="3" fill="#E3E7EE" />

      {/* restore badge */}
      <circle cx="278" cy="268" r="30" fill="#1E3A8A" />
      <path
        d="M266 268l8 8 14-16"
        stroke="#FFFFFF"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />

      {/* small key motif */}
      <g transform="translate(120 290)">
        <circle cx="10" cy="10" r="9" fill="none" stroke="#1E3A8A" strokeWidth="2.4" />
        <path d="M18 16l16 16M30 28l6-6M36 34l6-6" stroke="#1E3A8A" strokeWidth="2.4" strokeLinecap="round" />
      </g>
    </svg>
  );
}