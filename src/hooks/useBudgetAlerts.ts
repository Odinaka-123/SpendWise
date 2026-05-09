"use client";

import { useState, useEffect, useCallback, useTransition } from "react";
import type { BudgetVsActual } from "@/lib/database.types";
import {
  getBudgetVsActual,
  upsertBudget,
  deleteBudget,
} from "@/lib/actions/budgets";

export function useBudgetAlerts(month?: string) {
  const targetMonth = month ?? new Date().toISOString().slice(0, 7);

  const [budgets, setBudgets] = useState<BudgetVsActual[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  // Increment to trigger a manual refetch
  const [tick, setTick] = useState(0);
  const refetch = useCallback(() => setTick((t) => t + 1), []);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getBudgetVsActual(targetMonth);
        if (cancelled) return;
        setBudgets(data as BudgetVsActual[]);
      } catch (e) {
        if (cancelled) return;
        setError(e instanceof Error ? e.message : "Failed to load budgets");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [targetMonth, tick]);

  const upsert = useCallback(
    async (input: { category_id: string; amount: number }) => {
      startTransition(async () => {
        try {
          await upsertBudget({ ...input, month: targetMonth });
          refetch();
        } catch (e) {
          setError(e instanceof Error ? e.message : "Failed to save budget");
        }
      });
    },
    [targetMonth, refetch],
  );

  const remove = useCallback(
    async (id: string) => {
      setBudgets((prev) => prev.filter((b) => b.category_id !== id));
      startTransition(async () => {
        try {
          await deleteBudget(id);
        } catch (e) {
          setError(e instanceof Error ? e.message : "Failed to delete budget");
          refetch();
        }
      });
    },
    [refetch],
  );

  return { budgets, loading, error, isPending, refetch, upsert, remove };
}