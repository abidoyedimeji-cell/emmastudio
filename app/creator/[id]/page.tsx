import { Metadata } from "next"
import { notFound } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { UpcomingStudiosCarousel } from "@/components/upcoming-studios-carousel"
import {
  MapPin, Star, Calendar, Award, CheckCircle2, Heart, Camera, Video,
  Mic, Palette, ArrowLeft, Share2, Clock, Instagram, Globe, Users,
  Briefcase, Sparkles,
} from "lucide-react"

type Props = {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  const supabase = await createClient()
  
  const { data: creator } = await supabase
    .from("emma_creators")
    .select("display_name, specialty, city, short_bio, avatar_url, creator_type, rating, review_count")
    .eq("id", id)
    .single()

  if (!creator) {
    return { title: "Creator Not Found | EMMA STUDIOS" }
  }

  const creatorType = creator.creator_type?.replace("_", " ") || "Creator"
  const title = `${creator.display_name} | ${creatorType} in ${creator.city || "UK"} | Book Now | EMMA STUDIOS`
  const description = creator.short_bio || 
    `Book ${creator.display_name}, a professional ${creatorType.toLowerCase()} in ${creator.city || "UK"}. View portfolio, packages, availability and book instantly. ${creator.rating ? `Rated ${creator.rating}/5 from ${creator.review_count || 0} reviews.` : ""}`

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "profile",
      images: creator.avatar_url ? [{ url: creator.avatar_url }] : [],
      locale: "en_GB",
      siteName: "EMMA STUDIOS",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: creator.avatar_url ? [creator.avatar_url] : [],
    },
    alternates: {
      canonical: `https://emmastudios.com/creator/${id}`,
    },
  }
}

export default async function CreatorDetailPage({ params }: Props) {
  const { id } = await params
  const supabase = await createClient()

  // Try to fetch from database first
  const { data: dbCreator } = await supabase
    .from("emma_creators")
    .select(
      `
      *,
      packages:emma_packages(*),
      services:emma_services(*),
      faqs:emma_faqs(*),
      reviews:emma_reviews(*, reviewer:emma_profiles(full_name, avatar_url))
    `,
    )
    .eq("id", id)
    .single()

  if (!dbCreator) {
    notFound()
  }

  // Normalize data structure for display
  const creatorData = {
    id: dbCreator.id,
    name: dbCreator.display_name,
    type: dbCreator.creator_type,
    specialty: dbCreator.specialty,
    bio: dbCreator.bio,
    shortBio: dbCreator.short_bio,
    city: dbCreator.city,
    postcode: dbCreator.postcode,
    skills: dbCreator.skills || [],
    badges: dbCreator.badges || [],
    hourlyRate: dbCreator.hourly_rate,
    halfDayRate: dbCreator.half_day_rate,
    fullDayRate: dbCreator.full_day_rate,
    yearsExperience: dbCreator.years_experience,
    rating: dbCreator.rating,
    reviewCount: dbCreator.review_count,
    completedBookings: dbCreator.completed_bookings,
    returningClients: dbCreator.returning_clients,
    profileImage: dbCreator.avatar_url,
    coverImage: dbCreator.cover_image,
    portfolioImages: dbCreator.portfolio_images || [],
    portfolioVideos: dbCreator.portfolio_videos || [],
    instagramUrl: dbCreator.instagram_url,
    websiteUrl: dbCreator.website_url,
    isVerified: dbCreator.is_verified,
    isFeatured: dbCreator.is_featured,
    packages: dbCreator.packages || [],
    services: dbCreator.services || [],
    faqs: dbCreator.faqs || [],
    reviews: dbCreator.reviews || [],
  }

  const getCreatorIcon = (type: string) => {
    switch (type?.toLowerCase()) {
      case "photographer":
        return <Camera className="h-4 w-4" />
      case "videographer":
        return <Video className="h-4 w-4" />
      case "audio_engineer":
      case "audio engineer":
        return <Mic className="h-4 w-4" />
      case "editor":
        return <Palette className="h-4 w-4" />
      default:
        return <Sparkles className="h-4 w-4" />
    }
  }

  const getCreatorBorderColor = (type: string) => {
    switch (type?.toLowerCase()) {
      case "photographer":
        return "border-blue-500"
      case "videographer":
        return "border-purple-500"
      case "audio_engineer":
      case "audio engineer":
        return "border-red-500"
      case "editor":
        return "border-green-500"
      default:
        return "border-orange-500"
    }
  }

  const getCreatorTypeLabel = (type: string) => {
    switch (type?.toLowerCase()) {
      case "photographer":
        return "Photographer"
      case "videographer":
        return "Videographer"
      case "audio_engineer":
        return "Audio Engineer"
      case "editor":
        return "Editor"
      case "multi-discipline":
        return "Multi-Discipline"
      default:
        return type
    }
  }

  const getBadgeIcon = (badge: string | { icon?: string }) => {
    const iconName = typeof badge === "string" ? badge : badge.icon
    switch (iconName) {
      case "award":
        return <Award className="h-3 w-3 text-yellow-600" />
      case "star":
        return <Star className="h-3 w-3 text-yellow-600" />
      case "check":
        return <CheckCircle2 className="h-3 w-3 text-green-600" />
      case "top_rated":
        return <Star className="h-3 w-3 text-yellow-600" />
      case "verified":
        return <CheckCircle2 className="h-3 w-3 text-blue-600" />
      default:
        return <Sparkles className="h-3 w-3 text-purple-600" />
    }
  }

  const { data: dbStudios } = await supabase
    .from("emma_studios")
    .select("id, name, slug, cover_image, hourly_rate, rating, location, categories")
    .limit(6)

  const upcomingStudios = (dbStudios || []).map((studio) => ({
    id: studio.id,
    name: studio.name,
    type: studio.categories?.[0] || "Multi-Purpose",
    image: studio.cover_image || "/creative-studio.png",
    hourlyRate: studio.hourly_rate || 75,
    rating: studio.rating || 4.8,
    nextAvailable: "Tomorrow",
    packageName: "Half Day Package",
    packagePrice: (studio.hourly_rate || 75) * 3,
    packageDescription: "3 hours studio access with basic lighting setup included",
    city: studio.location || "London",
    slug: studio.slug,
  }))

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <SiteHeader />

      <main className="flex-1">
        {/* Cover Image */}
        {creatorData.coverImage && (
          <div className="relative h-32 md:h-48 lg:h-64 bg-neutral-100">
            <Image
              src={creatorData.coverImage || "/placeholder.svg"}
              alt={`${creatorData.name} cover`}
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          </div>
        )}

        {/* Main Content */}
        <section className="relative">
          {/* Added proper mobile padding and ensured max-width */}
          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-6 lg:py-8">
            <Link href="/creators">
              <Button variant="ghost" size="sm" className="mb-4 -ml-2">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Creators
              </Button>
            </Link>

            {/* Changed to vertical stacking on mobile, side-by-side on lg */}
            <div className="flex flex-col lg:grid lg:grid-cols-[320px_1fr] gap-6 lg:gap-10">
              {/* Left Sidebar - Creator Profile Card */}
              {/* Removed sticky positioning on mobile */}
              <div className="w-full space-y-4">
                <Card className="overflow-hidden border-0 shadow-lg lg:sticky lg:top-24">
                  {/* Profile Image */}
                  {/* Made border thinner on mobile */}
                  <div
                    className={`relative aspect-[4/5] border-2 md:border-4 rounded-t-xl overflow-hidden ${getCreatorBorderColor(creatorData.type)}`}
                  >
                    <Image
                      src={
                        creatorData.profileImage || "/placeholder.svg?height=400&width=320&query=professional creator"
                      }
                      alt={creatorData.name}
                      fill
                      className="object-cover"
                      priority
                    />

                    {/* Badges on image */}
                    {creatorData.badges && creatorData.badges.length > 0 && (
                      <div className="absolute top-2 left-2 md:top-3 md:left-3 flex flex-col gap-1.5 md:gap-2">
                        {creatorData.badges
                          .slice(0, 3)
                          .map((badge: string | { icon?: string; title?: string }, idx: number) => (
                            <div
                              key={idx}
                              className="flex items-center gap-1 md:gap-1.5 bg-white/95 backdrop-blur-sm rounded-full px-2 md:px-2.5 py-0.5 md:py-1 shadow-sm"
                            >
                              {getBadgeIcon(badge)}
                              <span className="text-[9px] md:text-[10px] font-semibold text-neutral-900 whitespace-nowrap">
                                {typeof badge === "string" ? badge : badge.title}
                              </span>
                            </div>
                          ))}
                      </div>
                    )}

                    {/* Favorite Button */}
                    <Button
                      size="icon"
                      variant="ghost"
                      className="absolute top-2 right-2 md:top-3 md:right-3 h-8 w-8 md:h-9 md:w-9 bg-white/95 backdrop-blur-sm hover:bg-white rounded-full"
                    >
                      <Heart className="h-4 w-4 md:h-5 md:w-5" />
                    </Button>

                    {/* Verified Badge */}
                    {creatorData.isVerified && (
                      <div className="absolute bottom-2 right-2 md:bottom-3 md:right-3 flex items-center gap-1 bg-blue-600 text-white rounded-full px-2 md:px-2.5 py-0.5 md:py-1">
                        <CheckCircle2 className="h-3 w-3" />
                        <span className="text-[9px] md:text-[10px] font-semibold whitespace-nowrap">Verified</span>
                      </div>
                    )}
                  </div>

                  {/* Profile Info - Black Section */}
                  <CardContent className="bg-black text-white p-4 md:p-5">
                    {/* Responsive text sizing and wrapping */}
                    <h1 className="text-lg md:text-xl font-bold mb-1 break-words">{creatorData.name}</h1>

                    <div className="flex items-center gap-2 text-xs md:text-sm text-white/70 mb-3">
                      <MapPin className="h-3 w-3 md:h-4 md:w-4 flex-shrink-0" />
                      <span className="break-words">
                        {creatorData.city}
                        {creatorData.postcode && `, ${creatorData.postcode}`}
                      </span>
                    </div>

                    {/* Type & Specialty */}
                    <div className="flex flex-wrap gap-1.5 md:gap-2 mb-4">
                      <Badge className="bg-white/20 text-white border-0 hover:bg-white/30 text-xs">
                        {getCreatorIcon(creatorData.type)}
                        <span className="ml-1">{getCreatorTypeLabel(creatorData.type)}</span>
                      </Badge>
                      {creatorData.specialty && (
                        <Badge className="bg-purple-500/80 text-white border-0 hover:bg-purple-500 text-xs">
                          {creatorData.specialty}
                        </Badge>
                      )}
                    </div>

                    {/* Stats Row */}
                    <div className="grid grid-cols-3 gap-2 py-3 border-t border-white/10 mb-4">
                      <div className="text-center">
                        <p className="text-base md:text-lg font-bold">{creatorData.rating || "5.0"}</p>
                        <p className="text-[9px] md:text-[10px] text-white/60">Rating</p>
                      </div>
                      <div className="text-center border-x border-white/10">
                        <p className="text-base md:text-lg font-bold">{creatorData.completedBookings || 0}</p>
                        <p className="text-[9px] md:text-[10px] text-white/60">Bookings</p>
                      </div>
                      <div className="text-center">
                        <p className="text-base md:text-lg font-bold">{creatorData.yearsExperience || 0}+</p>
                        <p className="text-[9px] md:text-[10px] text-white/60">Years</p>
                      </div>
                    </div>

                    {/* Pricing */}
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center justify-between text-xs md:text-sm">
                        <span className="text-white/70">Hourly Rate</span>
                        <span className="font-bold whitespace-nowrap">£{creatorData.hourlyRate || 50}/hr</span>
                      </div>
                      {creatorData.halfDayRate && (
                        <div className="flex items-center justify-between text-xs md:text-sm">
                          <span className="text-white/70">Half Day (3hrs)</span>
                          <span className="font-bold whitespace-nowrap">£{creatorData.halfDayRate}</span>
                        </div>
                      )}
                      {creatorData.fullDayRate && (
                        <div className="flex items-center justify-between text-xs md:text-sm">
                          <span className="text-white/70">Full Day (6hrs)</span>
                          <span className="font-bold whitespace-nowrap">£{creatorData.fullDayRate}</span>
                        </div>
                      )}
                    </div>

                    {/* Social Links */}
                    {(creatorData.instagramUrl || creatorData.websiteUrl) && (
                      <div className="flex gap-2 pt-3 border-t border-white/10">
                        {creatorData.instagramUrl && (
                          <a
                            href={creatorData.instagramUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center w-8 h-8 md:w-9 md:h-9 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                          >
                            <Instagram className="h-4 w-4" />
                          </a>
                        )}
                        {creatorData.websiteUrl && (
                          <a
                            href={creatorData.websiteUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center w-8 h-8 md:w-9 md:h-9 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                          >
                            <Globe className="h-4 w-4" />
                          </a>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Action Buttons */}
                {/* Made buttons full width on mobile */}
                <div className="w-full space-y-2">
                  <Link href={`/creator/${creatorData.id}/book`} className="block w-full">
                    <Button
                      className="w-full h-11 md:h-12 rounded-xl bg-black hover:bg-gray-800 text-white font-medium"
                      size="lg"
                    >
                      <Calendar className="h-4 w-4 mr-2" />
                      Book Now
                    </Button>
                  </Link>
                  <Button variant="outline" className="w-full h-11 md:h-12 rounded-xl bg-transparent" size="lg">
                    <Share2 className="h-4 w-4 mr-2" />
                    Share Profile
                  </Button>
                </div>
              </div>

              {/* Right Content Area */}
              {/* Ensured content area respects width on mobile */}
              <div className="w-full min-w-0 space-y-6 md:space-y-8">
                {/* Bio Section */}
                <section>
                  {/* Responsive heading sizing */}
                  <h2 className="text-xl md:text-2xl font-semibold mb-3 md:mb-4 break-words">
                    About {creatorData.name}
                  </h2>
                  {/* Better text wrapping */}
                  <p className="text-sm md:text-base text-neutral-600 leading-relaxed break-words whitespace-normal">
                    {creatorData.bio ||
                      `${creatorData.name} is a professional ${getCreatorTypeLabel(creatorData.type)?.toLowerCase()} based in ${creatorData.city}. With ${creatorData.yearsExperience || 0}+ years of experience in the creative industry, they specialize in ${creatorData.specialty || "creative content production"}.`}
                  </p>

                  {/* Quick Stats */}
                  {/* Better responsive grid and smaller cards on mobile */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mt-4 md:mt-6">
                    <div className="flex items-center gap-2 md:gap-3 p-3 md:p-4 bg-neutral-50 rounded-xl">
                      <div className="w-8 h-8 md:w-10 md:h-10 bg-yellow-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <Star className="h-4 w-4 md:h-5 md:w-5 text-yellow-600" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm md:text-base font-bold">{creatorData.rating || "5.0"}</p>
                        <p className="text-[10px] md:text-xs text-neutral-500 whitespace-nowrap">
                          {creatorData.reviewCount || 0} reviews
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 md:gap-3 p-3 md:p-4 bg-neutral-50 rounded-xl">
                      <div className="w-8 h-8 md:w-10 md:h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <Briefcase className="h-4 w-4 md:h-5 md:w-5 text-blue-600" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm md:text-base font-bold">{creatorData.completedBookings || 0}</p>
                        <p className="text-[10px] md:text-xs text-neutral-500 whitespace-nowrap">Completed</p>
                      </div>
                    </div>
                    {/* Better UX for zero returning clients */}
                    <div className="flex items-center gap-2 md:gap-3 p-3 md:p-4 bg-neutral-50 rounded-xl">
                      <div className="w-8 h-8 md:w-10 md:h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <Users className="h-4 w-4 md:h-5 md:w-5 text-green-600" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm md:text-base font-bold">{creatorData.returningClients || 0}</p>
                        <p className="text-[10px] md:text-xs text-neutral-500 whitespace-nowrap">
                          {creatorData.returningClients === 0 ? "New talent" : "Returning"}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 md:gap-3 p-3 md:p-4 bg-neutral-50 rounded-xl">
                      <div className="w-8 h-8 md:w-10 md:h-10 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <Clock className="h-4 w-4 md:h-5 md:w-5 text-purple-600" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm md:text-base font-bold">{creatorData.yearsExperience || 0}+</p>
                        <p className="text-[10px] md:text-xs text-neutral-500 whitespace-nowrap">Years exp.</p>
                      </div>
                    </div>
                  </div>
                </section>

                {/* Skills Section */}
                {creatorData.skills && creatorData.skills.length > 0 && (
                  <section>
                    <h3 className="text-base md:text-lg font-semibold mb-3">Skills & Expertise</h3>
                    <div className="flex flex-wrap gap-2">
                      {creatorData.skills.map((skill: string, idx: number) => (
                        <Badge
                          key={idx}
                          variant="outline"
                          className="px-2.5 md:px-3 py-1 md:py-1.5 text-xs md:text-sm bg-neutral-50 border-neutral-200"
                        >
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </section>
                )}

                {/* Tabs Section */}
                {/* Made tabs scrollable horizontally on mobile */}
                <Tabs defaultValue="portfolio" className="w-full">
                  <TabsList className="w-full justify-start border-b rounded-none h-auto p-0 bg-transparent overflow-x-auto flex-nowrap">
                    <TabsTrigger
                      value="portfolio"
                      className="rounded-none border-b-2 border-transparent data-[state=active]:border-black data-[state=active]:shadow-none px-3 md:px-4 py-2 md:py-3 text-xs md:text-sm whitespace-nowrap"
                    >
                      Portfolio
                    </TabsTrigger>
                    <TabsTrigger
                      value="services"
                      className="rounded-none border-b-2 border-transparent data-[state=active]:border-black data-[state=active]:shadow-none px-3 md:px-4 py-2 md:py-3 text-xs md:text-sm whitespace-nowrap"
                    >
                      Services
                    </TabsTrigger>
                    <TabsTrigger
                      value="packages"
                      className="rounded-none border-b-2 border-transparent data-[state=active]:border-black data-[state=active]:shadow-none px-3 md:px-4 py-2 md:py-3 text-xs md:text-sm whitespace-nowrap"
                    >
                      Packages
                    </TabsTrigger>
                    <TabsTrigger
                      value="reviews"
                      className="rounded-none border-b-2 border-transparent data-[state=active]:border-black data-[state=active]:shadow-none px-3 md:px-4 py-2 md:py-3 text-xs md:text-sm whitespace-nowrap"
                    >
                      Reviews
                    </TabsTrigger>
                    <TabsTrigger
                      value="faq"
                      className="rounded-none border-b-2 border-transparent data-[state=active]:border-black data-[state=active]:shadow-none px-3 md:px-4 py-2 md:py-3 text-xs md:text-sm whitespace-nowrap"
                    >
                      FAQ
                    </TabsTrigger>
                  </TabsList>

                  {/* Portfolio Tab */}
                  <TabsContent value="portfolio" className="mt-4 md:mt-6">
                    {/* Reduced portfolio grid size by 80% on mobile */}
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2 md:gap-3">
                      {(creatorData.portfolioImages.length > 0
                        ? creatorData.portfolioImages
                        : [1, 2, 3, 4, 5, 6].map(
                            (i) => `/placeholder.svg?height=300&width=300&query=creative work ${i}`,
                          )
                      ).map((image: string, idx: number) => (
                        <div
                          key={idx}
                          className="relative aspect-square rounded-lg md:rounded-xl overflow-hidden group cursor-pointer bg-neutral-100"
                        >
                          <Image
                            src={image || "/placeholder.svg"}
                            alt={`Portfolio work ${idx + 1}`}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-300" />
                        </div>
                      ))}
                    </div>
                  </TabsContent>

                  {/* Services Tab */}
                  <TabsContent value="services" className="mt-4 md:mt-6">
                    <div className="grid gap-4">
                      {(creatorData.services.length > 0
                        ? creatorData.services
                        : [
                            {
                              name: "Portrait Photography",
                              description: "Professional headshots and portraits",
                              base_price: 150,
                              category: "photography",
                            },
                            {
                              name: "Event Coverage",
                              description: "Full event documentation",
                              base_price: 300,
                              category: "photography",
                            },
                            {
                              name: "Product Photography",
                              description: "E-commerce and catalog shots",
                              base_price: 200,
                              category: "photography",
                            },
                          ]
                      ).map(
                        (
                          service: { name: string; description?: string; base_price?: number; category?: string },
                          idx: number,
                        ) => (
                          <Card key={idx} className="border-0 shadow-sm hover:shadow-md transition-shadow">
                            <CardContent className="p-5">
                              <div className="flex justify-between items-start">
                                <div className="flex-1">
                                  <h4 className="font-semibold text-lg mb-1">{service.name}</h4>
                                  <p className="text-sm text-neutral-500">{service.description}</p>
                                  {service.category && (
                                    <Badge variant="outline" className="mt-2 text-xs">
                                      {service.category}
                                    </Badge>
                                  )}
                                </div>
                                <div className="text-right">
                                  <p className="text-xl font-bold">£{service.base_price || 100}</p>
                                  <p className="text-xs text-neutral-500">starting price</p>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ),
                      )}
                    </div>
                  </TabsContent>

                  {/* Packages Tab */}
                  <TabsContent value="packages" className="mt-4 md:mt-6">
                    <div className="grid gap-4">
                      {(creatorData.packages.length > 0
                        ? creatorData.packages
                        : [
                            {
                              name: "Essential Session",
                              description: "Perfect for quick projects and headshots",
                              price: 150,
                              duration_hours: 1,
                              includes: ["1 hour session", "10 edited images", "Online gallery", "48hr turnaround"],
                              is_popular: false,
                            },
                            {
                              name: "Professional Package",
                              description: "Our most popular option for comprehensive coverage",
                              price: 350,
                              duration_hours: 3,
                              includes: [
                                "3 hour session",
                                "30 edited images",
                                "Online gallery",
                                "Outfit changes",
                                "24hr turnaround",
                              ],
                              is_popular: true,
                            },
                            {
                              name: "Premium Experience",
                              description: "Full day creative session with all deliverables",
                              price: 600,
                              duration_hours: 6,
                              includes: [
                                "6 hour session",
                                "60 edited images",
                                "Online gallery",
                                "Multiple locations",
                                "Same day preview",
                                "Print-ready files",
                              ],
                              is_popular: false,
                            },
                          ]
                      ).map(
                        (
                          pkg: {
                            name: string
                            description?: string
                            price: number
                            duration_hours?: number
                            duration?: number
                            includes?: string[]
                            deliverables?: string[]
                            is_popular?: boolean
                          },
                          idx: number,
                        ) => (
                          <Card
                            key={idx}
                            className={`border-0 shadow-sm hover:shadow-md transition-shadow overflow-hidden ${pkg.is_popular ? "ring-2 ring-black" : ""}`}
                          >
                            {pkg.is_popular && (
                              <div className="bg-black text-white text-xs font-medium py-1 px-4 text-center">
                                Most Popular
                              </div>
                            )}
                            <CardContent className="p-6">
                              <div className="flex justify-between items-start mb-4">
                                <div>
                                  <h4 className="font-semibold text-xl mb-1">{pkg.name}</h4>
                                  <p className="text-sm text-neutral-500">{pkg.description}</p>
                                </div>
                                <div className="text-right">
                                  <p className="text-3xl font-bold">£{pkg.price}</p>
                                  <p className="text-sm text-neutral-500">
                                    {pkg.duration_hours || pkg.duration}hr session
                                  </p>
                                </div>
                              </div>
                              <div className="space-y-2 mb-5">
                                {(pkg.includes || pkg.deliverables || []).map((item: string, i: number) => (
                                  <div key={i} className="flex items-center gap-2 text-sm">
                                    <CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0" />
                                    <span>{item}</span>
                                  </div>
                                ))}
                              </div>
                              <Link href={`/creator/${creatorData.id}/book?package=${encodeURIComponent(pkg.name)}`}>
                                <Button
                                  className={`w-full h-11 rounded-xl ${pkg.is_popular ? "bg-black hover:bg-gray-800" : "bg-neutral-100 text-black hover:bg-neutral-200"}`}
                                >
                                  Book This Package
                                </Button>
                              </Link>
                            </CardContent>
                          </Card>
                        ),
                      )}
                    </div>
                  </TabsContent>

                  {/* Reviews Tab */}
                  <TabsContent value="reviews" className="mt-4 md:mt-6">
                    {creatorData.reviews.length > 0 ? (
                      <div className="space-y-4">
                        {creatorData.reviews.map(
                          (
                            review: {
                              id: string
                              rating: number
                              title?: string
                              content?: string
                              created_at: string
                              reviewer?: { full_name?: string; avatar_url?: string }
                            },
                            idx: number,
                          ) => (
                            <Card key={idx} className="border-0 shadow-sm">
                              <CardContent className="p-5">
                                <div className="flex items-start gap-4">
                                  <div className="w-10 h-10 rounded-full bg-neutral-100 flex items-center justify-center overflow-hidden">
                                    {review.reviewer?.avatar_url ? (
                                      <Image
                                        src={review.reviewer.avatar_url || "/placeholder.svg"}
                                        alt={review.reviewer?.full_name || "Reviewer"}
                                        width={40}
                                        height={40}
                                        className="object-cover"
                                      />
                                    ) : (
                                      <span className="text-sm font-medium">
                                        {review.reviewer?.full_name?.charAt(0) || "A"}
                                      </span>
                                    )}
                                  </div>
                                  <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                      <p className="font-medium">{review.reviewer?.full_name || "Anonymous"}</p>
                                      <div className="flex">
                                        {[...Array(5)].map((_, i) => (
                                          <Star
                                            key={i}
                                            className={`h-3 w-3 ${i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-neutral-200"}`}
                                          />
                                        ))}
                                      </div>
                                    </div>
                                    {review.title && <p className="font-medium text-sm mb-1">{review.title}</p>}
                                    <p className="text-sm text-neutral-600">{review.content}</p>
                                    <p className="text-xs text-neutral-400 mt-2">
                                      {new Date(review.created_at).toLocaleDateString("en-GB", {
                                        month: "short",
                                        year: "numeric",
                                      })}
                                    </p>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          ),
                        )}
                      </div>
                    ) : (
                      <div className="text-center py-8 md:py-12 bg-neutral-50 rounded-xl">
                        <Star className="h-10 w-10 md:h-12 md:w-12 text-neutral-300 mx-auto mb-3" />
                        <p className="text-neutral-500">No reviews yet</p>
                        <p className="text-sm text-neutral-400">Be the first to leave a review!</p>
                      </div>
                    )}
                  </TabsContent>

                  {/* FAQ Tab */}
                  <TabsContent value="faq" className="mt-4 md:mt-6">
                    <Accordion type="single" collapsible className="w-full">
                      {(creatorData.faqs.length > 0
                        ? creatorData.faqs
                        : [
                            {
                              question: "What is your cancellation policy?",
                              answer:
                                "Cancellations made 48+ hours before the session receive a full refund of the deposit. Cancellations within 48 hours forfeit 50% of the deposit. No-shows forfeit the full deposit.",
                            },
                            {
                              question: "How long until I receive my final images?",
                              answer:
                                "Turnaround time depends on the package selected. Essential sessions are delivered within 48 hours, Professional packages within 24 hours, and Premium sessions include same-day preview with full gallery within 72 hours.",
                            },
                            {
                              question: "Do you provide props and equipment?",
                              answer:
                                "Yes! All sessions include professional lighting and basic props. Additional specialized equipment or props can be arranged for an extra fee - just let me know what you need.",
                            },
                            {
                              question: "Can I bring a friend or family member to the shoot?",
                              answer:
                                "You're welcome to bring one support person to help you feel comfortable. Additional subjects in the photos may require an upgraded package.",
                            },
                          ]
                      ).map((faq: { question: string; answer: string }, idx: number) => (
                        <AccordionItem key={idx} value={`faq-${idx}`} className="border-b">
                          <AccordionTrigger className="text-left hover:no-underline py-4">
                            {faq.question}
                          </AccordionTrigger>
                          <AccordionContent className="text-neutral-600 pb-4">{faq.answer}</AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  </TabsContent>
                </Tabs>

                <div className="mt-8 md:mt-12 pt-6 md:pt-8 border-t">
                  <UpcomingStudiosCarousel studios={upcomingStudios} title="Available Studios to Book With" />
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  )
}
