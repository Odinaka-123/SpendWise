"use client";

import { RefreshCw, Calendar, Edit2, Trash2, Pause, Play } from "lucide-react";
import clsx from "clsx";
import type { RecurringTx } from "../../recurring/types";
import { CAT_META, daysUntil, formatDate, friendlyDays } from "../../recurring/types";

interface RecurringCardProps {
  tx: RecurringTx;
  onToggle: (id: string) => void;
  onEdit: (tx: RecurringTx) => void;
  onDelete: (id: string) => void;
}

export default function RecurringCard({
  tx,
  onToggle,
  onEdit,
  onDelete,
}: RecurringCardProps) {
  const meta = CAT_META[tx.category] ?? CAT_META["Other"];
  const days = daysUntil(tx.nextDate);
  const isDue = tx.enabled && days <= 3 && days >= 0;
  const isOverdue = tx.enabled && days < 0;

  return (
    <div
      className={clsx(
        "bg-white border rounded-2xl p-4 transition-all duration-200",
        !tx.enabled ? "border-[#f0f0ee] opacity-60"
        : isDue || isOverdue ? "border-[#FDE68A]"
        : "border-[#f0f0ee]",
      )}
    >
      <div className="flex items-start gap-3">
        {/* Icon */}
        <div
          className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${meta.bg}`}
        >
          <RefreshCw size={13} className={meta.text} />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <p className="text-sm font-semibold text-[#0a1a14] truncate">
                {tx.name}
              </p>
              <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                <span
                  className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${meta.bg} ${meta.text}`}
                >
                  {tx.category}
                </span>
                <span className="text-[10px] text-[#9ca3af] capitalize">
                  {tx.frequency}
                </span>
              </div>
            </div>

            {/* Amount */}
            <div className="text-right shrink-0">
              <p
                className={clsx(
                  "text-sm font-semibold",
                  tx.type === "credit" ? "text-[#1D9E75]" : "text-[#0a1a14]",
                )}
              >
                {tx.type === "credit" ? "+" : "-"}₦{tx.amount.toLocaleString()}
              </p>
              <p className="text-[10px] text-[#9ca3af] mt-0.5">
                {tx.type === "credit" ? "income" : "expense"}
              </p>
            </div>
          </div>

          {/* Next date row */}
          <div className="flex items-center justify-between mt-3 pt-3 border-t border-[#f0f0ee]">
            <div className="flex items-center gap-1.5">
              <Calendar size={11} className="text-[#9ca3af]" />
              <span className="text-xs text-[#9ca3af]">
                {tx.enabled ? "Next:" : "Paused ·"}{" "}
                <span
                  className={clsx(
                    "font-medium",
                    isOverdue ? "text-[#E24B4A]"
                    : isDue ? "text-[#92400E]"
                    : "text-[#6b7280]",
                  )}
                >
                  {tx.enabled ?
                    `${formatDate(tx.nextDate)} · ${friendlyDays(days)}`
                  : formatDate(tx.nextDate)}
                </span>
              </span>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-1">
              <button
                onClick={() => onEdit(tx)}
                className="w-6 h-6 flex items-center justify-center rounded-lg text-[#9ca3af] hover:bg-[#f7f6f2] transition-colors"
                aria-label="Edit"
              >
                <Edit2 size={11} />
              </button>
              <button
                onClick={() => onDelete(tx.id)}
                className="w-6 h-6 flex items-center justify-center rounded-lg text-[#9ca3af] hover:bg-[#FBEAF0] hover:text-[#993556] transition-colors"
                aria-label="Delete"
              >
                <Trash2 size={11} />
              </button>
              <button
                onClick={() => onToggle(tx.id)}
                className={clsx(
                  "w-6 h-6 flex items-center justify-center rounded-lg transition-colors",
                  tx.enabled ?
                    "text-[#9ca3af] hover:bg-[#FEF3C7] hover:text-[#92400E]"
                  : "text-[#1D9E75] hover:bg-[#E1F5EE]",
                )}
                aria-label={tx.enabled ? "Pause" : "Resume"}
              >
                {tx.enabled ?
                  <Pause size={11} />
                : <Play size={11} />}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
