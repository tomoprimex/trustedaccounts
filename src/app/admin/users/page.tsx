"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { AdminLayout } from "@/components/admin/admin-layout";
import { Users, Search, Shield, Mail, Calendar, UserCircle, Sparkles } from "lucide-react";
import { getUsers } from "@/lib/supabase/queries";

const roleConfig = {
  admin: { label: "Admin", color: "bg-gradient-to-r from-blue-800 to-indigo-900 text-white", icon: Shield },
  seller: { label: "Seller", color: "bg-gradient-to-r from-indigo-800 to-blue-900 text-white", icon: UserCircle },
  customer: { label: "Customer", color: "bg-gradient-to-r from-slate-800 to-blue-900 text-white", icon: UserCircle },
};

export default function UsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

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

  const filteredUsers = users.filter(user =>
    user.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase())
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
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-gradient-to-br from-blue-800 to-indigo-900 rounded-xl">
              <Users size={20} className="text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-900 to-indigo-900 bg-clip-text text-transparent">
              Users
            </h1>
          </div>
          <p className="text-slate-500 text-lg">Manage all users and their roles</p>
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
                placeholder="Search users by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1 bg-transparent border-none outline-none text-slate-800 placeholder:text-slate-400"
              />
            </div>
          </div>
        </motion.div>

        {/* Users Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {filteredUsers.map((user, index) => {
            const RoleIcon = roleConfig[user.role as keyof typeof roleConfig]?.icon || UserCircle;
            return (
              <motion.div
                key={user.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.3 + index * 0.05 }}
                className="relative group"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-blue-800/20 to-indigo-900/20 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-500" />
                <div className="relative bg-white/70 backdrop-blur-xl rounded-3xl p-6 border border-white/20 shadow-lg hover:shadow-2xl transition-all duration-300">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-800 to-indigo-900 flex items-center justify-center text-white font-bold text-lg">
                        {user.full_name?.charAt(0) || 'U'}
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-800">{user.full_name || 'Unknown'}</h3>
                        <p className="text-sm text-slate-500">{user.email}</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3 mb-4">
                    <div className="flex items-center gap-2 text-sm">
                      <Mail size={16} className="text-slate-400" />
                      <span className="text-slate-600">{user.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar size={16} className="text-slate-400" />
                      <span className="text-slate-600">
                        Joined {new Date(user.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className={`px-4 py-2 rounded-full text-xs font-semibold flex items-center gap-2 ${roleConfig[user.role as keyof typeof roleConfig]?.color}`}>
                      <RoleIcon size={14} />
                      {roleConfig[user.role as keyof typeof roleConfig]?.label || 'Unknown'}
                    </div>
                    <div className="p-2 bg-blue-50 rounded-xl group-hover:bg-blue-100 transition-colors">
                      <Sparkles size={16} className="text-blue-900" />
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {filteredUsers.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <div className="inline-flex p-4 bg-blue-50 rounded-full mb-4">
              <Users size={48} className="text-blue-800" />
            </div>
            <p className="text-slate-500 text-lg">No users found</p>
            <p className="text-slate-400 text-sm mt-2">Try adjusting your search criteria</p>
          </motion.div>
        )}
      </motion.div>
    </AdminLayout>
  );
}
