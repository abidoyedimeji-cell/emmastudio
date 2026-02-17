"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Check, X } from "lucide-react"
import { useRouter } from "next/navigation"

type ApprovalItemProps = {
  entity: "emma_creators" | "emma_studios"
  item: any
  type: "creator" | "studio"
}

export default function ApprovalItem({ entity, item, type }: ApprovalItemProps) {
  const [loading, setLoading] = useState(false)
  const [feedback, setFeedback] = useState("")
  const router = useRouter()

  async function handleApproval(status: "approved" | "rejected") {
    setLoading(true)

    try {
      const res = await fetch("/api/admin/approve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          entity,
          entity_id: item.id,
          status,
          feedback: status === "rejected" ? feedback : undefined,
        }),
      })

      if (res.ok) {
        router.refresh()
      } else {
        alert("Failed to update status")
      }
    } catch (error) {
      console.error(error)
      alert("Error updating status")
    } finally {
      setLoading(false)
    }
  }

  const name = type === "creator" ? item.display_name : item.name
  const ownerName = item.profiles?.first_name || "Unknown"
  const email = item.profiles?.email
  const phone = item.profiles?.phone

  return (
    <Card className="p-4">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <h3 className="font-semibold text-lg mb-1">{name || "Unnamed"}</h3>
          <p className="text-sm text-muted-foreground mb-2">Owner: {ownerName}</p>
          {email && <p className="text-sm">Email: {email}</p>}
          {phone && <p className="text-sm">Phone: {phone}</p>}
          {item.bio && <p className="text-sm mt-2">{item.bio.substring(0, 150)}...</p>}

          <div className="mt-4">
            <Textarea
              placeholder="Add feedback (required for rejection)"
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              className="mb-2"
            />
          </div>
        </div>

        <div className="flex gap-2">
          <Button
            onClick={() => handleApproval("approved")}
            disabled={loading}
            size="sm"
            className="bg-green-600 hover:bg-green-700"
          >
            <Check className="h-4 w-4 mr-1" />
            Approve
          </Button>
          <Button
            onClick={() => handleApproval("rejected")}
            disabled={loading || !feedback.trim()}
            size="sm"
            variant="destructive"
          >
            <X className="h-4 w-4 mr-1" />
            Reject
          </Button>
        </div>
      </div>
    </Card>
  )
}
