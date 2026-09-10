"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { Search, ShoppingCart, Shield, Sparkles, ChevronRight } from "lucide-react";
import { getMarketplaceAccounts, createPurchase } from "@/lib/supabase/queries";
import { createClient } from "@/lib/supabase/client";
import { PaystackPayment } from "@/components/payment/paystack-payment";

const supabase = createClient();

const platformIcons: Record<string, string> = {
  facebook: "📘",
  instagram: "📷",
  youtube: "📺",
  tiktok: "🎵",
  twitter: "🐦",
  linkedin: "💼",
};

export default function MarketplacePage() {
  const [accounts, setAccounts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [user, setUser] = useState<any>(null);
  const [selectedAccount, setSelectedAccount] = useState<any>(null);
  const [showPayment, setShowPayment] = useState(false);
  const [processing, setProcessing] = useState(false);

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

  const handlePurchase = (account: any) => {
    if (!user) {
      alert('Please login to purchase');
      return;
    }

    setSelectedAccount(account);
    setShowPayment(true);
  };

  const handlePaymentSuccess = async (reference: string) => {
    setProcessing(true);
    try {
      await createPurchase(user.id, selectedAccount.id);
      alert('Purchase successful! You can now view the credentials in your dashboard.');
      setAccounts(accounts.filter(a => a.id !== selectedAccount.id));
      setShowPayment(false);
      setSelectedAccount(null);
    } catch (error) {
      console.error('Error completing purchase:', error);
      alert('Failed to complete purchase');
    } finally {
      setProcessing(false);
    }
  };

  const handlePaymentCancel = () => {
    setShowPayment(false);
    setSelectedAccount(null);
  };

  const filteredAccounts = accounts.filter(account =>
    account.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    account.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
              <ShoppingCart size={14} className="text-white" />
            </div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-blue-900 to-indigo-900 bg-clip-text text-transparent">
              Marketplace
            </h1>
          </div>
          <p className="text-xs text-slate-500">Browse and purchase verified accounts</p>
        </motion.div>

        {/* Search */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
        >
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-900/10 to-indigo-900/10 rounded-xl blur-md" />
            <div className="relative flex items-center gap-2 bg-white/80 backdrop-blur-xl rounded-xl p-2 border border-white/30 shadow-sm">
              <Search size={12} className="text-slate-400" />
              <input
                type="text"
                placeholder="Search accounts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1 bg-transparent border-none outline-none text-[10px] text-slate-800 placeholder:text-slate-400"
              />
            </div>
          </div>
        </motion.div>

        {/* Accounts Grid */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 gap-2"
        >
          {filteredAccounts.map((account, index) => (
            <motion.div
              key={account.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 + index * 0.02 }}
              className="relative"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-900/10 to-indigo-900/10 rounded-xl blur-md" />
              <div className="relative bg-white/80 backdrop-blur-xl rounded-xl p-2 border border-white/30 shadow-sm">
                {/* Platform Icon */}
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-900 to-indigo-900 flex items-center justify-center text-sm mb-2">
                  {platformIcons[account.platform] || "🌐"}
                </div>

                {/* Account Info */}
                <div className="mb-2">
                  <h3 className="text-[10px] font-bold text-slate-900 truncate">{account.username}</h3>
                  <p className="text-[8px] text-slate-500 truncate">{account.email}</p>
                </div>

                {/* Price */}
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[8px] text-slate-500">Price:</span>
                  <span className="text-[10px] font-bold text-slate-900">₦{(account.price_cents / 100).toLocaleString()}</span>
                </div>

                {/* Security Badge */}
                <div className="flex items-center gap-1 mb-2 text-[8px] text-slate-400">
                  <Shield size={8} />
                  <span className="truncate">Verified</span>
                </div>

                {/* Purchase Button */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handlePurchase(account)}
                  disabled={processing}
                  className="w-full flex items-center justify-center gap-1 px-2 py-1.5 bg-gradient-to-r from-blue-900 to-indigo-900 text-white rounded-lg text-[9px] font-medium shadow-lg shadow-blue-900/20 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ShoppingCart size={8} />
                  Buy
                </motion.button>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Empty State */}
        {filteredAccounts.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/80 backdrop-blur-xl rounded-xl p-4 border border-white/30 text-center"
          >
            <div className="p-2 bg-blue-50 rounded-full w-fit mx-auto mb-2">
              <ShoppingCart size={20} className="text-blue-900" />
            </div>
            <p className="text-xs text-slate-500">No accounts available</p>
            <p className="text-[10px] text-slate-400 mt-1">Check back later for new listings</p>
          </motion.div>
        )}
      </div>

      {/* Payment Modal */}
      {showPayment && selectedAccount && user && (
        <PaystackPayment
          amount={selectedAccount.price_cents / 100}
          email={user.email}
          onSuccess={handlePaymentSuccess}
          onClose={handlePaymentCancel}
          onCancel={handlePaymentCancel}
        />
      )}
    </DashboardLayout>
  );
}