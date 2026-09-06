"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { Plus } from "lucide-react";
import { DataTable } from "@/components/dashboard/data-table";
import { Modal } from "@/components/dashboard/modal";
import { getCustomers, updateCustomerStatus, deleteCustomer } from "@/lib/supabase/queries";

const statusConfig = {
  active: { label: "Active", color: "bg-emerald-100 text-emerald-700" },
  inactive: { label: "Inactive", color: "bg-slate-100 text-slate-700" },
  suspended: { label: "Suspended", color: "bg-red-100 text-red-700" },
};

function formatCurrency(cents: number) {
  const amount = cents / 100;
  return `₦${amount.toLocaleString()}`;
}

export default function CustomersPage() {
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<any>(null);
  const [newStatus, setNewStatus] = useState<"active" | "inactive" | "suspended">("active");

  useEffect(() => {
    async function loadCustomers() {
      try {
        const data = await getCustomers({ limit: 100 });
        setCustomers(data || []);
      } catch (error) {
        console.error('Error loading customers:', error);
      } finally {
        setLoading(false);
      }
    }
    loadCustomers();
  }, []);

  const handleUpdateStatus = (customer: any) => {
    setSelectedCustomer(customer);
    setNewStatus(customer.status || 'active');
    setStatusModalOpen(true);
  };

  const handleDelete = (customer: any) => {
    setDeleteConfirm(customer);
  };

  const confirmStatusUpdate = async () => {
    if (selectedCustomer) {
      try {
        const updated = await updateCustomerStatus(selectedCustomer.id, newStatus);
        setCustomers(customers.map(c => c.id === selectedCustomer.id ? { ...c, status: newStatus } : c));
        setStatusModalOpen(false);
      } catch (error) {
        console.error('Error updating customer status:', error);
        alert('Failed to update customer status');
      }
    }
  };

  const confirmDelete = async () => {
    if (deleteConfirm) {
      try {
        await deleteCustomer(deleteConfirm.id);
        setCustomers(customers.filter(c => c.id !== deleteConfirm.id));
        setDeleteConfirm(null);
      } catch (error) {
        console.error('Error deleting customer:', error);
        alert('Failed to delete customer');
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
      key: "full_name",
      label: "Name",
      sortable: true,
    },
    {
      key: "email",
      label: "Email",
      sortable: true,
    },
    {
      key: "phone",
      label: "Phone",
      sortable: true,
      render: (value: string) => value || 'N/A',
    },
    {
      key: "customer_analytics",
      label: "Total Orders",
      sortable: true,
      render: (value: any) => value?.total_orders || 0,
    },
    {
      key: "customer_analytics",
      label: "Total Spent",
      sortable: true,
      render: (value: any) => formatCurrency(value?.total_spent_cents || 0),
    },
    {
      key: "created_at",
      label: "Joined",
      sortable: true,
      render: (value: string) => new Date(value).toLocaleDateString(),
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
              Customers
            </h1>
            <p className="text-slate-500 mt-1">Manage your customer base</p>
          </div>
        </div>
      </motion.div>

      {/* Data Table */}
      <DataTable
        data={customers}
        columns={columns}
        onEdit={handleUpdateStatus}
        onDelete={handleDelete}
        searchable
      />

      {/* Status Update Modal */}
      <Modal
        isOpen={statusModalOpen}
        onClose={() => setStatusModalOpen(false)}
        title="Update Customer Status"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-slate-600">
            Update status for <strong>{selectedCustomer?.full_name}</strong>
          </p>
          <select
            value={newStatus}
            onChange={(e) => setNewStatus(e.target.value as any)}
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="suspended">Suspended</option>
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
        title="Delete Customer"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-slate-600">
            Are you sure you want to delete the customer <strong>{deleteConfirm?.full_name}</strong>? This action cannot be undone.
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
