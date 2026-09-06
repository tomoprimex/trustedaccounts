"use client";

import { motion } from "framer-motion";
import { ShoppingCart, CheckCircle, Clock, XCircle, Package } from "lucide-react";

interface ActivityItem {
  id: string;
  order_number: string;
  customer: { full_name: string | null };
  account: { platform: string };
  status: string;
  created_at: string;
}

interface RecentActivityProps {
  activities: ActivityItem[];
}

const statusConfig = {
  completed: { icon: CheckCircle, gradient: "from-emerald-500 to-green-500", bgGradient: "from-emerald-500/10 to-green-500/10" },
  pending: { icon: Clock, gradient: "from-amber-500 to-orange-500", bgGradient: "from-amber-500/10 to-orange-500/10" },
  processing: { icon: Package, gradient: "from-blue-500 to-cyan-500", bgGradient: "from-blue-500/10 to-cyan-500/10" },
  failed: { icon: XCircle, gradient: "from-red-500 to-rose-500", bgGradient: "from-red-500/10 to-rose-500/10" },
};

function formatRelativeTime(dateString: string) {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);
  
  if (diffMins < 60) return `${diffMins} min ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
}

export function RecentActivity({ activities }: RecentActivityProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="relative overflow-hidden rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100/50 bg-white p-6"
    >
      <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
      <div className="relative">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Recent Activity</h2>
            <p className="text-sm text-slate-500 mt-1">Latest orders and transactions</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center shadow-lg shadow-blue-500/25">
            <ShoppingCart size={24} className="text-white" />
          </div>
        </div>

        <div className="space-y-3">
          {activities.slice(0, 5).map((activity, index) => {
            const config = statusConfig[activity.status as keyof typeof statusConfig];
            const StatusIcon = config?.icon || Clock;

            return (
              <motion.div
                key={activity.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.5 + index * 0.05 }}
                className="flex items-center gap-4 p-4 rounded-2xl bg-gradient-to-r from-slate-50 to-white hover:from-slate-100 hover:to-slate-50 transition-all group"
              >
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${config?.gradient} flex items-center justify-center flex-shrink-0 shadow-lg shadow-${config?.gradient.split('-')[1]}-500/25`}>
                  <StatusIcon size={20} className="text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-slate-700 truncate">
                    {activity.customer?.full_name || 'Unknown'} purchased {activity.account?.platform}
                  </p>
                  <p className="text-sm text-slate-500">{activity.order_number}</p>
                </div>
                <span className="text-xs font-semibold text-slate-400 whitespace-nowrap">
                  {formatRelativeTime(activity.created_at)}
                </span>
              </motion.div>
            );
          })}

          {activities.length === 0 && (
            <p className="text-center text-slate-500 py-8">No recent activity</p>
          )}
        </div>
      </div>
    </motion.div>
  );
}
