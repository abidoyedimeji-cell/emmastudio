import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"
import Image from "next/image"
import { Video, Clock, Film, CheckCircle2, Palette } from "lucide-react"

export const metadata = {
  title: "Videography Services: Editing, Color Grading, and Props | EMMA STUDIOS",
  description:
    "Professional videography services with 3-hour and 6-hour packages. Book videographers and production studios for commercial, event, and content creation. Editing, color grading, and props included.",
}

export default function VideographyServicesPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-24 md:py-32">
          <div className="container max-w-5xl px-6">
            <div className="text-center">
              <h1 className="text-5xl md:text-7xl font-semibold tracking-tighter text-balance mb-6">
                Videography Services: Editing, Color Grading, and Props
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-12 leading-relaxed">
                Book professional videographers with complete production packages. Editing, color grading, and studio
                props included.
              </p>
              <Link href="/all?type=videographer">
                <Button size="lg" className="rounded-full px-8">
                  Browse Videographers
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Package Options */}
        <section className="py-20 md:py-32 bg-secondary/30">
          <div className="container max-w-6xl px-6">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-semibold tracking-tight mb-4">Video Production Packages</h2>
              <p className="text-lg text-muted-foreground">Complete packages with editing and color grading</p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              <Card className="border-2">
                <CardContent className="p-8">
                  <div className="text-center mb-6">
                    <Clock className="h-12 w-12 mx-auto mb-4 text-primary" />
                    <h3 className="text-3xl font-semibold mb-2">3-Hour Package</h3>
                    <p className="text-muted-foreground">Quick shoots and interviews</p>
                  </div>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                      <span>3 hours filming with videographer</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                      <span>Optional studio with green screen</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                      <span>Up to 5 minutes final edited video</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                      <span>Basic color grading included</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                      <span>10-14 day delivery turnaround</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-2 border-primary">
                <CardContent className="p-8">
                  <div className="text-center mb-6">
                    <Clock className="h-12 w-12 mx-auto mb-4 text-primary" />
                    <h3 className="text-3xl font-semibold mb-2">6-Hour Package</h3>
                    <p className="text-muted-foreground">Full production shoots</p>
                  </div>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                      <span>6 hours filming with videographer</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                      <span>Studio space with full equipment</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                      <span>Up to 15 minutes final edited video</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                      <span>Professional color grading & effects</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                      <span>7-10 day delivery turnaround</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Videography Types */}
        <section className="py-20 md:py-32">
          <div className="container max-w-6xl px-6">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-semibold tracking-tight mb-4">Video Production Specialties</h2>
              <p className="text-lg text-muted-foreground">Expert videographers for every type of content</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  title: "Commercial Video",
                  image: "/commercial-video-shoot.png",
                  description: "Brand videos, ads, and promotional content",
                },
                {
                  title: "Event Coverage",
                  image: "/wedding-event-photography-videography-coverage.jpg",
                  description: "Weddings, conferences, and special events",
                },
                {
                  title: "Music Videos",
                  image: "/music-video-still.jpg",
                  description: "Cinematic music videos and performances",
                },
                {
                  title: "Corporate Video",
                  image: "/placeholder.svg?height=400&width=600",
                  description: "Training videos, testimonials, and interviews",
                },
                {
                  title: "Social Content",
                  image: "/social-media-content-creation-studio-influencer.jpg",
                  description: "TikTok, Instagram Reels, and YouTube content",
                },
                {
                  title: "Documentary",
                  image: "/cinematic-video-frame.png",
                  description: "Documentary and storytelling projects",
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

        {/* Post-Production Services */}
        <section className="py-20 md:py-32 bg-secondary/30">
          <div className="container max-w-6xl px-6">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-semibold tracking-tight mb-4">
                Professional Editing and Color Grading
              </h2>
              <p className="text-lg text-muted-foreground">Complete post-production included in every package</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Film className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Video Editing</h3>
                <p className="text-muted-foreground text-sm">Professional cuts, transitions, and pacing</p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Palette className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Color Grading</h3>
                <p className="text-muted-foreground text-sm">Cinematic color correction and grading</p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Video className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Audio Mixing</h3>
                <p className="text-muted-foreground text-sm">Sound design, music, and audio enhancement</p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Motion Graphics</h3>
                <p className="text-muted-foreground text-sm">Titles, lower thirds, and visual effects</p>
              </div>
            </div>
          </div>
        </section>

        {/* Studio Equipment */}
        <section className="py-20 md:py-32">
          <div className="container max-w-6xl px-6">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-semibold tracking-tight mb-4">
                Studio Equipment and Props Available
              </h2>
              <p className="text-lg text-muted-foreground">Professional production gear included</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-3">Camera Equipment</h3>
                  <p className="text-muted-foreground mb-4">
                    4K/6K cinema cameras, gimbals, sliders, and professional lenses
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-3">Lighting & Grip</h3>
                  <p className="text-muted-foreground mb-4">LED panels, soft boxes, flags, and complete grip gear</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-3">Green Screen</h3>
                  <p className="text-muted-foreground mb-4">Cyc wall studios with chroma key lighting setups</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 md:py-32 bg-foreground text-background">
          <div className="container max-w-4xl px-6 text-center">
            <h2 className="text-4xl md:text-5xl font-semibold tracking-tight mb-6">Ready to Create Your Video?</h2>
            <p className="text-lg md:text-xl mb-10 opacity-80 max-w-2xl mx-auto leading-relaxed">
              Browse professional videographers with complete portfolios. Book instantly with 50% deposit and create
              amazing content.
            </p>
            <Link href="/all?type=videographer">
              <Button size="lg" variant="secondary" className="rounded-full px-8">
                Find Videographers
              </Button>
            </Link>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  )
}
