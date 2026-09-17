"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { AdminLayout } from "@/components/admin/admin-layout";
import { getOrders, updateOrderStatus } from "@/lib/supabase/queries";
import { Check, X, Clock, CreditCard, Building2, Search, Filter } from "lucide-react";

const statusConfig = {
  completed: { label: "Completed", color: "bg-gradient-to-r from-blue-600 to-blue-600 text-white" },
  pending: { label: "Pending", color: "bg-gradient-to-r from-amber-400 to-yellow-500 text-white" },
  processing: { label: "Processing", color: "bg-gradient-to-r from-blue-600 to-blue-700 text-white" },
  failed: { label: "Failed", color: "bg-gradient-to-r from-red-400 to-red-500 text-white" },
  refunded: { label: "Refunded", color: "bg-gradient-to-r from-slate-400 to-slate-500 text-white" },
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadOrders();
  }, [filterStatus, searchTerm]);

  const loadOrders = async () => {
    try {
      const data = await getOrders({
        status: filterStatus,
        search: searchTerm,
        limit: 100,
      });
      setOrders(data || []);
    } catch (error) {
      console.error('Error loading orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (orderId: string) => {
    try {
      await updateOrderStatus(orderId, 'completed');
      alert('Order approved successfully!');
      loadOrders();
    } catch (error) {
      console.error('Error approving order:', error);
      alert('Failed to approve order');
    }
  };

  const handleReject = async (orderId: string) => {
    try {
      await updateOrderStatus(orderId, 'failed');
      alert('Order rejected');
      loadOrders();
    } catch (error) {
      console.error('Error rejecting order:', error);
      alert('Failed to reject order');
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </AdminLayout>
    );
  }

  const pendingOrders = orders.filter(order => order.status === 'pending');
  const otherOrders = orders.filter(order => order.status !== 'pending');

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
            <div className="p-2 bg-gradient-to-br from-blue-600 to-blue-600 rounded-xl">
              <Clock size={20} className="text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-blue-600 bg-clip-text text-transparent">
                Orders Management
              </h1>
              <p className="text-slate-500 text-lg">Manage and approve orders</p>
            </div>
          </div>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-2xl p-6 border border-amber-200">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-amber-500 rounded-xl">
                <Clock size={20} className="text-white" />
              </div>
              <span className="text-sm font-medium text-amber-800">Pending Approval</span>
            </div>
            <p className="text-3xl font-bold text-amber-900">{pendingOrders.length}</p>
          </div>
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-200">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-blue-500 rounded-xl">
                <Check size={20} className="text-white" />
              </div>
              <span className="text-sm font-medium text-blue-800">Completed</span>
            </div>
            <p className="text-3xl font-bold text-blue-900">{otherOrders.filter(o => o.status === 'completed').length}</p>
          </div>
          <div className="bg-gradient-to-br from-slate-50 to-gray-50 rounded-2xl p-6 border border-slate-200">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-slate-500 rounded-xl">
                <Filter size={20} className="text-white" />
              </div>
              <span className="text-sm font-medium text-slate-800">Total Orders</span>
            </div>
            <p className="text-3xl font-bold text-slate-900">{orders.length}</p>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="flex gap-4 mb-6">
          <div className="relative flex-1">
            <Search size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search orders..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white/50 backdrop-blur border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-3 bg-white/50 backdrop-blur border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
            <option value="processing">Processing</option>
            <option value="failed">Failed</option>
          </select>
        </div>

        {/* Pending Orders Section */}
        {pendingOrders.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
              <Clock size={20} className="text-amber-500" />
              Pending Approval ({pendingOrders.length})
            </h2>
            <div className="space-y-4">
              {pendingOrders.map((order) => (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-2xl p-6 border border-amber-200"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-bold text-slate-800">{order.order_number}</h3>
                      <p className="text-sm text-slate-600">
                        {order.customer?.full_name || 'Unknown'} • {order.customer?.email || 'No email'}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      {order.payment_method === 'transfer' ? (
                        <div className="flex items-center gap-1 px-3 py-1 bg-blue-100 rounded-full">
                          <Building2 size={14} className="text-blue-600" />
                          <span className="text-xs font-medium text-blue-800">Bank Transfer</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1 px-3 py-1 bg-green-100 rounded-full">
                          <CreditCard size={14} className="text-green-600" />
                          <span className="text-xs font-medium text-green-800">Paystack</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-xs text-slate-500">Amount</p>
                      <p className="font-bold text-slate-800">₦{(order.amount_cents / 100).toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500">Date</p>
                      <p className="font-medium text-slate-800">{new Date(order.created_at).toLocaleDateString()}</p>
                    </div>
                  </div>

                  {order.payment_reference && (
                    <div className="mb-4">
                      <p className="text-xs text-slate-500 mb-1">Transfer Reference</p>
                      <p className="text-sm bg-white rounded-lg p-2 text-slate-800">{order.payment_reference}</p>
                    </div>
                  )}

                  <div className="flex gap-3">
                    <button
                      onClick={() => handleApprove(order.id)}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl font-medium hover:from-green-700 hover:to-green-800 transition-all"
                    >
                      <Check size={16} />
                      Approve
                    </button>
                    <button
                      onClick={() => handleReject(order.id)}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl font-medium hover:from-red-600 hover:to-red-700 transition-all"
                    >
                      <X size={16} />
                      Reject
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Other Orders */}
        <div>
          <h2 className="text-xl font-bold text-slate-800 mb-4">
            All Orders ({otherOrders.length})
          </h2>
          <div className="bg-white/70 backdrop-blur-xl rounded-2xl border border-white/20 overflow-hidden">
            {otherOrders.length === 0 ? (
              <div className="p-8 text-center text-slate-500">
                No orders found
              </div>
            ) : (
              <table className="w-full">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-600">Order #</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-600">Customer</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-600">Amount</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-600">Method</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-600">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-600">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {otherOrders.map((order) => (
                    <tr key={order.id} className="border-t border-slate-100">
                      <td className="px-6 py-4 text-sm font-medium text-slate-800">{order.order_number}</td>
                      <td className="px-6 py-4 text-sm text-slate-600">{order.customer?.full_name || 'Unknown'}</td>
                      <td className="px-6 py-4 text-sm font-medium text-slate-800">₦{(order.amount_cents / 100).toLocaleString()}</td>
                      <td className="px-6 py-4">
                        {order.payment_method === 'transfer' ? (
                          <div className="flex items-center gap-1">
                            <Building2 size={14} className="text-blue-600" />
                            <span className="text-xs text-slate-600">Transfer</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1">
                            <CreditCard size={14} className="text-green-600" />
                            <span className="text-xs text-slate-600">Paystack</span>
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusConfig[order.status as keyof typeof statusConfig]?.color}`}>
                          {statusConfig[order.status as keyof typeof statusConfig]?.label || order.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600">{new Date(order.created_at).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </motion.div>
    </AdminLayout>
  );
}