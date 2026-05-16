import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

// ─── Supabase server client ───────────────────────────────────────────────────
async function getSupabase() {
  const cookieStore = await cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: (toSet: { name: string; value: string; options?: Record<string, unknown> }[]) => {
          try {
            toSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            );
          } catch {}
        },
      },
    },
  );
}

// ─── Types ────────────────────────────────────────────────────────────────────
// Supabase returns foreign-key joins as arrays even for many-to-one relations.
interface RawExpenseRow {
  date: string;
  name: string;
  amount: number;
  type: "debit" | "credit";
  category: { name: string }[] | null;
  notes: string | null;
}

interface ExpenseRow {
  date: string;
  name: string;
  amount: number;
  type: "debit" | "credit";
  category: { name: string } | null; // normalised single object
  notes: string | null;
}

function normaliseRows(raw: RawExpenseRow[]): ExpenseRow[] {
  return raw.map((r) => ({
    ...r,
    category: Array.isArray(r.category) ? (r.category[0] ?? null) : r.category,
  }));
}

// ─── CSV ──────────────────────────────────────────────────────────────────────
function toCSV(rows: ExpenseRow[]): string {
  const header = "Date,Description,Category,Type,Amount (₦),Notes";
  const lines = rows.map((r) => {
    const cat = r.category?.name ?? "";
    const notes = (r.notes ?? "").replace(/"/g, '""');
    const name = r.name.replace(/"/g, '""');
    return `${r.date},"${name}",${cat},${r.type},${r.amount},"${notes}"`;
  });
  return [header, ...lines].join("\n");
}

// ─── PDF ──────────────────────────────────────────────────────────────────────
function toPDF(rows: ExpenseRow[], from: string, to: string): ArrayBuffer {
  const doc = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });

  const totalIncome = rows
    .filter((r) => r.type === "credit")
    .reduce((s, r) => s + Number(r.amount), 0);
  const totalExpense = rows
    .filter((r) => r.type === "debit")
    .reduce((s, r) => s + Number(r.amount), 0);
  const net = totalIncome - totalExpense;

  // Header bar
  doc.setFillColor(29, 158, 117);
  doc.rect(0, 0, 297, 18, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(13);
  doc.setFont("helvetica", "bold");
  doc.text("SpendWise — Expense Report", 14, 11);
  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  doc.text(
    `Period: ${from} to ${to}   |   Generated: ${new Date().toLocaleString()}`,
    14,
    16,
  );

  // Summary strip
  const summaryY = 24;
  const summaryItems = [
    { label: "Transactions", value: String(rows.length), color: null as [number, number, number] | null },
    { label: "Total Income", value: `N${totalIncome.toLocaleString()}`, color: [15, 110, 86] as [number, number, number] },
    { label: "Total Expenses", value: `N${totalExpense.toLocaleString()}`, color: null },
    { label: "Net", value: `${net >= 0 ? "+" : ""}N${Math.abs(net).toLocaleString()}`, color: (net >= 0 ? [15, 110, 86] : [153, 60, 29]) as [number, number, number] },
  ];
  const colW = 65;
  summaryItems.forEach((col, i) => {
    const x = 14 + i * colW;
    doc.setFillColor(247, 246, 242);
    doc.roundedRect(x, summaryY, colW - 4, 16, 2, 2, "F");
    doc.setFontSize(7);
    doc.setTextColor(156, 163, 175);
    doc.setFont("helvetica", "normal");
    doc.text(col.label, x + 4, summaryY + 5);
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    if (col.color) {
      doc.setTextColor(...col.color);
    } else {
      doc.setTextColor(10, 26, 20);
    }
    doc.text(col.value, x + 4, summaryY + 12);
  });

  // Table
  autoTable(doc, {
    startY: summaryY + 22,
    head: [["Date", "Description", "Category", "Type", "Amount (N)", "Notes"]],
    body: rows.map((r) => [
      r.date,
      r.name,
      r.category?.name ?? "-",
      r.type === "credit" ? "Income" : "Expense",
      `N${Number(r.amount).toLocaleString()}`,
      r.notes ?? "",
    ]),
    styles: { fontSize: 8, cellPadding: 3, textColor: [10, 26, 20] },
    headStyles: {
      fillColor: [10, 26, 20],
      textColor: [255, 255, 255],
      fontStyle: "bold",
      fontSize: 7,
    },
    alternateRowStyles: { fillColor: [250, 250, 249] },
    columnStyles: {
      0: { cellWidth: 24 },
      1: { cellWidth: 60 },
      2: { cellWidth: 30 },
      3: { cellWidth: 22 },
      4: { cellWidth: 32, halign: "right" },
      5: { cellWidth: "auto" },
    },
    didParseCell: (data) => {
      if (data.section === "body") {
        const row = data.row.raw as string[];
        if (data.column.index === 3) {
          data.cell.styles.textColor =
            row[3] === "Income" ? [15, 110, 86] : [153, 60, 29];
          data.cell.styles.fontStyle = "bold";
        }
        if (data.column.index === 4) {
          data.cell.styles.textColor =
            row[3] === "Income" ? [15, 110, 86] : [10, 26, 20];
          data.cell.styles.fontStyle = "bold";
        }
      }
    },
  });

  // Footer
  const pageCount = (
    doc as jsPDF & { internal: { getNumberOfPages: () => number } }
  ).internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(7);
    doc.setTextColor(156, 163, 175);
    doc.setFont("helvetica", "normal");
    doc.text(`SpendWise · Page ${i} of ${pageCount}`, 297 / 2, 206, {
      align: "center",
    });
  }

  // output("arraybuffer") → ArrayBuffer (valid BodyInit for NextResponse)
  return doc.output("arraybuffer") as ArrayBuffer;
}

// ─── Route handler ────────────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  try {
    const { from, to, type, categories, format } = await req.json();
    const supabase = await getSupabase();

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let query = supabase
      .from("expenses")
      .select("date, name, amount, type, notes, category:categories(name)")
      .eq("user_id", user.id)
      .order("date", { ascending: false });

    if (from) query = query.gte("date", from);
    if (to) query = query.lte("date", to);
    if (type && type !== "all") query = query.eq("type", type);

    if (categories && categories.length > 0) {
      const { data: catRows } = await supabase
        .from("categories")
        .select("id")
        .eq("user_id", user.id)
        .in("name", categories);
      const ids = (catRows ?? []).map((c: { id: string }) => c.id);
      if (ids.length > 0) query = query.in("category_id", ids);
    }

    const { data: rows, error } = await query;
    if (error) throw new Error(error.message);

    const safeRows = normaliseRows((rows ?? []) as RawExpenseRow[]);

    if (format === "csv") {
      const csv = toCSV(safeRows);
      return new NextResponse(csv, {
        status: 200,
        headers: {
          "Content-Type": "text/csv",
          "Content-Disposition": `attachment; filename="spendwise-report.csv"`,
        },
      });
    }

    const pdfBuffer = toPDF(safeRows, from ?? "", to ?? "");
    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="spendwise-report.pdf"`,
      },
    });
  } catch (err) {
    console.error("[/api/export]", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Export failed" },
      { status: 500 },
    );
  }
}