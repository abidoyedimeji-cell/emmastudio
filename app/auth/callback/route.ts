import { createClient } from "@/lib/supabase/server"
import { NextResponse, type NextRequest } from "next/server"

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get("code")

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (error) {
      console.error("[v0] Auth callback error:", error)
      return NextResponse.redirect(`${requestUrl.origin}/login?error=auth_failed`)
    }

    // Check if user has completed onboarding
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (user) {
      const { data: profile } = await supabase
        .from("emma_profiles")
        .select("role, onboarding_step")
        .eq("id", user.id)
        .single()

      // If no role selected, go to role selection
      if (!profile?.role || profile.role === "client") {
        return NextResponse.redirect(`${requestUrl.origin}/select-role`)
      }

      // If onboarding incomplete, redirect to onboarding
      if (profile.onboarding_step !== "completed") {
        return NextResponse.redirect(`${requestUrl.origin}/onboarding/${profile.role}`)
      }
    }
  }

  // Redirect to homepage for browsing
  return NextResponse.redirect(requestUrl.origin)
}
