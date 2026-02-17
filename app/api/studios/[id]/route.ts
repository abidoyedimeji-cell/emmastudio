import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const { id } = params
  const supabase = await createClient()

  const { data: studio, error } = await supabase
    .from("emma_studios")
    .select(`
      *,
      packages:emma_packages(*),
      faqs:emma_faqs(*),
      reviews:emma_reviews(*, reviewer:emma_profiles(full_name, avatar_url))
    `)
    .eq("id", id)
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ studio })
}
