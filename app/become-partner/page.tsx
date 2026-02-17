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
import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle2, TrendingUp, Users, Shield, Calendar, DollarSign } from "lucide-react"

export default function BecomePartnerPage() {
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
    // In production, this would send the form data to the backend
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
                Partner With EMMA STUDIOS
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground leading-relaxed mb-8">
                Join the leading platform for photography studio rentals and videography space bookings. Grow your
                business, reach more clients, and maximize your studio's potential with EMMA STUDIOS.
              </p>
              <div className="flex items-center justify-center gap-8 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-primary" />
                  <span>Free to join</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-primary" />
                  <span>No setup fees</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-primary" />
                  <span>Flexible commission</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-20">
          <div className="container">
            <div className="text-center mb-16">
              <h2 className="font-serif text-3xl md:text-4xl font-bold mb-4 text-balance">Why Partner With Us</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                EMMA STUDIOS provides everything you need to succeed in the creative studio rental market.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <Card>
                <CardContent className="pt-8 pb-6">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                    <Users className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-xl mb-3 text-balance">Reach More Clients</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Get discovered by thousands of photographers, videographers, content creators, and brands actively
                    searching for studio spaces.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-8 pb-6">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                    <Calendar className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-xl mb-3 text-balance">Smart Booking Management</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Manage your calendar with ease. Real-time availability, automatic confirmations, and calendar sync
                    with Google and Outlook.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-8 pb-6">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                    <DollarSign className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-xl mb-3 text-balance">Secure Payments</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Get paid automatically via Stripe. Weekly payouts, transparent pricing, and no hidden fees. You
                    focus on studios, we handle payments.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-8 pb-6">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                    <TrendingUp className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-xl mb-3 text-balance">Business Analytics</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Track your performance with detailed analytics. Monitor bookings, revenue, popular packages, and
                    client insights.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-8 pb-6">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                    <Shield className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-xl mb-3 text-balance">Protection & Support</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Verified client bookings, damage protection, cancellation policies, and dedicated partner support
                    team available 24/7.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-8 pb-6">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                    <CheckCircle2 className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-xl mb-3 text-balance">Marketing Support</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Professional photography, SEO optimization, featured listings, social media promotion, and marketing
                    tools to boost visibility.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="bg-primary text-primary-foreground py-16 border-y">
          <div className="container">
            <div className="grid md:grid-cols-4 gap-8 text-center">
              <div>
                <div className="text-4xl md:text-5xl font-bold mb-2">500+</div>
                <div className="text-sm opacity-90">Partner Studios</div>
              </div>
              <div>
                <div className="text-4xl md:text-5xl font-bold mb-2">10K+</div>
                <div className="text-sm opacity-90">Monthly Bookings</div>
              </div>
              <div>
                <div className="text-4xl md:text-5xl font-bold mb-2">4.8★</div>
                <div className="text-sm opacity-90">Average Rating</div>
              </div>
              <div>
                <div className="text-4xl md:text-5xl font-bold mb-2">98%</div>
                <div className="text-sm opacity-90">Partner Satisfaction</div>
              </div>
            </div>
          </div>
        </section>

        {/* Form Section */}
        <section className="py-20">
          <div className="container max-w-2xl">
            <div className="text-center mb-12">
              <h2 className="font-serif text-3xl md:text-4xl font-bold mb-4 text-balance">Ready to Get Started?</h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Fill out the form below and our partnership team will contact you within 24 hours to discuss next steps.
              </p>
            </div>

            {submitted ? (
              <Card className="text-center p-12">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle2 className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-serif text-2xl font-bold mb-3">Application Received!</h3>
                <p className="text-muted-foreground leading-relaxed mb-6">
                  Thank you for your interest in partnering with EMMA STUDIOS. Our team will review your application and
                  contact you within 24 hours.
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
                        <Input id="firstName" placeholder="John" required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName">Last Name *</Label>
                        <Input id="lastName" placeholder="Smith" required />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address *</Label>
                      <Input id="email" type="email" placeholder="john@example.com" required />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number *</Label>
                      <Input id="phone" type="tel" placeholder="+1 (555) 000-0000" required />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="studioName">Studio/Business Name *</Label>
                      <Input id="studioName" placeholder="Your Studio Name" required />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="website">Website (Optional)</Label>
                      <Input id="website" type="url" placeholder="https://yourstudio.com" />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="studioType">Studio Type *</Label>
                      <Select required>
                        <SelectTrigger id="studioType">
                          <SelectValue placeholder="Select studio type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="photography">Photography Studio</SelectItem>
                          <SelectItem value="videography">Videography Studio</SelectItem>
                          <SelectItem value="both">Photography & Videography</SelectItem>
                          <SelectItem value="coworking">Co-working Creative Space</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="city">City *</Label>
                        <Input id="city" placeholder="Los Angeles" required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="state">State *</Label>
                        <Input id="state" placeholder="CA" required />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="address">Studio Address *</Label>
                      <Input id="address" placeholder="123 Main Street" required />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="size">Approximate Studio Size (sq ft)</Label>
                      <Input id="size" type="number" placeholder="1500" />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="message">Tell Us About Your Studio *</Label>
                      <Textarea
                        id="message"
                        placeholder="Describe your studio space, amenities, target clients, and why you'd like to partner with EMMA STUDIOS..."
                        rows={6}
                        required
                      />
                    </div>

                    <Button type="submit" size="lg" className="w-full bg-accent hover:bg-accent/90">
                      Submit Partnership Application
                    </Button>

                    <p className="text-sm text-muted-foreground text-center">
                      By submitting this form, you agree to our Terms of Service and Privacy Policy.
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
