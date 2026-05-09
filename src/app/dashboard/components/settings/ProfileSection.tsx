"use client";

import { useState } from "react";
import { Check } from "lucide-react";

import { updateProfile } from "@/lib/actions/settings";

interface ProfileSectionProps {
  name: string;
  email: string;
  initials: string;
}

export default function ProfileSection({
  name,
  email,
  initials,
}: ProfileSectionProps) {
  const [form, setForm] = useState({ name, email });

  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const inputCls =
    "w-full px-3 py-2.5 bg-[#f7f6f2] border border-[#f0f0ee] rounded-xl text-sm text-[#0a1a14] placeholder:text-[#9ca3af] focus:outline-none focus:border-[#1D9E75] focus:ring-2 focus:ring-[#1D9E75]/10 transition-all";

  const handleSave = async () => {
    try {
      setSaving(true);

      await updateProfile({
        full_name: form.name,
        email: form.email,
      });

      setSaved(true);

      setTimeout(() => {
        setSaved(false);
      }, 2500);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-white border border-[#f0f0ee] rounded-2xl p-5 space-y-4">
      <p className="text-sm font-semibold text-[#0a1a14]">
        Profile
      </p>

      {/* Avatar row */}
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-[#0a1a14] flex items-center justify-center text-white text-base font-semibold shrink-0">
          {initials}
        </div>

        <div>
          <p className="text-sm font-medium text-[#0a1a14]">
            {form.name}
          </p>

          <p className="text-xs text-[#9ca3af]">
            {form.email}
          </p>
        </div>
      </div>

      {/* Fields */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-[#0a1a14]">
            Full name
          </label>

          <input
            type="text"
            value={form.name}
            onChange={(e) =>
              setForm((p) => ({
                ...p,
                name: e.target.value,
              }))
            }
            className={inputCls}
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-medium text-[#0a1a14]">
            Email
          </label>

          <input
            type="email"
            value={form.email}
            onChange={(e) =>
              setForm((p) => ({
                ...p,
                email: e.target.value,
              }))
            }
            className={inputCls}
          />
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-4 py-2 bg-[#1D9E75] hover:bg-[#0F6E56] disabled:opacity-50 text-white text-xs font-medium rounded-xl transition-all active:scale-[0.98]"
        >
          {saving ?
            <svg
              className="animate-spin h-3.5 w-3.5"
              viewBox="0 0 24 24"
              fill="none"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />

              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v8z"
              />
            </svg>
          : saved ?
            <Check size={13} />
          : null}

          {saving ?
            "Saving…"
          : saved ?
            "Saved!"
          : "Save changes"}
        </button>
      </div>
    </div>
  );
}