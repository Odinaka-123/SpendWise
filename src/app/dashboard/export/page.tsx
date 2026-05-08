"use client";

import { useState, useMemo } from "react";
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

// ─── Mock transaction data (same seed as transactions page) ───────────────────
const ALL_TRANSACTIONS = [
  {
    id: "1",
    name: "Shoprite Ikeja",
    category: "Groceries",
    amount: 4350,
    date: "2026-05-08",
    type: "debit" as const,
  },
  {
    id: "2",
    name: "Bolt ride",
    category: "Transport",
    amount: 1200,
    date: "2026-05-08",
    type: "debit" as const,
  },
  {
    id: "3",
    name: "Salary credit",
    category: "Income",
    amount: 200000,
    date: "2026-05-07",
    type: "credit" as const,
  },
  {
    id: "4",
    name: "Chicken Republic",
    category: "Dining",
    amount: 3800,
    date: "2026-05-07",
    type: "debit" as const,
  },
  {
    id: "5",
    name: "Netflix",
    category: "Entertainment",
    amount: 4600,
    date: "2026-05-07",
    type: "debit" as const,
  },
  {
    id: "6",
    name: "EKEDC Bill",
    category: "Utility",
    amount: 8500,
    date: "2026-05-06",
    type: "debit" as const,
  },
  {
    id: "7",
    name: "Rent payment",
    category: "Housing",
    amount: 35000,
    date: "2026-05-01",
    type: "debit" as const,
  },
  {
    id: "8",
    name: "Tantalizers",
    category: "Dining",
    amount: 2200,
    date: "2026-05-05",
    type: "debit" as const,
  },
  {
    id: "9",
    name: "Uber",
    category: "Transport",
    amount: 1600,
    date: "2026-05-04",
    type: "debit" as const,
  },
  {
    id: "10",
    name: "Konga order",
    category: "Other",
    amount: 12000,
    date: "2026-05-03",
    type: "debit" as const,
  },
];

// ─── CSV generator ────────────────────────────────────────────────────────────
function generateCSV(rows: typeof ALL_TRANSACTIONS) {
  const header = "Date,Description,Category,Type,Amount (₦)";
  const lines = rows.map(
    (r) => `${r.date},"${r.name}",${r.category},${r.type},${r.amount}`,
  );
  return [header, ...lines].join("\n");
}

// ─── PDF generator (plain text stub — replace with jsPDF / Puppeteer) ─────────
function generatePDFBlob(
  rows: typeof ALL_TRANSACTIONS,
  range: DateRange,
): Blob {
  // Stub: creates a text blob. Wire up jsPDF or a server-side PDF renderer here.
  const lines = [
    "SpendWise — Expense Report",
    `Period: ${range.from} to ${range.to}`,
    `Generated: ${new Date().toLocaleString()}`,
    "",
    "Date         Description              Category       Type    Amount",
    "─".repeat(72),
    ...rows.map(
      (r) =>
        `${r.date}  ${r.name.padEnd(24)} ${r.category.padEnd(14)} ${r.type.padEnd(7)} ₦${r.amount.toLocaleString()}`,
    ),
    "─".repeat(72),
    `Total income:  ₦${rows
      .filter((r) => r.type === "credit")
      .reduce((s, r) => s + r.amount, 0)
      .toLocaleString()}`,
    `Total expenses: ₦${rows
      .filter((r) => r.type === "debit")
      .reduce((s, r) => s + r.amount, 0)
      .toLocaleString()}`,
  ];
  return new Blob([lines.join("\n")], { type: "application/pdf" });
}

function triggerDownload(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

// ─── Initial date range (this month) ─────────────────────────────────────────
function thisMonth(): DateRange {
  const now = new Date();
  return {
    from: new Date(now.getFullYear(), now.getMonth(), 1)
      .toISOString()
      .split("T")[0],
    to: now.toISOString().split("T")[0],
  };
}

// ─── Initial recent exports ────────────────────────────────────────────────────
function getInitialRecentExports(): ExportRecord[] {
  const now = Date.now();
  return [
    {
      id: "prev-1",
      format: "pdf",
      label: "April 2026 — Full Report",
      generatedAt: new Date(now - 2 * 24 * 60 * 60 * 1000).toISOString(),
      size: "48 KB",
    },
    {
      id: "prev-2",
      format: "csv",
      label: "Q1 2026 — All Transactions",
      generatedAt: new Date(now - 7 * 24 * 60 * 60 * 1000).toISOString(),
      size: "12 KB",
    },
  ];
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function ReportsPage() {
  const [range, setRange] = useState<DateRange>(thisMonth());
  const [format, setFormat] = useState<ExportFormat>("pdf");
  const [filters, setFilters] = useState<ReportFilters>({
    categories: [],
    type: "all",
  });
  const [recentExports, setRecentExports] = useState<ExportRecord[]>(getInitialRecentExports());

  // ── Filtered transactions based on range + filters ──────────────────────────
  const filtered = useMemo(() => {
    return ALL_TRANSACTIONS.filter((t) => {
      const inRange =
        (!range.from || t.date >= range.from) &&
        (!range.to || t.date <= range.to);
      const inType = filters.type === "all" || t.type === filters.type;
      const inCat =
        filters.categories.length === 0 ||
        filters.categories.includes(t.category);
      return inRange && inType && inCat;
    });
  }, [range, filters]);

  const totalIncome = filtered
    .filter((t) => t.type === "credit")
    .reduce((s, t) => s + t.amount, 0);
  const totalExpense = filtered
    .filter((t) => t.type === "debit")
    .reduce((s, t) => s + t.amount, 0);

  // ── Export handler ──────────────────────────────────────────────────────────
  const handleExport = async () => {
    await new Promise((r) => setTimeout(r, 1400)); // simulate generation

    // const timestamp = new Date().toISOString().split("T")[0];
    const baseLabel = `${range.from}_to_${range.to}`;

    if (format === "csv") {
      const csv = generateCSV(filtered);
      const blob = new Blob([csv], { type: "text/csv" });
      triggerDownload(blob, `spendwise_${baseLabel}.csv`);
      const size = `${Math.round(blob.size / 1024) || 1} KB`;
      setRecentExports((p) => [
        {
          id: String(Date.now()),
          format: "csv",
          label: `${range.from} – ${range.to} · CSV`,
          generatedAt: new Date().toISOString(),
          size,
        },
        ...p.slice(0, 4),
      ]);
    } else {
      const blob = generatePDFBlob(filtered, range);
      triggerDownload(blob, `spendwise_${baseLabel}.pdf`);
      setRecentExports((p) => [
        {
          id: String(Date.now()),
          format: "pdf",
          label: `${range.from} – ${range.to} · PDF`,
          generatedAt: new Date().toISOString(),
          size: `${Math.round(blob.size / 1024) || 1} KB`,
        },
        ...p.slice(0, 4),
      ]);
    }
  };

  const handleReDownload = (id: string) => {
    const record = recentExports.find((r) => r.id === id);
    if (!record) return;
    // In production, re-fetch the stored file from Supabase Storage
    console.log("Re-downloading:", record);
  };

  const isReady = !!range.from && !!range.to && filtered.length > 0;

  return (
    <div className="space-y-5 max-w-300 mx-auto animate-fade-in">
      {/* Header */}
      <div>
        <h2 className="text-[#0a1a14] text-lg font-semibold">Export Reports</h2>
        <p className="text-[#9ca3af] text-xs mt-0.5">
          Download PDF summaries or CSV data by date range
        </p>
      </div>

      {/* Main layout: left config col + right preview col */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-5 items-start">
        {/* ── Left: config stack ── */}
        <div className="space-y-4">
          <ReportRangeSelector range={range} onChange={setRange} />
          <ReportFormatPicker selected={format} onChange={setFormat} />
          <ReportFiltersPanel filters={filters} onChange={setFilters} />
        </div>

        {/* ── Right: preview + export ── */}
        <div className="space-y-4 lg:sticky lg:top-6">
          <ReportPreviewCard
            format={format}
            range={range}
            filters={filters}
            txCount={filtered.length}
            totalIncome={totalIncome}
            totalExpense={totalExpense}
          />

          {/* Empty state warning */}
          {!isReady && filtered.length === 0 && range.from && range.to && (
            <div className="px-4 py-3 bg-[#FEF3C7] border border-[#FDE68A] rounded-xl">
              <p className="text-xs text-[#92400E]">
                No transactions found for this period and filter combination.
              </p>
            </div>
          )}

          <ExportButton
            format={format}
            disabled={!isReady}
            onExport={handleExport}
          />
        </div>
      </div>

      {/* Recent exports */}
      <RecentExports records={recentExports} onDownload={handleReDownload} />
    </div>
  );
}
