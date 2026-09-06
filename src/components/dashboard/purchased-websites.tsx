"use client";

import { motion } from "framer-motion";
import { Eye, EyeOff, Copy } from "lucide-react";
import { useState } from "react";

export function PurchasedWebsites({ purchases }: { purchases: any[] }) {
  const [visibleCredentials, setVisibleCredentials] = useState<Record<string, boolean>>({});

  const toggleVisibility = (purchaseId: string) => {
    setVisibleCredentials(prev => ({
      ...prev,
      [purchaseId]: !prev[purchaseId]
    }));
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  if (!purchases || purchases.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-3xl shadow-lg shadow-slate-200/50 border border-slate-100 p-6"
      >
        <h2 className="text-xl font-bold text-slate-800 mb-4">My Purchased Accounts</h2>
        <p className="text-slate-500 text-center py-8">No purchased accounts yet</p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-3xl shadow-lg shadow-slate-200/50 border border-slate-100 p-6"
    >
      <h2 className="text-xl font-bold text-slate-800 mb-6">My Purchased Accounts</h2>
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
              className="border border-slate-200 rounded-2xl p-4 hover:border-slate-300 transition-all"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="font-bold text-lg text-slate-800">{account.username}</h3>
                  <p className="text-sm text-slate-500">{account.email}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-slate-500">Purchased on</p>
                  <p className="font-medium text-slate-900">{new Date(purchase.created_at).toLocaleDateString()}</p>
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
    </motion.div>
  );
}
