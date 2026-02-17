"use client"

import { useState } from "react"
import useSWR from "swr"
import Link from "next/link"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Plus, Search, Star, Loader2 } from "lucide-react"

const fetcher = (url: string) => fetch(url).then((r) => r.json())

interface Creator {
  id: string
  name: string
  slug: string
  bio: string
  avatar_url: string
  specialty: string
  location: string
  hourly_rate: number
  rating: number
  review_count: number
  years_experience: number
  skills: string[]
  is_active: boolean
}

export default function CreatorsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const { data: creators = [], isLoading } = useSWR<Creator[]>("/api/creators", fetcher)

  const filteredCreators = creators.filter((creator) =>
    creator.name.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-serif text-3xl font-bold mb-2">Creators</h1>
          <p className="text-muted-foreground">Manage creative professionals and their profiles</p>
        </div>
        <Link href="/admin/creators/new">
          <Button className="bg-accent hover:bg-accent/90"><Plus className="h-4 w-4 mr-2" />Add Creator</Button>
        </Link>
      </div>

      <div className="mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input placeholder="Search creators..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10" />
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCreators.map((creator) => (
            <Card key={creator.id}>
              <CardContent className="p-6">
                <div className="flex items-start gap-4 mb-4">
                  <div className="relative h-16 w-16 rounded-full overflow-hidden bg-secondary flex items-center justify-center">
                    {creator.avatar_url ? (
                      <Image src={creator.avatar_url} alt={creator.name} fill className="object-cover" />
                    ) : (
                      <span className="text-2xl font-semibold">{creator.name.charAt(0)}</span>
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg mb-1">{creator.name}</h3>
                    <p className="text-sm text-muted-foreground mb-1">{creator.specialty}</p>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-accent text-accent" />
                      <span className="font-semibold text-sm">{creator.rating || "New"}</span>
                      <span className="text-sm text-muted-foreground">({creator.review_count || 0})</span>
                    </div>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mb-4 line-clamp-2 leading-relaxed">{creator.bio}</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {(creator.skills || []).slice(0, 3).map((skill) => (<Badge key={skill} variant="secondary">{skill}</Badge>))}
                </div>
                <div className="flex items-center gap-2 mb-4">
                  <Badge variant={creator.is_active !== false ? "default" : "secondary"}>
                    {creator.is_active !== false ? "Active" : "Inactive"}
                  </Badge>
                  <span className="text-xs text-muted-foreground">{creator.years_experience || 0} years exp.</span>
                </div>
                <div className="flex gap-2">
                  <Link href={`/admin/creators/${creator.id}`} className="flex-1">
                    <Button variant="outline" className="w-full bg-transparent">Edit</Button>
                  </Link>
                  <Link href={`/creator/${creator.id}`} className="flex-1">
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
