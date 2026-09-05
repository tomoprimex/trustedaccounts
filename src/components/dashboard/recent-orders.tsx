"use client";

import { motion } from "framer-motion";
import { Package, Clock, CheckCircle, XCircle } from "lucide-react";

const recentOrders = [
  { id: "#ORD-001", customer: "Alex Johnson", platform: "Facebook", amount: "$15.00", status: "completed", date: "2 min ago" },
  { id: "#ORD-002", customer: "Sarah Williams", platform: "Instagram", amount: "$49.00", status: "completed", date: "15 min ago" },
  { id: "#ORD-003", customer: "Mike Chen", platform: "TikTok", amount: "$15.00", status: "pending", date: "32 min ago" },
  { id: "#ORD-004", customer: "Emma Davis", platform: "YouTube", amount: "$49.00", status: "processing", date: "1 hour ago" },
  { id: "#ORD-005", customer: "James Brown", platform: "Twitter", amount: "$15.00", status: "completed", date: "2 hours ago" },
];

const statusConfig = {
  completed: { icon: CheckCircle, color: "text-emerald-600", bg: "bg-emerald-100" },
  pending: { icon: Clock, color: "text-amber-600", bg: "bg-amber-100" },
  processing: { icon: Package, color: "text-blue-600", bg: "bg-blue-100" },
  failed: { icon: XCircle, color: "text-red-600", bg: "bg-red-100" },
};

export function RecentOrders() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="bg-white rounded-2xl shadow-lg shadow-slate-200/50 border border-slate-100 overflow-hidden"
    >
      <div className="p-4 sm:p-6 border-b border-slate-100">
        <h2 className="text-lg sm:text-xl font-bold text-[#1E3A8A]">Recent Orders</h2>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">Latest account purchases</p>
      </div>
      
      {/* Mobile card view */}
      <div className="sm:hidden divide-y divide-slate-100">
        {recentOrders.map((order, index) => {
          const StatusIcon = statusConfig[order.status as keyof typeof statusConfig]?.icon || Package;
          const statusStyle = statusConfig[order.status as keyof typeof statusConfig];
          
          return (
            <motion.div
              key={order.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 + index * 0.05 }}
              className="p-4"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-slate-500">{order.id}</span>
                <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${statusStyle?.bg} ${statusStyle?.color}`}>
                  <StatusIcon size={12} />
                  <span className="capitalize">{order.status}</span>
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-slate-900">{order.customer}</p>
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span>{order.platform}</span>
                  <span className="font-semibold">{order.amount}</span>
                </div>
                <p className="text-xs text-slate-400">{order.date}</p>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Desktop table view */}
      <div className="hidden sm:block overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-slate-50/50">
              <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Order ID</th>
              <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Customer</th>
              <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Platform</th>
              <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Amount</th>
              <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
              <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {recentOrders.map((order, index) => {
              const config = statusConfig[order.status as keyof typeof statusConfig];
              const StatusIcon = config.icon;
              
              return (
                <motion.tr
                  key={order.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.4 + index * 0.05 }}
                  className="hover:bg-slate-50/50 transition-colors cursor-pointer group"
                >
                  <td className="px-6 py-4">
                    <span className="font-semibold text-[#1E3A8A] group-hover:text-[#1E40AF] transition-colors">
                      {order.id}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#1E3A8A] to-[#1E40AF] flex items-center justify-center text-white text-xs font-bold">
                        {order.customer.split(' ').map(n => n[0]).join('')}
                      </div>
                      <span className="font-medium text-slate-700">{order.customer}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-700">
                      {order.platform}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-semibold text-slate-900">{order.amount}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium ${config.bg} ${config.color}`}>
                      <StatusIcon size={14} />
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-500">{order.date}</td>
                </motion.tr>
              );
            })}
          </tbody>
        </table>
      </div>
      
      <div className="p-4 border-t border-slate-100 bg-slate-50/30">
        <button className="w-full py-2 text-sm font-medium text-[#1E3A8A] hover:text-[#1E40AF] transition-colors">
          View All Orders →
        </button>
      </div>
    </motion.div>
  );
}
