import Link from "next/link";

const columns = [
  {
    heading: "Product",
    links: [
      { label: "Available accounts", href: "/signup" },
      { label: "Pricing", href: "#pricing" },
      { label: "Delivery", href: "#how-it-works" },
      { label: "FAQ", href: "#" },
    ],
  },
  {
    heading: "Company",
    links: [
      { label: "About", href: "#" },
      { label: "Careers", href: "#" },
      { label: "Press", href: "#" },
      { label: "Contact", href: "#" },
    ],
  },
  {
    heading: "Support",
    links: [
      { label: "Help center", href: "#" },
      { label: "Order status", href: "/dashboard/orders" },
      { label: "Live chat", href: "#" },
      { label: "Ticket support", href: "#" },
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
    <footer className="bg-white">
      <div className="mx-auto max-w-6xl px-6 py-16 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[1.2fr_2fr]">
          <div>
            <Link href="/" className="flex items-center gap-2">
              <svg width="24" height="24" viewBox="0 0 26 26" fill="none" aria-hidden="true">
                <circle cx="13" cy="13" r="12" stroke="#1E3A8A" strokeWidth="2" />
                <path d="M13 7v12M9 10l4-3 4 3M9 16c0 1.7 1.8 3 4 3s4-1.3 4-3" stroke="#1E3A8A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span className="text-lg font-semibold tracking-tight text-[#1E3A8A]">TrustedAccounts</span>
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-slate-500">
              Premium verified logins for all major social media platforms. Fast, secure, and reliable.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
            {columns.map((col) => (
              <div key={col.heading}>
                <h4 className="text-sm font-semibold text-[#1E3A8A]">{col.heading}</h4>
                <ul className="mt-4 space-y-3">
                  {col.links.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="text-sm text-slate-500 transition-colors hover:text-[#1E3A8A]"
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

        <div className="mt-14 flex flex-col-reverse items-center justify-between gap-4 border-t border-slate-100 pt-8 sm:flex-row">
          <p className="text-sm text-slate-400">
            {new Date().getFullYear()} TrustedAccounts. All rights reserved.
          </p>
          <div className="flex items-center gap-5">
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter / X" className="text-slate-400 transition-colors hover:text-[#1E3A8A]">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M18.9 3H22l-7.4 8.5L23.3 21H16.9l-5-6.4L6.1 21H3l7.9-9L2.9 3h6.5l4.5 5.9L18.9 3zm-1.1 16.2h1.7L7.3 4.7H5.5l12.3 14.5z" />
              </svg>
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="text-slate-400 transition-colors hover:text-[#1E3A8A]">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M4.98 3.5a2.5 2.5 0 11-.02 5 2.5 2.5 0 01.02-5zM3 9h4v12H3zM9 9h3.8v1.7h.05c.53-1 1.83-2 3.77-2 4 0 4.75 2.6 4.75 6V21h-4v-5.4c0-1.3 0-3-1.8-3s-2.1 1.4-2.1 2.9V21H9z" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}