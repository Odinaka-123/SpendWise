"use client";

import { useMemo } from "react";
import type { RecurringTx } from "../../recurring/types";

interface RecurringSummaryStripProps {
  txs: RecurringTx[];
}

export default function RecurringSummaryStrip({
  txs,
}: RecurringSummaryStripProps) {
  const totalMonthlyNet = useMemo(() => {
    return txs
      .filter((t) => t.enabled)
      .reduce((sum, t) => {
        const monthly = t.frequency === "weekly" ? t.amount * 4.33 : t.amount;
        return t.type === "debit" ? sum - monthly : sum + monthly;
      }, 0);
  }, [txs]);

  const activeCount = txs.filter((t) => t.enabled).length;
  const netFormatted =
    (totalMonthlyNet >= 0 ? "+" : "") +
    "₦" +
    Math.round(Math.abs(totalMonthlyNet)).toLocaleString();

  const stats = [
    {
      label: "Scheduled",
      sub: "transactions",
      value: txs.length,
      color: "text-[#0a1a14]",
    },
    {
      label: "Active",
      sub: "running",
      value: activeCount,
      color: "text-[#1D9E75]",
    },
    {
      label: "Monthly net",
      sub: totalMonthlyNet >= 0 ? "surplus" : "outflow",
      value: netFormatted,
      color: totalMonthlyNet >= 0 ? "text-[#1D9E75]" : "text-[#E24B4A]",
    },
  ];

  return (
    <div className="grid grid-cols-3 gap-3">
      {stats.map((s) => (
        <div
          key={s.label}
          className="bg-white border border-[#f0f0ee] rounded-2xl p-4 text-center"
        >
          <p className={`text-xl font-semibold ${s.color}`}>{s.value}</p>
          <p className="text-[10px] text-[#9ca3af] mt-0.5">
            {s.label} · {s.sub}
          </p>
        </div>
      ))}
    </div>
  );
}
