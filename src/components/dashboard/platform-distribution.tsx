"use client";

import { motion } from "framer-motion";
import { Monitor, Camera, Play, Video, MessageCircle } from "lucide-react";

interface PlatformData {
  platform: string;
  count: number;
  percentage: number;
}

interface PlatformDistributionProps {
  data: PlatformData[];
}

const platformIcons: Record<string, any> = {
  facebook: Monitor,
  instagram: Camera,
  youtube: Play,
  tiktok: Video,
  twitter: MessageCircle,
  linkedin: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M4.98 3.5a2.5 2.5 0 11-.02 5 2.5 2.5 0 01.02-5zM3 9h4v12H3zM9 9h3.8v1.7h.05c.53-1 1.83-2 3.77-2 4 0 4.75 2.6 4.75 6V21h-4v-5.4c0-1.3 0-3-1.8-3s-2.1 1.4-2.1 2.9V21H9n" />
    </svg>
  ),
};

const platformColors: Record<string, string> = {
  facebook: "bg-blue-600",
  instagram: "bg-gradient-to-br from-purple-600 to-pink-600",
  youtube: "bg-red-600",
  tiktok: "bg-black",
  twitter: "bg-sky-500",
  linkedin: "bg-blue-700",
};

export function PlatformDistribution({ data }: PlatformDistributionProps) {
  const platforms = data.map(item => ({
    name: item.platform.charAt(0).toUpperCase() + item.platform.slice(1),
    icon: platformIcons[item.platform] || Monitor,
    count: item.count,
    percentage: item.percentage,
    color: platformColors[item.platform] || "bg-slate-600",
  }));

  const total = platforms.reduce((sum, p) => sum + p.count, 0);
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="bg-white rounded-xl sm:rounded-2xl shadow-lg shadow-slate-200/50 border border-slate-100 p-3 sm:p-4 sm:p-6"
    >
      <div className="mb-3 sm:mb-4 sm:mb-6">
        <h2 className="text-base sm:text-lg sm:text-xl font-bold text-[#1E3A8A]">Platform Distribution</h2>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">Accounts sold by platform</p>
      </div>

      <div className="space-y-2 sm:space-y-3 sm:space-y-4">
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
              <div className="flex items-center justify-between mb-1 sm:mb-2">
                <div className="flex items-center gap-1.5 sm:gap-2 sm:gap-3">
                  <div className={`w-6 h-6 sm:w-8 sm:h-8 sm:w-10 sm:h-10 rounded-xl ${platform.color} flex items-center justify-center shadow-lg shrink-0`}>
                    <Icon size={12} className="text-white sm:hidden" />
                    <Icon size={16} className="text-white hidden sm:block" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs sm:text-sm sm:font-semibold text-slate-700 truncate">{platform.name}</p>
                    <p className="text-xs sm:text-sm text-slate-500">{platform.count} accounts</p>
                  </div>
                </div>
                <span className="text-sm sm:text-base sm:text-lg font-bold text-[#1E3A8A] shrink-0">{platform.percentage}%</span>
              </div>
              <div className="h-1 sm:h-1.5 sm:h-2 bg-slate-100 rounded-full overflow-hidden">
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

      <div className="mt-3 sm:mt-4 sm:mt-6 pt-3 sm:pt-4 sm:pt-6 border-t border-slate-100">
        <div className="flex items-center justify-between">
          <span className="text-xs sm:text-sm text-slate-500">Total Accounts</span>
          <span className="text-base sm:text-lg sm:text-xl font-bold text-[#1E3A8A]">{total}</span>
        </div>
      </div>
    </motion.div>
  );
}
