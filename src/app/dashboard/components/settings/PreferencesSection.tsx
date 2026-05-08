"use client";

import { useState } from "react";
import clsx from "clsx";

const currencies = [
  { code: "NGN", symbol: "₦", label: "Nigerian Naira" },
  { code: "USD", symbol: "$", label: "US Dollar" },
  { code: "GBP", symbol: "£", label: "British Pound" },
  { code: "EUR", symbol: "€", label: "Euro" },
];

interface Toggle {
  id: string;
  label: string;
  desc: string;
}

const toggles: Toggle[] = [
  {
    id: "budget_alerts",
    label: "Budget alerts",
    desc: "Notify when you reach 80% of a budget",
  },
  {
    id: "weekly_summary",
    label: "Weekly summary",
    desc: "Get a spending recap every Monday",
  },
  {
    id: "large_txn",
    label: "Large transaction alerts",
    desc: "Alert for transactions over ₦50,000",
  },
];

export default function PreferencesSection() {
  const [currency, setCurrency] = useState("NGN");
  const [enabled, setEnabled] = useState<Record<string, boolean>>({
    budget_alerts: true,
    weekly_summary: true,
    large_txn: false,
  });

  const toggle = (id: string) => setEnabled((p) => ({ ...p, [id]: !p[id] }));

  return (
    <>
      {/* Currency */}
      <div className="bg-white border border-[#f0f0ee] rounded-2xl p-5 space-y-3">
        <p className="text-sm font-semibold text-[#0a1a14]">Currency</p>
        <p className="text-xs text-[#9ca3af]">
          Choose your preferred display currency
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {currencies.map((c) => (
            <button
              key={c.code}
              onClick={() => setCurrency(c.code)}
              className={clsx(
                "flex flex-col items-center gap-1 py-3 rounded-xl border text-xs font-medium transition-all",
                currency === c.code ?
                  "border-[#1D9E75] bg-[#E1F5EE] text-[#0F6E56]"
                : "border-[#f0f0ee] text-[#6b7280] hover:bg-[#f7f6f2]",
              )}
            >
              <span className="text-lg">{c.symbol}</span>
              <span>{c.code}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Notifications */}
      <div className="bg-white border border-[#f0f0ee] rounded-2xl p-5 space-y-4">
        <p className="text-sm font-semibold text-[#0a1a14]">Notifications</p>
        <div className="space-y-3">
          {toggles.map((t) => (
            <div key={t.id} className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm text-[#0a1a14]">{t.label}</p>
                <p className="text-xs text-[#9ca3af]">{t.desc}</p>
              </div>
              <button
                onClick={() => toggle(t.id)}
                className={clsx(
                  "relative w-10 h-5.5 rounded-full shrink-0 transition-colors duration-200",
                  enabled[t.id] ? "bg-[#1D9E75]" : "bg-[#e5e7eb]",
                )}
                style={{ height: "22px" }}
                aria-pressed={enabled[t.id]}
              >
                <span
                  className={clsx(
                    "absolute top-0.5 w-4.5 h-4.5 bg-white rounded-full shadow-sm transition-all duration-200",
                    enabled[t.id] ? "left-[calc(100%-20px)]" : "left-0.5",
                  )}
                  style={{ width: "18px", height: "18px" }}
                />
              </button>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
