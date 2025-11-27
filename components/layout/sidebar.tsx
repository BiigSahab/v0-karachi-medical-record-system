"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter, usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { BarChart3, FileText, Users, LogOut, Menu, X, Home, TestTube, TrendingUp } from "lucide-react"

export default function Sidebar() {
  const [open, setOpen] = useState(true)
  const [user, setUser] = useState<any>(null)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (userData) {
      setUser(JSON.parse(userData))
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem("auth_token")
    localStorage.removeItem("user")
    router.push("/login")
  }

  const getRoleMenuItems = (role: string) => {
    const baseItems = [{ label: "Dashboard", href: "/dashboard", icon: Home }]

    const roleSpecificItems: Record<string, any[]> = {
      admin: [
        { label: "User Management", href: "/dashboard/users", icon: Users },
        { label: "All Records", href: "/dashboard/records", icon: FileText },
      ],
      doctor: [
        { label: "My Patients", href: "/dashboard/patients", icon: Users },
        { label: "Create Record", href: "/dashboard/records/new", icon: FileText },
      ],
      patient: [
        { label: "My Records", href: "/dashboard/medical-records", icon: FileText },
        { label: "Lab Results", href: "/dashboard/lab-results", icon: TestTube },
      ],
      lab_technician: [{ label: "Upload Results", href: "/dashboard/upload-results", icon: TestTube }],
      government: [
        { label: "Statistics", href: "/dashboard/statistics", icon: TrendingUp },
        { label: "Health Data", href: "/dashboard/health-data", icon: BarChart3 },
      ],
    }

    return [...baseItems, ...(roleSpecificItems[role] || [])]
  }

  const menuItems = user ? getRoleMenuItems(user.role) : []

  return (
    <>
      <button
        onClick={() => setOpen(!open)}
        className="fixed top-4 left-4 z-50 p-2 hover:bg-muted rounded-md lg:hidden"
      >
        {open ? <X size={20} /> : <Menu size={20} />}
      </button>

      <aside
        className={`fixed left-0 top-0 h-screen bg-sidebar text-sidebar-foreground transition-transform duration-300 z-40 ${
          open ? "translate-x-0" : "-translate-x-full"
        } w-64 lg:translate-x-0`}
      >
        <div className="p-6 border-b border-sidebar-border">
          <h1 className="text-2xl font-bold text-sidebar-foreground">KMRMS</h1>
          <p className="text-xs text-sidebar-accent mt-1">Medical Records</p>
        </div>

        <nav className="p-4 space-y-2 flex-1 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            return (
              <Link key={item.href} href={item.href}>
                <button
                  onClick={() => setOpen(false)}
                  className={`w-full flex items-center gap-3 px-4 py-2 rounded-md text-left text-sm transition-colors ${
                    isActive
                      ? "bg-sidebar-primary text-sidebar-primary-foreground"
                      : "text-sidebar-foreground hover:bg-sidebar-accent/20"
                  }`}
                >
                  <Icon size={18} />
                  {item.label}
                </button>
              </Link>
            )
          })}
        </nav>

        <div className="p-4 border-t border-sidebar-border space-y-2">
          <div className="px-4 py-2 text-sm">
            <p className="text-sidebar-accent text-xs">Logged in as:</p>
            <p className="font-medium text-sidebar-primary">{user?.fullName}</p>
            <p className="text-xs text-sidebar-accent capitalize">{user?.role}</p>
          </div>
          <Button onClick={handleLogout} className="w-full justify-start gap-2 bg-destructive hover:bg-destructive/90">
            <LogOut size={18} />
            Logout
          </Button>
        </div>
      </aside>

      <div className={`lg:ml-64 transition-all duration-300`} />
    </>
  )
}
