"use client";

import { useState } from "react";
import { X } from "lucide-react";
import clsx from "clsx";
import type { RecurringTx, Frequency, TxType } from "../../recurring/types";
import { CATEGORIES } from "../../recurring/types";

interface RecurringModalProps {
  existing?: RecurringTx;
  onSave: (data: Omit<RecurringTx, "id">) => void;
  onClose: () => void;
}

export default function RecurringModal({
  existing,
  onSave,
  onClose,
}: RecurringModalProps) {
  const today = new Date().toISOString().split("T")[0];

  const [name, setName] = useState(existing?.name ?? "");
  const [category, setCategory] = useState(existing?.category ?? "");
  const [amount, setAmount] = useState(existing?.amount?.toString() ?? "");
  const [type, setType] = useState<TxType>(existing?.type ?? "debit");
  const [frequency, setFrequency] = useState<Frequency>(
    existing?.frequency ?? "monthly",
  );
  const [nextDate, setNextDate] = useState(existing?.nextDate ?? today);
  const [enabled, setEnabled] = useState(existing?.enabled ?? true);

  const valid =
    name.trim() !== "" &&
    category !== "" &&
    Number(amount) > 0 &&
    nextDate !== "";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-4">
      <div className="w-full max-w-sm bg-white rounded-2xl border border-[#f0f0ee] shadow-xl p-6 space-y-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold text-[#0a1a14]">
            {existing ? "Edit recurring" : "New recurring transaction"}
          </p>
          <button
            onClick={onClose}
            className="w-7 h-7 flex items-center justify-center rounded-lg text-[#9ca3af] hover:bg-[#f7f6f2] transition-colors"
          >
            <X size={14} />
          </button>
        </div>

        {/* Description */}
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-[#9ca3af]">
            Description
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Netflix, Rent, Salary…"
            className="w-full px-3 py-2 text-sm border border-[#e5e7eb] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1D9E75]/20 focus:border-[#1D9E75] text-[#0a1a14]"
          />
        </div>

        {/* Category */}
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-[#9ca3af]">Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full px-3 py-2 text-sm border border-[#e5e7eb] rounded-xl bg-white text-[#0a1a14] focus:outline-none focus:ring-2 focus:ring-[#1D9E75]/20 focus:border-[#1D9E75]"
          >
            <option value="">Select category…</option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        {/* Amount + type */}
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-[#9ca3af]">
            Amount (₦)
          </label>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-[#9ca3af]">
                ₦
              </span>
              <input
                type="number"
                min={1}
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0"
                className="w-full pl-7 pr-3 py-2 text-sm border border-[#e5e7eb] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1D9E75]/20 focus:border-[#1D9E75] text-[#0a1a14]"
              />
            </div>
            <div className="flex gap-1">
              {(["debit", "credit"] as TxType[]).map((t) => (
                <button
                  key={t}
                  onClick={() => setType(t)}
                  className={clsx(
                    "px-3 py-2 rounded-xl text-xs font-medium transition-colors",
                    type === t ?
                      t === "debit" ?
                        "bg-[#FCEBEB] text-[#E24B4A]"
                      : "bg-[#E1F5EE] text-[#0F6E56]"
                    : "bg-[#f7f6f2] text-[#9ca3af] hover:bg-[#e5e7eb]",
                  )}
                >
                  {t === "debit" ? "Expense" : "Income"}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Frequency */}
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-[#9ca3af]">
            Frequency
          </label>
          <div className="flex gap-2">
            {(["weekly", "monthly"] as Frequency[]).map((f) => (
              <button
                key={f}
                onClick={() => setFrequency(f)}
                className={clsx(
                  "flex-1 py-2 rounded-xl text-xs font-medium transition-colors",
                  frequency === f ?
                    "bg-[#0a1a14] text-white"
                  : "bg-[#f7f6f2] text-[#6b7280] hover:bg-[#e5e7eb]",
                )}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Next date */}
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-[#9ca3af]">
            First / next occurrence
          </label>
          <input
            type="date"
            value={nextDate}
            min={today}
            onChange={(e) => setNextDate(e.target.value)}
            className="w-full px-3 py-2 text-sm border border-[#e5e7eb] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1D9E75]/20 focus:border-[#1D9E75] text-[#0a1a14]"
          />
        </div>

        {/* Active toggle */}
        <div className="flex items-center justify-between py-1">
          <span className="text-xs font-medium text-[#9ca3af]">Active</span>
          <button
            onClick={() => setEnabled((p) => !p)}
            className={`w-10 h-5 rounded-full transition-colors duration-200 relative shrink-0 ${
              enabled ? "bg-[#1D9E75]" : "bg-[#e5e7eb]"
            }`}
          >
            <span
              className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200 ${
                enabled ? "translate-x-4.5" : "translate-x-0"
              }`}
            />
          </button>
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-1">
          <button
            onClick={onClose}
            className="flex-1 py-2 text-xs font-medium border border-[#e5e7eb] rounded-xl text-[#6b7280] hover:bg-[#f7f6f2] transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              if (!valid) return;
              onSave({
                name: name.trim(),
                category,
                amount: Number(amount),
                type,
                frequency,
                nextDate,
                enabled,
              });
            }}
            disabled={!valid}
            className="flex-1 py-2 text-xs font-semibold rounded-xl bg-[#1D9E75] text-white hover:bg-[#0F6E56] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            {existing ? "Save changes" : "Schedule"}
          </button>
        </div>
      </div>
    </div>
  );
}
