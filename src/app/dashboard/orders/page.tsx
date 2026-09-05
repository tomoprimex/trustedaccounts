"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { Search, Filter, Download, Eye, MoreVertical } from "lucide-react";

const orders = [
  { id: "#ORD-001", customer: "Alex Johnson", email: "alex@example.com", platform: "Facebook", amount: "$15.00", status: "completed", date: "2024-01-15 14:32" },
  { id: "#ORD-002", customer: "Sarah Williams", email: "sarah@example.com", platform: "Instagram", amount: "$49.00", status: "completed", date: "2024-01-15 14:20" },
  { id: "#ORD-003", customer: "Mike Chen", email: "mike@example.com", platform: "TikTok", amount: "$15.00", status: "pending", date: "2024-01-15 14:05" },
  { id: "#ORD-004", customer: "Emma Davis", email: "emma@example.com", platform: "YouTube", amount: "$49.00", status: "processing", date: "2024-01-15 13:45" },
  { id: "#ORD-005", customer: "James Brown", email: "james@example.com", platform: "Twitter", amount: "$15.00", status: "completed", date: "2024-01-15 13:30" },
  { id: "#ORD-006", customer: "Lisa Anderson", email: "lisa@example.com", platform: "Facebook", amount: "$49.00", status: "completed", date: "2024-01-15 13:15" },
  { id: "#ORD-007", customer: "David Wilson", email: "david@example.com", platform: "Instagram", amount: "$15.00", status: "failed", date: "2024-01-15 12:50" },
  { id: "#ORD-008", customer: "Jennifer Lee", email: "jennifer@example.com", platform: "TikTok", amount: "$49.00", status: "completed", date: "2024-01-15 12:35" },
];

const statusConfig = {
  completed: { label: "Completed", color: "bg-emerald-100 text-emerald-700 border-emerald-200" },
  pending: { label: "Pending", color: "bg-amber-100 text-amber-700 border-amber-200" },
  processing: { label: "Processing", color: "bg-blue-100 text-blue-700 border-blue-200" },
  failed: { label: "Failed", color: "bg-red-100 text-red-700 border-red-200" },
};

export default function OrdersPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

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
            <h1 className="text-3xl font-bold text-[#1E3A8A]">Orders</h1>
            <p className="text-slate-500 mt-1">Manage and track all customer orders</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 px-4 py-2 bg-[#1E3A8A] text-white rounded-lg font-medium shadow-lg shadow-[#1E3A8A]/20"
          >
            <Download size={18} />
            Export
          </motion.button>
        </div>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-2xl shadow-lg shadow-slate-200/50 border border-slate-100 p-6 mb-6"
      >
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input
              type="text"
              placeholder="Search orders by customer, email, or order ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]/20 focus:border-[#1E3A8A] transition-all"
            />
          </div>
          <div className="flex gap-3">
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="pl-10 pr-8 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]/20 focus:border-[#1E3A8A] transition-all appearance-none bg-white cursor-pointer"
              >
                <option value="all">All Status</option>
                <option value="completed">Completed</option>
                <option value="pending">Pending</option>
                <option value="processing">Processing</option>
                <option value="failed">Failed</option>
              </select>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Orders Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-2xl shadow-lg shadow-slate-200/50 border border-slate-100 overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Order ID</th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Customer</th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Platform</th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Amount</th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Date</th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredOrders.map((order, index) => {
                const config = statusConfig[order.status as keyof typeof statusConfig];
                
                return (
                  <motion.tr
                    key={order.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 0.3 + index * 0.05 }}
                    className="hover:bg-slate-50/50 transition-colors group"
                  >
                    <td className="px-6 py-4">
                      <span className="font-semibold text-[#1E3A8A] group-hover:text-[#1E40AF] transition-colors">
                        {order.id}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-slate-700">{order.customer}</p>
                        <p className="text-sm text-slate-500">{order.email}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700">
                        {order.platform}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-semibold text-slate-900">{order.amount}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1.5 rounded-full text-xs font-medium border ${config.color}`}>
                        {config.label}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-500">{order.date}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="p-2 rounded-lg bg-slate-100 hover:bg-[#1E3A8A] hover:text-white text-slate-600 transition-colors"
                        >
                          <Eye size={16} />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"
                        >
                          <MoreVertical size={16} />
                        </motion.button>
                      </div>
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/30 flex items-center justify-between">
          <p className="text-sm text-slate-500">
            Showing {filteredOrders.length} of {orders.length} orders
          </p>
          <div className="flex gap-2">
            <button className="px-4 py-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 transition-colors text-sm font-medium">
              Previous
            </button>
            <button className="px-4 py-2 rounded-lg bg-[#1E3A8A] text-white text-sm font-medium">
              1
            </button>
            <button className="px-4 py-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 transition-colors text-sm font-medium">
              2
            </button>
            <button className="px-4 py-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 transition-colors text-sm font-medium">
              Next
            </button>
          </div>
        </div>
      </motion.div>
    </DashboardLayout>
  );
}
