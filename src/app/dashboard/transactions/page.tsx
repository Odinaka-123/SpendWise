"use client"

import { useState, useMemo } from "react"
import { Download, Plus } from "lucide-react"
import TransactionFilters from "../components/transactions/TransactionFilters"
import TransactionTable, { type TxRow } from "../components/transactions/TransactionTable"
import TransactionModal, { type TransactionFormData } from "../components/transactions/TransactionModal"
import { useExpenses } from "@/hooks/useExpenses"
import { useCategories } from "@/hooks/useCategories"
import type { ExpenseWithCategory } from "@/lib/database.types"

// Map DB row → TxRow shape the table/modal expect
function toTxRow(e: ExpenseWithCategory): TxRow {
  return {
    id:          e.id,
    name:        e.name,
    amount:      String(e.amount),
    category:    e.category?.name ?? "",
    category_id: e.category_id ?? "",
    date:        e.date,
    type:        e.type,
    notes:       e.notes ?? "",
    color:       e.category?.color,
  }
}

export default function TransactionsPage() {
  const currentMonth = new Date().toISOString().slice(0, 7)

  const [search, setSearch]       = useState("")
  const [category, setCategory]   = useState("All")
  const [dateFrom, setDateFrom]   = useState("")
  const [dateTo, setDateTo]       = useState("")
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing]     = useState<TxRow | null>(null)

  const { expenses, loading, error, create, update, remove } = useExpenses({ month: currentMonth })
  const { categories } = useCategories()

  const categoryNames = useMemo(() => categories.map((c) => c.name), [categories])

  const filtered = useMemo(() => {
    return expenses.map(toTxRow).filter((r) => {
      const matchSearch = r.name.toLowerCase().includes(search.toLowerCase())
      const matchCat    = category === "All" || r.category === category
      const matchFrom   = !dateFrom || r.date >= dateFrom
      const matchTo     = !dateTo   || r.date <= dateTo
      return matchSearch && matchCat && matchFrom && matchTo
    })
  }, [expenses, search, category, dateFrom, dateTo])

  const totals = useMemo(() => {
    const income  = filtered.filter((r) => r.type === "credit").reduce((s, r) => s + Number(r.amount), 0)
    const expense = filtered.filter((r) => r.type === "debit").reduce((s, r)  => s + Number(r.amount), 0)
    return { income, expense }
  }, [filtered])

  // ── Handlers ──────────────────────────────────────────────────────────────
  const handleSave = async (data: TransactionFormData) => {
    if (data.id) {
      await update({
        id:          data.id,
        name:        data.name,
        amount:      Number(data.amount),
        type:        data.type,
        date:        data.date,
        category_id: data.category_id || null,
        notes:       data.notes || null,
      })
    } else {
      await create({
        name:        data.name,
        amount:      Number(data.amount),
        type:        data.type,
        date:        data.date,
        category_id: data.category_id || null,
        notes:       data.notes || null,
      })
    }
  }

  const handleDelete = async (id: string) => remove(id)

  const handleEdit = (row: TxRow) => {
    setEditing(row)
    setModalOpen(true)
  }

  const clearFilters = () => {
    setSearch("")
    setCategory("All")
    setDateFrom("")
    setDateTo("")
  }

  // ── CSV export ────────────────────────────────────────────────────────────
  const handleExport = () => {
    const header = "Date,Description,Category,Type,Amount (₦)"
    const lines  = filtered.map(
      (r) => `${r.date},"${r.name}",${r.category || ""},${r.type},${r.amount}`
    )
    const csv  = [header, ...lines].join("\n")
    const blob = new Blob([csv], { type: "text/csv" })
    const url  = URL.createObjectURL(blob)
    const a    = document.createElement("a")
    a.href     = url
    a.download = `transactions_${currentMonth}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <>
      <div className="space-y-5 max-w-300 mx-auto animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-[#0a1a14] text-lg font-semibold">Transactions</h2>
            <p className="text-[#9ca3af] text-xs mt-0.5">
              {loading
                ? "Loading…"
                : `${filtered.length} record${filtered.length !== 1 ? "s" : ""}`}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleExport}
              disabled={filtered.length === 0}
              className="flex items-center gap-1.5 px-3 py-2 border border-[#e5e7eb] rounded-xl text-xs text-[#6b7280] hover:bg-white disabled:opacity-40 transition-all"
            >
              <Download size={13} />
              Export
            </button>
            <button
              onClick={() => { setEditing(null); setModalOpen(true) }}
              className="flex items-center gap-1.5 px-3 py-2 bg-[#1D9E75] hover:bg-[#0F6E56] text-white text-xs font-medium rounded-xl transition-all active:scale-[0.98]"
            >
              <Plus size={13} />
              Add transaction
            </button>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="px-4 py-3 bg-[#FCEBEB] border border-red-200 rounded-xl">
            <p className="text-xs text-[#E24B4A]">{error}</p>
          </div>
        )}

        {/* Summary strip */}
        <div className="grid grid-cols-3 gap-4">
          {[
            {
              label: "Total income",
              value: `₦${totals.income.toLocaleString()}`,
              color: "text-[#0F6E56]",
            },
            {
              label: "Total expenses",
              value: `₦${totals.expense.toLocaleString()}`,
              color: "text-[#0a1a14]",
            },
            {
              label: "Net",
              value: `${totals.income - totals.expense >= 0 ? "+" : ""}₦${Math.abs(totals.income - totals.expense).toLocaleString()}`,
              color: totals.income >= totals.expense ? "text-[#0F6E56]" : "text-[#993C1D]",
            },
          ].map((s) => (
            <div key={s.label} className="bg-white border border-[#f0f0ee] rounded-2xl px-5 py-4">
              <p className="text-[#9ca3af] text-xs mb-1">{s.label}</p>
              <p className={`text-xl font-semibold ${s.color}`}>{s.value}</p>
            </div>
          ))}
        </div>

        {/* Filters */}
        <TransactionFilters
          search={search}
          onSearch={setSearch}
          activeCategory={category}
          onCategory={setCategory}
          dateFrom={dateFrom}
          dateTo={dateTo}
          onDateFrom={setDateFrom}
          onDateTo={setDateTo}
          onClear={clearFilters}
          categoryOptions={categoryNames}
        />

        {/* Table */}
        {loading ? (
          <div className="bg-white border border-[#f0f0ee] rounded-2xl overflow-hidden">
            <div className="grid grid-cols-[2fr_1fr_1fr_1fr_80px] gap-4 px-5 py-3 border-b border-[#f0f0ee] bg-[#f7f6f2]">
              {["Description", "Category", "Date", "Amount", ""].map((h) => (
                <p key={h} className="text-[10px] font-semibold text-[#9ca3af] uppercase tracking-widest">{h}</p>
              ))}
            </div>
            <div className="divide-y divide-[#f7f6f2]">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="px-5 py-4 animate-pulse">
                  <div className="h-4 bg-[#f7f6f2] rounded w-3/4" />
                </div>
              ))}
            </div>
          </div>
        ) : (
          <TransactionTable
            rows={filtered}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        )}
      </div>

      <TransactionModal
        open={modalOpen}
        onClose={() => { setModalOpen(false); setEditing(null) }}
        onSave={handleSave}
        initial={editing}
      />
    </>
  )
}