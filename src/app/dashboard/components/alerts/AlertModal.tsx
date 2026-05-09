"use client";

import { useState } from "react";
import { X } from "lucide-react";
import type { BudgetAlert } from "../../alerts/types";
import { CATEGORIES } from "../../alerts/types";

interface AlertModalProps {
  existing?: BudgetAlert;
  usedCategories: string[];
  onSave: (data: Omit<BudgetAlert, "id">) => void;
  onClose: () => void;
}

export default function AlertModal({
  existing,
  usedCategories,
  onSave,
  onClose,
}: AlertModalProps) {
  const [category, setCategory] = useState(existing?.category ?? "");
  const [limit, setLimit] = useState(existing?.limit?.toString() ?? "");
  const [alertAt, setAlertAt] = useState(existing?.alertAt ?? 80);
  const [enabled, setEnabled] = useState(existing?.enabled ?? true);

  const available =
    existing ?
      [...CATEGORIES]
    : [...CATEGORIES].filter((c) => !usedCategories.includes(c));

  const valid =
    category !== "" && Number(limit) > 0 && alertAt >= 1 && alertAt <= 99;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-4">
      <div className="w-full max-w-sm bg-white rounded-2xl border border-[#f0f0ee] shadow-xl p-6 space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold text-[#0a1a14]">
            {existing ? "Edit alert" : "New budget alert"}
          </p>
          <button
            onClick={onClose}
            className="w-7 h-7 flex items-center justify-center rounded-lg text-[#9ca3af] hover:bg-[#f7f6f2] transition-colors"
          >
            <X size={14} />
          </button>
        </div>

        {/* Category */}
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-[#9ca3af]">Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            disabled={!!existing}
            className="w-full px-3 py-2 text-sm border border-[#e5e7eb] rounded-xl bg-white text-[#0a1a14] disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-[#1D9E75]/20 focus:border-[#1D9E75]"
          >
            <option value="">Select category…</option>
            {available.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        {/* Limit */}
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-[#9ca3af]">
            Monthly limit (₦)
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-[#9ca3af]">
              ₦
            </span>
            <input
              type="number"
              min={1}
              value={limit}
              onChange={(e) => setLimit(e.target.value)}
              placeholder="e.g. 20000"
              className="w-full pl-7 pr-3 py-2 text-sm border border-[#e5e7eb] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1D9E75]/20 focus:border-[#1D9E75] text-[#0a1a14]"
            />
          </div>
        </div>

        {/* Alert threshold */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-medium text-[#9ca3af]">
              Alert when I reach
            </label>
            <span className="text-xs font-semibold text-[#1D9E75]">
              {alertAt}%
            </span>
          </div>
          <input
            type="range"
            min={10}
            max={99}
            step={5}
            value={alertAt}
            onChange={(e) => setAlertAt(Number(e.target.value))}
            className="w-full accent-[#1D9E75]"
          />
          <div className="flex justify-between text-[10px] text-[#d1d5db]">
            <span>10%</span>
            <span>50%</span>
            <span>99%</span>
          </div>
        </div>

        {/* Enable toggle */}
        <div className="flex items-center justify-between py-1">
          <span className="text-xs font-medium text-[#9ca3af]">
            Enable alert
          </span>
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
                category,
                category_id: existing?.category_id ?? "", // page fills this in via handleSave
                limit: Number(limit),
                alertAt,
                enabled,
                spend: existing?.spend ?? 0,
              });
            }}
            disabled={!valid}
            className="flex-1 py-2 text-xs font-semibold rounded-xl bg-[#1D9E75] text-white hover:bg-[#0F6E56] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            {existing ? "Save changes" : "Create alert"}
          </button>
        </div>
      </div>
    </div>
  );
}
