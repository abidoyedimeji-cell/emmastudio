"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Check, X, Loader2 } from "lucide-react"

export function AcceptDeclineControls({
  bookingId,
  onAction,
}: {
  bookingId: string
  onAction?: () => void
}) {
  const [loading, setLoading] = useState<"accept" | "decline" | null>(null)
  const [showDeclineReason, setShowDeclineReason] = useState(false)
  const [reason, setReason] = useState("")
  const [error, setError] = useState("")

  async function handleAccept() {
    setLoading("accept")
    setError("")
    try {
      const res = await fetch(`/api/marketplace/bookings/${bookingId}/accept`, {
        method: "POST",
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      onAction?.()
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setLoading(null)
    }
  }

  async function handleDecline() {
    if (!showDeclineReason) {
      setShowDeclineReason(true)
      return
    }

    setLoading("decline")
    setError("")
    try {
      const res = await fetch(`/api/marketplace/bookings/${bookingId}/decline`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reason }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      onAction?.()
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setLoading(null)
    }
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex gap-2">
        <Button
          onClick={handleAccept}
          disabled={loading !== null}
          className="flex-1"
        >
          {loading === "accept" ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Check className="w-4 h-4 mr-1.5" />
          )}
          Accept
        </Button>
        <Button
          variant="destructive"
          onClick={handleDecline}
          disabled={loading !== null}
          className="flex-1"
        >
          {loading === "decline" ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <X className="w-4 h-4 mr-1.5" />
          )}
          Decline
        </Button>
      </div>
      {showDeclineReason && (
        <div className="flex flex-col gap-2">
          <Textarea
            placeholder="Reason for declining (optional)..."
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            rows={2}
          />
          <Button
            variant="destructive"
            size="sm"
            onClick={handleDecline}
            disabled={loading !== null}
          >
            {loading === "decline" && <Loader2 className="w-4 h-4 animate-spin mr-1.5" />}
            Confirm Decline
          </Button>
        </div>
      )}
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  )
}
