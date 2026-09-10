"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { AdminLayout } from "@/components/admin/admin-layout";
import { Plus, Edit, Trash2, Search, Globe, DollarSign, Sparkles, Zap } from "lucide-react";
import { getAccounts, createAccount, updateAccount, deleteAccount } from "@/lib/supabase/queries";

const statusConfig = {
  available: { label: "Available", color: "bg-gradient-to-r from-blue-800 to-indigo-900 text-white", icon: Globe },
  reserved: { label: "Reserved", color: "bg-gradient-to-r from-amber-400 to-yellow-500 text-white", icon: Zap },
  sold: { label: "Sold", color: "bg-gradient-to-r from-slate-600 to-slate-700 text-white", icon: DollarSign },
  removed: { label: "Removed", color: "bg-gradient-to-r from-red-400 to-red-500 text-white", icon: Trash2 },
};

const platformIcons: Record<string, string> = {
  facebook: "📘",
  instagram: "📷",
  youtube: "📺",
  tiktok: "🎵",
  twitter: "🐦",
  linkedin: "💼",
};

export default function WebsitesPage() {
  const [accounts, setAccounts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<any>(null);
  const [editingAccount, setEditingAccount] = useState<any>(null);
  const [formData, setFormData] = useState({
    platform: "facebook" as "facebook" | "instagram" | "youtube" | "tiktok" | "twitter" | "linkedin",
    username: "",
    email: "",
    password: "",
    recovery_phone: "",
    two_factor_secret: "",
    price_cents: "",
    currency: "NGN",
    description: "",
    status: "available" as "available" | "reserved" | "sold" | "removed",
  });

  useEffect(() => {
    loadAccounts();
  }, []);

  const loadAccounts = async () => {
    try {
      const data = await getAccounts({ limit: 100 });
      setAccounts(data || []);
    } catch (error) {
      console.error('Error loading accounts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingAccount(null);
    setFormData({ 
      platform: "facebook",
      username: "",
      email: "",
      password: "",
      recovery_phone: "",
      two_factor_secret: "",
      price_cents: "",
      currency: "NGN",
      description: "",
      status: "available",
    });
    setModalOpen(true);
  };

  const handleEdit = (account: any) => {
    setEditingAccount(account);
    setFormData({
      platform: account.platform || "facebook",
      username: account.username || "",
      email: account.email || "",
      password: account.password || "",
      recovery_phone: account.recovery_phone || "",
      two_factor_secret: account.two_factor_secret || "",
      price_cents: (account.price_cents / 100).toString() || "", // Convert cents to Naira for display
      currency: account.currency || "NGN",
      description: account.description || "",
      status: account.status || "available",
    });
    setModalOpen(true);
  };

  const handleDelete = (account: any) => {
    setDeleteConfirm(account);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const accountData: any = {
        platform: formData.platform,
        username: formData.username,
        email: formData.email,
        password: formData.password,
        recovery_phone: formData.recovery_phone,
        two_factor_secret: formData.two_factor_secret,
        price_cents: parseInt(formData.price_cents) * 100, // Convert Naira to cents for storage
        currency: formData.currency,
        description: formData.description,
        status: formData.status,
      };
      
      if (editingAccount) {
        await updateAccount(editingAccount.id, accountData);
        setAccounts(accounts.map(a => a.id === editingAccount.id ? { ...a, ...accountData } : a));
      } else {
        const newAccount = await createAccount(accountData);
        setAccounts([newAccount, ...accounts]);
      }
      setModalOpen(false);
    } catch (error) {
      console.error('Error saving account:', error);
      alert('Failed to save account');
    }
  };

  const confirmDelete = async () => {
    if (deleteConfirm) {
      try {
        await deleteAccount(deleteConfirm.id);
        setAccounts(accounts.map(a => 
          a.id === deleteConfirm.id 
            ? { ...a, status: 'removed' } 
            : a
        ));
        setDeleteConfirm(null);
        alert('Account deleted successfully (marked as removed due to existing orders)');
      } catch (error) {
        console.error('Error deleting account:', error);
        alert('Failed to delete account');
      }
    }
  };

  const filteredAccounts = accounts.filter(account =>
    (account.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    account.email?.toLowerCase().includes(searchTerm.toLowerCase())) &&
    account.status !== 'removed'
  );

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-900"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="p-6"
      >
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-blue-800 to-indigo-900 rounded-xl">
              <Globe size={20} className="text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-900 to-indigo-900 bg-clip-text text-transparent">
                Accounts
              </h1>
              <p className="text-slate-500 text-lg">Manage platform accounts</p>
            </div>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleCreate}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-800 to-indigo-900 text-white rounded-2xl font-semibold shadow-lg shadow-blue-900/25 hover:shadow-blue-900/40 transition-all"
          >
            <Plus size={20} />
            Add Account
          </motion.button>
        </motion.div>

        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-6"
        >
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-800/20 to-indigo-900/20 rounded-2xl blur-xl" />
            <div className="relative flex items-center gap-3 bg-white/70 backdrop-blur-xl rounded-2xl p-4 border border-white/20 shadow-lg">
              <Search size={20} className="text-slate-400" />
              <input
                type="text"
                placeholder="Search accounts by username or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1 bg-transparent border-none outline-none text-slate-800 placeholder:text-slate-400"
              />
            </div>
          </div>
        </motion.div>

        {/* Accounts Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {filteredAccounts.map((account, index) => {
            const StatusIcon = statusConfig[account.status as keyof typeof statusConfig]?.icon || Globe;
            return (
              <motion.div
                key={account.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.3 + index * 0.05 }}
                className="relative group"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-blue-800/20 to-indigo-900/20 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-500" />
                <div className="relative bg-white/70 backdrop-blur-xl rounded-3xl p-6 border border-white/20 shadow-lg hover:shadow-2xl transition-all duration-300">
                  <div className="flex items-start gap-3 mb-4">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-800 to-indigo-900 flex items-center justify-center text-2xl flex-shrink-0">
                      {platformIcons[account.platform] || "🌐"}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <h3 className="font-bold text-slate-800 truncate">{account.username}</h3>
                          <p className="text-sm text-slate-500 truncate">{account.email}</p>
                        </div>
                        <div className={`px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1 flex-shrink-0 ${statusConfig[account.status as keyof typeof statusConfig]?.color}`}>
                          <StatusIcon size={10} />
                          <span className="whitespace-nowrap">{statusConfig[account.status as keyof typeof statusConfig]?.label || 'Unknown'}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-slate-500">Platform:</span>
                      <span className="font-medium text-slate-700 capitalize">{account.platform}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-slate-500">Price:</span>
                      <span className="font-medium text-slate-700">₦{(account.price_cents / 100).toLocaleString()}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleEdit(account)}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-800 to-indigo-900 text-white rounded-xl font-medium text-sm hover:from-blue-900 hover:to-indigo-900 transition-all"
                    >
                      <Edit size={16} />
                      Edit
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleDelete(account)}
                      className="flex items-center justify-center px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl font-medium text-sm hover:from-red-600 hover:to-red-700 transition-all"
                    >
                      <Trash2 size={16} />
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {filteredAccounts.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <div className="inline-flex p-4 bg-blue-50 rounded-full mb-4">
              <Globe size={48} className="text-blue-800" />
            </div>
            <p className="text-slate-500 text-lg">No accounts found</p>
            <p className="text-slate-400 text-sm mt-2">Try adjusting your search criteria</p>
          </motion.div>
        )}
      </motion.div>

      {/* Create/Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-hidden">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl w-full max-w-md max-h-[90vh] flex flex-col border border-white/20"
          >
            <div className="p-6 border-b border-white/20">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-br from-blue-800 to-indigo-900 rounded-xl">
                  <Sparkles size={20} className="text-white" />
                </div>
                <h2 className="text-2xl font-bold text-slate-800">
                  {editingAccount ? 'Edit Account' : 'Add Account'}
                </h2>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-6">
              <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Platform</label>
                <select
                  value={formData.platform}
                  onChange={(e) => setFormData({ ...formData, platform: e.target.value as any })}
                  className="w-full px-4 py-3 bg-white/50 backdrop-blur border border-white/20 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-900/20 focus:border-blue-900 transition-all"
                >
                  <option value="facebook">Facebook</option>
                  <option value="instagram">Instagram</option>
                  <option value="youtube">YouTube</option>
                  <option value="tiktok">TikTok</option>
                  <option value="twitter">Twitter</option>
                  <option value="linkedin">LinkedIn</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Username</label>
                <input
                  type="text"
                  required
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  className="w-full px-4 py-3 bg-white/50 backdrop-blur border border-white/20 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-900/20 focus:border-blue-900 transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Email</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 bg-white/50 backdrop-blur border border-white/20 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-900/20 focus:border-blue-900 transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Password</label>
                <input
                  type="password"
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full px-4 py-3 bg-white/50 backdrop-blur border border-white/20 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-900/20 focus:border-blue-900 transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Recovery Phone</label>
                <input
                  type="tel"
                  value={formData.recovery_phone}
                  onChange={(e) => setFormData({ ...formData, recovery_phone: e.target.value })}
                  className="w-full px-4 py-3 bg-white/50 backdrop-blur border border-white/20 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-900/20 focus:border-blue-900 transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">2FA Secret</label>
                <input
                  type="text"
                  value={formData.two_factor_secret}
                  onChange={(e) => setFormData({ ...formData, two_factor_secret: e.target.value })}
                  className="w-full px-4 py-3 bg-white/50 backdrop-blur border border-white/20 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-900/20 focus:border-blue-900 transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Price (₦)</label>
                <input
                  type="number"
                  required
                  value={formData.price_cents}
                  onChange={(e) => setFormData({ ...formData, price_cents: e.target.value })}
                  className="w-full px-4 py-3 bg-white/50 backdrop-blur border border-white/20 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-900/20 focus:border-blue-900 transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Currency</label>
                <select
                  value={formData.currency}
                  onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                  className="w-full px-4 py-3 bg-white/50 backdrop-blur border border-white/20 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-900/20 focus:border-blue-900 transition-all"
                >
                  <option value="USD">USD</option>
                  <option value="NGN">NGN</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={2}
                  className="w-full px-4 py-3 bg-white/50 backdrop-blur border border-white/20 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-900/20 focus:border-blue-900 transition-all resize-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                  className="w-full px-4 py-3 bg-white/50 backdrop-blur border border-white/20 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-900/20 focus:border-blue-900 transition-all"
                >
                  <option value="available">Available</option>
                  <option value="reserved">Reserved</option>
                  <option value="sold">Sold</option>
                  <option value="removed">Removed</option>
                </select>
              </div>
              
              <div className="flex gap-4 pt-4">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="flex-1 px-6 py-3 rounded-2xl border-2 border-white/20 text-slate-600 font-semibold hover:bg-white/50 transition-colors backdrop-blur"
                >
                  Cancel
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="flex-1 px-6 py-3 rounded-2xl bg-gradient-to-r from-blue-800 to-indigo-900 text-white font-semibold hover:from-blue-900 hover:to-indigo-900 transition-all shadow-lg shadow-blue-900/25"
                >
                  {editingAccount ? 'Update' : 'Create'}
                </motion.button>
              </div>
              </form>
            </div>
          </motion.div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl w-full max-w-sm p-6 border border-white/20"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-gradient-to-br from-red-400 to-red-500 rounded-xl">
                <Trash2 size={20} className="text-white" />
              </div>
              <h2 className="text-2xl font-bold text-slate-800">Delete Account</h2>
            </div>
            <p className="text-slate-600 mb-6">
              Are you sure you want to delete <strong>{deleteConfirm.username}</strong>? {deleteConfirm.status === 'sold' ? 'Note: This account has existing orders and will be marked as removed instead of deleted.' : 'This action cannot be undone.'}
            </p>
            <div className="flex gap-4">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 px-6 py-3 rounded-2xl border-2 border-white/20 text-slate-600 font-semibold hover:bg-white/50 transition-colors backdrop-blur"
              >
                Cancel
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={confirmDelete}
                className="flex-1 px-6 py-3 rounded-2xl bg-gradient-to-r from-red-500 to-red-600 text-white font-semibold hover:from-red-600 hover:to-red-700 transition-all shadow-lg shadow-red-500/25"
              >
                Delete
              </motion.button>
            </div>
          </motion.div>
        </div>
      )}
    </AdminLayout>
  );
}
