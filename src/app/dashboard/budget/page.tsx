
"use client";

import { useState, useMemo } from "react";
import { Plus, AlertTriangle } from "lucide-react";
import BudgetCard, { type Budget } from "../components/budget/BudgetCard";
import BudgetModal from "../components/budget/BudgetModal";
import BudgetSummary from "../components/budget/BudgetSummary";

const categoryColors: Record<string, string> = {
  Groceries: "#0F6E56",
  Dining: "#993556",
  Transport: "#185FA5",
  Housing: "#854F0B",
  Entertainment: "#534AB7",
  Utility: "#3B6D11",
  Other: "#6b7280",
};

const seed: Budget[] = [
  { id: "1", category: "Groceries", limit: 20000, spent: 14350, color: categoryColors.Groceries, icon: "Groceries" },
  { id: "2", category: "Dining", limit: 15000, spent: 6000, color: categoryColors.Dining, icon: "Dining" },
  { id: "3", category: "Transport", limit: 10000, spent: 2800, color: categoryColors.Transport, icon: "Transport" },
  { id: "4", category: "Housing", limit: 50000, spent: 35000, color: categoryColors.Housing, icon: "Housing" },
  { id: "5", category: "Entertainment", limit: 8000, spent: 4600, color: categoryColors.Entertainment, icon: "Entertainment" },
  { id: "6", category: "Utility", limit: 12000, spent: 8500, color: categoryColors.Utility, icon: "Utility" },
];

const ALL_CATEGORIES = ["Groceries", "Dining", "Transport", "Housing", "Entertainment", "Utility", "Other"];

export default function BudgetPage() {
  const [budgets, setBudgets] = useState<Budget[]>(seed);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Budget | null>(null);

  const totalLimit = useMemo(() => budgets.reduce((s, b) => s + b.limit, 0), [budgets]);
  const totalSpent = useMemo(() => budgets.reduce((s, b) => s + b.spent, 0), [budgets]);
  const overBudget = budgets.filter((b) => b.spent > b.limit);
  const onTrack = budgets.filter((b) => b.spent <= b.limit);

  const existingCategories = new Set(budgets.map((b) => b.category));
  const canAdd = ALL_CATEGORIES.some((c) => !existingCategories.has(c));

  const handleSave = ({ category, limit }: { category: string; limit: number }) => {
    if (editing) {
      setBudgets((p) => p.map((b) => b.id === editing.id ? { ...b, limit } : b));
    } else {
      setBudgets((p) => [
        ...p,
        {
          id: String(Date.now()),
          category,
          limit,
          spent: 0,
          color: categoryColors[category] ?? "#6b7280",
          icon: category,
        },
      ]);
    }
  };

  const handleDelete = (id: string) => setBudgets((p) => p.filter((b) => b.id !== id));

  const handleEdit = (b: Budget) => {
    setEditing(b);
    setModalOpen(true);
  };

  return (
    <>
      <div className="space-y-5 max-w-300 mx-auto animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-[#0a1a14] text-lg font-semibold">Budgets</h2>
            <p className="text-[#9ca3af] text-xs mt-0.5">May 2026 spending limits</p>
          </div>
          {canAdd && (
            <button
              onClick={() => { setEditing(null); setModalOpen(true); }}
              className="flex items-center gap-1.5 px-3 py-2 bg-[#1D9E75] hover:bg-[#0F6E56] text-white text-xs font-medium rounded-xl transition-all active:scale-[0.98]"
            >
              <Plus size={13} />
              New budget
            </button>
          )}
        </div>

        {/* Over-budget alert */}
        {overBudget.length > 0 && (
          <div className="flex items-center gap-3 px-4 py-3 bg-[#FEF3C7] border border-[#FDE68A] rounded-2xl">
            <AlertTriangle size={15} className="text-[#D97706] shrink-0" />
            <p className="text-xs text-[#92400E]">
              <span className="font-semibold">
                {overBudget.length} {overBudget.length === 1 ? "category" : "categories"}
              </span>{" "}
              {overBudget.length === 1 ? "has" : "have"} exceeded the monthly limit —{" "}
              {overBudget.map((b) => b.category).join(", ")}.
            </p>
          </div>
        )}

        {/* Master summary */}
        <BudgetSummary
          totalLimit={totalLimit}
          totalSpent={totalSpent}
          overCount={overBudget.length}
          onTrackCount={onTrack.length}
        />

        {/* Budget grid */}
        {budgets.length === 0 ? (
          <div className="bg-white border border-[#f0f0ee] rounded-2xl p-12 text-center">
            <p className="text-[#9ca3af] text-sm">No budgets set yet.</p>
            <p className="text-[#d1d5db] text-xs mt-1">Click &quot;New budget&quot; to get started.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {budgets.map((b) => (
              <BudgetCard key={b.id} budget={b} onEdit={handleEdit} onDelete={handleDelete} />
            ))}
          </div>
        )}
      </div>

      <BudgetModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
        initial={editing}
        existingCategories={existingCategories}
      />
    </>
  );
}