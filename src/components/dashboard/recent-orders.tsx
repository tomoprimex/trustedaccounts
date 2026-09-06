"use client";

import { motion } from "framer-motion";
import { Package, Clock, CheckCircle, XCircle } from "lucide-react";

interface Order {
  id: string;
  order_number: string;
  customer: { full_name: string | null; email: string | null };
  account: { platform: string; username: string; price_cents: number; currency: string };
  status: string;
  created_at: string;
}

interface RecentOrdersProps {
  orders: Order[];
}

const statusConfig = {
  completed: { icon: CheckCircle, color: "text-emerald-600", bg: "bg-emerald-100" },
  pending: { icon: Clock, color: "text-amber-600", bg: "bg-amber-100" },
  processing: { icon: Package, color: "text-blue-600", bg: "bg-blue-100" },
  failed: { icon: XCircle, color: "text-red-600", bg: "bg-red-100" },
};

function formatCurrency(cents: number, currency: string) {
  const amount = cents / 100;
  if (currency === 'NGN') {
    return `₦${amount.toLocaleString()}`;
  }
  return `$${amount.toLocaleString()}`;
}

function formatRelativeTime(dateString: string) {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);
  
  if (diffMins < 60) return `${diffMins} min ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
}

export function RecentOrders({ orders }: RecentOrdersProps) {
  if (!orders || orders.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="bg-white rounded-xl sm:rounded-2xl shadow-lg shadow-slate-200/50 border border-slate-100 overflow-hidden p-6"
      >
        <p className="text-center text-slate-500">No orders yet</p>
      </motion.div>
    );
  }
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="bg-white rounded-xl sm:rounded-2xl shadow-lg shadow-slate-200/50 border border-slate-100 overflow-hidden"
    >
      <div className="p-3 sm:p-4 sm:p-6 border-b border-slate-100">
        <h2 className="text-base sm:text-lg sm:text-xl font-bold text-[#1E3A8A]">Recent Orders</h2>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">Latest account purchases</p>
      </div>
      
      {/* Mobile card view */}
      <div className="sm:hidden divide-y divide-slate-100">
        {orders.map((order, index) => {
          const StatusIcon = statusConfig[order.status as keyof typeof statusConfig]?.icon || Package;
          const statusStyle = statusConfig[order.status as keyof typeof statusConfig];
          
          return (
            <motion.div
              key={order.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 + index * 0.05 }}
              className="p-3 sm:p-4"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-slate-500">{order.order_number}</span>
                <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${statusStyle?.bg} ${statusStyle?.color}`}>
                  <StatusIcon size={12} />
                  <span className="capitalize">{order.status}</span>
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-xs sm:text-sm font-medium text-slate-900">{order.customer.full_name || 'Unknown'}</p>
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span>{order.account.platform}</span>
                  <span className="font-semibold">{formatCurrency(order.account.price_cents, order.account.currency)}</span>
                </div>
                <p className="text-xs text-slate-400">{formatRelativeTime(order.created_at)}</p>
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
              <th className="text-left px-3 sm:px-4 sm:px-6 py-2 sm:py-3 sm:py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Order ID</th>
              <th className="text-left px-3 sm:px-4 sm:px-6 py-2 sm:py-3 sm:py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Customer</th>
              <th className="text-left px-3 sm:px-4 sm:px-6 py-2 sm:py-3 sm:py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Platform</th>
              <th className="text-left px-3 sm:px-4 sm:px-6 py-2 sm:py-3 sm:py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Amount</th>
              <th className="text-left px-3 sm:px-4 sm:px-6 py-2 sm:py-3 sm:py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
              <th className="text-left px-3 sm:px-4 sm:px-6 py-2 sm:py-3 sm:py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {orders.map((order, index) => {
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
                  <td className="px-3 sm:px-4 sm:px-6 py-2 sm:py-3 sm:py-4">
                    <span className="font-semibold text-[#1E3A8A] group-hover:text-[#1E40AF] transition-colors">
                      {order.order_number}
                    </span>
                  </td>
                  <td className="px-3 sm:px-4 sm:px-6 py-2 sm:py-3 sm:py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-gradient-to-br from-[#1E3A8A] to-[#1E40AF] flex items-center justify-center text-white text-xs font-bold">
                        {(order.customer.full_name || 'U').charAt(0).toUpperCase()}
                      </div>
                      <span className="font-medium text-slate-700">{order.customer.full_name || 'Unknown'}</span>
                    </div>
                  </td>
                  <td className="px-3 sm:px-4 sm:px-6 py-2 sm:py-3 sm:py-4">
                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-700">
                      {order.account.platform}
                    </span>
                  </td>
                  <td className="px-3 sm:px-4 sm:px-6 py-2 sm:py-3 sm:py-4 font-semibold text-slate-900">{formatCurrency(order.account.price_cents, order.account.currency)}</td>
                  <td className="px-3 sm:px-4 sm:px-6 py-2 sm:py-3 sm:py-4">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium ${config.bg} ${config.color}`}>
                      <StatusIcon size={14} />
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-3 sm:px-4 sm:px-6 py-2 sm:py-3 sm:py-4 text-xs sm:text-sm text-slate-500">{formatRelativeTime(order.created_at)}</td>
                </motion.tr>
              );
            })}
          </tbody>
        </table>
      </div>
      
      <div className="p-3 sm:p-4 border-t border-slate-100 bg-slate-50/30">
        <button className="w-full py-1.5 sm:py-2 text-xs sm:text-sm font-medium text-[#1E3A8A] hover:text-[#1E40AF] transition-colors">
          View All Orders →
        </button>
      </div>
    </motion.div>
  );
}
