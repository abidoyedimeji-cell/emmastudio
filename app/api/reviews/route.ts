import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET(request: NextRequest) {
  const supabase = await createClient()
  const { searchParams } = new URL(request.url)
  const reviewee_id = searchParams.get("reviewee_id")
  const creator_id = searchParams.get("creator_id")
  const studio_id = searchParams.get("studio_id")

  if (!reviewee_id && !creator_id && !studio_id) {
    return NextResponse.json({ error: "Missing reviewee_id, creator_id, or studio_id" }, { status: 400 })
  }

  let query = supabase
    .from("emma_reviews")
    .select(`
      id,
      rating,
      content,
      title,
      created_at,
      reviewer:reviewer_id (
        first_name,
        avatar_url
      )
    `)
    .order("created_at", { ascending: false })

  if (creator_id) {
    query = query.eq("creator_id", creator_id)
  } else if (studio_id) {
    query = query.eq("studio_id", studio_id)
  } else if (reviewee_id) {
    query = query.or(`creator_id.eq.${reviewee_id},studio_id.eq.${reviewee_id}`)
  }

  const { data, error } = await query

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}

export async function POST(request: NextRequest) {
  const supabase = await createClient()

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const body = await request.json()
  const { booking_id, creator_id, studio_id, rating, content, title } = body

  if (!booking_id || !rating || (!creator_id && !studio_id)) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
  }

  // Verify booking exists and user is the client
  const { data: booking, error: bookingError } = await supabase
    .from("emma_bookings")
    .select("id, status, client_id")
    .eq("id", booking_id)
    .single()

  if (bookingError || !booking) {
    return NextResponse.json({ error: "Booking not found" }, { status: 404 })
  }

  if (booking.client_id !== user.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  if (booking.status !== "completed") {
    return NextResponse.json({ error: "Booking must be completed before leaving a review" }, { status: 400 })
  }

  // Insert review
  const { data: review, error: insertError } = await supabase
    .from("emma_reviews")
    .insert([
      {
        booking_id,
        reviewer_id: user.id,
        creator_id: creator_id || null,
        studio_id: studio_id || null,
        rating,
        content,
        title,
        is_verified: true,
      },
    ])
    .select()
    .single()

  if (insertError) {
    return NextResponse.json({ error: insertError.message }, { status: 500 })
  }

  // Create notification for reviewee
  const revieweeId = creator_id || studio_id
  if (revieweeId) {
    await supabase.from("notifications").insert([
      {
        user_id: revieweeId,
        type: "review",
        title: "New Review",
        message: `You received a ${rating}-star review!`,
        related_entity_id: review.id,
      },
    ])
  }

  return NextResponse.json(review, { status: 201 })
}
