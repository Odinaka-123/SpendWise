"use client"

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts"

const data = [
  { name: "Housing", value: 35000, color: "#1D9E75" },
  { name: "Dining", value: 26000, color: "#D85A30" },
  { name: "Transport", value: 13000, color: "#378ADD" },
  { name: "Entertainment", value: 15000, color: "#7F77DD" },
  { name: "Other", value: 13000, color: "#B4B2A9" },
]

const total = data.reduce((s, d) => s + d.value, 0)

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function CustomTooltip({ active, payload }: any) {
  if (active && payload && payload.length) {
    const d = payload[0].payload
    return (
      <div className="bg-[#0a1a14] text-white text-xs px-3 py-2 rounded-xl shadow-lg">
        <p className="text-[#5DCAA5] mb-0.5">{d.name}</p>
        <p className="font-semibold">₦{d.value.toLocaleString()}</p>
        <p className="text-[#9ca3af]">{Math.round((d.value / total) * 100)}%</p>
      </div>
    )
  }
  return null
}

export default function CategoryDonut() {
  return (
    <div className="bg-white border border-[#f0f0ee] rounded-2xl p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-[#0a1a14] text-sm font-semibold">By category</h3>
          <p className="text-[#9ca3af] text-xs">May 2026</p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* Donut */}
        <div className="relative flex-shrink-0" style={{ width: 120, height: 120 }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={36}
                outerRadius={54}
                paddingAngle={2}
                dataKey="value"
                strokeWidth={0}
              >
                {data.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
          {/* Centre label */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <p className="text-[10px] text-[#9ca3af]">Total</p>
            <p className="text-xs font-semibold text-[#0a1a14]">₦102K</p>
          </div>
        </div>

        {/* Legend */}
        <div className="flex flex-col gap-2 flex-1">
          {data.map((d) => (
            <div key={d.name} className="flex items-center gap-2">
              <span
                className="w-2 h-2 rounded-full flex-shrink-0"
                style={{ backgroundColor: d.color }}
              />
              <span className="text-xs text-[#6b7280] flex-1 truncate">{d.name}</span>
              <span className="text-xs font-medium text-[#0a1a14]">
                {Math.round((d.value / total) * 100)}%
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
