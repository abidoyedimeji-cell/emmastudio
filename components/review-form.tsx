"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Star } from "lucide-react"

type Props = {
  bookingId: string
  creatorId?: string
  studioId?: string
  onReviewSubmitted: () => void
}

export default function ReviewForm({ bookingId, creatorId, studioId, onReviewSubmitted }: Props) {
  const [rating, setRating] = useState(0)
  const [hoveredRating, setHoveredRating] = useState(0)
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [submitting, setSubmitting] = useState(false)

  async function submitReview() {
    if (rating === 0) {
      alert("Please select a rating")
      return
    }

    setSubmitting(true)

    const res = await fetch("/api/reviews", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        booking_id: bookingId,
        creator_id: creatorId,
        studio_id: studioId,
        rating,
        title,
        content,
      }),
    })

    if (res.ok) {
      setRating(0)
      setTitle("")
      setContent("")
      onReviewSubmitted()
    } else {
      const error = await res.json()
      alert(error.error || "Failed to submit review")
    }

    setSubmitting(false)
  }

  return (
    <div className="space-y-4">
      <div>
        <Label>Rating</Label>
        <div className="flex gap-1 mt-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              onMouseEnter={() => setHoveredRating(star)}
              onMouseLeave={() => setHoveredRating(0)}
              className="focus:outline-none"
              disabled={submitting}
            >
              <Star
                className={`w-8 h-8 ${
                  star <= (hoveredRating || rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                }`}
              />
            </button>
          ))}
        </div>
      </div>

      <div>
        <Label htmlFor="title">Review Title (Optional)</Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Sum up your experience"
          disabled={submitting}
        />
      </div>

      <div>
        <Label htmlFor="content">Your Review</Label>
        <Textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Share details of your experience..."
          rows={4}
          disabled={submitting}
        />
      </div>

      <Button onClick={submitReview} disabled={submitting || rating === 0}>
        {submitting ? "Submitting..." : "Submit Review"}
      </Button>
    </div>
  )
}
