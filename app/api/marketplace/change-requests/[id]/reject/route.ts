import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const supabase = await createClient()
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { data, error } = await supabase.rpc("reject_change", {
      p_change_id: id,
    })

    if (error) {
      console.error("[v0] reject_change RPC error:", error)
      return NextResponse.json(
        { error: error.message || "Failed to reject change" },
        { status: 400 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Reject change error:", error)
    return NextResponse.json({ error: "Failed to reject change" }, { status: 500 })
  }
}
