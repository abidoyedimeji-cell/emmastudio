import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  try {
    // Verify cron secret
    const authHeader = req.headers.get("authorization")
    const cronSecret = process.env.CRON_SECRET

    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const supabase = await createClient()

    const { data, error } = await supabase.rpc("expire_holds_and_requests")

    if (error) {
      console.error("[v0] expire_holds_and_requests error:", error)
      return NextResponse.json(
        { error: "Failed to expire holds" },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      expired: data,
      ran_at: new Date().toISOString(),
    })
  } catch (error) {
    console.error("[v0] Cron expire error:", error)
    return NextResponse.json({ error: "Cron job failed" }, { status: 500 })
  }
}

// Also support GET for Vercel Cron
export async function GET(req: NextRequest) {
  return POST(req)
}
