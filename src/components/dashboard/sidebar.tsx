"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { ChevronRight, LayoutDashboard, LogOut, Menu, Package, Settings, Store, Users, X, ShoppingBag, Wallet, Eye, EyeOff } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { getWalletBalance } from "@/lib/supabase/queries";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard", id: "dashboard" },
  { icon: Store, label: "Marketplace", href: "/marketplace", id: "marketplace" },
  { icon: Package, label: "My Accounts", href: "/dashboard/accounts", id: "accounts" },
  { icon: ShoppingBag, label: "Orders", href: "/dashboard/orders", id: "orders" },
  { icon: Wallet, label: "Wallet", href: "/dashboard/wallet", id: "wallet" },
  { icon: Settings, label: "Settings", href: "/dashboard/settings", id: "settings" },
];

export function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [walletBalance, setWalletBalance] = useState(0);
  const [balanceHidden, setBalanceHidden] = useState(true);
  const active = navItems.find((item) => pathname === item.href)?.id ?? "dashboard";
  const logout = async () => { await createClient().auth.signOut(); window.location.href = "/login"; };

  useEffect(() => {
    async function loadWalletBalance() {
      try {
        const { data: { user } } = await createClient().auth.getUser();
        if (user) {
          const wallet = await getWalletBalance(user.id);
          setWalletBalance(wallet.balance_cents);
        }
      } catch (error) {
        console.error('Error loading wallet balance:', error);
      }
    }
    loadWalletBalance();
  }, []);

  return <>
    <button type="button" aria-label="Open dashboard navigation" onClick={() => setMobileOpen(true)} className="fixed left-3 top-3 z-50 grid h-10 w-10 place-items-center rounded-xl bg-[#1e65f3] text-white shadow-lg lg:hidden"><Menu size={19} /></button>
    <AnimatePresence>
      {mobileOpen && (
        <>
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setMobileOpen(false)} 
            className="fixed inset-0 z-40 bg-[#061a32]/55 backdrop-blur-sm lg:hidden" 
          />
          <motion.aside 
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            className="fixed left-0 top-0 z-50 h-full w-[min(86vw,320px)] overflow-hidden bg-[#0a2342] text-white shadow-2xl lg:hidden dark:bg-[#0a1929]"
          >
            <div className="flex h-full flex-col">
              <div className="border-b border-white/10 px-4 py-4 sm:px-5 relative">
                <Link href="/dashboard" className="flex items-center gap-3" onClick={() => setMobileOpen(false)}>
                  <div className="h-10 w-10 shrink-0 rounded-xl bg-white flex items-center justify-center overflow-hidden">
                    <img src="/logo.png" alt="TrustedAccounts" className="h-8 w-8 object-contain" />
                  </div>
                  <span>
                    <strong className="block text-base tracking-tight font-extrabold text-white">TrustedAccounts</strong>
                    <small className="block text-[10px] text-white/70 font-medium">Customer workspace</small>
                  </span>
                </Link>
                {/* Wallet Balance */}
                <div className="flex items-center justify-between px-2 py-2">
                  <div className="flex items-center gap-2">
                    <Wallet size={14} className="text-white/70" />
                    <span className="text-[10px] text-white/70 font-medium">Balance:</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-white">
                      {balanceHidden ? '••••••' : `₦${(walletBalance / 100).toLocaleString()}`}
                    </span>
                    <button
                      onClick={() => setBalanceHidden(!balanceHidden)}
                      className="text-white/50 hover:text-white/80 transition-colors"
                    >
                      {balanceHidden ? <Eye size={12} /> : <EyeOff size={12} />}
                    </button>
                  </div>
                </div>
                <button 
                  type="button" 
                  aria-label="Close dashboard navigation" 
                  onClick={() => setMobileOpen(false)} 
                  className="absolute right-4 top-4 rounded-lg bg-white/10 p-2 hover:bg-white/20 transition-colors"
                >
                  <X size={18} />
                </button>
              </div>
              <nav className="flex-1 space-y-1 overflow-y-auto p-3 sm:p-4">
                {navItems.map((item) => (
                  <Link key={item.id} href={item.href} onClick={() => setMobileOpen(false)}>
                    <motion.span
                      whileHover={{ x: 3 }}
                      className={`relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-xs font-extrabold transition ${active === item.id ? "bg-white/15 text-white" : "text-white/75 hover:bg-white/10 hover:text-white"}`}
                    >
                      <item.icon size={17} className="shrink-0" />
                      {item.label}
                      {active === item.id && <i className="absolute right-3 h-1.5 w-1.5 rounded-full bg-[#1e65f3]" />}
                    </motion.span>
                  </Link>
                ))}
              </nav>
              <div className="space-y-2 border-t border-white/10 p-3 sm:p-4">
                <div className="flex items-center justify-center">
                  <ThemeToggle />
                </div>
                <button
                  type="button"
                  onClick={logout}
                  className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-xs font-bold text-white/65 hover:bg-red-500/20 hover:text-red-200"
                >
                  <LogOut size={17} />
                  Logout
                </button>
              </div>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
    <motion.aside 
      initial={false} 
      animate={{ width: collapsed ? 80 : 280 }} 
      className="hidden lg:flex fixed left-0 top-0 z-30 h-full bg-[#0a2342] text-white shadow-2xl dark:bg-[#0a1929]"
    >
      <div className="flex h-full flex-col">
        <div className="border-b border-white/10 px-4 py-4 sm:px-5">
          <Link href="/dashboard" className="flex items-center gap-3">
            <div className="h-10 w-10 shrink-0 rounded-xl bg-white flex items-center justify-center overflow-hidden">
              <img src="/logo.png" alt="TrustedAccounts" className="h-8 w-8 object-contain" />
            </div>
            {!collapsed && <span>
              <strong className="block text-base tracking-tight font-extrabold text-white">TrustedAccounts</strong>
              <small className="block text-[10px] text-white/70 font-medium">Customer workspace</small>
            </span>}
          </Link>
          {/* Wallet Balance */}
          {!collapsed && (
            <div className="flex items-center justify-between px-2 py-2">
              <div className="flex items-center gap-2">
                <Wallet size={14} className="text-white/70" />
                <span className="text-[10px] text-white/70 font-medium">Balance:</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold text-white">
                  {balanceHidden ? '••••••' : `₦${(walletBalance / 100).toLocaleString()}`}
                </span>
                <button
                  onClick={() => setBalanceHidden(!balanceHidden)}
                  className="text-white/50 hover:text-white/80 transition-colors"
                >
                  {balanceHidden ? <Eye size={12} /> : <EyeOff size={12} />}
                </button>
              </div>
            </div>
          )}
        </div>
        <nav className="flex-1 space-y-1 overflow-y-auto p-3 sm:p-4">
          {navItems.map((item) => (
            <Link key={item.id} href={item.href}>
              <motion.span
                whileHover={{ x: collapsed ? 0 : 3 }}
                className={`relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-xs font-extrabold transition ${active === item.id ? "bg-white/15 text-white" : "text-white/75 hover:bg-white/10 hover:text-white"}`}
              >
                <item.icon size={17} className="shrink-0" />
                {!collapsed && item.label}
                {active === item.id && !collapsed && <i className="absolute right-3 h-1.5 w-1.5 rounded-full bg-[#1e65f3]" />}
              </motion.span>
            </Link>
          ))}
        </nav>
        <div className="space-y-2 border-t border-white/10 p-3 sm:p-4">
          <button
            type="button"
            onClick={() => setCollapsed(!collapsed)}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-white/10 px-3 py-2.5 text-xs font-bold text-white/70 hover:bg-white/20"
          >
            <ChevronRight size={16} className={collapsed ? "rotate-180" : ""} />
            {!collapsed && "Collapse"}
          </button>
          <div className="flex items-center justify-center">
            <ThemeToggle />
          </div>
          <button
            type="button"
            onClick={logout}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-xs font-bold text-white/65 hover:bg-red-500/20 hover:text-red-200"
          >
            <LogOut size={17} />
            {!collapsed && "Logout"}
          </button>
        </div>
      </div>
    </motion.aside>
  </>;
}
