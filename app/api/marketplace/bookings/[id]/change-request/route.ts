import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const { field_changed, old_value, new_value, reason } = await req.json()
    const supabase = await createClient()
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { data, error } = await supabase.rpc("propose_change", {
      p_booking_id: id,
      p_field_changed: field_changed,
      p_old_value: old_value,
      p_new_value: new_value,
      p_reason: reason || "",
    })

    if (error) {
      console.error("[v0] propose_change RPC error:", error)
      return NextResponse.json(
        { error: error.message || "Failed to propose change" },
        { status: 400 }
      )
    }

    return NextResponse.json({ success: true, changeRequestId: data })
  } catch (error) {
    console.error("[v0] Change request error:", error)
    return NextResponse.json(
      { error: "Failed to create change request" },
      { status: 500 }
    )
  }
}
