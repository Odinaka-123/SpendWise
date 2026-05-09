"use client"

import { Search, Filter, X } from "lucide-react"
import clsx from "clsx"

const categories = [
  "All",
  "Groceries",
  "Dining",
  "Transport",
  "Housing",
  "Entertainment",
  "Income",
  "Utility",
  "Other",
]

interface FiltersProps {
  search: string
  onSearch: (v: string) => void
  activeCategory: string
  onCategory: (v: string) => void
  dateFrom: string
  dateTo: string
  onDateFrom: (v: string) => void
  onDateTo: (v: string) => void
  onClear: () => void
  categoryOptions?: string[]   // ← add this
}

export default function TransactionFilters({
  search,
  onSearch,
  activeCategory,
  onCategory,
  dateFrom,
  dateTo,
  onDateFrom,
  onDateTo,
  onClear,
}: FiltersProps) {
  const hasFilters =
    search || activeCategory !== "All" || dateFrom || dateTo

  return (
    <div className="bg-white border border-[#f0f0ee] rounded-2xl p-4 space-y-3">
      {/* Top row */}
      <div className="flex gap-3 flex-wrap">
        {/* Search */}
        <div className="relative flex-1 min-w-50">
          <Search
            size={14}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9ca3af]"
          />
          <input
            type="text"
            placeholder="Search transactions…"
            value={search}
            onChange={(e) => onSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-[#f7f6f2] border border-[#f0f0ee] rounded-xl text-sm text-[#0a1a14] placeholder:text-[#9ca3af] focus:outline-none focus:border-[#1D9E75] focus:ring-2 focus:ring-[#1D9E75]/10 transition-all"
          />
        </div>

        {/* Date range */}
        <div className="flex items-center gap-2">
          <input
            type="date"
            value={dateFrom}
            onChange={(e) => onDateFrom(e.target.value)}
            className="px-3 py-2 bg-[#f7f6f2] border border-[#f0f0ee] rounded-xl text-xs text-[#6b7280] focus:outline-none focus:border-[#1D9E75] transition-all"
          />
          <span className="text-[#9ca3af] text-xs">to</span>
          <input
            type="date"
            value={dateTo}
            onChange={(e) => onDateTo(e.target.value)}
            className="px-3 py-2 bg-[#f7f6f2] border border-[#f0f0ee] rounded-xl text-xs text-[#6b7280] focus:outline-none focus:border-[#1D9E75] transition-all"
          />
        </div>

        {/* Clear */}
        {hasFilters && (
          <button
            onClick={onClear}
            className="flex items-center gap-1.5 px-3 py-2 text-xs text-[#9ca3af] hover:text-[#0a1a14] border border-[#f0f0ee] rounded-xl hover:bg-[#f7f6f2] transition-all"
          >
            <X size={12} />
            Clear
          </button>
        )}
      </div>

      {/* Category pills */}
      <div className="flex gap-1.5 flex-wrap items-center">
        <Filter size={13} className="text-[#9ca3af] shrink-0" />
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => onCategory(cat)}
            className={clsx(
              "px-3 py-1 rounded-full text-xs font-medium transition-all duration-150",
              activeCategory === cat
                ? "bg-[#0a1a14] text-white"
                : "bg-[#f7f6f2] text-[#6b7280] hover:bg-[#e5e7eb]"
            )}
          >
            {cat}
          </button>
        ))}
      </div>
    </div>
  )
}