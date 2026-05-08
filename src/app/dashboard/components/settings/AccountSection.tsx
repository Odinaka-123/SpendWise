"use client";

import { LogOut, Trash2 } from "lucide-react";

export default function AccountSection() {
  return (
    <div className="bg-white border border-[#f0f0ee] rounded-2xl p-5 space-y-3">
      <p className="text-sm font-semibold text-[#0a1a14]">Account</p>

      <div className="flex flex-col sm:flex-row gap-2">
        <button className="flex items-center gap-2 px-4 py-2.5 border border-[#e5e7eb] rounded-xl text-sm text-[#6b7280] hover:bg-[#f7f6f2] transition-all">
          <LogOut size={14} />
          Sign out
        </button>
        <button className="flex items-center gap-2 px-4 py-2.5 border border-red-100 rounded-xl text-sm text-red-500 hover:bg-red-50 transition-all">
          <Trash2 size={14} />
          Delete account
        </button>
      </div>

      <p className="text-xs text-[#d1d5db]">
        Deleting your account is permanent and cannot be undone. All data will
        be erased.
      </p>
    </div>
  );
}
