import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET() {
  const supabase = await createClient()

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { data: bookings, error } = await supabase
    .from("emma_bookings")
    .select(`
      *,
      creator:emma_creators(id, display_name, avatar_url, creator_type),
      studio:emma_studios(id, name, cover_image, studio_type),
      package:emma_packages(id, name, price, duration_hours)
    `)
    .eq("client_id", user.id)
    .order("booking_date", { ascending: false })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ bookings })
}

export async function POST(request: Request) {
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

    const bookingData = {
      client_id: user.id,
      creator_id: body.creator_id || null,
      studio_id: body.studio_id || null,
      package_id: body.package_id || null,
      booking_date: body.booking_date,
      start_time: body.start_time,
      end_time: body.end_time,
      duration_hours: body.duration_hours,
      total_price: body.total_price,
      deposit_amount: body.total_price * 0.5,
      client_notes: body.client_notes || null,
      status: "pending",
    }

    const { data: booking, error } = await supabase.from("emma_bookings").insert(bookingData).select().single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ booking }, { status: 201 })
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 })
  }
}
