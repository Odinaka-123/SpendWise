"use client";

import { Pencil, Trash2 } from "lucide-react";
import clsx from "clsx";
import type { TransactionFormData } from "./TransactionModal";

export interface TxRow extends TransactionFormData {
  id: string;
  color?: string; // hex from DB category
}

function fmt(n: number) {
  return `₦${Number(n).toLocaleString()}`;
}

/** Lighten a hex colour for the avatar background */
function hexToRgba(hex: string, alpha: number) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r},${g},${b},${alpha})`;
}

interface TransactionTableProps {
  rows: TxRow[];
  onEdit: (row: TxRow) => void;
  onDelete: (id: string) => void;
}

export default function TransactionTable({
  rows,
  onEdit,
  onDelete,
}: TransactionTableProps) {
  if (rows.length === 0) {
    return (
      <div className="bg-white border border-[#f0f0ee] rounded-2xl p-12 text-center">
        <p className="text-[#9ca3af] text-sm">No transactions found.</p>
        <p className="text-[#d1d5db] text-xs mt-1">Try adjusting your filters.</p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-[#f0f0ee] rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="grid grid-cols-[2fr_1fr_1fr_1fr_80px] gap-4 px-5 py-3 border-b border-[#f0f0ee] bg-[#f7f6f2]">
        {["Description", "Category", "Date", "Amount", ""].map((h) => (
          <p key={h} className="text-[10px] font-semibold text-[#9ca3af] uppercase tracking-widest">
            {h}
          </p>
        ))}
      </div>

      {/* Rows */}
      <div className="divide-y divide-[#f7f6f2]">
        {rows.map((row) => {
          const color = row.color ?? "#9ca3af";
          const bgColor = hexToRgba(color, 0.12);

          return (
            <div
              key={row.id}
              className="grid grid-cols-[2fr_1fr_1fr_1fr_80px] gap-4 px-5 py-3.5 items-center hover:bg-[#fafaf9] transition-colors group"
            >
              {/* Description */}
              <div className="flex items-center gap-3 min-w-0">
                <div
                  className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
                  style={{ backgroundColor: bgColor }}
                >
                  <span className="text-xs font-bold" style={{ color }}>
                    {row.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-[#0a1a14] truncate">
                    {row.name}
                  </p>
                  {row.notes && (
                    <p className="text-xs text-[#9ca3af] truncate">{row.notes}</p>
                  )}
                </div>
              </div>

              {/* Category */}
              <span className="text-xs text-[#6b7280] truncate">
                {row.category || "—"}
              </span>

              {/* Date */}
              <span className="text-xs text-[#6b7280]">
                {new Date(row.date + "T00:00:00").toLocaleDateString("en-NG", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </span>

              {/* Amount */}
              <span
                className={clsx(
                  "text-sm font-semibold",
                  row.type === "credit" ? "text-[#0F6E56]" : "text-[#0a1a14]",
                )}
              >
                {row.type === "credit" ? "+" : "-"}
                {fmt(Number(row.amount))}
              </span>

              {/* Actions */}
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => onEdit(row)}
                  className="w-7 h-7 flex items-center justify-center rounded-lg text-[#9ca3af] hover:bg-[#f0f0ee] hover:text-[#0a1a14] transition-colors"
                  aria-label="Edit"
                >
                  <Pencil size={13} />
                </button>
                <button
                  onClick={() => onDelete(row.id)}
                  className="w-7 h-7 flex items-center justify-center rounded-lg text-[#9ca3af] hover:bg-red-50 hover:text-red-500 transition-colors"
                  aria-label="Delete"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}