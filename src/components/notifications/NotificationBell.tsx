"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { Bell } from "lucide-react";
import type { AppNotification } from "./types";
import { INITIAL_NOTIFICATIONS } from "./types";
import NotificationDropdown from "./NotificationDropdown";

export default function NotificationBell() {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState<AppNotification[]>(
    INITIAL_NOTIFICATIONS,
  );
  const containerRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter((n) => !n.read).length;

  // ── Close on outside click ─────────────────────────────────────────────────
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  // ── Close on Escape ────────────────────────────────────────────────────────
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open]);

  const handleMarkAllRead = useCallback(
    () => setNotifications((prev) => prev.map((n) => ({ ...n, read: true }))),
    [],
  );

  const handleDismiss = useCallback(
    (id: string) => setNotifications((prev) => prev.filter((n) => n.id !== id)),
    [],
  );

  const handleRead = useCallback(
    (id: string) =>
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, read: true } : n)),
      ),
    [],
  );

  const handleClearAll = useCallback(() => setNotifications([]), []);

  return (
    <div ref={containerRef} className="relative">
      {/* Bell button */}
      <button
        onClick={() => setOpen((p) => !p)}
        className="relative w-9 h-9 flex items-center justify-center rounded-xl text-[#6b7280] hover:bg-[#f7f6f2] hover:text-[#0a1a14] transition-colors"
        aria-label="Notifications"
        aria-expanded={open}
      >
        <Bell size={17} />
        {/* Unread badge */}
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#1D9E75] border-2 border-white" />
        )}
      </button>

      {/* Dropdown */}
      {open && (
        <NotificationDropdown
          notifications={notifications}
          onMarkAllRead={handleMarkAllRead}
          onDismiss={handleDismiss}
          onRead={handleRead}
          onClearAll={handleClearAll}
        />
      )}
    </div>
  );
}
