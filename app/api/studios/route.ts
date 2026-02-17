import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const supabase = await createClient()
  const { searchParams } = new URL(request.url)

  const search = searchParams.get("search") || ""
  const type = searchParams.get("type") || "all"
  const postcode = searchParams.get("postcode") || ""
  const priceRange = searchParams.get("price") || "all"
  const limit = Number.parseInt(searchParams.get("limit") || "50")

  let query = supabase
    .from("emma_studios")
    .select("id, name, slug, studio_type, city, postcode, size, hourly_rate, half_day_rate, full_day_rate, cover_image, gallery_images, rating, review_count, amenities, equipment, is_featured, is_verified")
    .eq("is_active", true)
    .order("is_featured", { ascending: false })
    .order("rating", { ascending: false })
    .limit(limit)

  if (search) {
    query = query.or(`name.ilike.%${search}%,city.ilike.%${search}%`)
  }

  if (type !== "all") {
    query = query.eq("studio_type", type)
  }

  if (postcode) {
    query = query.ilike("postcode", `%${postcode}%`)
  }

  if (priceRange === "budget") {
    query = query.lt("hourly_rate", 50)
  } else if (priceRange === "mid") {
    query = query.gte("hourly_rate", 50).lt("hourly_rate", 100)
  } else if (priceRange === "premium") {
    query = query.gte("hourly_rate", 100)
  }

  const { data, error } = await query

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data || [])
}
