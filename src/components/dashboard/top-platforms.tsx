"use client";

import { motion } from "framer-motion";
import { Monitor, Camera, Play, Video, MessageCircle, TrendingUp } from "lucide-react";

interface PlatformData {
  platform: string;
  count: number;
}

interface TopPlatformsProps {
  platforms: PlatformData[];
}

const platformIcons: Record<string, any> = {
  facebook: Monitor,
  instagram: Camera,
  youtube: Play,
  tiktok: Video,
  twitter: MessageCircle,
};

const platformGradients: Record<string, string> = {
  facebook: "from-blue-500 to-blue-600",
  instagram: "from-purple-500 to-pink-500",
  youtube: "from-red-500 to-red-600",
  tiktok: "from-black to-gray-800",
  twitter: "from-sky-500 to-sky-600",
};

const platformBgGradients: Record<string, string> = {
  facebook: "from-blue-500/10 to-blue-600/10",
  instagram: "from-purple-500/10 to-pink-500/10",
  youtube: "from-red-500/10 to-red-600/10",
  tiktok: "from-black/5 to-gray-800/5",
  twitter: "from-sky-500/10 to-sky-600/10",
};

export function TopPlatforms({ platforms }: TopPlatformsProps) {
  const maxCount = Math.max(...platforms.map(p => p.count), 1);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="relative overflow-hidden rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100/50 bg-white p-6"
    >
      <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
      <div className="relative">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Top Platforms</h2>
            <p className="text-sm text-slate-500 mt-1">Most sold platforms</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center shadow-lg shadow-blue-500/25">
            <TrendingUp size={24} className="text-white" />
          </div>
        </div>

        <div className="space-y-4">
          {platforms.map((item, index) => {
            const Icon = platformIcons[item.platform.toLowerCase()] || Monitor;
            const gradient = platformGradients[item.platform.toLowerCase()] || "from-slate-500 to-slate-600";
            const bgGradient = platformBgGradients[item.platform.toLowerCase()] || "from-slate-500/10 to-slate-600/10";
            const percentage = (item.count / maxCount) * 100;

            return (
              <motion.div
                key={item.platform}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.4 + index * 0.1 }}
                className="flex items-center gap-4 p-3 rounded-2xl bg-gradient-to-r from-slate-50 to-white hover:from-slate-100 hover:to-slate-50 transition-all group"
              >
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center flex-shrink-0 shadow-lg shadow-${gradient.split('-')[1]}-500/25`}>
                  <Icon size={20} className="text-white" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold text-slate-700 capitalize">{item.platform}</span>
                    <span className="text-sm font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">{item.count} sold</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${percentage}%` }}
                      transition={{ duration: 0.8, delay: 0.5 + index * 0.1 }}
                      className={`h-2 rounded-full bg-gradient-to-r ${gradient}`}
                    />
                  </div>
                </div>
              </motion.div>
            );
          })}

          {platforms.length === 0 && (
            <p className="text-center text-slate-500 py-8">No sales data yet</p>
          )}
        </div>
      </div>
    </motion.div>
  );
}
