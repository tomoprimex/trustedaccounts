"use client";

import { motion } from "framer-motion";
import { Plus, Users, Store, BarChart3, Settings } from "lucide-react";

export function QuickActions() {
  const actions = [
    { icon: Plus, label: "Add Account", href: "/dashboard/accounts/new", gradient: "from-blue-500 to-cyan-500" },
    { icon: Users, label: "View Customers", href: "/dashboard/customers", gradient: "from-emerald-500 to-teal-500" },
    { icon: Store, label: "Manage Sellers", href: "/dashboard/sellers", gradient: "from-purple-500 to-pink-500" },
    { icon: BarChart3, label: "View Reports", href: "/dashboard/reports", gradient: "from-orange-500 to-amber-500" },
    { icon: Settings, label: "Settings", href: "/dashboard/settings", gradient: "from-slate-500 to-slate-600" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.5 }}
      className="relative overflow-hidden rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100/50 bg-white p-6"
    >
      <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
      <div className="relative">
        <h2 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-6">Quick Actions</h2>
        
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-4">
          {actions.map((action, index) => {
            const Icon = action.icon;
            return (
              <motion.button
                key={action.label}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: 0.6 + index * 0.05 }}
                whileHover={{ scale: 1.05, y: -4 }}
                whileTap={{ scale: 0.95 }}
                className="flex flex-col items-center gap-3 p-4 rounded-2xl bg-gradient-to-r from-slate-50 to-white hover:from-slate-100 hover:to-slate-50 transition-all group"
              >
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${action.gradient} flex items-center justify-center shadow-lg shadow-${action.gradient.split('-')[1]}-500/25 group-hover:scale-110 transition-transform`}>
                  <Icon size={24} className="text-white" />
                </div>
                <span className="text-sm font-semibold text-slate-700">{action.label}</span>
              </motion.button>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}
