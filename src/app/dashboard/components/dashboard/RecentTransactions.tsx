import {
  ShoppingCart,
  Car,
  Building2,
  Pizza,
  Tv,
  Zap,
  LucideIcon,
} from "lucide-react"
import clsx from "clsx"

export interface Transaction {
  id: string
  name: string
  category: string
  amount: number
  date: string
  type: "debit" | "credit"
  icon: string
}

const iconMap: Record<string, { icon: LucideIcon; bg: string; color: string }> = {
  grocery: { icon: ShoppingCart, bg: "bg-[#E1F5EE]", color: "text-[#0F6E56]" },
  transport: { icon: Car, bg: "bg-[#E6F1FB]", color: "text-[#185FA5]" },
  income: { icon: Building2, bg: "bg-[#EAF3DE]", color: "text-[#3B6D11]" },
  dining: { icon: Pizza, bg: "bg-[#FBEAF0]", color: "text-[#993556]" },
  entertainment: { icon: Tv, bg: "bg-[#FAEEDA]", color: "text-[#854F0B]" },
  utility: { icon: Zap, bg: "bg-[#EEEDFE]", color: "text-[#534AB7]" },
}

function formatAmount(n: number) {
  if (Math.abs(n) >= 1000000) return `₦${(Math.abs(n) / 1000000).toFixed(1)}M`
  if (Math.abs(n) >= 1000) return `₦${(Math.abs(n) / 1000).toFixed(0)}K`
  return `₦${Math.abs(n).toLocaleString()}`
}

interface RecentTransactionsProps {
  transactions: Transaction[]
}

export default function RecentTransactions({ transactions }: RecentTransactionsProps) {
  return (
    <div className="bg-white border border-[#f0f0ee] rounded-2xl p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-[#0a1a14] text-sm font-semibold">Recent transactions</h3>
        <a
          href="/dashboard/transactions"
          className="text-xs text-[#1D9E75] hover:underline"
        >
          View all →
        </a>
      </div>

      <div className="space-y-1">
        {transactions.map((tx) => {
          const meta = iconMap[tx.icon] ?? iconMap.grocery
          const Icon = meta.icon
          return (
            <div
              key={tx.id}
              className="flex items-center gap-3 px-2 py-2.5 rounded-xl hover:bg-[#f7f6f2] transition-colors cursor-default"
            >
              <div
                className={clsx(
                  "w-9 h-9 rounded-xl flex items-center justify-center shrink-0",
                  meta.bg
                )}
              >
                <Icon size={15} className={meta.color} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-[#0a1a14] truncate">
                  {tx.name}
                </p>
                <p className="text-xs text-[#9ca3af]">
                  {tx.category} · {tx.date}
                </p>
              </div>
              <p
                className={clsx(
                  "text-sm font-semibold shrink-0",
                  tx.type === "credit" ? "text-[#0F6E56]" : "text-[#0a1a14]"
                )}
              >
                {tx.type === "credit" ? "+" : "-"}
                {formatAmount(tx.amount)}
              </p>
            </div>
          )
        })}
      </div>
    </div>
  )
}
