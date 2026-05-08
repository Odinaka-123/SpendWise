"use client";

import { FileText, Table2, CalendarDays, Tag, ArrowDownUp } from "lucide-react";
import type { ExportFormat } from "./ReportFormatPicker";
import type { DateRange } from "./ReportRangeSelector";
import type { ReportFilters } from "./ReportFiltersPanel";

interface ReportPreviewCardProps {
  format: ExportFormat;
  range: DateRange;
  filters: ReportFilters;
  txCount: number;
  totalIncome: number;
  totalExpense: number;
}

function fmt(n: number) {
  return `₦${Number(n).toLocaleString()}`;
}

function formatDate(d: string) {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("en-NG", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function ReportPreviewCard({
  format,
  range,
  filters,
  txCount,
  totalIncome,
  totalExpense,
}: ReportPreviewCardProps) {
  const FormatIcon = format === "pdf" ? FileText : Table2;
  const formatLabel = format === "pdf" ? "PDF Report" : "CSV Spreadsheet";
  const formatColor = format === "pdf" ? "text-[#993556]" : "text-[#185FA5]";
  const formatBg = format === "pdf" ? "bg-[#FBEAF0]" : "bg-[#E6F1FB]";

  const typeLabel =
    filters.type === "all" ? "All transactions"
    : filters.type === "debit" ? "Expenses only"
    : "Income only";

  const catLabel =
    filters.categories.length === 0 ? "All categories"
    : filters.categories.length === 1 ? filters.categories[0]
    : `${filters.categories.length} categories`;

  return (
    <div className="bg-white border border-[#f0f0ee] rounded-2xl overflow-hidden">
      {/* Top accent bar */}
      <div className="h-1 w-full bg-linear-to-r from-[#1D9E75] to-[#0F6E56]" />

      <div className="p-5 space-y-4">
        {/* Format badge */}
        <div className="flex items-center gap-3">
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${formatBg}`}
          >
            <FormatIcon size={18} className={formatColor} />
          </div>
          <div>
            <p className="text-sm font-semibold text-[#0a1a14]">
              Export preview
            </p>
            <p className="text-xs text-[#9ca3af]">{formatLabel}</p>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-[#f7f6f2]" />

        {/* Stats grid */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: "Transactions", value: txCount.toString() },
            { label: "Total income", value: fmt(totalIncome) },
            { label: "Total expenses", value: fmt(totalExpense) },
          ].map((s) => (
            <div key={s.label} className="bg-[#f7f6f2] rounded-xl px-3 py-2.5">
              <p className="text-[10px] text-[#9ca3af] mb-0.5">{s.label}</p>
              <p className="text-sm font-semibold text-[#0a1a14] truncate">
                {s.value}
              </p>
            </div>
          ))}
        </div>

        {/* Meta rows */}
        <div className="space-y-2">
          {[
            {
              icon: CalendarDays,
              label: "Period",
              value: `${formatDate(range.from)} – ${formatDate(range.to)}`,
            },
            {
              icon: ArrowDownUp,
              label: "Type",
              value: typeLabel,
            },
            {
              icon: Tag,
              label: "Categories",
              value: catLabel,
            },
          ].map(({ icon: Icon, label, value }) => (
            <div key={label} className="flex items-center gap-3">
              <Icon size={13} className="text-[#9ca3af] shrink-0" />
              <span className="text-xs text-[#9ca3af] w-20 shrink-0">
                {label}
              </span>
              <span className="text-xs font-medium text-[#0a1a14] truncate">
                {value}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
