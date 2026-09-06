"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { Search, ShoppingCart, Shield } from "lucide-react";
import { getMarketplaceAccounts, createPurchase } from "@/lib/supabase/queries";
import { createClient } from "@/lib/supabase/client";

const supabase = createClient();

export default function MarketplacePage() {
  const [accounts, setAccounts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    async function loadData() {
      try {
        const { data: { user: authUser } } = await supabase.auth.getUser();
        setUser(authUser);

        const data = await getMarketplaceAccounts({ limit: 100 });
        setAccounts(data || []);
      } catch (error) {
        console.error('Error loading marketplace:', error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const handlePurchase = async (websiteId: string) => {
    if (!user) {
      alert('Please login to purchase');
      return;
    }

    if (confirm('Are you sure you want to purchase this account?')) {
      try {
        await createPurchase(user.id, websiteId);
        alert('Purchase successful! You can now view the credentials in your dashboard.');
        setAccounts(accounts.filter(a => a.id !== websiteId));
      } catch (error) {
        console.error('Error purchasing website:', error);
        alert('Failed to purchase website');
      }
    }
  };

  const filteredAccounts = accounts.filter(account =>
    account.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    account.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="p-6"
      >
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Marketplace
            </h1>
            <p className="text-slate-500 mt-1">Browse and purchase verified social media accounts</p>
          </div>
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input
              type="text"
              placeholder="Search by email or phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            />
          </div>
        </div>

        {/* Accounts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAccounts.map((account, index) => (
            <motion.div
              key={account.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className="bg-white rounded-3xl shadow-lg shadow-slate-200/50 border border-slate-100 p-6 hover:shadow-xl transition-all"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="font-bold text-lg text-slate-800">{account.username}</h3>
                  <p className="text-sm text-slate-500 mt-1">{account.email}</p>
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700">
                  Available
                </span>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-slate-500">Platform:</span>
                  <span className="font-medium text-slate-700 capitalize">{account.platform}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-slate-500">Price:</span>
                  <span className="font-medium text-slate-700">${(account.price_cents / 100).toFixed(2)}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 text-xs text-slate-400 mb-4">
                <Shield size={14} />
                <span>Credentials revealed after purchase</span>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handlePurchase(account.id)}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-medium hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg shadow-blue-500/25"
              >
                <ShoppingCart size={18} />
                Purchase
              </motion.button>
            </motion.div>
          ))}
        </div>

        {filteredAccounts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-slate-500">No accounts available in marketplace</p>
          </div>
        )}
      </motion.div>
    </DashboardLayout>
  );
}
