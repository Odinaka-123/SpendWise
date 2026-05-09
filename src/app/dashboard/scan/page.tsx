"use client";

import { useState } from "react";
import ReceiptDropzone from "../components/scan/ReceiptDropzone";
import OcrReviewForm, { type OcrResult } from "../components/scan/OcrReviewForm";
import { createExpense } from "@/lib/actions/expenses";
import { useCategories } from "@/hooks/useCategories";

type Stage = "idle" | "processing" | "review" | "done";

// ── Pull numbers from raw OCR text ────────────────────────────────────────────
function parseOcrText(text: string): OcrResult {
  const lines = text.split("\n").map((l) => l.trim()).filter(Boolean);

  // Amount — find largest number that looks like a price
  const amounts: number[] = [];
  const amountRe = /(?:₦|NGN|N)?\s*([\d,]+(?:\.\d{1,2})?)/g;
  let m: RegExpExecArray | null;
  while ((m = amountRe.exec(text)) !== null) {
    const n = parseFloat(m[1].replace(/,/g, ""));
    if (!isNaN(n) && n > 0) amounts.push(n);
  }
  const amount = amounts.length
    ? String(Math.max(...amounts))
    : "";

  // Date — try common formats
  const dateRe =
    /(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4})|(\d{4}[\/\-]\d{2}[\/\-]\d{2})/;
  const dateMatch = text.match(dateRe);
  let date = new Date().toISOString().split("T")[0];
  if (dateMatch) {
    const raw = dateMatch[0].replace(/\//g, "-");
    const parts = raw.split("-");
    if (parts[0].length === 4) {
      date = raw; // already YYYY-MM-DD
    } else {
      // DD-MM-YYYY → YYYY-MM-DD
      date = `${parts[2]}-${parts[1].padStart(2, "0")}-${parts[0].padStart(2, "0")}`;
    }
  }

  // Merchant — first meaningful line (skip short/numeric-only lines)
  const name =
    lines.find(
      (l) => l.length > 3 && !/^[\d\s\W]+$/.test(l) && !/^(date|total|amount|receipt)/i.test(l)
    ) ?? "Unknown merchant";

  // Category — keyword guess
  const lower = text.toLowerCase();
  let category = "Other";
  if (/restaurant|food|eat|meal|kitchen|pizza|burger|chicken|dining/i.test(lower)) category = "Dining";
  else if (/supermarket|grocery|market|shoprite|spar|konga/i.test(lower)) category = "Groceries";
  else if (/uber|bolt|taxi|transport|fuel|petrol|bus|ride/i.test(lower)) category = "Transport";
  else if (/electricity|water|dstv|cable|internet|utility|nepa|ekedc/i.test(lower)) category = "Utility";
  else if (/netflix|cinema|movie|entertainment|sport/i.test(lower)) category = "Entertainment";
  else if (/hospital|pharmacy|clinic|health|medical/i.test(lower)) category = "Health";

  return { name, amount, date, category };
}

export default function ScanPage() {
  const [preview, setPreview]   = useState<string | null>(null);
  const [stage, setStage]       = useState<Stage>("idle");
  const [ocrResult, setOcrResult] = useState<OcrResult | null>(null);
  const [error, setError]       = useState<string | null>(null);

  const { categories } = useCategories();

  const handleFile = async (f: File) => {
    setPreview(URL.createObjectURL(f));
    setStage("processing");
    setError(null);

    try {
      // Dynamically import Tesseract so it doesn't bloat the initial bundle
      const Tesseract = await import("tesseract.js");
      const { data: { text } } = await Tesseract.default.recognize(f, "eng", {
        logger: () => {}, // silence progress logs
      });

      const result = parseOcrText(text);

      // If we have DB categories, try to match the guessed one
      if (categories.length > 0) {
        const matched = categories.find(
          (c) => c.name.toLowerCase() === result.category.toLowerCase()
        );
        if (!matched) {
          // Fall back to first category
          result.category = categories[0].name;
        }
      }

      setOcrResult(result);
      setStage("review");
    } catch (e) {
      console.error("OCR failed", e);
      setError(
        "OCR failed — the image may be too blurry or low contrast. Try a clearer photo."
      );
      setStage("idle");
    }
  };

  const handleClear = () => {
    setPreview(null);
    setStage("idle");
    setOcrResult(null);
    setError(null);
  };

  const handleSave = async (data: OcrResult) => {
    // Find category_id from name
    const cat = categories.find((c) => c.name === data.category);

    await createExpense({
      name:        data.name,
      amount:      Number(data.amount),
      type:        "debit",
      date:        data.date,
      category_id: cat?.id ?? null,
      notes:       "Added via receipt scan",
    });

    setStage("done");
  };

  return (
    <div className="max-w-xl mx-auto space-y-5 animate-fade-in">
      {/* Header */}
      <div>
        <h2 className="text-[#0a1a14] text-lg font-semibold">Scan Receipt</h2>
        <p className="text-[#9ca3af] text-xs mt-0.5">
          Upload a receipt image and we&apos;ll extract the details automatically
        </p>
      </div>

      {/* Error */}
      {error && (
        <div className="px-4 py-3 bg-[#FCEBEB] border border-red-200 rounded-xl">
          <p className="text-xs text-[#E24B4A]">{error}</p>
        </div>
      )}

      {/* Dropzone — always visible unless reviewing */}
      {stage !== "review" && stage !== "done" && (
        <ReceiptDropzone
          onFile={handleFile}
          preview={preview}
          onClear={handleClear}
        />
      )}

      {/* Processing spinner */}
      {stage === "processing" && (
        <div className="bg-white border border-[#f0f0ee] rounded-2xl p-8 flex flex-col items-center gap-3">
          <svg className="animate-spin h-8 w-8 text-[#1D9E75]" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
          </svg>
          <p className="text-sm text-[#0a1a14] font-medium">Reading receipt…</p>
          <p className="text-xs text-[#9ca3af]">This may take a few seconds</p>
        </div>
      )}

      {/* Review form */}
      {stage === "review" && ocrResult && (
        <OcrReviewForm
          result={ocrResult}
          onSave={handleSave}
          onRetry={handleClear}
        />
      )}

      {/* Tips */}
      {stage === "idle" && (
        <div className="bg-white border border-[#f0f0ee] rounded-2xl p-5">
          <p className="text-xs font-semibold text-[#0a1a14] mb-3">Tips for best results</p>
          <ul className="space-y-2">
            {[
              "Lay the receipt flat with good lighting",
              "Make sure the total amount is clearly visible",
              "Avoid shadows and glare on the image",
              "Use a high-resolution photo (at least 1MP)",
            ].map((tip) => (
              <li key={tip} className="flex items-start gap-2 text-xs text-[#6b7280]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#1D9E75] mt-1.5 shrink-0" />
                {tip}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}