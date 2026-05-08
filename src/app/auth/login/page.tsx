"use client";

import { useState } from "react";
import Link from "next/link";
import { Eye, EyeOff, Mail, Lock, ArrowRight, TrendingUp } from "lucide-react";
import { signIn, signInWithGoogle } from "@/lib/actions/auth";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const update = (field: string, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const result = await signIn(form);

    // signIn redirects on success so we only get here on error
    if (result?.error) {
      setError(result.error);
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
  setLoading(true)
  setError("")
  const result = await signInWithGoogle()
  if (result?.error) {
    setError(result.error)
    setLoading(false)
    return
  }
  if (result?.url) {
    window.location.href = result.url
  }
}

  return (
    <div className="min-h-screen bg-[#f7f6f2] flex">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-[45%] bg-[#0a1a14] flex-col justify-between p-12 relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "linear-gradient(#1D9E75 1px, transparent 1px), linear-gradient(90deg, #1D9E75 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />

        <div className="absolute top-36 -right-4 w-56 bg-[#0f2d21] border border-[#1D9E75]/20 rounded-2xl p-4 rotate-6 opacity-80">
          <p className="text-[#5DCAA5] text-xs mb-1">Monthly budget</p>
          <p className="text-white text-2xl font-semibold">₦200,000</p>
          <div className="mt-2 h-1.5 bg-[#1D9E75]/20 rounded-full">
            <div className="h-full w-[62%] bg-[#1D9E75] rounded-full" />
          </div>
          <p className="text-[#5DCAA5]/60 text-xs mt-1.5">
            62% used · 12 days left
          </p>
        </div>
        <div className="absolute top-72 -right-2 w-48 bg-[#0f2d21] border border-[#1D9E75]/20 rounded-2xl p-4 -rotate-2 opacity-60">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 rounded-full bg-[#1D9E75] animate-pulse" />
            <p className="text-[#5DCAA5] text-xs">Live sync</p>
          </div>
          <p className="text-white text-sm font-medium">Bolt ride</p>
          <p className="text-[#D85A30] text-lg font-semibold">-₦1,200</p>
          <p className="text-[#5DCAA5]/50 text-xs">Just now</p>
        </div>
        <div className="absolute bottom-36 -right-6 w-52 bg-[#0f2d21] border border-[#1D9E75]/20 rounded-2xl p-4 rotate-3 opacity-50">
          <p className="text-[#5DCAA5] text-xs mb-1">Savings goal</p>
          <p className="text-white text-xl font-semibold">New MacBook</p>
          <div className="mt-2 h-1.5 bg-[#1D9E75]/20 rounded-full">
            <div className="h-full w-[40%] bg-amber-400 rounded-full" />
          </div>
          <p className="text-[#5DCAA5]/60 text-xs mt-1.5">
            40% · ₦240k remaining
          </p>
        </div>

        <div className="relative z-10 flex items-center gap-2.5">
          <div className="w-9 h-9 bg-[#1D9E75] rounded-xl flex items-center justify-center">
            <TrendingUp size={18} className="text-white" />
          </div>
          <span className="text-white text-lg font-semibold tracking-tight">
            SpendWise
          </span>
        </div>

        <div className="relative z-10 space-y-6">
          <div className="space-y-3">
            <h1 className="text-white text-4xl font-semibold leading-tight tracking-tight">
              Welcome
              <br />
              <span className="text-[#1D9E75]">back.</span>
            </h1>
            <p className="text-[#5DCAA5]/70 text-sm leading-relaxed max-w-xs">
              Your budgets, expenses and financial insights are right where you
              left them.
            </p>
          </div>
          <div className="bg-[#0f2d21] border border-[#1D9E75]/20 rounded-2xl p-4 max-w-xs">
            <p className="text-[#5DCAA5]/80 text-sm leading-relaxed italic">
              &ldquo;SpendWise helped me cut my monthly overspending by half in
              just 6 weeks.&rdquo;
            </p>
            <div className="flex items-center gap-2.5 mt-3">
              <div className="w-7 h-7 rounded-full bg-[#1D9E75]/30 flex items-center justify-center text-[#5DCAA5] text-xs font-semibold">
                AO
              </div>
              <div>
                <p className="text-white text-xs font-medium">Adaeze Obi</p>
                <p className="text-[#5DCAA5]/40 text-xs">Lagos, Nigeria</p>
              </div>
            </div>
          </div>
        </div>

        <p className="relative z-10 text-[#5DCAA5]/30 text-xs">
          © 2026 SpendWise. All rights reserved.
        </p>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-105 space-y-8 animate-fade-in">
          <div className="lg:hidden flex items-center gap-2">
            <div className="w-8 h-8 bg-[#1D9E75] rounded-lg flex items-center justify-center">
              <TrendingUp size={15} className="text-white" />
            </div>
            <span className="text-[#0a1a14] text-base font-semibold">
              SpendWise
            </span>
          </div>

          <div className="space-y-1">
            <h2 className="text-[#0a1a14] text-2xl font-semibold tracking-tight">
              Sign in to SpendWise
            </h2>
            <p className="text-[#6b7280] text-sm">
              Don&apos;t have an account?{" "}
              <Link
                href="/auth/register"
                className="text-[#0F6E56] font-medium hover:underline"
              >
                Create one free
              </Link>
            </p>
          </div>

          {error && (
            <div className="px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
              {error}
            </div>
          )}

          <button
            type="button"
            onClick={handleGoogle}
            disabled={loading}
            className="w-full flex items-center justify-center gap-2.5 py-2.5 bg-white border border-[#e5e7eb] hover:bg-[#f9fafb] text-[#0a1a14] text-sm font-medium rounded-xl transition-all duration-200 active:scale-[0.98] disabled:opacity-50"
          >
            <svg viewBox="0 0 24 24" className="w-4 h-4" aria-hidden="true">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            Continue with Google
          </button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#e5e7eb]" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-[#f7f6f2] px-3 text-xs text-[#9ca3af]">
                or sign in with email
              </span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[#0a1a14] text-sm font-medium">
                Email address
              </label>
              <div className="relative">
                <Mail
                  size={15}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9ca3af]"
                />
                <input
                  type="email"
                  placeholder="adaeze@email.com"
                  value={form.email}
                  onChange={(e) => update("email", e.target.value)}
                  required
                  className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#e5e7eb] rounded-xl text-[#0a1a14] text-sm placeholder:text-[#d1d5db] focus:outline-none focus:border-[#1D9E75] focus:ring-2 focus:ring-[#1D9E75]/10 transition-all"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-[#0a1a14] text-sm font-medium">
                  Password
                </label>
                <Link
                  href="/auth/forgot-password"
                  className="text-xs text-[#0F6E56] hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock
                  size={15}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9ca3af]"
                />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={form.password}
                  onChange={(e) => update("password", e.target.value)}
                  required
                  className="w-full pl-10 pr-10 py-2.5 bg-white border border-[#e5e7eb] rounded-xl text-[#0a1a14] text-sm placeholder:text-[#d1d5db] focus:outline-none focus:border-[#1D9E75] focus:ring-2 focus:ring-[#1D9E75]/10 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#9ca3af] hover:text-[#6b7280] transition-colors"
                >
                  {showPassword ?
                    <EyeOff size={15} />
                  : <Eye size={15} />}
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <input
                type="checkbox"
                id="remember"
                className="w-4 h-4 rounded border-[#e5e7eb] accent-[#1D9E75] cursor-pointer"
              />
              <label
                htmlFor="remember"
                className="text-sm text-[#6b7280] cursor-pointer select-none"
              >
                Keep me signed in for 30 days
              </label>
            </div>

            <button
              type="submit"
              disabled={loading || !form.email || !form.password}
              className="w-full flex items-center justify-center gap-2 py-2.5 bg-[#1D9E75] hover:bg-[#0F6E56] disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-medium rounded-xl transition-all duration-200 active:scale-[0.98]"
            >
              {loading ?
                <svg
                  className="animate-spin h-4 w-4 text-white"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8z"
                  />
                </svg>
              : <>
                  Sign in <ArrowRight size={15} />
                </>
              }
            </button>
          </form>

          <p className="text-center text-xs text-[#9ca3af]">
            Protected by 256-bit encryption &amp; Supabase Auth
          </p>
        </div>
      </div>
    </div>
  );
}
