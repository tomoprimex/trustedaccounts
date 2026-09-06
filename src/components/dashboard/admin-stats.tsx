"use client";

import { motion } from "framer-motion";
import { DollarSign, ShoppingCart, Users, Store, TrendingUp, CheckCircle, AlertCircle, ArrowUpRight, ArrowDownRight } from "lucide-react";

interface AdminStatsProps {
  stats: {
    totalRevenue: number;
    totalOrders: number;
    totalAccounts: number;
    totalCustomers: number;
    totalSellers: number;
    completionRate: number;
    avgOrderValue: number;
  };
}

function formatCurrency(cents: number) {
  const amount = cents / 100;
  return `₦${amount.toLocaleString()}`;
}

export function AdminStats({ stats }: AdminStatsProps) {
  const statCards = [
    {
      title: "Total Revenue",
      value: formatCurrency(stats.totalRevenue),
      change: "+12.5%",
      changeType: "positive" as const,
      icon: DollarSign,
      gradient: "from-blue-500 to-cyan-500",
      bgGradient: "from-blue-500/10 to-cyan-500/10",
    },
    {
      title: "Total Orders",
      value: stats.totalOrders.toString(),
      change: "+8.2%",
      changeType: "positive" as const,
      icon: ShoppingCart,
      gradient: "from-emerald-500 to-teal-500",
      bgGradient: "from-emerald-500/10 to-teal-500/10",
    },
    {
      title: "Total Customers",
      value: stats.totalCustomers.toString(),
      change: "+15.3%",
      changeType: "positive" as const,
      icon: Users,
      gradient: "from-purple-500 to-pink-500",
      bgGradient: "from-purple-500/10 to-pink-500/10",
    },
    {
      title: "Total Sellers",
      value: stats.totalSellers.toString(),
      change: "+5.1%",
      changeType: "positive" as const,
      icon: Store,
      gradient: "from-orange-500 to-amber-500",
      bgGradient: "from-orange-500/10 to-amber-500/10",
    },
    {
      title: "Available Accounts",
      value: stats.totalAccounts.toString(),
      change: "+2.4%",
      changeType: "positive" as const,
      icon: TrendingUp,
      gradient: "from-cyan-500 to-blue-500",
      bgGradient: "from-cyan-500/10 to-blue-500/10",
    },
    {
      title: "Completion Rate",
      value: `${stats.completionRate}%`,
      change: "+3.2%",
      changeType: "positive" as const,
      icon: CheckCircle,
      gradient: "from-green-500 to-emerald-500",
      bgGradient: "from-green-500/10 to-emerald-500/10",
    },
    {
      title: "Avg. Order Value",
      value: formatCurrency(stats.avgOrderValue),
      change: "+7.8%",
      changeType: "positive" as const,
      icon: DollarSign,
      gradient: "from-indigo-500 to-violet-500",
      bgGradient: "from-indigo-500/10 to-violet-500/10",
    },
    {
      title: "Pending Orders",
      value: "0",
      change: "-12%",
      changeType: "negative" as const,
      icon: AlertCircle,
      gradient: "from-red-500 to-rose-500",
      bgGradient: "from-red-500/10 to-rose-500/10",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
      {statCards.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.05 }}
            className="relative overflow-hidden rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100/50 bg-white p-6 hover:shadow-2xl hover:shadow-slate-200/60 transition-all duration-300 group"
          >
            <div className={`absolute inset-0 bg-gradient-to-br ${stat.bgGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
            <div className="relative">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-sm font-semibold text-slate-500">{stat.title}</p>
                  <p className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent mt-2">
                    {stat.value}
                  </p>
                  <div className="flex items-center gap-1 mt-2">
                    {stat.changeType === "positive" ? (
                      <ArrowUpRight size={16} className="text-emerald-500" />
                    ) : (
                      <ArrowDownRight size={16} className="text-red-500" />
                    )}
                    <p className={`text-sm font-semibold ${stat.changeType === "positive" ? "text-emerald-500" : "text-red-500"}`}>
                      {stat.change}
                    </p>
                  </div>
                </div>
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center flex-shrink-0 shadow-lg shadow-${stat.gradient.split('-')[1]}-500/25`}>
                  <Icon size={24} className="text-white" />
                </div>
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
