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
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { ImageGalleryModal } from "@/components/image-gallery-modal"
import { Search, Heart, MapPin, HelpCircle, Star, Camera, Video, Mic, Building2, Loader2 } from "lucide-react"

const fetcher = (url: string) => fetch(url).then((r) => r.json())

const studiosFAQs = [
  {
    question: "How do I book a studio?",
    answer:
      "Browse our studio listings, select your preferred studio, choose a time slot and package, and complete your booking with a 50% deposit. You'll receive instant confirmation with all studio details.",
  },
  {
    question: "What equipment is included?",
    answer:
      "Each studio has different equipment included. Check the studio's amenities section for lighting, backdrops, audio equipment, and other available gear. Some studios offer equipment add-ons.",
  },
  {
    question: "Can I bring my own team?",
    answer:
      "Yes! You can bring your own creative team or book one of our available creators who work regularly at the studio. Some packages include creator services.",
  },
  {
    question: "What's the cancellation policy?",
    answer:
      "Cancellations made 48+ hours before receive a full refund. Cancellations within 48 hours may be subject to a fee. Check individual studio policies for specific terms.",
  },
  {
    question: "Are studios available for events?",
    answer:
      "Many studios are available for events, launches, and private functions. Contact the studio directly or use the custom booking option for special requirements.",
  },
]

const getStudioBorderColor = (type: string | null) => {
  switch (type?.toLowerCase()) {
    case "photography": return "border-blue-500"
    case "videography": return "border-purple-500"
    case "audio": return "border-red-500"
    case "multi-purpose": return "border-orange-500"
    default: return "border-gray-500"
  }
}

const getStudioIcon = (type: string | null) => {
  switch (type?.toLowerCase()) {
    case "photography": return <Camera className="h-3 w-3" />
    case "videography": return <Video className="h-3 w-3" />
    case "audio": return <Mic className="h-3 w-3" />
    default: return <Building2 className="h-3 w-3" />
  }
}

export default function StudiosPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedType, setSelectedType] = useState("all")
  const [postcodeFilter, setPostcodeFilter] = useState("")
  const [priceRange, setPriceRange] = useState("all")
  const [favorites, setFavorites] = useState<string[]>([])
  const [galleryOpen, setGalleryOpen] = useState(false)
  const [galleryImages, setGalleryImages] = useState<string[]>([])
  const [galleryIndex, setGalleryIndex] = useState(0)

  const params = useMemo(() => {
    const p = new URLSearchParams()
    if (searchQuery) p.set("search", searchQuery)
    if (selectedType !== "all") p.set("type", selectedType)
    if (postcodeFilter) p.set("postcode", postcodeFilter)
    if (priceRange !== "all") p.set("price", priceRange)
    return p.toString()
  }, [searchQuery, selectedType, postcodeFilter, priceRange])

  const { data: studios = [], isLoading } = useSWR<any[]>(
    `/api/studios?${params}`,
    fetcher,
    { keepPreviousData: true }
  )

  const toggleFavorite = (id: string) => {
    setFavorites((prev) => (prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]))
  }

  const openGallery = (images: string[], index: number) => {
    setGalleryImages(images)
    setGalleryIndex(index)
    setGalleryOpen(true)
  }

  return (
    <div className="flex min-h-screen flex-col bg-white pb-20 pt-14 max-w-full overflow-x-hidden">
      <SiteHeader />

      <main className="flex-1 w-full max-w-full overflow-x-hidden">
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-gray-50 to-white py-4 sm:py-6 md:py-8">
          <div className="container px-4 sm:px-6 max-w-full">
            <div className="text-center max-w-3xl mx-auto">
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight text-foreground mb-3 break-words whitespace-normal">
                Creative Studio Spaces
              </h1>
              <div className="flex flex-wrap items-center justify-center gap-2 mb-4">
                <span className="bg-black/90 text-white text-xs sm:text-sm px-3 sm:px-4 py-1.5 sm:py-2 rounded-full whitespace-nowrap">
                  Photography Studios
                </span>
                <span className="text-muted-foreground">{"\\u2022"}</span>
                <span className="bg-black/90 text-white text-xs sm:text-sm px-3 sm:px-4 py-1.5 sm:py-2 rounded-full whitespace-nowrap">
                  Videography & Audio
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Filters */}
        <section className="border-b bg-white sticky top-14 z-30">
          <div className="container px-4 sm:px-6 py-3 sm:py-4 max-w-full">
            <div className="flex flex-col gap-2 sm:gap-3">
              <div className="relative w-full max-w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground flex-shrink-0" />
                <Input
                  placeholder="Search studios..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 h-10 sm:h-11 w-full"
                />
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 max-w-full">
                <Select value={selectedType} onValueChange={setSelectedType}>
                  <SelectTrigger className="h-10 sm:h-11 text-xs sm:text-sm w-full">
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
                <Input
                  placeholder="Postcode"
                  value={postcodeFilter}
                  onChange={(e) => setPostcodeFilter(e.target.value)}
                  className="h-10 sm:h-11 text-xs sm:text-sm w-full"
                />
                <Select value={priceRange} onValueChange={setPriceRange}>
                  <SelectTrigger className="h-10 sm:h-11 text-xs sm:text-sm w-full">
                    <SelectValue placeholder="Price/hr" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Prices</SelectItem>
                    <SelectItem value="budget">{"Under \\u00A350/hr"}</SelectItem>
                    <SelectItem value="mid">{"\\u00A350-100/hr"}</SelectItem>
                    <SelectItem value="premium">{"\\u00A3100+/hr"}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </section>

        {/* Studios Grid */}
        <section className="py-6 sm:py-8 md:py-12">
          <div className="container px-4 sm:px-6 max-w-full">
            <div className="flex items-center justify-between mb-6">
              <p className="text-sm text-muted-foreground">
                {isLoading ? "Loading..." : `${studios.length} studio${studios.length !== 1 ? "s" : ""} found`}
              </p>
            </div>

            {isLoading && studios.length === 0 ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : studios.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-muted-foreground">No studios found matching your filters.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 max-w-full">
                {studios.map((studio: any) => {
                  const galleryImgs: string[] = studio.gallery_images || []

                  return (
                    <Link key={studio.id} href={`/studio/${studio.slug}`} className="group w-full">
                      <Card className="overflow-hidden border-0 shadow-sm hover:shadow-md transition-all w-full">
                        <div className="relative aspect-[4/3] w-full">
                          <div className={`absolute inset-0 p-1 ${getStudioBorderColor(studio.studio_type)} rounded-t-lg`}>
                            <div className="relative w-full h-full rounded-t-md overflow-hidden">
                              <Image
                                src={studio.cover_image || "/placeholder.svg"}
                                alt={studio.name}
                                fill
                                className="object-cover group-hover:scale-105 transition-transform duration-300"
                              />
                            </div>
                          </div>
                          <div className="absolute top-2 sm:top-3 left-2 sm:left-3 flex flex-col gap-1 z-10">
                            <span className="bg-white/90 backdrop-blur-sm text-[10px] sm:text-xs font-medium px-2 py-0.5 rounded-full flex items-center gap-1 whitespace-nowrap">
                              {getStudioIcon(studio.studio_type)}
                              {studio.studio_type || "Studio"}
                            </span>
                            <span className="bg-white/90 backdrop-blur-sm text-[10px] sm:text-xs font-medium px-2 py-0.5 rounded-full whitespace-nowrap">
                              {studio.size || "medium"}
                            </span>
                          </div>
                          <button
                            onClick={(e) => {
                              e.preventDefault()
                              e.stopPropagation()
                              toggleFavorite(studio.id)
                            }}
                            className="absolute top-2 sm:top-3 right-2 sm:right-3 z-10 p-1.5 rounded-full bg-white/90 backdrop-blur-sm hover:bg-white transition-colors"
                          >
                            <Heart
                              className={`h-4 w-4 ${favorites.includes(studio.id) ? "fill-red-500 text-red-500" : "text-gray-600"}`}
                            />
                          </button>
                        </div>

                        <CardContent className="p-2.5 sm:p-3 bg-zinc-900 text-white w-full">
                          <div className="flex items-center gap-2 mb-1.5 sm:mb-2 w-full overflow-hidden">
                            <span className="bg-black text-white text-[10px] sm:text-xs font-medium px-2 py-1 rounded-full flex items-center gap-1 w-full min-w-0">
                              <span className="truncate flex-1">{studio.name}</span>
                              <MapPin className="h-2.5 w-2.5 sm:h-3 sm:w-3 flex-shrink-0" />
                              <span className="text-gray-300 truncate">{studio.city || "London"}</span>
                            </span>
                          </div>

                          <div className="flex items-center justify-between text-[10px] sm:text-xs mb-1.5 sm:mb-2">
                            <div className="flex items-center gap-1">
                              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400 flex-shrink-0" />
                              <span>{studio.rating || "New"}</span>
                              <span className="text-gray-400">({studio.review_count || 0})</span>
                            </div>
                            <span className="font-semibold whitespace-nowrap">{"\u00A3"}{studio.hourly_rate}/hr</span>
                          </div>

                          <div className="flex gap-1">
                            {galleryImgs.slice(0, 3).map((img: string, idx: number) => (
                              <button
                                key={idx}
                                onClick={(e) => {
                                  e.preventDefault()
                                  e.stopPropagation()
                                  openGallery(galleryImgs, idx)
                                }}
                                className="relative w-5 h-5 rounded-full overflow-hidden border border-white/30 hover:border-white transition-colors flex-shrink-0"
                              >
                                <Image
                                  src={img || "/placeholder.svg"}
                                  alt={`${studio.name} gallery ${idx + 1}`}
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
            <div className="max-w-3xl mx-auto">
              <div className="flex items-center gap-2 mb-6">
                <HelpCircle className="h-5 w-5 text-muted-foreground" />
                <h2 className="text-2xl font-bold">Frequently Asked Questions</h2>
              </div>
              <Accordion type="single" collapsible className="w-full">
                {studiosFAQs.map((faq, index) => (
                  <AccordionItem key={index} value={`item-${index}`}>
                    <AccordionTrigger className="text-left">{faq.question}</AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">{faq.answer}</AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />

      <ImageGalleryModal
        images={galleryImages}
        initialIndex={galleryIndex}
        isOpen={galleryOpen}
        onClose={() => setGalleryOpen(false)}
      />
    </div>
  )
}
