"use client"

import type React from "react"

import { useState } from "react"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle2, Camera, Briefcase, Award, Users, TrendingUp } from "lucide-react"

export default function CreatorsApplyPage() {
  const [submitted, setSubmitted] = useState(false)
  const [specialties, setSpecialties] = useState<string[]>([])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
    // In production, this would send the form data to the backend
  }

  const toggleSpecialty = (specialty: string) => {
    setSpecialties((prev) => (prev.includes(specialty) ? prev.filter((s) => s !== specialty) : [...prev, specialty]))
  }

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-secondary py-20 border-b">
          <div className="container">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-balance">
                Join EMMA STUDIOS as a Creator
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground leading-relaxed mb-8">
                Are you a professional photographer, videographer, or creative specialist? Join our platform and connect
                with clients looking for your expertise. Grow your business and showcase your talent.
              </p>
              <div className="flex items-center justify-center gap-8 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-primary" />
                  <span>Free profile</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-primary" />
                  <span>Flexible schedule</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-primary" />
                  <span>Direct bookings</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-20">
          <div className="container">
            <div className="text-center mb-16">
              <h2 className="font-serif text-3xl md:text-4xl font-bold mb-4 text-balance">Why Join as a Creator</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                EMMA STUDIOS gives you the tools and exposure to build your creative business.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <Card>
                <CardContent className="pt-8 pb-6">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                    <Users className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-xl mb-3 text-balance">Access to Clients</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Get discovered by brands, businesses, and individuals actively searching for professional
                    photographers and videographers.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-8 pb-6">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                    <Briefcase className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-xl mb-3 text-balance">Portfolio Showcase</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Create a stunning profile with your best work, client reviews, specialties, and experience to
                    attract more bookings.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-8 pb-6">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                    <TrendingUp className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-xl mb-3 text-balance">Grow Your Income</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Set your own rates, create custom packages, and earn more by accessing a steady stream of bookings
                    from our platform.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-8 pb-6">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                    <Camera className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-xl mb-3 text-balance">Studio Access</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Partner with top studios on our platform. Access professional spaces, equipment, and facilities for
                    your client projects.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-8 pb-6">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                    <Award className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-xl mb-3 text-balance">Build Your Reputation</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Collect verified reviews, earn badges, and build credibility through our transparent review system
                    and creator rankings.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-8 pb-6">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                    <CheckCircle2 className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-xl mb-3 text-balance">Simple Management</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Manage bookings, set availability, communicate with clients, and track earnings all from one
                    easy-to-use dashboard.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Requirements Section */}
        <section className="bg-secondary py-16 border-y">
          <div className="container max-w-4xl">
            <div className="text-center mb-12">
              <h2 className="font-serif text-3xl md:text-4xl font-bold mb-4 text-balance">Creator Requirements</h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                We're looking for experienced, professional creators who are passionate about their craft.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="flex gap-3">
                <CheckCircle2 className="h-6 w-6 text-primary shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold mb-1">Professional Experience</h4>
                  <p className="text-sm text-muted-foreground">
                    Minimum 2 years of professional photography or videography experience
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <CheckCircle2 className="h-6 w-6 text-primary shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold mb-1">Portfolio</h4>
                  <p className="text-sm text-muted-foreground">
                    Professional portfolio showcasing your best work and style
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <CheckCircle2 className="h-6 w-6 text-primary shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold mb-1">Professional Equipment</h4>
                  <p className="text-sm text-muted-foreground">
                    Own professional-grade camera equipment and editing software
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <CheckCircle2 className="h-6 w-6 text-primary shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold mb-1">Reliability</h4>
                  <p className="text-sm text-muted-foreground">
                    Strong track record of professional, timely delivery and client satisfaction
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <CheckCircle2 className="h-6 w-6 text-primary shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold mb-1">Insurance</h4>
                  <p className="text-sm text-muted-foreground">
                    Professional liability insurance (or willing to obtain)
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <CheckCircle2 className="h-6 w-6 text-primary shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold mb-1">Communication Skills</h4>
                  <p className="text-sm text-muted-foreground">
                    Excellent communication and customer service abilities
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Form Section */}
        <section className="py-20">
          <div className="container max-w-2xl">
            <div className="text-center mb-12">
              <h2 className="font-serif text-3xl md:text-4xl font-bold mb-4 text-balance">Apply Now</h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Complete the application below and our team will review your profile within 48 hours.
              </p>
            </div>

            {submitted ? (
              <Card className="text-center p-12">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle2 className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-serif text-2xl font-bold mb-3">Application Submitted!</h3>
                <p className="text-muted-foreground leading-relaxed mb-6">
                  Thank you for applying to join EMMA STUDIOS. Our team will review your application and contact you
                  within 48 hours.
                </p>
                <Button onClick={() => setSubmitted(false)} variant="outline" className="bg-transparent">
                  Submit Another Application
                </Button>
              </Card>
            ) : (
              <Card>
                <CardContent className="pt-6">
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">First Name *</Label>
                        <Input id="firstName" placeholder="Jane" required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName">Last Name *</Label>
                        <Input id="lastName" placeholder="Doe" required />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address *</Label>
                      <Input id="email" type="email" placeholder="jane@example.com" required />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number *</Label>
                      <Input id="phone" type="tel" placeholder="+1 (555) 000-0000" required />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="professionalName">Professional Name/Brand *</Label>
                      <Input id="professionalName" placeholder="Jane Doe Photography" required />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="portfolio">Portfolio Website/Instagram *</Label>
                      <Input id="portfolio" type="url" placeholder="https://instagram.com/janedoephoto" required />
                    </div>

                    <div className="space-y-2">
                      <Label>Primary Specialty *</Label>
                      <Select required>
                        <SelectTrigger>
                          <SelectValue placeholder="Select your primary specialty" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="portrait">Portrait Photography</SelectItem>
                          <SelectItem value="commercial">Commercial Photography</SelectItem>
                          <SelectItem value="wedding">Wedding Photography</SelectItem>
                          <SelectItem value="fashion">Fashion Photography</SelectItem>
                          <SelectItem value="product">Product Photography</SelectItem>
                          <SelectItem value="videography">Videography</SelectItem>
                          <SelectItem value="event">Event Photography</SelectItem>
                          <SelectItem value="real-estate">Real Estate Photography</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-3">
                      <Label>Additional Specialties (Select all that apply)</Label>
                      <div className="grid md:grid-cols-2 gap-3">
                        {[
                          "Portrait",
                          "Commercial",
                          "Wedding",
                          "Fashion",
                          "Product",
                          "Videography",
                          "Event",
                          "Real Estate",
                          "Food",
                          "Lifestyle",
                          "Headshots",
                          "Editorial",
                        ].map((specialty) => (
                          <div key={specialty} className="flex items-center space-x-2">
                            <Checkbox
                              id={specialty.toLowerCase()}
                              checked={specialties.includes(specialty)}
                              onCheckedChange={() => toggleSpecialty(specialty)}
                            />
                            <label
                              htmlFor={specialty.toLowerCase()}
                              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                            >
                              {specialty}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="experience">Years of Professional Experience *</Label>
                      <Select required>
                        <SelectTrigger id="experience">
                          <SelectValue placeholder="Select years of experience" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="2-3">2-3 years</SelectItem>
                          <SelectItem value="4-5">4-5 years</SelectItem>
                          <SelectItem value="6-10">6-10 years</SelectItem>
                          <SelectItem value="10+">10+ years</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="city">City *</Label>
                        <Input id="city" placeholder="New York" required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="state">State *</Label>
                        <Input id="state" placeholder="NY" required />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="equipment">Equipment You Own *</Label>
                      <Textarea
                        id="equipment"
                        placeholder="List your camera bodies, lenses, lighting equipment, etc..."
                        rows={4}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="bio">Professional Bio *</Label>
                      <Textarea
                        id="bio"
                        placeholder="Tell us about your photography/videography journey, style, and what makes your work unique..."
                        rows={6}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="why">Why do you want to join EMMA STUDIOS? *</Label>
                      <Textarea
                        id="why"
                        placeholder="Share your goals and what you hope to achieve as a creator on our platform..."
                        rows={4}
                        required
                      />
                    </div>

                    <div className="flex items-start space-x-2">
                      <Checkbox id="insurance" required />
                      <label htmlFor="insurance" className="text-sm leading-relaxed cursor-pointer">
                        I have professional liability insurance or am willing to obtain it upon acceptance *
                      </label>
                    </div>

                    <Button type="submit" size="lg" className="w-full bg-accent hover:bg-accent/90">
                      Submit Creator Application
                    </Button>

                    <p className="text-sm text-muted-foreground text-center">
                      By submitting this form, you agree to our Creator Terms of Service and Privacy Policy.
                    </p>
                  </form>
                </CardContent>
              </Card>
            )}
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  )
}
