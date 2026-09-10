"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import { Mail, Lock, Eye, EyeOff, ArrowRight, Loader2, Sparkles } from "lucide-react";
import Link from "next/link";

export default function LoginPage() {
  const supabase = createClient();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error">("error");

  async function signIn(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");

    const { error } = await supabase.auth.signInWithPassword({ email, password });
    
    if (error) {
      setMessage(error.message);
      setMessageType("error");
      setIsLoading(false);
    } else {
      window.location.href = "/dashboard";
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-xs"
      >
        {/* Card */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 to-indigo-900/20 rounded-2xl blur-xl" />
          <div className="relative bg-white/80 backdrop-blur-xl rounded-2xl p-4 border border-white/30 shadow-lg">
            {/* Header */}
            <div className="text-center mb-4">
              <div className="flex items-center justify-center gap-2 mb-2">
                <div className="p-1.5 bg-gradient-to-br from-blue-900 to-indigo-900 rounded-lg">
                  <Sparkles size={12} className="text-white" />
                </div>
                <h1 className="text-lg font-bold bg-gradient-to-r from-blue-900 to-indigo-900 bg-clip-text text-transparent">
                  Welcome Back
                </h1>
              </div>
              <p className="text-[10px] text-slate-500">Sign in to your account</p>
            </div>

            {/* Form */}
            <form onSubmit={signIn} className="space-y-3">
              {/* Email Input */}
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
              >
                <label className="block text-[10px] font-medium text-slate-700 mb-1">Email</label>
                <div className="relative">
                  <Mail className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" size={12} />
                  <input
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full pl-8 pr-3 py-2 bg-white/50 backdrop-blur border border-white/30 rounded-lg text-[10px] text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-900/20 focus:border-blue-900 transition-all"
                  />
                </div>
              </motion.div>

              {/* Password Input */}
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.15 }}
              >
                <label className="block text-[10px] font-medium text-slate-700 mb-1">Password</label>
                <div className="relative">
                  <Lock className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" size={12} />
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full pl-8 pr-8 py-2 bg-white/50 backdrop-blur border border-white/30 rounded-lg text-[10px] text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-900/20 focus:border-blue-900 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    {showPassword ? <EyeOff size={10} /> : <Eye size={10} />}
                  </button>
                </div>
              </motion.div>

              {/* Forgot Password */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-right"
              >
                <Link href="/forgot-password" className="text-[9px] text-blue-900 hover:text-blue-800 transition-colors">
                  Forgot password?
                </Link>
              </motion.div>

              {/* Message */}
              {message && (
                <motion.div
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`p-2 rounded-lg text-[9px] ${
                    messageType === "error" 
                      ? "bg-red-100 text-red-700 border border-red-200" 
                      : "bg-blue-100 text-blue-700 border border-blue-200"
                  }`}
                >
                  {message}
                </motion.div>
              )}

              {/* Submit Button */}
              <motion.button
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-1.5 py-2 bg-gradient-to-r from-blue-900 to-indigo-900 text-white rounded-lg text-[10px] font-semibold shadow-lg shadow-blue-900/20 hover:shadow-blue-900/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <Loader2 size={10} className="animate-spin" />
                    Signing in...
                  </>
                ) : (
                  <>
                    Sign In
                    <ArrowRight size={10} />
                  </>
                )}
              </motion.button>
            </form>

            {/* Sign Up Link */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-center mt-4"
            >
              <p className="text-[9px] text-slate-500">
                Don't have an account?{' '}
                <Link href="/signup" className="text-[9px] font-medium text-blue-900 hover:text-blue-800 transition-colors">
                  Sign up
                </Link>
              </p>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}