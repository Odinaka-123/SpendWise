"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

// ─── Animated counter ─────────────────────────────────────────────────────────
function Counter({
  to,
  prefix = "",
  suffix = "",
}: {
  to: number;
  prefix?: string;
  suffix?: string;
}) {
  const [val, setVal] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        let start = 0;
        const step = to / 60;
        const tick = () => {
          start += step;
          if (start >= to) {
            setVal(to);
            return;
          }
          setVal(Math.floor(start));
          requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      },
      { threshold: 0.5 },
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [to]);

  return (
    <span ref={ref}>
      {prefix}
      {val.toLocaleString()}
      {suffix}
    </span>
  );
}

// ─── Feature card ─────────────────────────────────────────────────────────────
function FeatureCard({
  icon,
  title,
  desc,
  delay,
}: {
  icon: string;
  title: string;
  desc: string;
  delay: string;
}) {
  return (
    <div
      className="group relative p-6 rounded-2xl border border-white/8 bg-white/3 backdrop-blur-sm hover:bg-white/6 hover:border-[#1D9E75]/40 transition-all duration-500 animate-fade-up"
      style={{ animationDelay: delay }}
    >
      {/* Glow on hover */}
      <div
        className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{
          background:
            "radial-gradient(circle at 50% 0%, rgba(29,158,117,0.08) 0%, transparent 70%)",
        }}
      />
      <div className="text-3xl mb-4">{icon}</div>
      <h3 className="text-white font-semibold text-base mb-2 font-display">
        {title}
      </h3>
      <p className="text-white/50 text-sm leading-relaxed">{desc}</p>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#060d09] text-white overflow-x-hidden font-body">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=DM+Sans:wght@300;400;500;600&display=swap');

        .font-display { font-family: 'Instrument Serif', serif; }
        .font-body    { font-family: 'DM Sans', sans-serif; }

        @keyframes fade-up {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes fade-in {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50%       { transform: translateY(-12px) rotate(1deg); }
        }
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        @keyframes pulse-ring {
          0%   { transform: scale(0.9); opacity: 0.6; }
          100% { transform: scale(1.4); opacity: 0; }
        }

        .animate-fade-up  { animation: fade-up  0.7s ease forwards; opacity: 0; }
        .animate-fade-in  { animation: fade-in  1s ease forwards;   opacity: 0; }
        .animate-float    { animation: float 6s ease-in-out infinite; }
        .animate-spin-slow { animation: spin-slow 20s linear infinite; }
        .animate-pulse-ring { animation: pulse-ring 2s ease-out infinite; }

        .gradient-text {
          background: linear-gradient(135deg, #1D9E75 0%, #4ECDA4 50%, #1D9E75 100%);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: shimmer 4s linear infinite;
        }
        @keyframes shimmer {
          to { background-position: 200% center; }
        }

        .noise-bg::before {
          content: '';
          position: fixed;
          inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E");
          pointer-events: none;
          z-index: 0;
        }

        .glow-btn {
          position: relative;
          overflow: hidden;
        }
        .glow-btn::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, #1D9E75, #0F6E56);
          opacity: 1;
          transition: opacity 0.3s;
        }
        .glow-btn::after {
          content: '';
          position: absolute;
          inset: -2px;
          background: linear-gradient(135deg, #1D9E75, #4ECDA4, #1D9E75);
          border-radius: inherit;
          z-index: -1;
          opacity: 0;
          transition: opacity 0.3s;
          background-size: 200% auto;
          animation: shimmer 3s linear infinite;
        }
        .glow-btn:hover::after { opacity: 1; }

        .card-mock {
          background: linear-gradient(145deg, rgba(29,158,117,0.06), rgba(255,255,255,0.02));
          border: 1px solid rgba(29,158,117,0.15);
        }
      `}</style>

      {/* ── Noise overlay ── */}
      <div className="noise-bg" />

      {/* ── Background mesh ── */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div
          className="absolute top-[-20%] left-[-10%] w-150 h-150 rounded-full opacity-20"
          style={{
            background: "radial-gradient(circle, #1D9E75 0%, transparent 70%)",
            filter: "blur(80px)",
          }}
        />
        <div
          className="absolute bottom-[-20%] right-[-10%] w-125 h-125 rounded-full opacity-10"
          style={{
            background: "radial-gradient(circle, #4ECDA4 0%, transparent 70%)",
            filter: "blur(100px)",
          }}
        />
        <div
          className="absolute top-[40%] right-[20%] w-75 h-75 rounded-full opacity-8"
          style={{
            background: "radial-gradient(circle, #1D9E75 0%, transparent 70%)",
            filter: "blur(60px)",
          }}
        />
      </div>

      {/* ══════════════════════════════════════════════════════ NAV */}
      <nav className="relative z-10 flex items-center justify-between px-6 md:px-12 py-6">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#1D9E75] flex items-center justify-center">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path
                d="M2 4h12M2 8h8M2 12h10"
                stroke="white"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
            </svg>
          </div>
          <span className="font-display text-lg text-white tracking-tight">
            SpendWise
          </span>
        </div>

        <div className="hidden md:flex items-center gap-8">
          {["Features", "Pricing", "About"].map((item) => (
            <a
              key={item}
              href="#"
              className="text-sm text-white/50 hover:text-white transition-colors duration-200"
            >
              {item}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/auth/login"
            className="text-sm text-white/60 hover:text-white transition-colors duration-200 px-4 py-2"
          >
            Log in
          </Link>
          <Link
            href="/auth/register"
            className="glow-btn relative text-sm font-medium text-white px-5 py-2.5 rounded-xl overflow-hidden"
          >
            <span className="relative z-10">Get started</span>
          </Link>
        </div>
      </nav>

      {/* ══════════════════════════════════════════════════════ HERO */}
      <section className="relative z-10 px-6 md:px-12 pt-20 pb-32 max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left copy */}
          <div className="space-y-8">
            {/* Badge */}
            <div
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#1D9E75]/30 bg-[#1D9E75]/8 animate-fade-up"
              style={{ animationDelay: "0.1s" }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#1D9E75] animate-pulse" />
              <span className="text-xs text-[#4ECDA4] font-medium tracking-wide">
                Smart finance for Nigeria
              </span>
            </div>

            {/* Headline */}
            <div className="animate-fade-up" style={{ animationDelay: "0.2s" }}>
              <h1 className="font-display text-5xl md:text-6xl xl:text-7xl leading-[1.05] text-white">
                Know where
                <br />
                every <span className="gradient-text italic">naira</span>
                <br />
                goes.
              </h1>
            </div>

            <p
              className="text-white/50 text-lg leading-relaxed max-w-md animate-fade-up"
              style={{ animationDelay: "0.35s" }}
            >
              Track expenses, set budgets, and understand your spending — all in
              one clean dashboard built for everyday Nigerians.
            </p>

            {/* CTAs */}
            <div
              className="flex items-center gap-4 animate-fade-up"
              style={{ animationDelay: "0.45s" }}
            >
              <Link
                href="/auth/register"
                className="glow-btn relative inline-flex items-center gap-2 px-7 py-3.5 rounded-xl text-sm font-semibold text-white overflow-hidden group"
              >
                <span className="relative z-10 flex items-center gap-2">
                  Start for free
                  <svg
                    className="w-4 h-4 group-hover:translate-x-1 transition-transform"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M13 7l5 5m0 0l-5 5m5-5H6"
                    />
                  </svg>
                </span>
              </Link>
              <Link
                href="/auth/login"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl text-sm font-medium text-white/60 hover:text-white border border-white/10 hover:border-white/20 transition-all duration-300"
              >
                Sign in
              </Link>
            </div>

            {/* Social proof */}
            <div
              className="flex items-center gap-4 pt-2 animate-fade-up"
              style={{ animationDelay: "0.55s" }}
            >
              <div className="flex -space-x-2">
                {["#1D9E75", "#4ECDA4", "#0F6E56", "#2DD4AB"].map((c, i) => (
                  <div
                    key={i}
                    className="w-8 h-8 rounded-full border-2 border-[#060d09] flex items-center justify-center text-[10px] font-bold text-white"
                    style={{ backgroundColor: c }}
                  >
                    {["A", "K", "E", "T"][i]}
                  </div>
                ))}
              </div>
              <p className="text-sm text-white/40">
                <span className="text-white/70 font-medium">2,400+</span> users
                tracking smarter
              </p>
            </div>
          </div>

          {/* Right — dashboard mock */}
          <div
            className="relative animate-fade-up"
            style={{ animationDelay: "0.3s" }}
          >
            {/* Floating ring */}
            <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full border border-[#1D9E75]/20 animate-spin-slow" />
            <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full border border-[#1D9E75]/10 animate-pulse-ring" />

            <div className="animate-float">
              {/* Main card */}
              <div className="card-mock rounded-3xl p-6 space-y-5 backdrop-blur-xl">
                {/* Header */}
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white/40 text-xs">May 2026</p>
                    <p className="text-white font-display text-2xl mt-0.5">
                      ₦200,000
                    </p>
                    <p className="text-[#4ECDA4] text-xs mt-0.5">
                      +12% vs last month
                    </p>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-[#1D9E75]/20 flex items-center justify-center">
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#1D9E75"
                      strokeWidth="2"
                    >
                      <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                    </svg>
                  </div>
                </div>

                {/* Spending bar */}
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-white/40">Monthly spent</span>
                    <span className="text-white/70">₦82,800 / ₦120,000</span>
                  </div>
                  <div className="h-1.5 bg-white/8 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: "69%",
                        background: "linear-gradient(90deg, #1D9E75, #4ECDA4)",
                      }}
                    />
                  </div>
                </div>

                {/* Category bars */}
                <div className="space-y-3">
                  {[
                    {
                      label: "Groceries",
                      pct: 72,
                      amount: "₦14,350",
                      color: "#1D9E75",
                    },
                    {
                      label: "Housing",
                      pct: 70,
                      amount: "₦35,000",
                      color: "#4ECDA4",
                    },
                    {
                      label: "Dining",
                      pct: 40,
                      amount: "₦6,000",
                      color: "#0F6E56",
                    },
                    {
                      label: "Transport",
                      pct: 28,
                      amount: "₦2,800",
                      color: "#2DD4AB",
                    },
                  ].map((c) => (
                    <div key={c.label} className="space-y-1.5">
                      <div className="flex justify-between text-xs">
                        <span className="text-white/50">{c.label}</span>
                        <span className="text-white/70">{c.amount}</span>
                      </div>
                      <div className="h-1 bg-white/6 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-1000"
                          style={{
                            width: `${c.pct}%`,
                            backgroundColor: c.color,
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Recent txns */}
                <div className="border-t border-white/6 pt-4 space-y-2.5">
                  <p className="text-white/30 text-[10px] uppercase tracking-widest">
                    Recent
                  </p>
                  {[
                    {
                      name: "Shoprite Ikeja",
                      cat: "Groceries",
                      amount: "-₦4,350",
                      color: "#1D9E75",
                    },
                    {
                      name: "Salary credit",
                      cat: "Income",
                      amount: "+₦200,000",
                      color: "#4ECDA4",
                    },
                    {
                      name: "Netflix",
                      cat: "Entertainment",
                      amount: "-₦4,600",
                      color: "#0F6E56",
                    },
                  ].map((t) => (
                    <div
                      key={t.name}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center gap-2.5">
                        <div
                          className="w-7 h-7 rounded-lg flex items-center justify-center text-[10px] font-bold text-white"
                          style={{
                            backgroundColor: t.color + "30",
                            color: t.color,
                          }}
                        >
                          {t.name[0]}
                        </div>
                        <div>
                          <p className="text-white/80 text-xs font-medium">
                            {t.name}
                          </p>
                          <p className="text-white/30 text-[10px]">{t.cat}</p>
                        </div>
                      </div>
                      <span
                        className="text-xs font-semibold"
                        style={{
                          color:
                            t.amount.startsWith("+") ?
                              "#4ECDA4"
                            : "rgba(255,255,255,0.7)",
                        }}
                      >
                        {t.amount}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Floating alert card */}
              <div
                className="absolute -bottom-6 -left-8 card-mock rounded-2xl px-4 py-3 flex items-center gap-3 backdrop-blur-xl"
                style={{ animationDelay: "0.8s" }}
              >
                <div className="w-8 h-8 rounded-xl bg-amber-500/20 flex items-center justify-center text-amber-400 text-sm">
                  ⚠
                </div>
                <div>
                  <p className="text-white text-xs font-medium">
                    Dining at 75%
                  </p>
                  <p className="text-white/40 text-[10px]">
                    ₦2,000 left this month
                  </p>
                </div>
              </div>

              {/* Floating stat card */}
              <div className="absolute -top-4 -left-6 card-mock rounded-2xl px-4 py-3 backdrop-blur-xl">
                <p className="text-white/40 text-[10px]">Net savings</p>
                <p className="text-[#4ECDA4] font-display text-lg">+₦117,200</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════ STATS */}
      <section className="relative z-10 border-y border-white/6 bg-white/2 backdrop-blur-sm">
        <div className="max-w-5xl mx-auto px-6 md:px-12 py-12 grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { value: 2400, suffix: "+", label: "Active users" },
            { value: 98, suffix: "%", label: "Uptime" },
            { value: 50, suffix: "M+", label: "Naira tracked" },
            { value: 4, suffix: ".9★", label: "User rating" },
          ].map((s) => (
            <div key={s.label} className="text-center">
              <p className="font-display text-3xl md:text-4xl text-white">
                <Counter to={s.value} suffix={s.suffix} />
              </p>
              <p className="text-white/40 text-sm mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════ FEATURES */}
      <section className="relative z-10 px-6 md:px-12 py-28 max-w-7xl mx-auto">
        <div className="text-center mb-16 space-y-4">
          <p className="text-[#1D9E75] text-sm font-medium tracking-widest uppercase animate-fade-up">
            Everything you need
          </p>
          <h2
            className="font-display text-4xl md:text-5xl text-white animate-fade-up"
            style={{ animationDelay: "0.1s" }}
          >
            Built for how you
            <br />
            <span className="gradient-text italic">actually</span> spend
          </h2>
          <p
            className="text-white/40 max-w-md mx-auto text-base animate-fade-up"
            style={{ animationDelay: "0.2s" }}
          >
            No spreadsheets. No complexity. Just clarity.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            {
              icon: "📊",
              title: "Real-time dashboard",
              desc: "See your full financial picture at a glance — income, expenses, net, and trends updated instantly.",
              delay: "0.1s",
            },
            {
              icon: "🔔",
              title: "Budget alerts",
              desc: "Set limits per category. Get notified before you overspend — not after.",
              delay: "0.15s",
            },
            {
              icon: "🔁",
              title: "Recurring transactions",
              desc: "Schedule rent, subscriptions, and salary. They post automatically every cycle.",
              delay: "0.2s",
            },
            {
              icon: "📄",
              title: "PDF & CSV exports",
              desc: "Download beautiful reports for any date range. Share with your accountant or keep for yourself.",
              delay: "0.25s",
            },
            {
              icon: "🏷️",
              title: "Smart categories",
              desc: "Every transaction tagged automatically. Filter, analyse, and find patterns instantly.",
              delay: "0.3s",
            },
            {
              icon: "🔒",
              title: "Bank-grade security",
              desc: "Row-level security with Supabase. Your data is yours — nobody else can touch it.",
              delay: "0.35s",
            },
          ].map((f) => (
            <FeatureCard key={f.title} {...f} />
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════ CTA */}
      <section className="relative z-10 px-6 md:px-12 py-28">
        <div className="max-w-3xl mx-auto text-center space-y-8">
          <div className="relative inline-block animate-fade-up">
            {/* Big glow blob behind text */}
            <div
              className="absolute inset-0 -m-16 rounded-full opacity-30 pointer-events-none"
              style={{
                background:
                  "radial-gradient(circle, #1D9E75 0%, transparent 70%)",
                filter: "blur(40px)",
              }}
            />
            <h2 className="relative font-display text-5xl md:text-6xl text-white leading-tight">
              Start tracking
              <br />
              <span className="gradient-text italic">today.</span>
            </h2>
          </div>

          <p
            className="text-white/40 text-lg animate-fade-up"
            style={{ animationDelay: "0.15s" }}
          >
            Free forever. No credit card. No catch.
          </p>

          <div
            className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-up"
            style={{ animationDelay: "0.25s" }}
          >
            <Link
              href="/auth/register"
              className="glow-btn relative w-full sm:w-auto inline-flex items-center justify-center gap-2 px-10 py-4 rounded-xl text-base font-semibold text-white overflow-hidden group"
            >
              <span className="relative z-10 flex items-center gap-2">
                Create free account
                <svg
                  className="w-4 h-4 group-hover:translate-x-1 transition-transform"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                  />
                </svg>
              </span>
            </Link>
            <Link
              href="/auth/login"
              className="w-full sm:w-auto inline-flex items-center justify-center px-10 py-4 rounded-xl text-base font-medium text-white/50 hover:text-white border border-white/10 hover:border-white/20 transition-all duration-300"
            >
              Already have an account
            </Link>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════ FOOTER */}
      <footer className="relative z-10 border-t border-white/6 px-6 md:px-12 py-10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-[#1D9E75] flex items-center justify-center">
              <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
                <path
                  d="M2 4h12M2 8h8M2 12h10"
                  stroke="white"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />
              </svg>
            </div>
            <span className="font-display text-white/60 text-sm">
              SpendWise
            </span>
          </div>
          <p className="text-white/25 text-xs">
            © {new Date().getFullYear()} SpendWise. Built with care in Lagos.
          </p>
          <div className="flex items-center gap-6">
            {["Privacy", "Terms", "Support"].map((l) => (
              <a
                key={l}
                href="#"
                className="text-white/30 hover:text-white/60 text-xs transition-colors"
              >
                {l}
              </a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
