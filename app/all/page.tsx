"use client"

import { useState, useMemo } from "react"
import useSWR from "swr"
import Link from "next/link"
import Image from "next/image"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, MapPin, Star, Award, Building2, User, Loader2 } from "lucide-react"

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
  amenities: string[]
}

interface Creator {
  id: string
  name: string
  slug: string
  bio: string
  avatar_url: string
  cover_image: string
  specialty: string
  location: string
  hourly_rate: number
  rating: number
  review_count: number
  years_experience: number
  skills: string[]
}

export default function AllPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [studioType, setStudioType] = useState<string>("all")
  const [creatorType, setCreatorType] = useState<string>("all")
  const [location, setLocation] = useState<string>("all")
  const [sortBy, setSortBy] = useState<string>("relevance")

  const { data: studios = [], isLoading: studiosLoading } = useSWR<Studio[]>("/api/studios", fetcher)
  const { data: creators = [], isLoading: creatorsLoading } = useSWR<Creator[]>("/api/creators", fetcher)

  const isLoading = studiosLoading || creatorsLoading

  const allLocations = useMemo(() => {
    const locs = [
      ...studios.map((s) => s.location).filter(Boolean),
      ...creators.map((c) => c.location).filter(Boolean),
    ]
    return Array.from(new Set(locs)).sort()
  }, [studios, creators])

  const studioTypes = useMemo(() => {
    return Array.from(new Set(studios.flatMap((s) => s.categories || []))).sort()
  }, [studios])

  const creatorTypes = useMemo(() => {
    return Array.from(new Set(creators.map((c) => c.specialty).filter(Boolean))).sort()
  }, [creators])

  const filteredStudios = useMemo(() => {
    return studios.filter((studio) => {
      const matchesSearch =
        searchTerm === "" ||
        studio.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (studio.description || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (studio.location || "").toLowerCase().includes(searchTerm.toLowerCase())
      const matchesType = studioType === "all" || (studio.categories && studio.categories.includes(studioType))
      const matchesLocation = location === "all" || studio.location === location
      return matchesSearch && matchesType && matchesLocation
    })
  }, [studios, searchTerm, studioType, location])

  const filteredCreators = useMemo(() => {
    return creators.filter((creator) => {
      const matchesSearch =
        searchTerm === "" ||
        creator.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (creator.bio || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (creator.specialty || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (creator.location || "").toLowerCase().includes(searchTerm.toLowerCase())
      const matchesType = creatorType === "all" || creator.specialty === creatorType
      const matchesLocation = location === "all" || creator.location === location
      return matchesSearch && matchesType && matchesLocation
    })
  }, [creators, searchTerm, creatorType, location])

  const sortedStudios = useMemo(() => {
    const sorted = [...filteredStudios]
    if (sortBy === "price-low") sorted.sort((a, b) => (a.hourly_rate || 0) - (b.hourly_rate || 0))
    else if (sortBy === "rating") sorted.sort((a, b) => (b.rating || 0) - (a.rating || 0))
    return sorted
  }, [filteredStudios, sortBy])

  const sortedCreators = useMemo(() => {
    const sorted = [...filteredCreators]
    if (sortBy === "price-low") sorted.sort((a, b) => (a.hourly_rate || 0) - (b.hourly_rate || 0))
    else if (sortBy === "rating") sorted.sort((a, b) => (b.rating || 0) - (a.rating || 0))
    return sorted
  }, [filteredCreators, sortBy])

  const combinedResults = useMemo(() => {
    const studioItems = sortedStudios.map((studio) => ({
      type: "studio" as const,
      id: studio.id,
      data: studio,
    }))
    const creatorItems = sortedCreators.map((creator) => ({
      type: "creator" as const,
      id: creator.id,
      data: creator,
    }))
    return [...studioItems, ...creatorItems]
  }, [sortedStudios, sortedCreators])

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <section className="bg-secondary/30 py-12 border-b">
          <div className="container max-w-6xl px-6">
            <div className="text-center mb-8">
              <h1 className="text-5xl md:text-6xl font-semibold tracking-tight mb-4 text-balance">All Venues &amp; Creators</h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Discover photography studios, recording spaces, and creative professionals
              </p>
            </div>
            <div className="max-w-3xl mx-auto mb-8">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search by name, keyword, location, or specialty..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-12 h-14 text-base rounded-full border-border/50 bg-background/50 backdrop-blur"
                />
              </div>
            </div>
            <div className="flex flex-wrap gap-3 justify-center">
              <Select value={studioType} onValueChange={setStudioType}>
                <SelectTrigger className="w-[180px] rounded-full"><SelectValue placeholder="Studio Type" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Studio Types</SelectItem>
                  {studioTypes.map((type) => (<SelectItem key={type} value={type}>{type}</SelectItem>))}
                </SelectContent>
              </Select>
              <Select value={creatorType} onValueChange={setCreatorType}>
                <SelectTrigger className="w-[180px] rounded-full"><SelectValue placeholder="Creator Type" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Creator Types</SelectItem>
                  {creatorTypes.map((type) => (<SelectItem key={type} value={type}>{type}</SelectItem>))}
                </SelectContent>
              </Select>
              <Select value={location} onValueChange={setLocation}>
                <SelectTrigger className="w-[180px] rounded-full"><SelectValue placeholder="Location" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Locations</SelectItem>
                  {allLocations.map((loc) => (<SelectItem key={loc} value={loc}>{loc}</SelectItem>))}
                </SelectContent>
              </Select>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[180px] rounded-full"><SelectValue placeholder="Sort By" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="relevance">Relevance</SelectItem>
                  <SelectItem value="rating">Highest Rated</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </section>

        <section className="py-12">
          <div className="container max-w-7xl px-6">
            {isLoading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : (
              <>
                <div className="mb-6 text-muted-foreground">
                  Found {combinedResults.length} results ({sortedStudios.length} studios, {sortedCreators.length} creators)
                </div>
                {combinedResults.length > 0 ? (
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {combinedResults.map((item) => {
                      if (item.type === "studio") {
                        const studio = item.data as Studio
                        return (
                          <Link key={`studio-${studio.id}`} href={`/studio/${studio.slug}`}>
                            <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 h-full border-border/50">
                              <div className="relative w-full aspect-[4/3]">
                                <div className="absolute top-3 left-3 z-10">
                                  <span className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-500 text-white rounded-full text-xs font-medium shadow-lg">
                                    <Building2 className="h-3.5 w-3.5" />Studio
                                  </span>
                                </div>
                                <Image src={studio.cover_image || "/placeholder.svg"} alt={studio.name} fill className="object-cover" sizes="(max-width: 768px) 100vw, 33vw" />
                              </div>
                              <CardContent className="p-6 bg-black text-white">
                                <h3 className="text-xl font-semibold mb-2 tracking-tight">{studio.name}</h3>
                                <div className="flex items-center gap-2 text-sm mb-2">
                                  <span className="px-2 py-1 bg-white/20 text-white rounded-full text-xs font-medium">{studio.categories?.[0] || "Studio"}</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-white/70 mb-4">
                                  <MapPin className="h-4 w-4" /><span>{studio.location}</span>
                                </div>
                                <div className="flex items-center justify-between pt-4 border-t border-white/20">
                                  <div className="flex items-center gap-2">
                                    <Star className="h-4 w-4 fill-white text-white" />
                                    <span className="font-medium">{studio.rating || "New"}</span>
                                    <span className="text-sm text-white/70">({studio.review_count || 0})</span>
                                  </div>
                                  <span className="font-semibold">{studio.hourly_rate ? `From \u00A3${studio.hourly_rate}` : "Contact"}</span>
                                </div>
                              </CardContent>
                            </Card>
                          </Link>
                        )
                      } else {
                        const creator = item.data as Creator
                        return (
                          <Link key={`creator-${creator.id}`} href={`/creator/${creator.id}`}>
                            <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 h-full border-border/50">
                              <div className="relative w-full aspect-[4/3]">
                                <div className="absolute top-3 left-3 z-10">
                                  <span className="flex items-center gap-1.5 px-3 py-1.5 bg-purple-500 text-white rounded-full text-xs font-medium shadow-lg">
                                    <User className="h-3.5 w-3.5" />Creator
                                  </span>
                                </div>
                                <Image src={creator.cover_image || creator.avatar_url || "/placeholder.svg"} alt={creator.name} fill className="object-cover" sizes="(max-width: 768px) 100vw, 33vw" />
                              </div>
                              <CardContent className="p-6 bg-black text-white">
                                <h3 className="text-xl font-semibold mb-2 tracking-tight">{creator.name}</h3>
                                <div className="flex items-center gap-2 text-sm mb-2">
                                  <span className="px-2 py-1 bg-white/20 text-white rounded-full text-xs font-medium">{creator.specialty || "Creative"}</span>
                                  <div className="flex items-center gap-1 text-white/70">
                                    <Award className="h-3 w-3" /><span>{creator.years_experience || 0} years</span>
                                  </div>
                                </div>
                                <p className="text-sm text-white/70 mb-3 line-clamp-2">{creator.bio}</p>
                                {creator.location && (
                                  <div className="flex items-center gap-2 text-sm text-white/70 mb-4">
                                    <MapPin className="h-4 w-4" /><span>{creator.location}</span>
                                  </div>
                                )}
                                <div className="flex items-center justify-between pt-4 border-t border-white/20">
                                  <div className="flex items-center gap-2">
                                    <Star className="h-4 w-4 fill-white text-white" />
                                    <span className="font-medium">{creator.rating || "New"}</span>
                                    <span className="text-sm text-white/70">({creator.review_count || 0})</span>
                                  </div>
                                  <span className="font-semibold">{creator.hourly_rate ? `\u00A3${creator.hourly_rate}/hr` : "Contact"}</span>
                                </div>
                              </CardContent>
                            </Card>
                          </Link>
                        )
                      }
                    })}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground text-lg">No results found. Try adjusting your filters.</p>
                  </div>
                )}
              </>
            )}
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  )
}
