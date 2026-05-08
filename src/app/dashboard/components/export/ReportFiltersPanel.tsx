"use client";

import { SlidersHorizontal } from "lucide-react";
import clsx from "clsx";

const CATEGORIES = [
  "Groceries",
  "Dining",
  "Transport",
  "Housing",
  "Entertainment",
  "Utility",
  "Income",
  "Other",
];

export interface ReportFilters {
  categories: string[];
  type: "all" | "debit" | "credit";
}

interface ReportFiltersProps {
  filters: ReportFilters;
  onChange: (f: ReportFilters) => void;
}

const TYPE_OPTIONS: { label: string; value: ReportFilters["type"] }[] = [
  { label: "All", value: "all" },
  { label: "Expenses only", value: "debit" },
  { label: "Income only", value: "credit" },
];

export default function ReportFiltersPanel({
  filters,
  onChange,
}: ReportFiltersProps) {
  const toggleCategory = (cat: string) => {
    const next =
      filters.categories.includes(cat) ?
        filters.categories.filter((c) => c !== cat)
      : [...filters.categories, cat];
    onChange({ ...filters, categories: next });
  };

  const allSelected = filters.categories.length === 0;

  return (
    <div className="bg-white border border-[#f0f0ee] rounded-2xl p-5 space-y-4">
      {/* Header */}
      <div className="flex items-center gap-2">
        <div className="w-7 h-7 rounded-lg bg-[#f7f6f2] flex items-center justify-center shrink-0">
          <SlidersHorizontal size={13} className="text-[#6b7280]" />
        </div>
        <p className="text-sm font-semibold text-[#0a1a14]">Filters</p>
        <span className="text-xs text-[#9ca3af]">(optional)</span>
      </div>

      {/* Transaction type */}
      <div className="space-y-2">
        <p className="text-xs font-medium text-[#9ca3af]">Transaction type</p>
        <div className="flex gap-2 flex-wrap">
          {TYPE_OPTIONS.map((t) => (
            <button
              key={t.value}
              onClick={() => onChange({ ...filters, type: t.value })}
              className={clsx(
                "px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-150",
                filters.type === t.value ?
                  "bg-[#0a1a14] text-white"
                : "bg-[#f7f6f2] text-[#6b7280] hover:bg-[#e5e7eb]",
              )}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Categories */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <p className="text-xs font-medium text-[#9ca3af]">Categories</p>
          <button
            onClick={() => onChange({ ...filters, categories: [] })}
            className="text-xs text-[#1D9E75] hover:underline"
          >
            {allSelected ? "All selected" : "Select all"}
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((cat) => {
            // const active = allSelected || filters.categories.includes(cat);
            return (
              <button
                key={cat}
                onClick={() => toggleCategory(cat)}
                className={clsx(
                  "px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-150",
                  filters.categories.includes(cat) ? "bg-[#1D9E75] text-white"
                  : allSelected ?
                    "bg-[#f7f6f2] text-[#6b7280] hover:bg-[#e5e7eb]"
                  : "bg-[#f7f6f2] text-[#d1d5db] hover:bg-[#e5e7eb] hover:text-[#6b7280]",
                )}
              >
                {cat}
              </button>
            );
          })}
        </div>
        {!allSelected && (
          <p className="text-xs text-[#9ca3af]">
            {filters.categories.length} of {CATEGORIES.length} selected
          </p>
        )}
      </div>
    </div>
  );
}
