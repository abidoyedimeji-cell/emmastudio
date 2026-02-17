"use client"

import { useState } from "react"
import useSWR from "swr"
import Link from "next/link"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Plus, Search, MapPin, Star, MoreVertical, Loader2 } from "lucide-react"

const fetcher = (url: string) => fetch(url).then((r) => r.json())

interface Studio {
  id: string
  name: string
  slug: string
  description: string
  cover_image: string
  location: string
  address: string
  categories: string[]
  hourly_rate: number
  rating: number
  review_count: number
}

export default function StudiosPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const { data: studios = [], isLoading } = useSWR<Studio[]>("/api/studios", fetcher)

  const filteredStudios = studios.filter((studio) =>
    studio.name.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-serif text-3xl font-bold mb-2">Studios</h1>
          <p className="text-muted-foreground">Manage your studio locations and information</p>
        </div>
        <Link href="/admin/studios/new">
          <Button className="bg-accent hover:bg-accent/90">
            <Plus className="h-4 w-4 mr-2" />
            Add Studio
          </Button>
        </Link>
      </div>

      <div className="mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input placeholder="Search studios..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10" />
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredStudios.map((studio) => (
            <Card key={studio.id} className="overflow-hidden hover:shadow-md transition-shadow">
              <div className="relative h-48 w-full">
                <Image src={studio.cover_image || "/placeholder.svg"} alt={studio.name} fill className="object-cover" sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" />
              </div>
              <CardContent className="p-5">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold text-lg text-balance">{studio.name}</h3>
                  <Button variant="ghost" size="icon" className="h-8 w-8 bg-transparent"><MoreVertical className="h-4 w-4" /></Button>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                  <MapPin className="h-4 w-4" /><span>{studio.city}{studio.postcode ? `, ${studio.postcode}` : ""}</span>
                </div>
                <div className="flex items-center gap-1 mb-4">
                  <Star className="h-4 w-4 fill-accent text-accent" />
                  <span className="font-semibold">{studio.rating || "New"}</span>
                  <span className="text-sm text-muted-foreground">({studio.review_count || 0} reviews)</span>
                </div>
                <div className="flex flex-wrap gap-2 mb-4">
                  {(studio.categories || []).map((category) => (<Badge key={category} variant="secondary">{category}</Badge>))}
                </div>
                <div className="flex gap-2">
                  <Link href={`/admin/studios/${studio.id}`} className="flex-1">
                    <Button variant="outline" className="w-full bg-transparent">Edit</Button>
                  </Link>
                  <Link href={`/studio/${studio.slug}`} className="flex-1">
                    <Button variant="outline" className="w-full bg-transparent">View</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
