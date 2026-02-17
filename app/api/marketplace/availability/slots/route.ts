import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const listingType = searchParams.get("listing_type")
    const listingId = searchParams.get("listing_id")
    const startDate = searchParams.get("start_date")
    const endDate = searchParams.get("end_date")

    if (!listingType || !listingId) {
      return NextResponse.json(
        { error: "listing_type and listing_id are required" },
        { status: 400 }
      )
    }

    const supabase = await createClient()

    // Compute date range: default to next 14 days
    const from = startDate || new Date().toISOString().split("T")[0]
    const to =
      endDate ||
      new Date(Date.now() + 14 * 86400000).toISOString().split("T")[0]

    // Fetch busy blocks for this listing
    const { data: busyBlocks, error: busyError } = await supabase
      .from("calendar_busy_blocks")
      .select("start_ts, end_ts, source")
      .eq("listing_type", listingType)
      .eq("listing_id", listingId)
      .gte("end_ts", `${from}T00:00:00Z`)
      .lte("start_ts", `${to}T23:59:59Z`)
      .order("start_ts", { ascending: true })

    if (busyError) {
      console.error("[v0] Busy blocks fetch error:", busyError)
      return NextResponse.json(
        { error: "Failed to fetch availability" },
        { status: 500 }
      )
    }

    // Fetch confirmed bookings that block time
    const { data: confirmedBookings, error: bookingsError } = await supabase
      .from("marketplace_bookings")
      .select("requested_date, requested_start, duration_hours")
      .or(`studio_id.eq.${listingId},creator_id.eq.${listingId}`)
      .in("status", ["confirmed", "party_confirmed", "pending_payment"])
      .gte("requested_date", from)
      .lte("requested_date", to)

    if (bookingsError) {
      console.error("[v0] Bookings fetch error:", bookingsError)
    }

    // Generate available slots: 09:00 - 21:00 in 2-hour blocks
    const slots = []
    const currentDate = new Date(from)
    const endDateObj = new Date(to)

    while (currentDate <= endDateObj) {
      const dateStr = currentDate.toISOString().split("T")[0]
      const daySlots = []

      for (let hour = 9; hour < 21; hour += 2) {
        const slotStart = new Date(`${dateStr}T${hour.toString().padStart(2, "0")}:00:00Z`)
        const slotEnd = new Date(`${dateStr}T${(hour + 2).toString().padStart(2, "0")}:00:00Z`)

        // Check if blocked by busy block
        const isBlocked = busyBlocks?.some((block) => {
          const blockStart = new Date(block.start_ts)
          const blockEnd = new Date(block.end_ts)
          return slotStart < blockEnd && slotEnd > blockStart
        })

        // Check if blocked by existing booking
        const isBooked = confirmedBookings?.some((b) => {
          const bStart = new Date(`${b.requested_date}T${b.requested_start}`)
          const bEnd = new Date(bStart.getTime() + b.duration_hours * 3600000)
          return slotStart < bEnd && slotEnd > bStart
        })

        daySlots.push({
          start: slotStart.toISOString(),
          end: slotEnd.toISOString(),
          available: !isBlocked && !isBooked,
        })
      }

      slots.push({ date: dateStr, slots: daySlots })
      currentDate.setDate(currentDate.getDate() + 1)
    }

    return NextResponse.json({ slots })
  } catch (error) {
    console.error("[v0] Availability slots error:", error)
    return NextResponse.json(
      { error: "Failed to compute availability" },
      { status: 500 }
    )
  }
}
