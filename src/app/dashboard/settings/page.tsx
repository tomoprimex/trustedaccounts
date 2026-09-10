"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { User, Bell, Shield, Moon, Sun, Sparkles, ChevronRight } from "lucide-react";
import { getUserProfile, updateUserProfile } from "@/lib/supabase/queries";

export default function SettingsPage() {
  const [darkMode, setDarkMode] = useState(false);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    full_name: '',
    phone: '',
  });

  useEffect(() => {
    async function loadProfile() {
      try {
        const data = await getUserProfile();
        if (data) {
          setProfile(data);
          setFormData({
            full_name: data.full_name || '',
            phone: data.phone || '',
          });
        }
      } catch (error) {
        console.error('Error loading profile:', error);
      } finally {
        setLoading(false);
      }
    }
    loadProfile();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateUserProfile({
        full_name: formData.full_name,
        phone: formData.phone,
      });
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-900"></div>
        </div>
      </DashboardLayout>
    );
  }

  const settingsSections = [
    {
      title: "Profile",
      icon: User,
      items: [
        {
          label: "Full Name",
          value: formData.full_name,
          type: "input",
          onChange: (value: string) => setFormData({ ...formData, full_name: value }),
        },
        {
          label: "Phone",
          value: formData.phone,
          type: "input",
          onChange: (value: string) => setFormData({ ...formData, phone: value }),
        },
        {
          label: "Email",
          value: profile?.email || '',
          type: "readonly",
        },
      ]
    },
    {
      title: "Preferences",
      icon: Bell,
      items: [
        {
          label: "Dark Mode",
          type: "toggle",
          value: darkMode,
          onChange: () => setDarkMode(!darkMode),
        },
        {
          label: "Notifications",
          type: "toggle",
          value: true,
          onChange: () => {},
        },
      ]
    },
    {
      title: "Security",
      icon: Shield,
      items: [
        {
          label: "Two-Factor Auth",
          type: "toggle",
          value: false,
          onChange: () => {},
        },
      ]
    },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-3 px-2 sm:px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-3"
        >
          <div className="flex items-center gap-2 mb-1">
            <div className="p-1.5 bg-gradient-to-br from-blue-900 to-indigo-900 rounded-lg">
              <Sparkles size={14} className="text-white" />
            </div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-blue-900 to-indigo-900 bg-clip-text text-transparent">
              Settings
            </h1>
          </div>
          <p className="text-xs text-slate-500">Manage your account settings</p>
        </motion.div>

        {/* Settings Sections */}
        {settingsSections.map((section, sectionIndex) => {
          const SectionIcon = section.icon;
          return (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: sectionIndex * 0.05 }}
              className="relative"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-900/10 to-indigo-900/10 rounded-xl blur-md" />
              <div className="relative bg-white/80 backdrop-blur-xl rounded-xl p-3 border border-white/30 shadow-sm">
                {/* Section Header */}
                <div className="flex items-center gap-2 mb-3">
                  <div className="p-1.5 bg-gradient-to-br from-blue-900 to-indigo-900 rounded-lg">
                    <SectionIcon size={12} className="text-white" />
                  </div>
                  <h2 className="text-sm font-bold text-slate-900">{section.title}</h2>
                </div>

                {/* Section Items */}
                <div className="space-y-2">
                  {section.items.map((item, itemIndex) => (
                    <motion.div
                      key={item.label}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: sectionIndex * 0.05 + itemIndex * 0.02 }}
                      className="flex items-center justify-between py-2 border-b border-slate-100 last:border-b-0"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="text-[10px] font-medium text-slate-700">{item.label}</p>
                        {item.type === 'readonly' && (
                          <p className="text-[9px] text-slate-500 truncate">{item.value}</p>
                        )}
                      </div>
                      
                      {item.type === 'input' && (
                        <input
                          type="text"
                          value={item.value}
                          onChange={(e) => item.onChange?.(e.target.value)}
                          className="w-24 px-2 py-1 bg-white/50 backdrop-blur border border-white/30 rounded-lg text-[9px] text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-900/20 focus:border-blue-900 transition-all"
                        />
                      )}
                      
                      {item.type === 'toggle' && (
                        <motion.button
                          whileTap={{ scale: 0.95 }}
                          onClick={() => (item as { onChange: () => void }).onChange()}
                          className={`w-8 h-4 rounded-full p-0.5 transition-colors flex-shrink-0 ${
                            item.value ? "bg-gradient-to-r from-blue-900 to-indigo-900" : "bg-slate-300"
                          }`}
                        >
                          <motion.div
                            animate={{ x: item.value ? 16 : 0 }}
                            transition={{ type: "spring", stiffness: 500, damping: 30 }}
                            className="w-3 h-3 rounded-full bg-white shadow-sm"
                          />
                        </motion.button>
                      )}
                      
                      {item.type === 'readonly' && (
                        <ChevronRight size={10} className="text-slate-400 flex-shrink-0" />
                      )}
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          );
        })}

        {/* Save Button */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleSave}
            disabled={saving}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-900 to-indigo-900 text-white rounded-xl font-semibold shadow-lg shadow-blue-900/20 disabled:opacity-50"
          >
            <Sparkles size={12} />
            {saving ? 'Saving...' : 'Save Changes'}
          </motion.button>
        </motion.div>
      </div>
    </DashboardLayout>
  );
}