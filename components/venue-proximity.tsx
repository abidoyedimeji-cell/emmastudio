"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Heart } from "lucide-react"

type Venue = {
  id: string
  name: string
  address?: string
  city?: string
  category?: string
  image_url?: string
  rating?: number
  price_range?: number
  distance_meters?: number
}

export default function VenueProximity({ userId }: { userId: string }) {
  const [venues, setVenues] = useState<Venue[]>([])
  const [favorites, setFavorites] = useState<Set<string>>(new Set())
  const [loading, setLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => fetchVenues(pos.coords.latitude, pos.coords.longitude),
        () => fetchVenues(0, 0), // Fallback to default
      )
    } else {
      fetchVenues(0, 0)
    }
  }, [])

  async function fetchVenues(lat: number, lon: number) {
    setLoading(true)
    const res = await fetch(`/api/venues/closest?lat=${lat}&lon=${lon}&limit=10`)
    const data: Venue[] = await res.json()
    setVenues(data)
    setLoading(false)
  }

  async function toggleFavorite(venueId: string) {
    const isFav = favorites.has(venueId)

    // Optimistic update
    setFavorites((prev) => {
      const newSet = new Set(prev)
      if (isFav) newSet.delete(venueId)
      else newSet.add(venueId)
      return newSet
    })

    await fetch("/api/venues/favorites", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ venue_id: venueId, user_id: userId, favorite: !isFav }),
    })
  }

  const filteredVenues = venues.filter((venue) => {
    const matchesSearch =
      venue.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      venue.city?.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = !selectedCategory || venue.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const categories = [...new Set(venues.map((v) => v.category).filter(Boolean))]

  if (loading) return <div className="text-center py-8">Loading nearby venues...</div>

  return (
    <div className="space-y-4">
      <h3 className="text-2xl font-semibold">Nearby Venues</h3>

      <div className="flex gap-4 flex-wrap items-center">
        <Input
          placeholder="Search venues by name or city..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-md"
        />

        <div className="flex gap-2">
          <Button
            variant={selectedCategory === null ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedCategory(null)}
          >
            All
          </Button>
          {categories.map((cat) => (
            <Button
              key={cat}
              variant={selectedCategory === cat ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(cat as string)}
            >
              {cat}
            </Button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredVenues.map((venue) => (
          <Card key={venue.id} className="overflow-hidden hover:shadow-lg transition-shadow">
            {venue.image_url && (
              <img src={venue.image_url || "/placeholder.svg"} alt={venue.name} className="w-full h-48 object-cover" />
            )}
            <div className="p-4">
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-semibold text-lg">{venue.name}</h4>
                <Button variant="ghost" size="sm" onClick={() => toggleFavorite(venue.id)}>
                  <Heart className={favorites.has(venue.id) ? "fill-red-500 text-red-500" : ""} />
                </Button>
              </div>
              <p className="text-sm text-muted-foreground">
                {venue.address}, {venue.city}
              </p>
              {venue.distance_meters && (
                <p className="text-sm text-primary mt-2">≈ {(venue.distance_meters / 1000).toFixed(2)} km away</p>
              )}
              {venue.rating && <p className="text-sm mt-2">⭐ {venue.rating}/5</p>}
            </div>
          </Card>
        ))}
      </div>

      {filteredVenues.length === 0 && (
        <p className="text-center text-muted-foreground py-8">
          {searchQuery || selectedCategory ? "No venues found matching your filters" : "No venues available"}
        </p>
      )}
    </div>
  )
}
