"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { UserMenu } from "@/components/user-menu"

export function SiteHeader() {
  const [isVisible, setIsVisible] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY

      if (currentScrollY > lastScrollY && currentScrollY > 80) {
        // Scrolling down & past threshold - hide header
        setIsVisible(false)
      } else {
        // Scrolling up - show header
        setIsVisible(true)
      }

      setLastScrollY(currentScrollY)
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [lastScrollY])

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 w-full max-w-full border-b border-border/40 bg-background/95 backdrop-blur-xl supports-[backdrop-filter]:bg-background/95 transition-transform duration-300 ${
        isVisible ? "translate-y-0" : "-translate-y-full"
      }`}
    >
      <div className="container flex h-14 items-center justify-between px-4 sm:px-6 max-w-full">
        <div className="flex items-center gap-6 sm:gap-12">
          <Link href="/" className="flex items-center">
            <span className="text-base sm:text-[21px] font-semibold tracking-tight whitespace-nowrap">
              EMMA STUDIOS
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            <Link href="/browse" className="text-[14px] font-normal hover:opacity-80 transition-opacity">
              Browse
            </Link>
            <Link href="/creators" className="text-[14px] font-normal hover:opacity-80 transition-opacity">
              Creators
            </Link>
            <Link href="/how-it-works" className="text-[14px] font-normal hover:opacity-80 transition-opacity">
              How it works
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <UserMenu />
        </div>
      </div>
    </header>
  )
}
