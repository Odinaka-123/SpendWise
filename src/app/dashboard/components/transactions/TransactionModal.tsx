"use client";

import { X, Check } from "lucide-react";
import { useState } from "react";
import clsx from "clsx";

const categories = [
  "Groceries",
  "Dining",
  "Transport",
  "Housing",
  "Entertainment",
  "Income",
  "Utility",
  "Other",
];

export interface TransactionFormData {
  id?: string;
  name: string;
  amount: string;
  category: string;
  date: string;
  type: "debit" | "credit";
  notes: string;
}

interface TransactionModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: TransactionFormData) => void;
  initial?: TransactionFormData | null;
}

const empty: TransactionFormData = {
  name: "",
  amount: "",
  category: "Groceries",
  date: new Date().toISOString().split("T")[0],
  type: "debit",
  notes: "",
};

export default function TransactionModal({
  open,
  onClose,
  onSave,
  initial,
}: TransactionModalProps) {
  const [form, setForm] = useState<TransactionFormData>(initial ?? empty);

  const [saving, setSaving] = useState(false);

  if (!open) return null;

  const update = (k: keyof TransactionFormData, v: string) =>
    setForm((p) => ({ ...p, [k]: v }));

  const handleSave = async () => {
    if (!form.name || !form.amount) return;

    setSaving(true);

    await new Promise((r) => setTimeout(r, 600));

    onSave(form);

    setSaving(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-[#0a1a14]/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-md animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#f0f0ee]">
          <h2 className="text-[#0a1a14] text-base font-semibold">
            {initial?.id ? "Edit transaction" : "Add transaction"}
          </h2>

          <button
            onClick={onClose}
            className="w-7 h-7 flex items-center justify-center rounded-lg text-[#9ca3af] hover:bg-[#f7f6f2] hover:text-[#0a1a14] transition-colors"
          >
            <X size={15} />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-4">
          {/* Type toggle */}
          <div className="flex bg-[#f7f6f2] rounded-xl p-1 gap-1">
            {(["debit", "credit"] as const).map((t) => (
              <button
                key={t}
                onClick={() => update("type", t)}
                className={clsx(
                  "flex-1 py-1.5 rounded-lg text-sm font-medium transition-all duration-150 capitalize",
                  form.type === t ?
                    t === "debit" ?
                      "bg-white text-[#0a1a14] shadow-sm"
                    : "bg-[#1D9E75] text-white shadow-sm"
                  : "text-[#9ca3af]",
                )}
              >
                {t === "debit" ? "Expense" : "Income"}
              </button>
            ))}
          </div>

          {/* Name */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-[#0a1a14]">
              Description
            </label>

            <input
              type="text"
              placeholder="e.g. Shoprite Ikeja"
              value={form.name}
              onChange={(e) => update("name", e.target.value)}
              className="w-full px-3 py-2.5 bg-[#f7f6f2] border border-[#f0f0ee] rounded-xl text-sm text-[#0a1a14] placeholder:text-[#9ca3af] focus:outline-none focus:border-[#1D9E75] focus:ring-2 focus:ring-[#1D9E75]/10 transition-all"
            />
          </div>

          {/* Amount + Category */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-[#0a1a14]">
                Amount (₦)
              </label>

              <input
                type="number"
                placeholder="0.00"
                value={form.amount}
                onChange={(e) => update("amount", e.target.value)}
                className="w-full px-3 py-2.5 bg-[#f7f6f2] border border-[#f0f0ee] rounded-xl text-sm text-[#0a1a14] placeholder:text-[#9ca3af] focus:outline-none focus:border-[#1D9E75] focus:ring-2 focus:ring-[#1D9E75]/10 transition-all"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-[#0a1a14]">
                Category
              </label>

              <select
                value={form.category}
                onChange={(e) => update("category", e.target.value)}
                className="w-full px-3 py-2.5 bg-[#f7f6f2] border border-[#f0f0ee] rounded-xl text-sm text-[#0a1a14] focus:outline-none focus:border-[#1D9E75] focus:ring-2 focus:ring-[#1D9E75]/10 transition-all appearance-none"
              >
                {categories.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Date */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-[#0a1a14]">Date</label>

            <input
              type="date"
              value={form.date}
              onChange={(e) => update("date", e.target.value)}
              className="w-full px-3 py-2.5 bg-[#f7f6f2] border border-[#f0f0ee] rounded-xl text-sm text-[#6b7280] focus:outline-none focus:border-[#1D9E75] focus:ring-2 focus:ring-[#1D9E75]/10 transition-all"
            />
          </div>

          {/* Notes */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-[#0a1a14]">
              Notes{" "}
              <span className="text-[#9ca3af] font-normal">(optional)</span>
            </label>

            <textarea
              placeholder="Add a note…"
              rows={2}
              value={form.notes}
              onChange={(e) => update("notes", e.target.value)}
              className="w-full px-3 py-2.5 bg-[#f7f6f2] border border-[#f0f0ee] rounded-xl text-sm text-[#0a1a14] placeholder:text-[#9ca3af] focus:outline-none focus:border-[#1D9E75] focus:ring-2 focus:ring-[#1D9E75]/10 transition-all resize-none"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-2 px-5 pb-5">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 border border-[#e5e7eb] rounded-xl text-sm text-[#6b7280] hover:bg-[#f7f6f2] transition-all"
          >
            Cancel
          </button>

          <button
            onClick={handleSave}
            disabled={saving || !form.name || !form.amount}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-[#1D9E75] hover:bg-[#0F6E56] disabled:opacity-50 text-white text-sm font-medium rounded-xl transition-all duration-150 active:scale-[0.98]"
          >
            {saving ?
              <svg
                className="animate-spin h-4 w-4"
                viewBox="0 0 24 24"
                fill="none"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />

                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v8z"
                />
              </svg>
            : <Check size={14} />}

            {saving ? "Saving…" : "Save transaction"}
          </button>
        </div>
      </div>
    </div>
  );
}
