import { LucideIcon, TrendingUp, TrendingDown } from "lucide-react"
import clsx from "clsx"

interface MetricCardProps {
  label: string
  value: string
  change?: string
  changeType?: "up" | "down" | "neutral"
  icon: LucideIcon
  iconColor?: string
  iconBg?: string
}

export default function MetricCard({
  label,
  value,
  change,
  changeType = "neutral",
  icon: Icon,
  iconColor = "text-[#1D9E75]",
  iconBg = "bg-[#E1F5EE]",
}: MetricCardProps) {
  return (
    <div className="bg-white border border-[#f0f0ee] rounded-2xl p-5 flex flex-col gap-3 hover:border-[#e5e7eb] transition-colors">
      <div className="flex items-center justify-between">
        <p className="text-[#9ca3af] text-xs font-medium uppercase tracking-wide">
          {label}
        </p>
        <div
          className={clsx(
            "w-8 h-8 rounded-xl flex items-center justify-center",
            iconBg
          )}
        >
          <Icon size={15} className={iconColor} />
        </div>
      </div>

      <div>
        <p className="text-[#0a1a14] text-2xl font-semibold tracking-tight">
          {value}
        </p>
        {change && (
          <div
            className={clsx(
              "flex items-center gap-1 mt-1 text-xs",
              changeType === "up" && "text-[#0F6E56]",
              changeType === "down" && "text-[#993C1D]",
              changeType === "neutral" && "text-[#9ca3af]"
            )}
          >
            {changeType === "up" && <TrendingUp size={12} />}
            {changeType === "down" && <TrendingDown size={12} />}
            <span>{change}</span>
          </div>
        )}
      </div>
    </div>
  )
}
