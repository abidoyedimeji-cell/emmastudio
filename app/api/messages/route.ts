import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const searchParams = request.nextUrl.searchParams
    const conversationId = searchParams.get("conversation_id")

    if (!conversationId) {
      return NextResponse.json({ error: "Missing conversation_id parameter" }, { status: 400 })
    }

    const { data: conv, error: convErr } = await supabase
      .from("conversations")
      .select("*")
      .eq("id", conversationId)
      .single()

    if (convErr || !conv) {
      return NextResponse.json({ error: "Conversation not found" }, { status: 404 })
    }

    if (conv.client_id !== user.id && conv.provider_id !== user.id) {
      return NextResponse.json({ error: "Forbidden: Not a conversation participant" }, { status: 403 })
    }

    const { data, error } = await supabase
      .from("messages")
      .select(`
        *,
        sender:profiles!messages_sender_id_fkey(id, first_name, avatar_url)
      `)
      .eq("conversation_id", conversationId)
      .order("created_at", { ascending: true })

    if (error) throw error

    return NextResponse.json(data)
  } catch (error: any) {
    console.error("[v0] Error fetching messages:", error)
    return NextResponse.json({ error: error.message || "Failed to fetch messages" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { conversation_id, message_type, content } = await request.json()

    if (!conversation_id || !message_type || !content) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    if (!["text", "image", "video", "link", "package"].includes(message_type)) {
      return NextResponse.json({ error: "Invalid message_type" }, { status: 400 })
    }

    const { data: conv, error: convErr } = await supabase
      .from("conversations")
      .select("*")
      .eq("id", conversation_id)
      .single()

    if (convErr || !conv) {
      return NextResponse.json({ error: "Conversation not found" }, { status: 404 })
    }

    if (conv.client_id !== user.id && conv.provider_id !== user.id) {
      return NextResponse.json({ error: "Forbidden: Not a conversation participant" }, { status: 403 })
    }

    const { data, error } = await supabase
      .from("messages")
      .insert([{ conversation_id, sender_id: user.id, message_type, content }])
      .select(`
        *,
        sender:profiles!messages_sender_id_fkey(id, first_name, avatar_url)
      `)
      .single()

    if (error) throw error

    // Update conversation last_message_at
    await supabase.from("conversations").update({ last_message_at: new Date().toISOString() }).eq("id", conversation_id)

    return NextResponse.json(data, { status: 201 })
  } catch (error: any) {
    console.error("[v0] Error sending message:", error)
    return NextResponse.json({ error: error.message || "Failed to send message" }, { status: 500 })
  }
}
