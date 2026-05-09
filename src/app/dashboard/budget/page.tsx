"use client";

import { useState, useMemo } from "react";
import { Plus, AlertTriangle } from "lucide-react";
import BudgetCard, { type Budget } from "../components/budget/BudgetCard";
import BudgetModal from "../components/budget/BudgetModal";
import BudgetSummary from "../components/budget/BudgetSummary";
import { useBudgetAlerts } from "@/hooks/useBudgetAlerts";
import { useCategories } from "@/hooks/useCategories";

export default function BudgetPage() {
  const currentMonth = new Date().toISOString().slice(0, 7);

  const { budgets: rawBudgets, loading, error, upsert, remove } =
    useBudgetAlerts(currentMonth);
  const { categories } = useCategories();

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing]     = useState<Budget | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);

  // Map BudgetVsActual rows → Budget shape the card/modal expect
  const budgets: Budget[] = useMemo(
    () =>
      rawBudgets.map((b) => ({
        id:       b.category_id,
        category: b.category_name ?? b.category_id,
        limit:    b.budget_amount,
        spent:    b.actual_spent,
        color:    b.category_color ?? "#6b7280",
        icon:     b.category_name ?? b.category_id,
      })),
    [rawBudgets]
  );

  const totalLimit = useMemo(() => budgets.reduce((s, b) => s + b.limit, 0), [budgets]);
  const totalSpent = useMemo(() => budgets.reduce((s, b) => s + b.spent, 0), [budgets]);
  const overBudget = budgets.filter((b) => b.spent > b.limit);
  const onTrack    = budgets.filter((b) => b.spent <= b.limit);

  const existingCategories = useMemo(
    () => new Set(budgets.map((b) => b.category)),
    [budgets]
  );

  // Always allow adding — the modal filters taken categories and always offers "Other"
  const canAdd = true;

  const handleSave = async ({ category, limit }: { category: string; limit: number }) => {
    setSaveError(null);
    try {
      if (editing) {
        await upsert({ category_id: editing.id, amount: limit });
      } else {
        let cat = categories.find((c) => c.name === category);

        if (!cat) {
          const { createCategory } = await import("@/lib/actions/categories");
          cat = await createCategory({
            name:  category,
            color: "#6b7280",
            icon:  "wallet",
          });
        }

        if (cat) {
          await upsert({ category_id: cat.id, amount: limit });
        }
      }
      setModalOpen(false);
      setEditing(null);
    } catch (e) {
      setSaveError(e instanceof Error ? e.message : "Failed to save budget");
    }
  };

  const handleDelete = async (id: string) => remove(id);

  const handleEdit = (b: Budget) => {
    setEditing(b);
    setModalOpen(true);
  };

  const monthLabel = new Date().toLocaleString("en-NG", {
    month: "long",
    year:  "numeric",
  });

  return (
    <>
      <div className="space-y-5 max-w-300 mx-auto animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-[#0a1a14] text-lg font-semibold">Budgets</h2>
            <p className="text-[#9ca3af] text-xs mt-0.5">
              {monthLabel} spending limits
            </p>
          </div>
          <button
            onClick={() => { setEditing(null); setModalOpen(true); }}
            disabled={!canAdd}
            className="flex items-center gap-1.5 px-3 py-2 bg-[#1D9E75] hover:bg-[#0F6E56] disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-medium rounded-xl transition-all active:scale-[0.98]"
          >
            <Plus size={13} />
            New budget
          </button>
        </div>

        {/* Error */}
        {error && (
          <div className="flex items-center gap-3 px-4 py-3 bg-[#FCEBEB] border border-red-200 rounded-2xl">
            <AlertTriangle size={15} className="text-[#E24B4A] shrink-0" />
            <p className="text-xs text-[#E24B4A]">{error}</p>
          </div>
        )}

        {/* Over-budget alert */}
        {overBudget.length > 0 && (
          <div className="flex items-center gap-3 px-4 py-3 bg-[#FEF3C7] border border-[#FDE68A] rounded-2xl">
            <AlertTriangle size={15} className="text-[#D97706] shrink-0" />
            <p className="text-xs text-[#92400E]">
              <span className="font-semibold">
                {overBudget.length}{" "}
                {overBudget.length === 1 ? "category" : "categories"}
              </span>{" "}
              {overBudget.length === 1 ? "has" : "have"} exceeded the monthly
              limit — {overBudget.map((b) => b.category).join(", ")}.
            </p>
          </div>
        )}

        {/* Summary */}
        <BudgetSummary
          totalLimit={totalLimit}
          totalSpent={totalSpent}
          overCount={overBudget.length}
          onTrackCount={onTrack.length}
        />

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-white border border-[#f0f0ee] rounded-2xl p-5 h-36 animate-pulse" />
            ))}
          </div>
        ) : budgets.length === 0 ? (
          <div className="bg-white border border-[#f0f0ee] rounded-2xl p-12 text-center">
            <div className="w-12 h-12 bg-[#E1F5EE] rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Plus size={20} className="text-[#1D9E75]" />
            </div>
            <p className="text-[#0a1a14] text-sm font-medium">No budgets set yet</p>
            <p className="text-[#9ca3af] text-xs mt-1 mb-4">
              Set monthly limits per category to track your spending.
            </p>
            <button
              onClick={() => { setEditing(null); setModalOpen(true); }}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#1D9E75] hover:bg-[#0F6E56] text-white text-xs font-medium rounded-xl transition-all active:scale-[0.98]"
            >
              <Plus size={13} />
              Create your first budget
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {budgets.map((b) => (
              <BudgetCard
                key={b.id}
                budget={b}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </div>

      <BudgetModal
        open={modalOpen}
        onClose={() => { setModalOpen(false); setEditing(null); setSaveError(null); }}
        onSave={handleSave}
        initial={editing}
        existingCategories={existingCategories}
        allCategories={categories}
        externalError={saveError}
      />
    </>
  );
}