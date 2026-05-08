"use client";

import { useState, useMemo } from "react";
import { Bell, Plus } from "lucide-react";
import type { BudgetAlert } from "./types";
import { CATEGORIES, MOCK_SPEND } from "./types";
import AlertSummaryStrip from "../components/alerts/AlertSummaryStrip";
import AlertCard from "../components/alerts/AlertCard";
import AlertModal from "../components/alerts/AlertModal";
import AlertTipsPanel from "../components/alerts/AlertTipsPanel";

// ─── Seed data ─────────────────────────────────────────────────────────────────
const INITIAL_ALERTS: BudgetAlert[] = [
  { id: "1", category: "Groceries", limit: 20000, alertAt: 80, enabled: true },
  { id: "2", category: "Dining", limit: 8000, alertAt: 75, enabled: true },
  { id: "3", category: "Transport", limit: 5000, alertAt: 80, enabled: false },
  { id: "4", category: "Utility", limit: 10000, alertAt: 90, enabled: true },
];

type ModalState =
  | null
  | { mode: "create" }
  | { mode: "edit"; alert: BudgetAlert };

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function BudgetAlertsPage() {
  const [alerts, setAlerts] = useState<BudgetAlert[]>(INITIAL_ALERTS);
  const [modal, setModal] = useState<ModalState>(null);

  const usedCategories = useMemo(() => alerts.map((a) => a.category), [alerts]);
  const canAdd = usedCategories.length < CATEGORIES.length;

  const handleSave = (data: Omit<BudgetAlert, "id">) => {
    if (modal?.mode === "edit") {
      setAlerts((prev) =>
        prev.map((a) => (a.id === modal.alert.id ? { ...a, ...data } : a)),
      );
    } else {
      setAlerts((prev) => [...prev, { ...data, id: String(Date.now()) }]);
    }
    setModal(null);
  };

  const handleToggle = (id: string) =>
    setAlerts((prev) =>
      prev.map((a) => (a.id === id ? { ...a, enabled: !a.enabled } : a)),
    );

  const handleDelete = (id: string) =>
    setAlerts((prev) => prev.filter((a) => a.id !== id));

  return (
    <div className="space-y-5 max-w-3xl mx-auto animate-fade-in">
      {/* Modal */}
      {modal && (
        <AlertModal
          existing={modal.mode === "edit" ? modal.alert : undefined}
          usedCategories={usedCategories}
          onSave={handleSave}
          onClose={() => setModal(null)}
        />
      )}

      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-[#0a1a14] text-lg font-semibold">
            Budget Alerts
          </h2>
          <p className="text-[#9ca3af] text-xs mt-0.5">
            Set monthly limits per category and get notified when nearing your
            cap
          </p>
        </div>
        <button
          onClick={() => setModal({ mode: "create" })}
          disabled={!canAdd}
          className="flex items-center gap-2 px-4 py-2 bg-[#1D9E75] hover:bg-[#0F6E56] disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-semibold rounded-xl transition-colors shrink-0"
        >
          <Plus size={13} />
          New alert
        </button>
      </div>

      {/* Summary strip */}
      <AlertSummaryStrip alerts={alerts} />

      {/* Alert cards / empty state */}
      {alerts.length === 0 ?
        <div className="bg-white border border-[#f0f0ee] rounded-2xl p-10 text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-[#f7f6f2] flex items-center justify-center mx-auto">
            <Bell size={20} className="text-[#9ca3af]" />
          </div>
          <p className="text-sm font-medium text-[#0a1a14]">No alerts yet</p>
          <p className="text-xs text-[#9ca3af]">
            Create your first budget alert to get notified before you overspend.
          </p>
          <button
            onClick={() => setModal({ mode: "create" })}
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#1D9E75] text-white text-xs font-semibold rounded-xl hover:bg-[#0F6E56] transition-colors"
          >
            <Plus size={13} /> New alert
          </button>
        </div>
      : <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {alerts.map((a) => (
            <AlertCard
              key={a.id}
              alert={a}
              spend={MOCK_SPEND[a.category] ?? 0}
              onToggle={handleToggle}
              onEdit={(a) => setModal({ mode: "edit", alert: a })}
              onDelete={handleDelete}
            />
          ))}
        </div>
      }

      {/* Tips */}
      <AlertTipsPanel />
    </div>
  );
}
