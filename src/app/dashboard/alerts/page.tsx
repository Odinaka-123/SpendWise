"use client";

import { useState, useMemo } from "react";
import { Bell, Plus } from "lucide-react";
import type { BudgetAlert } from "./types";
import AlertSummaryStrip from "../components/alerts/AlertSummaryStrip";
import AlertCard from "../components/alerts/AlertCard";
import AlertModal from "../components/alerts/AlertModal";
import AlertTipsPanel from "../components/alerts/AlertTipsPanel";
import { useBudgetAlerts } from "@/hooks/useBudgetAlerts";
import { useCategories } from "@/hooks/useCategories";

export default function BudgetAlertsPage() {
  const currentMonth = new Date().toISOString().slice(0, 7);
  const { budgets: rawBudgets, loading, error, upsert, remove } =
    useBudgetAlerts(currentMonth);
  const { categories } = useCategories();

  const [modal, setModal] = useState<
    null | { mode: "create" } | { mode: "edit"; alert: BudgetAlert }
  >(null);

  // Map BudgetVsActual → BudgetAlert shape the components expect
  const alerts: BudgetAlert[] = useMemo(
    () =>
      rawBudgets.map((b) => ({
        id:          b.category_id,
        category:    b.category_name ?? b.category_id,
        category_id: b.category_id,
        limit:       b.budget_amount,
        alertAt:     80,
        enabled:     true,
        spend:       b.actual_spent,
      })),
    [rawBudgets]
  );

  const usedCategories = useMemo(
    () => alerts.map((a) => a.category),
    [alerts]
  );

  const budgetedIds = new Set(rawBudgets.map((b) => b.category_id));
  const canAdd = categories.length === 0 || categories.some((c) => !budgetedIds.has(c.id));

  // ── Handlers ──────────────────────────────────────────────────────────────
  const handleSave = async (data: Omit<BudgetAlert, "id">) => {
    let cat = categories.find((c) => c.name === data.category);

    if (!cat) {
      const { createCategory } = await import("@/lib/actions/categories");
      const created = await createCategory({
        name:  data.category,
        color: "#6b7280",
        icon:  "wallet",
      });
      if (!created) return;
      cat = created;
    }

    await upsert({ category_id: cat!.id, amount: data.limit });
    setModal(null);
  };

  const handleToggle = () => {
    // alertAt/enabled are UI-only — not stored in DB yet
  };

  const handleDelete = async (id: string) => {
    await remove(id);
  };

  return (
    <div className="space-y-5 max-w-3xl mx-auto animate-fade-in">
      {/* Modal */}
      {modal && (
        <AlertModal
          existing={modal.mode === "edit" ? modal.alert : undefined}
          usedCategories={usedCategories}
          onSave={(data) => { handleSave(data) }}
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
            Set monthly limits per category and get notified when nearing your cap
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

      {/* Error */}
      {error && (
        <div className="px-4 py-3 bg-[#FCEBEB] border border-red-200 rounded-xl">
          <p className="text-xs text-[#E24B4A]">{error}</p>
        </div>
      )}

      {/* Summary strip */}
      <AlertSummaryStrip alerts={alerts} />

      {/* Cards / empty state */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="bg-white border border-[#f0f0ee] rounded-2xl p-5 h-40 animate-pulse"
            />
          ))}
        </div>
      ) : alerts.length === 0 ? (
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
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {alerts.map((a) => (
            <AlertCard
              key={a.id}
              alert={a}
              onToggle={handleToggle}
              onEdit={(a: BudgetAlert) => setModal({ mode: "edit", alert: a })}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      {/* Tips */}
      <AlertTipsPanel />
    </div>
  );
}