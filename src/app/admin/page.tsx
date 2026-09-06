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
  Clock
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
      name: "Total Websites",
      value: websites.length.toString(),
      change: "",
      icon: Globe,
      gradient: "from-blue-500 to-blue-600",
      bgGradient: "from-blue-50 to-blue-100",
    },
    {
      name: "Total Users",
      value: stats?.totalCustomers?.toString() || "0",
      change: "",
      icon: Users,
      gradient: "from-purple-500 to-purple-600",
      bgGradient: "from-purple-50 to-purple-100",
    },
    {
      name: "Revenue",
      value: `₦${((stats?.totalRevenue || 0) / 100).toLocaleString()}`,
      change: "",
      icon: DollarSign,
      gradient: "from-emerald-500 to-emerald-600",
      bgGradient: "from-emerald-50 to-emerald-100",
    },
    {
      name: "Total Orders",
      value: stats?.totalOrders?.toString() || "0",
      change: "",
      icon: Activity,
      gradient: "from-amber-500 to-amber-600",
      bgGradient: "from-amber-50 to-amber-100",
    },
  ];

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
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
        className="p-4"
      >
        {/* Welcome */}
        <div className="mb-4">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
            Welcome back, Admin
          </h1>
          <p className="text-slate-500 mt-1">Here's what's happening with your platform today.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-4">
          {statCards.map((stat, index) => (
            <motion.div
              key={stat.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`bg-gradient-to-br ${stat.bgGradient} rounded-3xl p-4 shadow-lg shadow-slate-200/50 border border-white/50 hover:shadow-xl transition-all duration-300`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-slate-600 text-sm font-medium">{stat.name}</p>
                  <p className="text-3xl font-bold text-slate-900 mt-2">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-2xl bg-gradient-to-br ${stat.gradient} shadow-lg`}>
                  <stat.icon size={24} className="text-white" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Recent Websites */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="bg-white rounded-3xl shadow-lg shadow-slate-200/50 border border-slate-100 p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-slate-800">Recent Websites</h2>
          </div>
          {websites.length > 0 ? (
            <div className="space-y-4">
              {websites.map((website, index) => (
                <motion.div
                  key={website.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.5 + index * 0.05 }}
                  className="flex items-center gap-4 p-4 rounded-2xl bg-gradient-to-r from-slate-50 to-white border border-slate-100 hover:border-slate-200 transition-all"
                >
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-semibold">
                    {website.name.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-slate-800">{website.name}</p>
                    <p className="text-sm text-slate-500">{website.url}</p>
                  </div>
                  <div className="flex items-center gap-2 text-slate-400 text-sm">
                    <Clock size={16} />
                    {new Date(website.created_at).toLocaleDateString()}
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <p className="text-slate-500 text-center py-8">No websites yet</p>
          )}
        </motion.div>
      </motion.div>
    </AdminLayout>
  );
}
