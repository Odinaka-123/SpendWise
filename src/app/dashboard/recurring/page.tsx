"use client";

import { useState, useMemo } from "react";
import { RefreshCw, Plus } from "lucide-react";
import type { RecurringTx, Frequency } from "./types";
import RecurringSummaryStrip from "../components/recurring/RecurringSummaryStrip";
import RecurringFrequencyFilter from "../components/recurring/RecurringFrequencyFilter";
import RecurringCard from "../components/recurring/RecurringCard";
import RecurringModal from "../components/recurring/RecurringModal";
import RecurringUpcomingPanel from "../components/recurring/RecurringUpcomingPanel";

// ─── Seed data ─────────────────────────────────────────────────────────────────
const INITIAL_RECURRING: RecurringTx[] = [
  {
    id: "1",
    name: "Netflix",
    category: "Entertainment",
    amount: 4600,
    type: "debit",
    frequency: "monthly",
    nextDate: "2026-06-07",
    enabled: true,
  },
  {
    id: "2",
    name: "Salary credit",
    category: "Income",
    amount: 200000,
    type: "credit",
    frequency: "monthly",
    nextDate: "2026-06-01",
    enabled: true,
  },
  {
    id: "3",
    name: "Rent payment",
    category: "Housing",
    amount: 35000,
    type: "debit",
    frequency: "monthly",
    nextDate: "2026-06-01",
    enabled: true,
  },
  {
    id: "4",
    name: "Bolt weekly",
    category: "Transport",
    amount: 3500,
    type: "debit",
    frequency: "weekly",
    nextDate: "2026-05-12",
    enabled: false,
  },
];

type FilterValue = "all" | Frequency;
type ModalState = null | { mode: "create" } | { mode: "edit"; tx: RecurringTx };

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function RecurringTransactionsPage() {
  const [txs, setTxs] = useState<RecurringTx[]>(INITIAL_RECURRING);
  const [modal, setModal] = useState<ModalState>(null);
  const [filter, setFilter] = useState<FilterValue>("all");

  const filtered = useMemo(
    () => (filter === "all" ? txs : txs.filter((t) => t.frequency === filter)),
    [txs, filter],
  );

  const handleSave = (data: Omit<RecurringTx, "id">) => {
    if (modal?.mode === "edit") {
      setTxs((prev) =>
        prev.map((t) => (t.id === modal.tx.id ? { ...t, ...data } : t)),
      );
    } else {
      setTxs((prev) => [...prev, { ...data, id: String(Date.now()) }]);
    }
    setModal(null);
  };

  const handleToggle = (id: string) =>
    setTxs((prev) =>
      prev.map((t) => (t.id === id ? { ...t, enabled: !t.enabled } : t)),
    );

  const handleDelete = (id: string) =>
    setTxs((prev) => prev.filter((t) => t.id !== id));

  return (
    <div className="space-y-5 max-w-3xl mx-auto animate-fade-in">
      {/* Modal */}
      {modal && (
        <RecurringModal
          existing={modal.mode === "edit" ? modal.tx : undefined}
          onSave={handleSave}
          onClose={() => setModal(null)}
        />
      )}

      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-[#0a1a14] text-lg font-semibold">
            Recurring Transactions
          </h2>
          <p className="text-[#9ca3af] text-xs mt-0.5">
            Schedule weekly or monthly bills and income to track automatically
          </p>
        </div>
        <button
          onClick={() => setModal({ mode: "create" })}
          className="flex items-center gap-2 px-4 py-2 bg-[#1D9E75] hover:bg-[#0F6E56] text-white text-xs font-semibold rounded-xl transition-colors shrink-0"
        >
          <Plus size={13} />
          Schedule
        </button>
      </div>

      {/* Summary strip */}
      <RecurringSummaryStrip txs={txs} />

      {/* Frequency filter */}
      <RecurringFrequencyFilter value={filter} onChange={setFilter} />

      {/* Main layout: cards + upcoming sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-5 items-start">
        {/* Cards / empty state */}
        <div className="space-y-3">
          {filtered.length === 0 ?
            <div className="bg-white border border-[#f0f0ee] rounded-2xl p-10 text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-[#f7f6f2] flex items-center justify-center mx-auto">
                <RefreshCw size={20} className="text-[#9ca3af]" />
              </div>
              <p className="text-sm font-medium text-[#0a1a14]">
                No recurring transactions
              </p>
              <p className="text-xs text-[#9ca3af]">
                Schedule a bill or income to automate your bookkeeping.
              </p>
              <button
                onClick={() => setModal({ mode: "create" })}
                className="inline-flex items-center gap-2 px-4 py-2 bg-[#1D9E75] text-white text-xs font-semibold rounded-xl hover:bg-[#0F6E56] transition-colors"
              >
                <Plus size={13} /> Schedule
              </button>
            </div>
          : filtered.map((t) => (
              <RecurringCard
                key={t.id}
                tx={t}
                onToggle={handleToggle}
                onEdit={(t) => setModal({ mode: "edit", tx: t })}
                onDelete={handleDelete}
              />
            ))
          }
        </div>

        {/* Upcoming sidebar */}
        <div className="lg:sticky lg:top-6">
          <RecurringUpcomingPanel txs={txs} />
        </div>
      </div>
    </div>
  );
}
