import Link from "next/link";
import { Mail, ShieldCheck } from "lucide-react";

const columns = [
  { title: "Marketplace", links: [{ label: "Browse accounts", href: "/signup" }, { label: "How it works", href: "#how-it-works" }, { label: "Why trust us", href: "#features" }] },
  { title: "Support", links: [{ label: "Order status", href: "/dashboard/orders" }, { label: "Contact support", href: "mailto:support@trustedaccounts.com" }, { label: "Sign in", href: "/login" }] },
  { title: "Company", links: [{ label: "About us", href: "#" }, { label: "Privacy policy", href: "#" }, { label: "Terms of service", href: "#" }] },
];

export function Footer() {
  return <footer className="bg-[#061a32] px-5 py-14 text-white lg:px-8 lg:py-20"><div className="mx-auto max-w-7xl"><div className="grid gap-12 lg:grid-cols-[1.4fr_1fr] lg:gap-24"><div><Link href="/" className="inline-flex items-center gap-2.5"><span className="grid h-9 w-9 place-items-center rounded-xl bg-white text-[#0a2342]"><ShieldCheck size={19} /></span><span className="text-lg font-extrabold tracking-[-.06em]">Trusted<span className="text-blue-300">Accounts</span></span></Link><p className="mt-6 max-w-sm text-sm leading-7 text-blue-100/55">A clearer way to find verified social media accounts with secure checkout, instant delivery, and support you can reach.</p><a href="mailto:support@trustedaccounts.com" className="mt-6 inline-flex items-center gap-2 text-xs font-bold text-blue-200 hover:text-white"><Mail size={15} /> support@trustedaccounts.com</a></div><div className="grid grid-cols-3 gap-6">{columns.map((column) => <div key={column.title}><h3 className="text-xs font-extrabold text-white">{column.title}</h3><ul className="mt-5 space-y-3">{column.links.map((link) => <li key={link.label}><Link href={link.href} className="text-xs text-blue-100/55 transition hover:text-white">{link.label}</Link></li>)}</ul></div>)}</div></div><div className="mt-14 flex flex-col gap-4 border-t border-blue-100/10 pt-6 text-[10px] text-blue-100/40 sm:flex-row sm:items-center sm:justify-between"><span>© {new Date().getFullYear()} TrustedAccounts. All rights reserved.</span><span>Verified listings · Secure payments · Human support</span></div></div></footer>;
}
