import ProfileSection from "../components/settings/ProfileSection";
import PreferencesSection from "../components/settings/PreferencesSection";
import AccountSection from "../components/settings/AccountSection";

import { createClient } from "@/lib/supabase/server";

export default async function SettingsPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  // Prefer DB name, fallback to Google metadata
  const fullName =
    profile?.full_name ||
    user.user_metadata?.full_name ||
    user.user_metadata?.name ||
    "User";

  const initials =
    fullName
      ?.split(" ")
      ?.map((n: string) => n[0])
      ?.join("")
      ?.slice(0, 2)
      ?.toUpperCase() || "U";

  return (
    <div className="space-y-5 max-w-2xl mx-auto animate-fade-in">
      {/* Header */}
      <div>
        <h2 className="text-[#0a1a14] text-lg font-semibold">
          Settings
        </h2>

        <p className="text-[#9ca3af] text-xs mt-0.5">
          Manage your profile and preferences
        </p>
      </div>

      <ProfileSection
        name={fullName}
        email={user.email || ""}
        initials={initials}
      />

      <PreferencesSection profile={profile} />

      <AccountSection />
    </div>
  );
}