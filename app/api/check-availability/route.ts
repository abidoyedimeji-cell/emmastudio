import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  try {
    const { profileType, profileId, date, time, duration } = await req.json()
    const supabase = await createClient()

    const startTime = new Date(`${date}T${time}:00Z`)
    const endTime = new Date(startTime.getTime() + duration * 60 * 60 * 1000)

    const partnerType = profileType === "creator" ? "studio" : "creator"
    const partnerTable = partnerType === "creator" ? "emma_creators" : "emma_studios"

    // Get all active partners
    const { data: allPartners, error: partnersError } = await supabase
      .from(partnerTable)
      .select(
        "id, " +
          (partnerType === "creator"
            ? "display_name, avatar_url, city, creator_type"
            : "name, cover_image, city, studio_type"),
      )
      .eq("is_active", true)

    if (partnersError) throw partnersError

    // Check availability for each partner
    const availablePartners = []
    for (const partner of allPartners || []) {
      const { data: conflicts } = await supabase
        .from("availability_blocks")
        .select("id")
        .eq(partnerType === "creator" ? "creator_id" : "studio_id", partner.id)
        .eq("block_type", "booked")
        .lte("start_time", endTime.toISOString())
        .gte("end_time", startTime.toISOString())

      if (!conflicts || conflicts.length === 0) {
        availablePartners.push(partner)
      }
    }

    return NextResponse.json({ partners: availablePartners })
  } catch (error) {
    console.error("[v0] Check availability error:", error)
    return NextResponse.json({ error: "Failed to check availability" }, { status: 500 })
  }
}
