"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  Receipt,
  Wallet,
  BarChart3,
  ScanLine,
  RefreshCcw,
  Download,
  Bell,
  Settings,
  TrendingUp,
  LogOut,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import { useState } from "react"
import clsx from "clsx"

const mainNav = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/transactions", label: "Transactions", icon: Receipt },
  { href: "/dashboard/budget", label: "Budget", icon: Wallet },
  { href: "/dashboard/analytics", label: "Analytics", icon: BarChart3 },
]

const toolsNav = [
  { href: "/dashboard/scan", label: "Scan Receipt", icon: ScanLine },
  { href: "/dashboard/recurring", label: "Recurring", icon: RefreshCcw },
  { href: "/dashboard/export", label: "Export", icon: Download },
  { href: "/dashboard/alerts", label: "Alerts", icon: Bell, badge: 2 },
]

interface SidebarProps {
  user?: { name: string; email: string; initials: string }
}

export default function Sidebar({ user }: SidebarProps) {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)

  const NavItem = ({
    href,
    label,
    icon: Icon,
    badge,
  }: {
    href: string
    label: string
    icon: React.ElementType
    badge?: number
  }) => {
    const active = pathname === href
    return (
      <Link
        href={href}
        className={clsx(
          "flex items-center gap-3 px-3 py-2 rounded-xl text-sm transition-all duration-150 group relative",
          active
            ? "bg-[#1D9E75]/10 text-[#0F6E56] font-medium"
            : "text-[#6b7280] hover:bg-[#f3f4f6] hover:text-[#0a1a14]"
        )}
      >
        <Icon
          size={17}
          className={clsx(
            "flex-shrink-0 transition-colors",
            active ? "text-[#1D9E75]" : "text-[#9ca3af] group-hover:text-[#0a1a14]"
          )}
        />
        {!collapsed && (
          <span className="truncate">{label}</span>
        )}
        {!collapsed && badge ? (
          <span className="ml-auto w-5 h-5 rounded-full bg-[#D85A30] text-white text-[10px] font-semibold flex items-center justify-center flex-shrink-0">
            {badge}
          </span>
        ) : null}
        {collapsed && badge ? (
          <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#D85A30]" />
        ) : null}
        {/* Tooltip when collapsed */}
        {collapsed && (
          <div className="absolute left-full ml-3 px-2.5 py-1.5 bg-[#0a1a14] text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50 transition-opacity">
            {label}
          </div>
        )}
      </Link>
    )
  }

  return (
    <aside
      className={clsx(
        "flex flex-col bg-white border-r border-[#f0f0ee] transition-all duration-300 flex-shrink-0 relative",
        collapsed ? "w-[60px]" : "w-[220px]"
      )}
    >
      {/* Logo */}
      <div
        className={clsx(
          "flex items-center border-b border-[#f0f0ee] h-[60px] flex-shrink-0",
          collapsed ? "justify-center px-0" : "gap-2.5 px-4"
        )}
      >
        <div className="w-8 h-8 bg-[#1D9E75] rounded-xl flex items-center justify-center flex-shrink-0">
          <TrendingUp size={15} className="text-white" />
        </div>
        {!collapsed && (
          <span className="text-[#0a1a14] text-base font-semibold tracking-tight">
            SpendWise
          </span>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-2 py-3 space-y-0.5">
        {!collapsed && (
          <p className="text-[10px] text-[#9ca3af] uppercase tracking-widest px-3 pb-1.5 pt-1">
            Main
          </p>
        )}
        {mainNav.map((item) => (
          <NavItem key={item.href} {...item} />
        ))}

        <div className={clsx("my-3", collapsed ? "border-t border-[#f0f0ee]" : "")} />

        {!collapsed && (
          <p className="text-[10px] text-[#9ca3af] uppercase tracking-widest px-3 pb-1.5 pt-1">
            Tools
          </p>
        )}
        {toolsNav.map((item) => (
          <NavItem key={item.href} {...item} />
        ))}
      </nav>

      {/* Bottom */}
      <div className="border-t border-[#f0f0ee] p-2 space-y-0.5">
        <NavItem href="/dashboard/settings" label="Settings" icon={Settings} />
        <button
          className={clsx(
            "flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-[#6b7280] hover:bg-red-50 hover:text-red-500 transition-all duration-150 w-full group relative",
            collapsed ? "justify-center" : ""
          )}
        >
          <LogOut size={17} className="flex-shrink-0 text-[#9ca3af] group-hover:text-red-500" />
          {!collapsed && <span>Sign out</span>}
          {collapsed && (
            <div className="absolute left-full ml-3 px-2.5 py-1.5 bg-[#0a1a14] text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50 transition-opacity">
              Sign out
            </div>
          )}
        </button>

        {/* User */}
        {!collapsed && user && (
          <div className="flex items-center gap-2.5 px-3 py-2 mt-1">
            <div className="w-7 h-7 rounded-full bg-[#E1F5EE] flex items-center justify-center text-[#0F6E56] text-xs font-semibold flex-shrink-0">
              {user.initials}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-medium text-[#0a1a14] truncate">{user.name}</p>
              <p className="text-[10px] text-[#9ca3af] truncate">{user.email}</p>
            </div>
          </div>
        )}
      </div>

      {/* Collapse toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-[72px] w-6 h-6 bg-white border border-[#e5e7eb] rounded-full flex items-center justify-center text-[#9ca3af] hover:text-[#0a1a14] hover:border-[#1D9E75] transition-all z-10 shadow-sm"
        aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
      >
        {collapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
      </button>
    </aside>
  )
}
