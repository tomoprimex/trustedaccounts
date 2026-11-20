"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Globe, Users, Settings, LogOut, Menu, X, Clock, Wallet, Store } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { ThemeToggle } from "@/components/theme-toggle";

const navigation = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "Websites", href: "/admin/websites", icon: Globe },
  { name: "Users", href: "/admin/users", icon: Users },
  { name: "Orders", href: "/admin/orders", icon: Clock },
  { name: "Deposits", href: "/admin/deposits", icon: Wallet },
  { name: "Settings", href: "/admin/settings", icon: Settings },
];

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  const activeItem = navigation.find((item) => item.href === pathname);

  const logout = async () => {
    await createClient().auth.signOut();
    window.location.href = "/login";
  };

  return (
    <div className="min-h-screen bg-canvas">
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 z-40 bg-ink-950/60 backdrop-blur-sm lg:hidden"
          />
        )}
      </AnimatePresence>

      <aside
        className={`fixed left-0 top-0 z-50 h-full w-[min(86vw,288px)] bg-[#0a2342] text-white transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
            <Link href="/admin" className="flex items-center gap-3">
              <span className="grid h-10 w-10 place-items-center overflow-hidden rounded-xl bg-glass">
                <img src="/logo.png" alt="" className="h-8 w-8 object-contain" />
              </span>
              <span>
                <strong className="block text-base font-extrabold tracking-tight">TrustedAccounts</strong>
                <small className="block text-[11px] font-medium text-white/60">Admin console</small>
              </span>
            </Link>
            <button onClick={() => setSidebarOpen(false)} className="rounded-lg p-1.5 text-white/70 hover:bg-glass/10 lg:hidden" aria-label="Close menu">
              <X size={20} />
            </button>
          </div>

          <nav className="flex-1 overflow-y-auto px-3 py-5" aria-label="Admin">
            <ul className="space-y-1">
              {navigation.map((item) => {
                const isActive = pathname === item.href;
                const Icon = item.icon;
                return (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      onClick={() => setSidebarOpen(false)}
                      aria-current={isActive ? "page" : undefined}
                      className={`relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-bold transition-colors ${
                        isActive ? "bg-glass/10 text-white" : "text-white/65 hover:bg-glass/10 hover:text-white"
                      }`}
                    >
                      {isActive && (
                        <motion.span
                          layoutId="admin-active-rail"
                          className="absolute left-0 top-2 h-[calc(100%-16px)] w-[3px] rounded-full bg-blue-400"
                        />
                      )}
                      <Icon size={18} strokeWidth={1.75} />
                      {item.name}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="space-y-1 border-t border-white/10 px-3 py-4">
            <Link href="/marketplace" className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-bold text-white/65 hover:bg-glass/10 hover:text-white">
              <Store size={18} strokeWidth={1.75} /> View marketplace
            </Link>
            <button
              onClick={logout}
              className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-bold text-white/65 transition-colors hover:bg-glass/10 hover:text-white"
            >
              <LogOut size={18} strokeWidth={1.75} /> Log out
            </button>
          </div>
        </div>
      </aside>

      <div className="flex min-h-screen flex-col lg:ml-72">
        <header className="sticky top-0 z-30 border-b border-slate-200 bg-canvas/85 px-3 py-3 backdrop-blur-xl sm:px-5">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSidebarOpen(true)}
                className="grid h-9 w-9 place-items-center rounded-xl border border-slate-200 bg-white text-slate-700 lg:hidden"
                aria-label="Open menu"
              >
                <Menu size={18} />
              </button>
              <h1 className="text-base font-extrabold tracking-tight text-slate-900">{activeItem?.name ?? "Admin"}</h1>
            </div>
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <span className="grid h-9 w-9 place-items-center rounded-xl bg-blue-100 text-xs font-bold text-blue-700">A</span>
            </div>
          </div>
        </header>

        <main className="flex-1 px-3 py-5 sm:px-5 sm:py-7">{children}</main>
      </div>
    </div>
  );
}
