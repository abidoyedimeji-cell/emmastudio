"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2 } from "lucide-react"

export function CalendarConnectionForm() {
  const [listingType, setListingType] = useState("studio")
  const [listingId, setListingId] = useState("")
  const [icalUrl, setIcalUrl] = useState("")
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null)

  async function handleSync() {
    setLoading(true)
    setResult(null)
    try {
      const res = await fetch("/api/marketplace/calendar-sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          listing_type: listingType,
          listing_id: listingId,
          ical_url: icalUrl,
          provider: "ical",
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setResult({
        success: true,
        message: `Synced ${data.blocksImported} busy blocks`,
      })
    } catch (err) {
      setResult({ success: false, message: (err as Error).message })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Add Calendar Connection</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div>
          <Label>Listing Type</Label>
          <div className="flex gap-2 mt-1">
            {["studio", "creator"].map((t) => (
              <Button
                key={t}
                variant={listingType === t ? "default" : "outline"}
                size="sm"
                onClick={() => setListingType(t)}
              >
                {t}
              </Button>
            ))}
          </div>
        </div>
        <div>
          <Label>Listing ID</Label>
          <Input
            value={listingId}
            onChange={(e) => setListingId(e.target.value)}
            placeholder="UUID of the studio or creator..."
            className="mt-1"
          />
        </div>
        <div>
          <Label>iCal URL</Label>
          <Input
            value={icalUrl}
            onChange={(e) => setIcalUrl(e.target.value)}
            placeholder="https://calendar.google.com/..."
            className="mt-1"
          />
        </div>
        <Button onClick={handleSync} disabled={loading || !listingId || !icalUrl}>
          {loading && <Loader2 className="w-4 h-4 animate-spin mr-1.5" />}
          Sync Calendar
        </Button>
        {result && (
          <p
            className={`text-sm ${result.success ? "text-green-600" : "text-destructive"}`}
          >
            {result.message}
          </p>
        )}
      </CardContent>
    </Card>
  )
}
