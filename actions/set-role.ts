"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function setUserRole(role: "creator" | "client" | "studio") {
  try {
    const supabase = await createClient()

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (!user || userError) {
      console.error("[v0] Auth error:", userError)
      return { success: false, error: "User not authenticated" }
    }

    const { error } = await supabase.from("profiles").upsert(
      {
        id: user.id,
        user_role: role,
        onboarding_completed: false,
        updated_at: new Date().toISOString(),
      },
      {
        onConflict: "id",
      },
    )

    if (error) {
      console.error("[v0] Role upsert error:", error)
      return { success: false, error: `Failed to set role: ${error.message}` }
    }

    revalidatePath("/")
    return { success: true }
  } catch (error) {
    console.error("[v0] Unexpected error in setUserRole:", error)
    return { success: false, error: "An unexpected error occurred" }
  }
}
