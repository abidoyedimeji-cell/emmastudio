import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const type = searchParams.get("type")
    const id = searchParams.get("id")
    const studioId = searchParams.get("studio_id")
    const creatorId = searchParams.get("creator_id")

    const supabase = await createClient()

    let query = supabase
      .from("emma_packages")
      .select("*")
      .eq("is_active", true)
      .order("price", { ascending: true })

    if (studioId) {
      query = query.eq("studio_id", studioId)
    } else if (creatorId) {
      query = query.eq("creator_id", creatorId)
    } else if (type && id) {
      query = query.eq(type === "creator" ? "creator_id" : "studio_id", id)
    } else {
      return NextResponse.json([], { status: 200 })
    }

    const { data: packages, error } = await query

    if (error) throw error

    return NextResponse.json(packages || [])
  } catch (error) {
    console.error("[v0] Fetch packages error:", error)
    return NextResponse.json({ error: "Failed to fetch packages" }, { status: 500 })
  }
}
