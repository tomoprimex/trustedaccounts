"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { Plus } from "lucide-react";
import { DataTable } from "@/components/dashboard/data-table";
import { Modal } from "@/components/dashboard/modal";
import { AccountForm } from "@/components/dashboard/account-form";
import { getAccounts, createAccount, updateAccount, deleteAccount } from "@/lib/supabase/queries";

const statusConfig = {
  available: { label: "Available", color: "bg-emerald-100 text-emerald-700" },
  sold: { label: "Sold", color: "bg-slate-100 text-slate-700" },
  reserved: { label: "Reserved", color: "bg-amber-100 text-amber-700" },
  removed: { label: "Removed", color: "bg-red-100 text-red-700" },
};

function formatCurrency(cents: number, currency: string) {
  const amount = cents / 100;
  if (currency === 'NGN') {
    return `₦${amount.toLocaleString()}`;
  }
  return `$${amount.toLocaleString()}`;
}

export default function AccountsPage() {
  const [accounts, setAccounts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingAccount, setEditingAccount] = useState<any>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<any>(null);

  useEffect(() => {
    async function loadAccounts() {
      try {
        const data = await getAccounts({ limit: 100 });
        setAccounts(data || []);
      } catch (error) {
        console.error('Error loading accounts:', error);
      } finally {
        setLoading(false);
      }
    }
    loadAccounts();
  }, []);

  const handleCreate = () => {
    setEditingAccount(null);
    setModalOpen(true);
  };

  const handleEdit = (account: any) => {
    setEditingAccount(account);
    setModalOpen(true);
  };

  const handleDelete = (account: any) => {
    setDeleteConfirm(account);
  };

  const confirmDelete = async () => {
    if (deleteConfirm) {
      try {
        await deleteAccount(deleteConfirm.id);
        setAccounts(accounts.filter(a => a.id !== deleteConfirm.id));
        setDeleteConfirm(null);
      } catch (error) {
        console.error('Error deleting account:', error);
        alert('Failed to delete account');
      }
    }
  };

  const handleFormSubmit = async (data: any) => {
    try {
      if (editingAccount) {
        const updated = await updateAccount(editingAccount.id, data);
        setAccounts(accounts.map(a => a.id === editingAccount.id ? updated : a));
      } else {
        const created = await createAccount(data);
        setAccounts([created, ...accounts]);
      }
      setModalOpen(false);
    } catch (error) {
      console.error('Error saving account:', error);
      alert('Failed to save account');
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
      key: "platform",
      label: "Platform",
      sortable: true,
      render: (value: string) => (
        <span className="px-3 py-1.5 rounded-full text-xs font-semibold bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 capitalize">
          {value}
        </span>
      ),
    },
    {
      key: "username",
      label: "Username",
      sortable: true,
    },
    {
      key: "email",
      label: "Email",
      sortable: true,
    },
    {
      key: "price_cents",
      label: "Price",
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
      label: "Created",
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
              Accounts
            </h1>
            <p className="text-slate-500 mt-1">Manage your account inventory</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleCreate}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl font-semibold shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all"
          >
            <Plus size={20} />
            Add Account
          </motion.button>
        </div>
      </motion.div>

      {/* Data Table */}
      <DataTable
        data={accounts}
        columns={columns}
        onEdit={handleEdit}
        onDelete={handleDelete}
        searchable
      />

      {/* Create/Edit Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingAccount ? "Edit Account" : "Add New Account"}
        size="lg"
      >
        <AccountForm
          account={editingAccount}
          onSubmit={handleFormSubmit}
          onCancel={() => setModalOpen(false)}
        />
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={!!deleteConfirm}
        onClose={() => setDeleteConfirm(null)}
        title="Delete Account"
        size="sm"
      >
      <div className="space-y-4">
        <p className="text-slate-600">
          Are you sure you want to delete the account <strong>{deleteConfirm?.username}</strong>? This action cannot be undone.
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
