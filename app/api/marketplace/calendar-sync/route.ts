import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  try {
    const { listing_type, listing_id, ical_url, provider } = await req.json()

    const supabase = await createClient()
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Upsert calendar connection
    const { data: connection, error: connError } = await supabase
      .from("calendar_connections")
      .upsert(
        {
          listing_type,
          listing_id,
          provider: provider || "ical",
          ical_url,
          last_synced_at: new Date().toISOString(),
        },
        { onConflict: "listing_type,listing_id,provider" }
      )
      .select()
      .single()

    if (connError) {
      console.error("[v0] Calendar connection error:", connError)
      return NextResponse.json(
        { error: "Failed to save calendar connection" },
        { status: 500 }
      )
    }

    // Fetch and parse iCal
    let busyBlocks: { start_ts: string; end_ts: string }[] = []
    try {
      const icalResponse = await fetch(ical_url)
      const icalText = await icalResponse.text()
      busyBlocks = parseIcal(icalText)
    } catch (fetchError) {
      console.error("[v0] iCal fetch error:", fetchError)
      return NextResponse.json(
        { error: "Failed to fetch iCal URL" },
        { status: 400 }
      )
    }

    // Delete old external blocks for this listing
    await supabase
      .from("calendar_busy_blocks")
      .delete()
      .eq("listing_type", listing_type)
      .eq("listing_id", listing_id)
      .eq("source", "external_ical")

    // Insert new blocks
    if (busyBlocks.length > 0) {
      const blocks = busyBlocks.map((block) => ({
        listing_type,
        listing_id,
        start_ts: block.start_ts,
        end_ts: block.end_ts,
        source: "external_ical",
        source_ref: connection.id,
      }))

      const { error: insertError } = await supabase
        .from("calendar_busy_blocks")
        .insert(blocks)

      if (insertError) {
        console.error("[v0] Busy blocks insert error:", insertError)
      }
    }

    return NextResponse.json({
      success: true,
      connectionId: connection.id,
      blocksImported: busyBlocks.length,
    })
  } catch (error) {
    console.error("[v0] Calendar sync error:", error)
    return NextResponse.json(
      { error: "Failed to sync calendar" },
      { status: 500 }
    )
  }
}

// Simple iCal parser for VEVENT blocks
function parseIcal(text: string) {
  const blocks: { start_ts: string; end_ts: string }[] = []
  const events = text.split("BEGIN:VEVENT")

  for (let i = 1; i < events.length; i++) {
    const event = events[i]
    const dtstart = event.match(/DTSTART[^:]*:(\d{8}T\d{6}Z?)/)?.[1]
    const dtend = event.match(/DTEND[^:]*:(\d{8}T\d{6}Z?)/)?.[1]

    if (dtstart && dtend) {
      const start = parseIcalDate(dtstart)
      const end = parseIcalDate(dtend)
      if (start && end) {
        blocks.push({ start_ts: start, end_ts: end })
      }
    }
  }

  return blocks
}

function parseIcalDate(str: string): string | null {
  try {
    const year = str.slice(0, 4)
    const month = str.slice(4, 6)
    const day = str.slice(6, 8)
    const hour = str.slice(9, 11) || "00"
    const min = str.slice(11, 13) || "00"
    const sec = str.slice(13, 15) || "00"
    return `${year}-${month}-${day}T${hour}:${min}:${sec}Z`
  } catch {
    return null
  }
}
