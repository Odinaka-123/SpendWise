"use client";

import { useState } from "react";
import { X, Check, ArrowDownLeft, ArrowUpRight } from "lucide-react";
import clsx from "clsx";
import { useCategories } from "@/hooks/useCategories";
import { useExpenses } from "@/hooks/useExpenses";
import type { TxType } from "@/lib/database.types";

interface AddExpenseModalProps {
  open: boolean;
  onClose: () => void;
}

export default function AddExpenseModal({ open, onClose }: AddExpenseModalProps) {
  if (!open) return null;
  return <AddExpenseModalContent onClose={onClose} />;
}

function AddExpenseModalContent({ onClose }: { onClose: () => void }) {
  const { categories, loading: catsLoading } = useCategories();
  const { create } = useExpenses();

  const today = new Date().toISOString().split("T")[0];

  const [type, setType] = useState<TxType>("debit");
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [date, setDate] = useState(today);
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const valid =
    name.trim() !== "" && Number(amount) > 0 && date !== "";

  const handleSave = async () => {
    if (!valid) return;
    setSaving(true);
    setError(null);
    try {
      await create({
        name: name.trim(),
        amount: Number(amount),
        type,
        date,
        category_id: categoryId || null,
        notes: notes.trim() || null,
      });
      onClose();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to save expense");
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-[#0a1a14]/40 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-sm animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#f0f0ee]">
          <h2 className="text-[#0a1a14] text-base font-semibold">
            Add transaction
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
          <div className="flex gap-2">
            {(["debit", "credit"] as TxType[]).map((t) => (
              <button
                key={t}
                onClick={() => setType(t)}
                className={clsx(
                  "flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-semibold transition-all",
                  type === t
                    ? t === "debit"
                      ? "bg-[#FCEBEB] text-[#E24B4A] ring-2 ring-[#E24B4A]/20"
                      : "bg-[#E1F5EE] text-[#0F6E56] ring-2 ring-[#1D9E75]/20"
                    : "bg-[#f7f6f2] text-[#9ca3af] hover:bg-[#e5e7eb]",
                )}
              >
                {t === "debit" ? (
                  <ArrowUpRight size={13} />
                ) : (
                  <ArrowDownLeft size={13} />
                )}
                {t === "debit" ? "Expense" : "Income"}
              </button>
            ))}
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-[#0a1a14]">
              Description
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Shoprite, Salary, Netflix…"
              className="w-full px-3 py-2.5 bg-[#f7f6f2] border border-[#f0f0ee] rounded-xl text-sm text-[#0a1a14] placeholder:text-[#9ca3af] focus:outline-none focus:border-[#1D9E75] focus:ring-2 focus:ring-[#1D9E75]/10 transition-all"
            />
          </div>

          {/* Amount */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-[#0a1a14]">
              Amount (₦)
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-[#9ca3af]">
                ₦
              </span>
              <input
                type="number"
                min={1}
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                className="w-full pl-7 pr-3 py-2.5 bg-[#f7f6f2] border border-[#f0f0ee] rounded-xl text-sm text-[#0a1a14] placeholder:text-[#9ca3af] focus:outline-none focus:border-[#1D9E75] focus:ring-2 focus:ring-[#1D9E75]/10 transition-all"
              />
            </div>
          </div>

          {/* Category + Date — 2 col */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-[#0a1a14]">
                Category
              </label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
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

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-[#0a1a14]">Date</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2.5 bg-[#f7f6f2] border border-[#f0f0ee] rounded-xl text-sm text-[#0a1a14] focus:outline-none focus:border-[#1D9E75] focus:ring-2 focus:ring-[#1D9E75]/10 transition-all"
              />
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-[#0a1a14]">
              Notes{" "}
              <span className="text-[#9ca3af] font-normal">(optional)</span>
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Any extra detail…"
              rows={2}
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
            disabled={saving || !valid}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-[#1D9E75] hover:bg-[#0F6E56] disabled:opacity-50 text-white text-sm font-medium rounded-xl transition-all active:scale-[0.98]"
          >
            {saving ? (
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
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
            ) : (
              <Check size={14} />
            )}
            {saving ? "Saving…" : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}