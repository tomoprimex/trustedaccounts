"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { Wallet, Eye, EyeOff, ArrowRight, Clock, Sparkles } from "lucide-react";
import { getWalletBalance, getRecentDeposits } from "@/lib/supabase/queries";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

const supabase = createClient();

export default function WalletPage() {
  const router = useRouter();
  const [walletBalance, setWalletBalance] = useState(0);
  const [balanceHidden, setBalanceHidden] = useState(true);
  const [deposits, setDeposits] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const refresh = async () => {
          const [wallet, depositsData] = await Promise.all([
            getWalletBalance(user.id),
            getRecentDeposits(user.id, 10),
          ]);
          setWalletBalance(wallet.balance_cents);
          setDeposits(depositsData || []);
          return depositsData || [];
        };

        const current = await refresh();
        setLoading(false);

        // Pending top-ups may have been paid after the user left the checkout page
        // (bank transfers can take minutes). Ask the server to re-check them.
        if (current.some((d: any) => d.status === "pending")) {
          const { data: { session } } = await supabase.auth.getSession();
          const res = await fetch("/api/payments/reconcile", {
            method: "POST",
            headers: session ? { Authorization: `Bearer ${session.access_token}` } : {},
          });
          const result = await res.json().catch(() => null);
          if (result?.settled > 0) await refresh();
        }
      } catch (error) {
        console.error('Error loading wallet data:', error);
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
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
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
            <div className="p-1.5 bg-gradient-to-br from-blue-600 to-blue-600 rounded-lg">
              <Wallet size={14} className="text-white" />
            </div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-blue-600 bg-clip-text text-transparent dark:from-blue-400">
              Wallet
            </h1>
          </div>
          <p className="text-xs text-slate-500">Manage your wallet balance and deposits</p>
        </motion.div>

        {/* Current Balance Card */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="relative"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 to-blue-600/10 rounded-xl blur-md dark:to-blue-600/10" />
          <div className="relative bg-white/80 backdrop-blur-xl rounded-xl p-4 border-2 border-blue-600/20 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-medium text-slate-700">Current Balance</span>
              <button
                onClick={() => setBalanceHidden(!balanceHidden)}
                className="text-slate-400 hover:text-slate-600 transition-colors"
              >
                {balanceHidden ? <Eye size={14} /> : <EyeOff size={14} />}
              </button>
            </div>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl font-bold text-slate-900">
                {balanceHidden ? '••••••' : `₦${(walletBalance / 100).toLocaleString()}`}
              </span>
            </div>
            <div className="flex gap-2">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => router.push('/dashboard/wallet/add-money')}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-blue-600 text-white rounded-xl font-semibold shadow-lg shadow-blue-600/20"
              >
                <Sparkles size={12} />
                Add Money
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => router.push('/marketplace')}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-ink-800 to-ink-900 text-white rounded-xl font-semibold shadow-lg"
              >
                <ArrowRight size={12} />
                View Marketplace
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Recent Deposits */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-sm font-bold text-slate-900">Recent Deposits</h2>
            <div className="p-1 bg-blue-50 rounded-lg">
              <Clock size={12} className="text-blue-600 dark:text-blue-400" />
            </div>
          </div>

          {!balanceHidden && deposits.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/80 backdrop-blur-xl rounded-xl p-4 border-2 border-blue-600/20 text-center"
            >
              <p className="text-xs text-orange-500 font-medium">You have not deposited funds in your wallet</p>
            </motion.div>
          ) : !balanceHidden ? (
            <div className="space-y-2">
              {deposits.map((deposit, index) => (
                <motion.div
                  key={deposit.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.15 + index * 0.03 }}
                  className="relative"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 to-blue-600/5 rounded-xl blur-sm dark:to-blue-600/5" />
                  <div className="relative bg-white/80 backdrop-blur-xl rounded-xl p-2.5 border-2 border-blue-600/20 shadow-sm">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <p className="text-[11px] font-bold text-slate-900">
                          ₦{(deposit.amount_cents / 100).toLocaleString()}
                        </p>
                        <p className="text-[11px] text-slate-500 capitalize">
                          {deposit.payment_method}
                        </p>
                      </div>
                      <div className={`px-1.5 py-0.5 rounded-md text-[10px] font-bold flex-shrink-0 ${
                        deposit.status === 'completed' 
                          ? 'bg-gradient-to-r from-green-500 to-green-600 text-white' 
                          : deposit.status === 'failed'
                          ? 'bg-gradient-to-r from-red-400 to-red-500 text-white'
                          : 'bg-gradient-to-r from-amber-400 to-yellow-500 text-white'
                      }`}>
                        {deposit.status}
                      </div>
                    </div>
                    <p className="text-[10px] text-slate-400 mt-1">
                      {new Date(deposit.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/80 backdrop-blur-xl rounded-xl p-4 border-2 border-blue-600/20 text-center"
            >
              <p className="text-xs text-slate-500">Balance is hidden</p>
            </motion.div>
          )}
        </motion.div>
      </div>
    </DashboardLayout>
  );
}
