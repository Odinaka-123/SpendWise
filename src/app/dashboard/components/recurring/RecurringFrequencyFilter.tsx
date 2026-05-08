"use client";

import clsx from "clsx";
import type { Frequency } from "../../recurring/types";

type FilterValue = "all" | Frequency;

interface RecurringFrequencyFilterProps {
  value: FilterValue;
  onChange: (v: FilterValue) => void;
}

const OPTIONS: { label: string; value: FilterValue }[] = [
  { label: "All", value: "all" },
  { label: "Weekly", value: "weekly" },
  { label: "Monthly", value: "monthly" },
];

export default function RecurringFrequencyFilter({
  value,
  onChange,
}: RecurringFrequencyFilterProps) {
  return (
    <div className="flex gap-2">
      {OPTIONS.map((o) => (
        <button
          key={o.value}
          onClick={() => onChange(o.value)}
          className={clsx(
            "px-4 py-1.5 rounded-full text-xs font-medium transition-all duration-150",
            value === o.value ?
              "bg-[#0a1a14] text-white"
            : "bg-[#f7f6f2] text-[#6b7280] hover:bg-[#e5e7eb]",
          )}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}
