"use client";

import { FileText, Table2, Download, Clock } from "lucide-react";
import type { ExportFormat } from "./ReportFormatPicker";

export interface ExportRecord {
  id: string;
  format: ExportFormat;
  label: string;
  generatedAt: string; // ISO string
  size: string;
}

interface RecentExportsProps {
  records: ExportRecord[];
  onDownload: (id: string) => void;
}

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

export default function RecentExports({
  records,
  onDownload,
}: RecentExportsProps) {
  if (records.length === 0) return null;

  return (
    <div className="bg-white border border-[#f0f0ee] rounded-2xl p-5 space-y-3">
      <div className="flex items-center gap-2">
        <Clock size={13} className="text-[#9ca3af]" />
        <p className="text-sm font-semibold text-[#0a1a14]">Recent exports</p>
      </div>

      <div className="space-y-2">
        {records.map((r) => {
          const Icon = r.format === "pdf" ? FileText : Table2;
          const iconBg = r.format === "pdf" ? "bg-[#FBEAF0]" : "bg-[#E6F1FB]";
          const iconColor =
            r.format === "pdf" ? "text-[#993556]" : "text-[#185FA5]";

          return (
            <div
              key={r.id}
              className="flex items-center justify-between gap-3 px-3 py-2.5 bg-[#f7f6f2] rounded-xl group hover:bg-[#f0f0ee] transition-colors"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div
                  className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${iconBg}`}
                >
                  <Icon size={13} className={iconColor} />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-medium text-[#0a1a14] truncate">
                    {r.label}
                  </p>
                  <p className="text-[10px] text-[#9ca3af]">
                    {r.format.toUpperCase()} · {r.size} ·{" "}
                    {timeAgo(r.generatedAt)}
                  </p>
                </div>
              </div>

              <button
                onClick={() => onDownload(r.id)}
                className="w-7 h-7 flex items-center justify-center rounded-lg text-[#9ca3af] hover:bg-white hover:text-[#1D9E75] transition-colors shrink-0"
                aria-label="Re-download"
              >
                <Download size={13} />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
