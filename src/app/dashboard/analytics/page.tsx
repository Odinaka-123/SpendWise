"use client";

import { useState } from "react";
import clsx from "clsx";
import AnalyticsSummary from "../components/analytics/AnalyticsSummary";
import MonthlyBarChart from "../components/analytics/MonthlyBarChart";
import SpendingDonut from "../components/analytics/SpendingDonut";
import TopCategories from "../components/analytics/TopCategories";

const PERIODS = ["3 months", "6 months", "12 months"] as const;
type Period = (typeof PERIODS)[number];

const monthlyData: Record<
  Period,
  { month: string; income: number; expense: number }[]
> = {
  "3 months": [
    { month: "Mar", income: 180000, expense: 62000 },
    { month: "Apr", income: 195000, expense: 71000 },
    { month: "May", income: 200000, expense: 73050 },
  ],
  "6 months": [
    { month: "Dec", income: 165000, expense: 55000 },
    { month: "Jan", income: 170000, expense: 58000 },
    { month: "Feb", income: 175000, expense: 60000 },
    { month: "Mar", income: 180000, expense: 62000 },
    { month: "Apr", income: 195000, expense: 71000 },
    { month: "May", income: 200000, expense: 73050 },
  ],
  "12 months": [
    { month: "Jun", income: 155000, expense: 49000 },
    { month: "Jul", income: 160000, expense: 51000 },
    { month: "Aug", income: 162000, expense: 53000 },
    { month: "Sep", income: 168000, expense: 56000 },
    { month: "Oct", income: 170000, expense: 57000 },
    { month: "Nov", income: 172000, expense: 59000 },
    { month: "Dec", income: 165000, expense: 55000 },
    { month: "Jan", income: 170000, expense: 58000 },
    { month: "Feb", income: 175000, expense: 60000 },
    { month: "Mar", income: 180000, expense: 62000 },
    { month: "Apr", income: 195000, expense: 71000 },
    { month: "May", income: 200000, expense: 73050 },
  ],
};

const categoryBreakdown = [
  { category: "Housing", amount: 35000, color: "#854F0B" },
  { category: "Groceries", amount: 14350, color: "#0F6E56" },
  { category: "Utility", amount: 8500, color: "#534AB7" },
  { category: "Dining", amount: 6000, color: "#993556" },
  { category: "Entertainment", amount: 4600, color: "#854F0B" },
  { category: "Transport", amount: 2800, color: "#185FA5" },
  { category: "Other", amount: 1800, color: "#6b7280" },
];

const topCategories = [
  { category: "Housing", amount: 35000, count: 1, color: "#854F0B" },
  { category: "Groceries", amount: 14350, count: 2, color: "#0F6E56" },
  { category: "Utility", amount: 8500, count: 1, color: "#534AB7" },
  { category: "Dining", amount: 6000, count: 2, color: "#993556" },
  { category: "Entertainment", amount: 4600, count: 1, color: "#534AB7" },
];

const totalExpense = categoryBreakdown.reduce((s, c) => s + c.amount, 0);
const topMax = topCategories[0]?.amount ?? 1;

const stats = [
  { label: "Total income", value: "₦200,000", change: 2.6 },
  { label: "Total expenses", value: "₦73,050", change: 2.9 },
  { label: "Net savings", value: "₦126,950", change: 2.4 },
  {
    label: "Avg daily spend",
    value: "₦2,923",
    change: -1.2,
    sub: "Based on 25 days",
  },
];

export default function AnalyticsPage() {
  const [period, setPeriod] = useState<Period>("6 months");

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

      {/* Stat cards */}
      <AnalyticsSummary stats={stats} />

      {/* Bar chart */}
      <MonthlyBarChart data={monthlyData[period]} />

      {/* Bottom 2-col grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <SpendingDonut data={categoryBreakdown} total={totalExpense} />
        <TopCategories data={topCategories} max={topMax} />
      </div>
    </div>
  );
}
