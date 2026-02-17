import "server-only"
import { createClient } from "@/lib/supabase/server"

export async function getFeaturedWorks(limit = 8) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("emma_featured_works")
    .select("id, image_url, title, category, display_order, creator_id, emma_creators(display_name, slug, avatar_url)")
    .eq("is_active", true)
    .order("display_order", { ascending: true })
    .limit(limit)

  if (error) {
    // Table may not exist yet - return empty array gracefully
    console.warn("Featured works fetch error:", error.message)
    return []
  }
  return data ?? []
}
