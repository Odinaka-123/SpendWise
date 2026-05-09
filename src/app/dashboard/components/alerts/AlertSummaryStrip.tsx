"use client";

import type { BudgetAlert } from "../../alerts/types";

interface AlertSummaryStripProps {
  alerts: BudgetAlert[];
}

export default function AlertSummaryStrip({ alerts }: AlertSummaryStripProps) {
  const active = alerts.filter((a) => a.enabled).length;

  const triggered = alerts.filter(
    (a) =>
      a.enabled && a.spend / a.limit >= a.alertAt / 100 && a.spend < a.limit,
  ).length;

  const over = alerts.filter((a) => a.enabled && a.spend >= a.limit).length;

  const stats = [
    { label: "Active alerts", value: active, color: "text-[#0a1a14]" },
    {
      label: "Triggered",
      value: triggered,
      color: triggered > 0 ? "text-[#92400E]" : "text-[#0a1a14]",
    },
    {
      label: "Over budget",
      value: over,
      color: over > 0 ? "text-[#E24B4A]" : "text-[#0a1a14]",
    },
  ];

  return (
    <div className="grid grid-cols-3 gap-3">
      {stats.map((s) => (
        <div
          key={s.label}
          className="bg-white border border-[#f0f0ee] rounded-2xl p-4 text-center"
        >
          <p className={`text-2xl font-semibold ${s.color}`}>{s.value}</p>
          <p className="text-xs text-[#9ca3af] mt-0.5">{s.label}</p>
        </div>
      ))}
    </div>
  );
}
