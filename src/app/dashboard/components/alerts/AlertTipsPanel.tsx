"use client";

import { TrendingUp } from "lucide-react";

const TIPS = [
  "Set your alert threshold to 80% — it gives you time to adjust before hitting the cap.",
  "Alerts fire as push notifications when the mobile app is installed.",
  "Budgets reset on the 1st of each month automatically.",
];

export default function AlertTipsPanel() {
  return (
    <div className="bg-white border border-[#f0f0ee] rounded-2xl p-5 space-y-3">
      <div className="flex items-center gap-2">
        <TrendingUp size={13} className="text-[#1D9E75]" />
        <p className="text-sm font-semibold text-[#0a1a14]">Tips</p>
      </div>
      <ul className="space-y-2">
        {TIPS.map((tip) => (
          <li key={tip} className="flex items-start gap-2">
            <span className="w-1 h-1 rounded-full bg-[#1D9E75] mt-1.5 shrink-0" />
            <p className="text-xs text-[#6b7280]">{tip}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
