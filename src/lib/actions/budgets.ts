"use server";

import { revalidatePath } from "next/cache";
import { createServerSupabaseClient } from "@/lib/supabase-server";

/**
 * Returns budget_vs_actual view rows for the given month.
 * Falls back to current month if not provided.
 */
export async function getBudgetVsActual(month?: string) {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const targetMonth =
    month ?? new Date().toISOString().slice(0, 7); // 'YYYY-MM'

  const { data, error } = await supabase
    .from("budget_vs_actual")
    .select("*")
    .eq("user_id", user.id)
    .eq("month", targetMonth)
    .order("percentage_used", { ascending: false });

  if (error) throw new Error(error.message);
  return data ?? [];
}

/**
 * Upsert a budget limit for a category+month.
 * Creates if not exists, updates if already set.
 */
export async function upsertBudget(input: {
  category_id: string;
  month: string;  // 'YYYY-MM'
  amount: number;
}) {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { data, error } = await supabase
    .from("budgets")
    .upsert(
      {
        user_id: user.id,
        category_id: input.category_id,
        month: input.month,
        amount: input.amount,
      },
      { onConflict: "user_id,category_id,month" },
    )
    .select()
    .single();

  if (error) throw new Error(error.message);
  revalidatePath("/dashboard/alerts");
  return data;
}

export async function deleteBudget(id: string) {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { error } = await supabase
    .from("budgets")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) throw new Error(error.message);
  revalidatePath("/dashboard/alerts");
}