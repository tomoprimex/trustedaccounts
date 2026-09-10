"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { AdminLayout } from "@/components/admin/admin-layout";
import { Save, Globe, Mail, Settings, Sparkles, Shield, Bell, Palette } from "lucide-react";

export default function AdminSettingsPage() {
  const [loading, setLoading] = useState(false);
  const [settings, setSettings] = useState({
    siteName: "TrustedAccounts",
    siteDescription: "Buy and sell verified account credentials securely",
    contactEmail: "support@trustedaccounts.com",
    maintenanceMode: false,
    enableNotifications: true,
    enableAnalytics: true,
  });

  const handleSave = async () => {
    setLoading(true);
    try {
      // Save settings to database
      // For now, just simulate
      await new Promise(resolve => setTimeout(resolve, 1000));
      alert('Settings saved successfully');
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('Failed to save settings');
    } finally {
      setLoading(false);
    }
  };

  const settingSections = [
    {
      title: "General Settings",
      icon: Globe,
      fields: [
        {
          key: "siteName",
          label: "Site Name",
          type: "text",
          placeholder: "Enter site name"
        },
        {
          key: "siteDescription",
          label: "Site Description",
          type: "textarea",
          placeholder: "Enter site description",
          rows: 3
        },
        {
          key: "contactEmail",
          label: "Contact Email",
          type: "email",
          placeholder: "Enter contact email"
        },
      ]
    },
    {
      title: "System Settings",
      icon: Settings,
      fields: [
        {
          key: "maintenanceMode",
          label: "Maintenance Mode",
          type: "toggle",
          description: "Disable the site for maintenance"
        },
        {
          key: "enableNotifications",
          label: "Enable Notifications",
          type: "toggle",
          description: "Send notifications for important events"
        },
        {
          key: "enableAnalytics",
          label: "Enable Analytics",
          type: "toggle",
          description: "Track user behavior and platform metrics"
        },
      ]
    }
  ];

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
              <Settings size={20} className="text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-900 to-indigo-900 bg-clip-text text-transparent">
              Settings
            </h1>
          </div>
          <p className="text-slate-500 text-lg">Manage your application settings</p>
        </motion.div>

        {/* Settings Sections */}
        <div className="space-y-6">
          {settingSections.map((section, sectionIndex) => {
            const SectionIcon = section.icon;
            return (
              <motion.div
                key={section.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: sectionIndex * 0.1 }}
                className="relative"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-blue-800/20 to-indigo-900/20 rounded-3xl blur-xl" />
                <div className="relative bg-white/70 backdrop-blur-xl rounded-3xl p-6 border border-white/20 shadow-lg">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-gradient-to-br from-blue-800 to-indigo-900 rounded-xl">
                      <SectionIcon size={20} className="text-white" />
                    </div>
                    <h2 className="text-xl font-bold text-slate-800">{section.title}</h2>
                  </div>

                  <div className="space-y-6">
                    {section.fields.map((field, fieldIndex) => (
                      <motion.div
                        key={field.key}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: sectionIndex * 0.1 + fieldIndex * 0.05 }}
                      >
                        {field.type === 'toggle' ? (
                          <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50/50 to-indigo-50/50 rounded-2xl border border-blue-100/50 backdrop-blur-sm">
                            <div>
                              <h3 className="font-medium text-slate-800">{field.label}</h3>
                              {field.type === 'toggle' && <p className="text-sm text-slate-500">{(field as { type: string; description: string }).description}</p>}
                            </div>
                            <button
                              onClick={() => setSettings({ ...settings, [field.key]: !settings[field.key as keyof typeof settings] })}
                              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                                settings[field.key as keyof typeof settings] ? 'bg-gradient-to-r from-blue-800 to-indigo-900' : 'bg-slate-300'
                              }`}
                            >
                              <span
                                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                  settings[field.key as keyof typeof settings] ? 'translate-x-6' : 'translate-x-1'
                                }`}
                              />
                            </button>
                          </div>
                        ) : field.type === 'textarea' ? (
                          <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                              {field.label}
                            </label>
                            <textarea
                              value={settings[field.key as keyof typeof settings] as string}
                              onChange={(e) => setSettings({ ...settings, [field.key]: e.target.value })}
                              rows={'rows' in field ? field.rows : 3}
                              placeholder={'placeholder' in field ? field.placeholder : ''}
                              className="w-full px-4 py-3 bg-white/50 backdrop-blur border border-white/20 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-900/20 focus:border-blue-900 transition-all resize-none"
                            />
                          </div>
                        ) : (
                          <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                              {field.label}
                            </label>
                            <input
                              type={field.type}
                              value={settings[field.key as keyof typeof settings] as string}
                              onChange={(e) => setSettings({ ...settings, [field.key]: e.target.value })}
                              placeholder={'placeholder' in field ? field.placeholder : ''}
                              className="w-full px-4 py-3 bg-white/50 backdrop-blur border border-white/20 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-900/20 focus:border-blue-900 transition-all"
                            />
                          </div>
                        )}
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Save Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-8"
        >
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleSave}
            disabled={loading}
            className="flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-800 to-indigo-900 text-white rounded-2xl font-semibold shadow-lg shadow-blue-900/25 hover:shadow-blue-900/40 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Sparkles size={20} />
            {loading ? 'Saving...' : 'Save Settings'}
          </motion.button>
        </motion.div>
      </motion.div>
    </AdminLayout>
  );
}
