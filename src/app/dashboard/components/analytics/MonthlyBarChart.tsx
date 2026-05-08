"use client";

interface MonthData {
  month: string;
  income: number;
  expense: number;
}

interface MonthlyBarChartProps {
  data: MonthData[];
}

function fmt(n: number) {
  return `₦${(n / 1000).toFixed(0)}k`;
}

export default function MonthlyBarChart({ data }: MonthlyBarChartProps) {
  const maxVal = Math.max(...data.flatMap((d) => [d.income, d.expense]), 1);
  const chartH = 140;
  const barW = 18;
  const gap = 6;
  const groupW = barW * 2 + gap + 20;
  const svgW = data.length * groupW + 16;

  return (
    <div className="bg-white border border-[#f0f0ee] rounded-2xl p-5">
      <div className="flex items-center justify-between mb-4">
        <p className="text-xs font-semibold text-[#9ca3af] uppercase tracking-widest">
          Month-over-month
        </p>
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5 text-xs text-[#6b7280]">
            <span className="w-2.5 h-2.5 rounded-sm bg-[#1D9E75]" />
            Income
          </span>
          <span className="flex items-center gap-1.5 text-xs text-[#6b7280]">
            <span className="w-2.5 h-2.5 rounded-sm bg-[#0a1a14]" />
            Expenses
          </span>
        </div>
      </div>

      <div className="overflow-x-auto">
        <svg width={svgW} height={chartH + 28} className="overflow-visible">
          {data.map((d, i) => {
            const x = i * groupW + 8;
            const incomeH = (d.income / maxVal) * chartH;
            const expH = (d.expense / maxVal) * chartH;

            return (
              <g key={d.month}>
                {/* Income bar */}
                <rect
                  x={x}
                  y={chartH - incomeH}
                  width={barW}
                  height={incomeH}
                  rx={4}
                  fill="#1D9E75"
                  opacity={0.85}
                  className="hover:opacity-100 transition-opacity"
                />
                {/* Expense bar */}
                <rect
                  x={x + barW + gap}
                  y={chartH - expH}
                  width={barW}
                  height={expH}
                  rx={4}
                  fill="#0a1a14"
                  opacity={0.75}
                  className="hover:opacity-100 transition-opacity"
                />
                {/* Month label */}
                <text
                  x={x + barW + gap / 2}
                  y={chartH + 18}
                  textAnchor="middle"
                  fontSize={10}
                  fill="#9ca3af"
                >
                  {d.month}
                </text>
              </g>
            );
          })}
          {/* Y-axis gridlines */}
          {[0, 0.25, 0.5, 0.75, 1].map((tick) => (
            <g key={tick}>
              <line
                x1={0}
                x2={svgW}
                y1={chartH - tick * chartH}
                y2={chartH - tick * chartH}
                stroke="#f0f0ee"
                strokeWidth={1}
              />
              <text
                x={0}
                y={chartH - tick * chartH - 3}
                fontSize={9}
                fill="#d1d5db"
              >
                {tick > 0 ? fmt(tick * maxVal) : ""}
              </text>
            </g>
          ))}
        </svg>
      </div>
    </div>
  );
}
