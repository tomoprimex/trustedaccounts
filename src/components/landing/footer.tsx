import Link from "next/link";
import { X, Mail, Shield, Zap, Headphones } from "lucide-react";

const columns = [
  {
    heading: "Product",
    links: [
      { label: "Available accounts", href: "/signup" },
      { label: "Pricing", href: "#pricing" },
      { label: "How it works", href: "#how-it-works" },
      { label: "Features", href: "#features" },
    ],
  },
  {
    heading: "Company",
    links: [
      { label: "About us", href: "#" },
      { label: "Careers", href: "#" },
      { label: "Contact", href: "#" },
      { label: "Blog", href: "#" },
    ],
  },
  {
    heading: "Support",
    links: [
      { label: "Help center", href: "#" },
      { label: "Order status", href: "/dashboard/orders" },
      { label: "Live chat", href: "#" },
      { label: "FAQ", href: "#" },
    ],
  },
  {
    heading: "Legal",
    links: [
      { label: "Privacy policy", href: "#" },
      { label: "Terms of service", href: "#" },
      { label: "Refund policy", href: "#" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="bg-slate-900 text-white">
      <div className="mx-auto max-w-7xl px-6 lg:px-8 py-16 lg:py-20">
        <div className="grid gap-12 lg:grid-cols-[1.5fr_2fr]">
          <div className="space-y-6">
            <Link href="/" className="flex items-center gap-3">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-lg blur opacity-20"></div>
                <div className="relative bg-gradient-to-br from-blue-600 to-indigo-700 rounded-lg p-2">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-white">
                    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </div>
              <span className="text-xl font-bold tracking-tight">TrustedAccounts</span>
            </Link>
            <p className="max-w-sm text-base leading-relaxed text-slate-400">
              Premium verified logins for all major social media platforms. Fast, secure, and reliable service you can trust.
            </p>
            <div className="flex gap-4">
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter / X" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:bg-blue-600 hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:bg-blue-600 hover:text-white transition-colors">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M4.98 3.5a2.5 2.5 0 11-.02 5 2.5 2.5 0 01.02-5zM3 9h4v12H3zM9 9h3.8v1.7h.05c.53-1 1.83-2 3.77-2 4 0 4.75 2.6 4.75 6V21h-4v-5.4c0-1.3 0-3-1.8-3s-2.1 1.4-2.1 2.9V21H9n" />
                </svg>
              </a>
              <a href="mailto:support@trustedaccounts.com" aria-label="Email" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:bg-blue-600 hover:text-white transition-colors">
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
            {columns.map((col) => (
              <div key={col.heading}>
                <h4 className="text-sm font-semibold text-white mb-4">{col.heading}</h4>
                <ul className="space-y-3">
                  {col.links.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="text-sm text-slate-400 transition-colors hover:text-white"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-slate-800">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
            <p className="text-sm text-slate-400">
              © {new Date().getFullYear()} TrustedAccounts. All rights reserved.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-slate-400">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-blue-400" />
                <span>Verified accounts</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-blue-400" />
                <span>Instant delivery</span>
              </div>
              <div className="flex items-center gap-2">
                <Headphones className="w-4 h-4 text-blue-400" />
                <span>24/7 support</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}