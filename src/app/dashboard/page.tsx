"use client";

import { motion } from "framer-motion";
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { PurchasedWebsites } from "@/components/dashboard/purchased-websites";
import { getRecentOrders, getPurchasedAccounts } from "@/lib/supabase/queries";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

const supabase = createClient();

export default function DashboardPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [purchasedWebsites, setPurchasedWebsites] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        const [ordersData] = await Promise.all([
          getRecentOrders(5),
        ]);
        setOrders(ordersData || []);

        // Load purchased accounts
        if (user) {
          const purchased = await getPurchasedAccounts(user.id);
          setPurchasedWebsites(purchased || []);
        }
      } catch (error) {
        console.error('Error loading dashboard data:', error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

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
        className="mb-6"
      >
        <h1 className="text-3xl font-bold text-[#1E3A8A]">
          Dashboard
        </h1>
        <p className="text-slate-500 mt-1">
          Welcome back! Here's what's happening with your account.
        </p>
      </motion.div>

      {/* Purchased Accounts */}
      <PurchasedWebsites purchases={purchasedWebsites} />

      {/* Recent Orders */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mt-6"
      >
        <h2 className="text-xl font-bold text-slate-800 mb-4">Recent Orders</h2>
        {orders.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-6 text-center text-slate-500">
            No orders yet
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden">
            {orders.map((order) => (
              <div key={order.id} className="p-4 border-b border-slate-100 last:border-b-0">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium text-slate-800">{order.order_number}</p>
                    <p className="text-sm text-slate-500">{new Date(order.created_at).toLocaleDateString()}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    order.status === 'completed' ? 'bg-emerald-100 text-emerald-700' :
                    order.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                    'bg-slate-100 text-slate-700'
                  }`}>
                    {order.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </motion.div>
    </DashboardLayout>
  );
}
