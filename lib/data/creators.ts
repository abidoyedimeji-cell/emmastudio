import "server-only"
import { createClient } from "@/lib/supabase/server"

export async function getCreators({ limit = 24, featured }: { limit?: number; featured?: boolean } = {}) {
  const supabase = await createClient()
  let query = supabase
    .from("emma_creators")
    .select(
      "id, display_name, slug, creator_type, specialty, skills, badges, city, postcode, avatar_url, cover_image, portfolio_images, rating, review_count, years_experience, hourly_rate, half_day_rate, full_day_rate, is_featured, is_verified, completed_bookings, returning_clients, bio, short_bio, instagram_url, website_url, accepts_combined"
    )
    .eq("is_active", true)

  if (featured) {
    query = query.eq("is_featured", true)
  }

  const { data, error } = await query
    .order("is_featured", { ascending: false })
    .order("rating", { ascending: false })
    .limit(limit)

  if (error) throw error
  return data ?? []
}

export async function getCreatorById(id: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("emma_creators")
    .select("*")
    .eq("id", id)
    .maybeSingle()

  if (error) throw error
  return data
}

export async function getCreatorBySlug(slug: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("emma_creators")
    .select("*")
    .eq("slug", slug)
    .maybeSingle()

  if (error) throw error
  return data
}

export async function getCreatorPackages(creatorId: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("emma_packages")
    .select("*")
    .eq("creator_id", creatorId)
    .eq("is_active", true)
    .order("duration_hours", { ascending: true })

  if (error) throw error
  return data ?? []
}

export async function getCreatorCount() {
  const supabase = await createClient()
  const { count, error } = await supabase
    .from("emma_creators")
    .select("id", { count: "exact", head: true })
    .eq("is_active", true)

  if (error) throw error
  return count ?? 0
}
