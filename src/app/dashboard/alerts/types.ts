export type AlertId = string;

export interface BudgetAlert {
  id: AlertId;
  category: string;
  limit: number;
  alertAt: number; // percentage 1–99
  enabled: boolean;
}

export const CATEGORY_META: Record<
  string,
  { bg: string; text: string; bar: string }
> = {
  Groceries: {
    bg: "bg-[#E1F5EE]",
    text: "text-[#0F6E56]",
    bar: "bg-[#1D9E75]",
  },
  Dining: {
    bg: "bg-[#FEF3C7]",
    text: "text-[#92400E]",
    bar: "bg-[#F59E0B]",
  },
  Transport: {
    bg: "bg-[#E6F1FB]",
    text: "text-[#185FA5]",
    bar: "bg-[#378ADD]",
  },
  Housing: {
    bg: "bg-[#F1EFE8]",
    text: "text-[#5F5E5A]",
    bar: "bg-[#888780]",
  },
  Entertainment: {
    bg: "bg-[#FBEAF0]",
    text: "text-[#993556]",
    bar: "bg-[#D4537E]",
  },
  Utility: {
    bg: "bg-[#FAECE7]",
    text: "text-[#993C1D]",
    bar: "bg-[#D85A30]",
  },
  Other: {
    bg: "bg-[#EAF3DE]",
    text: "text-[#3B6D11]",
    bar: "bg-[#639922]",
  },
};

export const CATEGORIES = Object.keys(CATEGORY_META);

/** Mock spend this month — replace with real Supabase query */
export const MOCK_SPEND: Record<string, number> = {
  Groceries: 12800,
  Dining: 6000,
  Transport: 2800,
  Housing: 35000,
  Entertainment: 4600,
  Utility: 8500,
  Other: 12000,
};
