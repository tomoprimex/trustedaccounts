"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import { AuthLayout } from "@/components/auth/auth-layout";
import { Mail, Lock, User, Eye, EyeOff, ArrowRight, Loader2, Check } from "lucide-react";
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
      // With email confirmation disabled, user is automatically signed in
      if (data.user) {
        setMessage("Account created successfully!");
        setMessageType("success");
        setIsLoading(false);
        // Redirect to dashboard after short delay
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
    <AuthLayout
      title="Create Account"
      subtitle="Join TrustedAccounts and start selling verified logins"
      backLinkText="Already have an account? Sign in"
      backLinkHref="/login"
    >
      <form onSubmit={signUp} className="space-y-4">
        {/* Full Name Input */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
        >
          <label className="block text-sm font-medium text-white/80 mb-2">Full Name</label>
          <div className="relative">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50" size={20} />
            <input
              type="text"
              placeholder="John Doe"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
              className="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-white/40 transition-all"
            />
          </div>
        </motion.div>

        {/* Email Input */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.55 }}
        >
          <label className="block text-sm font-medium text-white/80 mb-2">Email</label>
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50" size={20} />
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-white/40 transition-all"
            />
          </div>
        </motion.div>

        {/* Password Input */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
        >
          <label className="block text-sm font-medium text-white/80 mb-2">Password</label>
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
          transition={{ delay: 0.65 }}
        >
          <label className="block text-sm font-medium text-white/80 mb-2">Confirm Password</label>
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
                  <Check size={12} /> Passwords match
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
              messageType === "error" 
                ? "bg-red-500/20 text-red-200 border border-red-500/30" 
                : "bg-emerald-500/20 text-emerald-200 border border-emerald-500/30"
            }`}
          >
            {message}
          </motion.div>
        )}

        {/* Submit Button */}
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          disabled={isLoading}
          className="w-full flex items-center justify-center gap-2 py-3.5 bg-white text-[#1E3A8A] rounded-xl font-semibold shadow-lg shadow-white/20 hover:shadow-xl hover:shadow-white/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <>
              <Loader2 size={20} className="animate-spin" />
              Creating account...
            </>
          ) : (
            <>
              Create Account
              <ArrowRight size={20} />
            </>
          )}
        </motion.button>

        {/* Terms */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-center text-xs text-white/60"
        >
          By creating an account, you agree to our{" "}
          <Link href="/terms" className="text-white/80 hover:text-white underline">
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link href="/privacy" className="text-white/80 hover:text-white underline">
            Privacy Policy
          </Link>
        </motion.p>
      </form>
    </AuthLayout>
  );
}
