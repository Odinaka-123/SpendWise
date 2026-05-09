"use client";

import { X, Check } from "lucide-react";
import { useState } from "react";
import clsx from "clsx";
import { useCategories } from "@/hooks/useCategories";

export interface TransactionFormData {
  id?: string;
  name: string;
  amount: string;
  category: string;       // category name (display)
  category_id: string;    // category uuid (DB)
  date: string;
  type: "debit" | "credit";
  notes: string;
}

interface TransactionModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: TransactionFormData) => Promise<void>;
  initial?: TransactionFormData | null;
}

const makeEmpty = (today: string): TransactionFormData => ({
  name: "",
  amount: "",
  category: "",
  category_id: "",
  date: today,
  type: "debit",
  notes: "",
});

export default function TransactionModal({
  open,
  onClose,
  onSave,
  initial,
}: TransactionModalProps) {
  if (!open) return null;
  // Key resets internal state whenever initial changes
  const key = initial?.id ?? "new";
  return (
    <TransactionModalContent
      key={key}
      onClose={onClose}
      onSave={onSave}
      initial={initial}
    />
  );
}

function TransactionModalContent({
  onClose,
  onSave,
  initial,
}: Omit<TransactionModalProps, "open">) {
  const today = new Date().toISOString().split("T")[0];
  const { categories, loading: catsLoading } = useCategories();

  const [form, setForm] = useState<TransactionFormData>(
    initial ?? makeEmpty(today),
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const update = <K extends keyof TransactionFormData>(
    k: K,
    v: TransactionFormData[K],
  ) => setForm((p) => ({ ...p, [k]: v }));

  const handleCategoryChange = (id: string) => {
    const cat = categories.find((c) => c.id === id);
    update("category_id", id);
    update("category", cat?.name ?? "");
  };

  const handleSave = async () => {
    if (!form.name || !form.amount) return;
    setSaving(true);
    setError(null);
    try {
      await onSave(form);
      onClose();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to save");
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-[#0a1a14]/40 backdrop-blur-sm"
        onClick={onClose}
      />

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
                  form.type === t
                    ? t === "debit"
                      ? "bg-white text-[#0a1a14] shadow-sm"
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
                value={form.category_id}
                onChange={(e) => handleCategoryChange(e.target.value)}
                disabled={catsLoading}
                className="w-full px-3 py-2.5 bg-[#f7f6f2] border border-[#f0f0ee] rounded-xl text-sm text-[#0a1a14] focus:outline-none focus:border-[#1D9E75] focus:ring-2 focus:ring-[#1D9E75]/10 transition-all appearance-none disabled:opacity-50"
              >
                <option value="">None</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
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

          {/* Error */}
          {error && (
            <p className="text-xs text-[#E24B4A] bg-[#FCEBEB] px-3 py-2 rounded-xl">
              {error}
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
            disabled={saving || !form.name || !form.amount}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-[#1D9E75] hover:bg-[#0F6E56] disabled:opacity-50 text-white text-sm font-medium rounded-xl transition-all duration-150 active:scale-[0.98]"
          >
            {saving ? (
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
              </svg>
            ) : (
              <Check size={14} />
            )}
            {saving ? "Saving…" : "Save transaction"}
          </button>
        </div>
      </div>
    </div>
  );
}