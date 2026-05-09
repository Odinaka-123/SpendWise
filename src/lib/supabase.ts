// lib/supabase.ts
// Browser singleton — safe to import in Client Components and Server Components.
// For Server Actions / Route Handlers use createServerClient() from @supabase/ssr.

import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}

/** Pre-built singleton for use in client components */
export const supabase = createClient();