"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { AdminLayout } from "@/components/admin/admin-layout";
import { DataTable } from "@/components/dashboard/data-table";
import { getUsers } from "@/lib/supabase/queries";

const roleConfig = {
  admin: { label: "Admin", color: "bg-purple-100 text-purple-700" },
  seller: { label: "Seller", color: "bg-blue-100 text-blue-700" },
  customer: { label: "Customer", color: "bg-emerald-100 text-emerald-700" },
};

export default function UsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadUsers() {
      try {
        const data = await getUsers({ limit: 100 });
        setUsers(data || []);
      } catch (error) {
        console.error('Error loading users:', error);
      } finally {
        setLoading(false);
      }
    }
    loadUsers();
  }, []);

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1E3A8A]"></div>
        </div>
      </AdminLayout>
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
      key: "role",
      label: "Role",
      sortable: true,
      render: (value: string) => {
        const config = roleConfig[value as keyof typeof roleConfig] || roleConfig.customer;
        return (
          <span className={`px-3 py-1.5 rounded-full text-xs font-semibold ${config.color}`}>
            {config.label}
          </span>
        );
      },
    },
    {
      key: "created_at",
      label: "Joined",
      sortable: true,
      render: (value: string) => new Date(value).toLocaleDateString(),
    },
  ];

  return (
    <AdminLayout>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Users
          </h1>
          <p className="text-slate-500 mt-1">Manage all users and their roles</p>
        </div>
      </motion.div>

      <DataTable
        data={users}
        columns={columns}
        searchable
      />
    </AdminLayout>
  );
}
