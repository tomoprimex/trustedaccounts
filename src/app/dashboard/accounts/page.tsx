"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { getPurchasedAccounts } from "@/lib/supabase/queries";
import { createClient } from "@/lib/supabase/client";
import { Eye, EyeOff, Copy } from "lucide-react";

const supabase = createClient();

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
        className="mb-8"
      >
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            My Purchased Accounts
          </h1>
          <p className="text-slate-500 mt-1">View and manage your purchased account credentials</p>
        </div>
      </motion.div>

      {/* Purchased Accounts List */}
      {purchases.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl shadow-lg shadow-slate-200/50 border border-slate-100 p-12 text-center"
        >
          <p className="text-slate-500 text-lg">No purchased accounts yet</p>
          <p className="text-slate-400 text-sm mt-2">Visit the marketplace to purchase accounts</p>
        </motion.div>
      ) : (
        <div className="space-y-4">
          {purchases.map((purchase, index) => {
            const account = purchase.account;
            const isVisible = visibleCredentials[purchase.id];

            return (
              <motion.div
                key={purchase.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="bg-white rounded-3xl shadow-lg shadow-slate-200/50 border border-slate-100 p-6"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="font-bold text-xl text-slate-800">{account.username}</h3>
                    <p className="text-sm text-slate-500">{account.email}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="px-3 py-1.5 rounded-full text-xs font-semibold bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 capitalize">
                        {account.platform}
                      </span>
                      <span className="text-sm text-slate-400">
                        Purchased on {new Date(purchase.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="border-t border-slate-200 pt-4">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-sm font-semibold text-slate-700">Account Credentials</p>
                    <button
                      onClick={() => toggleVisibility(purchase.id)}
                      className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1"
                    >
                      {isVisible ? <EyeOff size={16} /> : <Eye size={16} />}
                      {isVisible ? 'Hide' : 'Show'}
                    </button>
                  </div>

                  {isVisible && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="space-y-3"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-slate-500 w-16">Email:</span>
                        <div className="flex-1 flex items-center gap-2">
                          <span className="text-sm font-medium text-slate-800 bg-slate-100 px-3 py-1 rounded-lg flex-1">{account.email}</span>
                          <button
                            onClick={() => copyToClipboard(account.email)}
                            className="p-1.5 hover:bg-slate-200 rounded-lg transition-colors"
                          >
                            <Copy size={16} className="text-slate-500" />
                          </button>
                        </div>
                      </div>
                      
                      {account.password && (
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-slate-500 w-16">Password:</span>
                          <div className="flex-1 flex items-center gap-2">
                            <span className="text-sm font-medium text-slate-800 bg-slate-100 px-3 py-1 rounded-lg flex-1">{account.password}</span>
                            <button
                              onClick={() => copyToClipboard(account.password)}
                              className="p-1.5 hover:bg-slate-200 rounded-lg transition-colors"
                            >
                              <Copy size={16} className="text-slate-500" />
                            </button>
                          </div>
                        </div>
                      )}
                      
                      {account.recovery_phone && (
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-slate-500 w-16">Phone:</span>
                          <div className="flex-1 flex items-center gap-2">
                            <span className="text-sm font-medium text-slate-800 bg-slate-100 px-3 py-1 rounded-lg flex-1">{account.recovery_phone}</span>
                            <button
                              onClick={() => copyToClipboard(account.recovery_phone)}
                              className="p-1.5 hover:bg-slate-200 rounded-lg transition-colors"
                            >
                              <Copy size={16} className="text-slate-500" />
                            </button>
                          </div>
                        </div>
                      )}
                      
                      {account.two_factor_secret && (
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-slate-500 w-16">2FA:</span>
                          <div className="flex-1 flex items-center gap-2">
                            <span className="text-sm font-medium text-slate-800 bg-slate-100 px-3 py-1 rounded-lg flex-1">{account.two_factor_secret}</span>
                            <button
                              onClick={() => copyToClipboard(account.two_factor_secret)}
                              className="p-1.5 hover:bg-slate-200 rounded-lg transition-colors"
                            >
                              <Copy size={16} className="text-slate-500" />
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
    </DashboardLayout>
  );
}
