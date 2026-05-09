// ─── Database types matching the SpendWise Supabase schema ───────────────────
// Re-run `supabase gen types typescript` to regenerate from live DB.

export type TxType = "debit" | "credit";
export type Frequency = "daily" | "weekly" | "monthly" | "yearly";

// ── Tables ────────────────────────────────────────────────────────────────────

export interface Profile {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  currency: string;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: string;
  user_id: string;
  name: string;
  color: string;
  icon: string;
  is_default: boolean;
  created_at: string;
}

export interface Expense {
  id: string;
  user_id: string;
  category_id: string | null;
  name: string;
  amount: number;
  type: TxType;
  date: string; // ISO date string YYYY-MM-DD
  notes: string | null;
  receipt_url: string | null;
  is_recurring: boolean;
  created_at: string;
  updated_at: string;
}

export interface Budget {
  id: string;
  user_id: string;
  category_id: string;
  month: string; // 'YYYY-MM'
  amount: number;
  created_at: string;
  updated_at: string;
}

export interface Recurring {
  id: string;
  user_id: string;
  category_id: string | null;
  name: string;
  amount: number;
  type: TxType;
  frequency: Frequency;
  next_date: string; // ISO date
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// ── View shapes ───────────────────────────────────────────────────────────────

export interface MonthlySpending {
  user_id: string;
  category_id: string | null;
  category_name: string | null;
  category_color: string | null;
  month: string;
  total_spent: number;
  total_income: number;
  transaction_count: number;
}

export interface BudgetVsActual {
  user_id: string;
  category_id: string;
  category_name: string | null;
  category_color: string | null;
  month: string;
  budget_amount: number;
  actual_spent: number;
  remaining: number;
  percentage_used: number | null;
}

// ── Joined / enriched shapes used in the UI ───────────────────────────────────

export interface ExpenseWithCategory extends Expense {
  category: Pick<Category, "id" | "name" | "color" | "icon"> | null;
}

export interface RecurringWithCategory extends Recurring {
  category: Pick<Category, "id" | "name" | "color" | "icon"> | null;
}