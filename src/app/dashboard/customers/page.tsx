"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { getCustomers } from "@/lib/supabase/queries";
import { Users, Mail, Calendar, TrendingUp, Sparkles, ChevronRight } from "lucide-react";

const statusConfig = {
  active: { label: "Active", color: "bg-gradient-to-r from-blue-900 to-indigo-900 text-white" },
  inactive: { label: "Inactive", color: "bg-gradient-to-r from-slate-400 to-slate-500 text-white" },
  suspended: { label: "Suspended", color: "bg-gradient-to-r from-red-400 to-red-500 text-white" },
};

function formatCurrency(cents: number) {
  const amount = cents / 100;
  return `₦${amount.toLocaleString()}`;
}

export default function CustomersPage() {
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadCustomers() {
      try {
        const data = await getCustomers({ limit: 100 });
        setCustomers(data || []);
      } catch (error) {
        console.error('Error loading customers:', error);
      } finally {
        setLoading(false);
      }
    }
    loadCustomers();
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
              <Users size={14} className="text-white" />
            </div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-blue-900 to-indigo-900 bg-clip-text text-transparent">
              Customers
            </h1>
          </div>
          <p className="text-xs text-slate-500">Manage your customer relationships</p>
        </motion.div>

        {/* Empty State */}
        {customers.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/80 backdrop-blur-xl rounded-xl p-4 border border-white/30 text-center"
          >
            <div className="p-2 bg-blue-50 rounded-full w-fit mx-auto mb-2">
              <Users size={20} className="text-blue-900" />
            </div>
            <p className="text-xs text-slate-500">No customers yet</p>
            <p className="text-[10px] text-slate-400 mt-1">Your customer list will appear here</p>
          </motion.div>
        ) : (
          <div className="space-y-2">
            {customers.map((customer, index) => {
              const config = statusConfig[customer.status as keyof typeof statusConfig] || statusConfig.active;
              return (
                <motion.div
                  key={customer.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.03 }}
                  className="relative"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-900/10 to-indigo-900/10 rounded-xl blur-md" />
                  <div className="relative bg-white/80 backdrop-blur-xl rounded-xl p-2.5 border border-white/30 shadow-sm">
                    {/* Customer Header */}
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-blue-900 to-indigo-900 flex items-center justify-center flex-shrink-0">
                          <Users size={10} className="text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[10px] font-bold text-slate-900 truncate">{customer.full_name || 'Unknown'}</p>
                          <p className="text-[8px] text-slate-500 truncate">{customer.email}</p>
                        </div>
                      </div>
                      <div className={`px-1.5 py-0.5 rounded-md text-[8px] font-bold flex-shrink-0 ${config.color}`}>
                        {config.label}
                      </div>
                    </div>

                    {/* Customer Details */}
                    <div className="grid grid-cols-2 gap-1.5 mb-2">
                      <div className="flex items-center gap-1">
                        <Mail size={8} className="text-slate-400" />
                        <span className="text-[8px] text-slate-500 truncate">{customer.email}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar size={8} className="text-slate-400" />
                        <span className="text-[8px] text-slate-500">{new Date(customer.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>

                    {/* Analytics */}
                    <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                      <div className="flex items-center gap-1 min-w-0">
                        <span className="text-[8px] text-slate-500">Orders:</span>
                        <span className="text-[9px] font-medium text-slate-900">{customer.customer_analytics?.total_orders || 0}</span>
                      </div>
                      <div className="flex items-center gap-1 min-w-0">
                        <span className="text-[8px] text-slate-500">Spent:</span>
                        <span className="text-[9px] font-medium text-slate-900">{formatCurrency(customer.customer_analytics?.total_spent_cents || 0)}</span>
                      </div>
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