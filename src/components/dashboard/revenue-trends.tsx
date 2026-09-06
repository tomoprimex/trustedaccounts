"use client";

import { motion } from "framer-motion";

interface RevenueTrendsProps {
  monthlyRevenue: Record<string, number>;
}

function formatCurrency(cents: number) {
  const amount = cents / 100;
  return `₦${amount.toLocaleString()}`;
}

export function RevenueTrends({ monthlyRevenue }: RevenueTrendsProps) {
  const months = Object.keys(monthlyRevenue).sort().slice(-6);
  const data = months.map(month => ({
    month: new Date(month + '-01').toLocaleDateString('en-US', { month: 'short', year: '2-digit' }),
    revenue: monthlyRevenue[month] || 0,
  }));

  const maxRevenue = Math.max(...data.map(d => d.revenue), 1);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="relative overflow-hidden rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100/50 bg-white p-6"
    >
      <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
      <div className="relative">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Revenue Trends</h2>
            <p className="text-sm text-slate-500 mt-1">Monthly revenue overview</p>
          </div>
          <select className="px-4 py-2 rounded-2xl bg-gradient-to-r from-slate-100 to-slate-50 text-slate-600 text-sm font-semibold hover:from-slate-200 hover:to-slate-100 transition-all border border-slate-200">
            <option>Last 6 Months</option>
            <option>Last Year</option>
          </select>
        </div>

        <div className="relative h-64">
          <div className="absolute inset-0 flex flex-col justify-between">
            {[0, 25, 50, 75, 100].map((percent) => (
              <div key={percent} className="border-t border-slate-100 relative">
                <span className="absolute -top-3 -left-8 text-xs text-slate-400 hidden sm:block">
                  {formatCurrency(Math.round((maxRevenue * percent) / 100))}
                </span>
              </div>
            ))}
          </div>

          <div className="absolute inset-0 flex items-end justify-between gap-4 pt-8">
            {data.map((item, index) => (
              <motion.div
                key={item.month}
                initial={{ height: 0 }}
                animate={{ height: `${(item.revenue / maxRevenue) * 100}%` }}
                transition={{ duration: 0.8, delay: 0.3 + index * 0.1, ease: [0.4, 0, 0.2, 1] }}
                className="flex-1 flex flex-col items-center gap-2 group"
              >
                <div className="relative w-full">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="w-full rounded-t-xl bg-gradient-to-t from-blue-600 to-purple-600 transition-all shadow-lg shadow-blue-500/25"
                    style={{ height: '100%' }}
                  />
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    whileHover={{ opacity: 1, y: 0 }}
                    className="absolute -top-12 left-1/2 -translate-x-1/2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap opacity-0 pointer-events-none shadow-lg"
                  >
                    {formatCurrency(item.revenue)}
                  </motion.div>
                </div>
                <span className="text-xs font-semibold text-slate-500">{item.month}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
