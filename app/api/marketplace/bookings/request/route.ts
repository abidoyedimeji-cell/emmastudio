import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const {
      listing_type,
      studio_id,
      creator_id,
      package_id,
      addon_ids,
      requested_date,
      requested_start,
      duration_hours,
      customer_note,
    } = body

    const supabase = await createClient()
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Call the RPC to create the booking request
    const { data, error } = await supabase.rpc("create_request_booking", {
      p_customer_id: user.id,
      p_listing_type: listing_type,
      p_studio_id: studio_id || null,
      p_creator_id: creator_id || null,
      p_package_id: package_id,
      p_addon_ids: addon_ids || [],
      p_requested_date: requested_date,
      p_requested_start: requested_start,
      p_duration_hours: duration_hours,
      p_customer_note: customer_note || "",
    })

    if (error) {
      console.error("[v0] create_request_booking RPC error:", error)
      return NextResponse.json(
        { error: error.message || "Failed to create booking request" },
        { status: 400 }
      )
    }

    return NextResponse.json({ success: true, bookingId: data })
  } catch (error) {
    console.error("[v0] Booking request error:", error)
    return NextResponse.json(
      { error: "Failed to create booking request" },
      { status: 500 }
    )
  }
}
