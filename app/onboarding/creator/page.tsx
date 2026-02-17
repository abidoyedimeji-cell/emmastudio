"use client"

import type React from "react"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft } from "lucide-react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"

export default function CreatorOnboarding() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const supabase = createClient()

  const [profileData, setProfileData] = useState({
    display_name: "",
    email: "",
    bio: "",
    short_bio: "",
    creator_type: "",
    specialty: "",
    city: "",
    postcode: "",
    skills: [] as string[],
    hourly_rate: "",
    half_day_rate: "",
    full_day_rate: "",
    years_experience: "",
    portfolio_images: "",
    portfolio_videos: "",
    instagram_url: "",
    website_url: "",
  })

  const [skillInput, setSkillInput] = useState("")
  const [onboardingAnswers, setOnboardingAnswers] = useState({
    creator_types: [] as string[],
    services_offered: [] as string[],
    work_locations: [] as string[],
    booking_preferences: [] as string[],
    ideal_clients: [] as string[],
    priorities: [] as string[],
  })

  const creatorTypes = [
    "Videographer",
    "Photographer",
    "Editor",
    "Content creator",
    "Audio engineer",
    "Director",
    "Other",
  ]
  const services = [
    "Video shoots",
    "Photography",
    "Editing",
    "Social content",
    "Event coverage",
    "Music / audio",
    "Brand campaigns",
  ]
  const workLocations = ["On-location", "In studios", "Client spaces", "Remote / editing only"]
  const bookingPreferences = [
    "Outside studio bookings",
    "In-studio fixed packages (2/4/6/8 hrs)",
    "Combined studio + creator bookings",
    "Long-term / recurring clients",
  ]
  const idealClients = ["Individuals", "Brands", "Agencies", "Musicians", "Startups"]
  const priorities = [
    "Consistent bookings",
    "Fair pricing",
    "Creative freedom",
    "Studio access",
    "Fast payouts",
    "Brand exposure",
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
    const loadUserData = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) {
        router.push("/login")
        return
      }

      const { data: profile } = await supabase
        .from("profiles")
        .select("user_role, onboarding_completed, email, full_name")
        .eq("id", user.id)
        .single()

      // Only redirect if already completed onboarding
      if (profile?.onboarding_completed) {
        router.push("/dashboard")
        return
      }

      setProfileData((prev) => ({
        ...prev,
        email: user.email || profile?.email || "",
        display_name: profile?.full_name || "",
      }))
    }

    loadUserData()
  }, [router, supabase])

  const handleAddSkill = () => {
    if (skillInput.trim() && !profileData.skills.includes(skillInput.trim())) {
      setProfileData({
        ...profileData,
        skills: [...profileData.skills, skillInput.trim()],
      })
      setSkillInput("")
    }
  }

  const handleRemoveSkill = (skill: string) => {
    setProfileData({
      ...profileData,
      skills: profileData.skills.filter((s) => s !== skill),
    })
  }

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) throw new Error("Not authenticated")

      console.log("[v0] Starting creator profile creation for user:", user.id)

      const emailToUse = profileData.email || user.email
      if (!emailToUse) {
        throw new Error("Email is required")
      }

      const portfolioImages = profileData.portfolio_images
        .split("|")
        .map((url) => url.trim())
        .filter(Boolean)
      const portfolioVideos = profileData.portfolio_videos
        .split("|")
        .map((url) => url.trim())
        .filter(Boolean)

      const { error: creatorError } = await supabase.from("emma_creators").insert({
        user_id: user.id,
        display_name: profileData.display_name,
        bio: profileData.bio,
        short_bio: profileData.short_bio,
        creator_type: profileData.creator_type,
        specialty: profileData.specialty,
        city: profileData.city,
        postcode: profileData.postcode,
        skills: profileData.skills,
        hourly_rate: profileData.hourly_rate ? Number.parseFloat(profileData.hourly_rate) : null,
        half_day_rate: profileData.half_day_rate ? Number.parseFloat(profileData.half_day_rate) : null,
        full_day_rate: profileData.full_day_rate ? Number.parseFloat(profileData.full_day_rate) : null,
        years_experience: profileData.years_experience ? Number.parseInt(profileData.years_experience) : null,
        portfolio_images: portfolioImages.length > 0 ? portfolioImages : null,
        portfolio_videos: portfolioVideos.length > 0 ? portfolioVideos : null,
        instagram_url: profileData.instagram_url || null,
        website_url: profileData.website_url || null,
        slug: profileData.display_name.toLowerCase().replace(/\s+/g, "-") + "-" + Date.now(),
        is_active: true,
        is_verified: false,
        verification_status: "pending",
        rating: 0,
        review_count: 0,
        completed_bookings: 0,
        returning_clients: 0,
      })

      if (creatorError) {
        console.error("[v0] Creator insert error:", creatorError)
        throw creatorError
      }

      const { error: profileError } = await supabase
        .from("profiles")
        .update({
          onboarding_completed: true,
          email: emailToUse,
          onboarding_answers: {
            role: "creator",
            answers: onboardingAnswers,
          },
          updated_at: new Date().toISOString(),
        })
        .eq("id", user.id)

      if (profileError) {
        console.error("[v0] Profile update error:", profileError)
        throw profileError
      }

      console.log("[v0] Creator profile created successfully")
      router.push("/dashboard")
    } catch (err) {
      console.error("[v0] Error in creator onboarding:", err)
      setError(err instanceof Error ? err.message : "Failed to save profile")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="mb-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push("/select-role?change=true")}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Role Selection
          </Button>
        </div>

        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Creator Onboarding</h1>
          <p className="text-muted-foreground">Complete your profile to start receiving bookings</p>
        </div>

        {error && (
          <div className="p-4 rounded-lg bg-red-50 border border-red-200 mb-6">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Create Your Creator Profile</CardTitle>
            <CardDescription>Tell clients about yourself and your services</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleProfileSubmit} className="space-y-8">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Basic Information</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="display_name">Display Name *</Label>
                    <Input
                      id="display_name"
                      value={profileData.display_name}
                      onChange={(e) => setProfileData({ ...profileData, display_name: e.target.value })}
                      placeholder="Your professional name"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={profileData.email}
                      onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                      placeholder="your@email.com"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="creator_type">Creator Type *</Label>
                    <Select
                      value={profileData.creator_type}
                      onValueChange={(value) => setProfileData({ ...profileData, creator_type: value })}
                      required
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="photographer">Photographer</SelectItem>
                        <SelectItem value="videographer">Videographer</SelectItem>
                        <SelectItem value="audio_engineer">Audio Engineer</SelectItem>
                        <SelectItem value="multi_discipline">Multi-Discipline</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="specialty">Specialty *</Label>
                    <Input
                      id="specialty"
                      value={profileData.specialty}
                      onChange={(e) => setProfileData({ ...profileData, specialty: e.target.value })}
                      placeholder="e.g., Portrait, Event, Product"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="years_experience">Years of Experience *</Label>
                  <Input
                    id="years_experience"
                    type="number"
                    value={profileData.years_experience}
                    onChange={(e) => setProfileData({ ...profileData, years_experience: e.target.value })}
                    placeholder="5"
                    required
                  />
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Location</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city">City *</Label>
                    <Input
                      id="city"
                      value={profileData.city}
                      onChange={(e) => setProfileData({ ...profileData, city: e.target.value })}
                      placeholder="London"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="postcode">Postcode *</Label>
                    <Input
                      id="postcode"
                      value={profileData.postcode}
                      onChange={(e) => setProfileData({ ...profileData, postcode: e.target.value })}
                      placeholder="E1 6AN"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">About You</h3>

                <div className="space-y-2">
                  <Label htmlFor="short_bio">Short Bio (for cards) *</Label>
                  <Input
                    id="short_bio"
                    value={profileData.short_bio}
                    onChange={(e) => setProfileData({ ...profileData, short_bio: e.target.value })}
                    placeholder="8+ years portrait photographer, natural light specialist"
                    maxLength={100}
                    required
                  />
                  <p className="text-xs text-muted-foreground">{profileData.short_bio.length}/100 characters</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio">Full Bio *</Label>
                  <Textarea
                    id="bio"
                    value={profileData.bio}
                    onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                    placeholder="Tell clients about your experience, style, and what makes you unique..."
                    rows={5}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="skills">Skills</Label>
                  <div className="flex gap-2">
                    <Input
                      id="skills"
                      value={skillInput}
                      onChange={(e) => setSkillInput(e.target.value)}
                      placeholder="Add a skill"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault()
                          handleAddSkill()
                        }
                      }}
                    />
                    <Button type="button" onClick={handleAddSkill} variant="outline">
                      Add
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {profileData.skills.map((skill) => (
                      <Badge
                        key={skill}
                        variant="secondary"
                        className="cursor-pointer"
                        onClick={() => handleRemoveSkill(skill)}
                      >
                        {skill} ×
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Pricing</h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="hourly_rate">Hourly Rate (£) *</Label>
                    <Input
                      id="hourly_rate"
                      type="number"
                      step="0.01"
                      value={profileData.hourly_rate}
                      onChange={(e) => setProfileData({ ...profileData, hourly_rate: e.target.value })}
                      placeholder="75"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="half_day_rate">Half Day Rate (£)</Label>
                    <Input
                      id="half_day_rate"
                      type="number"
                      step="0.01"
                      value={profileData.half_day_rate}
                      onChange={(e) => setProfileData({ ...profileData, half_day_rate: e.target.value })}
                      placeholder="450"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="full_day_rate">Full Day Rate (£)</Label>
                    <Input
                      id="full_day_rate"
                      type="number"
                      step="0.01"
                      value={profileData.full_day_rate}
                      onChange={(e) => setProfileData({ ...profileData, full_day_rate: e.target.value })}
                      placeholder="800"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Portfolio</h3>

                <div className="space-y-2">
                  <Label htmlFor="portfolio_images">Portfolio Image URLs</Label>
                  <Textarea
                    id="portfolio_images"
                    value={profileData.portfolio_images}
                    onChange={(e) => setProfileData({ ...profileData, portfolio_images: e.target.value })}
                    placeholder="https://example.com/image1.jpg | https://example.com/image2.jpg"
                    rows={3}
                  />
                  <p className="text-xs text-muted-foreground">Separate multiple URLs with | (pipe)</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="portfolio_videos">Portfolio Video URLs</Label>
                  <Textarea
                    id="portfolio_videos"
                    value={profileData.portfolio_videos}
                    onChange={(e) => setProfileData({ ...profileData, portfolio_videos: e.target.value })}
                    placeholder="https://example.com/video1.mp4 | https://example.com/video2.mp4"
                    rows={3}
                  />
                  <p className="text-xs text-muted-foreground">Separate multiple URLs with | (pipe)</p>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Social Links</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="instagram_url">Instagram URL</Label>
                    <Input
                      id="instagram_url"
                      type="url"
                      value={profileData.instagram_url}
                      onChange={(e) => setProfileData({ ...profileData, instagram_url: e.target.value })}
                      placeholder="https://instagram.com/yourname"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="website_url">Website URL</Label>
                    <Input
                      id="website_url"
                      type="url"
                      value={profileData.website_url}
                      onChange={(e) => setProfileData({ ...profileData, website_url: e.target.value })}
                      placeholder="https://yourwebsite.com"
                    />
                  </div>
                </div>
              </div>

              {/* Q1: What type of creator are you? */}
              <div className="space-y-3">
                <Label>Q1. What type of creator are you? (Multi-Select) *</Label>
                <div className="grid grid-cols-2 gap-3">
                  {creatorTypes.map((type) => (
                    <div key={type} className="flex items-center space-x-2">
                      <Checkbox
                        id={`type-${type}`}
                        checked={onboardingAnswers.creator_types.includes(type)}
                        onCheckedChange={() =>
                          toggleArrayValue(onboardingAnswers.creator_types, type, (arr) =>
                            setOnboardingAnswers({ ...onboardingAnswers, creator_types: arr }),
                          )
                        }
                      />
                      <Label htmlFor={`type-${type}`} className="font-normal cursor-pointer">
                        {type}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Q2: What services do you offer? */}
              <div className="space-y-3">
                <Label>Q2. What services do you offer? (Multi-Select) *</Label>
                <div className="grid grid-cols-2 gap-3">
                  {services.map((service) => (
                    <div key={service} className="flex items-center space-x-2">
                      <Checkbox
                        id={`service-${service}`}
                        checked={onboardingAnswers.services_offered.includes(service)}
                        onCheckedChange={() =>
                          toggleArrayValue(onboardingAnswers.services_offered, service, (arr) =>
                            setOnboardingAnswers({ ...onboardingAnswers, services_offered: arr }),
                          )
                        }
                      />
                      <Label htmlFor={`service-${service}`} className="font-normal cursor-pointer">
                        {service}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Q3: Where do you primarily work? */}
              <div className="space-y-3">
                <Label>Q3. Where do you primarily work? (Multi-Select) *</Label>
                <div className="grid grid-cols-2 gap-3">
                  {workLocations.map((location) => (
                    <div key={location} className="flex items-center space-x-2">
                      <Checkbox
                        id={`location-${location}`}
                        checked={onboardingAnswers.work_locations.includes(location)}
                        onCheckedChange={() =>
                          toggleArrayValue(onboardingAnswers.work_locations, location, (arr) =>
                            setOnboardingAnswers({ ...onboardingAnswers, work_locations: arr }),
                          )
                        }
                      />
                      <Label htmlFor={`location-${location}`} className="font-normal cursor-pointer">
                        {location}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Q4: Preferred Booking Type */}
              <div className="space-y-3">
                <Label>Q4. Preferred Booking Type (Rank in order) *</Label>
                <div className="space-y-2">
                  {bookingPreferences.map((pref) => (
                    <div key={pref} className="flex items-center space-x-2">
                      <Checkbox
                        id={`pref-${pref}`}
                        checked={onboardingAnswers.booking_preferences.includes(pref)}
                        onCheckedChange={() =>
                          toggleArrayValue(onboardingAnswers.booking_preferences, pref, (arr) =>
                            setOnboardingAnswers({ ...onboardingAnswers, booking_preferences: arr }),
                          )
                        }
                      />
                      <Label htmlFor={`pref-${pref}`} className="font-normal cursor-pointer flex-1">
                        {pref}
                      </Label>
                      {onboardingAnswers.booking_preferences.includes(pref) && (
                        <span className="text-sm text-muted-foreground">
                          #{onboardingAnswers.booking_preferences.indexOf(pref) + 1}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Q5: Ideal Client Types */}
              <div className="space-y-3">
                <Label>Q5. Ideal Client Types (Multi-Select) *</Label>
                <div className="grid grid-cols-2 gap-3">
                  {idealClients.map((client) => (
                    <div key={client} className="flex items-center space-x-2">
                      <Checkbox
                        id={`client-${client}`}
                        checked={onboardingAnswers.ideal_clients.includes(client)}
                        onCheckedChange={() =>
                          toggleArrayValue(onboardingAnswers.ideal_clients, client, (arr) =>
                            setOnboardingAnswers({ ...onboardingAnswers, ideal_clients: arr }),
                          )
                        }
                      />
                      <Label htmlFor={`client-${client}`} className="font-normal cursor-pointer">
                        {client}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Q6: What matters most to you? */}
              <div className="space-y-3">
                <Label>Q6. What matters most to you? (Rank in order) *</Label>
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

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-900">
                  <strong>Submit for Verification:</strong> Your creator profile will be live immediately. Our team will
                  review and verify your listing to add a verification badge.
                </p>
              </div>

              <Button type="submit" disabled={isLoading} className="w-full">
                {isLoading ? "Submitting..." : "Complete Setup"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
