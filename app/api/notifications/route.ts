import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET(request: NextRequest) {
  const supabase = await createClient()

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { data, error } = await supabase
    .from("notifications")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(50)

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
  const { notification_id } = body

  if (!notification_id) {
    return NextResponse.json({ error: "Missing notification_id" }, { status: 400 })
  }

  // Verify notification belongs to user
  const { data: notif, error: notifErr } = await supabase
    .from("notifications")
    .select("id, user_id")
    .eq("id", notification_id)
    .single()

  if (notifErr || !notif) {
    return NextResponse.json({ error: "Notification not found" }, { status: 404 })
  }

  if (notif.user_id !== user.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  // Mark as read
  const { error } = await supabase.from("notifications").update({ is_read: true }).eq("id", notification_id)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
