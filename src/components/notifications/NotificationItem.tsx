"use client";

import { X } from "lucide-react";
import clsx from "clsx";
import type { AppNotification } from "./types";
import NotificationIcon from "./NotificationIcon";

interface NotificationItemProps {
  notification: AppNotification;
  onDismiss: (id: string) => void;
  onRead: (id: string) => void;
}

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60_000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

export default function NotificationItem({
  notification: n,
  onDismiss,
  onRead,
}: NotificationItemProps) {
  return (
    <div
      className={clsx(
        "group flex items-start gap-3 px-4 py-3 transition-colors cursor-pointer",
        n.read ? "hover:bg-[#f7f6f2]" : "bg-[#f7fcf9] hover:bg-[#edf7f3]",
      )}
      onClick={() => !n.read && onRead(n.id)}
    >
      {/* Unread dot */}
      <div className="relative mt-0.5 shrink-0">
        <NotificationIcon kind={n.kind} />
        {!n.read && (
          <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-[#1D9E75] border-2 border-white" />
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <p
            className={clsx(
              "text-xs leading-snug",
              n.read
                ? "font-normal text-[#6b7280]"
                : "font-semibold text-[#0a1a14]",
            )}
          >
            {n.title}
          </p>
          {/* Dismiss button — visible on hover */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDismiss(n.id);
            }}
            className="w-5 h-5 flex items-center justify-center rounded-md text-[#d1d5db] hover:text-[#6b7280] hover:bg-[#e5e7eb] opacity-0 group-hover:opacity-100 transition-all shrink-0"
            aria-label="Dismiss"
          >
            <X size={10} />
          </button>
        </div>
        <p className="text-[11px] text-[#9ca3af] mt-0.5 leading-relaxed line-clamp-2">
          {n.body}
        </p>
        <p className="text-[10px] text-[#d1d5db] mt-1">{timeAgo(n.timestamp)}</p>
      </div>
    </div>
  );
}