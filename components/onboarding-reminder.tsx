"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { AlertCircle, X } from "lucide-react"

export function OnboardingReminder() {
  const [showReminder, setShowReminder] = useState(false)
  const [role, setRole] = useState<string | null>(null)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const checkOnboarding = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) return

      const { data: profile } = await supabase
        .from("profiles")
        .select("user_role, onboarding_completed")
        .eq("id", user.id)
        .single()

      if (profile && profile.user_role && profile.user_role !== "client" && !profile.onboarding_completed) {
        setRole(profile.user_role)
        setShowReminder(true)
      }
    }

    checkOnboarding()
  }, [supabase])

  if (!showReminder || !role) return null

  return (
    <div className="fixed top-4 right-4 z-50 max-w-sm">
      <div className="bg-amber-50 border-2 border-amber-200 rounded-lg p-4 shadow-lg">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <h3 className="font-semibold text-amber-900 mb-1">Complete Your Profile</h3>
            <p className="text-sm text-amber-800 mb-3">
              Finish setting up your {role} profile to start{" "}
              {role === "creator" ? "receiving bookings" : "listing your space"}.
            </p>
            <Button
              size="sm"
              onClick={() => router.push(`/onboarding/${role}`)}
              className="w-full bg-amber-600 hover:bg-amber-700"
            >
              Continue Setup
            </Button>
          </div>
          <button
            onClick={() => setShowReminder(false)}
            className="text-amber-600 hover:text-amber-800 flex-shrink-0"
            aria-label="Dismiss"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
