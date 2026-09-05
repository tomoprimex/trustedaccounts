"use client";

import { FadeIn } from "./fade-in";

const steps = [
  {
    number: "1",
    title: "Choose your platform",
    description:
      "Browse our available accounts and select the platform you need - Facebook, YouTube, Instagram, TikTok, and more.",
  },
  {
    number: "2",
    title: "Select your plan",
    description:
      "Pick a single account or save with a bundle. All accounts are verified and ready to use.",
  },
  {
    number: "3",
    title: "Complete purchase",
    description:
      "Secure payment processing with instant delivery. Your login credentials are sent immediately after payment.",
  },
  {
    number: "4",
    title: "Start using your account",
    description:
      "Log in and start using your new account right away. Our support team is available 24/7 if you need help.",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="bg-[#F5F6F8] py-24">
      <div className="mx-auto max-w-6xl px-6 lg:px-8">
        <FadeIn className="max-w-xl">
          <h2 className="text-3xl font-semibold tracking-tight text-[#1E3A8A] sm:text-4xl">
            Get your login in four simple steps
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-slate-600">
            From selection to delivery in minutes. Instant access to verified accounts.
          </p>
        </FadeIn>

        <div className="relative mt-16">
          <div
            className="absolute left-0 right-0 top-6 hidden h-px bg-slate-300 lg:block"
            aria-hidden="true"
          />
          <div className="grid gap-10 lg:grid-cols-4 lg:gap-8">
            {steps.map((step, i) => (
              <FadeIn key={step.number} delay={i * 0.12}>
                <div className="relative">
                  <div className="relative z-10 flex h-12 w-12 items-center justify-center rounded-full bg-[#1E3A8A] text-base font-semibold text-white">
                    {step.number}
                  </div>
                  <h3 className="mt-5 text-lg font-semibold text-[#1E3A8A]">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-[15px] leading-relaxed text-slate-600">
                    {step.description}
                  </p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}