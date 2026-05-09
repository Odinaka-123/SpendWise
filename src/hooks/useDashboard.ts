"use client";

import { useMemo } from "react";
import { useExpenses } from "@/hooks/useExpenses";
import { useBudgetAlerts } from "@/hooks/useBudgetAlerts";

const CATEGORY_COLORS = [
  "#1D9E75", "#D85A30", "#378ADD", "#7F77DD",
  "#B4B2A9", "#854F0B", "#3B6D11", "#993556",
];

function iconKey(categoryName: string | null | undefined): string {
  const n = (categoryName ?? "").toLowerCase();
  if (n.includes("groceri") || n.includes("supermarket")) return "grocery";
  if (n.includes("transport") || n.includes("ride") || n.includes("bolt") || n.includes("uber")) return "transport";
  if (n.includes("dining") || n.includes("restaurant") || n.includes("food")) return "dining";
  if (n.includes("entertain") || n.includes("netflix") || n.includes("stream")) return "entertainment";
  if (n.includes("utility") || n.includes("electric") || n.includes("water")) return "utility";
  if (n.includes("income") || n.includes("salary")) return "income";
  return "grocery";
}

function formatDate(isoDate: string): string {
  const today     = new Date().toISOString().slice(0, 10);
  const yesterday = new Date(Date.now() - 86_400_000).toISOString().slice(0, 10);
  if (isoDate === today)     return "Today";
  if (isoDate === yesterday) return "Yesterday";
  return new Date(isoDate + "T00:00:00").toLocaleDateString("en-NG", {
    day: "numeric", month: "short",
  });
}

export function useDashboard(month: string) {
  const { expenses, loading: expLoading, error: expError } =
    useExpenses({ month, limit: 200 });

  const { budgets, loading: budLoading, error: budError } =
    useBudgetAlerts(month);

  // ── Metrics ────────────────────────────────────────────────────────────────

  const totalSpent = useMemo(
    () => expenses.filter((e) => e.type === "debit").reduce((s, e) => s + e.amount, 0),
    [expenses],
  );

  const totalBudget = useMemo(
    () => budgets.reduce((s, b) => s + b.budget_amount, 0),
    [budgets],
  );

  const remaining = totalBudget > 0 ? totalBudget - totalSpent : 0;

  const txCount = expenses.length;

  const avgDailySpend = useMemo(() => {
    const debits = expenses.filter((e) => e.type === "debit");
    if (!debits.length) return 0;
    const dates    = debits.map((e) => e.date);
    const earliest = dates.reduce((a, b) => (a < b ? a : b));
    const today    = new Date().toISOString().slice(0, 10);
    const days     = Math.max(
      1,
      Math.ceil(
        (new Date(today).getTime() - new Date(earliest).getTime()) / 86_400_000,
      ) + 1,
    );
    return Math.round(totalSpent / days);
  }, [expenses, totalSpent]);

  // ── Spending trend (cumulative by day) ────────────────────────────────────

  const spendingChartData = useMemo(() => {
    const byDate: Record<string, number> = {};
    for (const e of expenses.filter((e) => e.type === "debit")) {
      byDate[e.date] = (byDate[e.date] ?? 0) + e.amount;
    }
    let cumulative = 0;
    return Object.entries(byDate)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([date, amount]) => {
        cumulative += amount;
        const label = new Date(date + "T00:00:00").toLocaleDateString("en-NG", {
          day: "numeric", month: "short",
        });
        return { day: label, spent: cumulative };
      });
  }, [expenses]);

  // ── Category donut ─────────────────────────────────────────────────────────

  const categoryDonutData = useMemo(() => {
    const map: Record<string, { name: string; value: number }> = {};
    for (const e of expenses.filter((e) => e.type === "debit")) {
      const cat = e.category?.name ?? "Other";
      if (!map[cat]) map[cat] = { name: cat, value: 0 };
      map[cat].value += e.amount;
    }
    return Object.values(map)
      .sort((a, b) => b.value - a.value)
      .map((d, i) => ({ ...d, color: CATEGORY_COLORS[i % CATEGORY_COLORS.length] }));
  }, [expenses]);

  // ── Budget progress ────────────────────────────────────────────────────────

  const budgetItems = useMemo(
    () =>
      budgets.map((b) => ({
        name:  b.category_name ?? b.category_id,
        spent: b.actual_spent,
        limit: b.budget_amount,
        color: b.category_color ?? "#6b7280",
      })),
    [budgets],
  );

  // ── Recent transactions (latest 5) ────────────────────────────────────────

  const recentTransactions = useMemo(
    () =>
      expenses.slice(0, 5).map((e) => ({
        id:       e.id,
        name:     e.name,
        category: e.category?.name ?? "Other",
        amount:   e.amount,
        date:     formatDate(e.date),
        type:     e.type,
        icon:     iconKey(e.category?.name),
      })),
    [expenses],
  );

  // ── Budget alerts (≥ 80%) ──────────────────────────────────────────────────

  const alertBudgets = useMemo(
    () => budgets.filter((b) => (b.percentage_used ?? 0) >= 80),
    [budgets],
  );

  return {
    loading: expLoading || budLoading,
    error:   expError ?? budError,
    totalSpent,
    totalBudget,
    remaining,
    txCount,
    avgDailySpend,
    spendingChartData,
    categoryDonutData,
    budgetItems,
    recentTransactions,
    alertBudgets,
  };
}