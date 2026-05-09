"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export interface SpendingDataPoint {
  day: string;
  spent: number;
}

interface SpendingChartProps {
  data: SpendingDataPoint[];
  month?: string; // e.g. "May 2026"
}

function formatY(value: number) {
  if (value >= 1_000_000) return `₦${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `₦${(value / 1_000).toFixed(0)}K`;
  return `₦${value}`;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function CustomTooltip({ active, payload, label }: any) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#0a1a14] text-white text-xs px-3 py-2 rounded-xl shadow-lg">
        <p className="text-[#5DCAA5] mb-0.5">{label}</p>
        <p className="font-semibold">₦{payload[0].value.toLocaleString()}</p>
      </div>
    );
  }
  return null;
}

export default function SpendingChart({ data, month }: SpendingChartProps) {
  const isEmpty = !data || data.length === 0;

  return (
    <div className="bg-white border border-[#f0f0ee] rounded-2xl p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-[#0a1a14] text-sm font-semibold">Spending trend</h3>
          <p className="text-[#9ca3af] text-xs">
            Cumulative · {month ?? new Date().toLocaleString("en-NG", { month: "long", year: "numeric" })}
          </p>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-[#1D9E75]" />
          <span className="text-xs text-[#9ca3af]">Expenses</span>
        </div>
      </div>

      {isEmpty ? (
        <div className="h-[180px] flex items-center justify-center">
          <p className="text-xs text-[#9ca3af]">No spending data this month</p>
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={180}>
          <AreaChart data={data} margin={{ top: 4, right: 4, left: -10, bottom: 0 }}>
            <defs>
              <linearGradient id="spendGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor="#1D9E75" stopOpacity={0.15} />
                <stop offset="95%" stopColor="#1D9E75" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0ee" vertical={false} />
            <XAxis
              dataKey="day"
              tick={{ fontSize: 10, fill: "#9ca3af" }}
              axisLine={false}
              tickLine={false}
              interval="preserveStartEnd"
            />
            <YAxis
              tickFormatter={formatY}
              tick={{ fontSize: 10, fill: "#9ca3af" }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              content={<CustomTooltip />}
              cursor={{ stroke: "#1D9E75", strokeWidth: 1, strokeDasharray: "4 4" }}
            />
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
      )}
    </div>
  );
}