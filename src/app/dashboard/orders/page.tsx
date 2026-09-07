"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { Download } from "lucide-react";
import { DataTable } from "@/components/dashboard/data-table";
import { Modal } from "@/components/dashboard/modal";
import { getOrders, updateOrderStatus, deleteOrder } from "@/lib/supabase/queries";

const statusConfig = {
  completed: { label: "Completed", color: "bg-emerald-100 text-emerald-700" },
  pending: { label: "Pending", color: "bg-amber-100 text-amber-700" },
  processing: { label: "Processing", color: "bg-blue-100 text-blue-700" },
  failed: { label: "Failed", color: "bg-red-100 text-red-700" },
  refunded: { label: "Refunded", color: "bg-slate-100 text-slate-700" },
};

function formatCurrency(cents: number, currency: string) {
  const amount = cents / 100;
  if (currency === 'NGN') {
    return `₦${amount.toLocaleString()}`;
  }
  return `$${amount.toLocaleString()}`;
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<any>(null);
  const [newStatus, setNewStatus] = useState<"completed" | "pending" | "processing" | "failed" | "refunded">("pending");

  useEffect(() => {
    async function loadOrders() {
      try {
        const data = await getOrders({ limit: 100 });
        setOrders(data || []);
      } catch (error) {
        console.error('Error loading orders:', error);
      } finally {
        setLoading(false);
      }
    }
    loadOrders();
  }, []);

  const handleUpdateStatus = (order: any) => {
    setSelectedOrder(order);
    setNewStatus(order.status || 'pending');
    setStatusModalOpen(true);
  };

  const handleDelete = (order: any) => {
    setDeleteConfirm(order);
  };

  const confirmStatusUpdate = async () => {
    if (selectedOrder) {
      try {
        const updated = await updateOrderStatus(selectedOrder.id, newStatus);
        setOrders(orders.map(o => o.id === selectedOrder.id ? { ...o, status: newStatus } : o));
        setStatusModalOpen(false);
      } catch (error) {
        console.error('Error updating order status:', error);
        alert('Failed to update order status');
      }
    }
  };

  const confirmDelete = async () => {
    if (deleteConfirm) {
      try {
        await deleteOrder(deleteConfirm.id);
        setOrders(orders.filter(o => o.id !== deleteConfirm.id));
        setDeleteConfirm(null);
      } catch (error) {
        console.error('Error deleting order:', error);
        alert('Failed to delete order');
      }
    }
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

  const columns = [
    {
      key: "order_number",
      label: "Order ID",
      sortable: true,
    },
    {
      key: "customer",
      label: "Customer",
      sortable: true,
      render: (value: any) => value?.full_name || 'Unknown',
    },
    {
      key: "customer_email",
      label: "Email",
      sortable: true,
      render: (value: any, row: any) => row.customer?.email || 'N/A',
    },
    {
      key: "account",
      label: "Platform",
      sortable: true,
      render: (value: any) => (
        <span className="px-3 py-1.5 rounded-full text-xs font-semibold bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 capitalize">
          {value?.platform || 'N/A'}
        </span>
      ),
    },
    {
      key: "amount_cents",
      label: "Amount",
      sortable: true,
      render: (value: number, row: any) => formatCurrency(value, row.currency),
    },
    {
      key: "status",
      label: "Status",
      sortable: true,
      render: (value: string) => {
        const config = statusConfig[value as keyof typeof statusConfig];
        return (
          <span className={`px-3 py-1.5 rounded-full text-xs font-semibold ${config.color}`}>
            {config.label}
          </span>
        );
      },
    },
    {
      key: "created_at",
      label: "Date",
      sortable: true,
      render: (value: string) => new Date(value).toLocaleDateString(),
    },
  ];

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
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Orders
            </h1>
            <p className="text-slate-500 mt-1">Manage and track all customer orders</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl font-semibold shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all"
          >
            <Download size={20} />
            Export
          </motion.button>
        </div>
      </motion.div>

      {/* Data Table */}
      <DataTable
        data={orders}
        columns={columns}
        onEdit={handleUpdateStatus}
        onDelete={handleDelete}
        searchable
      />

      {/* Status Update Modal */}
      <Modal
        isOpen={statusModalOpen}
        onClose={() => setStatusModalOpen(false)}
        title="Update Order Status"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-slate-600">
            Update status for order <strong>{selectedOrder?.order_number}</strong>
          </p>
          <select
            value={newStatus}
            onChange={(e) => setNewStatus(e.target.value as any)}
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
          >
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="completed">Completed</option>
            <option value="failed">Failed</option>
            <option value="refunded">Refunded</option>
          </select>
          <div className="flex gap-4">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setStatusModalOpen(false)}
              className="flex-1 px-6 py-3 rounded-2xl border-2 border-slate-200 text-slate-600 font-semibold hover:bg-slate-50 transition-colors"
            >
              Cancel
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={confirmStatusUpdate}
              className="flex-1 px-6 py-3 rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg shadow-blue-500/25"
            >
              Update
            </motion.button>
          </div>
        </div>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={!!deleteConfirm}
        onClose={() => setDeleteConfirm(null)}
        title="Delete Order"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-slate-600">
            Are you sure you want to delete the order <strong>{deleteConfirm?.order_number}</strong>? This action cannot be undone.
          </p>
          <div className="flex gap-4">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setDeleteConfirm(null)}
              className="flex-1 px-6 py-3 rounded-2xl border-2 border-slate-200 text-slate-600 font-semibold hover:bg-slate-50 transition-colors"
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
        </div>
      </Modal>
    </DashboardLayout>
  );
}
