"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import { Mail, Lock, User, Eye, EyeOff, ArrowRight, Loader2, Check, Sparkles } from "lucide-react";
import Link from "next/link";

export default function SignupPage() {
  const supabase = createClient();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error">("error");
  const [passwordStrength, setPasswordStrength] = useState(0);

  const checkPasswordStrength = (pwd: string) => {
    let strength = 0;
    if (pwd.length >= 8) strength += 25;
    if (pwd.match(/[a-z]/)) strength += 25;
    if (pwd.match(/[A-Z]/)) strength += 25;
    if (pwd.match(/[0-9]/)) strength += 25;
    return strength;
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const pwd = e.target.value;
    setPassword(pwd);
    setPasswordStrength(checkPasswordStrength(pwd));
  };

  async function signUp(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");

    if (password !== confirmPassword) {
      setMessage("Passwords do not match");
      setMessageType("error");
      setIsLoading(false);
      return;
    }

    if (passwordStrength < 50) {
      setMessage("Password is too weak. Please use a stronger password.");
      setMessageType("error");
      setIsLoading(false);
      return;
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    });

    if (error) {
      setMessage(error.message);
      setMessageType("error");
      setIsLoading(false);
    } else {
      if (data.user) {
        setMessage("Account created successfully!");
        setMessageType("success");
        setIsLoading(false);
        setTimeout(() => {
          window.location.href = "/dashboard";
        }, 1500);
      } else {
        setMessage("Account created! Please sign in.");
        setMessageType("success");
        setIsLoading(false);
      }
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
                  Create Account
                </h1>
              </div>
              <p className="text-[10px] text-slate-500">Join TrustedAccounts today</p>
            </div>

            {/* Form */}
            <form onSubmit={signUp} className="space-y-2.5">
              {/* Full Name Input */}
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
              >
                <label className="block text-[10px] font-medium text-slate-700 mb-1">Full Name</label>
                <div className="relative">
                  <User className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" size={12} />
                  <input
                    type="text"
                    placeholder="John Doe"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                    className="w-full pl-8 pr-3 py-2 bg-white/50 backdrop-blur border border-white/30 rounded-lg text-[10px] text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-900/20 focus:border-blue-900 transition-all"
                  />
                </div>
              </motion.div>

              {/* Email Input */}
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.15 }}
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
                transition={{ delay: 0.2 }}
              >
                <label className="block text-[10px] font-medium text-slate-700 mb-1">Password</label>
                <div className="relative">
                  <Lock className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" size={12} />
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={handlePasswordChange}
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
                {/* Password Strength */}
                {password && (
                  <div className="flex gap-0.5 mt-1">
                    {[25, 50, 75, 100].map((threshold) => (
                      <div
                        key={threshold}
                        className={`h-0.5 rounded-full flex-1 transition-colors ${
                          passwordStrength >= threshold
                            ? threshold === 25
                              ? "bg-red-500"
                              : threshold === 50
                              ? "bg-amber-500"
                              : threshold === 75
                              ? "bg-yellow-500"
                              : "bg-blue-900"
                            : "bg-slate-200"
                        }`}
                      />
                    ))}
                  </div>
                )}
              </motion.div>

              {/* Confirm Password Input */}
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.25 }}
              >
                <label className="block text-[10px] font-medium text-slate-700 mb-1">Confirm Password</label>
                <div className="relative">
                  <Lock className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" size={12} />
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    className="w-full pl-8 pr-8 py-2 bg-white/50 backdrop-blur border border-white/30 rounded-lg text-[10px] text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-900/20 focus:border-blue-900 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff size={10} /> : <Eye size={10} />}
                  </button>
                </div>
                {confirmPassword && (
                  <div className="mt-1 flex items-center gap-1 text-[8px]">
                    {password === confirmPassword ? (
                      <span className="text-blue-900 flex items-center gap-0.5">
                        <Check size={8} /> Match
                      </span>
                    ) : (
                      <span className="text-red-500">No match</span>
                    )}
                  </div>
                )}
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
                transition={{ delay: 0.3 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-1.5 py-2 bg-gradient-to-r from-blue-900 to-indigo-900 text-white rounded-lg text-[10px] font-semibold shadow-lg shadow-blue-900/20 hover:shadow-blue-900/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <Loader2 size={10} className="animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    Create Account
                    <ArrowRight size={10} />
                  </>
                )}
              </motion.button>
            </form>

            {/* Sign In Link */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.35 }}
              className="text-center mt-3"
            >
              <p className="text-[9px] text-slate-500">
                Already have an account?{' '}
                <Link href="/login" className="text-[9px] font-medium text-blue-900 hover:text-blue-800 transition-colors">
                  Sign in
                </Link>
              </p>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}