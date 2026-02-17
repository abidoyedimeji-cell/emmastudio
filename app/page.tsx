import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { BookingSearchBar } from "@/components/booking-search-bar"
import { getStudios, getStudioCount } from "@/lib/data/studios"
import { getCreators, getCreatorCount } from "@/lib/data/creators"
import {
  Star,
  MapPin,
  ArrowRight,
  Shield,
  TrendingDown,
  Users,
  Clock,
  Gift,
  CheckCircle2,
  Award,
  Heart,
} from "lucide-react"

export const metadata = {
  title: "Hire Photography, Videography and Audio Creative Studio and Creators | EMMA STUDIOS",
  description:
    "Find top photographers, videographers, and audio engineers. Book flexible studio spaces with seamless online booking, deposits, and instant confirmation. Affordable packages and trusted creator portfolios.",
}

export default async function HomePage() {
  const [featuredStudios, featuredCreators, studioCount, creatorCount] = await Promise.all([
    getStudios({ limit: 6, featured: true }),
    getCreators({ limit: 6, featured: true }),
    getStudioCount(),
    getCreatorCount(),
  ])

  // Featured works: combine top studio cover images and creator avatars
  const recentWorks = [
    ...featuredStudios.slice(0, 4).map((s) => ({
      id: s.id,
      title: s.name,
      creator: s.city || "London",
      image: s.cover_image,
    })),
    ...featuredCreators.slice(0, 3).map((c) => ({
      id: c.id,
      title: c.specialty || c.creator_type || "Creative",
      creator: c.display_name,
      image: c.avatar_url,
    })),
  ]

  const getCreatorBorderColor = (type: string | null) => {
    switch (type) {
      case "audio_engineer":
      case "music_producer":
        return "border-blue-500"
      case "photographer":
        return "border-green-500"
      case "videographer":
        return "border-yellow-500"
      default:
        return "border-purple-500"
    }
  }

  const getSpecialtyColor = (specialty: string) => {
    const lower = specialty.toLowerCase()
    if (lower.includes("photo")) return "bg-blue-500/20 text-blue-300 border-blue-500/30"
    if (lower.includes("video")) return "bg-purple-500/20 text-purple-300 border-purple-500/30"
    if (lower.includes("audio") || lower.includes("music") || lower.includes("sound")) return "bg-red-500/20 text-red-300 border-red-500/30"
    return "bg-green-500/20 text-green-300 border-green-500/30"
  }

  const getStudioTypeLabel = (type: string | null) => {
    switch (type) {
      case "audio": return "Audio Studio"
      case "visual": return "Visual Studio"
      case "multi-purpose": return "Multi-Purpose"
      default: return "Studio"
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-background pt-14">
      <SiteHeader />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative py-8 sm:py-10 md:py-12 lg:py-20">
          <div className="container max-w-6xl px-4 sm:px-6">
            <div className="text-center">
              <h1 className="text-2xl sm:text-2xl md:text-3xl lg:text-4xl font-semibold tracking-tighter text-balance mb-3 sm:mb-4 leading-[1.1]">
                Book creative studios or hire creators for your next project
              </h1>
              <p className="text-sm sm:text-base md:text-lg text-muted-foreground max-w-3xl mx-auto mb-6 sm:mb-8 leading-relaxed px-4">
                Search by date, time, and location to find available photographers, videographers, audio engineers, and
                studio spaces
              </p>

              <div className="mb-6">
                <BookingSearchBar />
              </div>

              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 justify-center px-4">
                <Link href="/how-it-works">
                  <Button
                    size="lg"
                    variant="ghost"
                    className="rounded-full px-5 sm:px-6 text-xs sm:text-sm h-9 sm:h-10 hover:bg-secondary w-full sm:w-auto"
                  >
                    Learn more
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Recent Works from real data */}
        {recentWorks.length > 0 && (
          <section className="py-5 sm:py-7 overflow-hidden">
            <div className="container max-w-7xl px-4 sm:px-6">
              <h2 className="text-base sm:text-lg md:text-xl font-semibold tracking-tight mb-3 sm:mb-4 md:mb-5">
                Recent Works
              </h2>
              <div className="relative">
                <div className="flex gap-2 sm:gap-3 overflow-x-auto pb-3 snap-x snap-mandatory scrollbar-hide">
                  {recentWorks.map((work) => (
                    <div key={work.id} className="flex-shrink-0 w-[85vw] sm:w-[70vw] md:w-[600px] snap-center">
                      <div className="relative aspect-[16/9] rounded-lg sm:rounded-xl overflow-hidden group">
                        <Image
                          src={work.image || "/placeholder.svg"}
                          alt={work.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                        <div className="absolute bottom-2 sm:bottom-3 left-2 sm:left-3 right-2 sm:right-3">
                          <h3 className="text-white font-semibold text-sm sm:text-base">{work.title}</h3>
                          <p className="text-white/70 text-xs">by {work.creator}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Why EMMA Studios */}
        <section className="py-8 sm:py-10 md:py-14 bg-secondary/30">
          <div className="container max-w-6xl px-4 sm:px-6">
            <div className="text-center mb-5 sm:mb-7 md:mb-8">
              <h2 className="text-lg sm:text-xl md:text-2xl font-semibold tracking-tight mb-1 sm:mb-2">
                Find Top Photographers, Videographers, and Audio Engineers
              </h2>
              <p className="text-xs sm:text-sm text-muted-foreground max-w-2xl mx-auto px-4">
                Browse professional creators or book studio spaces for your next project
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
              <div className="text-center p-3 sm:p-4 rounded-lg sm:rounded-xl bg-background/50 border border-border/50">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-1 sm:mb-2">
                  <Shield className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                </div>
                <h3 className="text-sm sm:text-base font-semibold mb-1">Portfolio Showcases from Trusted Creators</h3>
                <p className="text-xs text-muted-foreground">
                  Every studio and creator is thoroughly verified for quality and professionalism
                </p>
              </div>

              <div className="text-center p-3 sm:p-4 rounded-lg sm:rounded-xl bg-background/50 border border-border/50">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-1 sm:mb-2">
                  <TrendingDown className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                </div>
                <h3 className="text-sm sm:text-base font-semibold mb-1">Affordable Packages and Custom Services</h3>
                <p className="text-xs text-muted-foreground">
                  Up to 30% cheaper than other platforms with transparent, fixed package pricing
                </p>
              </div>

              <div className="text-center p-3 sm:p-4 rounded-lg sm:rounded-xl bg-background/50 border border-border/50">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-1 sm:mb-2">
                  <Users className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                </div>
                <h3 className="text-sm sm:text-base font-semibold mb-1">Seamless Online Booking</h3>
                <p className="text-xs text-muted-foreground">
                  50% deposit secures your booking with instant confirmation and calendar sync
                </p>
              </div>

              <div className="text-center p-3 sm:p-4 rounded-lg sm:rounded-xl bg-background/50 border border-border/50">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-1 sm:mb-2">
                  <Clock className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                </div>
                <h3 className="text-sm sm:text-base font-semibold mb-1">Fixed Time Packages</h3>
                <p className="text-xs text-muted-foreground">
                  Clear 3-hour and 6-hour packages for studio time and deliverables
                </p>
              </div>

              <div className="text-center p-3 sm:p-4 rounded-lg sm:rounded-xl bg-background/50 border border-border/50">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-1 sm:mb-2">
                  <Gift className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                </div>
                <h3 className="text-sm sm:text-base font-semibold mb-1">Client Testimonials</h3>
                <p className="text-xs text-muted-foreground">
                  Read verified reviews from real clients who have worked with our creators
                </p>
              </div>

              <div className="text-center p-3 sm:p-4 rounded-lg sm:rounded-xl bg-background/50 border border-border/50">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-1 sm:mb-2">
                  <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                </div>
                <h3 className="text-sm sm:text-base font-semibold mb-1">Book in Minutes</h3>
                <p className="text-xs text-muted-foreground">
                  Real-time availability with instant confirmation and automatic calendar sync
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section - real counts */}
        <section className="py-10 md:py-12">
          <div className="container max-w-6xl px-6">
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <h3 className="text-2xl md:text-3xl font-semibold mb-1">{studioCount}+</h3>
                <p className="text-sm text-muted-foreground">Creative spaces</p>
              </div>
              <div className="text-center">
                <h3 className="text-2xl md:text-3xl font-semibold mb-1">{creatorCount}+</h3>
                <p className="text-sm text-muted-foreground">Professional creators</p>
              </div>
              <div className="text-center">
                <h3 className="text-2xl md:text-3xl font-semibold mb-1">4.9</h3>
                <p className="text-sm text-muted-foreground">Average rating</p>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Studios & Creators */}
        <section className="py-10 sm:py-12 md:py-16 bg-secondary/20">
          <div className="container max-w-7xl px-4 sm:px-6">
            <div className="flex flex-col gap-3 mb-8 sm:mb-10 md:mb-12">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold tracking-tight">
                Featured Studios and Creators
              </h2>
              <p className="text-sm sm:text-base text-muted-foreground max-w-2xl">
                Browse our top-rated creative studios and talented creators
              </p>
              <Link href="/all" className="w-fit">
                <Button variant="ghost" className="gap-2 hover:bg-secondary rounded-full h-9 px-4 text-sm">
                  View all <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>

            {/* Studios */}
            <div className="mb-10 sm:mb-12 md:mb-16">
              <div className="flex flex-col gap-3 mb-6 sm:mb-8 md:mb-10">
                <h3 className="text-xl sm:text-2xl md:text-3xl font-semibold tracking-tight">Featured Studio Spaces</h3>
                <p className="text-xs sm:text-sm md:text-base text-muted-foreground max-w-2xl">
                  Professional studios for photography, videography, and audio production
                </p>
                <Link href="/studios" className="w-fit">
                  <Button variant="ghost" className="gap-2 hover:bg-secondary rounded-full h-8 px-4 text-xs sm:text-sm">
                    View all <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {featuredStudios.slice(0, 3).map((studio) => (
                  <Link key={studio.id} href={`/studio/${studio.slug}`}>
                    <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 h-full flex flex-col border-border/50 group rounded-2xl">
                      <div className="relative w-full aspect-[4/3] overflow-hidden">
                        <Image
                          src={studio.cover_image || "/placeholder.svg"}
                          alt={studio.name}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        />
                      </div>
                      <CardContent className="p-5 flex-1 flex flex-col bg-black text-white">
                        <h3 className="text-lg font-semibold mb-2 tracking-tight">{studio.name}</h3>
                        <div className="flex items-center gap-2 text-xs text-white/70 mb-3">
                          <MapPin className="h-3.5 w-3.5" />
                          <span>{studio.city}, {studio.postcode}</span>
                        </div>
                        <div className="flex flex-wrap gap-2 mb-auto">
                          <span className="text-xs px-2.5 py-1 rounded-full bg-white/20 text-white font-medium">
                            {getStudioTypeLabel(studio.studio_type)}
                          </span>
                          <span className="text-xs px-2.5 py-1 rounded-full bg-white/10 text-white font-medium">
                            {studio.size}
                          </span>
                        </div>
                        <div className="flex gap-1.5 my-3">
                          {(studio.gallery_images || []).slice(0, 3).map((img: string, idx: number) => (
                            <div
                              key={idx}
                              className="relative w-5 h-5 rounded-full overflow-hidden border border-white/30 flex-shrink-0"
                            >
                              <Image
                                src={img || "/placeholder.svg"}
                                alt={`Gallery ${idx + 1}`}
                                fill
                                className="object-cover"
                                sizes="20px"
                              />
                            </div>
                          ))}
                        </div>
                        <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/20">
                          <div className="flex items-center gap-1.5">
                            <Star className="h-3.5 w-3.5 fill-white text-white" />
                            <span className="font-semibold text-sm">{studio.rating}</span>
                            <span className="text-xs text-white/70">({studio.review_count})</span>
                          </div>
                          <span className="text-sm font-semibold">{"\u00A3"}{studio.half_day_rate}/3h</span>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>

            {/* Creators */}
            <div>
              <div className="flex flex-col gap-3 mb-6 sm:mb-8 md:mb-10">
                <h3 className="text-xl sm:text-2xl md:text-3xl font-semibold tracking-tight">Featured Creators</h3>
                <p className="text-xs sm:text-sm md:text-base text-muted-foreground max-w-2xl">
                  Top-rated photographers, videographers, and audio engineers
                </p>
                <Link href="/creators" className="w-fit">
                  <Button variant="ghost" className="gap-2 hover:bg-secondary rounded-full h-8 px-4 text-xs sm:text-sm">
                    View all <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {featuredCreators.map((creator) => {
                  const portfolioImages: string[] = creator.portfolio_images || []
                  const skills: string[] = creator.skills || []
                  const firstSkill = creator.specialty || creator.creator_type?.replace("_", " ") || "Multi-Discipline"

                  return (
                    <Link key={creator.id} href={`/creator/${creator.id}`}>
                      <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 h-full flex flex-col border-border/50 group rounded-2xl">
                        <div className="relative w-full aspect-[3/2] overflow-hidden">
                          <div className={`absolute inset-0 p-1 ${getCreatorBorderColor(creator.creator_type)}`}>
                            <div className="relative w-full h-full rounded-xl overflow-hidden">
                              <Image
                                src={creator.avatar_url || "/placeholder.svg"}
                                alt={creator.display_name}
                                fill
                                className="object-cover group-hover:scale-105 transition-transform duration-300"
                                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                              />
                              <button className="absolute right-2 top-2 w-8 h-8 rounded-full bg-black/60 hover:bg-black/80 transition-colors flex items-center justify-center">
                                <Heart className="h-4 w-4 text-white" />
                              </button>
                            </div>
                          </div>
                        </div>

                        <CardContent className="p-4 flex-1 flex flex-col bg-black text-white">
                          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-black border border-white/20 mb-2 w-fit">
                            <span className="text-sm font-semibold">{creator.display_name}</span>
                            <span className="text-xs text-white/50">{"\\u2022"}</span>
                            <div className="flex items-center gap-1">
                              <MapPin className="h-3 w-3 text-white/70" />
                              <span className="text-xs text-white/70">{creator.city || "London"}</span>
                            </div>
                          </div>

                          <div className="flex flex-wrap gap-1 mb-3">
                            {skills.slice(0, 3).map((skill: string, idx: number) => (
                              <span
                                key={idx}
                                className={`text-xs px-2 py-0.5 rounded-full border ${getSpecialtyColor(skill)}`}
                              >
                                {skill}
                              </span>
                            ))}
                          </div>

                          <div className="flex gap-1.5 mb-3">
                            {portfolioImages.slice(0, 3).map((img: string, idx: number) => (
                              <div
                                key={idx}
                                className="relative w-5 h-5 rounded-full overflow-hidden border border-white/30 flex-shrink-0"
                              >
                                <Image
                                  src={img || "/placeholder.svg"}
                                  alt={`Work ${idx + 1}`}
                                  fill
                                  className="object-cover"
                                  sizes="20px"
                                />
                              </div>
                            ))}
                          </div>

                          <div className="flex items-center justify-between mt-auto pt-3 border-t border-white/20">
                            <div className="flex items-center gap-1 text-xs text-white/70">
                              <Award className="h-3 w-3" />
                              <span>{creator.years_experience || 0}+ years</span>
                            </div>
                            <span className="text-sm font-semibold">From {"\u00A3"}{creator.hourly_rate}/hr</span>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  )
                })}
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 md:py-28">
          <div className="container max-w-4xl px-6 text-center">
            <h2 className="text-3xl md:text-4xl font-semibold tracking-tight mb-4">Ready to create?</h2>
            <p className="text-base text-muted-foreground max-w-2xl mx-auto mb-8">
              Join thousands of creators and clients who trust EMMA Studios for their creative projects.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/all">
                <Button size="lg" className="rounded-full px-8">
                  Browse Studios & Creators
                </Button>
              </Link>
              <Link href="/signup">
                <Button size="lg" variant="outline" className="rounded-full px-8 bg-transparent">
                  List Your Space
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
