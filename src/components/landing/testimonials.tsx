"use client";

import { motion } from "framer-motion";
import { Quote, Star } from "lucide-react";
import { FadeIn } from "./fade-in";

const testimonials = [
  { quote: "The account was exactly as described and arrived immediately after payment. The whole process felt straightforward.", name: "Alex M.", role: "Marketing agency owner", initials: "AM" },
  { quote: "I needed multiple platforms for a campaign and found everything in one place. Support was quick when I had a question.", name: "Sarah K.", role: "Content creator", initials: "SK" },
  { quote: "The replacement guarantee made the decision easy. Clear listing, fast delivery, no unnecessary back and forth.", name: "James T.", role: "Digital marketer", initials: "JT" },
];

export function Testimonials() {
  return (
    <section id="testimonials" className="bg-white px-4 py-12 lg:px-6 lg:py-16">
      <div className="mx-auto max-w-7xl">
        <FadeIn className="mx-auto max-w-2xl text-center">
          <p className="text-[10px] font-bold uppercase tracking-[.18em] text-blue-900">Real buyers, real experiences</p>
          <h2 className="mt-3 text-2xl font-extrabold tracking-[-.07em] bg-gradient-to-r from-blue-900 to-indigo-900 bg-clip-text text-transparent sm:text-3xl">
            A marketplace people<br />
            <span className="font-serif font-semibold italic text-blue-900">come back to.</span>
          </h2>
        </FadeIn>
        <div className="mt-8 grid gap-4 lg:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <FadeIn key={testimonial.name} delay={index * .1}>
              <motion.figure 
                whileHover={{ y: -5 }} 
                className="flex h-full flex-col justify-between rounded-xl border border-slate-200 bg-gradient-to-br from-blue-50 to-indigo-50 p-4 transition-shadow hover:shadow-lg hover:shadow-blue-900/10 sm:p-5"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <div className="flex gap-0.5 text-blue-900">
                      {Array.from({ length: 5 }).map((_, star) => <Star key={star} size={10} fill="currentColor" />)}
                    </div>
                    <Quote size={18} className="text-blue-200" />
                  </div>
                  <blockquote className="mt-4 text-sm font-semibold leading-6 tracking-[-.02em] text-slate-900">
                    "{testimonial.quote}"
                  </blockquote>
                </div>
                <figcaption className="mt-5 flex items-center gap-2 border-t border-slate-200 pt-3">
                  <span className="grid h-8 w-8 place-items-center rounded-full bg-blue-100 text-[10px] font-extrabold text-blue-900">
                    {testimonial.initials}
                  </span>
                  <span>
                    <strong className="block text-[10px] font-extrabold text-slate-900">{testimonial.name}</strong>
                    <small className="mt-0.5 block text-[9px] text-slate-500">{testimonial.role}</small>
                  </span>
                </figcaption>
              </motion.figure>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}