"use server";

import { revalidatePath } from "next/cache";
import { createServerSupabaseClient } from "@/lib/supabase-server";
import type { TxType } from "@/lib/database.types";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ExpenseFilters {
  month?: string;          // 'YYYY-MM'  — filters by date range for that month
  category_id?: string;
  type?: TxType | "all";
  search?: string;
  limit?: number;
  offset?: number;
}

export interface CreateExpenseInput {
  name: string;
  amount: number;
  type: TxType;
  date: string;            // 'YYYY-MM-DD'
  category_id?: string | null;
  notes?: string | null;
  receipt_url?: string | null;
  is_recurring?: boolean;
}

export interface UpdateExpenseInput extends Partial<CreateExpenseInput> {
  id: string;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function monthRange(month: string): { from: string; to: string } {
  const [year, mon] = month.split("-").map(Number);
  const from = `${month}-01`;
  const lastDay = new Date(year, mon, 0).getDate();
  const to = `${month}-${String(lastDay).padStart(2, "0")}`;
  return { from, to };
}

// ─── READ ─────────────────────────────────────────────────────────────────────

/**
 * Fetch expenses with optional filters, joined with their category.
 * Returns { data, count } for pagination.
 */
export async function getExpenses(filters: ExpenseFilters = {}) {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const limit = filters.limit ?? 50;
  const offset = filters.offset ?? 0;

  let query = supabase
    .from("expenses")
    .select(
      `
      *,
      category:categories (id, name, color, icon)
    `,
      { count: "exact" },
    )
    .eq("user_id", user.id)
    .order("date", { ascending: false })
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);

  if (filters.month) {
    const { from, to } = monthRange(filters.month);
    query = query.gte("date", from).lte("date", to);
  }

  if (filters.category_id) {
    query = query.eq("category_id", filters.category_id);
  }

  if (filters.type && filters.type !== "all") {
    query = query.eq("type", filters.type);
  }

  if (filters.search) {
    query = query.ilike("name", `%${filters.search}%`);
  }

  const { data, error, count } = await query;
  if (error) throw new Error(error.message);

  return { data: data ?? [], count: count ?? 0 };
}

/**
 * Fetch a single expense by id.
 */
export async function getExpenseById(id: string) {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { data, error } = await supabase
    .from("expenses")
    .select(`*, category:categories (id, name, color, icon)`)
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (error) throw new Error(error.message);
  return data;
}

// ─── CREATE ───────────────────────────────────────────────────────────────────

export async function createExpense(input: CreateExpenseInput) {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { data, error } = await supabase
    .from("expenses")
    .insert({
      user_id: user.id,
      name: input.name,
      amount: input.amount,
      type: input.type,
      date: input.date,
      category_id: input.category_id ?? null,
      notes: input.notes ?? null,
      receipt_url: input.receipt_url ?? null,
      is_recurring: input.is_recurring ?? false,
    })
    .select(`*, category:categories (id, name, color, icon)`)
    .single();

  if (error) throw new Error(error.message);

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/transactions");

  return data;
}

// ─── UPDATE ───────────────────────────────────────────────────────────────────

export async function updateExpense({ id, ...input }: UpdateExpenseInput) {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { data, error } = await supabase
    .from("expenses")
    .update(input)
    .eq("id", id)
    .eq("user_id", user.id)
    .select(`*, category:categories (id, name, color, icon)`)
    .single();

  if (error) throw new Error(error.message);

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/transactions");

  return data;
}

// ─── DELETE ───────────────────────────────────────────────────────────────────

export async function deleteExpense(id: string) {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { error } = await supabase
    .from("expenses")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) throw new Error(error.message);

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/transactions");
}

// ─── BULK DELETE ──────────────────────────────────────────────────────────────

export async function deleteExpenses(ids: string[]) {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { error } = await supabase
    .from("expenses")
    .delete()
    .in("id", ids)
    .eq("user_id", user.id);

  if (error) throw new Error(error.message);

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/transactions");
}