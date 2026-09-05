"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import { AuthLayout } from "@/components/auth/auth-layout";
import { Lock, Eye, EyeOff, ArrowRight, Loader2, CheckCircle } from "lucide-react";
import Link from "next/link";

export default function ResetPasswordPage() {
  const supabase = createClient();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [message, setMessage] = useState("");
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

  async function resetPassword(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");

    if (password !== confirmPassword) {
      setMessage("Passwords do not match");
      setIsLoading(false);
      return;
    }

    if (passwordStrength < 50) {
      setMessage("Password is too weak. Please use a stronger password.");
      setIsLoading(false);
      return;
    }

    const { error } = await supabase.auth.updateUser({
      password: password,
    });

    if (error) {
      setMessage(error.message);
      setIsLoading(false);
    } else {
      setIsSuccess(true);
      setIsLoading(false);
      setMessage("Password reset successfully!");
    }
  }

  return (
    <AuthLayout
      title="Set New Password"
      subtitle="Create a new secure password for your account"
      backLinkText="Back to Sign in"
      backLinkHref="/login"
    >
      {!isSuccess ? (
        <form onSubmit={resetPassword} className="space-y-4">
          {/* Password Input */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            <label className="block text-sm font-medium text-white/80 mb-2">New Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50" size={20} />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={handlePasswordChange}
                required
                className="w-full pl-12 pr-12 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-white/40 transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition-colors"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {/* Password Strength Indicator */}
            {password && (
              <motion.div
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: "100%" }}
                className="mt-2"
              >
                <div className="flex gap-1">
                  {[25, 50, 75, 100].map((threshold) => (
                    <motion.div
                      key={threshold}
                      initial={{ width: 0 }}
                      animate={{ width: "25%" }}
                      className={`h-1 rounded-full transition-colors ${
                        passwordStrength >= threshold
                          ? threshold === 25
                            ? "bg-red-500"
                            : threshold === 50
                            ? "bg-amber-500"
                            : threshold === 75
                            ? "bg-yellow-500"
                            : "bg-emerald-500"
                          : "bg-white/20"
                      }`}
                    />
                  ))}
                </div>
                <p className="text-xs text-white/60 mt-1">
                  {passwordStrength === 0 && "Enter a password"}
                  {passwordStrength === 25 && "Weak password"}
                  {passwordStrength === 50 && "Fair password"}
                  {passwordStrength === 75 && "Good password"}
                  {passwordStrength === 100 && "Strong password"}
                </p>
              </motion.div>
            )}
          </motion.div>

          {/* Confirm Password Input */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.55 }}
          >
            <label className="block text-sm font-medium text-white/80 mb-2">Confirm New Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50" size={20} />
              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="w-full pl-12 pr-12 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-white/40 transition-all"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition-colors"
              >
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {confirmPassword && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-1 flex items-center gap-1 text-xs"
              >
                {password === confirmPassword ? (
                  <span className="text-emerald-400 flex items-center gap-1">
                    Passwords match
                  </span>
                ) : (
                  <span className="text-red-400">Passwords do not match</span>
                )}
              </motion.div>
            )}
          </motion.div>

          {/* Message */}
          {message && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`p-3 rounded-lg text-sm ${
                message.includes("successfully")
                  ? "bg-emerald-500/20 text-emerald-200 border border-emerald-500/30"
                  : "bg-red-500/20 text-red-200 border border-red-500/30"
              }`}
            >
              {message}
            </motion.div>
          )}

          {/* Submit Button */}
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 py-3.5 bg-white text-[#1E3A8A] rounded-xl font-semibold shadow-lg shadow-white/20 hover:shadow-xl hover:shadow-white/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <Loader2 size={20} className="animate-spin" />
                Resetting...
              </>
            ) : (
              <>
                Reset Password
                <ArrowRight size={20} />
              </>
            )}
          </motion.button>
        </form>
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center space-y-6"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ 
              type: "spring", 
              stiffness: 200, 
              damping: 15,
              delay: 0.2
            }}
            className="w-20 h-20 mx-auto rounded-full bg-emerald-500/20 flex items-center justify-center"
          >
            <CheckCircle size={40} className="text-emerald-400" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h3 className="text-xl font-bold text-white mb-2">Password Reset!</h3>
            <p className="text-white/70">
              Your password has been successfully reset. You can now sign in with your new password.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="pt-4 border-t border-white/20"
          >
            <Link
              href="/login"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white text-[#1E3A8A] rounded-xl font-semibold shadow-lg shadow-white/20 hover:shadow-xl hover:shadow-white/30 transition-all"
            >
              Sign In
              <ArrowRight size={20} />
            </Link>
          </motion.div>
        </motion.div>
      )}
    </AuthLayout>
  );
}
