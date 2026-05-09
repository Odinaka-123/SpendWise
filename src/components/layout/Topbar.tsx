"use client";

import { Plus, Search } from "lucide-react";
import { useState } from "react";
import clsx from "clsx";
import NotificationBell from "../notifications/NotificationBell";
import AddExpenseModal from "../AddExpenseModal";

interface TopbarProps {
  title: string;
  subtitle?: string;
}

const currentMonthLabel = new Date().toLocaleString("en-NG", {
  month: "short",
  year: "numeric",
});

export default function Topbar({ title, subtitle }: TopbarProps) {
  const [searchOpen, setSearchOpen] = useState(false);
  const [expenseOpen, setExpenseOpen] = useState(false);

  return (
    <>
      <header className="h-[60px] flex items-center justify-between px-6 border-b border-[#f0f0ee] bg-white flex-shrink-0">
        {/* Left */}
        <div className="flex items-center gap-4">
          {!searchOpen && (
            <div>
              <h1 className="text-[#0a1a14] text-base font-semibold leading-tight">
                {title}
              </h1>
              {subtitle && <p className="text-[#9ca3af] text-xs">{subtitle}</p>}
            </div>
          )}

          {/* Expandable search */}
          <div
            className={clsx(
              "flex items-center gap-2 transition-all duration-200",
              searchOpen ? "w-64" : "w-8",
            )}
          >
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="w-8 h-8 flex items-center justify-center rounded-lg text-[#9ca3af] hover:bg-[#f3f4f6] hover:text-[#0a1a14] transition-colors flex-shrink-0"
              aria-label="Search"
            >
              <Search size={16} />
            </button>
            {searchOpen && (
              <input
                autoFocus
                type="text"
                placeholder="Search transactions…"
                onBlur={() => setSearchOpen(false)}
                className="flex-1 text-sm text-[#0a1a14] placeholder:text-[#d1d5db] bg-transparent border-b border-[#e5e7eb] focus:outline-none focus:border-[#1D9E75] pb-0.5 transition-colors"
              />
            )}
          </div>
        </div>

        {/* Right */}
        <div className="flex items-center gap-2">
          <NotificationBell />

          {/* Current month badge */}
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-[#f7f6f2] rounded-lg border border-[#e5e7eb]">
            <span className="text-xs text-[#6b7280]">{currentMonthLabel}</span>
          </div>

          {/* Add expense — opens modal */}
          <button
            onClick={() => setExpenseOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#1D9E75] hover:bg-[#0F6E56] text-white text-xs font-medium rounded-lg transition-all duration-150 active:scale-[0.98]"
          >
            <Plus size={14} />
            <span className="hidden sm:inline">Add expense</span>
          </button>
        </div>
      </header>

      {/* Modal — rendered outside header so it can escape stacking context */}
      <AddExpenseModal
        open={expenseOpen}
        onClose={() => setExpenseOpen(false)}
      />
    </>
  );
}
