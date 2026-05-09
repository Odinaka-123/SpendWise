"use client";

import { NotificationsProvider } from "@/context/NotificationContext";
import { useNotificationSync } from "@/hooks/useNotificationSync";
import Sidebar from "@/components/layout/Sidebar";
import Topbar from "@/components/layout/Topbar";

interface DashboardShellProps {
  user: { name: string; email: string; initials: string };
  children: React.ReactNode;
}

// Inner component so it sits inside NotificationsProvider and can call the hook
function ShellInner({ user, children }: DashboardShellProps) {
  useNotificationSync();

  return (
    <div className="flex h-screen bg-[#f7f6f2] overflow-hidden">
      <Sidebar user={user} />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Topbar title="Dashboard" subtitle="May 2026 · Week 2 of 4" />
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
}

export default function DashboardShell({ user, children }: DashboardShellProps) {
  return (
    <NotificationsProvider>
      <ShellInner user={user}>{children}</ShellInner>
    </NotificationsProvider>
  );
}