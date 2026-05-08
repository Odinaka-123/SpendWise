"use client";

import { Check, RefreshCw } from "lucide-react";
import { useState } from "react";
import clsx from "clsx";

const categories = [
  "Groceries",
  "Dining",
  "Transport",
  "Housing",
  "Entertainment",
  "Utility",
  "Other",
];

export interface OcrResult {
  name: string;
  amount: string;
  date: string;
  category: string;
}

interface OcrReviewFormProps {
  result: OcrResult;
  onSave: (data: OcrResult) => void;
  onRetry: () => void;
}

export default function OcrReviewForm({
  result,
  onSave,
  onRetry,
}: OcrReviewFormProps) {
  const [form, setForm] = useState<OcrResult>(result);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const update = (k: keyof OcrResult, v: string) =>
    setForm((p) => ({ ...p, [k]: v }));

  const handleSave = async () => {
    setSaving(true);
    await new Promise((r) => setTimeout(r, 600));
    onSave(form);
    setSaving(false);
    setSaved(true);
  };

  if (saved) {
    return (
      <div className="bg-white border border-[#f0f0ee] rounded-2xl p-8 text-center">
        <div className="w-12 h-12 bg-[#E1F5EE] rounded-2xl flex items-center justify-center mx-auto mb-3">
          <Check size={22} className="text-[#1D9E75]" />
        </div>
        <p className="text-sm font-semibold text-[#0a1a14]">
          Transaction saved!
        </p>
        <p className="text-xs text-[#9ca3af] mt-1">
          It now appears in your transactions list.
        </p>
        <button
          onClick={onRetry}
          className="mt-4 flex items-center gap-1.5 mx-auto px-4 py-2 border border-[#e5e7eb] rounded-xl text-xs text-[#6b7280] hover:bg-[#f7f6f2] transition-all"
        >
          <RefreshCw size={12} />
          Scan another
        </button>
      </div>
    );
  }

  const inputCls =
    "w-full px-3 py-2.5 bg-[#f7f6f2] border border-[#f0f0ee] rounded-xl text-sm text-[#0a1a14] placeholder:text-[#9ca3af] focus:outline-none focus:border-[#1D9E75] focus:ring-2 focus:ring-[#1D9E75]/10 transition-all";

  return (
    <div className="bg-white border border-[#f0f0ee] rounded-2xl p-5 space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-[#0a1a14]">
          Review extracted data
        </p>
        <span className="px-2 py-0.5 bg-[#E1F5EE] text-[#0F6E56] text-xs rounded-full font-medium">
          OCR complete
        </span>
      </div>
      <p className="text-xs text-[#9ca3af]">
        Check the details below and correct any errors before saving.
      </p>

      {/* Fields */}
      <div className="space-y-3">
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-[#0a1a14]">
            Merchant / Description
          </label>
          <input
            type="text"
            value={form.name}
            onChange={(e) => update("name", e.target.value)}
            className={inputCls}
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-[#0a1a14]">
              Amount (₦)
            </label>
            <input
              type="number"
              value={form.amount}
              onChange={(e) => update("amount", e.target.value)}
              className={inputCls}
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-[#0a1a14]">Date</label>
            <input
              type="date"
              value={form.date}
              onChange={(e) => update("date", e.target.value)}
              className={inputCls}
            />
          </div>
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-[#0a1a14]">Category</label>
          <select
            value={form.category}
            onChange={(e) => update("category", e.target.value)}
            className={clsx(inputCls, "appearance-none")}
          >
            {categories.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-2 pt-1">
        <button
          onClick={onRetry}
          className="flex items-center gap-1.5 px-3 py-2.5 border border-[#e5e7eb] rounded-xl text-sm text-[#6b7280] hover:bg-[#f7f6f2] transition-all"
        >
          <RefreshCw size={13} />
          Retry
        </button>
        <button
          onClick={handleSave}
          disabled={saving || !form.name || !form.amount}
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
          {saving ? "Saving…" : "Save transaction"}
        </button>
      </div>
    </div>
  );
}
