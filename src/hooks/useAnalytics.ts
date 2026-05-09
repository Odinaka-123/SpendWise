"use client";

import { useMemo } from "react";
import { useExpenses } from "@/hooks/useExpenses";

const CATEGORY_COLORS = [
  "#1D9E75",
  "#D85A30",
  "#378ADD",
  "#7F77DD",
  "#854F0B",
  "#0F6E56",
  "#534AB7",
  "#993556",
  "#185FA5",
  "#3B6D11",
  "#6b7280",
];

function monthKey(isoDate: string) {
  return isoDate.slice(0, 7);
}

function monthLabel(yyyyMM: string) {
  const d = new Date(yyyyMM + "-01T00:00:00");
  return d.toLocaleDateString("en-NG", { month: "short" });
}

function pctChange(current: number, previous: number): number {
  if (previous === 0) return 0;
  return Math.round(((current - previous) / previous) * 100 * 10) / 10;
}

function fmt(n: number): string {
  if (n >= 1_000_000) return `₦${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `₦${(n / 1_000).toFixed(0)}K`;
  return `₦${n.toLocaleString()}`;
}

type Period = "3 months" | "6 months" | "12 months";
const PERIOD_MONTHS: Record<Period, number> = {
  "3 months": 3,
  "6 months": 6,
  "12 months": 12,
};

export function useAnalytics(period: Period) {
  const n = PERIOD_MONTHS[period];

  const { expenses, loading, error } = useExpenses({ limit: 2000 });

  // ── Ordered list of the last N month keys ─────────────────────────────────
  const monthKeys = useMemo(() => {
    const now = new Date();
    const keys: string[] = [];
    for (let i = n - 1; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      keys.push(d.toISOString().slice(0, 7));
    }
    return keys;
  }, [n]);

  // ── Aggregate income & expense per month ──────────────────────────────────
  const byMonth = useMemo(() => {
    const map: Record<string, { income: number; expense: number }> = {};
    for (const mk of monthKeys) map[mk] = { income: 0, expense: 0 };
    for (const e of expenses) {
      const mk = monthKey(e.date);
      if (!map[mk]) continue;
      if (e.type === "credit") map[mk].income += e.amount;
      else map[mk].expense += e.amount;
    }
    return map;
  }, [expenses, monthKeys]);

  // ── Monthly bar chart data ─────────────────────────────────────────────────
  // Derived inline — avoids React Compiler memoization conflict
  const monthlyData = monthKeys.map((mk) => ({
    month: monthLabel(mk),
    income: byMonth[mk]?.income ?? 0,
    expense: byMonth[mk]?.expense ?? 0,
  }));

  // ── Current & previous month totals ───────────────────────────────────────
  const currentMK = monthKeys[monthKeys.length - 1];
  const previousMK = monthKeys[monthKeys.length - 2];

  const currentIncome = byMonth[currentMK]?.income ?? 0;
  const currentExpense = byMonth[currentMK]?.expense ?? 0;
  const currentSavings = currentIncome - currentExpense;

  const prevIncome = byMonth[previousMK]?.income ?? 0;
  const prevExpense = byMonth[previousMK]?.expense ?? 0;
  const prevSavings = prevIncome - prevExpense;

  const daysElapsed = new Date().getDate();
  const avgDailySpend =
    daysElapsed > 0 ? Math.round(currentExpense / daysElapsed) : 0;

  const stats = [
    {
      label: "Total income",
      value: fmt(currentIncome),
      change: pctChange(currentIncome, prevIncome),
    },
    {
      label: "Total expenses",
      value: fmt(currentExpense),
      change: pctChange(currentExpense, prevExpense),
    },
    {
      label: "Net savings",
      value: fmt(Math.max(0, currentSavings)),
      change: pctChange(currentSavings, prevSavings),
    },
    {
      label: "Avg daily spend",
      value: fmt(avgDailySpend),
      change: 0,
      sub: `Based on ${daysElapsed} day${daysElapsed !== 1 ? "s" : ""}`,
    },
  ];

  // ── Category breakdown for current month ──────────────────────────────────
  const categoryMap = useMemo(() => {
    const map: Record<string, { amount: number; count: number }> = {};
    for (const e of expenses) {
      if (monthKey(e.date) !== currentMK) continue;
      if (e.type !== "debit") continue;
      const cat = e.category?.name ?? "Other";
      if (!map[cat]) map[cat] = { amount: 0, count: 0 };
      map[cat].amount += e.amount;
      map[cat].count += 1;
    }
    return map;
  }, [expenses, currentMK]);

  const categoryBreakdown = useMemo(
    () =>
      Object.entries(categoryMap)
        .map(([category, { amount }], i) => ({
          category,
          amount,
          color: CATEGORY_COLORS[i % CATEGORY_COLORS.length],
        }))
        .sort((a, b) => b.amount - a.amount),
    [categoryMap],
  );

  const topCategories = useMemo(
    () =>
      Object.entries(categoryMap)
        .map(([category, { amount, count }], i) => ({
          category,
          amount,
          count,
          color: CATEGORY_COLORS[i % CATEGORY_COLORS.length],
        }))
        .sort((a, b) => b.amount - a.amount)
        .slice(0, 5),
    [categoryMap],
  );

  const totalExpense = categoryBreakdown.reduce((s, c) => s + c.amount, 0);
  const topMax = topCategories[0]?.amount ?? 1;

  return {
    loading,
    error,
    monthlyData,
    stats,
    categoryBreakdown,
    topCategories,
    totalExpense,
    topMax,
  };
}
