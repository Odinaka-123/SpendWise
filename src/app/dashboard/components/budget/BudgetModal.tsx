"use client";

import { X, Check } from "lucide-react";
import { useState } from "react";
import type { Budget } from "./BudgetCard";
import type { Category } from "@/lib/database.types";

const FALLBACK_CATEGORIES = [
  "Groceries",
  "Dining",
  "Transport",
  "Housing",
  "Entertainment",
  "Utility",
  "Health",
  "Savings",
  "Education",
  "Shopping",
];

interface BudgetModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: { category: string; limit: number }) => Promise<void>;
  initial?: Budget | null;
  existingCategories: Set<string>;
  allCategories: Category[];
  externalError?: string | null;
}

export default function BudgetModal(props: BudgetModalProps) {
  if (!props.open) return null;
  const modalKey = props.initial
    ? `edit-${props.initial.category}-${props.initial.limit}`
    : "new";
  return <BudgetModalContent key={modalKey} {...props} />;
}

function BudgetModalContent({
  onClose,
  onSave,
  initial,
  existingCategories,
  allCategories,
  externalError,
}: Omit<BudgetModalProps, "open">) {
  // Use DB categories if available, otherwise fall back to hardcoded list
  // Strip "Other" out — it's handled separately
  const presetNames =
    allCategories.length > 0
      ? allCategories.map((c) => c.name).filter((n) => n !== "Other")
      : FALLBACK_CATEGORIES;

  // Default to first available preset, fallback to "Other"
  const firstAvailable =
    presetNames.find((n) => !existingCategories.has(n)) ?? "Other";

  const defaultCategory = initial?.category ?? firstAvailable;

  const [selected, setSelected]     = useState(defaultCategory);
  const [customName, setCustomName] = useState("");
  const [limit, setLimit]           = useState(initial?.limit?.toString() ?? "");
  const [saving, setSaving]         = useState(false);
  const [error, setError]           = useState<string | null>(null);

  const isOther      = selected === "Other";
  const categoryName = isOther ? customName.trim() : selected;

  const handleSave = async () => {
    if (!limit || Number(limit) <= 0) return;
    if (!categoryName) return;
    setSaving(true);
    setError(null);
    try {
      await onSave({ category: categoryName, limit: Number(limit) });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to save budget");
      setSaving(false);
    }
  };

  const dbCategory = allCategories.find((c) => c.name === selected);

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
          {/* Category */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-[#0a1a14]">
              Category
            </label>

            {initial ? (
              // Editing — read-only with color dot
              <div className="flex items-center gap-2.5 px-3 py-2.5 bg-[#f7f6f2] border border-[#f0f0ee] rounded-xl">
                <span
                  className="w-3 h-3 rounded-full shrink-0"
                  style={{ backgroundColor: dbCategory?.color ?? "#9ca3af" }}
                />
                <span className="text-sm text-[#0a1a14]">{selected}</span>
              </div>
            ) : (
              <select
                value={selected}
                onChange={(e) => {
                  setSelected(e.target.value);
                  setCustomName("");
                }}
                className="w-full px-3 py-2.5 bg-[#f7f6f2] border border-[#f0f0ee] rounded-xl text-sm text-[#0a1a14] focus:outline-none focus:border-[#1D9E75] focus:ring-2 focus:ring-[#1D9E75]/10 transition-all appearance-none"
              >
                {/* Preset categories group */}
                <optgroup label="Categories">
                  {presetNames.map((name) => {
                    const isTaken = existingCategories.has(name);
                    return (
                      <option key={name} value={name} disabled={isTaken}>
                        {isTaken ? `${name} (already budgeted)` : name}
                      </option>
                    );
                  })}
                </optgroup>

                {/* Custom / Other group */}
                <optgroup label="Custom">
                  <option value="Other">Other (type your own)</option>
                </optgroup>
              </select>
            )}

            {/* Custom name input when Other is selected */}
            {isOther && !initial && (
              <input
                type="text"
                placeholder="e.g. Pet care, Subscriptions…"
                value={customName}
                onChange={(e) => setCustomName(e.target.value)}
                autoFocus
                className="w-full px-3 py-2.5 bg-[#f7f6f2] border border-[#f0f0ee] rounded-xl text-sm text-[#0a1a14] placeholder:text-[#9ca3af] focus:outline-none focus:border-[#1D9E75] focus:ring-2 focus:ring-[#1D9E75]/10 transition-all"
              />
            )}
          </div>

          {/* Monthly limit */}
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

          <p className="text-xs text-[#9ca3af]">
            You&apos;ll be alerted when you reach 80% of this limit.
          </p>

          {(error || externalError) && (
            <p className="text-xs text-[#E24B4A] bg-[#FCEBEB] px-3 py-2 rounded-xl">
              {error ?? externalError}
            </p>
          )}
        </div>

        {/* Footer */}
        <div className="flex gap-2 px-5 pb-5">
          <button
            onClick={onClose}
            disabled={saving}
            className="flex-1 py-2.5 border border-[#e5e7eb] rounded-xl text-sm text-[#6b7280] hover:bg-[#f7f6f2] disabled:opacity-50 transition-all"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={
              saving ||
              !limit ||
              Number(limit) <= 0 ||
              (isOther && !customName.trim())
            }
            className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-[#1D9E75] hover:bg-[#0F6E56] disabled:opacity-50 text-white text-sm font-medium rounded-xl transition-all active:scale-[0.98]"
          >
            {saving ? (
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
              </svg>
            ) : (
              <Check size={14} />
            )}
            {saving ? "Saving…" : "Save budget"}
          </button>
        </div>
      </div>
    </div>
  );
}