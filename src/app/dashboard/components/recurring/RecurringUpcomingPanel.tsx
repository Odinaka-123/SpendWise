"use client";

import { useMemo } from "react";
import { Clock, Calendar } from "lucide-react";
import clsx from "clsx";
import type { RecurringTx, TxType } from "../../recurring/types";
import {
  daysUntil,
  formatDate,
  friendlyDays,
  addDays,
  addMonths,
} from "../../recurring/types";

interface RecurringUpcomingPanelProps {
  txs: RecurringTx[];
}

interface UpcomingEntry {
  name: string;
  date: string;
  amount: number;
  type: TxType;
}

export default function RecurringUpcomingPanel({
  txs,
}: RecurringUpcomingPanelProps) {
  const upcoming = useMemo<UpcomingEntry[]>(() => {
    const all: UpcomingEntry[] = [];
    txs
      .filter((t) => t.enabled)
      .forEach((t) => {
        let d = t.nextDate;
        for (let i = 0; i < 3; i++) {
          all.push({ name: t.name, date: d, amount: t.amount, type: t.type });
          d = t.frequency === "weekly" ? addDays(d, 7) : addMonths(d, 1);
        }
      });
    return all.sort((a, b) => a.date.localeCompare(b.date)).slice(0, 5);
  }, [txs]);

  if (upcoming.length === 0) return null;

  return (
    <div className="bg-white border border-[#f0f0ee] rounded-2xl p-5 space-y-3">
      <div className="flex items-center gap-2">
        <Clock size={13} className="text-[#9ca3af]" />
        <p className="text-sm font-semibold text-[#0a1a14]">
          Upcoming (next 5)
        </p>
      </div>

      <div className="space-y-2">
        {upcoming.map((u, i) => {
          const days = daysUntil(u.date);
          return (
            <div
              key={i}
              className="flex items-center justify-between gap-3 px-3 py-2.5 bg-[#f7f6f2] rounded-xl"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-7 h-7 rounded-lg bg-white border border-[#f0f0ee] flex items-center justify-center shrink-0">
                  <Calendar size={11} className="text-[#9ca3af]" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-medium text-[#0a1a14] truncate">
                    {u.name}
                  </p>
                  <p className="text-[10px] text-[#9ca3af]">
                    {formatDate(u.date)} · {friendlyDays(days)}
                  </p>
                </div>
              </div>
              <p
                className={clsx(
                  "text-xs font-semibold shrink-0",
                  u.type === "credit" ? "text-[#1D9E75]" : "text-[#0a1a14]",
                )}
              >
                {u.type === "credit" ? "+" : "-"}₦{u.amount.toLocaleString()}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
