"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Globe,
  Users,
  Settings,
  LogOut,
  Menu,
  X,
} from "lucide-react";

const navigation = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "Websites", href: "/admin/websites", icon: Globe },
  { name: "Users", href: "/admin/users", icon: Users },
  { name: "Settings", href: "/admin/settings", icon: Settings },
];

// Design tokens — kept local so the palette is easy to retune in one place.
const tokens = {
  ink: "#14161A",
  inkLine: "#2A2E35",
  paper: "#F6F5F1",
  line: "#E4E1D9",
  accent: "#3E6B5C",
  accentSoft: "#DCE8E3",
  text: "#14161A",
  textMuted: "#8A8D93",
};

const SIDEBAR_WIDTH = 288; // px, matches w-72

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  const activeItem = navigation.find((item) => item.href === pathname);

  return (
    <div
      className="min-h-screen"
      style={{
        background: tokens.paper,
        fontFamily: "'IBM Plex Sans', ui-sans-serif, system-ui, sans-serif",
      }}
    >
      {/*
        Mobile-only backdrop. `lg:hidden` fully removes it from the tree on
        desktop so it can never intercept clicks or affect layout there.
      */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 z-40 lg:hidden"
            style={{ background: "rgba(20,22,26,0.55)" }}
          />
        )}
      </AnimatePresence>

      {/*
        Sidebar is ALWAYS position:fixed (no lg:static swap) and its open/closed
        state is expressed purely with Tailwind's `translate-x-*` classes, not
        an animated inline style. That way `lg:translate-x-0` is free to win
        the cascade at desktop widths no matter what `sidebarOpen` is set to.
      */}
      <aside
        className={`fixed top-0 left-0 z-50 h-full w-72 transition-transform duration-300 ease-in-out
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0`}
        style={{ background: tokens.ink }}
      >
        <div className="flex flex-col h-full">
          {/* Wordmark */}
          <div
            className="flex items-center justify-between px-6 py-6"
            style={{ borderBottom: `1px solid ${tokens.inkLine}` }}
          >
            <div className="flex items-center gap-3">
              <div
                className="flex items-center justify-center w-8 h-8"
                style={{ background: tokens.accent, borderRadius: 4 }}
              >
                <span className="text-sm font-semibold" style={{ color: tokens.paper }}>
                  A
                </span>
              </div>
              <span className="text-lg font-medium tracking-tight" style={{ color: tokens.paper }}>
                Admin
              </span>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden"
              style={{ color: tokens.textMuted }}
              aria-label="Close menu"
            >
              <X size={20} />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-3 py-6">
            <ul className="space-y-1">
              {navigation.map((item) => {
                const isActive = pathname === item.href;
                const Icon = item.icon;

                return (
                  <li key={item.name} className="relative">
                    <Link
                      href={item.href}
                      onClick={() => setSidebarOpen(false)}
                      className="relative flex items-center gap-3 pl-4 pr-4 py-2.5 transition-colors duration-150"
                      style={{
                        color: isActive ? tokens.paper : tokens.textMuted,
                      }}
                    >
                      {isActive && (
                        <motion.div
                          layoutId="active-rail"
                          className="absolute left-0 top-0 h-full"
                          style={{ width: 3, background: tokens.accent }}
                          transition={{ type: "spring", damping: 30, stiffness: 300 }}
                        />
                      )}
                      <Icon size={18} strokeWidth={1.75} />
                      <span className="text-sm font-medium">{item.name}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Logout */}
          <div className="px-3 pb-6">
            <button
              className="flex items-center gap-3 w-full pl-4 pr-4 py-2.5 transition-colors duration-150 hover:text-white"
              style={{ color: tokens.textMuted }}
            >
              <LogOut size={18} strokeWidth={1.75} />
              <span className="text-sm font-medium">Log out</span>
            </button>
          </div>
        </div>
      </aside>

      {/*
        Content column. The `lg:ml-72` offset always matches a sidebar that is
        always physically present (fixed + translate-x-0) at that breakpoint,
        so there's no scenario where the margin exists but the sidebar doesn't
        (or vice versa) — that mismatch was what pushed content off to the
        bottom-right before.
      */}
      <div className="lg:ml-72 min-h-screen flex flex-col">
        {/* Top bar */}
        <header
          className="sticky top-0 z-30 px-6 py-4"
          style={{ background: tokens.paper, borderBottom: `1px solid ${tokens.line}` }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden"
                style={{ color: tokens.text }}
                aria-label="Open menu"
              >
                <Menu size={22} />
              </button>
              <h2 className="text-lg font-medium tracking-tight" style={{ color: tokens.text }}>
                {activeItem?.name ?? "Admin"}
              </h2>
            </div>

            <div className="flex items-center gap-3">
              <div
                className="flex items-center justify-center w-8 h-8 text-xs font-medium"
                style={{
                  background: tokens.accentSoft,
                  color: tokens.accent,
                  borderRadius: 4,
                  fontFamily: "'IBM Plex Mono', ui-monospace, monospace",
                }}
              >
                A
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 px-6 py-8">{children}</main>
      </div>
    </div>
  );
}