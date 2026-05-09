"use client";

import { useState, useEffect, useRef } from "react";
import { Bell } from "lucide-react";
import NotificationDropdown from "./NotificationDropdown";
import { useNotificationsContext } from "@/context/NotificationContext";

export default function NotificationBell() {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const {
    notifications,
    unreadCount,
    mounted,
    markRead,
    markAllRead,
    dismiss,
    clearAll,
  } = useNotificationsContext();

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      )
        setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open]);

  return (
    <div ref={containerRef} className="relative">
      <button
        onClick={() => setOpen((p) => !p)}
        className="relative w-9 h-9 flex items-center justify-center rounded-xl text-[#6b7280] hover:bg-[#f7f6f2] hover:text-[#0a1a14] transition-colors"
        aria-label="Notifications"
        aria-expanded={open}
      >
        <Bell size={17} />
        {/* Only render badge after mount to match SSR output */}
        {mounted && unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#1D9E75] border-2 border-white" />
        )}
      </button>

      {open && (
        <NotificationDropdown
          notifications={notifications}
          onMarkAllRead={markAllRead}
          onDismiss={dismiss}
          onRead={markRead}
          onClearAll={clearAll}
        />
      )}
    </div>
  );
}
