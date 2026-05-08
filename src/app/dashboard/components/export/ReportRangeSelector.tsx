"use client";

import { useState } from "react";
import clsx from "clsx";
import { CalendarDays } from "lucide-react";

export interface DateRange {
  from: string;
  to: string;
}

const PRESETS: { label: string; getValue: () => DateRange }[] = [
  {
    label: "This month",
    getValue: () => {
      const now = new Date();
      const from = new Date(now.getFullYear(), now.getMonth(), 1);
      return {
        from: from.toISOString().split("T")[0],
        to: now.toISOString().split("T")[0],
      };
    },
  },
  {
    label: "Last month",
    getValue: () => {
      const now = new Date();
      const from = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      const to = new Date(now.getFullYear(), now.getMonth(), 0);
      return {
        from: from.toISOString().split("T")[0],
        to: to.toISOString().split("T")[0],
      };
    },
  },
  {
    label: "Last 3 months",
    getValue: () => {
      const now = new Date();
      const from = new Date(now.getFullYear(), now.getMonth() - 3, 1);
      return {
        from: from.toISOString().split("T")[0],
        to: now.toISOString().split("T")[0],
      };
    },
  },
  {
    label: "Last 6 months",
    getValue: () => {
      const now = new Date();
      const from = new Date(now.getFullYear(), now.getMonth() - 6, 1);
      return {
        from: from.toISOString().split("T")[0],
        to: now.toISOString().split("T")[0],
      };
    },
  },
  {
    label: "This year",
    getValue: () => {
      const now = new Date();
      return {
        from: `${now.getFullYear()}-01-01`,
        to: now.toISOString().split("T")[0],
      };
    },
  },
];

interface ReportRangeSelectorProps {
  range: DateRange;
  onChange: (r: DateRange) => void;
}

export default function ReportRangeSelector({
  range,
  onChange,
}: ReportRangeSelectorProps) {
  const [activePreset, setActivePreset] = useState<string | null>("This month");

  const applyPreset = (preset: (typeof PRESETS)[number]) => {
    setActivePreset(preset.label);
    onChange(preset.getValue());
  };

  const handleManualChange = (key: keyof DateRange, val: string) => {
    setActivePreset(null);
    onChange({ ...range, [key]: val });
  };

  const inputCls =
    "px-3 py-2.5 bg-[#f7f6f2] border border-[#f0f0ee] rounded-xl text-sm text-[#6b7280] focus:outline-none focus:border-[#1D9E75] focus:ring-2 focus:ring-[#1D9E75]/10 transition-all";

  return (
    <div className="bg-white border border-[#f0f0ee] rounded-2xl p-5 space-y-4">
      {/* Title row */}
      <div className="flex items-center gap-2">
        <div className="w-7 h-7 rounded-lg bg-[#E1F5EE] flex items-center justify-center shrink-0">
          <CalendarDays size={14} className="text-[#1D9E75]" />
        </div>
        <p className="text-sm font-semibold text-[#0a1a14]">Date range</p>
      </div>

      {/* Quick presets */}
      <div className="flex flex-wrap gap-2">
        {PRESETS.map((p) => (
          <button
            key={p.label}
            onClick={() => applyPreset(p)}
            className={clsx(
              "px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-150",
              activePreset === p.label ?
                "bg-[#0a1a14] text-white"
              : "bg-[#f7f6f2] text-[#6b7280] hover:bg-[#e5e7eb]",
            )}
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* Manual date inputs */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-[#9ca3af]">From</label>
          <input
            type="date"
            value={range.from}
            onChange={(e) => handleManualChange("from", e.target.value)}
            className={inputCls}
          />
        </div>
        <span className="text-[#d1d5db] text-sm mt-4">→</span>
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-[#9ca3af]">To</label>
          <input
            type="date"
            value={range.to}
            onChange={(e) => handleManualChange("to", e.target.value)}
            className={inputCls}
          />
        </div>
      </div>
    </div>
  );
}
