"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { Search, Plus, Copy, Check, Eye, Edit, Trash2 } from "lucide-react";

const accounts = [
  { id: "ACC-001", platform: "Facebook", username: "john_doe_2024", email: "john.doe@example.com", status: "available", price: "$15.00", addedDate: "2024-01-15" },
  { id: "ACC-002", platform: "Instagram", username: "sarah_style", email: "sarah@example.com", status: "available", price: "$15.00", addedDate: "2024-01-15" },
  { id: "ACC-003", platform: "YouTube", username: "TechReviews2024", email: "tech@example.com", status: "sold", price: "$49.00", addedDate: "2024-01-14" },
  { id: "ACC-004", platform: "TikTok", username: "dance_queen", email: "dance@example.com", status: "available", price: "$15.00", addedDate: "2024-01-14" },
  { id: "ACC-005", platform: "Twitter", username: "news_updates", email: "news@example.com", status: "sold", price: "$15.00", addedDate: "2024-01-13" },
  { id: "ACC-006", platform: "Facebook", username: "gaming_pro", email: "gaming@example.com", status: "available", price: "$15.00", addedDate: "2024-01-13" },
  { id: "ACC-007", platform: "Instagram", username: "foodie_life", email: "food@example.com", status: "reserved", price: "$49.00", addedDate: "2024-01-12" },
  { id: "ACC-008", platform: "YouTube", username: "music_vibes", email: "music@example.com", status: "available", price: "$49.00", addedDate: "2024-01-12" },
];

const statusConfig = {
  available: { label: "Available", color: "bg-emerald-100 text-emerald-700 border-emerald-200" },
  sold: { label: "Sold", color: "bg-slate-100 text-slate-700 border-slate-200" },
  reserved: { label: "Reserved", color: "bg-amber-100 text-amber-700 border-amber-200" },
};

export default function AccountsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [platformFilter, setPlatformFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filteredAccounts = accounts.filter(account => {
    const matchesSearch = account.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         account.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         account.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPlatform = platformFilter === "all" || account.platform === platformFilter;
    const matchesStatus = statusFilter === "all" || account.status === statusFilter;
    return matchesSearch && matchesPlatform && matchesStatus;
  });

  const handleCopy = (id: string) => {
    navigator.clipboard.writeText(id);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <DashboardLayout>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-[#1E3A8A]">My Accounts</h1>
            <p className="text-slate-500 mt-1">Manage your available account inventory</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 px-4 py-2 bg-[#1E3A8A] text-white rounded-lg font-medium shadow-lg shadow-[#1E3A8A]/20"
          >
            <Plus size={18} />
            Add Account
          </motion.button>
        </div>
      </motion.div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6"
      >
        <div className="bg-white rounded-2xl shadow-lg shadow-slate-200/50 border border-slate-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">Total Accounts</p>
              <p className="text-3xl font-bold text-[#1E3A8A] mt-1">{accounts.length}</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-[#1E3A8A]/10 flex items-center justify-center">
              <span className="text-2xl">📦</span>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl shadow-lg shadow-slate-200/50 border border-slate-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">Available</p>
              <p className="text-3xl font-bold text-emerald-600 mt-1">
                {accounts.filter(a => a.status === "available").length}
              </p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center">
              <span className="text-2xl">✓</span>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl shadow-lg shadow-slate-200/50 border border-slate-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">Sold</p>
              <p className="text-3xl font-bold text-slate-600 mt-1">
                {accounts.filter(a => a.status === "sold").length}
              </p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center">
              <span className="text-2xl">💰</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-2xl shadow-lg shadow-slate-200/50 border border-slate-100 p-6 mb-6"
      >
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input
              type="text"
              placeholder="Search accounts by username, email, or ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]/20 focus:border-[#1E3A8A] transition-all"
            />
          </div>
          <div className="flex gap-3">
            <select
              value={platformFilter}
              onChange={(e) => setPlatformFilter(e.target.value)}
              className="px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]/20 focus:border-[#1E3A8A] transition-all appearance-none bg-white cursor-pointer"
            >
              <option value="all">All Platforms</option>
              <option value="Facebook">Facebook</option>
              <option value="Instagram">Instagram</option>
              <option value="YouTube">YouTube</option>
              <option value="TikTok">TikTok</option>
              <option value="Twitter">Twitter</option>
            </select>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]/20 focus:border-[#1E3A8A] transition-all appearance-none bg-white cursor-pointer"
            >
              <option value="all">All Status</option>
              <option value="available">Available</option>
              <option value="sold">Sold</option>
              <option value="reserved">Reserved</option>
            </select>
          </div>
        </div>
      </motion.div>

      {/* Accounts Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {filteredAccounts.map((account, index) => {
          const config = statusConfig[account.status as keyof typeof statusConfig];
          
          return (
            <motion.div
              key={account.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.4 + index * 0.05 }}
              whileHover={{ y: -4, scale: 1.02 }}
              className="bg-white rounded-2xl shadow-lg shadow-slate-200/50 border border-slate-100 p-6 hover:shadow-xl hover:shadow-slate-200/70 transition-all duration-300 group"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#1E3A8A] to-[#1E40AF] flex items-center justify-center shadow-lg shadow-[#1E3A8A]/20">
                    <span className="text-white font-bold text-lg">{account.platform[0]}</span>
                  </div>
                  <div>
                    <p className="font-semibold text-slate-700">{account.platform}</p>
                    <p className="text-sm text-slate-500">{account.username}</p>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium border ${config.color}`}>
                  {config.label}
                </span>
              </div>

              <div className="space-y-3 mb-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500">Email</span>
                  <span className="text-slate-700 font-medium">{account.email}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500">Price</span>
                  <span className="text-[#1E3A8A] font-bold">{account.price}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500">Added</span>
                  <span className="text-slate-700">{account.addedDate}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-4 border-t border-slate-100">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleCopy(account.id)}
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors text-sm font-medium"
                >
                  {copiedId === account.id ? <Check size={16} /> : <Copy size={16} />}
                  {copiedId === account.id ? "Copied!" : "Copy ID"}
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-2 rounded-lg bg-slate-100 hover:bg-[#1E3A8A] hover:text-white text-slate-600 transition-colors"
                >
                  <Eye size={16} />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-2 rounded-lg bg-slate-100 hover:bg-blue-600 hover:text-white text-slate-600 transition-colors"
                >
                  <Edit size={16} />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-2 rounded-lg bg-slate-100 hover:bg-red-600 hover:text-white text-slate-600 transition-colors"
                >
                  <Trash2 size={16} />
                </motion.button>
              </div>
            </motion.div>
          );
        })}
      </motion.div>
    </DashboardLayout>
  );
}
