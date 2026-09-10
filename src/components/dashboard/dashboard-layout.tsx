"use client";

import { ReactNode } from "react";
import { Sidebar } from "./sidebar";
import { motion } from "framer-motion";

interface DashboardLayoutProps {
  children: ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-[#f5f7fb]">
      <Sidebar />
      
      <main className="lg:ml-[280px] transition-all duration-300">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
          className="min-h-screen px-3 pb-6 pt-16 sm:px-5 sm:pb-8 lg:px-7 lg:pt-7"
        >
          {children}
        </motion.div>
      </main>
    </div>
  );
}
