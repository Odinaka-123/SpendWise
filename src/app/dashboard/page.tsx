import { Wallet, Receipt, TrendingDown, CalendarDays } from "lucide-react"
import MetricCard from "@/components/ui/MetricCard"
import AlertBanner from "@/components/ui/AlertBanner"
import BudgetProgressCard from "@/app/dashboard/components/dashboard/BudgetProgressCard"
import RecentTransactions from "@/app/dashboard/components/dashboard/RecentTransactions"
import SpendingChart from "@/components/charts/SpendingChart"
import CategoryDonut from "@/components/charts/CategoryDonut"
import type { Transaction } from "@/app/dashboard/components/dashboard/RecentTransactions"

const budgetItems = [
  { name: "Housing & Rent", spent: 35000, limit: 50000, color: "#1D9E75" },
  { name: "Dining & Restaurants", spent: 26100, limit: 30000, color: "#D85A30" },
  { name: "Transport", spent: 12800, limit: 25000, color: "#378ADD" },
  { name: "Entertainment", spent: 14500, limit: 15000, color: "#7F77DD" },
]

const recentTransactions: Transaction[] = [
  {
    id: "1",
    name: "Shoprite Ikeja",
    category: "Groceries",
    amount: 4350,
    date: "Today, 10:24",
    type: "debit",
    icon: "grocery",
  },
  {
    id: "2",
    name: "Bolt ride",
    category: "Transport",
    amount: 1200,
    date: "Today, 08:05",
    type: "debit",
    icon: "transport",
  },
  {
    id: "3",
    name: "Salary credit",
    category: "Income",
    amount: 200000,
    date: "Yesterday",
    type: "credit",
    icon: "income",
  },
  {
    id: "4",
    name: "Chicken Republic",
    category: "Dining",
    amount: 3800,
    date: "Yesterday",
    type: "debit",
    icon: "dining",
  },
  {
    id: "5",
    name: "Netflix · Recurring",
    category: "Entertainment",
    amount: 4600,
    date: "May 7",
    type: "debit",
    icon: "entertainment",
  },
]

export default function DashboardPage() {
  return (
    <div className="space-y-5 max-w-300 mx-auto animate-fade-in">
      {/* Alert */}
      <AlertBanner
        message="Dining & Restaurants is at 87% of budget — ₦3,900 remaining this month."
        href="/dashboard/budget"
        linkLabel="Review budget"
      />

      {/* Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          label="Total spent"
          value="₦142,000"
          change="12% vs last month"
          changeType="down"
          icon={TrendingDown}
          iconColor="text-[#993C1D]"
          iconBg="bg-[#FAECE7]"
        />
        <MetricCard
          label="Remaining"
          value="₦58,000"
          change="29% of budget left"
          changeType="up"
          icon={Wallet}
          iconColor="text-[#1D9E75]"
          iconBg="bg-[#E1F5EE]"
        />
        <MetricCard
          label="Transactions"
          value="47"
          change="This month so far"
          changeType="neutral"
          icon={Receipt}
          iconColor="text-[#185FA5]"
          iconBg="bg-[#E6F1FB]"
        />
        <MetricCard
          label="Avg daily spend"
          value="₦5,400"
          change="8% less than last month"
          changeType="up"
          icon={CalendarDays}
          iconColor="text-[#534AB7]"
          iconBg="bg-[#EEEDFE]"
        />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <SpendingChart />
        </div>
        <div>
          <CategoryDonut />
        </div>
      </div>

      {/* Budget + Transactions row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <BudgetProgressCard items={budgetItems} />
        <RecentTransactions transactions={recentTransactions} />
      </div>
    </div>
  )
}
