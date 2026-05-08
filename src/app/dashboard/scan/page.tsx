"use client";

import { useState } from "react";
import { ScanLine } from "lucide-react";
import ReceiptDropzone from "../components/scan/ReceiptDropzone";
import OcrReviewForm, { type OcrResult } from "../components/scan/OcrReviewForm";

type Step = "idle" | "scanning" | "review";

// Simulated OCR result — replace with real Tesseract / Google Vision call
function mockOcr(): Promise<OcrResult> {
  return new Promise((resolve) =>
    setTimeout(
      () =>
        resolve({
          name: "Shoprite Ikeja",
          amount: "4350",
          date: new Date().toISOString().split("T")[0],
          category: "Groceries",
        }),
      2200,
    ),
  );
}

export default function ScanPage() {
  const [step, setStep] = useState<Step>("idle");
  const [preview, setPreview] = useState<string | null>(null);
  const [ocrResult, setOcrResult] = useState<OcrResult | null>(null);

  const handleFile = async (file: File) => {
    const url = URL.createObjectURL(file);
    setPreview(url);
    setStep("scanning");

    const result = await mockOcr();
    setOcrResult(result);
    setStep("review");
  };

  const handleClear = () => {
    setPreview(null);
    setOcrResult(null);
    setStep("idle");
  };

  const handleSave = (data: OcrResult) => {
    // TODO: push to Supabase / global state
    console.log("Saved from scan:", data);
  };

  return (
    <div className="space-y-5 max-w-xl mx-auto animate-fade-in">
      {/* Header */}
      <div>
        <h2 className="text-[#0a1a14] text-lg font-semibold">Scan receipt</h2>
        <p className="text-[#9ca3af] text-xs mt-0.5">
          Upload a photo and we&apos;ll extract the details automatically
        </p>
      </div>

      {/* How it works banner */}
      <div className="bg-white border border-[#f0f0ee] rounded-2xl p-4">
        <p className="text-xs font-semibold text-[#9ca3af] uppercase tracking-widest mb-3">
          How it works
        </p>
        <div className="flex items-start gap-6">
          {[
            {
              step: "1",
              label: "Upload",
              desc: "Take a photo or upload an image of your receipt",
            },
            {
              step: "2",
              label: "Extract",
              desc: "OCR reads the merchant, amount and date",
            },
            {
              step: "3",
              label: "Review",
              desc: "Correct any errors and save to transactions",
            },
          ].map((s) => (
            <div key={s.step} className="flex-1 text-center">
              <div className="w-7 h-7 rounded-full bg-[#E1F5EE] text-[#0F6E56] text-xs font-semibold flex items-center justify-center mx-auto mb-2">
                {s.step}
              </div>
              <p className="text-xs font-medium text-[#0a1a14]">{s.label}</p>
              <p className="text-xs text-[#9ca3af] mt-0.5">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Dropzone */}
      <ReceiptDropzone
        onFile={handleFile}
        preview={preview}
        onClear={handleClear}
      />

      {/* Scanning state */}
      {step === "scanning" && (
        <div className="bg-white border border-[#f0f0ee] rounded-2xl p-8 flex flex-col items-center gap-3">
          <div className="relative w-12 h-12">
            <div className="absolute inset-0 rounded-2xl bg-[#E1F5EE] animate-pulse" />
            <div className="absolute inset-0 flex items-center justify-center">
              <ScanLine size={22} className="text-[#1D9E75] animate-bounce" />
            </div>
          </div>
          <p className="text-sm font-medium text-[#0a1a14]">
            Scanning receipt…
          </p>
          <p className="text-xs text-[#9ca3af]">
            Extracting merchant, amount & date
          </p>
        </div>
      )}

      {/* Review form */}
      {step === "review" && ocrResult && (
        <OcrReviewForm
          result={ocrResult}
          onSave={handleSave}
          onRetry={handleClear}
        />
      )}

      {/* Tips */}
      {step === "idle" && (
        <div className="bg-[#f7f6f2] rounded-2xl px-4 py-3">
          <p className="text-xs text-[#9ca3af]">
            💡 <span className="text-[#6b7280] font-medium">Tip:</span> For best
            results, ensure the receipt is flat, well-lit, and the total amount
            is clearly visible.
          </p>
        </div>
      )}
    </div>
  );
}
