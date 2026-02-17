import "server-only"
import { createClient } from "@/lib/supabase/server"

export async function getStudios({ limit = 24, featured }: { limit?: number; featured?: boolean } = {}) {
  const supabase = await createClient()
  let query = supabase
    .from("emma_studios")
    .select(
      "id, name, slug, studio_type, description, city, postcode, address, size, hourly_rate, half_day_rate, full_day_rate, cover_image, gallery_images, amenities, equipment, rating, review_count, is_featured, is_verified, categories, supports_combined"
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

export async function getStudioBySlug(slug: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("emma_studios")
    .select("*")
    .eq("slug", slug)
    .maybeSingle()

  if (error) throw error
  return data
}

export async function getStudioPackages(studioId: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("emma_packages")
    .select("*")
    .eq("studio_id", studioId)
    .eq("is_active", true)
    .order("duration_hours", { ascending: true })

  if (error) throw error
  return data ?? []
}

export async function getStudioCount() {
  const supabase = await createClient()
  const { count, error } = await supabase
    .from("emma_studios")
    .select("id", { count: "exact", head: true })
    .eq("is_active", true)

  if (error) throw error
  return count ?? 0
}
