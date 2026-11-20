"use client";

import { useId, useState, type InputHTMLAttributes } from "react";
import { Eye, EyeOff, type LucideIcon } from "lucide-react";

interface AuthFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  icon: LucideIcon;
  hint?: React.ReactNode;
}

export function AuthField({ label, icon: Icon, hint, type = "text", ...props }: AuthFieldProps) {
  const id = useId();
  const [reveal, setReveal] = useState(false);
  const isPassword = type === "password";

  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-xs font-semibold text-slate-700">
        {label}
      </label>
      <div className="relative">
        <Icon size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          id={id}
          type={isPassword && reveal ? "text" : type}
          className={`h-11 w-full rounded-xl border border-slate-200 bg-white pl-10 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 ${
            isPassword ? "pr-11" : "pr-3"
          }`}
          {...props}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setReveal((r) => !r)}
            aria-label={reveal ? "Hide password" : "Show password"}
            className="absolute right-1.5 top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
          >
            {reveal ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        )}
      </div>
      {hint}
    </div>
  );
}

export function FormMessage({ type, children }: { type: "success" | "error"; children: React.ReactNode }) {
  return (
    <div
      role={type === "error" ? "alert" : "status"}
      className={`rounded-xl border px-3 py-2.5 text-sm ${
        type === "error" ? "border-red-200 bg-red-50 text-red-700" : "border-emerald-200 bg-emerald-50 text-emerald-700"
      }`}
    >
      {children}
    </div>
  );
}
