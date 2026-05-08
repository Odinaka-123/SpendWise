export type Frequency = "weekly" | "monthly";
export type TxType = "debit" | "credit";

export interface RecurringTx {
  id: string;
  name: string;
  category: string;
  amount: number;
  type: TxType;
  frequency: Frequency;
  nextDate: string; // YYYY-MM-DD
  enabled: boolean;
}

export const CAT_META: Record<string, { bg: string; text: string }> = {
  Groceries: { bg: "bg-[#E1F5EE]", text: "text-[#0F6E56]" },
  Dining: { bg: "bg-[#FEF3C7]", text: "text-[#92400E]" },
  Transport: { bg: "bg-[#E6F1FB]", text: "text-[#185FA5]" },
  Housing: { bg: "bg-[#F1EFE8]", text: "text-[#5F5E5A]" },
  Entertainment: { bg: "bg-[#FBEAF0]", text: "text-[#993556]" },
  Utility: { bg: "bg-[#FAECE7]", text: "text-[#993C1D]" },
  Income: { bg: "bg-[#E1F5EE]", text: "text-[#0F6E56]" },
  Other: { bg: "bg-[#EAF3DE]", text: "text-[#3B6D11]" },
};

export const CATEGORIES = Object.keys(CAT_META);

// ─── Date helpers ──────────────────────────────────────────────────────────────
export function daysUntil(dateStr: string): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(dateStr);
  return Math.round((target.getTime() - today.getTime()) / 86400000);
}

export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-NG", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function addDays(dateStr: string, days: number): string {
  const d = new Date(dateStr);
  d.setDate(d.getDate() + days);
  return d.toISOString().split("T")[0];
}

export function addMonths(dateStr: string, months: number): string {
  const d = new Date(dateStr);
  d.setMonth(d.getMonth() + months);
  return d.toISOString().split("T")[0];
}

export function friendlyDays(days: number): string {
  if (days < 0) return `Overdue (${Math.abs(days)}d ago)`;
  if (days === 0) return "Today";
  if (days === 1) return "Tomorrow";
  return `in ${days}d`;
}
