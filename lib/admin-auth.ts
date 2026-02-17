import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"

export async function requireAdmin() {
  const supabase = await createClient()

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  if (userError || !user) {
    console.log("[v0] requireAdmin: No user found, redirecting to login")
    redirect("/login")
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("is_admin, user_role")
    .eq("id", user.id)
    .maybeSingle()

  console.log("[v0] requireAdmin check:", {
    userId: user.id,
    profile,
    profileError,
    isAdmin: profile?.is_admin,
  })

  if (profileError) {
    console.error("[v0] requireAdmin: Profile query error:", profileError)
    redirect("/")
  }

  if (!profile) {
    console.log("[v0] requireAdmin: Profile not found")
    redirect("/")
  }

  if (!profile.is_admin) {
    console.log("[v0] requireAdmin: User is not admin")
    redirect("/")
  }

  console.log("[v0] requireAdmin: Access granted")
  return { user, profile }
}

export async function isAdmin(userId: string): Promise<boolean> {
  const supabase = await createClient()

  const { data: profile } = await supabase.from("profiles").select("is_admin").eq("id", userId).maybeSingle()

  return profile?.is_admin === true
}
