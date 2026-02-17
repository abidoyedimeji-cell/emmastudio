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
    .from("emma_creators")
    .select("id, display_name, slug, creator_type, specialty, skills, years_experience, hourly_rate, half_day_rate, full_day_rate, city, postcode, avatar_url, cover_image, portfolio_images, rating, review_count, completed_bookings, is_featured, is_verified, short_bio, instagram_url, website_url")
    .eq("is_active", true)
    .order("is_featured", { ascending: false })
    .order("rating", { ascending: false })
    .limit(limit)

  if (search) {
    query = query.or(`display_name.ilike.%${search}%,specialty.ilike.%${search}%,city.ilike.%${search}%`)
  }

  if (type !== "all") {
    query = query.eq("creator_type", type)
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
