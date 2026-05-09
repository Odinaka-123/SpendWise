export type AlertId = string;

export interface BudgetAlert {
  id: AlertId; // category_id used as stable id
  category: string; // display name
  category_id: string; // DB uuid
  limit: number; // budget_amount from DB
  alertAt: number; // UI-only threshold percentage (default 80)
  enabled: boolean; // UI-only toggle
  spend: number; // actual_spent from budget_vs_actual view
}

// ── Used by AlertModal for the category dropdown ──────────────────────────────
export const CATEGORIES = [
  "Groceries",
  "Dining",
  "Transport",
  "Housing",
  "Entertainment",
  "Utility",
  "Health",
  "Savings",
  "Income",
  "Other",
] as const;

// ── Category colour/style map used by AlertCard ───────────────────────────────
export const CATEGORY_META: Record<
  string,
  { bg: string; text: string; bar: string }
> = {
  Groceries: {
    bg: "bg-[#E1F5EE]",
    text: "text-[#0F6E56]",
    bar: "bg-[#1D9E75]",
  },
  Dining: { bg: "bg-[#FEF3C7]", text: "text-[#92400E]", bar: "bg-[#F59E0B]" },
  Transport: {
    bg: "bg-[#E6F1FB]",
    text: "text-[#185FA5]",
    bar: "bg-[#378ADD]",
  },
  Housing: { bg: "bg-[#F1EFE8]", text: "text-[#5F5E5A]", bar: "bg-[#888780]" },
  Entertainment: {
    bg: "bg-[#FBEAF0]",
    text: "text-[#993556]",
    bar: "bg-[#D4537E]",
  },
  Utility: { bg: "bg-[#FAECE7]", text: "text-[#993C1D]", bar: "bg-[#D85A30]" },
  Health: { bg: "bg-[#FBEAF0]", text: "text-[#993556]", bar: "bg-[#D4537E]" },
  Savings: { bg: "bg-[#E1F5EE]", text: "text-[#0F6E56]", bar: "bg-[#1D9E75]" },
  Income: { bg: "bg-[#E1F5EE]", text: "text-[#0F6E56]", bar: "bg-[#1D9E75]" },
  Other: { bg: "bg-[#EAF3DE]", text: "text-[#3B6D11]", bar: "bg-[#639922]" },
};
