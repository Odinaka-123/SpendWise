"use client";

import { useState } from "react";
import { Download, CheckCircle2, AlertCircle } from "lucide-react";
import clsx from "clsx";
import type { ExportFormat } from "./ReportFormatPicker";

type ExportState = "idle" | "generating" | "done" | "error";

interface ExportButtonProps {
  format: ExportFormat;
  disabled?: boolean;
  onExport: () => Promise<void>;
}

const MESSAGES: Record<ExportState, string> = {
  idle: "",
  generating: "Generating your report…",
  done: "Report ready — download started",
  error: "Something went wrong. Please try again.",
};

export default function ExportButton({
  format,
  disabled,
  onExport,
}: ExportButtonProps) {
  const [state, setState] = useState<ExportState>("idle");

  const handleClick = async () => {
    if (state === "generating" || disabled) return;
    setState("generating");
    try {
      await onExport();
      setState("done");
      setTimeout(() => setState("idle"), 4000);
    } catch {
      setState("error");
      setTimeout(() => setState("idle"), 4000);
    }
  };

  const isGenerating = state === "generating";
  const isDone = state === "done";
  const isError = state === "error";

  return (
    <div className="space-y-2">
      <button
        onClick={handleClick}
        disabled={disabled || isGenerating}
        className={clsx(
          "w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold transition-all duration-200 active:scale-[0.98]",
          isDone ? "bg-[#E1F5EE] text-[#0F6E56] border border-[#1D9E75]/30"
          : isError ? "bg-red-50 text-red-500 border border-red-200"
          : disabled ? "bg-[#f0f0ee] text-[#9ca3af] cursor-not-allowed"
          : isGenerating ? "bg-[#1D9E75]/80 text-white cursor-wait"
          : "bg-[#1D9E75] hover:bg-[#0F6E56] text-white shadow-sm shadow-[#1D9E75]/20",
        )}
      >
        {isGenerating ?
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
        : isDone ?
          <CheckCircle2 size={16} />
        : isError ?
          <AlertCircle size={16} />
        : <Download size={16} />}

        {isGenerating ?
          "Generating…"
        : isDone ?
          "Downloaded!"
        : isError ?
          "Try again"
        : `Download ${format.toUpperCase()}`}
      </button>

      {/* Status message */}
      {state !== "idle" && (
        <p
          className={clsx(
            "text-xs text-center transition-all",
            isDone ? "text-[#0F6E56]"
            : isError ? "text-red-400"
            : "text-[#9ca3af]",
          )}
        >
          {MESSAGES[state]}
        </p>
      )}
    </div>
  );
}
