"use client";

import ProfileSection from "../components/settings/ProfileSection";
import PreferencesSection from "../components/settings/PreferencesSection";
import AccountSection from "../components/settings/AccountSection";

const mockUser = {
  name: "Adaeze Obi",
  email: "adaeze@email.com",
  initials: "AO",
};

export default function SettingsPage() {
  return (
    <div className="space-y-5 max-w-2xl mx-auto animate-fade-in">
      {/* Header */}
      <div>
        <h2 className="text-[#0a1a14] text-lg font-semibold">Settings</h2>
        <p className="text-[#9ca3af] text-xs mt-0.5">
          Manage your profile and preferences
        </p>
      </div>

      <ProfileSection
        name={mockUser.name}
        email={mockUser.email}
        initials={mockUser.initials}
      />

      <PreferencesSection />

      <AccountSection />
    </div>
  );
}
