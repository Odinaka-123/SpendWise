"use client";

interface Slice {
  category: string;
  amount: number;
  color: string;
}

interface SpendingDonutProps {
  data: Slice[];
  total: number;
}

function fmt(n: number) {
  return `₦${Number(n).toLocaleString()}`;
}

export default function SpendingDonut({ data, total }: SpendingDonutProps) {
  const size = 180;
  const r = 70;
  const cx = size / 2;
  const cy = size / 2;
  const circumference = 2 * Math.PI * r;

  const slices = data.reduce(
    (acc, d) => {
      const pct = total > 0 ? d.amount / total : 0;
      const offset = circumference * (1 - acc.cumulative);
      const dash = circumference * pct;

      return {
        cumulative: acc.cumulative + pct,
        slices: [...acc.slices, { ...d, pct, dash, offset }],
      };
    },
    {
      cumulative: 0,
      slices: [] as Array<
        Slice & { pct: number; dash: number; offset: number }
      >,
    },
  ).slices;

  return (
    <div className="bg-white border border-[#f0f0ee] rounded-2xl p-5">
      <p className="text-xs font-semibold text-[#9ca3af] uppercase tracking-widest mb-4">
        Spending breakdown
      </p>
      <div className="flex items-center gap-6">
        {/* Donut */}
        <div className="relative shrink-0">
          <svg
            width={size}
            height={size}
            style={{ transform: "rotate(-90deg)" }}
          >
            {/* Track */}
            <circle
              cx={cx}
              cy={cy}
              r={r}
              fill="none"
              stroke="#f7f6f2"
              strokeWidth={22}
            />
            {slices.map((s, i) => (
              <circle
                key={i}
                cx={cx}
                cy={cy}
                r={r}
                fill="none"
                stroke={s.color}
                strokeWidth={22}
                strokeDasharray={`${s.dash} ${circumference - s.dash}`}
                strokeDashoffset={s.offset}
                className="transition-all duration-700"
              />
            ))}
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-xs text-[#9ca3af]">Total</span>
            <span className="text-base font-semibold text-[#0a1a14]">
              {fmt(total)}
            </span>
          </div>
        </div>

        {/* Legend */}
        <div className="flex-1 space-y-2.5">
          {slices.map((s) => (
            <div
              key={s.category}
              className="flex items-center justify-between gap-2"
            >
              <div className="flex items-center gap-2 min-w-0">
                <span
                  className="w-2.5 h-2.5 rounded-full shrink-0"
                  style={{ backgroundColor: s.color }}
                />
                <span className="text-xs text-[#6b7280] truncate">
                  {s.category}
                </span>
              </div>
              <div className="text-right shrink-0">
                <span className="text-xs font-semibold text-[#0a1a14]">
                  {fmt(s.amount)}
                </span>
                <span className="text-xs text-[#9ca3af] ml-1.5">
                  {Math.round(s.pct * 100)}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
