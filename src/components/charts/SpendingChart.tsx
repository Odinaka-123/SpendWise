"use client"

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"

const data = [
  { day: "1 May", spent: 12000 },
  { day: "5 May", spent: 28000 },
  { day: "8 May", spent: 19000 },
  { day: "10 May", spent: 42000 },
  { day: "12 May", spent: 31000 },
  { day: "14 May", spent: 55000 },
  { day: "16 May", spent: 38000 },
  { day: "18 May", spent: 47000 },
  { day: "20 May", spent: 29000 },
  { day: "22 May", spent: 63000 },
  { day: "24 May", spent: 41000 },
  { day: "Today", spent: 52000 },
]

function formatY(value: number) {
  if (value >= 1000) return `₦${value / 1000}K`
  return `₦${value}`
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function CustomTooltip({ active, payload, label }: any) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#0a1a14] text-white text-xs px-3 py-2 rounded-xl shadow-lg">
        <p className="text-[#5DCAA5] mb-0.5">{label}</p>
        <p className="font-semibold">
          ₦{payload[0].value.toLocaleString()}
        </p>
      </div>
    )
  }
  return null
}

export default function SpendingChart() {
  return (
    <div className="bg-white border border-[#f0f0ee] rounded-2xl p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-[#0a1a14] text-sm font-semibold">Spending trend</h3>
          <p className="text-[#9ca3af] text-xs">Cumulative · May 2026</p>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-[#1D9E75]" />
          <span className="text-xs text-[#9ca3af]">Expenses</span>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={180}>
        <AreaChart data={data} margin={{ top: 4, right: 4, left: -10, bottom: 0 }}>
          <defs>
            <linearGradient id="spendGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#1D9E75" stopOpacity={0.15} />
              <stop offset="95%" stopColor="#1D9E75" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0ee" vertical={false} />
          <XAxis
            dataKey="day"
            tick={{ fontSize: 10, fill: "#9ca3af" }}
            axisLine={false}
            tickLine={false}
            interval={2}
          />
          <YAxis
            tickFormatter={formatY}
            tick={{ fontSize: 10, fill: "#9ca3af" }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ stroke: "#1D9E75", strokeWidth: 1, strokeDasharray: "4 4" }} />
          <Area
            type="monotone"
            dataKey="spent"
            stroke="#1D9E75"
            strokeWidth={2}
            fill="url(#spendGradient)"
            dot={false}
            activeDot={{ r: 4, fill: "#1D9E75", stroke: "#fff", strokeWidth: 2 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
