"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { getPurchasedAccounts } from "@/lib/supabase/queries";
import { createClient } from "@/lib/supabase/client";
import { Eye, EyeOff, Copy, Key, Package, Sparkles } from "lucide-react";

const supabase = createClient();

const platformIcons: Record<string, string> = {
  facebook: "📘",
  instagram: "📷",
  youtube: "📺",
  tiktok: "🎵",
  twitter: "🐦",
  linkedin: "💼",
};

export default function AccountsPage() {
  const [purchases, setPurchases] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [visibleCredentials, setVisibleCredentials] = useState<Record<string, boolean>>({});

  useEffect(() => {
    async function loadPurchasedAccounts() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const data = await getPurchasedAccounts(user.id);
          setPurchases(data || []);
        }
      } catch (error) {
        console.error('Error loading purchased accounts:', error);
      } finally {
        setLoading(false);
      }
    }
    loadPurchasedAccounts();
  }, []);

  const toggleVisibility = (purchaseId: string) => {
    setVisibleCredentials(prev => ({
      ...prev,
      [purchaseId]: !prev[purchaseId]
    }));
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

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
              <Package size={14} className="text-white" />
            </div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-blue-900 to-indigo-900 bg-clip-text text-transparent">
              My Accounts
            </h1>
          </div>
          <p className="text-xs text-slate-500">View and manage your purchased account credentials</p>
        </motion.div>

        {/* Empty State */}
        {purchases.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/80 backdrop-blur-xl rounded-xl p-4 border border-white/30 text-center"
          >
            <div className="p-2 bg-blue-50 rounded-full w-fit mx-auto mb-2">
              <Key size={20} className="text-blue-900" />
            </div>
            <p className="text-xs text-slate-500">No purchased accounts yet</p>
            <p className="text-[10px] text-slate-400 mt-1">Visit the marketplace to purchase accounts</p>
          </motion.div>
        ) : (
          <div className="space-y-2">
            {purchases.map((purchase, index) => {
              const account = purchase.account;
              const isVisible = visibleCredentials[purchase.id];

              return (
                <motion.div
                  key={purchase.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.03 }}
                  className="relative"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-900/10 to-indigo-900/10 rounded-xl blur-md" />
                  <div className="relative bg-white/80 backdrop-blur-xl rounded-xl p-2.5 border border-white/30 shadow-sm">
                    {/* Card Header */}
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-900 to-indigo-900 flex items-center justify-center text-sm flex-shrink-0">
                        {platformIcons[account.platform] || "🌐"}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-[11px] font-bold text-slate-900 truncate">{account.username}</h3>
                        <p className="text-[9px] text-slate-500 truncate">{account.email}</p>
                      </div>
                      <div className="px-1.5 py-0.5 rounded-md bg-gradient-to-r from-blue-900 to-indigo-900 text-white text-[8px] font-bold flex-shrink-0 capitalize">
                        {account.platform}
                      </div>
                    </div>

                    {/* Credentials Toggle */}
                    <div className="flex items-center justify-between mb-2">
                      <button
                        onClick={() => toggleVisibility(purchase.id)}
                        className="flex items-center gap-1 text-[10px] text-blue-900 font-medium"
                      >
                        {isVisible ? <EyeOff size={10} /> : <Eye size={10} />}
                        {isVisible ? 'Hide' : 'Show'} Credentials
                      </button>
                      <span className="text-[8px] text-slate-400">
                        {new Date(purchase.created_at).toLocaleDateString()}
                      </span>
                    </div>

                    {/* Credentials */}
                    {isVisible && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="space-y-1.5 pt-2 border-t border-slate-100"
                      >
                        <div className="flex items-center gap-1.5">
                          <span className="text-[8px] text-slate-500 w-8">Email:</span>
                          <div className="flex-1 flex items-center gap-1 min-w-0">
                            <span className="text-[9px] font-medium text-slate-800 bg-slate-50 px-1.5 py-0.5 rounded truncate flex-1">{account.email}</span>
                            <button
                              onClick={() => copyToClipboard(account.email)}
                              className="p-0.5 hover:bg-slate-100 rounded transition-colors flex-shrink-0"
                            >
                              <Copy size={8} className="text-slate-400" />
                            </button>
                          </div>
                        </div>
                        
                        {account.password && (
                          <div className="flex items-center gap-1.5">
                            <span className="text-[8px] text-slate-500 w-8">Pass:</span>
                            <div className="flex-1 flex items-center gap-1 min-w-0">
                              <span className="text-[9px] font-medium text-slate-800 bg-slate-50 px-1.5 py-0.5 rounded truncate flex-1">{account.password}</span>
                              <button
                                onClick={() => copyToClipboard(account.password)}
                                className="p-0.5 hover:bg-slate-100 rounded transition-colors flex-shrink-0"
                              >
                                <Copy size={8} className="text-slate-400" />
                              </button>
                            </div>
                          </div>
                        )}
                        
                        {account.recovery_phone && (
                          <div className="flex items-center gap-1.5">
                            <span className="text-[8px] text-slate-500 w-8">Phone:</span>
                            <div className="flex-1 flex items-center gap-1 min-w-0">
                              <span className="text-[9px] font-medium text-slate-800 bg-slate-50 px-1.5 py-0.5 rounded truncate flex-1">{account.recovery_phone}</span>
                              <button
                                onClick={() => copyToClipboard(account.recovery_phone)}
                                className="p-0.5 hover:bg-slate-100 rounded transition-colors flex-shrink-0"
                              >
                                <Copy size={8} className="text-slate-400" />
                              </button>
                            </div>
                          </div>
                        )}
                        
                        {account.two_factor_secret && (
                          <div className="flex items-center gap-1.5">
                            <span className="text-[8px] text-slate-500 w-8">2FA:</span>
                            <div className="flex-1 flex items-center gap-1 min-w-0">
                              <span className="text-[9px] font-medium text-slate-800 bg-slate-50 px-1.5 py-0.5 rounded truncate flex-1">{account.two_factor_secret}</span>
                              <button
                                onClick={() => copyToClipboard(account.two_factor_secret)}
                                className="p-0.5 hover:bg-slate-100 rounded transition-colors flex-shrink-0"
                              >
                                <Copy size={8} className="text-slate-400" />
                              </button>
                            </div>
                          </div>
                        )}
                      </motion.div>
                    )}
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
