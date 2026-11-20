"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Loader2, Lock, Mail } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { AuthLayout } from "@/components/auth/auth-layout";
import { AuthField, FormMessage } from "@/components/auth/auth-field";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  async function signIn(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    const supabase = createClient();
    const { data, error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });

    if (error) {
      setError(error.message === "Invalid login credentials" ? "Incorrect email or password." : error.message);
      setIsLoading(false);
      return;
    }

    const { data: profile } = await supabase.from("profiles").select("role").eq("id", data.user.id).maybeSingle();
    window.location.href = profile?.role === "admin" ? "/admin" : "/dashboard";
  }

  return (
    <AuthLayout title="Welcome back" subtitle="Sign in to buy, track and manage your accounts.">
      <form onSubmit={signIn} className="space-y-4" noValidate={false}>
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
          autoComplete="current-password"
          placeholder="Your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <div className="flex justify-end">
          <Link href="/forgot-password" className="text-xs font-semibold text-blue-600 hover:underline">
            Forgot password?
          </Link>
        </div>

        {error && <FormMessage type="error">{error}</FormMessage>}

        <button
          type="submit"
          disabled={isLoading}
          className="flex h-11 w-full items-center justify-center gap-2 rounded-xl text-sm font-bold disabled:opacity-60"
        >
          {isLoading ? <Loader2 size={16} className="animate-spin" /> : null}
          {isLoading ? "Signing in…" : "Sign in"}
          {!isLoading && <ArrowRight size={16} />}
        </button>

        <p className="text-center text-sm">
          New to TrustedAccounts?{" "}
          <Link href="/signup" className="font-semibold">
            Create an account
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}
