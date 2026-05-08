import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import Sidebar from "@/components/layout/Sidebar";
import Topbar from "@/components/layout/Topbar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Should be caught by middleware but double-check here
  if (!user) {
    redirect("/auth/login");
  }

  // Google OAuth puts name in user_metadata.full_name or user_metadata.name
  const fullName =
    user.user_metadata?.full_name ??
    user.user_metadata?.name ??
    user.email?.split("@")[0] ??
    "User";

  const email = user.email ?? "";

  // Build initials — max 2 letters
  const initials = fullName
    .split(" ")
    .map((n: string) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div className="flex h-screen bg-[#f7f6f2] overflow-hidden">
      <Sidebar user={{ name: fullName, email, initials }} />

      <div className="flex flex-col flex-1 overflow-hidden">
        <Topbar title="Dashboard" subtitle="May 2026 · Week 2 of 4" />
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
}
