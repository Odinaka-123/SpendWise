"use client";

import { X, Check } from "lucide-react";
import { useState } from "react";
import type { Budget } from "./BudgetCard";

const categories = [
  "Groceries",
  "Dining",
  "Transport",
  "Housing",
  "Entertainment",
  "Utility",
  "Other",
];

interface BudgetModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: { category: string; limit: number }) => void;
  initial?: Budget | null;
  existingCategories: Set<string>;
}

export default function BudgetModal({
  open,
  onClose,
  onSave,
  initial,
  existingCategories,
}: BudgetModalProps) {
  if (!open) return null;

  const modalKey =
    initial ? `edit-${initial.category}-${initial.limit}` : "new";

  return (
    <BudgetModalContent
      key={modalKey}
      onClose={onClose}
      onSave={onSave}
      initial={initial}
      existingCategories={existingCategories}
    />
  );
}

function BudgetModalContent({
  onClose,
  onSave,
  initial,
  existingCategories,
}: Omit<BudgetModalProps, "open">) {
  const availableCategories =
    initial ? categories : categories.filter((c) => !existingCategories.has(c));

  const [category, setCategory] = useState(
    initial?.category ?? availableCategories[0] ?? "Groceries",
  );
  const [limit, setLimit] = useState(initial?.limit?.toString() ?? "");
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!limit || Number(limit) <= 0) return;
    setSaving(true);
    await new Promise((r) => setTimeout(r, 500));
    onSave({ category, limit: Number(limit) });
    setSaving(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-[#0a1a14]/40 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-sm animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#f0f0ee]">
          <h2 className="text-[#0a1a14] text-base font-semibold">
            {initial ? "Edit budget" : "New budget"}
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
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-[#0a1a14]">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              disabled={!!initial}
              className="w-full px-3 py-2.5 bg-[#f7f6f2] border border-[#f0f0ee] rounded-xl text-sm text-[#0a1a14] focus:outline-none focus:border-[#1D9E75] focus:ring-2 focus:ring-[#1D9E75]/10 transition-all appearance-none disabled:opacity-60"
            >
              {availableCategories.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-[#0a1a14]">
              Monthly limit (₦)
            </label>
            <input
              type="number"
              placeholder="0.00"
              value={limit}
              onChange={(e) => setLimit(e.target.value)}
              className="w-full px-3 py-2.5 bg-[#f7f6f2] border border-[#f0f0ee] rounded-xl text-sm text-[#0a1a14] placeholder:text-[#9ca3af] focus:outline-none focus:border-[#1D9E75] focus:ring-2 focus:ring-[#1D9E75]/10 transition-all"
            />
          </div>

          {/* Helper hint */}
          <p className="text-xs text-[#9ca3af]">
            Set a monthly spending cap. You&apos;ll be alerted when you hit 80%.
          </p>
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
            disabled={saving || !limit || Number(limit) <= 0}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-[#1D9E75] hover:bg-[#0F6E56] disabled:opacity-50 text-white text-sm font-medium rounded-xl transition-all active:scale-[0.98]"
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
            {saving ? "Saving…" : "Save budget"}
          </button>
        </div>
      </div>
    </div>
  );
}
