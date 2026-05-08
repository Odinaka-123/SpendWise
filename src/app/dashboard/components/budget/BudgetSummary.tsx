"use client";

interface BudgetSummaryProps {
  totalLimit: number;
  totalSpent: number;
  overCount: number;
  onTrackCount: number;
}

function fmt(n: number) {
  return `₦${Number(n).toLocaleString()}`;
}

export default function BudgetSummary({
  totalLimit,
  totalSpent,
  overCount,
  onTrackCount,
}: BudgetSummaryProps) {
  const remaining = totalLimit - totalSpent;
  const pct =
    totalLimit > 0 ? Math.min((totalSpent / totalLimit) * 100, 100) : 0;

  return (
    <div className="bg-white border border-[#f0f0ee] rounded-2xl p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-xs text-[#9ca3af]">Total monthly budget</p>
          <p className="text-2xl font-semibold text-[#0a1a14] mt-0.5">
            {fmt(totalLimit)}
          </p>
        </div>
        <div className="text-right">
          <p className="text-xs text-[#9ca3af]">Spent so far</p>
          <p className="text-2xl font-semibold text-[#0a1a14] mt-0.5">
            {fmt(totalSpent)}
          </p>
        </div>
      </div>

      {/* Master progress bar */}
      <div className="h-2.5 bg-[#f7f6f2] rounded-full overflow-hidden mb-3">
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{
            width: `${pct}%`,
            backgroundColor:
              pct >= 100 ? "#ef4444"
              : pct >= 80 ? "#f59e0b"
              : "#1D9E75",
          }}
        />
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5 text-xs text-[#9ca3af]">
            <span className="w-2 h-2 rounded-full bg-[#1D9E75]" />
            {onTrackCount} on track
          </span>
          {overCount > 0 && (
            <span className="flex items-center gap-1.5 text-xs text-red-400">
              <span className="w-2 h-2 rounded-full bg-red-400" />
              {overCount} over budget
            </span>
          )}
        </div>
        <span className="text-xs text-[#9ca3af]">
          {fmt(remaining > 0 ? remaining : 0)} left
        </span>
      </div>
    </div>
  );
}
