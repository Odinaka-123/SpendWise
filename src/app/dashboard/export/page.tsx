"use client";

import { useState, useMemo, useEffect } from "react";
import ReportRangeSelector, {
  type DateRange,
} from "../components/export/ReportRangeSelector";
import ReportFormatPicker, {
  type ExportFormat,
} from "../components/export/ReportFormatPicker";
import ReportFiltersPanel, {
  type ReportFilters,
} from "../components/export/ReportFiltersPanel";
import ReportPreviewCard from "../components/export/ReportPreviewCard";
import ExportButton from "../components/export/ExportButton";
import RecentExports, {
  type ExportRecord,
} from "../components/export/RecentExports";
import { useCategories } from "@/hooks/useCategories";
import { supabase } from "@/lib/supabase";

// ─── Helpers ──────────────────────────────────────────────────────────────────
function thisMonth(): DateRange {
  const now = new Date();
  return {
    from: new Date(now.getFullYear(), now.getMonth(), 1)
      .toISOString()
      .split("T")[0],
    to: now.toISOString().split("T")[0],
  };
}

function getInitialRecentExports(): ExportRecord[] {
  const now = Date.now();
  return [
    {
      id: "prev-1",
      format: "pdf",
      label: "April 2026 — Full Report",
      generatedAt: new Date(now - 2 * 86400000).toISOString(),
      size: "48 KB",
    },
    {
      id: "prev-2",
      format: "csv",
      label: "Q1 2026 — All Transactions",
      generatedAt: new Date(now - 7 * 86400000).toISOString(),
      size: "12 KB",
    },
  ];
}

interface PreviewStats {
  txCount: number;
  totalIncome: number;
  totalExpense: number;
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function ReportsPage() {
  const [range, setRange] = useState<DateRange>(thisMonth());
  const [format, setFormat] = useState<ExportFormat>("pdf");
  const [filters, setFilters] = useState<ReportFilters>({
    categories: [],
    type: "all",
  });
  const [recentExports, setRecentExports] = useState<ExportRecord[]>(
    getInitialRecentExports(),
  );
  const [preview, setPreview] = useState<PreviewStats>({
    txCount: 0,
    totalIncome: 0,
    totalExpense: 0,
  });
  const [previewLoading, setPreviewLoading] = useState(false);

  const { categories } = useCategories();
  const categoryNames = useMemo(
    () => categories.map((c) => c.name),
    [categories],
  );

  // ── Live preview: re-query whenever range or filters change ─────────────────
  useEffect(() => {
    let cancelled = false;

    (async () => {
      setPreviewLoading(true);
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (!user || cancelled) return;

        let query = supabase
          .from("expenses")
          .select("amount, type, category_id")
          .eq("user_id", user.id);

        if (range.from) query = query.gte("date", range.from);
        if (range.to) query = query.lte("date", range.to);
        if (filters.type !== "all") query = query.eq("type", filters.type);

        // Filter by category names → ids
        if (filters.categories.length > 0) {
          const matchedIds = categories
            .filter((c) => filters.categories.includes(c.name))
            .map((c) => c.id);
          if (matchedIds.length > 0) {
            query = query.in("category_id", matchedIds);
          }
        }

        const { data } = await query;
        if (cancelled || !data) return;

        const rows = data as { amount: number; type: string }[];
        const totalIncome = rows
          .filter((r) => r.type === "credit")
          .reduce((s, r) => s + Number(r.amount), 0);
        const totalExpense = rows
          .filter((r) => r.type === "debit")
          .reduce((s, r) => s + Number(r.amount), 0);

        setPreview({ txCount: rows.length, totalIncome, totalExpense });
      } finally {
        if (!cancelled) setPreviewLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [range, filters, categories]);

  // ── Export ─────────────────────────────────────────────────────────────────
  const handleExport = async () => {
    const res = await fetch("/api/export", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        from: range.from,
        to: range.to,
        type: filters.type,
        categories: filters.categories,
        format,
      }),
    });

    if (!res.ok) throw new Error("Export failed");

    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `spendwise-report.${format}`;
    a.click();
    URL.revokeObjectURL(url);

    setRecentExports((prev) => [
      {
        id: String(Date.now()),
        format,
        label: `${range.from} – ${range.to} · ${format.toUpperCase()}`,
        generatedAt: new Date().toISOString(),
        size: `${Math.round(blob.size / 1024) || 1} KB`,
      },
      ...prev.slice(0, 4),
    ]);
  };

  // Re-download: re-call the API with same params stored in the label
  // In production: store params in Supabase storage and fetch by id.
  const handleReDownload = async (id: string) => {
    const record = recentExports.find((r) => r.id === id);
    if (!record) return;
    console.log("Re-download requested for:", record.label);
  };

  const isReady = !!range.from && !!range.to && preview.txCount > 0;

  return (
    <div className="space-y-5 max-w-5xl mx-auto animate-fade-in">
      {/* Header */}
      <div>
        <h2 className="text-lg font-semibold text-[#0a1a14]">
          Export Reports
        </h2>
        <p className="text-xs text-[#9ca3af] mt-0.5">
          Download your real transaction data as PDF or CSV
        </p>
      </div>

      {/* Layout */}
      <div className="grid lg:grid-cols-[1fr_320px] gap-5">
        {/* Left — config */}
        <div className="space-y-4">
          <ReportRangeSelector range={range} onChange={setRange} />
          <ReportFormatPicker selected={format} onChange={setFormat} />
          <ReportFiltersPanel
            filters={filters}
            onChange={setFilters}
            categoryOptions={categoryNames}
          />
        </div>

        {/* Right — preview + export */}
        <div className="space-y-4 lg:sticky lg:top-6">
          {/* Preview shimmer while loading */}
          <div className="relative">
            {previewLoading && (
              <div className="absolute inset-0 bg-white/60 rounded-2xl z-10 animate-pulse" />
            )}
            <ReportPreviewCard
              format={format}
              range={range}
              filters={filters}
              txCount={preview.txCount}
              totalIncome={preview.totalIncome}
              totalExpense={preview.totalExpense}
            />
          </div>

          {/* Empty warning */}
          {!previewLoading && range.from && range.to && preview.txCount === 0 && (
            <div className="px-4 py-3 bg-[#FEF3C7] border border-[#FDE68A] rounded-xl">
              <p className="text-xs text-[#92400E]">
                No transactions found for this period and filter combination.
              </p>
            </div>
          )}

          <ExportButton
            format={format}
            disabled={!isReady || previewLoading}
            onExport={handleExport}
          />
        </div>
      </div>

      {/* Recent exports */}
      <RecentExports records={recentExports} onDownload={handleReDownload} />
    </div>
  );
}