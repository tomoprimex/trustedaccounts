"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { User, Bell, Shield, CreditCard, Globe, Moon, Sun } from "lucide-react";

export default function SettingsPage() {
  const [darkMode, setDarkMode] = useState(false);

  return (
    <DashboardLayout>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-[#1E3A8A]">Settings</h1>
        <p className="text-slate-500 mt-1">Manage your account settings and preferences</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Settings Navigation */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl shadow-lg shadow-slate-200/50 border border-slate-100 p-4 h-fit"
        >
          <nav className="space-y-1">
            {[
              { icon: User, label: "Profile", active: true },
              { icon: Bell, label: "Notifications", active: false },
              { icon: Shield, label: "Security", active: false },
              { icon: CreditCard, label: "Billing", active: false },
              { icon: Globe, label: "Preferences", active: false },
            ].map((item, index) => {
              const Icon = item.icon;
              return (
                <motion.button
                  key={item.label}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 + index * 0.05 }}
                  whileHover={{ x: 4 }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                    item.active
                      ? "bg-[#1E3A8A] text-white shadow-lg shadow-[#1E3A8A]/20"
                      : "text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  <Icon size={20} />
                  <span className="font-medium">{item.label}</span>
                </motion.button>
              );
            })}
          </nav>
        </motion.div>

        {/* Settings Content */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-2 space-y-6"
        >
          {/* Profile Section */}
          <div className="bg-white rounded-2xl shadow-lg shadow-slate-200/50 border border-slate-100 p-6">
            <h2 className="text-xl font-bold text-[#1E3A8A] mb-6">Profile Information</h2>
            
            <div className="flex items-center gap-6 mb-6">
              <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-[#1E3A8A] to-[#1E40AF] flex items-center justify-center shadow-lg shadow-[#1E3A8A]/20">
                <span className="text-white font-bold text-3xl">TA</span>
              </div>
              <div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-4 py-2 bg-[#1E3A8A] text-white rounded-lg font-medium text-sm"
                >
                  Change Photo
                </motion.button>
                <p className="text-sm text-slate-500 mt-2">JPG, PNG or GIF. Max size 2MB.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">First Name</label>
                <input
                  type="text"
                  defaultValue="Trusted"
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]/20 focus:border-[#1E3A8A] transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Last Name</label>
                <input
                  type="text"
                  defaultValue="Accounts"
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]/20 focus:border-[#1E3A8A] transition-all"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-2">Email Address</label>
                <input
                  type="email"
                  defaultValue="admin@trustedaccounts.com"
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]/20 focus:border-[#1E3A8A] transition-all"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-2">Bio</label>
                <textarea
                  rows={3}
                  defaultValue="Premium verified logins for all major social media platforms."
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]/20 focus:border-[#1E3A8A] transition-all resize-none"
                />
              </div>
            </div>

            <div className="flex justify-end mt-6">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-2.5 bg-[#1E3A8A] text-white rounded-lg font-medium shadow-lg shadow-[#1E3A8A]/20"
              >
                Save Changes
              </motion.button>
            </div>
          </div>

          {/* Preferences Section */}
          <div className="bg-white rounded-2xl shadow-lg shadow-slate-200/50 border border-slate-100 p-6">
            <h2 className="text-xl font-bold text-[#1E3A8A] mb-6">Preferences</h2>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-white shadow-sm">
                    {darkMode ? <Moon size={20} className="text-[#1E3A8A]" /> : <Sun size={20} className="text-[#1E3A8A]" />}
                  </div>
                  <div>
                    <p className="font-medium text-slate-700">Dark Mode</p>
                    <p className="text-sm text-slate-500">Toggle dark theme</p>
                  </div>
                </div>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setDarkMode(!darkMode)}
                  className={`w-14 h-8 rounded-full p-1 transition-colors ${
                    darkMode ? "bg-[#1E3A8A]" : "bg-slate-300"
                  }`}
                >
                  <motion.div
                    animate={{ x: darkMode ? 24 : 0 }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    className="w-6 h-6 rounded-full bg-white shadow-md"
                  />
                </motion.button>
              </div>

              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-white shadow-sm">
                    <Bell size={20} className="text-[#1E3A8A]" />
                  </div>
                  <div>
                    <p className="font-medium text-slate-700">Email Notifications</p>
                    <p className="text-sm text-slate-500">Receive order updates</p>
                  </div>
                </div>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  className="w-14 h-8 rounded-full p-1 bg-[#1E3A8A] transition-colors"
                >
                  <motion.div
                    animate={{ x: 24 }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    className="w-6 h-6 rounded-full bg-white shadow-md"
                  />
                </motion.button>
              </div>

              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-white shadow-sm">
                    <Shield size={20} className="text-[#1E3A8A]" />
                  </div>
                  <div>
                    <p className="font-medium text-slate-700">Two-Factor Authentication</p>
                    <p className="text-sm text-slate-500">Add extra security</p>
                  </div>
                </div>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  className="w-14 h-8 rounded-full p-1 bg-slate-300 transition-colors"
                >
                  <motion.div
                    className="w-6 h-6 rounded-full bg-white shadow-md"
                  />
                </motion.button>
              </div>
            </div>
          </div>

          {/* Danger Zone */}
          <div className="bg-white rounded-2xl shadow-lg shadow-red-200/50 border border-red-200 p-6">
            <h2 className="text-xl font-bold text-red-600 mb-4">Danger Zone</h2>
            <p className="text-slate-600 mb-4">Once you delete your account, there is no going back. Please be certain.</p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-2.5 bg-red-600 text-white rounded-lg font-medium shadow-lg shadow-red-600/20 hover:bg-red-700 transition-colors"
            >
              Delete Account
            </motion.button>
          </div>
        </motion.div>
      </div>
    </DashboardLayout>
  );
}
