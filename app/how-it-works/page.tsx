import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"
import Image from "next/image"
import {
  Search,
  Calendar,
  CreditCard,
  CheckCircle2,
  Users,
  Shield,
  TrendingDown,
  Package,
  Gift,
  UserPlus,
} from "lucide-react"

export const metadata = {
  title: "How It Works - EMMA STUDIOS | Book Photography & Videography Studios",
  description:
    "Learn how to book professional photography studios, videography spaces, and creative professionals. Simple booking process with vetted studios, better pricing, and loyalty rewards.",
}

export default function HowItWorksPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-secondary py-20 border-b">
          <div className="container text-center">
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-balance">
              How EMMA STUDIOS Works
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Book professional photography studios, videography spaces, and creative professionals in four simple
              steps. From discovery to confirmation, we make studio rental and photographer hire seamless.
            </p>
          </div>
        </section>

        {/* Steps Section */}
        <section className="py-20">
          <div className="container">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              <Card className="text-center">
                <CardContent className="pt-8 pb-6">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Search className="h-8 w-8 text-primary" />
                  </div>
                  <div className="text-4xl font-bold text-primary mb-2">01</div>
                  <h3 className="font-serif text-xl font-semibold mb-3 text-balance">Browse Studios & Creators</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Search our curated collection of photography studios, videography spaces, and professional creators.
                    Filter by location, specialty, price, and amenities to find your perfect match.
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardContent className="pt-8 pb-6">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Calendar className="h-8 w-8 text-primary" />
                  </div>
                  <div className="text-4xl font-bold text-primary mb-2">02</div>
                  <h3 className="font-serif text-xl font-semibold mb-3 text-balance">Select Date & Time</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    View real-time availability on our interactive calendar. Choose your preferred date, time slot, and
                    package. Book by the hour, half-day, or full-day sessions.
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardContent className="pt-8 pb-6">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CreditCard className="h-8 w-8 text-primary" />
                  </div>
                  <div className="text-4xl font-bold text-primary mb-2">03</div>
                  <h3 className="font-serif text-xl font-semibold mb-3 text-balance">Secure Payment</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Complete your booking with secure payment processing via Stripe. Instant confirmation and receipt
                    sent to your email. Protected transactions guaranteed.
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardContent className="pt-8 pb-6">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle2 className="h-8 w-8 text-primary" />
                  </div>
                  <div className="text-4xl font-bold text-primary mb-2">04</div>
                  <h3 className="font-serif text-xl font-semibold mb-3 text-balance">Create & Enjoy</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Receive booking confirmation with studio details and calendar invite. Sync with Google Calendar or
                    Outlook. Show up ready to create amazing content.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <section className="py-20 md:py-32">
          <div className="container max-w-6xl">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              <Card className="text-center border-border/50">
                <CardContent className="pt-8 pb-6">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Search className="h-8 w-8 text-primary" />
                  </div>
                  <div className="text-4xl font-semibold text-primary mb-2">01</div>
                  <h3 className="text-xl font-semibold mb-3 text-balance">Browse & Discover</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    Search vetted photography studios, videography spaces, and professional creators. Filter by
                    location, specialty, and price.
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center border-border/50">
                <CardContent className="pt-8 pb-6">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Calendar className="h-8 w-8 text-primary" />
                  </div>
                  <div className="text-4xl font-semibold text-primary mb-2">02</div>
                  <h3 className="text-xl font-semibold mb-3 text-balance">Select & Schedule</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    Choose your creator, services, and studio. Pick duration (3h/6h) and date. See real-time
                    availability instantly.
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center border-border/50">
                <CardContent className="pt-8 pb-6">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                    <UserPlus className="h-8 w-8 text-primary" />
                  </div>
                  <div className="text-4xl font-semibold text-primary mb-2">03</div>
                  <h3 className="text-xl font-semibold mb-3 text-balance">Create Account</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    Sign up to manage bookings, track projects, earn loyalty points, and access exclusive member
                    benefits.
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center border-border/50">
                <CardContent className="pt-8 pb-6">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CreditCard className="h-8 w-8 text-primary" />
                  </div>
                  <div className="text-4xl font-semibold text-primary mb-2">04</div>
                  <h3 className="text-xl font-semibold mb-3 text-balance">Pay & Confirm</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    50% deposit or flat rate secures your booking. Funds held safely. Calendars auto-blocked. Instant
                    confirmation.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <section className="bg-secondary/30 py-20 md:py-32 border-y">
          <div className="container max-w-6xl">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-semibold tracking-tight mb-4 text-balance">
                Why Users Choose EMMA STUDIOS
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                The most trusted platform for creative space bookings
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="flex gap-4">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center shrink-0">
                  <Shield className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">Vetted Studios & Creators</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    Every studio and creator undergoes thorough verification. Quality and professionalism guaranteed on
                    every booking.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center shrink-0">
                  <TrendingDown className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">Better Pricing</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    Save up to 30% compared to other booking platforms. Transparent, fixed pricing with studio discounts
                    built in.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center shrink-0">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">Easy Coordination</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    Book creators and studios together seamlessly. Automated calendar sync, meeting links, and all-party
                    notifications.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center shrink-0">
                  <Package className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">Fixed Packages</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    Clear pricing for studio time and deliverables. No hidden fees. Request additional services anytime.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center shrink-0">
                  <Gift className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">Loyalty & Referral Rewards</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    Earn points on every booking. Refer friends for bonuses. Unlock exclusive savings and member-only
                    perks.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center shrink-0">
                  <CheckCircle2 className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">Secure & Reliable</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    Escrow payment protection. Automatic calendar blocking. Digital terms acceptance. No surprises.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Use Cases Section */}
        <section className="py-20">
          <div className="container">
            <div className="text-center mb-16">
              <h2 className="font-serif text-3xl md:text-4xl font-bold mb-4 text-balance">
                Perfect For Every Creative Project
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                Whether you're a professional photographer, content creator, brand, or business, EMMA STUDIOS has the
                perfect space and talent for your needs.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  title: "Commercial Photography",
                  description:
                    "Book professional photography studios for product shoots, e-commerce photography, catalog production, and brand campaigns.",
                },
                {
                  title: "Portrait & Headshot Sessions",
                  description:
                    "Rent portrait studios with professional lighting for headshots, family portraits, personal branding, and professional photography.",
                },
                {
                  title: "Video Production",
                  description:
                    "Access videography studios with green screens, interview setups, podcast recording spaces, and video content production facilities.",
                },
                {
                  title: "Fashion & Editorial",
                  description:
                    "Book fashion photography studios for lookbooks, editorial shoots, runway photography, and model portfolio development.",
                },
                {
                  title: "Content Creation",
                  description:
                    "Rent creator studios for social media content, YouTube videos, TikTok production, and influencer photography sessions.",
                },
                {
                  title: "Event Photography",
                  description:
                    "Hire professional photographers and videographers for weddings, corporate events, conferences, and special occasions.",
                },
              ].map((useCase) => (
                <Card key={useCase.title}>
                  <CardContent className="p-6">
                    <h3 className="font-semibold text-lg mb-2 text-balance">{useCase.title}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">{useCase.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 md:py-32">
          <div className="container max-w-6xl">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-semibold tracking-tight mb-4 text-balance">
                Perfect For Every Creative Project
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                From commercial shoots to personal projects, we've got you covered
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  title: "Commercial Photography",
                  image: "/professional-commercial-product-photography-studio.jpg",
                  description:
                    "Product shoots, e-commerce, catalog production, and brand campaigns with professional lighting.",
                },
                {
                  title: "Portrait & Headshots",
                  image: "/professional-portrait-headshot-photography-session.jpg",
                  description:
                    "Family portraits, corporate headshots, personal branding, and professional photography sessions.",
                },
                {
                  title: "Video Production",
                  image: "/professional-video-production-studio-green-screen.jpg",
                  description:
                    "Interviews, podcasts, YouTube content, and commercial video production with complete setups.",
                },
                {
                  title: "Fashion & Editorial",
                  image: "/fashion-editorial-photography-runway-shoot.jpg",
                  description:
                    "Lookbooks, editorial shoots, runway photography, and model portfolio development sessions.",
                },
                {
                  title: "Content Creation",
                  image: "/social-media-content-creation-studio-influencer.jpg",
                  description: "Social media content, TikTok production, Instagram reels, and influencer photography.",
                },
                {
                  title: "Event Coverage",
                  image: "/wedding-event-photography-videography-coverage.jpg",
                  description:
                    "Weddings, corporate events, conferences, and special occasion photography and videography.",
                },
              ].map((project) => (
                <Card
                  key={project.title}
                  className="overflow-hidden group hover:shadow-lg transition-all border-border/50"
                >
                  <div className="relative w-full aspect-[4/3]">
                    <Image
                      src={project.image || "/placeholder.svg"}
                      alt={project.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                  </div>
                  <CardContent className="p-6">
                    <h3 className="font-semibold text-lg mb-2 text-balance">{project.title}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">{project.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-primary text-primary-foreground py-20 md:py-32">
          <div className="container text-center max-w-4xl">
            <h2 className="font-serif text-3xl md:text-4xl font-bold mb-6 text-balance">Ready to Book Your Studio?</h2>
            <p className="text-lg opacity-90 max-w-2xl mx-auto mb-8 leading-relaxed">
              Browse hundreds of professional photography studios, videography spaces, and creative professionals. Find
              your perfect match and book instantly.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/browse">
                <Button
                  size="lg"
                  variant="secondary"
                  className="bg-background text-foreground hover:bg-background/90 rounded-full px-8"
                >
                  Browse Studios
                </Button>
              </Link>
              <Link href="/creators">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-background/20 text-background hover:bg-background hover:text-foreground bg-transparent rounded-full px-8"
                >
                  Find Creators
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
