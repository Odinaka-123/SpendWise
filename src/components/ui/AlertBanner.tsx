"use client"

import { AlertTriangle, X } from "lucide-react"
import { useState } from "react"

interface AlertBannerProps {
  message: string
  href?: string
  linkLabel?: string
}

export default function AlertBanner({ message, href, linkLabel }: AlertBannerProps) {
  const [dismissed, setDismissed] = useState(false)
  if (dismissed) return null

  return (
    <div className="flex items-center gap-3 bg-[#FAEEDA] border border-[#FAC775] rounded-xl px-4 py-2.5">
      <AlertTriangle size={15} className="text-[#854F0B] flex-shrink-0" />
      <p className="text-[#633806] text-xs flex-1">
        {message}{" "}
        {href && linkLabel && (
          <a href={href} className="underline font-medium hover:text-[#854F0B]">
            {linkLabel}
          </a>
        )}
      </p>
      <button
        onClick={() => setDismissed(true)}
        className="text-[#854F0B]/60 hover:text-[#854F0B] transition-colors flex-shrink-0"
        aria-label="Dismiss"
      >
        <X size={13} />
      </button>
    </div>
  )
}
