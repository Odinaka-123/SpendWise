"use client";

import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import clsx from "clsx";

interface StatCardProps {
  label: string;
  value: string;
  change: number; // percent change vs last month
  sub?: string;
}

export function StatCard({ label, value, change, sub }: StatCardProps) {
  const isUp = change > 0;
  const isFlat = change === 0;

  return (
    <div className="bg-white border border-[#f0f0ee] rounded-2xl px-5 py-4">
      <p className="text-[#9ca3af] text-xs mb-1">{label}</p>
      <p className="text-xl font-semibold text-[#0a1a14]">{value}</p>
      <div className="flex items-center gap-1 mt-1.5">
        {isFlat ?
          <Minus size={11} className="text-[#9ca3af]" />
        : isUp ?
          <TrendingUp size={11} className="text-[#0F6E56]" />
        : <TrendingDown size={11} className="text-[#993C1D]" />}
        <span
          className={clsx(
            "text-xs font-medium",
            isFlat ? "text-[#9ca3af]"
            : isUp ? "text-[#0F6E56]"
            : "text-[#993C1D]",
          )}
        >
          {isFlat ? "No change" : `${isUp ? "+" : ""}${change}% vs last month`}
        </span>
      </div>
      {sub && <p className="text-xs text-[#d1d5db] mt-0.5">{sub}</p>}
    </div>
  );
}

interface AnalyticsSummaryProps {
  stats: StatCardProps[];
}

export default function AnalyticsSummary({ stats }: AnalyticsSummaryProps) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((s) => (
        <StatCard key={s.label} {...s} />
      ))}
    </div>
  );
}
