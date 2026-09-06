"use client";

import { motion } from "framer-motion";
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { StatCard } from "@/components/dashboard/stat-card";
import { RevenueChart } from "@/components/dashboard/revenue-chart";
import { RecentOrders } from "@/components/dashboard/recent-orders";
import { PlatformDistribution } from "@/components/dashboard/platform-distribution";
import { DollarSign, ShoppingCart, Users, TrendingUp } from "lucide-react";
import { getDashboardStats, getRecentOrders, getRevenueByDate, getPlatformDistribution } from "@/lib/supabase/queries";
import { useEffect, useState } from "react";

export default function DashboardPage() {
  const [stats, setStats] = useState<any>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [revenueData, setRevenueData] = useState<any[]>([]);
  const [platformData, setPlatformData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [statsData, ordersData, revenue, platforms] = await Promise.all([
          getDashboardStats(),
          getRecentOrders(5),
          getRevenueByDate(7),
          getPlatformDistribution(),
        ]);
        setStats(statsData);
        setOrders(ordersData || []);
        setRevenueData(revenue || []);
        setPlatformData(platforms || []);
      } catch (error) {
        console.error('Error loading dashboard data:', error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  function formatCurrency(cents: number) {
    const amount = cents / 100;
    return `₦${amount.toLocaleString()}`;
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1E3A8A]"></div>
        </div>
      </DashboardLayout>
    );
  }
  return (
    <DashboardLayout>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-4 sm:mb-6 sm:mb-8"
      >
        <h1 className="text-xl sm:text-2xl sm:text-3xl font-bold text-[#1E3A8A]">Dashboard</h1>
        <p className="text-slate-500 mt-1 text-xs sm:text-sm sm:text-base">Welcome back! Here's what's happening with your business.</p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4 sm:gap-6 mb-4 sm:mb-6 sm:mb-8">
        <StatCard
          title={stats?.role === 'customer' ? 'Total Spent' : 'Total Revenue'}
          value={formatCurrency(stats?.totalRevenue || 0)}
          change="+12.5% from last month"
          changeType="positive"
          icon={DollarSign}
          delay={0}
        />
        <StatCard
          title={stats?.role === 'customer' ? 'My Orders' : 'Total Orders'}
          value={stats?.totalOrders || 0}
          change="+8.2% from last month"
          changeType="positive"
          icon={ShoppingCart}
          delay={0.1}
        />
        {stats?.role === 'admin' && (
          <StatCard
            title="Active Customers"
            value={stats?.totalCustomers || 0}
            change="+15.3% from last month"
            changeType="positive"
            icon={Users}
            delay={0.2}
          />
        )}
        {stats?.role !== 'customer' && (
          <StatCard
            title={stats?.role === 'seller' ? 'My Accounts' : 'Available Accounts'}
            value={stats?.totalAccounts || 0}
            change="+2.4% from last month"
            changeType="positive"
            icon={TrendingUp}
            delay={0.3}
          />
        )}
      </div>

      {/* Charts Row - Only show for admin and seller */}
      {stats?.role !== 'customer' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-2 sm:gap-4 sm:gap-6 mb-4 sm:mb-6 sm:mb-8">
          <div className="lg:col-span-2">
            <RevenueChart data={revenueData} />
          </div>
          <div>
            <PlatformDistribution data={platformData} />
          </div>
        </div>
      )}

      {/* Recent Orders */}
      <RecentOrders orders={orders} />
    </DashboardLayout>
  );
}
