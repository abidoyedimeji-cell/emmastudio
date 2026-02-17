"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { ArrowLeft } from "lucide-react"

export default function ClientOnboarding() {
  const router = useRouter()
  const supabase = createClient()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    first_name: "",
    email: "",
    phone: "",
    location: "",
    bio: "",
  })

  const [onboardingAnswers, setOnboardingAnswers] = useState({
    user_type: "",
    booking_purposes: [] as string[],
    priorities: [] as string[],
    booking_preference: "",
    booking_frequency: "",
    budget_range: "",
  })

  const bookingPurposes = [
    "Brand campaigns",
    "Social media content",
    "Music / podcast production",
    "Events",
    "Personal projects",
    "Product launches",
    "Ongoing monthly content",
  ]

  const priorities = [
    "Finding reliable creators",
    "Seamless booking experience",
    "High production quality",
    "Flexible pricing",
    "Fast turnaround",
    "Multiple creator & studio options",
    "Clear deliverables",
  ]

  const toggleArrayValue = (array: string[], value: string, setter: (arr: string[]) => void) => {
    if (array.includes(value)) {
      setter(array.filter((item) => item !== value))
    } else {
      setter([...array, value])
    }
  }

  const movePriority = (index: number, direction: "up" | "down") => {
    const newPriorities = [...onboardingAnswers.priorities]
    const targetIndex = direction === "up" ? index - 1 : index + 1
    if (targetIndex >= 0 && targetIndex < newPriorities.length) {
      ;[newPriorities[index], newPriorities[targetIndex]] = [newPriorities[targetIndex], newPriorities[index]]
      setOnboardingAnswers({ ...onboardingAnswers, priorities: newPriorities })
    }
  }

  useEffect(() => {
    loadUserData()
  }, [])

  async function loadUserData() {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      router.push("/login")
      return
    }

    const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

    if (profile) {
      setFormData({
        first_name: profile.first_name || "",
        email: profile.email || user.email || "",
        phone: profile.phone || "",
        location: profile.location || "",
        bio: profile.bio || "",
      })
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      if (!formData.first_name || !formData.email || !formData.phone || !formData.location) {
        throw new Error("Please fill in all required basic information fields")
      }

      if (!onboardingAnswers.user_type) {
        throw new Error("Please select what best describes you (Q1)")
      }

      if (onboardingAnswers.booking_purposes.length === 0) {
        throw new Error("Please select at least one booking purpose (Q2)")
      }

      if (onboardingAnswers.priorities.length === 0) {
        throw new Error("Please select at least one priority (Q3)")
      }

      if (!onboardingAnswers.booking_preference) {
        throw new Error("Please select your booking preference (Q4)")
      }

      if (!onboardingAnswers.booking_frequency) {
        throw new Error("Please select booking frequency (Q5)")
      }

      if (!onboardingAnswers.budget_range) {
        throw new Error("Please select your budget range (Q6)")
      }

      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) throw new Error("Not authenticated")

      console.log("[v0] Submitting client onboarding for user:", user.id)
      console.log("[v0] Form data:", formData)
      console.log("[v0] Onboarding answers:", onboardingAnswers)

      const updateData = {
        first_name: formData.first_name,
        email: formData.email,
        phone: formData.phone,
        location: formData.location,
        bio: formData.bio || null,
        onboarding_completed: true,
        onboarding_answers: {
          role: "client",
          answers: onboardingAnswers,
        },
        role: "client",
        updated_at: new Date().toISOString(),
      }

      console.log("[v0] Update payload:", updateData)

      const { data, error: updateError } = await supabase.from("profiles").update(updateData).eq("id", user.id).select()

      if (updateError) {
        console.error("[v0] Client profile update error:", updateError)
        console.error("[v0] Error details:", JSON.stringify(updateError, null, 2))
        throw new Error(`Database error: ${updateError.message}`)
      }

      console.log("[v0] Client onboarding completed successfully:", data)

      await new Promise((resolve) => setTimeout(resolve, 500))

      router.push("/dashboard")
    } catch (err) {
      console.error("[v0] Error completing onboarding:", err)
      setError(err instanceof Error ? err.message : "Failed to complete onboarding. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background px-4 py-12">
      <div className="max-w-2xl mx-auto">
        <Button variant="ghost" onClick={() => router.push("/select-role?change=true")} className="mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Role Selection
        </Button>

        <Card>
          <CardHeader>
            <CardTitle>Help Us Understand Your Needs</CardTitle>
            <CardDescription>Tell us about yourself to personalize your experience</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Basic Information */}
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Basic Information</h3>

                <div>
                  <Label htmlFor="first_name">Name *</Label>
                  <Input
                    id="first_name"
                    value={formData.first_name}
                    onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="location">Location *</Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="City or region"
                    required
                  />
                </div>
              </div>

              {/* Q1: What best describes you? */}
              <div className="space-y-3">
                <Label>Q1. What best describes you? *</Label>
                <Select
                  value={onboardingAnswers.user_type}
                  onValueChange={(value) => setOnboardingAnswers({ ...onboardingAnswers, user_type: value })}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="individual">Individual</SelectItem>
                    <SelectItem value="brand_business">Brand / Business</SelectItem>
                    <SelectItem value="agency">Agency</SelectItem>
                    <SelectItem value="content_creator">Content Creator</SelectItem>
                    <SelectItem value="startup_founder">Startup / Founder</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Q2: What are you primarily booking for? */}
              <div className="space-y-3">
                <Label>Q2. What are you primarily booking for? (Multi-Select) *</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {bookingPurposes.map((purpose) => (
                    <div key={purpose} className="flex items-center space-x-2">
                      <Checkbox
                        id={`purpose-${purpose}`}
                        checked={onboardingAnswers.booking_purposes.includes(purpose)}
                        onCheckedChange={() =>
                          toggleArrayValue(onboardingAnswers.booking_purposes, purpose, (arr) =>
                            setOnboardingAnswers({ ...onboardingAnswers, booking_purposes: arr }),
                          )
                        }
                      />
                      <Label htmlFor={`purpose-${purpose}`} className="font-normal cursor-pointer">
                        {purpose}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Q3: What matters most when booking? (Ranking) */}
              <div className="space-y-3">
                <Label>Q3. What matters most to you when booking? (Drag to rank) *</Label>
                <div className="space-y-2">
                  {priorities.map((priority) => (
                    <div key={priority} className="flex items-center space-x-2">
                      <Checkbox
                        id={`priority-${priority}`}
                        checked={onboardingAnswers.priorities.includes(priority)}
                        onCheckedChange={() =>
                          toggleArrayValue(onboardingAnswers.priorities, priority, (arr) =>
                            setOnboardingAnswers({ ...onboardingAnswers, priorities: arr }),
                          )
                        }
                      />
                      <Label htmlFor={`priority-${priority}`} className="font-normal cursor-pointer flex-1">
                        {priority}
                      </Label>
                      {onboardingAnswers.priorities.includes(priority) && (
                        <div className="flex gap-1">
                          <Button
                            type="button"
                            size="sm"
                            variant="ghost"
                            onClick={() => movePriority(onboardingAnswers.priorities.indexOf(priority), "up")}
                            disabled={onboardingAnswers.priorities.indexOf(priority) === 0}
                          >
                            ↑
                          </Button>
                          <Button
                            type="button"
                            size="sm"
                            variant="ghost"
                            onClick={() => movePriority(onboardingAnswers.priorities.indexOf(priority), "down")}
                            disabled={
                              onboardingAnswers.priorities.indexOf(priority) === onboardingAnswers.priorities.length - 1
                            }
                          >
                            ↓
                          </Button>
                          <span className="text-sm text-muted-foreground px-2">
                            #{onboardingAnswers.priorities.indexOf(priority) + 1}
                          </span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Q4: How do you prefer to book? */}
              <div className="space-y-3">
                <Label>Q4. How do you prefer to book? *</Label>
                <Select
                  value={onboardingAnswers.booking_preference}
                  onValueChange={(value) => setOnboardingAnswers({ ...onboardingAnswers, booking_preference: value })}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="creator_only">Creator only</SelectItem>
                    <SelectItem value="studio_only">Studio only</SelectItem>
                    <SelectItem value="combined">Combined creator + studio</SelectItem>
                    <SelectItem value="recommendations">I want recommendations</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Q5: How often do you expect to book? */}
              <div className="space-y-3">
                <Label>Q5. How often do you expect to book? *</Label>
                <Select
                  value={onboardingAnswers.booking_frequency}
                  onValueChange={(value) => setOnboardingAnswers({ ...onboardingAnswers, booking_frequency: value })}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="one_off">One-off</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                    <SelectItem value="quarterly">Quarterly</SelectItem>
                    <SelectItem value="ongoing">Ongoing / retainer</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Q6: Budget Range per Booking */}
              <div className="space-y-3">
                <Label>Q6. Budget Range per Booking *</Label>
                <Select
                  value={onboardingAnswers.budget_range}
                  onValueChange={(value) => setOnboardingAnswers({ ...onboardingAnswers, budget_range: value })}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="under_250">Under £250</SelectItem>
                    <SelectItem value="250_500">£250 – £500</SelectItem>
                    <SelectItem value="500_1000">£500 – £1,000</SelectItem>
                    <SelectItem value="1000_plus">£1,000+</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="bio">Tell us about your needs</Label>
                <Textarea
                  id="bio"
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  placeholder="What are you looking to create? What challenges are you facing?"
                  rows={4}
                />
              </div>

              {error && (
                <div className="p-4 rounded-lg bg-red-50 border border-red-200">
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}

              <Button type="submit" disabled={isLoading} className="w-full">
                {isLoading ? "Completing..." : "Complete Profile"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
