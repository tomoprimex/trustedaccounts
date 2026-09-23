"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Check, X, Wallet, Building2, CreditCard, Search, Filter, Clock as ClockIcon } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { getAllDeposits, updateDepositStatus } from "@/lib/supabase/queries";
import { AdminLayout } from "@/components/admin/admin-layout";
import { useRouter } from "next/navigation";

const supabase = createClient();

export default function AdminDepositsPage() {
  const router = useRouter();
  const [deposits, setDeposits] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'completed' | 'failed'>('all');

  useEffect(() => {
    loadDeposits();
  }, []);

  const loadDeposits = async () => {
    try {
      const data = await getAllDeposits();
      setDeposits(data);
    } catch (error) {
      console.error('Error loading deposits:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (depositId: string) => {
    try {
      await updateDepositStatus(depositId, 'completed');
      await loadDeposits();
    } catch (error) {
      console.error('Error approving deposit:', error);
      alert('Failed to approve deposit');
    }
  };

  const handleReject = async (depositId: string) => {
    try {
      await updateDepositStatus(depositId, 'failed');
      await loadDeposits();
    } catch (error) {
      console.error('Error rejecting deposit:', error);
      alert('Failed to reject deposit');
    }
  };

  const filteredDeposits = deposits.filter(deposit => {
    const matchesSearch =
      deposit.profiles?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      deposit.payment_reference?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter =
      filterStatus === 'all' ||
      deposit.status === filterStatus;

    return matchesSearch && matchesFilter;
  });

  const pendingCount = deposits.filter(d => d.status === 'pending').length;
  const completedCount = deposits.filter(d => d.status === 'completed').length;
  const failedCount = deposits.filter(d => d.status === 'failed').length;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400';
      case 'completed':
        return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
      case 'failed':
        return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
      default:
        return 'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300';
    }
  };

  const getPaymentMethodIcon = (method: string) => {
    switch (method) {
      case 'card':
        return <CreditCard size={16} className="text-green-600 dark:text-green-400" />;
      case 'transfer':
        return <Building2 size={16} className="text-blue-600 dark:text-blue-400" />;
      default:
        return <Wallet size={16} className="text-slate-600 dark:text-slate-400" />;
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push('/admin')}
              className="p-2 bg-gradient-to-br from-blue-600 to-blue-600 rounded-lg"
            >
              <ArrowLeft size={16} className="text-white" />
            </button>
            <div className="p-2 bg-gradient-to-br from-blue-600 to-blue-600 rounded-lg">
              <Wallet size={16} className="text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-600 bg-clip-text text-transparent dark:from-blue-400 dark:to-blue-500">
                Deposits
              </h1>
              <p className="text-sm text-slate-500 dark:text-slate-400">Manage wallet deposits</p>
            </div>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4"
        >
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-amber-600/10 to-amber-600/10 rounded-xl blur-md" />
            <div className="relative bg-white/80 backdrop-blur-xl rounded-xl p-4 border-2 border-amber-600/20 dark:bg-slate-800/80 dark:border-amber-500/30 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-600 dark:text-slate-400">Pending</p>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white">{pendingCount}</p>
                </div>
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center">
                  <ClockIcon size={20} className="text-white" />
                </div>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-green-600/10 to-green-600/10 rounded-xl blur-md" />
            <div className="relative bg-white/80 backdrop-blur-xl rounded-xl p-4 border-2 border-green-600/20 dark:bg-slate-800/80 dark:border-green-500/30 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-600 dark:text-slate-400">Completed</p>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white">{completedCount}</p>
                </div>
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center">
                  <Check size={20} className="text-white" />
                </div>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-red-600/10 to-red-600/10 rounded-xl blur-md" />
            <div className="relative bg-white/80 backdrop-blur-xl rounded-xl p-4 border-2 border-red-600/20 dark:bg-slate-800/80 dark:border-red-500/30 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-600 dark:text-slate-400">Failed</p>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white">{failedCount}</p>
                </div>
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center">
                  <X size={20} className="text-white" />
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Search and Filter */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex gap-3"
        >
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by email or reference..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white/80 backdrop-blur border-2 border-blue-600/20 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-600/20 focus:border-blue-600 transition-all dark:bg-slate-800/80 dark:text-white dark:border-blue-500/30"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as any)}
            className="px-4 py-2 bg-white/80 backdrop-blur border-2 border-blue-600/20 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-600/20 focus:border-blue-600 transition-all dark:bg-slate-800/80 dark:text-white dark:border-blue-500/30"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
            <option value="failed">Failed</option>
          </select>
        </motion.div>

        {/* Deposits List */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="space-y-3"
        >
          {loading ? (
            <div className="text-center py-8">
              <div className="inline-block w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : filteredDeposits.length === 0 ? (
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 to-blue-600/10 rounded-xl blur-md dark:from-blue-500/10 dark:to-blue-600/10" />
              <div className="relative bg-white/80 backdrop-blur-xl rounded-xl p-8 border-2 border-blue-600/20 dark:bg-slate-800/80 dark:border-blue-500/30 shadow-sm text-center">
                <Wallet size={48} className="mx-auto mb-4 text-slate-300 dark:text-slate-600" />
                <p className="text-slate-600 dark:text-slate-400">No deposits found</p>
              </div>
            </div>
          ) : (
            filteredDeposits.map((deposit, index) => (
              <motion.div
                key={deposit.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + index * 0.05 }}
                className="relative"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 to-blue-600/10 rounded-xl blur-md dark:from-blue-500/10 dark:to-blue-600/10" />
                <div className="relative bg-white/80 backdrop-blur-xl rounded-xl p-4 border-2 border-blue-600/20 dark:bg-slate-800/80 dark:border-blue-500/30 shadow-sm">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(deposit.status)}`}>
                          {deposit.status.charAt(0).toUpperCase() + deposit.status.slice(1)}
                        </span>
                        <div className="flex items-center gap-1">
                          {getPaymentMethodIcon(deposit.payment_method)}
                          <span className="text-xs text-slate-600 dark:text-slate-400 capitalize">
                            {deposit.payment_method}
                          </span>
                        </div>
                      </div>

                      <p className="text-sm font-medium text-slate-900 dark:text-white mb-1">
                        {deposit.profiles?.email || 'Unknown User'}
                      </p>

                      <div className="flex items-center gap-4 text-xs text-slate-600 dark:text-slate-400">
                        <span>Amount: ₦{(deposit.amount_cents / 100).toLocaleString()}</span>
                        <span>Ref: {deposit.payment_reference}</span>
                      </div>

                      <p className="text-xs text-slate-500 dark:text-slate-500 mt-1">
                        {new Date(deposit.created_at).toLocaleString()}
                      </p>
                    </div>

                    {deposit.status === 'pending' && (
                      <div className="flex gap-2">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleApprove(deposit.id)}
                          className="p-2 bg-gradient-to-br from-green-500 to-green-600 rounded-lg"
                        >
                          <Check size={16} className="text-white" />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleReject(deposit.id)}
                          className="p-2 bg-gradient-to-br from-red-500 to-red-600 rounded-lg"
                        >
                          <X size={16} className="text-white" />
                        </motion.button>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </motion.div>
      </div>
    </AdminLayout>
  );
}
