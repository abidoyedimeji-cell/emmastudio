"use client"

import { useEffect, useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Star } from "lucide-react"

type Review = {
  id: string
  rating: number
  content: string
  title: string
  created_at: string
  reviewer: {
    first_name: string
    avatar_url: string
  }
}

type Props = {
  creatorId?: string
  studioId?: string
}

export default function ReviewsList({ creatorId, studioId }: Props) {
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchReviews() {
      const params = new URLSearchParams()
      if (creatorId) params.set("creator_id", creatorId)
      if (studioId) params.set("studio_id", studioId)

      const res = await fetch(`/api/reviews?${params}`)
      const data = await res.json()
      setReviews(data)
      setLoading(false)
    }
    fetchReviews()
  }, [creatorId, studioId])

  if (loading) return <div className="text-center py-8">Loading reviews...</div>
  if (reviews.length === 0) return <div className="text-center py-8 text-muted-foreground">No reviews yet</div>

  const avgRating = reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4 pb-4 border-b">
        <div className="flex items-center gap-2">
          <Star className="w-6 h-6 fill-yellow-400 text-yellow-400" />
          <span className="text-2xl font-bold">{avgRating.toFixed(1)}</span>
        </div>
        <span className="text-muted-foreground">({reviews.length} reviews)</span>
      </div>

      <div className="space-y-6">
        {reviews.map((review) => (
          <div key={review.id} className="space-y-2">
            <div className="flex items-start gap-3">
              <Avatar>
                <AvatarImage src={review.reviewer?.avatar_url || "/placeholder.svg"} />
                <AvatarFallback>{review.reviewer?.first_name?.[0]}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <p className="font-semibold">{review.reviewer?.first_name || "Anonymous"}</p>
                  <div className="flex">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                      />
                    ))}
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">{new Date(review.created_at).toLocaleDateString()}</p>
                {review.title && <p className="font-medium mt-2">{review.title}</p>}
                <p className="text-sm mt-1">{review.content}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
