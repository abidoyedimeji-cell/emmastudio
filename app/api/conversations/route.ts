import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { client_id, provider_id } = await request.json()

    if (!client_id || !provider_id) {
      return NextResponse.json({ error: "Missing client_id or provider_id" }, { status: 400 })
    }

    if (user.id !== client_id && user.id !== provider_id) {
      return NextResponse.json({ error: "Forbidden: User must be a conversation participant" }, { status: 403 })
    }

    // Check if conversation exists
    const { data: existing, error: fetchError } = await supabase
      .from("conversations")
      .select("*")
      .or(
        `and(client_id.eq.${client_id},provider_id.eq.${provider_id}),and(client_id.eq.${provider_id},provider_id.eq.${client_id})`,
      )
      .limit(1)
      .maybeSingle()

    if (fetchError) throw fetchError

    if (existing) {
      return NextResponse.json(existing)
    }

    // Create new conversation
    const { data, error } = await supabase.from("conversations").insert({ client_id, provider_id }).select().single()

    if (error) throw error

    return NextResponse.json(data, { status: 201 })
  } catch (error: any) {
    console.error("[v0] Error creating conversation:", error)
    return NextResponse.json({ error: error.message || "Failed to create conversation" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { data, error } = await supabase
      .from("conversations")
      .select(`
        *,
        client:profiles!conversations_client_id_fkey(id, first_name, avatar_url),
        provider:profiles!conversations_provider_id_fkey(id, first_name, avatar_url)
      `)
      .or(`client_id.eq.${user.id},provider_id.eq.${user.id}`)
      .order("last_message_at", { ascending: false })

    if (error) throw error

    return NextResponse.json(data)
  } catch (error: any) {
    console.error("[v0] Error fetching conversations:", error)
    return NextResponse.json({ error: error.message || "Failed to fetch conversations" }, { status: 500 })
  }
}
