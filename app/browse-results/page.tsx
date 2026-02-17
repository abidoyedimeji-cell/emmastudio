"use client"

import { Suspense, useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { BookingSearchBar, type SearchParams } from "@/components/booking-search-bar"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { createClient } from "@/lib/supabase/client"
import Image from "next/image"
import Link from "next/link"
import { Star, MapPin, Loader2 } from "lucide-react"
import { format } from "date-fns"

export default function BrowseResultsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>}>
      <BrowseResultsContent />
    </Suspense>
  )
}

function BrowseResultsContent() {
  const searchParams = useSearchParams()
  const [loading, setLoading] = useState(true)
  const [creators, setCreators] = useState<any[]>([])
  const [studios, setStudios] = useState<any[]>([])
  const [combined, setCombined] = useState<any[]>([])
  const [searchContext, setSearchContext] = useState<SearchParams | null>(null)

  useEffect(() => {
    const type = (searchParams.get("type") as "creator" | "studio" | "combined") || "creator"
    const city = searchParams.get("city") || ""
    const dateStr = searchParams.get("date")
    const time = searchParams.get("time") || "09:00"
    const duration = Number.parseInt(searchParams.get("duration") || "2")

    if (dateStr) {
      setSearchContext({
        bookingType: type,
        city,
        date: new Date(dateStr),
        startTime: time,
        duration,
      })
      performSearch(type, city, dateStr, time, duration)
    } else {
      setLoading(false)
    }
  }, [searchParams])

  const performSearch = async (type: string, city: string, dateStr: string, time: string, duration: number) => {
    setLoading(true)
    const supabase = createClient()

    try {
      const startDateTime = new Date(`${dateStr}T${time}:00`)
      const endDateTime = new Date(startDateTime.getTime() + duration * 60 * 60 * 1000)

      if (type === "creator" || type === "combined") {
        const { data } = await supabase.rpc("search_available_creators", {
          p_city: city || null,
          p_start: startDateTime.toISOString(),
          p_end: endDateTime.toISOString(),
        })
        setCreators(data || [])
      }

      if (type === "studio" || type === "combined") {
        const { data } = await supabase.rpc("search_available_studios", {
          p_city: city || null,
          p_start: startDateTime.toISOString(),
          p_end: endDateTime.toISOString(),
        })
        setStudios(data || [])
      }

      if (type === "combined") {
        const { data } = await supabase.rpc("search_combined_availability", {
          p_city: city || null,
          p_start: startDateTime.toISOString(),
          p_end: endDateTime.toISOString(),
        })
        setCombined(data || [])
      }
    } catch (error) {
      console.error("[v0] Search error:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleNewSearch = (params: SearchParams) => {
    const { bookingType, city, date, startTime, duration } = params
    if (date) {
      performSearch(bookingType, city, format(date, "yyyy-MM-dd"), startTime, duration)
      setSearchContext(params)
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-background pt-14">
      <SiteHeader />

      <main className="flex-1">
        {/* Search Bar */}
        <section className="py-8 bg-secondary/30">
          <div className="container max-w-6xl px-4">
            <BookingSearchBar
              defaultBookingType={searchContext?.bookingType}
              defaultCity={searchContext?.city}
              onSearch={handleNewSearch}
            />
          </div>
        </section>

        {/* Results */}
        <section className="py-12">
          <div className="container max-w-7xl px-6">
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : !searchContext ? (
              <div className="text-center py-20">
                <p className="text-muted-foreground">
                  Enter your search criteria to find available creators and studios
                </p>
              </div>
            ) : (
              <Tabs defaultValue={searchContext.bookingType} className="w-full">
                <TabsList className="mb-8">
                  {creators.length > 0 && <TabsTrigger value="creator">Creators ({creators.length})</TabsTrigger>}
                  {studios.length > 0 && <TabsTrigger value="studio">Studios ({studios.length})</TabsTrigger>}
                  {combined.length > 0 && <TabsTrigger value="combined">Combined ({combined.length})</TabsTrigger>}
                </TabsList>

                <TabsContent value="creator">
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {creators.map((creator) => (
                      <Link key={creator.id} href={`/creator/${creator.id}`}>
                        <Card className="overflow-hidden hover:shadow-xl transition-all duration-300">
                          <div className="relative aspect-[4/3]">
                            <Image
                              src={creator.avatar_url || creator.cover_image || "/placeholder.svg"}
                              alt={creator.display_name}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <CardContent className="p-5 bg-black text-white">
                            <h3 className="font-semibold mb-2">{creator.display_name}</h3>
                            <div className="flex items-center gap-2 text-xs text-white/70 mb-3">
                              <MapPin className="h-3.5 w-3.5" />
                              <span>{creator.city}</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-1">
                                <Star className="h-4 w-4 fill-white text-white" />
                                <span className="text-sm">{creator.rating}</span>
                              </div>
                              <span className="text-sm font-semibold">From £{creator.hourly_rate}/hr</span>
                            </div>
                          </CardContent>
                        </Card>
                      </Link>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="studio">
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {studios.map((studio) => (
                      <Link key={studio.id} href={`/studio/${studio.slug}`}>
                        <Card className="overflow-hidden hover:shadow-xl transition-all duration-300">
                          <div className="relative aspect-[4/3]">
                            <Image
                              src={studio.cover_image || "/placeholder.svg"}
                              alt={studio.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <CardContent className="p-5 bg-black text-white">
                            <h3 className="font-semibold mb-2">{studio.name}</h3>
                            <div className="flex items-center gap-2 text-xs text-white/70 mb-3">
                              <MapPin className="h-3.5 w-3.5" />
                              <span>{studio.city}</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-1">
                                <Star className="h-4 w-4 fill-white text-white" />
                                <span className="text-sm">{studio.rating}</span>
                              </div>
                              <span className="text-sm font-semibold">From £{studio.hourly_rate}/hr</span>
                            </div>
                          </CardContent>
                        </Card>
                      </Link>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="combined">
                  <div className="grid sm:grid-cols-2 gap-6">
                    {combined.map((combo, idx) => (
                      <Card key={idx} className="overflow-hidden hover:shadow-xl transition-all duration-300">
                        <CardContent className="p-6 bg-black text-white">
                          <div className="flex items-center justify-between mb-4">
                            <h3 className="font-semibold text-lg">Combined Package</h3>
                            <span className="text-xl font-bold">£{combo.combined_price}/hr</span>
                          </div>
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <span className="text-white/70">Creator:</span>
                              <span className="font-medium">{combo.creator_name}</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-white/70">Studio:</span>
                              <span className="font-medium">{combo.studio_name}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-white/70">
                              <MapPin className="h-4 w-4" />
                              <span>{combo.city}</span>
                            </div>
                          </div>
                          <Button className="w-full mt-4">Book Combined Package</Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            )}
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  )
}
