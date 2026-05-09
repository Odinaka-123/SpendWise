"use client";

import { useEffect } from "react";
import { useBudgetAlerts } from "@/hooks/useBudgetAlerts";
import { useRecurring } from "@/hooks/useRecurring";
import { useNotificationsContext } from "@/context/NotificationContext";
import { daysUntil } from "@/app/dashboard/recurring/types";

/**
 * Drop this into DashboardShell (or any always-mounted client component).
 * It watches real data and pushes notifications when thresholds are hit.
 * Deduped by stable keys so re-renders never create duplicates.
 */
export function useNotificationSync() {
  const { push } = useNotificationsContext();
  const currentMonth = new Date().toISOString().slice(0, 7);

  const { budgets } = useBudgetAlerts(currentMonth);
  const { items: recurring } = useRecurring();

  // ── Budget alerts ──────────────────────────────────────────────────────────
  useEffect(() => {
    for (const b of budgets) {
      const pct  = b.percentage_used ?? 0;
      const name = b.category_name ?? b.category_id;

      if (pct >= 100) {
        push(
          {
            kind:  "budget_alert",
            title: `${name} budget exceeded`,
            body:  `You've gone over your ₦${b.budget_amount.toLocaleString()} ${name} limit by ₦${Math.abs(b.remaining).toLocaleString()}.`,
            href:  "/dashboard/budget",
          },
          // dedupeKey: stable per category per month — resets if dismissed
          `budget_exceeded_${b.category_id}_${currentMonth}`,
        );
      } else if (pct >= 80) {
        push(
          {
            kind:  "budget_alert",
            title: `${name} budget at ${Math.round(pct)}%`,
            body:  `You've spent ₦${b.actual_spent.toLocaleString()} of your ₦${b.budget_amount.toLocaleString()} ${name} limit. ₦${b.remaining.toLocaleString()} remaining.`,
            href:  "/dashboard/budget",
          },
          `budget_warn_${b.category_id}_${currentMonth}`,
        );
      }
    }
  }, [budgets, currentMonth, push]);

  // ── Recurring upcoming alerts (due within 3 days) ─────────────────────────
  useEffect(() => {
    for (const t of recurring) {
      if (!t.enabled) continue;
      const days = daysUntil(t.nextDate);
      if (days < 0 || days > 3) continue;

      const when =
        days === 0 ? "today"
        : days === 1 ? "tomorrow"
        : `in ${days} days`;

      push(
        {
          kind:  "recurring",
          title: `${t.name} due ${when}`,
          body:  `Your ${t.frequency} ${t.type === "debit" ? "payment" : "income"} of ₦${t.amount.toLocaleString()} is scheduled for ${t.nextDate}.`,
          href:  "/dashboard/recurring",
        },
        `recurring_due_${t.id}_${t.nextDate}`,
      );
    }
  }, [recurring, push]);
}