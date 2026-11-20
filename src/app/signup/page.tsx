"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Check, Loader2, Lock, Mail, User } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { AuthLayout } from "@/components/auth/auth-layout";
import { AuthField, FormMessage } from "@/components/auth/auth-field";

const rules = [
  { label: "8+ characters", test: (p: string) => p.length >= 8 },
  { label: "Lowercase", test: (p: string) => /[a-z]/.test(p) },
  { label: "Uppercase", test: (p: string) => /[A-Z]/.test(p) },
  { label: "Number", test: (p: string) => /\d/.test(p) },
];

export default function SignupPage() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const passed = rules.filter((r) => r.test(password)).length;
  const strengthColor = ["bg-slate-200", "bg-red-500", "bg-amber-500", "bg-blue-500", "bg-emerald-500"][passed];

  async function signUp(e: React.FormEvent) {
    e.preventDefault();
    setMessage(null);

    if (password !== confirmPassword) return setMessage({ type: "error", text: "Passwords do not match." });
    if (passed < 3) return setMessage({ type: "error", text: "Please choose a stronger password." });

    setIsLoading(true);
    const { data, error } = await createClient().auth.signUp({
      email: email.trim(),
      password,
      options: {
        data: { full_name: fullName.trim() },
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    setIsLoading(false);

    if (error) return setMessage({ type: "error", text: error.message });

    if (data.session) {
      setMessage({ type: "success", text: "Account created! Taking you to your dashboard…" });
      window.location.href = "/dashboard";
    } else {
      setMessage({ type: "success", text: `Almost there! We sent a confirmation link to ${email.trim()}. Open it to activate your account.` });
    }
  }

  return (
    <AuthLayout title="Create your account" subtitle="Buy verified social accounts with instant, secure delivery.">
      <form onSubmit={signUp} className="space-y-4">
        <AuthField
          label="Full name"
          icon={User}
          autoComplete="name"
          placeholder="Ada Okafor"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          required
        />
        <AuthField
          label="Email"
          icon={Mail}
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <AuthField
          label="Password"
          icon={Lock}
          type="password"
          autoComplete="new-password"
          placeholder="Create a password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          hint={
            password && (
              <div className="mt-2">
                <div className="flex gap-1" aria-hidden>
                  {rules.map((_, i) => (
                    <span key={i} className={`h-1 flex-1 rounded-full transition-colors ${i < passed ? strengthColor : "bg-slate-200"}`} />
                  ))}
                </div>
                <ul className="mt-2 grid grid-cols-2 gap-x-3 gap-y-1">
                  {rules.map((r) => {
                    const ok = r.test(password);
                    return (
                      <li key={r.label} className={`flex items-center gap-1.5 text-[11px] ${ok ? "text-emerald-600" : "text-slate-500"}`}>
                        <Check size={12} className={ok ? "opacity-100" : "opacity-30"} />
                        {r.label}
                      </li>
                    );
                  })}
                </ul>
              </div>
            )
          }
        />
        <AuthField
          label="Confirm password"
          icon={Lock}
          type="password"
          autoComplete="new-password"
          placeholder="Repeat your password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          aria-invalid={!!confirmPassword && confirmPassword !== password}
        />

        {message && <FormMessage type={message.type}>{message.text}</FormMessage>}

        <button
          type="submit"
          disabled={isLoading}
          className="flex h-11 w-full items-center justify-center gap-2 rounded-xl text-sm font-bold disabled:opacity-60"
        >
          {isLoading ? <Loader2 size={16} className="animate-spin" /> : null}
          {isLoading ? "Creating account…" : "Create account"}
          {!isLoading && <ArrowRight size={16} />}
        </button>

        <p className="text-center text-sm">
          Already have an account?{" "}
          <Link href="/login" className="font-semibold">
            Sign in
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}
