"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  Building2,
  Users,
  Calendar,
  Clock,
  Settings,
  LogOut,
  ImageIcon,
  Upload,
  DollarSign,
  Star,
  Plus,
  Globe,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/studios", label: "Studios", icon: Building2 },
  { href: "/admin/creators", label: "Creators", icon: Users },
  { href: "/admin/approvals", label: "Approvals", icon: Users },
  { href: "/admin/featured-works", label: "Featured Works", icon: ImageIcon },
  { href: "/admin/bookings", label: "Bookings", icon: Calendar },
  { href: "/admin/availability", label: "Availability", icon: Clock },
  { href: "/admin/import", label: "Import CSV", icon: Upload },
  { href: "/admin/marketplace-bookings", label: "MP Bookings", icon: DollarSign },
  { href: "/admin/packages", label: "Packages", icon: Star },
  { href: "/admin/addons", label: "Add-ons", icon: Plus },
  { href: "/admin/calendar-connections", label: "Calendars", icon: Globe },
  { href: "/admin/settings", label: "Settings", icon: Settings },
]

export function AdminSidebar() {
  const pathname = usePathname()
  const [adminUser, setAdminUser] = useState<{ name: string; email: string } | null>(null)

  useEffect(() => {
    const fetchAdminUser = async () => {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (user) {
        const { data: profile, error } = await supabase
          .from("profiles")
          .select("first_name, email")
          .eq("id", user.id)
          .single()

        if (!error && profile) {
          setAdminUser({
            name: profile.first_name || "Admin",
            email: profile.email || user.email || "",
          })
        }
      }
    }

    fetchAdminUser()
  }, [])

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-sidebar border-r border-sidebar-border">
      <div className="flex flex-col h-full">
        {/* Logo */}
        <div className="p-6 border-b border-sidebar-border">
          <Link href="/admin" className="flex items-center space-x-2">
            <span className="font-serif text-xl font-bold text-sidebar-foreground">EMMA STUDIOS</span>
          </Link>
          <p className="text-xs text-sidebar-foreground/60 mt-1">Admin Dashboard</p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href

            return (
              <Link key={item.href} href={item.href}>
                <div
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-lg transition-colors",
                    isActive
                      ? "bg-sidebar-accent text-sidebar-accent-foreground"
                      : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground",
                  )}
                >
                  <Icon className="h-5 w-5" />
                  <span className="text-sm font-medium">{item.label}</span>
                </div>
              </Link>
            )
          })}
        </nav>

        {/* User Section */}
        <div className="p-4 border-t border-sidebar-border">
          <div className="flex items-center gap-3 px-3 py-2 mb-2">
            <div className="h-8 w-8 rounded-full bg-sidebar-accent flex items-center justify-center">
              <span className="text-sm font-semibold text-sidebar-accent-foreground">
                {adminUser ? getInitials(adminUser.name) : "AD"}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-sidebar-foreground truncate">{adminUser?.name || "Admin User"}</p>
              <p className="text-xs text-sidebar-foreground/60 truncate">{adminUser?.email || "Loading..."}</p>
            </div>
          </div>
          <Link href="/">
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent/50"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Back to Site
            </Button>
          </Link>
        </div>
      </div>
    </aside>
  )
}
