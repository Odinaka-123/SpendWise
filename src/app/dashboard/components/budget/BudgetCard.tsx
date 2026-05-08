"use client";

import { Pencil, Trash2, AlertTriangle } from "lucide-react";
import clsx from "clsx";

export interface Budget {
  id: string;
  category: string;
  limit: number;
  spent: number;
  color: string;
  icon: string;
}

function fmt(n: number) {
  return `₦${Number(n).toLocaleString()}`;
}

interface BudgetCardProps {
  budget: Budget;
  onEdit: (b: Budget) => void;
  onDelete: (id: string) => void;
}

export default function BudgetCard({
  budget,
  onEdit,
  onDelete,
}: BudgetCardProps) {
  const pct = Math.min((budget.spent / budget.limit) * 100, 100);
  const remaining = budget.limit - budget.spent;
  const isOver = budget.spent > budget.limit;
  const isWarning = !isOver && pct >= 80;

  return (
    <div className="bg-white border border-[#f0f0ee] rounded-2xl p-5 group hover:shadow-sm transition-all">
      {/* Top row */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-sm font-semibold text-[#0a1a14]">
            {budget.category}
          </p>
          <p className="text-xs text-[#9ca3af] mt-0.5">
            {fmt(budget.spent)} of {fmt(budget.limit)}
          </p>
        </div>

        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => onEdit(budget)}
            className="w-7 h-7 flex items-center justify-center rounded-lg text-[#9ca3af] hover:bg-[#f0f0ee] hover:text-[#0a1a14] transition-colors"
            aria-label="Edit"
          >
            <Pencil size={13} />
          </button>
          <button
            onClick={() => onDelete(budget.id)}
            className="w-7 h-7 flex items-center justify-center rounded-lg text-[#9ca3af] hover:bg-red-50 hover:text-red-500 transition-colors"
            aria-label="Delete"
          >
            <Trash2 size={13} />
          </button>
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-2 bg-[#f7f6f2] rounded-full overflow-hidden mb-3">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{
            width: `${pct}%`,
            backgroundColor:
              isOver ? "#ef4444"
              : isWarning ? "#f59e0b"
              : budget.color,
          }}
        />
      </div>

      {/* Bottom row */}
      <div className="flex items-center justify-between">
        <span
          className={clsx(
            "text-xs font-medium",
            isOver ? "text-red-500"
            : isWarning ? "text-amber-500"
            : "text-[#9ca3af]",
          )}
        >
          {isOver ?
            <span className="flex items-center gap-1">
              <AlertTriangle size={11} />
              Over by {fmt(Math.abs(remaining))}
            </span>
          : isWarning ?
            `${fmt(remaining)} left — running low`
          : `${fmt(remaining)} remaining`}
        </span>
        <span
          className={clsx(
            "text-xs font-semibold",
            isOver ? "text-red-500"
            : isWarning ? "text-amber-500"
            : "text-[#0a1a14]",
          )}
        >
          {Math.round(pct)}%
        </span>
      </div>
    </div>
  );
}
