"use client";

import { motion } from "framer-motion";
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { StatCard } from "@/components/dashboard/stat-card";
import { RevenueChart } from "@/components/dashboard/revenue-chart";
import { RecentOrders } from "@/components/dashboard/recent-orders";
import { PlatformDistribution } from "@/components/dashboard/platform-distribution";
import { DollarSign, ShoppingCart, Users, TrendingUp } from "lucide-react";

export default function DashboardPage() {
  return (
    <DashboardLayout>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6 sm:mb-8"
      >
        <h1 className="text-2xl sm:text-3xl font-bold text-[#1E3A8A]">Dashboard</h1>
        <p className="text-slate-500 mt-1 text-sm sm:text-base">Welcome back! Here's what's happening with your business.</p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
        <StatCard
          title="Total Revenue"
          value="$45,231"
          change="+12.5% from last month"
          changeType="positive"
          icon={DollarSign}
          delay={0}
        />
        <StatCard
          title="Total Orders"
          value="1,245"
          change="+8.2% from last month"
          changeType="positive"
          icon={ShoppingCart}
          delay={0.1}
        />
        <StatCard
          title="Active Customers"
          value="892"
          change="+15.3% from last month"
          changeType="positive"
          icon={Users}
          delay={0.2}
        />
        <StatCard
          title="Growth Rate"
          value="23.1%"
          change="+2.4% from last month"
          changeType="positive"
          icon={TrendingUp}
          delay={0.3}
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
        <div className="lg:col-span-2">
          <RevenueChart />
        </div>
        <div>
          <PlatformDistribution />
        </div>
      </div>

      {/* Recent Orders */}
      <RecentOrders />
    </DashboardLayout>
  );
}
