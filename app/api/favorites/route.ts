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

  const { data: favorites, error } = await supabase
    .from("emma_favorites")
    .select(`
      *,
      creator:emma_creators(id, display_name, avatar_url, creator_type, specialty, rating),
      studio:emma_studios(id, name, cover_image, studio_type, rating)
    `)
    .eq("user_id", user.id)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ favorites })
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

    const favoriteData = {
      user_id: user.id,
      creator_id: body.creator_id || null,
      studio_id: body.studio_id || null,
    }

    const { data: favorite, error } = await supabase.from("emma_favorites").insert(favoriteData).select().single()

    if (error) {
      if (error.code === "23505") {
        return NextResponse.json({ error: "Already favorited" }, { status: 409 })
      }
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ favorite }, { status: 201 })
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 })
  }
}

export async function DELETE(request: Request) {
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

    let query = supabase.from("emma_favorites").delete().eq("user_id", user.id)

    if (body.creator_id) {
      query = query.eq("creator_id", body.creator_id)
    } else if (body.studio_id) {
      query = query.eq("studio_id", body.studio_id)
    } else {
      return NextResponse.json({ error: "creator_id or studio_id required" }, { status: 400 })
    }

    const { error } = await query

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 })
  }
}
