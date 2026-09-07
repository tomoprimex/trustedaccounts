"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { 
  LayoutDashboard, 
  ShoppingCart, 
  Key, 
  Users, 
  Settings, 
  LogOut,
  Menu,
  X,
  ChevronRight
} from "lucide-react";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard", id: "dashboard" },
  { icon: ShoppingCart, label: "Marketplace", href: "/marketplace", id: "marketplace" },
  { icon: Key, label: "My Accounts", href: "/dashboard/accounts", id: "accounts" },
  { icon: ShoppingCart, label: "Orders", href: "/dashboard/orders", id: "orders" },
  { icon: Settings, label: "Settings", href: "/dashboard/settings", id: "settings" },
];

export function Sidebar() {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const activeItem = navItems.find(item => pathname === item.href)?.id || "dashboard";

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    window.location.href = "/login";
  };

  return (
    <>
      {/* Mobile menu button - always visible on mobile */}
      <button
        onClick={() => setIsMobileOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 p-3 rounded-xl bg-[#1E3A8A] text-white shadow-lg"
      >
        <Menu size={24} />
      </button>

      {/* Mobile overlay */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsMobileOpen(false)}
            className="lg:hidden fixed inset-0 bg-black/60 z-40 backdrop-blur-sm"
          />
        )}
      </AnimatePresence>

      {/* Sidebar - full width on mobile, collapsible on desktop */}
      <motion.aside
        initial={false}
        animate={{ 
          width: isMobile ? (isMobileOpen ? "100%" : "0") : (isCollapsed ? "80px" : "280px"),
          x: isMobile ? (isMobileOpen ? 0 : -320) : 0
        }}
        transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
        className={`fixed left-0 top-0 h-full bg-gradient-to-b from-[#1E3A8A] to-[#0F2744] text-white z-50 shadow-2xl overflow-hidden ${
          isMobile ? "w-full" : ""
        }`}
      >
        {/* Logo */}
        <div className="p-4 sm:p-6 border-b border-white/10">
          <Link href="/dashboard" className="flex items-center gap-3" onClick={() => isMobile && setIsMobileOpen(false)}>
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-white/20 flex items-center justify-center backdrop-blur-sm shrink-0">
              <Key size={20} className="text-white" />
            </div>
            <AnimatePresence mode="wait">
              {(!isCollapsed || isMobile) && (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  <h1 className="text-lg sm:text-xl font-bold">TrustedAccounts</h1>
                  <p className="text-xs text-white/60">Dashboard</p>
                </motion.div>
              )}
            </AnimatePresence>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="p-3 sm:p-4 space-y-1 sm:space-y-2 flex-1 overflow-y-auto">
          {navItems.map((item) => (
            <Link key={item.id} href={item.href}>
              <motion.div
                onClick={() => isMobile && setIsMobileOpen(false)}
                whileHover={{ x: isMobile ? 0 : 4 }}
                whileTap={{ scale: 0.98 }}
                className={`w-full flex items-center gap-3 px-4 py-3 sm:py-3 rounded-xl transition-all relative overflow-hidden group cursor-pointer ${
                  activeItem === item.id
                    ? "bg-white/20 text-white shadow-lg"
                    : "text-white/70 hover:bg-white/10 hover:text-white"
                }`}
              >
                <item.icon size={20} className="shrink-0" />
                <AnimatePresence mode="wait">
                  {(!isCollapsed || isMobile) && (
                    <motion.span
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      transition={{ duration: 0.2 }}
                      className="font-medium text-sm sm:text-base"
                    >
                      {item.label}
                    </motion.span>
                  )}
                </AnimatePresence>
                {activeItem === item.id && !isMobile && (
                  <motion.div
                    layoutId="activeIndicator"
                    className="absolute right-2 w-1.5 h-1.5 rounded-full bg-white"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
              </motion.div>
            </Link>
          ))}
        </nav>

        {/* Bottom actions */}
        <div className="p-3 sm:p-4 border-t border-white/10 space-y-2">
          {/* Collapse toggle - desktop only */}
          {!isMobile && (
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-white/10 hover:bg-white/20 transition-colors"
            >
              <motion.div
                animate={{ rotate: isCollapsed ? 180 : 0 }}
                transition={{ duration: 0.3 }}
              >
                <ChevronRight size={18} />
              </motion.div>
              <AnimatePresence mode="wait">
                {!isCollapsed && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-sm text-white/70"
                  >
                    Collapse
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
          )}

          {/* Logout */}
          <motion.button
            whileHover={{ x: isMobile ? 0 : 4 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-white/70 hover:bg-red-500/20 hover:text-red-300 transition-colors"
          >
            <LogOut size={20} className="shrink-0" />
            <AnimatePresence mode="wait">
              {(!isCollapsed || isMobile) && (
                <motion.span
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.2 }}
                  className="font-medium text-sm sm:text-base"
                >
                  Logout
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
        </div>

        {/* Mobile close button */}
        {isMobile && (
          <button
            onClick={() => setIsMobileOpen(false)}
            className="absolute top-4 right-4 p-2 rounded-lg bg-white/10 hover:bg-white/20"
          >
            <X size={24} />
          </button>
        )}
      </motion.aside>
    </>
  );
}
