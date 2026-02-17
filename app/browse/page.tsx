"use client"

import { useState, useMemo, useRef, useEffect } from "react"
import useSWR from "swr"
import Link from "next/link"
import Image from "next/image"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Star, Search, MapPin, TrendingUp, Loader2 } from "lucide-react"

const fetcher = (url: string) => fetch(url).then((r) => r.json())

function CarouselSection({ title, studios }: { title: string; studios: any[] }) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [isPaused, setIsPaused] = useState(false)

  useEffect(() => {
    if (!scrollRef.current || isPaused || studios.length === 0) return
    const interval = setInterval(() => {
      if (scrollRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current
        if (scrollLeft + clientWidth >= scrollWidth - 10) {
          scrollRef.current.scrollTo({ left: 0, behavior: "smooth" })
        } else {
          scrollRef.current.scrollBy({ left: 320, behavior: "smooth" })
        }
      }
    }, 3000)
    return () => clearInterval(interval)
  }, [isPaused, studios.length])

  if (studios.length === 0) return null

  return (
    <div className="mb-12">
      <h3 className="text-xl font-semibold mb-4 tracking-tight">{title}</h3>
      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto pb-4 scroll-smooth scrollbar-hide"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {studios.map((studio: any) => (
          <Link key={studio.id} href={`/studio/${studio.slug}`} className="flex-shrink-0 w-72">
            <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 border-border/30">
              <div className="relative aspect-[16/10]">
                <Image
                  src={studio.cover_image || "/placeholder.svg"}
                  alt={studio.name}
                  fill
                  className="object-cover"
                  sizes="288px"
                />
              </div>
              <CardContent className="p-4 bg-black text-white">
                <h4 className="font-semibold text-sm mb-1 truncate">{studio.name}</h4>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-white/70">{studio.city || "London"}</span>
                  <div className="flex items-center gap-1">
                    <Star className="h-3 w-3 fill-white text-white" />
                    <span>{studio.rating || "New"}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}

export default function BrowsePage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [studioType, setStudioType] = useState("all")
  const [sortBy, setSortBy] = useState("featured")

  const params = useMemo(() => {
    const p = new URLSearchParams()
    if (searchQuery) p.set("search", searchQuery)
    if (studioType !== "all") p.set("type", studioType)
    return p.toString()
  }, [searchQuery, studioType])

  const { data: studios = [], isLoading } = useSWR<any[]>(
    `/api/studios?${params}`,
    fetcher,
    { keepPreviousData: true }
  )

  const topRated = useMemo(() =>
    [...studios].filter((s) => (s.rating || 0) >= 4.8).slice(0, 5),
    [studios]
  )
  const featured = useMemo(() =>
    studios.filter((s) => s.is_featured).slice(0, 5),
    [studios]
  )
  const mostReviewed = useMemo(() =>
    [...studios].sort((a, b) => (b.review_count || 0) - (a.review_count || 0)).slice(0, 5),
    [studios]
  )

  const sortedStudios = useMemo(() => {
    const sorted = [...studios]
    if (sortBy === "price-low") return sorted.sort((a, b) => (a.hourly_rate || 0) - (b.hourly_rate || 0))
    if (sortBy === "price-high") return sorted.sort((a, b) => (b.hourly_rate || 0) - (a.hourly_rate || 0))
    if (sortBy === "rating") return sorted.sort((a, b) => (b.rating || 0) - (a.rating || 0))
    return sorted
  }, [studios, sortBy])

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <SiteHeader />

      <main className="flex-1">
        {/* Hero */}
        <section className="bg-gradient-to-b from-gray-50 to-white py-8 md:py-12">
          <div className="container max-w-6xl px-6 text-center">
            <h1 className="text-3xl md:text-4xl font-semibold tracking-tight mb-3">Browse Studios</h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Discover professional creative studios for photography, videography, and audio production
            </p>
          </div>
        </section>

        {/* Category Carousels */}
        {studios.length > 0 && (
          <section className="py-12 bg-neutral-50">
            <div className="container max-w-7xl px-6">
              <CarouselSection title="Featured Studios" studios={featured} />
              <CarouselSection title="Top Rated Studios" studios={topRated} />
              <CarouselSection title="Most Reviewed" studios={mostReviewed} />
            </div>
          </section>
        )}

        {/* Search and Filters */}
        <section className="py-10 border-b">
          <div className="container max-w-7xl px-6">
            <div className="flex flex-col lg:flex-row gap-4 items-center">
              <div className="relative flex-1 w-full">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search by name, keyword, or location..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 h-12 rounded-full border-border/50"
                />
              </div>
              <div className="flex flex-wrap gap-3 w-full lg:w-auto">
                <Select value={studioType} onValueChange={setStudioType}>
                  <SelectTrigger className="w-[160px] rounded-full h-12">
                    <SelectValue placeholder="Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="photography">Photography</SelectItem>
                    <SelectItem value="videography">Videography</SelectItem>
                    <SelectItem value="audio">Audio</SelectItem>
                    <SelectItem value="multi-purpose">Multi-Purpose</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-[160px] rounded-full h-12">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="featured">Featured</SelectItem>
                    <SelectItem value="rating">Highest Rated</SelectItem>
                    <SelectItem value="price-low">{"Price: Low to High"}</SelectItem>
                    <SelectItem value="price-high">{"Price: High to Low"}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </section>

        {/* Studios Grid */}
        <section className="py-12">
          <div className="container max-w-7xl px-6">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-semibold tracking-tight">
                All Studios <span className="text-muted-foreground font-normal">({sortedStudios.length})</span>
              </h2>
            </div>

            {isLoading && studios.length === 0 ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : sortedStudios.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-muted-foreground text-lg">No studios found. Try adjusting your filters.</p>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {sortedStudios.map((studio: any) => (
                  <Link key={studio.id} href={`/studio/${studio.slug}`}>
                    <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 h-full flex flex-col border-border/30 group">
                      <div className="relative w-full aspect-[4/3] overflow-hidden">
                        <Image
                          src={studio.cover_image || "/placeholder.svg"}
                          alt={studio.name}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        />
                        {studio.is_featured && (
                          <span className="absolute top-3 right-3 text-xs px-2 py-1 rounded-full bg-white text-black font-medium flex items-center gap-1">
                            <TrendingUp className="h-3.5 w-3.5" /> Featured
                          </span>
                        )}
                      </div>
                      <CardContent className="p-5 flex-1 flex flex-col bg-black text-white">
                        <h3 className="text-lg font-semibold mb-2 tracking-tight">{studio.name}</h3>
                        <div className="flex items-center gap-2 text-xs text-white/70 mb-3">
                          <MapPin className="h-3.5 w-3.5" />
                          <span>{studio.city || "London"}, {studio.postcode}</span>
                        </div>
                        <div className="flex flex-wrap gap-2 mb-auto">
                          <span className="text-xs px-2.5 py-1 rounded-full bg-white/20 text-white font-medium">
                            {studio.studio_type || "Studio"}
                          </span>
                          <span className="text-xs px-2.5 py-1 rounded-full bg-white/10 text-white font-medium">
                            {studio.size || "Standard"}
                          </span>
                        </div>
                        <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/20">
                          <div className="flex items-center gap-1.5">
                            <Star className="h-3.5 w-3.5 fill-white text-white" />
                            <span className="font-semibold text-sm">{studio.rating || "New"}</span>
                            <span className="text-xs text-white/70">({studio.review_count || 0})</span>
                          </div>
                          <span className="text-sm font-semibold">{"\u00A3"}{studio.hourly_rate}/hr</span>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  )
}
