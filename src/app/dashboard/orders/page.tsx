"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { getOrders } from "@/lib/supabase/queries";
import { ShoppingBag, Calendar, TrendingUp, Sparkles, ChevronRight } from "lucide-react";

const statusConfig = {
  completed: { label: "Completed", color: "bg-gradient-to-r from-blue-900 to-indigo-900 text-white" },
  pending: { label: "Pending", color: "bg-gradient-to-r from-amber-400 to-yellow-500 text-white" },
  processing: { label: "Processing", color: "bg-gradient-to-r from-blue-600 to-blue-700 text-white" },
  failed: { label: "Failed", color: "bg-gradient-to-r from-red-400 to-red-500 text-white" },
  refunded: { label: "Refunded", color: "bg-gradient-to-r from-slate-400 to-slate-500 text-white" },
};

function formatCurrency(cents: number) {
  const amount = cents / 100;
  return `₦${amount.toLocaleString()}`;
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadOrders() {
      try {
        const data = await getOrders({ limit: 100 });
        setOrders(data || []);
      } catch (error) {
        console.error('Error loading orders:', error);
      } finally {
        setLoading(false);
      }
    }
    loadOrders();
  }, []);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-900"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-3 px-2 sm:px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-3"
        >
          <div className="flex items-center gap-2 mb-1">
            <div className="p-1.5 bg-gradient-to-br from-blue-900 to-indigo-900 rounded-lg">
              <ShoppingBag size={14} className="text-white" />
            </div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-blue-900 to-indigo-900 bg-clip-text text-transparent">
              Orders
            </h1>
          </div>
          <p className="text-xs text-slate-500">Manage your orders and track their status</p>
        </motion.div>

        {/* Empty State */}
        {orders.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/80 backdrop-blur-xl rounded-xl p-4 border border-white/30 text-center"
          >
            <div className="p-2 bg-blue-50 rounded-full w-fit mx-auto mb-2">
              <ShoppingBag size={20} className="text-blue-900" />
            </div>
            <p className="text-xs text-slate-500">No orders yet</p>
            <p className="text-[10px] text-slate-400 mt-1">Start shopping to see your orders here</p>
          </motion.div>
        ) : (
          <div className="space-y-2">
            {orders.map((order, index) => {
              const config = statusConfig[order.status as keyof typeof statusConfig] || statusConfig.pending;
              return (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.03 }}
                  className="relative"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-900/10 to-indigo-900/10 rounded-xl blur-md" />
                  <div className="relative bg-white/80 backdrop-blur-xl rounded-xl p-2.5 border border-white/30 shadow-sm">
                    {/* Order Header */}
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-blue-900 to-indigo-900 flex items-center justify-center flex-shrink-0">
                          <ShoppingBag size={10} className="text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[10px] font-bold text-slate-900 truncate">{order.order_number}</p>
                          <p className="text-[8px] text-slate-500 truncate">{order.customer?.full_name || 'Unknown'}</p>
                        </div>
                      </div>
                      <div className={`px-1.5 py-0.5 rounded-md text-[8px] font-bold flex-shrink-0 ${config.color}`}>
                        {config.label}
                      </div>
                    </div>

                    {/* Order Details */}
                    <div className="grid grid-cols-2 gap-1.5 mb-2">
                      <div className="flex items-center gap-1">
                        <Calendar size={8} className="text-slate-400" />
                        <span className="text-[8px] text-slate-500">{new Date(order.created_at).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <TrendingUp size={8} className="text-slate-400" />
                        <span className="text-[8px] font-medium text-slate-900">{formatCurrency(order.amount_cents)}</span>
                      </div>
                    </div>

                    {/* Account Info */}
                    <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                      <div className="flex items-center gap-1 min-w-0">
                        <span className="text-[8px] text-slate-500">Account:</span>
                        <span className="text-[9px] font-medium text-slate-900 truncate">{order.account?.username || 'N/A'}</span>
                      </div>
                      <ChevronRight size={10} className="text-slate-400 flex-shrink-0" />
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}