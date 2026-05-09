"use client";

import { Wallet, Receipt, TrendingDown, CalendarDays } from "lucide-react";
import MetricCard from "@/components/ui/MetricCard";
import AlertBanner from "@/components/ui/AlertBanner";
import BudgetProgressCard from "@/app/dashboard/components/dashboard/BudgetProgressCard";
import RecentTransactions from "@/app/dashboard/components/dashboard/RecentTransactions";
import SpendingChart from "@/components/charts/SpendingChart";
import CategoryDonut from "@/components/charts/CategoryDonut";
import { useDashboard } from "@/hooks/useDashboard";

function formatAmount(n: number) {
  if (n >= 1_000_000) return `₦${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `₦${(n / 1_000).toFixed(0)}K`;
  return `₦${n.toLocaleString()}`;
}

export default function DashboardPage() {
  const currentMonth = new Date().toISOString().slice(0, 7); // 'YYYY-MM'
  const monthLabel   = new Date().toLocaleString("en-NG", { month: "long", year: "numeric" });

  const {
    loading,
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
  } = useDashboard(currentMonth);

  // Build alert message from the worst over-budget category
  const topAlert = alertBudgets[0];
  const alertMessage = topAlert
    ? `${topAlert.category_name} is at ${Math.round(topAlert.percentage_used ?? 0)}% of budget — ₦${topAlert.remaining.toLocaleString()} remaining this month.`
    : null;

  // Remaining % of total budget
  const remainingPct =
    totalBudget > 0 ? Math.round((remaining / totalBudget) * 100) : null;

  return (
    <div className="space-y-5 max-w-300 mx-auto animate-fade-in">

      {/* Alert — only shown when a category is ≥ 80% */}
      {alertMessage && (
        <AlertBanner
          message={alertMessage}
          href="/dashboard/budget"
          linkLabel="Review budget"
        />
      )}

      {/* Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          label="Total spent"
          value={loading ? "—" : formatAmount(totalSpent)}
          change={totalBudget > 0 ? `of ₦${formatAmount(totalBudget)} budget` : undefined}
          changeType="down"
          icon={TrendingDown}
          iconColor="text-[#993C1D]"
          iconBg="bg-[#FAECE7]"
        />
        <MetricCard
          label="Remaining"
          value={loading ? "—" : formatAmount(Math.max(0, remaining))}
          change={remainingPct !== null ? `${remainingPct}% of budget left` : undefined}
          changeType="up"
          icon={Wallet}
          iconColor="text-[#1D9E75]"
          iconBg="bg-[#E1F5EE]"
        />
        <MetricCard
          label="Transactions"
          value={loading ? "—" : String(txCount)}
          change="This month so far"
          changeType="neutral"
          icon={Receipt}
          iconColor="text-[#185FA5]"
          iconBg="bg-[#E6F1FB]"
        />
        <MetricCard
          label="Avg daily spend"
          value={loading ? "—" : formatAmount(avgDailySpend)}
          change="Based on this month"
          changeType="neutral"
          icon={CalendarDays}
          iconColor="text-[#534AB7]"
          iconBg="bg-[#EEEDFE]"
        />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <SpendingChart data={spendingChartData} month={monthLabel} />
        </div>
        <div>
          <CategoryDonut data={categoryDonutData} month={monthLabel} />
        </div>
      </div>

      {/* Budget + Transactions row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <BudgetProgressCard items={budgetItems} />
        <RecentTransactions transactions={recentTransactions} />
      </div>

    </div>
  );
}