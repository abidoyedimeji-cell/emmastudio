import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const { id } = params
  const supabase = await createClient()

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { data: booking, error } = await supabase
    .from("emma_bookings")
    .select(`
      *,
      creator:emma_creators(id, display_name, avatar_url, creator_type, hourly_rate),
      studio:emma_studios(id, name, cover_image, studio_type, hourly_rate),
      package:emma_packages(id, name, price, duration_hours, includes)
    `)
    .eq("id", id)
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  if (booking.client_id !== user.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  return NextResponse.json({ booking })
}

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const { id } = params
  const supabase = await createClient()

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const body = await request.json()

    const { data: booking, error } = await supabase.from("emma_bookings").update(body).eq("id", id).select().single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ booking })
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 })
  }
}
