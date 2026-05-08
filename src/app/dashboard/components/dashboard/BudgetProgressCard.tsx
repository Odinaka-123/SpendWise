import clsx from "clsx"

interface BudgetItem {
  name: string
  spent: number
  limit: number
  color: string
}

interface BudgetProgressCardProps {
  items: BudgetItem[]
}

function getStatus(pct: number) {
  if (pct >= 95) return { label: "Exceeded", cls: "bg-red-50 text-red-500" }
  if (pct >= 80) return { label: "Near limit", cls: "bg-[#FAEEDA] text-[#854F0B]" }
  return { label: "On track", cls: "bg-[#E1F5EE] text-[#0F6E56]" }
}

function formatAmount(n: number) {
  if (n >= 1000000) return `₦${(n / 1000000).toFixed(1)}M`
  if (n >= 1000) return `₦${(n / 1000).toFixed(0)}K`
  return `₦${n}`
}

export default function BudgetProgressCard({ items }: BudgetProgressCardProps) {
  return (
    <div className="bg-white border border-[#f0f0ee] rounded-2xl p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-[#0a1a14] text-sm font-semibold">Budget tracker</h3>
        <a href="/dashboard/budget" className="text-xs text-[#1D9E75] hover:underline">
          Manage →
        </a>
      </div>

      <div className="space-y-4">
        {items.map((item) => {
          const pct = Math.min(Math.round((item.spent / item.limit) * 100), 100)
          const status = getStatus(pct)
          return (
            <div key={item.name}>
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2">
                  <span
                    className="w-2 h-2 rounded-full flex-shrink-0"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-sm text-[#0a1a14]">{item.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-[#9ca3af]">
                    {formatAmount(item.spent)} / {formatAmount(item.limit)}
                  </span>
                  <span
                    className={clsx(
                      "text-[10px] font-medium px-2 py-0.5 rounded-full",
                      status.cls
                    )}
                  >
                    {status.label}
                  </span>
                </div>
              </div>
              <div className="h-1.5 bg-[#f3f4f6] rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{ width: `${pct}%`, backgroundColor: item.color }}
                />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
