"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { AdminLayout } from "@/components/admin/admin-layout";
import { 
  Globe, 
  Users, 
  TrendingUp, 
  DollarSign,
  Activity,
  Clock,
  ArrowUpRight,
  Sparkles
} from "lucide-react";
import { getWebsites, getAdminAnalytics } from "@/lib/supabase/queries";

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<any>(null);
  const [websites, setWebsites] = useState<any[]>([]);

  useEffect(() => {
    async function loadData() {
      try {
        const [analyticsData, websitesData] = await Promise.all([
          getAdminAnalytics(),
          getWebsites({ limit: 5 }),
        ]);
        setStats(analyticsData);
        setWebsites(websitesData || []);
      } catch (error) {
        console.error('Error loading dashboard data:', error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const statCards = [
    {
      name: "Total Accounts",
      value: stats?.totalAccounts?.toString() || "0",
      change: "+12%",
      icon: Globe,
      gradient: "from-blue-800 to-indigo-900",
      glow: "shadow-blue-900/20",
    },
    {
      name: "Total Users",
      value: stats?.totalCustomers?.toString() || "0",
      change: "+8%",
      icon: Users,
      gradient: "from-indigo-800 to-blue-900",
      glow: "shadow-indigo-900/20",
    },
    {
      name: "Revenue",
      value: `₦${((stats?.totalRevenue || 0) / 100).toLocaleString()}`,
      change: "+23%",
      icon: DollarSign,
      gradient: "from-slate-800 to-blue-900",
      glow: "shadow-slate-900/20",
    },
    {
      name: "Total Orders",
      value: stats?.totalOrders?.toString() || "0",
      change: "+15%",
      icon: Activity,
      gradient: "from-blue-900 to-indigo-900",
      glow: "shadow-blue-900/20",
    },
  ];

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-900"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="p-6"
      >
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-gradient-to-br from-blue-800 to-indigo-900 rounded-xl">
              <Sparkles size={20} className="text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-900 to-indigo-900 bg-clip-text text-transparent">
              Welcome back, Admin
            </h1>
          </div>
          <p className="text-slate-500 text-lg">Here's what's happening with your platform today.</p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statCards.map((stat, index) => (
            <motion.div
              key={stat.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="relative group"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-400/20 to-green-500/20 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-500" />
              <div className="relative bg-white/70 backdrop-blur-xl rounded-3xl p-6 border border-white/20 shadow-lg hover:shadow-2xl transition-all duration-300">
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-3 rounded-2xl bg-gradient-to-br ${stat.gradient} ${stat.glow} shadow-lg`}>
                    <stat.icon size={24} className="text-white" />
                  </div>
                  <div className="flex items-center gap-1 text-blue-900 text-sm font-semibold bg-blue-50 px-2 py-1 rounded-full">
                    <ArrowUpRight size={16} />
                    {stat.change}
                  </div>
                </div>
                <p className="text-slate-600 text-sm font-medium mb-1">{stat.name}</p>
                <p className="text-3xl font-bold text-slate-900">{stat.value}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Top Platforms Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mb-8"
        >
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-800/10 to-indigo-900/10 rounded-3xl blur-xl" />
            <div className="relative bg-white/70 backdrop-blur-xl rounded-3xl p-6 border border-white/20 shadow-lg">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-slate-800">Top Platforms</h2>
                <div className="p-2 bg-blue-50 rounded-xl">
                  <TrendingUp size={20} className="text-blue-900" />
                </div>
              </div>
              {stats?.topPlatforms && stats.topPlatforms.length > 0 ? (
                <div className="space-y-4">
                  {stats.topPlatforms.map((platform: any, index: number) => (
                    <motion.div
                      key={platform.platform}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: 0.5 + index * 0.05 }}
                      className="flex items-center gap-4 p-4 rounded-2xl bg-gradient-to-r from-blue-50/50 to-indigo-50/50 border border-blue-100/50 hover:border-blue-200/50 transition-all backdrop-blur-sm"
                    >
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-800 to-indigo-900 flex items-center justify-center text-white font-bold text-sm">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-slate-800 capitalize">{platform.platform}</p>
                        <div className="w-full bg-slate-200 rounded-full h-2 mt-2">
                          <div 
                            className="bg-gradient-to-r from-blue-800 to-indigo-900 h-2 rounded-full transition-all duration-500"
                            style={{ width: `${(platform.count / (stats.topPlatforms[0]?.count || 1)) * 100}%` }}
                          />
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-slate-900">{platform.count}</p>
                        <p className="text-xs text-slate-500">accounts</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <p className="text-slate-500 text-center py-8">No platform data yet</p>
              )}
            </div>
          </div>
        </motion.div>

        {/* Revenue Chart Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-slate-800/10 to-blue-900/10 rounded-3xl blur-xl" />
            <div className="relative bg-white/70 backdrop-blur-xl rounded-3xl p-6 border border-white/20 shadow-lg">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-slate-800">Monthly Revenue</h2>
                <div className="p-2 bg-slate-50 rounded-xl">
                  <DollarSign size={20} className="text-slate-900" />
                </div>
              </div>
              {stats?.monthlyRevenue ? (
                <div className="grid grid-cols-12 gap-2 h-40">
                  {stats.monthlyRevenue.map((value: number, index: number) => {
                    const maxValue = Math.max(...stats.monthlyRevenue);
                    const height = maxValue > 0 ? (value / maxValue) * 100 : 0;
                    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
                    return (
                      <motion.div
                        key={index}
                        initial={{ height: 0 }}
                        animate={{ height: `${Math.max(height, 5)}%` }}
                        transition={{ duration: 0.5, delay: 0.7 + index * 0.05 }}
                        className="flex flex-col items-center gap-2"
                      >
                        <div className="w-full bg-gradient-to-t from-blue-800 to-indigo-900 rounded-t-lg relative group">
                          <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                            ₦{(value / 100).toLocaleString()}
                          </div>
                        </div>
                        <span className="text-xs text-slate-500">{months[index]}</span>
                      </motion.div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-slate-500 text-center py-8">No revenue data yet</p>
              )}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AdminLayout>
  );
}
