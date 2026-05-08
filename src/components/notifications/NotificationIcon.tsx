"use client";

import { Bell, RefreshCw, Activity, BarChart2 } from "lucide-react";
import type { NotificationKind } from "./types";

interface NotificationIconProps {
  kind: NotificationKind;
}

const KIND_META: Record<
  NotificationKind,
  { Icon: React.ElementType; bg: string; text: string }
> = {
  budget_alert: {
    Icon: Bell,
    bg: "bg-[#FEF3C7]",
    text: "text-[#92400E]",
  },
  recurring: {
    Icon: RefreshCw,
    bg: "bg-[#E6F1FB]",
    text: "text-[#185FA5]",
  },
  activity: {
    Icon: Activity,
    bg: "bg-[#F1EFE8]",
    text: "text-[#5F5E5A]",
  },
  summary: {
    Icon: BarChart2,
    bg: "bg-[#E1F5EE]",
    text: "text-[#0F6E56]",
  },
};

export default function NotificationIcon({ kind }: NotificationIconProps) {
  const { Icon, bg, text } = KIND_META[kind];
  return (
    <div
      className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${bg}`}
    >
      <Icon size={13} className={text} />
    </div>
  );
}