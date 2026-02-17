import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"
import { Mic, Music, Radio, CheckCircle2, Clock } from "lucide-react"

export const metadata = {
  title: "Audio Recording, Mixing, and Mastering Services | EMMA STUDIOS",
  description:
    "Professional audio services with 3-hour and 6-hour packages. Book audio engineers and recording studios for music production, podcast recording, and voice-over work. Mixing and mastering included.",
}

export default function AudioServicesPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-24 md:py-32">
          <div className="container max-w-5xl px-6">
            <div className="text-center">
              <h1 className="text-5xl md:text-7xl font-semibold tracking-tighter text-balance mb-6">
                Audio Recording, Mixing, and Mastering Services
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-12 leading-relaxed">
                Book professional audio engineers with complete production packages. Recording, mixing, and mastering
                included.
              </p>
              <Link href="/all?type=audio">
                <Button size="lg" className="rounded-full px-8">
                  Browse Audio Engineers
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Package Options */}
        <section className="py-20 md:py-32 bg-secondary/30">
          <div className="container max-w-6xl px-6">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-semibold tracking-tight mb-4">Audio Production Packages</h2>
              <p className="text-lg text-muted-foreground">Complete packages with mixing and mastering</p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              <Card className="border-2">
                <CardContent className="p-8">
                  <div className="text-center mb-6">
                    <Clock className="h-12 w-12 mx-auto mb-4 text-primary" />
                    <h3 className="text-3xl font-semibold mb-2">3-Hour Package</h3>
                    <p className="text-muted-foreground">Perfect for singles and demos</p>
                  </div>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                      <span>3 hours studio recording time</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                      <span>Professional audio engineer</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                      <span>Up to 2 tracks mixed and mastered</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                      <span>Basic vocal tuning included</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                      <span>7-10 day delivery turnaround</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-2 border-primary">
                <CardContent className="p-8">
                  <div className="text-center mb-6">
                    <Clock className="h-12 w-12 mx-auto mb-4 text-primary" />
                    <h3 className="text-3xl font-semibold mb-2">6-Hour Package</h3>
                    <p className="text-muted-foreground">Ideal for EPs and albums</p>
                  </div>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                      <span>6 hours studio recording time</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                      <span>Experienced audio producer</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                      <span>Up to 5 tracks mixed and mastered</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                      <span>Advanced vocal processing</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                      <span>5-7 day delivery turnaround</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Audio Services */}
        <section className="py-20 md:py-32">
          <div className="container max-w-6xl px-6">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-semibold tracking-tight mb-4">Audio Production Specialties</h2>
              <p className="text-lg text-muted-foreground">Expert audio engineers for every type of project</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  title: "Music Production",
                  icon: Music,
                  description: "Recording, producing, and mixing original music and covers",
                },
                {
                  title: "Podcast Recording",
                  icon: Mic,
                  description: "Multi-track podcast recording with professional sound quality",
                },
                {
                  title: "Voice-Over Work",
                  icon: Radio,
                  description: "Commercials, audiobooks, and narration recording",
                },
                {
                  title: "Mixing & Mastering",
                  icon: Music,
                  description: "Professional mixing and mastering for release-ready tracks",
                },
                {
                  title: "Audio Post-Production",
                  icon: Mic,
                  description: "Sound design and audio editing for video content",
                },
                {
                  title: "Live Recording",
                  icon: Radio,
                  description: "Live performance and concert recording sessions",
                },
              ].map((service) => (
                <Card key={service.title} className="hover:shadow-lg transition-all">
                  <CardContent className="p-6">
                    <service.icon className="h-12 w-12 text-primary mb-4" />
                    <h3 className="text-xl font-semibold mb-2">{service.title}</h3>
                    <p className="text-muted-foreground text-sm">{service.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 md:py-32 bg-foreground text-background">
          <div className="container max-w-4xl px-6 text-center">
            <h2 className="text-4xl md:text-5xl font-semibold tracking-tight mb-6">Ready to Record Your Audio?</h2>
            <p className="text-lg md:text-xl mb-10 opacity-80 max-w-2xl mx-auto leading-relaxed">
              Browse professional audio engineers and recording studios. Book instantly with 50% deposit and create
              amazing sound.
            </p>
            <Link href="/all?type=audio">
              <Button size="lg" variant="secondary" className="rounded-full px-8">
                Find Audio Engineers
              </Button>
            </Link>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  )
}
