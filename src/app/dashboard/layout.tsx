import Sidebar from "@/components/layout/Sidebar"
import Topbar from "@/components/layout/Topbar"

const mockUser = {
  name: "Adaeze Obi",
  email: "adaeze@email.com",
  initials: "AO",
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex h-screen bg-[#f7f6f2] overflow-hidden">
      <Sidebar user={mockUser} />

      <div className="flex flex-col flex-1 overflow-hidden">
        <Topbar
          title="Dashboard"
          subtitle="May 2026 · Week 2 of 4"
        />
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
