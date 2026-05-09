"use client";

import { useState, useMemo } from "react";
import { RefreshCw, Plus, AlertTriangle } from "lucide-react";
import type { RecurringTx, Frequency } from "./types";
import RecurringSummaryStrip from "../components/recurring/RecurringSummaryStrip";
import RecurringFrequencyFilter from "../components/recurring/RecurringFrequencyFilter";
import RecurringCard from "../components/recurring/RecurringCard";
import RecurringModal from "../components/recurring/RecurringModal";
import RecurringUpcomingPanel from "../components/recurring/RecurringUpcomingPanel";
import { useRecurring } from "@/hooks/useRecurring";

type FilterValue = "all" | Frequency;
type ModalState = null | { mode: "create" } | { mode: "edit"; tx: RecurringTx };

export default function RecurringTransactionsPage() {
  const { items, loading, error, create, update, toggle, remove } = useRecurring();

  const [modal, setModal]   = useState<ModalState>(null);
  const [filter, setFilter] = useState<FilterValue>("all");

  const filtered = useMemo(
    () => (filter === "all" ? items : items.filter((t) => t.frequency === filter)),
    [items, filter],
  );

  const handleSave = async (data: Omit<RecurringTx, "id">) => {
    if (modal?.mode === "edit") {
      await update(modal.tx.id, data);
    } else {
      await create(data);
    }
    setModal(null);
  };

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

      {/* Error */}
      {error && (
        <div className="flex items-center gap-3 px-4 py-3 bg-[#FCEBEB] border border-red-200 rounded-2xl">
          <AlertTriangle size={15} className="text-[#E24B4A] shrink-0" />
          <p className="text-xs text-[#E24B4A]">{error}</p>
        </div>
      )}

      {/* Summary strip */}
      {loading ? (
        <div className="grid grid-cols-3 gap-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="bg-white border border-[#f0f0ee] rounded-2xl p-4 h-16 animate-pulse" />
          ))}
        </div>
      ) : (
        <RecurringSummaryStrip txs={items} />
      )}

      {/* Frequency filter */}
      <RecurringFrequencyFilter value={filter} onChange={setFilter} />

      {/* Main layout: cards + upcoming sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-5 items-start">
        {/* Cards / loading / empty state */}
        <div className="space-y-3">
          {loading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="bg-white border border-[#f0f0ee] rounded-2xl p-4 h-24 animate-pulse" />
            ))
          ) : filtered.length === 0 ? (
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
          ) : (
            filtered.map((t) => (
              <RecurringCard
                key={t.id}
                tx={t}
                onToggle={toggle}
                onEdit={(t) => setModal({ mode: "edit", tx: t })}
                onDelete={remove}
              />
            ))
          )}
        </div>

        {/* Upcoming sidebar */}
        {!loading && (
          <div className="lg:sticky lg:top-6">
            <RecurringUpcomingPanel txs={items} />
          </div>
        )}
      </div>
    </div>
  );
}