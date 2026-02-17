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
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { ImageGalleryModal } from "@/components/image-gallery-modal"
import { Search, MapPin, HelpCircle, Star, Loader2 } from "lucide-react"

const fetcher = (url: string) => fetch(url).then((r) => r.json())

const creatorsFAQs = [
  {
    question: "How do I book a creator?",
    answer:
      "Browse our creator profiles, select your preferred creator, choose a package that fits your needs, pick an available date and time, and complete your booking with a 50% deposit.",
  },
  {
    question: "What's included in a creator booking?",
    answer:
      "Each creator offers different packages. Typically includes the creative session time, equipment, and deliverables like edited photos or videos. Check individual creator profiles for specific package details.",
  },
  {
    question: "Can I request a custom package?",
    answer:
      "Yes! Most creators offer custom packages for specific needs. Use the contact form on their profile or reach out during the booking process to discuss custom requirements.",
  },
  {
    question: "What's the cancellation policy?",
    answer:
      "Cancellations made 48+ hours before your session receive a full refund. Cancellations within 48 hours may be subject to a cancellation fee. Check individual creator policies for specific terms.",
  },
  {
    question: "How are creators verified?",
    answer:
      "All creators go through a verification process including portfolio review, identity verification, and quality assessment. Verified creators display a badge on their profile.",
  },
]

const getCreatorBorderColor = (type: string | null) => {
  switch (type) {
    case "photographer": return "border-blue-500"
    case "videographer": return "border-purple-500"
    case "audio_engineer": case "music_producer": return "border-red-500"
    case "editor": return "border-green-500"
    default: return "border-orange-500"
  }
}

function CarouselSection({ title, creators }: { title: string; creators: any[] }) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [isPaused, setIsPaused] = useState(false)

  useEffect(() => {
    if (!scrollRef.current || isPaused || creators.length === 0) return
    const interval = setInterval(() => {
      if (scrollRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current
        if (scrollLeft + clientWidth >= scrollWidth - 10) {
          scrollRef.current.scrollTo({ left: 0, behavior: "smooth" })
        } else {
          scrollRef.current.scrollBy({ left: 200, behavior: "smooth" })
        }
      }
    }, 3000)
    return () => clearInterval(interval)
  }, [isPaused, creators.length])

  if (creators.length === 0) return null

  return (
    <div className="mb-12">
      <h3 className="text-xl font-semibold mb-6 tracking-tight">{title}</h3>
      <div
        ref={scrollRef}
        className="flex gap-6 overflow-x-auto pb-4 scroll-smooth scrollbar-hide"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {creators.map((creator: any) => (
          <Link
            key={creator.id}
            href={`/creator/${creator.id}`}
            className="flex-shrink-0 flex flex-col items-center gap-3"
          >
            <div className="relative w-40 h-40 rounded-full overflow-hidden border-2 border-black/10 hover:border-black/30 transition-all duration-300">
              <Image
                src={creator.avatar_url || "/placeholder.svg"}
                alt={creator.display_name}
                fill
                className="object-cover"
                sizes="160px"
              />
            </div>
            <div className="bg-black text-white px-4 py-2 rounded-full text-xs font-medium text-center max-w-[160px] truncate">
              {creator.display_name.split(" ")[0]} - {(creator.specialty || creator.creator_type || "Creator").split(" ").slice(0, 2).join(" ")}
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}

export default function CreatorsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedType, setSelectedType] = useState("all")
  const [postcodeFilter, setPostcodeFilter] = useState("")
  const [priceRange, setPriceRange] = useState("all")
  const [galleryImages, setGalleryImages] = useState<string[]>([])
  const [isGalleryOpen, setIsGalleryOpen] = useState(false)

  const params = useMemo(() => {
    const p = new URLSearchParams()
    if (searchQuery) p.set("search", searchQuery)
    if (selectedType !== "all") p.set("type", selectedType)
    if (postcodeFilter) p.set("postcode", postcodeFilter)
    if (priceRange !== "all") p.set("price", priceRange)
    return p.toString()
  }, [searchQuery, selectedType, postcodeFilter, priceRange])

  const { data: creators = [], isLoading } = useSWR<any[]>(
    `/api/creators?${params}`,
    fetcher,
    { keepPreviousData: true }
  )

  const topRated = useMemo(() =>
    [...creators].filter((c) => (c.rating || 0) >= 4.8).slice(0, 5),
    [creators]
  )
  const featured = useMemo(() =>
    creators.filter((c) => c.is_featured).slice(0, 5),
    [creators]
  )
  const mostBooked = useMemo(() =>
    [...creators].sort((a, b) => (b.completed_bookings || 0) - (a.completed_bookings || 0)).slice(0, 5),
    [creators]
  )

  const openGallery = (images: string[]) => {
    setGalleryImages(images)
    setIsGalleryOpen(true)
  }

  return (
    <div className="flex min-h-screen flex-col bg-white pb-20 max-w-full overflow-hidden pt-14">
      <SiteHeader />

      <main className="flex-1 w-full max-w-full">
        {/* Hero */}
        <section className="bg-gradient-to-b from-gray-50 to-white py-4 sm:py-6 md:py-8">
          <div className="container px-4 sm:px-6 max-w-full">
            <div className="text-center max-w-3xl mx-auto">
              <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight text-foreground mb-2 sm:mb-3 break-words">
                Professional Creators
              </h1>
              <p className="text-muted-foreground text-xs sm:text-sm md:text-base mb-3 sm:mb-4 px-2 break-words whitespace-normal">
                Hire top photographers, videographers, audio engineers, and creative professionals
              </p>
            </div>
          </div>
        </section>

        {/* Category Carousels */}
        {creators.length > 0 && (
          <section className="py-8 sm:py-12 md:py-16 px-4 sm:px-6 max-w-full overflow-hidden">
            <div className="max-w-7xl mx-auto">
              <CarouselSection title="Featured Creators" creators={featured} />
              <CarouselSection title="Top Rated" creators={topRated} />
              <CarouselSection title="Most Booked" creators={mostBooked} />
            </div>
          </section>
        )}

        {/* Filters */}
        <section className="py-4 sm:py-6 px-4 sm:px-6 bg-secondary/30">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col gap-2 sm:gap-3 mb-4">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search creators..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 h-11"
                />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <Select value={selectedType} onValueChange={setSelectedType}>
                  <SelectTrigger className="h-11">
                    <SelectValue placeholder="Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="photographer">Photographers</SelectItem>
                    <SelectItem value="videographer">Videographers</SelectItem>
                    <SelectItem value="audio_engineer">Audio Engineers</SelectItem>
                    <SelectItem value="music_producer">Music Producers</SelectItem>
                    <SelectItem value="editor">Editors</SelectItem>
                  </SelectContent>
                </Select>

                <Input
                  placeholder="Postcode"
                  value={postcodeFilter}
                  onChange={(e) => setPostcodeFilter(e.target.value)}
                  className="h-11"
                />

                <Select value={priceRange} onValueChange={setPriceRange}>
                  <SelectTrigger className="h-11">
                    <SelectValue placeholder="Price" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Prices</SelectItem>
                    <SelectItem value="budget">{"Under \u00A350/hr"}</SelectItem>
                    <SelectItem value="mid">{"\u00A350-100/hr"}</SelectItem>
                    <SelectItem value="premium">{"\u00A3100+/hr"}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <p className="text-sm text-muted-foreground">
              {isLoading ? "Loading..." : `${creators.length} creator${creators.length !== 1 ? "s" : ""} found`}
            </p>
          </div>
        </section>

        {/* Creator Grid */}
        <section className="py-6 sm:py-8 md:py-12 px-4 sm:px-6">
          <div className="max-w-7xl mx-auto">
            {isLoading && creators.length === 0 ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : creators.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-muted-foreground">No creators found matching your filters.</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
                {creators.map((creator: any) => {
                  const portfolioImgs: string[] = creator.portfolio_images || []
                  const skills: string[] = creator.skills || []

                  return (
                    <Link key={creator.id} href={`/creator/${creator.id}`}>
                      <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 h-full flex flex-col border-border/50 group rounded-xl sm:rounded-2xl cursor-pointer max-w-full">
                        <div className="relative w-full aspect-[4/3] overflow-hidden max-w-full">
                          <div className={`absolute inset-0 p-0.5 sm:p-1 ${getCreatorBorderColor(creator.creator_type)}`}>
                            <div className="relative w-full h-full rounded-lg sm:rounded-xl overflow-hidden">
                              <Image
                                src={creator.avatar_url || "/placeholder.svg"}
                                alt={creator.display_name}
                                fill
                                className="object-cover group-hover:scale-105 transition-transform duration-300"
                                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                              />
                              <div className="absolute left-1.5 sm:left-2 top-1.5 sm:top-2 flex flex-col gap-1">
                                <span className="text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full bg-black/80 text-white font-medium">
                                  {creator.specialty || creator.creator_type?.replace("_", " ") || "Creative"}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>

                        <CardContent className="p-2.5 sm:p-3 md:p-4 flex-1 flex flex-col bg-zinc-900 text-white">
                          <div className="flex items-center gap-1.5 sm:gap-2 mb-1.5 sm:mb-2 max-w-full overflow-hidden">
                            <span className="bg-black text-white text-[10px] sm:text-xs font-medium px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full truncate max-w-full flex items-center gap-1">
                              <span className="truncate">{creator.display_name}</span>
                              <MapPin className="h-2.5 w-2.5 sm:h-3 sm:w-3 flex-shrink-0" />
                              <span className="text-gray-300 truncate">{creator.city || "London"}</span>
                            </span>
                          </div>

                          <div className="flex items-center justify-between text-[10px] sm:text-xs mb-1.5 sm:mb-2">
                            <div className="flex items-center gap-0.5 sm:gap-1">
                              <Star className="h-2.5 w-2.5 sm:h-3 sm:w-3 fill-yellow-400 text-yellow-400" />
                              <span>{creator.rating || "New"}</span>
                              <span className="text-gray-400">({creator.review_count || 0})</span>
                            </div>
                            <span className="font-semibold text-[10px] sm:text-xs">{"\u00A3"}{creator.hourly_rate}/hr</span>
                          </div>

                          <div className="flex gap-1 mt-auto">
                            {portfolioImgs.slice(0, 3).map((img: string, idx: number) => (
                              <button
                                key={idx}
                                onClick={(e) => {
                                  e.preventDefault()
                                  e.stopPropagation()
                                  openGallery(portfolioImgs)
                                }}
                                className="relative w-5 h-5 rounded-full overflow-hidden border border-white/30 hover:border-white transition-colors flex-shrink-0"
                              >
                                <Image
                                  src={img || "/placeholder.svg"}
                                  alt={`${creator.display_name} work ${idx + 1}`}
                                  fill
                                  className="object-cover"
                                  sizes="20px"
                                />
                              </button>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  )
                })}
              </div>
            )}
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-8 sm:py-12 bg-gray-50">
          <div className="container px-4 sm:px-6 max-w-full">
            <div className="flex items-center gap-3 mb-8">
              <HelpCircle className="h-6 w-6" />
              <h2 className="text-2xl font-semibold tracking-tight">Frequently Asked Questions</h2>
            </div>
            <Accordion type="single" collapsible className="space-y-4">
              {creatorsFAQs.map((faq, index) => (
                <AccordionItem
                  key={index}
                  value={`faq-${index}`}
                  className="bg-white rounded-xl border border-border/50 px-6"
                >
                  <AccordionTrigger className="text-left font-medium hover:no-underline py-4">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground pb-4">{faq.answer}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </section>
      </main>

      <SiteFooter />

      <ImageGalleryModal images={galleryImages} isOpen={isGalleryOpen} onClose={() => setIsGalleryOpen(false)} />
    </div>
  )
}
