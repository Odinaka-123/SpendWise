"use client";

import { useState, useEffect, useCallback, useTransition } from "react";
import type { RecurringWithCategory } from "@/lib/database.types";
import type { RecurringTx } from "@/app/dashboard/recurring/types";
import {
  getRecurring,
  createRecurring,
  updateRecurring,
  deleteRecurring,
  toggleRecurring,
  type CreateRecurringInput,
} from "@/lib/actions/recurring";

// Map the DB shape → UI shape the components expect
function toRecurringTx(r: RecurringWithCategory): RecurringTx {
  return {
    id:        r.id,
    name:      r.name,
    category:  r.category?.name ?? "Other",
    amount:    r.amount,
    type:      r.type,
    frequency: r.frequency as RecurringTx["frequency"],
    nextDate:  r.next_date,
    enabled:   r.is_active,
  };
}

export function useRecurring() {
  const [items, setItems]     = useState<RecurringTx[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [tick, setTick]       = useState(0);

  const refetch = useCallback(() => setTick((t) => t + 1), []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getRecurring();
        if (cancelled) return;
        setItems(data.map(toRecurringTx));
      } catch (e) {
        if (cancelled) return;
        setError(e instanceof Error ? e.message : "Failed to load recurring transactions");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [tick]);

  // ── Create ────────────────────────────────────────────────────────────────

  const create = useCallback(
    async (data: Omit<RecurringTx, "id">) => {
      const input: CreateRecurringInput = {
        name:        data.name,
        amount:      data.amount,
        type:        data.type,
        frequency:   data.frequency,
        next_date:   data.nextDate,
        category_id: null, // resolved server-side by name if needed
      };
      startTransition(async () => {
        try {
          const created = await createRecurring(input);
          setItems((prev) => [...prev, toRecurringTx(created)]);
        } catch (e) {
          setError(e instanceof Error ? e.message : "Failed to create");
          refetch();
        }
      });
    },
    [refetch],
  );

  // ── Update ────────────────────────────────────────────────────────────────

  const update = useCallback(
    async (id: string, data: Omit<RecurringTx, "id">) => {
      // Optimistic
      setItems((prev) =>
        prev.map((t) => (t.id === id ? { ...t, ...data } : t)),
      );
      startTransition(async () => {
        try {
          const updated = await updateRecurring(id, {
            name:      data.name,
            amount:    data.amount,
            type:      data.type,
            frequency: data.frequency,
            next_date: data.nextDate,
            is_active: data.enabled,
          });
          setItems((prev) =>
            prev.map((t) => (t.id === id ? toRecurringTx(updated) : t)),
          );
        } catch (e) {
          setError(e instanceof Error ? e.message : "Failed to update");
          refetch();
        }
      });
    },
    [refetch],
  );

  // ── Toggle active ─────────────────────────────────────────────────────────

  const toggle = useCallback(
    async (id: string) => {
      // Optimistic
      setItems((prev) =>
        prev.map((t) => (t.id === id ? { ...t, enabled: !t.enabled } : t)),
      );
      startTransition(async () => {
        try {
          const current = items.find((t) => t.id === id);
          if (!current) return;
          await toggleRecurring(id, !current.enabled);
        } catch (e) {
          setError(e instanceof Error ? e.message : "Failed to toggle");
          refetch();
        }
      });
    },
    [items, refetch],
  );

  // ── Delete ────────────────────────────────────────────────────────────────

  const remove = useCallback(
    async (id: string) => {
      setItems((prev) => prev.filter((t) => t.id !== id));
      startTransition(async () => {
        try {
          await deleteRecurring(id);
        } catch (e) {
          setError(e instanceof Error ? e.message : "Failed to delete");
          refetch();
        }
      });
    },
    [refetch],
  );

  return { items, loading, error, isPending, refetch, create, update, toggle, remove };
}