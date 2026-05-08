"use client";

import { CheckCheck, Trash2 } from "lucide-react";
import type { AppNotification } from "./types";
import NotificationItem from "./NotificationItem";

interface NotificationDropdownProps {
  notifications: AppNotification[];
  onMarkAllRead: () => void;
  onDismiss: (id: string) => void;
  onRead: (id: string) => void;
  onClearAll: () => void;
}

export default function NotificationDropdown({
  notifications,
  onMarkAllRead,
  onDismiss,
  onRead,
  onClearAll,
}: NotificationDropdownProps) {
  const unreadCount = notifications.filter((n) => !n.read).length;
  const isEmpty = notifications.length === 0;

  return (
    <div className="absolute right-0 top-full mt-2 w-[360px] bg-white border border-[#f0f0ee] rounded-2xl shadow-xl overflow-hidden z-50">
      {/* ── Header ── */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-[#f0f0ee]">
        <div className="flex items-center gap-2">
          <p className="text-sm font-semibold text-[#0a1a14]">Notifications</p>
          {unreadCount > 0 && (
            <span className="px-1.5 py-0.5 rounded-full bg-[#1D9E75] text-white text-[10px] font-semibold leading-none">
              {unreadCount}
            </span>
          )}
        </div>

        {!isEmpty && (
          <div className="flex items-center gap-1">
            {unreadCount > 0 && (
              <button
                onClick={onMarkAllRead}
                className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-medium text-[#1D9E75] hover:bg-[#E1F5EE] transition-colors"
              >
                <CheckCheck size={11} />
                Mark all read
              </button>
            )}
            <button
              onClick={onClearAll}
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-medium text-[#9ca3af] hover:bg-[#FBEAF0] hover:text-[#993556] transition-colors"
            >
              <Trash2 size={11} />
              Clear all
            </button>
          </div>
        )}
      </div>

      {/* ── List ── */}
      <div className="max-h-[420px] overflow-y-auto divide-y divide-[#f7f6f2]">
        {isEmpty ?
          <div className="flex flex-col items-center justify-center py-12 gap-2">
            <div className="w-10 h-10 rounded-2xl bg-[#f7f6f2] flex items-center justify-center">
              <CheckCheck size={16} className="text-[#d1d5db]" />
            </div>
            <p className="text-xs font-medium text-[#0a1a14]">All caught up</p>
            <p className="text-[11px] text-[#9ca3af]">
              No notifications right now.
            </p>
          </div>
        : notifications.map((n) => (
            <NotificationItem
              key={n.id}
              notification={n}
              onDismiss={onDismiss}
              onRead={onRead}
            />
          ))
        }
      </div>

      {/* ── Footer ── */}
      {!isEmpty && (
        <div className="px-4 py-2.5 border-t border-[#f0f0ee] bg-[#f7f6f2]">
          <p className="text-[10px] text-[#d1d5db] text-center">
            {notifications.length} notification
            {notifications.length !== 1 ? "s" : ""}
            {unreadCount > 0 ? ` · ${unreadCount} unread` : " · all read"}
          </p>
        </div>
      )}
    </div>
  );
}
