import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const listingType = searchParams.get("listing_type")
    const listingId = searchParams.get("listing_id")

    if (!listingType || !listingId) {
      return NextResponse.json(
        { error: "listing_type and listing_id required" },
        { status: 400 }
      )
    }

    const supabase = await createClient()

    const { data: addons, error } = await supabase
      .from("addons")
      .select("id, name, description, price, unit, active")
      .eq("listing_type", listingType)
      .eq("listing_id", listingId)
      .eq("active", true)
      .order("name")

    if (error) {
      console.error("[v0] Addons fetch error:", error)
      return NextResponse.json({ error: "Failed to fetch addons" }, { status: 500 })
    }

    return NextResponse.json({ addons: addons || [] })
  } catch (error) {
    console.error("[v0] Addons error:", error)
    return NextResponse.json({ error: "Failed to fetch addons" }, { status: 500 })
  }
}
