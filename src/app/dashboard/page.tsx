"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { getRecentOrders, getPurchasedAccounts, getDashboardStats } from "@/lib/supabase/queries";
import { createClient } from "@/lib/supabase/client";
import { ShoppingBag, Package, TrendingUp, Clock, Sparkles, ChevronRight } from "lucide-react";

const supabase = createClient();

const statusConfig = {
  completed: { label: "Completed", color: "bg-gradient-to-r from-blue-900 to-indigo-900 text-white" },
  pending: { label: "Pending", color: "bg-gradient-to-r from-amber-400 to-yellow-500 text-white" },
  processing: { label: "Processing", color: "bg-gradient-to-r from-blue-600 to-blue-700 text-white" },
  failed: { label: "Failed", color: "bg-gradient-to-r from-red-400 to-red-500 text-white" },
  refunded: { label: "Refunded", color: "bg-gradient-to-r from-slate-400 to-slate-500 text-white" },
};

export default function DashboardPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [purchasedAccounts, setPurchasedAccounts] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        const [ordersData, purchases, statsData] = await Promise.all([
          getRecentOrders(5), 
          user ? getPurchasedAccounts(user.id) : Promise.resolve([]),
          getDashboardStats()
        ]);
        setOrders(ordersData || []);
        setPurchasedAccounts(purchases || []);
        setStats(statsData);
      } catch (error) { console.error("Error loading dashboard data:", error); } finally { setLoading(false); }
    }
    loadData();
  }, []);

  if (loading) return (
    <DashboardLayout>
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-slate-200 border-b-blue-900" />
      </div>
    </DashboardLayout>
  );

  const statCards = [
    {
      name: "Total Orders",
      value: stats?.totalOrders?.toString() || "0",
      icon: ShoppingBag,
      gradient: "from-blue-900 to-indigo-900",
    },
    {
      name: "Purchased Accounts",
      value: purchasedAccounts.length.toString(),
      icon: Package,
      gradient: "from-indigo-900 to-blue-900",
    },
    {
      name: "Total Spent",
      value: `₦${(stats?.totalRevenue || 0).toLocaleString()}`,
      icon: TrendingUp,
      gradient: "from-slate-800 to-blue-900",
    },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-4 px-2 sm:px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4"
        >
          <div className="flex items-center gap-2 mb-1">
            <div className="p-1.5 bg-gradient-to-br from-blue-900 to-indigo-900 rounded-lg">
              <Sparkles size={14} className="text-white" />
            </div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-blue-900 to-indigo-900 bg-clip-text text-transparent">
              Dashboard
            </h1>
          </div>
          <p className="text-xs text-slate-500">Welcome back. Here's what's happening with your account.</p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-2">
          {statCards.map((stat, index) => (
            <motion.div
              key={stat.name}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="relative"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-900/10 to-indigo-900/10 rounded-xl blur-md" />
              <div className="relative bg-white/80 backdrop-blur-xl rounded-xl p-2.5 border border-white/30 shadow-sm">
                <div className={`p-1.5 rounded-lg bg-gradient-to-br ${stat.gradient} mb-1.5`}>
                  <stat.icon size={12} className="text-white" />
                </div>
                <p className="text-[10px] text-slate-500 font-medium leading-tight">{stat.name}</p>
                <p className="text-sm font-bold text-slate-900 leading-tight">{stat.value}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Recent Orders */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-sm font-bold text-slate-900">Recent Orders</h2>
            <div className="p-1 bg-blue-50 rounded-lg">
              <Clock size={12} className="text-blue-900" />
            </div>
          </div>
          
          {orders.length === 0 ? (
            <div className="bg-white/80 backdrop-blur-xl rounded-xl p-4 border border-white/30 text-center">
              <div className="p-2 bg-blue-50 rounded-full w-fit mx-auto mb-2">
                <ShoppingBag size={20} className="text-blue-900" />
              </div>
              <p className="text-xs text-slate-500">No orders yet</p>
            </div>
          ) : (
            <div className="space-y-2">
              {orders.map((order, index) => (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 + index * 0.03 }}
                  className="relative"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-900/5 to-indigo-900/5 rounded-xl blur-sm" />
                  <div className="relative bg-white/80 backdrop-blur-xl rounded-xl p-2.5 border border-white/30 shadow-sm">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <p className="text-[10px] font-bold text-slate-900 truncate">{order.order_number}</p>
                        <p className="text-[9px] text-slate-500 truncate">{new Date(order.created_at).toLocaleDateString()}</p>
                      </div>
                      <div className={`px-1.5 py-0.5 rounded-md text-[8px] font-bold flex-shrink-0 ${statusConfig[order.status as keyof typeof statusConfig]?.color}`}>
                        {statusConfig[order.status as keyof typeof statusConfig]?.label || order.status}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Recent Purchases */}
        {purchasedAccounts.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
          >
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-sm font-bold text-slate-900">Recent Purchases</h2>
              <div className="p-1 bg-indigo-50 rounded-lg">
                <Package size={12} className="text-indigo-900" />
              </div>
            </div>
            
            <div className="space-y-2">
              {purchasedAccounts.slice(0, 3).map((purchase, index) => (
                <motion.div
                  key={purchase.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + index * 0.03 }}
                  className="relative"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/5 to-blue-900/5 rounded-xl blur-sm" />
                  <div className="relative bg-white/80 backdrop-blur-xl rounded-xl p-2.5 border border-white/30 shadow-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-blue-900 to-indigo-900 flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0">
                        {purchase.account?.platform?.charAt(0)?.toUpperCase() || 'A'}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[10px] font-bold text-slate-900 truncate">{purchase.account?.username || 'Unknown'}</p>
                        <p className="text-[9px] text-slate-500 truncate">{purchase.account?.platform || 'Platform'}</p>
                      </div>
                      <ChevronRight size={12} className="text-slate-400 flex-shrink-0" />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </DashboardLayout>
  );
}
