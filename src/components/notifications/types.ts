export type NotificationKind =
  | "budget_alert"
  | "recurring"
  | "activity"
  | "summary";

export interface AppNotification {
  id: string;
  kind: NotificationKind;
  title: string;
  body: string;
  timestamp: string; // ISO
  read: boolean;
  /** optional deep-link hint for future routing */
  href?: string;
}

// ─── Seed ─────────────────────────────────────────────────────────────────────
const now = Date.now();
const t = (offset: number) => new Date(now - offset).toISOString();

export const INITIAL_NOTIFICATIONS: AppNotification[] = [
  {
    id: "n1",
    kind: "budget_alert",
    title: "Dining budget at 75%",
    body: "You've spent ₦6,000 of your ₦8,000 Dining limit this month.",
    timestamp: t(1000 * 60 * 8), // 8 min ago
    read: false,
    href: "/dashboard/alerts",
  },
  {
    id: "n2",
    kind: "recurring",
    title: "Rent due in 2 days",
    body: "Your monthly Rent payment of ₦35,000 is scheduled for Jun 1.",
    timestamp: t(1000 * 60 * 45), // 45 min ago
    read: false,
    href: "/dashboard/recurring",
  },
  {
    id: "n3",
    kind: "budget_alert",
    title: "Utility budget exceeded",
    body: "You've gone over your ₦10,000 Utility cap by ₦2,500.",
    timestamp: t(1000 * 60 * 60 * 2), // 2 h ago
    read: false,
    href: "/dashboard/alerts",
  },
  {
    id: "n4",
    kind: "activity",
    title: "CSV export downloaded",
    body: "Your May 2026 transaction export was generated successfully.",
    timestamp: t(1000 * 60 * 60 * 5), // 5 h ago
    read: true,
    href: "/dashboard/reports",
  },
  {
    id: "n5",
    kind: "recurring",
    title: "Netflix charged today",
    body: "A recurring debit of ₦4,600 for Netflix was posted.",
    timestamp: t(1000 * 60 * 60 * 24), // 1 d ago
    read: true,
    href: "/dashboard/recurring",
  },
  {
    id: "n6",
    kind: "summary",
    title: "April spending summary",
    body: "You spent ₦142,300 in April — 12% less than March. Great job!",
    timestamp: t(1000 * 60 * 60 * 24 * 3), // 3 d ago
    read: true,
  },
  {
    id: "n7",
    kind: "activity",
    title: "New login detected",
    body: "Sign-in from Lagos, NG on Chrome · May 5, 2026.",
    timestamp: t(1000 * 60 * 60 * 24 * 4), // 4 d ago
    read: true,
  },
  {
    id: "n8",
    kind: "summary",
    title: "Weekly recap",
    body: "This week you spent ₦23,450 across 9 transactions.",
    timestamp: t(1000 * 60 * 60 * 24 * 6), // 6 d ago
    read: true,
  },
];
