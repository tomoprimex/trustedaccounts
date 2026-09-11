import Link from "next/link";
import { Mail, ShieldCheck } from "lucide-react";

const columns = [
  { title: "Marketplace", links: [{ label: "Browse accounts", href: "/signup" }, { label: "How it works", href: "#how-it-works" }, { label: "Why trust us", href: "#features" }] },
  { title: "Support", links: [{ label: "Order status", href: "/dashboard/orders" }, { label: "Contact support", href: "mailto:support@trustedaccounts.com" }, { label: "Sign in", href: "/login" }] },
  { title: "Company", links: [{ label: "About us", href: "#" }, { label: "Privacy policy", href: "#" }, { label: "Terms of service", href: "#" }] },
];

export function Footer() {
  return (
    <footer className="bg-gradient-to-br from-blue-900 to-indigo-900 px-4 py-10 text-white lg:px-6 lg:py-12">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-8 lg:grid-cols-[1.4fr_1fr] lg:gap-16">
          <div>
            <Link href="/" className="inline-flex items-center gap-2">
              <span className="grid h-8 w-8 place-items-center rounded-xl bg-white text-blue-900">
                <ShieldCheck size={16} />
              </span>
              <span className="text-sm font-extrabold tracking-[-.06em]">
                Trusted<span className="text-blue-300">Accounts</span>
              </span>
            </Link>
            <p className="mt-4 max-w-sm text-xs leading-6 text-blue-100/55">
              A clearer way to find verified social media accounts with secure checkout, instant delivery, and support you can reach.
            </p>
            <a href="mailto:support@trustedaccounts.com" className="mt-4 inline-flex items-center gap-1 text-[10px] font-bold text-blue-200 hover:text-white">
              <Mail size={12} /> 
              support@trustedaccounts.com
            </a>
          </div>
          <div className="grid grid-cols-3 gap-4">
            {columns.map((column) => (
              <div key={column.title}>
                <h3 className="text-[10px] font-extrabold text-white">{column.title}</h3>
                <ul className="mt-3 space-y-2">
                  {column.links.map((link) => (
                    <li key={link.label}>
                      <Link href={link.href} className="text-[10px] text-blue-100/55 transition hover:text-white">
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-8 flex flex-col gap-3 border-t border-blue-100/10 pt-4 text-[9px] text-blue-100/40 sm:flex-row sm:items-center sm:justify-between">
          <span>© {new Date().getFullYear()} TrustedAccounts. All rights reserved.</span>
          <span>Verified listings · Secure payments · Human support</span>
        </div>
      </div>
    </footer>
  );
}