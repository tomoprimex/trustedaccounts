"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { Search, Mail, Phone, MapPin, MoreVertical, Calendar } from "lucide-react";

const customers = [
  { id: "CUST-001", name: "Alex Johnson", email: "alex@example.com", phone: "+1 234 567 8901", location: "New York, USA", totalOrders: 12, totalSpent: "$540.00", joinDate: "2024-01-10", status: "active" },
  { id: "CUST-002", name: "Sarah Williams", email: "sarah@example.com", phone: "+1 234 567 8902", location: "Los Angeles, USA", totalOrders: 8, totalSpent: "$360.00", joinDate: "2024-01-08", status: "active" },
  { id: "CUST-003", name: "Mike Chen", email: "mike@example.com", phone: "+1 234 567 8903", location: "San Francisco, USA", totalOrders: 5, totalSpent: "$225.00", joinDate: "2024-01-05", status: "active" },
  { id: "CUST-004", name: "Emma Davis", email: "emma@example.com", phone: "+1 234 567 8904", location: "Chicago, USA", totalOrders: 15, totalSpent: "$675.00", joinDate: "2024-01-03", status: "active" },
  { id: "CUST-005", name: "James Brown", email: "james@example.com", phone: "+1 234 567 8905", location: "Houston, USA", totalOrders: 3, totalSpent: "$135.00", joinDate: "2024-01-01", status: "inactive" },
  { id: "CUST-006", name: "Lisa Anderson", email: "lisa@example.com", phone: "+1 234 567 8906", location: "Phoenix, USA", totalOrders: 20, totalSpent: "$900.00", joinDate: "2023-12-28", status: "active" },
];

const statusConfig = {
  active: { label: "Active", color: "bg-emerald-100 text-emerald-700 border-emerald-200" },
  inactive: { label: "Inactive", color: "bg-slate-100 text-slate-700 border-slate-200" },
};

export default function CustomersPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredCustomers = customers.filter(customer => {
    const matchesSearch = customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         customer.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || customer.status === statusFilter;
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
            <h1 className="text-3xl font-bold text-[#1E3A8A]">Customers</h1>
            <p className="text-slate-500 mt-1">Manage your customer base and their orders</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 px-4 py-2 bg-[#1E3A8A] text-white rounded-lg font-medium shadow-lg shadow-[#1E3A8A]/20"
          >
            <Mail size={18} />
            Email All
          </motion.button>
        </div>
      </motion.div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6"
      >
        <div className="bg-white rounded-2xl shadow-lg shadow-slate-200/50 border border-slate-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">Total Customers</p>
              <p className="text-3xl font-bold text-[#1E3A8A] mt-1">{customers.length}</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-[#1E3A8A]/10 flex items-center justify-center">
              <span className="text-2xl">👥</span>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl shadow-lg shadow-slate-200/50 border border-slate-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">Active</p>
              <p className="text-3xl font-bold text-emerald-600 mt-1">
                {customers.filter(c => c.status === "active").length}
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
              <p className="text-sm font-medium text-slate-500">Total Revenue</p>
              <p className="text-3xl font-bold text-[#1E3A8A] mt-1">$2,835</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-[#1E3A8A]/10 flex items-center justify-center">
              <span className="text-2xl">💰</span>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl shadow-lg shadow-slate-200/50 border border-slate-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">Avg. Orders</p>
              <p className="text-3xl font-bold text-slate-600 mt-1">
                {Math.round(customers.reduce((acc, c) => acc + c.totalOrders, 0) / customers.length)}
              </p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center">
              <span className="text-2xl">📊</span>
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
              placeholder="Search customers by name, email, or ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]/20 focus:border-[#1E3A8A] transition-all"
            />
          </div>
          <div className="flex gap-3">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]/20 focus:border-[#1E3A8A] transition-all appearance-none bg-white cursor-pointer"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>
      </motion.div>

      {/* Customers Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {filteredCustomers.map((customer, index) => {
          const config = statusConfig[customer.status as keyof typeof statusConfig];
          
          return (
            <motion.div
              key={customer.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.4 + index * 0.05 }}
              whileHover={{ y: -4, scale: 1.02 }}
              className="bg-white rounded-2xl shadow-lg shadow-slate-200/50 border border-slate-100 p-6 hover:shadow-xl hover:shadow-slate-200/70 transition-all duration-300 group"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#1E3A8A] to-[#1E40AF] flex items-center justify-center shadow-lg shadow-[#1E3A8A]/20">
                    <span className="text-white font-bold text-lg">
                      {customer.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div>
                    <p className="font-semibold text-slate-700">{customer.name}</p>
                    <p className="text-sm text-slate-500">{customer.email}</p>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium border ${config.color}`}>
                  {config.label}
                </span>
              </div>

              <div className="space-y-3 mb-4">
                <div className="flex items-center gap-2 text-sm">
                  <Phone size={16} className="text-slate-400" />
                  <span className="text-slate-700">{customer.phone}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <MapPin size={16} className="text-slate-400" />
                  <span className="text-slate-700">{customer.location}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Calendar size={16} className="text-slate-400" />
                  <span className="text-slate-700">Joined {customer.joinDate}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-100">
                <div className="text-center">
                  <p className="text-2xl font-bold text-[#1E3A8A]">{customer.totalOrders}</p>
                  <p className="text-xs text-slate-500">Orders</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-[#1E3A8A]">{customer.totalSpent}</p>
                  <p className="text-xs text-slate-500">Total Spent</p>
                </div>
              </div>

              <div className="flex items-center gap-2 mt-4 pt-4 border-t border-slate-100">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex-1 px-3 py-2 rounded-lg bg-[#1E3A8A] text-white text-sm font-medium hover:bg-[#1E40AF] transition-colors"
                >
                  View Details
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"
                >
                  <MoreVertical size={16} />
                </motion.button>
              </div>
            </motion.div>
          );
        })}
      </motion.div>
    </DashboardLayout>
  );
}
