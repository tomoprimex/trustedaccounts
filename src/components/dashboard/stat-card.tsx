"use client";

import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  change?: string;
  changeType?: "positive" | "negative";
  icon: LucideIcon;
  delay?: number;
}

export function StatCard({ title, value, change, changeType = "positive", icon: Icon, delay = 0 }: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: [0.4, 0, 0.2, 1] }}
      whileHover={{ y: -4, scale: 1.02 }}
      className="bg-white rounded-2xl p-4 sm:p-6 shadow-lg shadow-slate-200/50 border border-slate-100 hover:shadow-xl hover:shadow-slate-200/70 transition-all duration-300"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <p className="text-xs sm:text-sm font-medium text-slate-500 mb-1 sm:mb-2 truncate">{title}</p>
          <h3 className="text-xl sm:text-3xl font-bold text-[#1E3A8A] truncate">{value}</h3>
          {change && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: delay + 0.2 }}
              className={`text-xs sm:text-sm mt-1 sm:mt-2 font-medium ${
                changeType === "positive" ? "text-emerald-600" : "text-red-600"
              }`}
            >
              {change}
            </motion.p>
          )}
        </div>
        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-[#1E3A8A] to-[#1E40AF] flex items-center justify-center shadow-lg shadow-[#1E3A8A]/20 shrink-0">
          <Icon size={18} className="text-white sm:hidden" />
          <Icon size={24} className="text-white hidden sm:block" />
        </div>
      </div>
    </motion.div>
  );
}
