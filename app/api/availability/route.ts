import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const searchParams = request.nextUrl.searchParams

    const userId = searchParams.get("user_id")
    const start = searchParams.get("start")
    const end = searchParams.get("end")

    if (!userId || !start || !end) {
      return NextResponse.json({ error: "Missing required parameters: user_id, start, end" }, { status: 400 })
    }

    const { data, error } = await supabase
      .from("availability_slots")
      .select("*")
      .eq("user_id", userId)
      .gte("end_time", start)
      .lte("start_time", end)
      .order("start_time", { ascending: true })

    if (error) throw error

    return NextResponse.json(data)
  } catch (error: any) {
    console.error("[v0] Error fetching availability:", error)
    return NextResponse.json({ error: error.message || "Failed to fetch availability" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const body = await request.json()

    const { user_id, start_time, end_time, recurring = false, recurring_rule = null } = body

    if (!user_id || !start_time || !end_time) {
      return NextResponse.json({ error: "Missing required fields: user_id, start_time, end_time" }, { status: 400 })
    }

    // Check for overlapping slots
    const { data: overlapping, error: overlapError } = await supabase
      .from("availability_slots")
      .select("*")
      .eq("user_id", user_id)
      .lt("start_time", end_time)
      .gt("end_time", start_time)

    if (overlapError) throw overlapError

    if (overlapping && overlapping.length > 0) {
      return NextResponse.json({ error: "Availability overlaps with existing slots" }, { status: 409 })
    }

    // Insert new availability slot
    const { data, error } = await supabase
      .from("availability_slots")
      .insert([{ user_id, start_time, end_time, recurring, recurring_rule }])
      .select()
      .single()

    if (error) throw error

    return NextResponse.json(data, { status: 201 })
  } catch (error: any) {
    console.error("[v0] Error creating availability:", error)
    return NextResponse.json({ error: error.message || "Failed to create availability" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const supabase = await createClient()
    const searchParams = request.nextUrl.searchParams
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json({ error: "Missing id parameter" }, { status: 400 })
    }

    const { error } = await supabase.from("availability_slots").delete().eq("id", id)

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error("[v0] Error deleting availability:", error)
    return NextResponse.json({ error: error.message || "Failed to delete availability" }, { status: 500 })
  }
}
