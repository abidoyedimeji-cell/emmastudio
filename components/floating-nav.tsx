"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Users, Building2 } from "lucide-react"

export function FloatingNav() {
  const pathname = usePathname()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Don't render anything until mounted to avoid suspense issues
  if (!mounted) {
    return null
  }

  // Don't show on admin pages
  if (pathname?.startsWith("/admin")) {
    return null
  }

  const navItems = [
    {
      href: "/",
      label: "Home",
      icon: Home,
      isActive: pathname === "/",
    },
    {
      href: "/creators",
      label: "Creators",
      icon: Users,
      isActive: pathname === "/creators" || pathname?.startsWith("/creator/"),
    },
    {
      href: "/browse",
      label: "Studios",
      icon: Building2,
      isActive: pathname === "/browse" || pathname?.startsWith("/studio/"),
    },
  ]

  return (
    <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 md:hidden">
      <div className="flex items-center gap-2 bg-foreground/95 backdrop-blur-xl rounded-full px-2 py-2 shadow-lg border border-border/20">
        {navItems.map((item) => {
          const Icon = item.icon
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center px-5 py-2 rounded-full transition-all ${
                item.isActive ? "bg-background text-foreground" : "text-background/70 hover:text-background"
              }`}
            >
              <Icon className="h-5 w-5" />
              <span className="text-[10px] font-medium mt-0.5">{item.label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
