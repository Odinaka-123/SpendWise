"use client";

import { Bell, Edit2, Trash2, AlertTriangle, CheckCircle2 } from "lucide-react";
import clsx from "clsx";
import type { BudgetAlert } from "../../alerts/types";
import { CATEGORY_META } from "../../alerts/types";

interface AlertCardProps {
  alert: BudgetAlert;
  onToggle: (id: string) => void;
  onEdit: (alert: BudgetAlert) => void;
  onDelete: (id: string) => void;
}

export default function AlertCard({
  alert,
  onToggle,
  onEdit,
  onDelete,
}: AlertCardProps) {
  const meta = CATEGORY_META[alert.category] ?? CATEGORY_META["Other"];
  const pct = Math.min((alert.spend / alert.limit) * 100, 100);
  const triggered = alert.enabled && pct >= alert.alertAt;
  const over = pct >= 100;

  return (
    <div
      className={clsx(
        "bg-white border rounded-2xl p-5 space-y-3 transition-all duration-200",
        !alert.enabled
          ? "border-[#f0f0ee] opacity-60"
          : triggered
            ? "border-[#FDE68A]"
            : "border-[#f0f0ee]",
      )}
    >
      {/* ── Top row ── */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${meta.bg}`}>
            <Bell size={14} className={meta.text} />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-[#0a1a14]">{alert.category}</p>
            <p className="text-xs text-[#9ca3af]">
              Alert at {alert.alertAt}% · Limit ₦{alert.limit.toLocaleString()}
            </p>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={() => onEdit(alert)}
            className="w-7 h-7 flex items-center justify-center rounded-lg text-[#9ca3af] hover:bg-[#f7f6f2] transition-colors"
            aria-label="Edit alert"
          >
            <Edit2 size={12} />
          </button>
          <button
            onClick={() => onDelete(alert.id)}
            className="w-7 h-7 flex items-center justify-center rounded-lg text-[#9ca3af] hover:bg-[#FBEAF0] hover:text-[#993556] transition-colors"
            aria-label="Delete alert"
          >
            <Trash2 size={12} />
          </button>
          <button
            onClick={() => onToggle(alert.id)}
            className={clsx(
              "w-10 h-5 rounded-full transition-colors duration-200 relative ml-1 shrink-0",
              alert.enabled ? "bg-[#1D9E75]" : "bg-[#e5e7eb]",
            )}
            aria-label={alert.enabled ? "Disable alert" : "Enable alert"}
          >
            <span
              className={clsx(
                "absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200",
                alert.enabled ? "translate-x-4.5" : "translate-x-0",
              )}
            />
          </button>
        </div>
      </div>

      {/* ── Progress bar ── */}
      <div className="space-y-1.5">
        <div className="relative h-2 bg-[#f7f6f2] rounded-full overflow-hidden">
          <div
            className={clsx(
              "h-full rounded-full transition-all duration-500",
              over ? "bg-[#E24B4A]" : triggered ? "bg-[#F59E0B]" : meta.bar,
            )}
            style={{ width: `${pct}%` }}
          />
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xs text-[#9ca3af]">
            ₦{alert.spend.toLocaleString()} spent
          </span>
          <span
            className={clsx(
              "text-xs font-medium",
              over ? "text-[#E24B4A]" : triggered ? "text-[#92400E]" : "text-[#6b7280]",
            )}
          >
            {pct.toFixed(0)}%
          </span>
        </div>
      </div>

      {/* ── Status badge ── */}
      {alert.enabled && (over || triggered) && (
        <div className={clsx("flex items-center gap-2 px-3 py-2 rounded-xl", over ? "bg-[#FCEBEB]" : "bg-[#FEF3C7]")}>
          <AlertTriangle size={12} className={over ? "text-[#E24B4A]" : "text-[#92400E]"} />
          <p className={clsx("text-xs font-medium", over ? "text-[#E24B4A]" : "text-[#92400E]")}>
            {over
              ? `Over budget by ₦${(alert.spend - alert.limit).toLocaleString()}`
              : `${(100 - pct).toFixed(0)}% remaining — alert threshold reached`}
          </p>
        </div>
      )}

      {alert.enabled && !triggered && !over && (
        <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-[#f7f6f2]">
          <CheckCircle2 size={12} className="text-[#1D9E75]" />
          <p className="text-xs text-[#6b7280]">
            ₦{(alert.limit - alert.spend).toLocaleString()} remaining before alert
          </p>
        </div>
      )}
    </div>
  );
}