"use client";

import { useState } from "react";
import clsx from "clsx";
import { AlertTriangle } from "lucide-react";
import AnalyticsSummary from "../components/analytics/AnalyticsSummary";
import MonthlyBarChart from "../components/analytics/MonthlyBarChart";
import SpendingDonut from "../components/analytics/SpendingDonut";
import TopCategories from "../components/analytics/TopCategories";
import { useAnalytics } from "@/hooks/useAnalytics";

const PERIODS = ["3 months", "6 months", "12 months"] as const;
type Period = (typeof PERIODS)[number];

export default function AnalyticsPage() {
  const [period, setPeriod] = useState<Period>("6 months");

  const {
    loading,
    error,
    monthlyData,
    stats,
    categoryBreakdown,
    topCategories,
    totalExpense,
    topMax,
  } = useAnalytics(period);

  return (
    <div className="space-y-5 max-w-300 mx-auto animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-[#0a1a14] text-lg font-semibold">Analytics</h2>
          <p className="text-[#9ca3af] text-xs mt-0.5">
            Spending insights & trends
          </p>
        </div>

        {/* Period toggle */}
        <div className="flex bg-white border border-[#f0f0ee] rounded-xl p-1 gap-1">
          {PERIODS.map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={clsx(
                "px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-150",
                period === p ?
                  "bg-[#0a1a14] text-white"
                : "text-[#9ca3af] hover:text-[#0a1a14]",
              )}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-center gap-3 px-4 py-3 bg-[#FCEBEB] border border-red-200 rounded-2xl">
          <AlertTriangle size={15} className="text-[#E24B4A] shrink-0" />
          <p className="text-xs text-[#E24B4A]">{error}</p>
        </div>
      )}

      {/* Stat cards */}
      {loading ?
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="bg-white border border-[#f0f0ee] rounded-2xl px-5 py-4 h-24 animate-pulse"
            />
          ))}
        </div>
      : <AnalyticsSummary stats={stats} />}

      {/* Bar chart */}
      {loading ?
        <div className="bg-white border border-[#f0f0ee] rounded-2xl p-5 h-48 animate-pulse" />
      : <MonthlyBarChart data={monthlyData} />}

      {/* Bottom 2-col grid */}
      {loading ?
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="bg-white border border-[#f0f0ee] rounded-2xl p-5 h-56 animate-pulse" />
          <div className="bg-white border border-[#f0f0ee] rounded-2xl p-5 h-56 animate-pulse" />
        </div>
      : totalExpense === 0 ?
        <div className="bg-white border border-[#f0f0ee] rounded-2xl p-12 text-center">
          <p className="text-[#0a1a14] text-sm font-medium">No spending data</p>
          <p className="text-[#9ca3af] text-xs mt-1">
            Add some transactions to see your category breakdown.
          </p>
        </div>
      : <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <SpendingDonut data={categoryBreakdown} total={totalExpense} />
          <TopCategories data={topCategories} max={topMax} />
        </div>
      }
    </div>
  );
}
