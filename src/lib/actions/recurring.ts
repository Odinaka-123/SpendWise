"use server";

import { revalidatePath } from "next/cache";
import { createServerSupabaseClient } from "@/lib/supabase-server";
import type { TxType, Frequency } from "@/lib/database.types";

export interface CreateRecurringInput {
  name: string;
  amount: number;
  type: TxType;
  frequency: Frequency;
  next_date: string;       // 'YYYY-MM-DD'
  category_id?: string | null;
}

export async function getRecurring() {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { data, error } = await supabase
    .from("recurring")
    .select(`*, category:categories (id, name, color, icon)`)
    .eq("user_id", user.id)
    .order("next_date", { ascending: true });

  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function createRecurring(input: CreateRecurringInput) {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { data, error } = await supabase
    .from("recurring")
    .insert({ ...input, user_id: user.id })
    .select(`*, category:categories (id, name, color, icon)`)
    .single();

  if (error) throw new Error(error.message);
  revalidatePath("/dashboard/recurring");
  return data;
}

export async function updateRecurring(
  id: string,
  input: Partial<CreateRecurringInput> & { is_active?: boolean },
) {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { data, error } = await supabase
    .from("recurring")
    .update(input)
    .eq("id", id)
    .eq("user_id", user.id)
    .select(`*, category:categories (id, name, color, icon)`)
    .single();

  if (error) throw new Error(error.message);
  revalidatePath("/dashboard/recurring");
  return data;
}

export async function deleteRecurring(id: string) {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { error } = await supabase
    .from("recurring")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) throw new Error(error.message);
  revalidatePath("/dashboard/recurring");
}

/**
 * Toggle is_active without needing to pass the full object.
 */
export async function toggleRecurring(id: string, is_active: boolean) {
  return updateRecurring(id, { is_active });
}