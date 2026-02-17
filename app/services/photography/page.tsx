import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"
import Image from "next/image"
import { Camera, Clock, Package, CheckCircle2, Star } from "lucide-react"

export const metadata = {
  title: "Photography Services: Packages and Studio Options | EMMA STUDIOS",
  description:
    "Professional photography services with 3-hour and 6-hour packages. Book photographers and studio spaces for commercial, portrait, fashion, and event photography. Studio props and equipment included.",
}

export default function PhotographyServicesPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-24 md:py-32">
          <div className="container max-w-5xl px-6">
            <div className="text-center">
              <h1 className="text-5xl md:text-7xl font-semibold tracking-tighter text-balance mb-6">
                Photography Services: Packages and Studio Options
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-12 leading-relaxed">
                Book professional photographers with flexible 3-hour and 6-hour packages. Optional studio spaces with
                props and equipment included.
              </p>
              <Link href="/all?type=photographer">
                <Button size="lg" className="rounded-full px-8">
                  Browse Photographers
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Package Options */}
        <section className="py-20 md:py-32 bg-secondary/30">
          <div className="container max-w-6xl px-6">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-semibold tracking-tight mb-4">Fixed Time Packages</h2>
              <p className="text-lg text-muted-foreground">Choose the perfect package for your project</p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              <Card className="border-2">
                <CardContent className="p-8">
                  <div className="text-center mb-6">
                    <Clock className="h-12 w-12 mx-auto mb-4 text-primary" />
                    <h3 className="text-3xl font-semibold mb-2">3-Hour Package</h3>
                    <p className="text-muted-foreground">Perfect for quick shoots</p>
                  </div>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                      <span>3 hours with professional photographer</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                      <span>Optional studio space (additional cost)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                      <span>20-30 edited photos delivered</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                      <span>Basic color correction included</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                      <span>7-day delivery turnaround</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-2 border-primary">
                <CardContent className="p-8">
                  <div className="text-center mb-6">
                    <Clock className="h-12 w-12 mx-auto mb-4 text-primary" />
                    <h3 className="text-3xl font-semibold mb-2">6-Hour Package</h3>
                    <p className="text-muted-foreground">Ideal for comprehensive projects</p>
                  </div>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                      <span>6 hours with professional photographer</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                      <span>Optional studio space (discounted rate)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                      <span>50-75 edited photos delivered</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                      <span>Advanced retouching included</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                      <span>5-day delivery turnaround</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Photography Types */}
        <section className="py-20 md:py-32">
          <div className="container max-w-6xl px-6">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-semibold tracking-tight mb-4">Photography Specialties</h2>
              <p className="text-lg text-muted-foreground">Expert photographers for every type of project</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  title: "Commercial & Product",
                  image: "/professional-commercial-product-photography-studio.jpg",
                  description: "E-commerce, catalog, and brand photography",
                },
                {
                  title: "Portrait & Headshots",
                  image: "/professional-portrait-headshot-photography-session.jpg",
                  description: "Professional headshots and personal branding",
                },
                {
                  title: "Fashion & Editorial",
                  image: "/fashion-editorial-photography-runway-shoot.jpg",
                  description: "Lookbooks, editorials, and model portfolios",
                },
                {
                  title: "Event Photography",
                  image: "/wedding-event-photography-videography-coverage.jpg",
                  description: "Weddings, corporate events, and conferences",
                },
                {
                  title: "Content Creation",
                  image: "/social-media-content-creation-studio-influencer.jpg",
                  description: "Social media and influencer photography",
                },
                {
                  title: "Real Estate",
                  image: "/placeholder.svg?height=400&width=600",
                  description: "Property and architectural photography",
                },
              ].map((specialty) => (
                <Card key={specialty.title} className="overflow-hidden group hover:shadow-lg transition-all">
                  <div className="relative w-full aspect-[4/3]">
                    <Image
                      src={specialty.image || "/placeholder.svg"}
                      alt={specialty.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                  </div>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-semibold mb-2">{specialty.title}</h3>
                    <p className="text-muted-foreground text-sm">{specialty.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Studio Props and Equipment */}
        <section className="py-20 md:py-32 bg-secondary/30">
          <div className="container max-w-6xl px-6">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-semibold tracking-tight mb-4">
                Studio Props and Equipment Included
              </h2>
              <p className="text-lg text-muted-foreground">Professional gear for perfect results</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Camera className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Professional Lighting</h3>
                <p className="text-muted-foreground text-sm">
                  Studio strobes, softboxes, and continuous lighting setups
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Package className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Backdrops & Props</h3>
                <p className="text-muted-foreground text-sm">Multiple backdrops, furniture, and styling props</p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Camera className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Camera Equipment</h3>
                <p className="text-muted-foreground text-sm">Professional cameras, lenses, and accessories available</p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Star className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Editing Software</h3>
                <p className="text-muted-foreground text-sm">Professional retouching and color grading included</p>
              </div>
            </div>

            <div className="mt-12 text-center">
              <h3 className="text-2xl font-semibold mb-4">Optional Outdoor Sessions</h3>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Many of our photographers offer outdoor location shoots. Discuss your vision during booking to explore
                outdoor options for natural lighting and unique backdrops.
              </p>
            </div>
          </div>
        </section>

        {/* Additional Editing Options */}
        <section className="py-20 md:py-32">
          <div className="container max-w-6xl px-6">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-semibold tracking-tight mb-4">Additional Editing Options</h2>
              <p className="text-lg text-muted-foreground">Enhance your photos with premium editing services</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-3">Advanced Retouching</h3>
                  <p className="text-muted-foreground mb-4">
                    Professional skin retouching, blemish removal, and portrait enhancement
                  </p>
                  <p className="text-sm text-muted-foreground">+$50-150 per image</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-3">Background Removal</h3>
                  <p className="text-muted-foreground mb-4">
                    Clean background removal and replacement for product photography
                  </p>
                  <p className="text-sm text-muted-foreground">+$25-75 per image</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-3">Rush Delivery</h3>
                  <p className="text-muted-foreground mb-4">Get your edited photos delivered in 24-48 hours</p>
                  <p className="text-sm text-muted-foreground">+20-30% of package price</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 md:py-32 bg-foreground text-background">
          <div className="container max-w-4xl px-6 text-center">
            <h2 className="text-4xl md:text-5xl font-semibold tracking-tight mb-6">Ready to Book Your Photographer?</h2>
            <p className="text-lg md:text-xl mb-10 opacity-80 max-w-2xl mx-auto leading-relaxed">
              Browse hundreds of professional photographers. View portfolios, check availability, and book instantly
              with 50% deposit.
            </p>
            <Link href="/all?type=photographer">
              <Button size="lg" variant="secondary" className="rounded-full px-8">
                Find Photographers
              </Button>
            </Link>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  )
}
