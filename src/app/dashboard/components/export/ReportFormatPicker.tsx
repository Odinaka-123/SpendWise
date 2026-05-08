"use client";

import { FileText, Table2 } from "lucide-react";
import clsx from "clsx";

export type ExportFormat = "pdf" | "csv";

interface FormatOption {
  id: ExportFormat;
  label: string;
  description: string;
  detail: string;
  icon: React.ElementType;
  iconBg: string;
  iconColor: string;
}

const OPTIONS: FormatOption[] = [
  {
    id: "pdf",
    label: "PDF Report",
    description: "Formatted summary with charts",
    detail: "Includes totals, category breakdown, and a transaction table — ready to share or print.",
    icon: FileText,
    iconBg: "bg-[#FBEAF0]",
    iconColor: "text-[#993556]",
  },
  {
    id: "csv",
    label: "CSV Spreadsheet",
    description: "Raw data for Excel or Sheets",
    detail: "Every transaction as a row — perfect for pivot tables, custom analysis, or importing elsewhere.",
    icon: Table2,
    iconBg: "bg-[#E6F1FB]",
    iconColor: "text-[#185FA5]",
  },
];

interface ReportFormatPickerProps {
  selected: ExportFormat;
  onChange: (f: ExportFormat) => void;
}

export default function ReportFormatPicker({ selected, onChange }: ReportFormatPickerProps) {
  return (
    <div className="bg-white border border-[#f0f0ee] rounded-2xl p-5 space-y-3">
      <p className="text-sm font-semibold text-[#0a1a14]">Export format</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {OPTIONS.map((opt) => {
          const Icon = opt.icon;
          const isActive = selected === opt.id;
          return (
            <button
              key={opt.id}
              onClick={() => onChange(opt.id)}
              className={clsx(
                "text-left rounded-xl border p-4 transition-all duration-150 group",
                isActive
                  ? "border-[#1D9E75] bg-[#E1F5EE]/40 ring-2 ring-[#1D9E75]/10"
                  : "border-[#f0f0ee] hover:border-[#d1d5db] hover:bg-[#f7f6f2]"
              )}
            >
              <div className="flex items-start gap-3">
                <div
                  className={clsx(
                    "w-9 h-9 rounded-xl flex items-center justify-center shrink-0",
                    opt.iconBg
                  )}
                >
                  <Icon size={16} className={opt.iconColor} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-semibold text-[#0a1a14]">{opt.label}</p>
                    {isActive && (
                      <span className="w-4 h-4 rounded-full bg-[#1D9E75] flex items-center justify-center shrink-0">
                        <svg width="8" height="6" viewBox="0 0 8 6" fill="none">
                          <path d="M1 3L3 5L7 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-[#9ca3af] mt-0.5">{opt.description}</p>
                  <p className="text-xs text-[#d1d5db] mt-2 leading-relaxed">{opt.detail}</p>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}