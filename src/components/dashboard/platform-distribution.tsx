"use client";

import { motion } from "framer-motion";
import { Monitor, Camera, Play, Video, MessageCircle } from "lucide-react";

const platforms = [
  { name: "Facebook", icon: Monitor, count: 245, percentage: 35, color: "bg-blue-600" },
  { name: "Instagram", icon: Camera, count: 198, percentage: 28, color: "bg-gradient-to-br from-purple-600 to-pink-600" },
  { name: "YouTube", icon: Play, count: 156, percentage: 22, color: "bg-red-600" },
  { name: "TikTok", icon: Video, count: 87, percentage: 12, color: "bg-black" },
  { name: "Twitter", icon: MessageCircle, count: 14, percentage: 3, color: "bg-sky-500" },
];

export function PlatformDistribution() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="bg-white rounded-2xl shadow-lg shadow-slate-200/50 border border-slate-100 p-4 sm:p-6"
    >
      <div className="mb-4 sm:mb-6">
        <h2 className="text-lg sm:text-xl font-bold text-[#1E3A8A]">Platform Distribution</h2>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">Accounts sold by platform</p>
      </div>

      <div className="space-y-3 sm:space-y-4">
        {platforms.map((platform, index) => {
          const Icon = platform.icon;
          return (
            <motion.div
              key={platform.name}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.5 + index * 0.1 }}
              className="group"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-xl ${platform.color} flex items-center justify-center shadow-lg shrink-0`}>
                    <Icon size={16} className="text-white sm:hidden" />
                    <Icon size={20} className="text-white hidden sm:block" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm sm:font-semibold text-slate-700 truncate">{platform.name}</p>
                    <p className="text-xs sm:text-sm text-slate-500">{platform.count} accounts</p>
                  </div>
                </div>
                <span className="text-base sm:text-lg font-bold text-[#1E3A8A] shrink-0">{platform.percentage}%</span>
              </div>
              <div className="h-1.5 sm:h-2 bg-slate-100 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${platform.percentage}%` }}
                  transition={{ duration: 1, delay: 0.6 + index * 0.1, ease: [0.4, 0, 0.2, 1] }}
                  className={`h-full ${platform.color} rounded-full`}
                />
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-slate-100">
        <div className="flex items-center justify-between">
          <span className="text-xs sm:text-sm text-slate-500">Total Accounts</span>
          <span className="text-lg sm:text-xl font-bold text-[#1E3A8A]">700</span>
        </div>
      </div>
    </motion.div>
  );
}
