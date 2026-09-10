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
  return <section id="testimonials" className="bg-white px-5 py-24 lg:px-8 lg:py-36"><div className="mx-auto max-w-7xl"><FadeIn className="mx-auto max-w-2xl text-center"><p className="text-[10px] font-bold uppercase tracking-[.18em] text-blue-600">Real buyers, real experiences</p><h2 className="mt-4 text-4xl font-extrabold tracking-[-.07em] text-[#0a2342] sm:text-5xl">A marketplace people<br /><span className="font-serif font-semibold italic text-blue-600">come back to.</span></h2></FadeIn><div className="mt-14 grid gap-5 lg:grid-cols-3">{testimonials.map((testimonial, index) => <FadeIn key={testimonial.name} delay={index * .1}><motion.figure whileHover={{ y: -7 }} className="flex h-full flex-col justify-between rounded-2xl border border-slate-200 bg-[#f8fbff] p-6 transition-shadow hover:shadow-xl hover:shadow-blue-900/10 sm:p-8"><div><div className="flex items-center justify-between"><div className="flex gap-1 text-amber-400">{Array.from({ length: 5 }).map((_, star) => <Star key={star} size={14} fill="currentColor" />)}</div><Quote size={25} className="text-blue-200" /></div><blockquote className="mt-8 text-base font-semibold leading-7 tracking-[-.02em] text-[#0a2342]">“{testimonial.quote}”</blockquote></div><figcaption className="mt-9 flex items-center gap-3 border-t border-slate-200 pt-5"><span className="grid h-10 w-10 place-items-center rounded-full bg-blue-100 text-xs font-extrabold text-blue-700">{testimonial.initials}</span><span><strong className="block text-xs font-extrabold text-[#0a2342]">{testimonial.name}</strong><small className="mt-1 block text-[10px] text-slate-500">{testimonial.role}</small></span></figcaption></motion.figure></FadeIn>)}</div></div></section>;
}
