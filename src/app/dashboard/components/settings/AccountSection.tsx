"use client";

import { useState } from "react";
import { LogOut, Trash2, TriangleAlert, X } from "lucide-react";
import { useRouter } from "next/navigation";

import { signOut } from "@/lib/actions/settings";

export default function AccountSection() {
  const router = useRouter();

  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    try {
      setLoading(true);

      await signOut();

      router.push("/login");
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="bg-white border border-[#f0f0ee] rounded-2xl p-5 space-y-3">
        <p className="text-sm font-semibold text-[#0a1a14]">
          Account
        </p>

        <div className="flex flex-col sm:flex-row gap-2">
          <button
            onClick={() => setShowLogoutModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 border border-[#e5e7eb] rounded-xl text-sm text-[#6b7280] hover:bg-[#f7f6f2] transition-all"
          >
            <LogOut size={14} />
            Sign out
          </button>

          <button className="flex items-center gap-2 px-4 py-2.5 border border-red-100 rounded-xl text-sm text-red-500 hover:bg-red-50 transition-all">
            <Trash2 size={14} />
            Delete account
          </button>
        </div>

        <p className="text-xs text-[#d1d5db]">
          Deleting your account is permanent and cannot be undone.
          All data will be erased.
        </p>
      </div>

      {/* Logout Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-[2px] px-4 animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-[#f0f0ee] overflow-hidden animate-in zoom-in-95 duration-200">
            {/* Top */}
            <div className="flex items-start justify-between p-5 pb-0">
              <div className="w-11 h-11 rounded-2xl bg-red-50 flex items-center justify-center">
                <TriangleAlert
                  size={20}
                  className="text-red-500"
                />
              </div>

              <button
                onClick={() => setShowLogoutModal(false)}
                className="w-8 h-8 rounded-full hover:bg-[#f7f6f2] flex items-center justify-center transition-all"
              >
                <X size={16} className="text-[#9ca3af]" />
              </button>
            </div>

            {/* Content */}
            <div className="px-5 pt-4 pb-5">
              <h3 className="text-lg font-semibold text-[#0a1a14]">
                Sign out?
              </h3>

              <p className="text-sm text-[#6b7280] mt-1 leading-relaxed">
                Are you sure you want to sign out of your SpendWise
                account?
              </p>

              {/* Actions */}
              <div className="flex flex-col-reverse sm:flex-row gap-2 mt-6">
                <button
                  onClick={() => setShowLogoutModal(false)}
                  disabled={loading}
                  className="flex-1 px-4 py-2.5 rounded-xl border border-[#e5e7eb] text-sm font-medium text-[#6b7280] hover:bg-[#f7f6f2] transition-all"
                >
                  Cancel
                </button>

                <button
                  onClick={handleLogout}
                  disabled={loading}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white text-sm font-medium transition-all disabled:opacity-50"
                >
                  {loading ?
                    <svg
                      className="animate-spin h-4 w-4"
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
                  : <LogOut size={15} />}

                  {loading ? "Signing out..." : "Yes, sign out"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}