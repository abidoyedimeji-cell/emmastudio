import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

export async function GET() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const results: Record<string, unknown> = {}

  // Check which tables exist
  const tables = [
    "profiles",
    "emma_profiles",
    "emma_studios",
    "emma_creators",
    "emma_packages",
    "emma_services",
    "emma_bookings",
    "availability_blocks",
    "notifications",
    "conversations",
    "messages",
    "marketplace_bookings",
  ]

  for (const table of tables) {
    const { data, error, count } = await supabase
      .from(table)
      .select("*", { count: "exact", head: true })

    results[table] = error
      ? { exists: false, error: error.message }
      : { exists: true, count }
  }

  // If emma_studios exists, try to get actual data
  const { data: studios } = await supabase
    .from("emma_studios")
    .select("id, name, slug")
    .limit(5)

  const { data: creators } = await supabase
    .from("emma_creators")
    .select("id, display_name, slug")
    .limit(5)

  return NextResponse.json({
    tables: results,
    sample_studios: studios,
    sample_creators: creators,
  })
}
