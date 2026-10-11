"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { ShoppingCart, Shield, Sparkles, MessageCircle, Filter } from "lucide-react";
import { getMarketplaceAccounts, createPurchase } from "@/lib/supabase/queries";
import { createClient } from "@/lib/supabase/client";
import { PaymentMethod } from "@/components/payment/paystack-payment";

const supabase = createClient();

const platformIcons: Record<string, string> = {
  facebook: "📘",
  instagram: "📷",
  youtube: "📺",
  tiktok: "🎵",
  twitter: "🐦",
  linkedin: "💼",
  whatsapp: "💬",
};

const platforms = [
  { id: "all", name: "All Platforms", icon: "🌐" },
  { id: "facebook", name: "Facebook", icon: "📘" },
  { id: "instagram", name: "Instagram", icon: "📷" },
  { id: "youtube", name: "YouTube", icon: "📺" },
  { id: "tiktok", name: "TikTok", icon: "🎵" },
  { id: "twitter", name: "Twitter", icon: "🐦" },
  { id: "linkedin", name: "LinkedIn", icon: "💼" },
  { id: "whatsapp", name: "WhatsApp", icon: "💬" },
];

const categories = [
  { id: "all", name: "All Tiers" },
  { id: "normal", name: "Normal" },
  { id: "premium", name: "Premium" },
  { id: "elite", name: "Elite" },
  { id: "top-tier", name: "Top Tier" },
];

export default function MarketplacePage() {
  const [accounts, setAccounts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPlatform, setSelectedPlatform] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("all");
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

  const handlePaymentSuccess = async (reference: string, method: 'paystack' | 'transfer') => {
    setProcessing(true);
    try {
      await createPurchase(user.id, selectedAccount.id, method, reference);
      if (method === 'paystack') {
        alert('Purchase successful! Your account credentials are now available in your dashboard.');
        setAccounts(accounts.filter(a => a.id !== selectedAccount.id));
      } else {
        alert('Transfer proof submitted! Your order is pending admin approval. You will be able to access the account credentials once the transfer is verified and approved by admin.');
        setAccounts(accounts.filter(a => a.id !== selectedAccount.id));
      }
      setShowPayment(false);
      setSelectedAccount(null);
    } catch (error) {
      console.error('Error completing purchase:', error);
      alert('Failed to complete purchase');
    } finally {
      setProcessing(false);
    }
  };

  const handleWalletPurchase = async () => {
    if (!user) {
      alert('Please login to purchase');
      return;
    }

    setProcessing(true);
    try {
      // Get session token
      const { data: { session } } = await supabase.auth.getSession();

      if (!session) {
        alert('Please login to purchase');
        return;
      }

      // Check wallet balance via service role
      const response = await fetch('/api/purchase-from-wallet', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          accountId: selectedAccount.id,
        }),
      });

      const result = await response.json();

      if (result.success) {
        alert('Purchase successful! Your account credentials are now available in your dashboard.');
        setAccounts(accounts.filter(a => a.id !== selectedAccount.id));
        setShowPayment(false);
        setSelectedAccount(null);
      } else {
        alert(result.error || 'Purchase failed');
      }
    } catch (error) {
      console.error('Error completing wallet purchase:', error);
      alert('Failed to complete purchase');
    } finally {
      setProcessing(false);
    }
  };

  const handlePaymentCancel = () => {
    setShowPayment(false);
    setSelectedAccount(null);
  };

  const filteredAccounts = accounts.filter(account => {
    const platformMatch = selectedPlatform === "all" || account.platform === selectedPlatform;
    const categoryMatch = selectedCategory === "all" || account.category === selectedCategory;
    return platformMatch && categoryMatch;
  });

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-4 px-2 sm:px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-gradient-to-br from-blue-600 to-blue-600 rounded-lg">
                <ShoppingCart size={14} className="text-white" />
              </div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-blue-600 bg-clip-text text-transparent">
                Marketplace
              </h1>
            </div>
            <a
              href="https://wa.me/your-whatsapp-number"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 bg-gradient-to-br from-green-500 to-green-600 rounded-lg"
            >
              <MessageCircle size={16} className="text-white" />
            </a>
          </div>
          <p className="text-xs text-slate-500">Browse and purchase verified accounts</p>
        </motion.div>

        {/* Platform Selection */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="relative"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 to-blue-600/10 rounded-xl blur-md dark:from-blue-500/10 dark:to-blue-600/10" />
          <div className="relative bg-white/80 backdrop-blur-xl rounded-xl p-3 border-2 border-blue-600/20 dark:bg-slate-800/80 dark:border-blue-500/30 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <Filter size={14} className="text-blue-600 dark:text-blue-400" />
              <span className="text-xs font-medium text-slate-700 dark:text-slate-300">Platform</span>
            </div>
            <div className="flex gap-2 overflow-x-auto pb-2">
              {platforms.map((platform) => (
                <button
                  key={platform.id}
                  onClick={() => setSelectedPlatform(platform.id)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                    selectedPlatform === platform.id
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600'
                  }`}
                >
                  <span>{platform.icon}</span>
                  <span>{platform.name}</span>
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Category Selection */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="relative"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 to-blue-600/10 rounded-xl blur-md dark:from-blue-500/10 dark:to-blue-600/10" />
          <div className="relative bg-white/80 backdrop-blur-xl rounded-xl p-3 border-2 border-blue-600/20 dark:bg-slate-800/80 dark:border-blue-500/30 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles size={14} className="text-blue-600 dark:text-blue-400" />
              <span className="text-xs font-medium text-slate-700 dark:text-slate-300">Category</span>
            </div>
            <div className="flex gap-2 overflow-x-auto pb-2">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                    selectedCategory === category.id
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600'
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Accounts Grid */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3"
        >
          {filteredAccounts.map((account, index) => (
            <motion.div
              key={account.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + index * 0.03 }}
              className="relative"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 to-blue-600/10 rounded-xl blur-md dark:from-blue-500/10 dark:to-blue-600/10" />
              <div className="relative bg-white/80 backdrop-blur-xl rounded-xl p-4 border-2 border-blue-600/20 dark:bg-slate-800/80 dark:border-blue-500/30 shadow-sm">
                {/* Platform Icon */}
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 to-blue-600 flex items-center justify-center text-2xl mb-3">
                  {platformIcons[account.platform] || "🌐"}
                </div>

                {/* Account Info */}
                <div className="mb-3">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white truncate">{account.username}</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{account.email}</p>
                </div>

                {/* Category Badge */}
                <div className="mb-3">
                  <span className="inline-block px-2 py-1 rounded-full text-[10px] font-medium bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                    {account.category || 'Normal'}
                  </span>
                </div>

                {/* Price */}
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs text-slate-500 dark:text-slate-400">Price:</span>
                  <span className="text-sm font-bold text-slate-900 dark:text-white">₦{(account.price_cents / 100).toLocaleString()}</span>
                </div>

                {/* Security Badge */}
                <div className="flex items-center gap-1 mb-3 text-xs text-slate-400">
                  <Shield size={12} />
                  <span className="truncate">Verified</span>
                </div>

                {/* Purchase Button */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handlePurchase(account)}
                  disabled={processing}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-blue-600 text-white rounded-xl text-sm font-medium shadow-lg shadow-blue-600/20 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ShoppingCart size={14} />
                  Buy Now
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
            className="relative"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 to-blue-600/10 rounded-xl blur-md dark:from-blue-500/10 dark:to-blue-600/10" />
            <div className="relative bg-white/80 backdrop-blur-xl rounded-xl p-6 border-2 border-blue-600/20 dark:bg-slate-800/80 dark:border-blue-500/30 shadow-sm text-center">
              <div className="p-3 bg-blue-50 rounded-full w-fit mx-auto mb-3 dark:bg-blue-900/30">
                <ShoppingCart size={24} className="text-blue-600 dark:text-blue-400" />
              </div>
              <p className="text-sm text-slate-500 dark:text-slate-400">No accounts available</p>
              <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">Try different filters or check back later</p>
            </div>
          </motion.div>
        )}
      </div>

      {/* Payment Modal */}
      {showPayment && selectedAccount && user && (
        <PaymentMethod
          amount={selectedAccount.price_cents / 100}
          email={user.email}
          accountId={selectedAccount.id}
          onSuccess={handlePaymentSuccess}
          onWalletPurchase={handleWalletPurchase}
          onClose={handlePaymentCancel}
          onCancel={handlePaymentCancel}
        />
      )}
    </DashboardLayout>
  );
}