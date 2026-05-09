"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function updateProfile(data: {
  full_name: string;
  email: string;
}) {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    throw new Error("Unauthorized");
  }

  // update email if changed
  if (data.email !== user.email) {
    const { error } = await supabase.auth.updateUser({
      email: data.email,
    });

    if (error) throw error;
  }

  // update profile table
  const { error } = await supabase
    .from("profiles")
    .update({
      full_name: data.full_name,
    })
    .eq("id", user.id);

  if (error) throw error;

  revalidatePath("/settings");
}

export async function updatePreferences(data: {
  currency: string;
  budget_alerts: boolean;
  weekly_summary: boolean;
  large_txn: boolean;
}) {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    throw new Error("Unauthorized");
  }

  const { error } = await supabase
    .from("profiles")
    .update({
      currency: data.currency,
      budget_alerts: data.budget_alerts,
      weekly_summary: data.weekly_summary,
      large_txn: data.large_txn,
    })
    .eq("id", user.id);

  if (error) throw error;

  revalidatePath("/settings");
}

export async function signOut() {
  const supabase = await createClient();

  const { error } = await supabase.auth.signOut();

  if (error) throw error;
}