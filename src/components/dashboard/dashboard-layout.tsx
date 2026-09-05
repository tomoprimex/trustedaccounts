"use client";

import { ReactNode } from "react";
import { Sidebar } from "./sidebar";
import { motion } from "framer-motion";

interface DashboardLayoutProps {
  children: ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <Sidebar />
      
      <main className="lg:ml-80 transition-all duration-300">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
          className="p-4 sm:p-6 lg:p-8 pt-20 lg:pt-8 min-h-screen"
        >
          {children}
        </motion.div>
      </main>
    </div>
  );
}
