"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Loader2 } from "lucide-react"

interface AuthGuardProps {
  children: React.ReactNode
  requireRole?: "creator" | "studio" | "client"
  requireOnboarding?: boolean
}

export function AuthGuard({ children, requireRole, requireOnboarding = false }: AuthGuardProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthorized, setIsAuthorized] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const checkAuth = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        router.push("/login")
        return
      }

      const { data: profile } = await supabase
        .from("emma_profiles")
        .select("role, onboarding_step")
        .eq("id", user.id)
        .single()

      // Check role requirement
      if (requireRole && profile?.role !== requireRole) {
        router.push("/")
        return
      }

      // Check onboarding requirement
      if (requireOnboarding && profile?.onboarding_step !== "completed") {
        router.push(`/onboarding/${profile?.role || "client"}`)
        return
      }

      setIsAuthorized(true)
      setIsLoading(false)
    }

    checkAuth()
  }, [router, supabase, requireRole, requireOnboarding])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!isAuthorized) {
    return null
  }

  return <>{children}</>
}
