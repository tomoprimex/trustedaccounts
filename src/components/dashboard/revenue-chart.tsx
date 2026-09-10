"use client";

import { motion } from "framer-motion";

interface RevenueData {
  amount_cents: number;
  date: string;
  platform: string | null;
}

interface RevenueChartProps {
  data: RevenueData[];
}

const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export function RevenueChart({ data }: RevenueChartProps) {
  // Group data by day and sum revenue
  const weeklyData = data.reduce((acc, item) => {
    const date = new Date(item.date);
    const dayName = dayNames[date.getDay()];
    
    if (!acc[dayName]) {
      acc[dayName] = { revenue: 0, orders: 0 };
    }
    acc[dayName].revenue += item.amount_cents / 100; // Convert cents to Naira
    acc[dayName].orders += 1;
    
    return acc;
  }, {} as Record<string, { revenue: number; orders: number }>);

  // Convert to array and sort by day order
  const chartData = dayNames.map(day => ({
    day,
    revenue: weeklyData[day]?.revenue || 0,
    orders: weeklyData[day]?.orders || 0,
  }));

  const maxRevenue = Math.max(...chartData.map(d => d.revenue), 1);

  function formatCurrency(cents: number) {
    const amount = cents / 100;
    return `₦${amount.toLocaleString()}`;
  }
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="bg-white rounded-xl sm:rounded-2xl shadow-lg shadow-slate-200/50 border border-slate-100 p-3 sm:p-4 sm:p-6"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-3 sm:mb-4 sm:mb-6 gap-2 sm:gap-3">
        <div>
          <h2 className="text-base sm:text-lg sm:text-xl font-bold text-[#1E3A8A]">Revenue Overview</h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">Weekly performance</p>
        </div>
        <div className="flex gap-1.5 sm:gap-2">
          <button className="px-2 sm:px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg bg-[#1E3A8A] text-white text-xs sm:text-sm font-medium">Weekly</button>
          <button className="px-2 sm:px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg bg-slate-100 text-slate-600 text-xs sm:text-sm font-medium hover:bg-slate-200 transition-colors">Monthly</button>
        </div>
      </div>

      <div className="relative h-32 sm:h-40 sm:h-48 sm:h-64">
        {/* Grid lines */}
        <div className="absolute inset-0 flex flex-col justify-between">
          {[0, 25, 50, 75, 100].map((percent) => (
            <div key={percent} className="border-t border-slate-100 relative">
              <span className="absolute -top-3 -left-6 sm:-left-8 text-xs text-slate-400 hidden sm:block">
                {formatCurrency(Math.round((maxRevenue * percent) / 100))}
              </span>
            </div>
          ))}
        </div>

        {/* Bars */}
        <div className="absolute inset-0 flex items-end justify-between gap-1 sm:gap-2 sm:gap-4 pt-6 sm:pt-8">
          {chartData.map((data, index) => (
            <motion.div
              key={data.day}
              initial={{ height: 0 }}
              animate={{ height: `${(data.revenue / maxRevenue) * 100}%` }}
              transition={{ duration: 0.8, delay: 0.3 + index * 0.1, ease: [0.4, 0, 0.2, 1] }}
              className="flex-1 flex flex-col items-center gap-2 group"
            >
              <div className="relative w-full">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="w-full rounded-t-lg bg-gradient-to-t from-[#1E3A8A] to-[#1E40AF] shadow-lg shadow-[#1E3A8A]/20 group-hover:shadow-xl group-hover:shadow-[#1E3A8A]/30 transition-all cursor-pointer"
                />
                {/* Tooltip */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  whileHover={{ opacity: 1, y: 0 }}
                  className="absolute -top-12 left-1/2 -translate-x-1/2 bg-[#1E3A8A] text-white px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap opacity-0 pointer-events-none"
                >
                  {formatCurrency(data.revenue)}
                </motion.div>
              </div>
              <span className="text-xs font-medium text-slate-500">{data.day}</span>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-2 sm:gap-4 mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-slate-100">
        <div className="text-center">
          <p className="text-lg sm:text-xl sm:text-2xl font-bold text-[#1E3A8A]">{formatCurrency(data.reduce((sum, d) => sum + d.amount_cents, 0))}</p>
          <p className="text-xs text-slate-500 mt-1">Total Revenue</p>
        </div>
        <div className="text-center">
          <p className="text-lg sm:text-xl sm:text-2xl font-bold text-emerald-600">{data.length > 0 ? '+0%' : '0%'}</p>
          <p className="text-xs text-slate-500 mt-1">vs Last Week</p>
        </div>
        <div className="text-center">
          <p className="text-lg sm:text-xl sm:text-2xl font-bold text-slate-700">{data.length}</p>
          <p className="text-xs text-slate-500 mt-1">Total Orders</p>
        </div>
      </div>
    </motion.div>
  );
}
