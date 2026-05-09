"use client";

import { useState, useEffect, useCallback, useTransition } from "react";
import type { ExpenseWithCategory } from "@/lib/database.types";
import {
  getExpenses,
  createExpense,
  updateExpense,
  deleteExpense,
  type ExpenseFilters,
  type CreateExpenseInput,
  type UpdateExpenseInput,
} from "@/lib/actions/expenses";

interface UseExpensesReturn {
  expenses: ExpenseWithCategory[];
  count: number;
  loading: boolean;
  error: string | null;
  isPending: boolean;
  refetch: () => void;
  create: (input: CreateExpenseInput) => Promise<void>;
  update: (input: UpdateExpenseInput) => Promise<void>;
  remove: (id: string) => Promise<void>;
}

export function useExpenses(filters: ExpenseFilters = {}): UseExpensesReturn {
  const [expenses, setExpenses] = useState<ExpenseWithCategory[]>([]);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [tick, setTick] = useState(0);
  const refetch = useCallback(() => setTick((t) => t + 1), []);

  // Stable serialised key — avoids re-fetching on every render when filters
  // object is recreated but its contents haven't changed.
  const filterKey = JSON.stringify(filters);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      setLoading(true);
      setError(null);
      try {
        const { data, count } = await getExpenses(JSON.parse(filterKey));
        if (cancelled) return;
        setExpenses(data as ExpenseWithCategory[]);
        setCount(count);
      } catch (e) {
        if (cancelled) return;
        setError(
          e instanceof Error ? e.message : "Failed to load transactions",
        );
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
    // filterKey is the serialised form of filters — safe to use as dep
  }, [filterKey, tick]);

  const create = useCallback(
    async (input: CreateExpenseInput) => {
      startTransition(async () => {
        try {
          const created = await createExpense(input);
          setExpenses((prev) => [created as ExpenseWithCategory, ...prev]);
          setCount((c) => c + 1);
        } catch (e) {
          setError(e instanceof Error ? e.message : "Failed to create");
          refetch();
        }
      });
    },
    [refetch],
  );

  const update = useCallback(
    async (input: UpdateExpenseInput) => {
      startTransition(async () => {
        // Optimistic
        setExpenses((prev) =>
          prev.map((e) => (e.id === input.id ? { ...e, ...input } : e)),
        );
        try {
          const updated = await updateExpense(input);
          setExpenses((prev) =>
            prev.map((e) =>
              e.id === input.id ? (updated as ExpenseWithCategory) : e,
            ),
          );
        } catch (e) {
          setError(e instanceof Error ? e.message : "Failed to update");
          refetch();
        }
      });
    },
    [refetch],
  );

  const remove = useCallback(
    async (id: string) => {
      setExpenses((prev) => prev.filter((e) => e.id !== id));
      setCount((c) => c - 1);
      startTransition(async () => {
        try {
          await deleteExpense(id);
        } catch (e) {
          setError(e instanceof Error ? e.message : "Failed to delete");
          refetch();
        }
      });
    },
    [refetch],
  );

  return {
    expenses,
    count,
    loading,
    error,
    isPending,
    refetch,
    create,
    update,
    remove,
  };
}