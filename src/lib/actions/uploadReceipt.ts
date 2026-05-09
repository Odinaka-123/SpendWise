"use server";

import { createClient } from "@/lib/supabase/server";

export async function uploadReceipt(file: File) {
  const supabase = await createClient();

  const filePath = `receipts/${Date.now()}-${file.name}`;

  const { error } = await supabase.storage
    .from("receipts")
    .upload(filePath, file);

  if (error) {
    throw new Error(error.message);
  }

  const { data } = supabase.storage
    .from("receipts")
    .getPublicUrl(filePath);

  return data.publicUrl;
}