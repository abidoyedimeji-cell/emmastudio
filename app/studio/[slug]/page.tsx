import { Metadata } from "next"
import { notFound } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { createClient } from "@/lib/supabase/server"
import { getStudioBySlug, getStudioPackages } from "@/lib/data/studios"
import { getCreators } from "@/lib/data/creators"
import { MapPin, Star, Clock, DollarSign, HelpCircle } from "lucide-react"

type Props = {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const supabase = await createClient()

  const { data: studio } = await supabase
    .from("emma_studios")
    .select("name, studio_type, city, postcode, description, cover_image, hourly_rate, amenities, size, rating, review_count")
    .eq("slug", slug)
    .single()

  if (!studio) {
    return { title: "Studio Not Found | EMMA STUDIOS" }
  }

  const title = `${studio.name} | ${studio.studio_type || "Creative Studio"} in ${studio.city || "London"} | Book Now | EMMA STUDIOS`
  const description = studio.description ||
    `Book ${studio.name}, a professional ${(studio.studio_type || "creative studio").toLowerCase()} in ${studio.city || "London"}. ${studio.size ? `${studio.size} space with ` : ""}${(studio.amenities || []).slice(0, 3).join(", ") || "professional equipment"}. From \u00A3${studio.hourly_rate || 50}/hr.`

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      images: studio.cover_image ? [{ url: studio.cover_image }] : [],
      locale: "en_GB",
      siteName: "EMMA STUDIOS",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: studio.cover_image ? [studio.cover_image] : [],
    },
    alternates: {
      canonical: `https://emmastudios.com/studio/${slug}`,
    },
  }
}

const studioFAQs = [
  {
    question: "What's included in a studio booking?",
    answer: "Studio bookings include access to the space, basic equipment, and amenities listed on the studio profile. Additional equipment or services may be available at extra cost.",
  },
  {
    question: "Can I bring my own equipment?",
    answer: "Yes, you're welcome to bring your own equipment. Please ensure you have appropriate insurance for your gear.",
  },
  {
    question: "What's the cancellation policy?",
    answer: "Cancellations made 48+ hours before receive a full refund. Within 48 hours, a 50% fee applies. Same-day cancellations are non-refundable.",
  },
  {
    question: "Is parking available?",
    answer: "Parking availability varies by studio. Check the amenities section or contact the studio directly for parking information.",
  },
  {
    question: "Can I extend my booking?",
    answer: "Extensions are subject to availability. Contact us at least 24 hours before your session to request an extension.",
  },
]

export default async function StudioPage({ params }: Props) {
  const { slug } = await params
  const studio = await getStudioBySlug(slug)

  if (!studio) {
    notFound()
  }

  const [packages, nearbyCreators] = await Promise.all([
    getStudioPackages(studio.id),
    getCreators({ limit: 6 }),
  ])

  const galleryImages: string[] = studio.gallery_images || []
  const amenities: string[] = studio.amenities || []
  const equipment: string[] = studio.equipment || []

  return (
    <div className="flex min-h-screen flex-col overflow-x-hidden">
      <SiteHeader />

      <main className="flex-1 w-full max-w-full">
        {/* Hero Images */}
        <section className="relative h-[200px] sm:h-[300px] md:h-[400px] lg:h-[500px] w-full">
          <Image
            src={studio.cover_image || "/placeholder.svg"}
            alt={studio.name}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
        </section>

        {/* Studio Info */}
        <section className="py-4 sm:py-6 md:py-8 border-b w-full">
          <div className="container max-w-7xl mx-auto px-4 sm:px-6">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 sm:gap-6">
              <div className="flex-1 min-w-0">
                <h1 className="font-serif text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-2 sm:mb-3 text-balance break-words">
                  {studio.name}
                </h1>

                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mb-2 sm:mb-3">
                  <div className="flex items-center gap-1">
                    <Star className="h-3 w-3 sm:h-4 sm:w-4 fill-accent text-accent flex-shrink-0" />
                    <span className="font-medium text-xs sm:text-sm">{studio.rating || "New"}</span>
                    <span className="text-muted-foreground text-xs sm:text-sm">({studio.review_count || 0} reviews)</span>
                  </div>
                  <div className="flex items-center gap-1 text-muted-foreground text-xs sm:text-sm">
                    <MapPin className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                    <span className="break-words">{studio.address || studio.city}, {studio.postcode}</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1.5 sm:gap-2">
                  <Badge variant="secondary" className="text-[10px] sm:text-xs whitespace-nowrap">
                    {studio.studio_type || "Studio"}
                  </Badge>
                  <Badge variant="secondary" className="text-[10px] sm:text-xs whitespace-nowrap">
                    {studio.size || "Standard"}
                  </Badge>
                  {studio.is_verified && (
                    <Badge variant="secondary" className="text-[10px] sm:text-xs whitespace-nowrap">
                      Verified
                    </Badge>
                  )}
                </div>
              </div>

              <Link href={`/studio/${studio.slug}/book`} className="w-full sm:w-auto md:w-auto flex-shrink-0">
                <Button size="lg" className="bg-accent hover:bg-accent/90 w-full h-10 sm:h-11 text-sm sm:text-base">
                  Book Now
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Description & Amenities */}
        <section className="py-6 sm:py-8 md:py-12 w-full">
          <div className="container max-w-7xl mx-auto px-4 sm:px-6">
            <div className="grid lg:grid-cols-3 gap-6 sm:gap-8">
              <div className="lg:col-span-2 space-y-6 sm:space-y-8 min-w-0">
                <div>
                  <h2 className="font-serif text-xl sm:text-2xl md:text-3xl font-bold mb-3 sm:mb-4">About This Studio</h2>
                  <p className="text-muted-foreground leading-relaxed text-sm sm:text-base text-pretty">
                    {studio.description || studio.short_bio || "Professional creative studio space available for booking."}
                  </p>
                </div>

                {/* Gallery */}
                {galleryImages.length > 0 && (
                  <div>
                    <h2 className="font-serif text-xl sm:text-2xl md:text-3xl font-bold mb-3 sm:mb-4">Gallery</h2>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
                      {galleryImages.map((image: string, index: number) => (
                        <div key={index} className="relative h-32 sm:h-40 md:h-48 rounded-lg overflow-hidden">
                          <Image
                            src={image || "/placeholder.svg"}
                            alt={`${studio.name} - Image ${index + 1}`}
                            fill
                            className="object-cover hover:scale-105 transition-transform"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Amenities */}
                {amenities.length > 0 && (
                  <div>
                    <h2 className="font-serif text-xl sm:text-2xl md:text-3xl font-bold mb-3 sm:mb-4">Amenities</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 sm:gap-3">
                      {amenities.map((amenity: string) => (
                        <div key={amenity} className="flex items-center gap-2 text-xs sm:text-sm">
                          <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-accent" />
                          {amenity}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Equipment */}
                {equipment.length > 0 && (
                  <div>
                    <h2 className="font-serif text-xl sm:text-2xl md:text-3xl font-bold mb-3 sm:mb-4">Equipment</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 sm:gap-3">
                      {equipment.map((item: string) => (
                        <div key={item} className="flex items-center gap-2 text-xs sm:text-sm">
                          <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-primary" />
                          {item}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Rules */}
                {studio.rules && (
                  <div>
                    <h2 className="font-serif text-xl sm:text-2xl md:text-3xl font-bold mb-3 sm:mb-4">Studio Rules</h2>
                    <p className="text-muted-foreground text-sm sm:text-base">{studio.rules}</p>
                  </div>
                )}

                {/* Cancellation Policy */}
                {studio.cancellation_policy && (
                  <div>
                    <h2 className="font-serif text-xl sm:text-2xl md:text-3xl font-bold mb-3 sm:mb-4">Cancellation Policy</h2>
                    <p className="text-muted-foreground text-sm sm:text-base">{studio.cancellation_policy}</p>
                  </div>
                )}

                {/* FAQ */}
                <div>
                  <div className="flex items-center gap-2 mb-3 sm:mb-4">
                    <HelpCircle className="h-4 w-4 sm:h-5 sm:w-5" />
                    <h2 className="font-serif text-xl sm:text-2xl md:text-3xl font-bold">Frequently Asked Questions</h2>
                  </div>
                  <Accordion type="single" collapsible className="space-y-2">
                    {studioFAQs.map((faq, index) => (
                      <AccordionItem
                        key={index}
                        value={`faq-${index}`}
                        className="bg-secondary/30 rounded-xl border-none px-3 sm:px-4"
                      >
                        <AccordionTrigger className="text-left font-medium hover:no-underline py-3 sm:py-4 text-xs sm:text-sm">
                          {faq.question}
                        </AccordionTrigger>
                        <AccordionContent className="text-muted-foreground pb-3 sm:pb-4 text-xs sm:text-sm">
                          {faq.answer}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </div>
              </div>

              {/* Sidebar */}
              <div className="space-y-4 sm:space-y-6 min-w-0">
                {/* Pricing Card */}
                <Card className="lg:sticky lg:top-24 w-full">
                  <CardContent className="p-4 sm:p-6">
                    <h3 className="font-serif text-base sm:text-lg md:text-xl font-bold mb-3 sm:mb-4">Pricing</h3>
                    <div className="space-y-3 sm:space-y-4">
                      <div className="flex items-center justify-between pb-3 sm:pb-4 border-b gap-2">
                        <div className="flex items-center gap-1.5 sm:gap-2 min-w-0 flex-1">
                          <Clock className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground flex-shrink-0" />
                          <span className="text-xs sm:text-sm truncate">Hourly Rate</span>
                        </div>
                        <span className="font-semibold text-sm sm:text-base whitespace-nowrap">
                          {"\u00A3"}{studio.hourly_rate}/hr
                        </span>
                      </div>
                      {studio.half_day_rate && (
                        <div className="flex items-center justify-between pb-3 sm:pb-4 border-b gap-2">
                          <div className="flex items-center gap-1.5 sm:gap-2 min-w-0 flex-1">
                            <Clock className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground flex-shrink-0" />
                            <span className="text-xs sm:text-sm truncate">Half Day (3h)</span>
                          </div>
                          <span className="font-semibold text-sm sm:text-base whitespace-nowrap">
                            {"\u00A3"}{studio.half_day_rate}
                          </span>
                        </div>
                      )}
                      {studio.full_day_rate && (
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-1.5 sm:gap-2 min-w-0 flex-1">
                            <DollarSign className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground flex-shrink-0" />
                            <span className="text-xs sm:text-sm truncate">Full Day (6h)</span>
                          </div>
                          <span className="font-semibold text-sm sm:text-base whitespace-nowrap">
                            {"\u00A3"}{studio.full_day_rate}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Packages */}
                    {(packages || []).length > 0 && (
                      <div className="mt-4 pt-4 border-t">
                        <h4 className="font-medium text-sm mb-3">Packages</h4>
                        <div className="space-y-2">
                          {(packages || []).map((pkg: any) => (
                            <div key={pkg.id} className="flex items-center justify-between text-sm p-2 rounded-lg bg-secondary/30">
                              <div className="min-w-0 flex-1">
                                <p className="font-medium truncate">{pkg.name}</p>
                                <p className="text-xs text-muted-foreground">{pkg.duration_hours}h</p>
                              </div>
                              <span className="font-semibold whitespace-nowrap ml-2">{"\u00A3"}{pkg.price}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <Link href={`/studio/${studio.slug}/book`} className="block mt-4 sm:mt-6">
                      <Button className="w-full bg-accent hover:bg-accent/90 h-10 sm:h-11 text-sm sm:text-base">
                        Book This Studio
                      </Button>
                    </Link>

                    <p className="text-[10px] sm:text-xs text-center text-muted-foreground mt-3 sm:mt-4 break-words">
                      50% deposit required to confirm booking
                    </p>
                  </CardContent>
                </Card>

                {/* Nearby Creators */}
                {(nearbyCreators || []).length > 0 && (
                  <Card>
                    <CardContent className="p-4 sm:p-6">
                      <h3 className="font-serif text-base sm:text-lg md:text-xl font-bold mb-3 sm:mb-4">
                        Available Creators
                      </h3>
                      <div className="space-y-2 sm:space-y-3">
                        {(nearbyCreators || []).slice(0, 4).map((creator: any) => (
                          <Link
                            key={creator.id}
                            href={`/creator/${creator.id}`}
                            className="flex items-center gap-2 sm:gap-3 p-2 rounded-lg hover:bg-secondary/50 transition-colors"
                          >
                            <div className="relative w-8 h-8 sm:w-10 sm:h-10 rounded-full overflow-hidden flex-shrink-0">
                              <Image
                                src={creator.avatar_url || "/placeholder.svg"}
                                alt={creator.display_name}
                                fill
                                className="object-cover"
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-xs sm:text-sm truncate">{creator.display_name}</p>
                              <p className="text-[10px] sm:text-xs text-muted-foreground">
                                {creator.specialty || creator.creator_type?.replace("_", " ")}
                              </p>
                            </div>
                            <span className="text-xs font-medium whitespace-nowrap">{"\u00A3"}{creator.hourly_rate}/hr</span>
                          </Link>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  )
}
