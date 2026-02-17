import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization")
    const cronSecret = process.env.CRON_SECRET

    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const supabase = await createClient()

    // Fetch all active calendar connections
    const { data: connections, error: connError } = await supabase
      .from("calendar_connections")
      .select("id, listing_type, listing_id, ical_url, provider")
      .eq("active", true)

    if (connError) {
      console.error("[v0] Calendar connections fetch error:", connError)
      return NextResponse.json(
        { error: "Failed to fetch connections" },
        { status: 500 }
      )
    }

    let synced = 0
    let errors = 0

    for (const conn of connections || []) {
      if (!conn.ical_url) continue

      try {
        const response = await fetch(conn.ical_url)
        const icalText = await response.text()
        const busyBlocks = parseIcal(icalText)

        // Delete old external blocks
        await supabase
          .from("calendar_busy_blocks")
          .delete()
          .eq("listing_type", conn.listing_type)
          .eq("listing_id", conn.listing_id)
          .eq("source", "external_ical")

        // Insert new ones
        if (busyBlocks.length > 0) {
          await supabase.from("calendar_busy_blocks").insert(
            busyBlocks.map((b) => ({
              listing_type: conn.listing_type,
              listing_id: conn.listing_id,
              start_ts: b.start_ts,
              end_ts: b.end_ts,
              source: "external_ical",
              source_ref: conn.id,
            }))
          )
        }

        // Update last_synced_at
        await supabase
          .from("calendar_connections")
          .update({ last_synced_at: new Date().toISOString() })
          .eq("id", conn.id)

        synced++
      } catch {
        errors++
      }
    }

    return NextResponse.json({
      success: true,
      synced,
      errors,
      total: connections?.length || 0,
      ran_at: new Date().toISOString(),
    })
  } catch (error) {
    console.error("[v0] Cron calendar sync error:", error)
    return NextResponse.json({ error: "Cron job failed" }, { status: 500 })
  }
}

export async function GET(req: NextRequest) {
  return POST(req)
}

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
      if (start && end) blocks.push({ start_ts: start, end_ts: end })
    }
  }
  return blocks
}

function parseIcalDate(str: string): string | null {
  try {
    return `${str.slice(0, 4)}-${str.slice(4, 6)}-${str.slice(6, 8)}T${str.slice(9, 11) || "00"}:${str.slice(11, 13) || "00"}:${str.slice(13, 15) || "00"}Z`
  } catch {
    return null
  }
}
