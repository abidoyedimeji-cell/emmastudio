import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const { searchParams } = new URL(req.url)
    const cursor = searchParams.get("cursor")
    const limit = parseInt(searchParams.get("limit") || "50", 10)

    const supabase = await createClient()
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Verify membership
    const { data: member } = await supabase
      .from("conversation_members")
      .select("id")
      .eq("conversation_id", id)
      .eq("profile_id", user.id)
      .maybeSingle()

    if (!member) {
      return NextResponse.json({ error: "Not a conversation member" }, { status: 403 })
    }

    let query = supabase
      .from("mp_messages")
      .select(`
        id, body, message_type, sender_id, created_at,
        profiles:sender_id (first_name, avatar_url)
      `)
      .eq("conversation_id", id)
      .order("created_at", { ascending: false })
      .limit(limit)

    if (cursor) {
      query = query.lt("created_at", cursor)
    }

    const { data: messages, error: messagesError } = await query

    if (messagesError) {
      console.error("[v0] Messages fetch error:", messagesError)
      return NextResponse.json({ error: "Failed to fetch messages" }, { status: 500 })
    }

    return NextResponse.json({
      messages: messages?.reverse() || [],
      hasMore: messages?.length === limit,
    })
  } catch (error) {
    console.error("[v0] Messages GET error:", error)
    return NextResponse.json({ error: "Failed to fetch messages" }, { status: 500 })
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const { body: messageBody, message_type } = await req.json()

    const supabase = await createClient()
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Verify membership
    const { data: member } = await supabase
      .from("conversation_members")
      .select("id")
      .eq("conversation_id", id)
      .eq("profile_id", user.id)
      .maybeSingle()

    if (!member) {
      return NextResponse.json({ error: "Not a conversation member" }, { status: 403 })
    }

    const { data: message, error: insertError } = await supabase
      .from("mp_messages")
      .insert({
        conversation_id: id,
        sender_id: user.id,
        body: messageBody,
        message_type: message_type || "text",
      })
      .select(`
        id, body, message_type, sender_id, created_at,
        profiles:sender_id (first_name, avatar_url)
      `)
      .single()

    if (insertError) {
      console.error("[v0] Message insert error:", insertError)
      return NextResponse.json({ error: "Failed to send message" }, { status: 500 })
    }

    // Update conversation last_activity
    await supabase
      .from("mp_conversations")
      .update({ last_activity_at: new Date().toISOString() })
      .eq("id", id)

    return NextResponse.json({ message })
  } catch (error) {
    console.error("[v0] Messages POST error:", error)
    return NextResponse.json({ error: "Failed to send message" }, { status: 500 })
  }
}
