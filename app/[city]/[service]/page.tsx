import { Metadata } from "next"
import { notFound } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { createClient } from "@/lib/supabase/server"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MapPin, Star, Camera, Video, Mic, Building2, ArrowRight } from "lucide-react"

const VALID_CITIES = [
  { slug: "london", name: "London" },
  { slug: "manchester", name: "Manchester" },
  { slug: "birmingham", name: "Birmingham" },
  { slug: "leeds", name: "Leeds" },
  { slug: "liverpool", name: "Liverpool" },
  { slug: "bristol", name: "Bristol" },
  { slug: "edinburgh", name: "Edinburgh" },
  { slug: "glasgow", name: "Glasgow" },
]

const VALID_SERVICES = [
  { slug: "photography", name: "Photography", type: "photographer", icon: Camera },
  { slug: "videography", name: "Videography", type: "videographer", icon: Video },
  { slug: "audio", name: "Audio Engineering", type: "audio_engineer", icon: Mic },
  { slug: "podcast-studio", name: "Podcast Studios", type: "podcast", icon: Mic },
  { slug: "music-studio", name: "Music Studios", type: "recording", icon: Mic },
]

type Props = {
  params: Promise<{ city: string; service: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { city, service } = await params
  const cityData = VALID_CITIES.find((c) => c.slug === city)
  const serviceData = VALID_SERVICES.find((s) => s.slug === service)

  if (!cityData || !serviceData) {
    return { title: "Not Found" }
  }

  const title = `${serviceData.name} in ${cityData.name} | Book Professional Creators | EMMA STUDIOS`
  const description = `Find and book verified ${serviceData.name.toLowerCase()} professionals in ${cityData.name}. View portfolios, compare packages, check availability and book instantly. Trusted creators with real reviews.`

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      locale: "en_GB",
      siteName: "EMMA STUDIOS",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
    alternates: {
      canonical: `https://emmastudios.com/${city}/${service}`,
    },
  }
}

export async function generateStaticParams() {
  const params: { city: string; service: string }[] = []
  for (const city of VALID_CITIES) {
    for (const service of VALID_SERVICES) {
      params.push({ city: city.slug, service: service.slug })
    }
  }
  return params
}

export default async function CityServicePage({ params }: Props) {
  const { city, service } = await params
  const cityData = VALID_CITIES.find((c) => c.slug === city)
  const serviceData = VALID_SERVICES.find((s) => s.slug === service)

  if (!cityData || !serviceData) {
    notFound()
  }

  const supabase = await createClient()
  const ServiceIcon = serviceData.icon

  // Fetch creators matching city and service type
  const { data: creators } = await supabase
    .from("emma_creators")
    .select("*")
    .ilike("city", `%${cityData.name}%`)
    .eq("creator_type", serviceData.type)
    .eq("status", "approved")
    .eq("active", true)
    .limit(12)

  // Fetch studios matching city and service type
  const { data: studios } = await supabase
    .from("emma_studios")
    .select("*")
    .ilike("city", `%${cityData.name}%`)
    .eq("status", "approved")
    .eq("active", true)
    .limit(6)

  // Related cities for internal linking
  const relatedCities = VALID_CITIES.filter((c) => c.slug !== city).slice(0, 4)

  // Related services for internal linking
  const relatedServices = VALID_SERVICES.filter((s) => s.slug !== service).slice(0, 3)

  // JSON-LD Schema for SEO
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `${serviceData.name} in ${cityData.name}`,
    description: `Professional ${serviceData.name.toLowerCase()} services available in ${cityData.name}`,
    numberOfItems: (creators?.length || 0) + (studios?.length || 0),
    itemListElement: [
      ...(creators || []).map((creator, index) => ({
        "@type": "ListItem",
        position: index + 1,
        item: {
          "@type": "ProfessionalService",
          name: creator.display_name,
          description: creator.short_bio,
          image: creator.avatar_url,
          address: {
            "@type": "PostalAddress",
            addressLocality: cityData.name,
            addressCountry: "UK",
          },
          aggregateRating: creator.rating
            ? {
                "@type": "AggregateRating",
                ratingValue: creator.rating,
                reviewCount: creator.review_count || 0,
              }
            : undefined,
          priceRange: `£${creator.hourly_rate || 50}/hr`,
        },
      })),
    ],
  }

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <SiteHeader />

      {/* JSON-LD Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
      />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-neutral-50 to-white py-12 md:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="flex items-center gap-2 text-sm text-neutral-500 mb-4">
              <Link href="/" className="hover:text-neutral-900">Home</Link>
              <span>/</span>
              <Link href={`/${city}`} className="hover:text-neutral-900 capitalize">{cityData.name}</Link>
              <span>/</span>
              <span className="text-neutral-900">{serviceData.name}</span>
            </div>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-black rounded-xl flex items-center justify-center">
                <ServiceIcon className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-balance">
                {serviceData.name} in {cityData.name}
              </h1>
            </div>

            <p className="text-lg md:text-xl text-neutral-600 max-w-3xl mb-6">
              Browse verified {serviceData.name.toLowerCase()} professionals in {cityData.name}. 
              View portfolios, compare packages, and book instantly with secure payment.
            </p>

            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary" className="text-sm">
                <MapPin className="h-3 w-3 mr-1" />
                {cityData.name}
              </Badge>
              <Badge variant="secondary" className="text-sm">
                {(creators?.length || 0) + (studios?.length || 0)} Providers Available
              </Badge>
              <Badge variant="secondary" className="text-sm">
                Instant Booking
              </Badge>
            </div>
          </div>
        </section>

        {/* Creators Section */}
        {creators && creators.length > 0 && (
          <section className="py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6">
              <h2 className="text-2xl font-bold mb-6">
                {serviceData.name} Professionals in {cityData.name}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {creators.map((creator) => (
                  <Link key={creator.id} href={`/creator/${creator.slug || creator.id}`}>
                    <Card className="overflow-hidden hover:shadow-lg transition-shadow h-full">
                      <div className="relative aspect-[4/5]">
                        <Image
                          src={creator.avatar_url || "/placeholder.svg?height=400&width=320"}
                          alt={creator.display_name}
                          fill
                          className="object-cover"
                        />
                        {creator.is_verified && (
                          <Badge className="absolute top-2 left-2 bg-blue-600 text-white">
                            Verified
                          </Badge>
                        )}
                      </div>
                      <CardContent className="p-4">
                        <h3 className="font-semibold mb-1">{creator.display_name}</h3>
                        <p className="text-sm text-neutral-500 mb-2">{creator.specialty}</p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                            <span className="text-sm font-medium">{creator.rating || "5.0"}</span>
                            <span className="text-sm text-neutral-400">
                              ({creator.review_count || 0})
                            </span>
                          </div>
                          <span className="text-sm font-bold">
                            £{creator.hourly_rate || 50}/hr
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Studios Section */}
        {studios && studios.length > 0 && (
          <section className="py-12 bg-neutral-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6">
              <h2 className="text-2xl font-bold mb-6">
                Studios in {cityData.name}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {studios.map((studio) => (
                  <Link key={studio.id} href={`/studio/${studio.slug || studio.id}`}>
                    <Card className="overflow-hidden hover:shadow-lg transition-shadow h-full">
                      <div className="relative aspect-video">
                        <Image
                          src={studio.cover_image || "/placeholder.svg?height=200&width=400"}
                          alt={studio.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <CardContent className="p-4">
                        <h3 className="font-semibold mb-1">{studio.name}</h3>
                        <div className="flex items-center gap-1 text-sm text-neutral-500 mb-2">
                          <MapPin className="h-3 w-3" />
                          {studio.city}
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                            <span className="text-sm font-medium">{studio.rating || "5.0"}</span>
                          </div>
                          <span className="text-sm font-bold">
                            £{studio.hourly_rate || 75}/hr
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Empty State */}
        {(!creators || creators.length === 0) && (!studios || studios.length === 0) && (
          <section className="py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
              <Building2 className="h-16 w-16 mx-auto text-neutral-300 mb-4" />
              <h2 className="text-2xl font-bold mb-2">
                No providers found in {cityData.name} yet
              </h2>
              <p className="text-neutral-600 mb-6">
                We&apos;re expanding to new locations. Check out nearby cities or browse all providers.
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                <Link href="/creators">
                  <Button>Browse All Creators</Button>
                </Link>
                <Link href="/studios">
                  <Button variant="outline">Browse All Studios</Button>
                </Link>
              </div>
            </div>
          </section>
        )}

        {/* Related Cities - Internal Linking */}
        <section className="py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <h2 className="text-2xl font-bold mb-6">
              {serviceData.name} in Other Cities
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {relatedCities.map((relatedCity) => (
                <Link
                  key={relatedCity.slug}
                  href={`/${relatedCity.slug}/${service}`}
                  className="group"
                >
                  <Card className="p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold group-hover:text-blue-600">
                          {relatedCity.name}
                        </h3>
                        <p className="text-sm text-neutral-500">{serviceData.name}</p>
                      </div>
                      <ArrowRight className="h-4 w-4 text-neutral-400 group-hover:text-blue-600 transition-colors" />
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Related Services - Internal Linking */}
        <section className="py-12 bg-neutral-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <h2 className="text-2xl font-bold mb-6">
              Other Services in {cityData.name}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {relatedServices.map((relatedService) => {
                const RelatedIcon = relatedService.icon
                return (
                  <Link
                    key={relatedService.slug}
                    href={`/${city}/${relatedService.slug}`}
                    className="group"
                  >
                    <Card className="p-6 hover:shadow-md transition-shadow">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-neutral-100 rounded-xl flex items-center justify-center group-hover:bg-black transition-colors">
                          <RelatedIcon className="h-6 w-6 text-neutral-600 group-hover:text-white transition-colors" />
                        </div>
                        <div>
                          <h3 className="font-semibold group-hover:text-blue-600">
                            {relatedService.name}
                          </h3>
                          <p className="text-sm text-neutral-500">in {cityData.name}</p>
                        </div>
                      </div>
                    </Card>
                  </Link>
                )
              })}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-black text-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
            <h2 className="text-3xl font-bold mb-4">
              Ready to Book {serviceData.name} in {cityData.name}?
            </h2>
            <p className="text-lg text-white/70 mb-8">
              Join thousands of clients who have found their perfect creative professionals through EMMA STUDIOS.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/browse">
                <Button size="lg" className="bg-white text-black hover:bg-neutral-100">
                  Browse All Providers
                </Button>
              </Link>
              <Link href="/how-it-works">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 bg-transparent">
                  Learn How It Works
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  )
}
