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
import { ArrowLeft } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"

export default function StudioOnboarding() {
  const [currentStep, setCurrentStep] = useState<"profile" | "packages" | "availability" | "complete">("profile")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const supabase = createClient()

  const [studioData, setStudioData] = useState({
    name: "",
    description: "",
    studio_type: "",
    address: "",
    city: "",
    postcode: "",
    hourly_rate: "",
    size: "",
    max_capacity: 0,
    amenities: [] as string[],
    equipment: [] as string[],
    gallery_images: [] as string[],
    cover_image: "",
    latitude: 0,
    longitude: 0,
  })

  const [contactData, setContactData] = useState({
    full_name: "",
    email: "",
    phone: "",
  })

  const [onboardingAnswers, setOnboardingAnswers] = useState({
    space_types: [] as string[],
    booking_types: [] as string[],
    session_lengths: [] as string[],
    preferred_creators: [] as string[],
    priorities: [] as string[],
    availability_flexibility: "",
  })

  const spaceTypes = [
    "Photo studio",
    "Video studio",
    "Podcast studio",
    "Recording studio",
    "Multi-purpose creative space",
  ]
  const bookingTypes = ["Dry hire", "Combined bookings (with creators)", "Long-term rentals", "Memberships"]
  const sessionLengths = ["2 hours", "4 hours", "6 hours", "8 hours", "Full day"]
  const preferredCreators = ["Videographers", "Photographers", "Audio engineers", "Content creators", "Agencies"]
  const priorities = [
    "More bookings",
    "Trusted creators",
    "Less admin",
    "Predictable income",
    "Better utilisation of space",
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
        .select("user_role, onboarding_completed, email, phone, full_name")
        .eq("id", user.id)
        .single()

      if (profile) {
        setContactData({
          full_name: profile.full_name || "",
          email: profile.email || user.email || "",
          phone: profile.phone || "",
        })
      }

      // Only redirect if already completed onboarding
      if (profile?.onboarding_completed) {
        router.push("/dashboard")
        return
      }
    }

    loadUserData()
  }, [router, supabase])

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) throw new Error("Not authenticated")

      console.log("[v0] Starting studio creation for user:", user.id)

      const { error: profileError } = await supabase
        .from("profiles")
        .update({
          first_name: contactData.full_name,
          phone: contactData.phone,
          email: contactData.email,
          onboarding_completed: true,
          onboarding_answers: {
            role: "studio",
            answers: onboardingAnswers,
          },
          updated_at: new Date().toISOString(),
        })
        .eq("id", user.id)

      if (profileError) {
        console.error("[v0] Profile update error:", profileError)
        throw profileError
      }

      const hourlyRate = Number.parseFloat(studioData.hourly_rate)
      if (isNaN(hourlyRate) || hourlyRate <= 0) {
        throw new Error("Valid hourly rate is required")
      }

      const { error: studioError } = await supabase.from("emma_studios").insert({
        owner_id: user.id,
        name: studioData.name,
        description: studioData.description,
        studio_type: studioData.studio_type,
        address: studioData.address,
        city: studioData.city,
        postcode: studioData.postcode,
        hourly_rate: hourlyRate,
        slug: studioData.name.toLowerCase().replace(/\s+/g, "-") + "-" + Date.now(),
        is_active: true,
        is_verified: false,
        verification_status: "pending",
        rating: 0,
        review_count: 0,
        size: studioData.size,
        amenities: studioData.amenities.length > 0 ? studioData.amenities : [],
        equipment: studioData.equipment.length > 0 ? studioData.equipment : [],
        gallery_images: studioData.gallery_images.length > 0 ? studioData.gallery_images : [],
        cover_image: studioData.cover_image || null,
        latitude: studioData.latitude || null,
        longitude: studioData.longitude || null,
      })

      if (studioError) {
        console.error("[v0] Studio insert error:", studioError)
        throw studioError
      }

      console.log("[v0] Studio created successfully")
      router.push("/dashboard")
    } catch (err) {
      console.error("[v0] Error in studio onboarding:", err)
      setError(err instanceof Error ? err.message : "Failed to save studio")
    } finally {
      setIsLoading(false)
    }
  }

  const steps = [{ id: "profile", label: "Studio Setup", completed: currentStep !== "profile" }]

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
          <h1 className="text-3xl font-bold mb-2">Studio Onboarding</h1>
          <p className="text-muted-foreground">Complete your studio profile to start accepting bookings</p>
        </div>

        {error && (
          <div className="p-4 rounded-lg bg-red-50 border border-red-200 mb-6">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Tell Us About Your Studio</CardTitle>
            <CardDescription>Provide details about your studio space to start accepting bookings</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleProfileSubmit} className="space-y-8">
              <div className="space-y-6">
                <div className="space-y-4 pb-6 border-b">
                  <h3 className="font-semibold text-lg">Contact Information</h3>

                  <div className="space-y-2">
                    <Label htmlFor="contact_name">Contact Name *</Label>
                    <Input
                      id="contact_name"
                      value={contactData.full_name}
                      onChange={(e) => setContactData({ ...contactData, full_name: e.target.value })}
                      placeholder="Your full name"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="contact_email">Contact Email *</Label>
                    <Input
                      id="contact_email"
                      type="email"
                      value={contactData.email}
                      onChange={(e) => setContactData({ ...contactData, email: e.target.value })}
                      placeholder="studio@example.com"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="contact_phone">Contact Phone *</Label>
                    <Input
                      id="contact_phone"
                      type="tel"
                      value={contactData.phone}
                      onChange={(e) => setContactData({ ...contactData, phone: e.target.value })}
                      placeholder="+44 7XXX XXXXXX"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-semibold text-lg">Studio Details</h3>

                  <div className="space-y-2">
                    <Label htmlFor="name">Studio Name *</Label>
                    <Input
                      id="name"
                      value={studioData.name}
                      onChange={(e) => setStudioData({ ...studioData, name: e.target.value })}
                      placeholder="Your studio name"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="studio_type">Studio Type *</Label>
                    <Select
                      value={studioData.studio_type}
                      onValueChange={(value) => setStudioData({ ...studioData, studio_type: value })}
                      required
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="photography">Photography Studio</SelectItem>
                        <SelectItem value="video">Video Production Studio</SelectItem>
                        <SelectItem value="audio">Audio Recording Studio</SelectItem>
                        <SelectItem value="multi">Multi-Purpose Studio</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description *</Label>
                    <Textarea
                      id="description"
                      value={studioData.description}
                      onChange={(e) => setStudioData({ ...studioData, description: e.target.value })}
                      placeholder="Describe your studio space, equipment, and features"
                      rows={5}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="city">City *</Label>
                      <Input
                        id="city"
                        value={studioData.city}
                        onChange={(e) => setStudioData({ ...studioData, city: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="postcode">Postcode *</Label>
                      <Input
                        id="postcode"
                        value={studioData.postcode}
                        onChange={(e) => setStudioData({ ...studioData, postcode: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address">Address *</Label>
                    <Input
                      id="address"
                      value={studioData.address}
                      onChange={(e) => setStudioData({ ...studioData, address: e.target.value })}
                      placeholder="Full address"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="hourly_rate">Hourly Rate (£) *</Label>
                    <Input
                      id="hourly_rate"
                      type="number"
                      step="0.01"
                      value={studioData.hourly_rate}
                      onChange={(e) => setStudioData({ ...studioData, hourly_rate: e.target.value })}
                      placeholder="50"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="size">Size *</Label>
                    <Input
                      id="size"
                      value={studioData.size}
                      onChange={(e) => setStudioData({ ...studioData, size: e.target.value })}
                      placeholder="1000 sq ft"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="max_capacity">Max Capacity *</Label>
                    <Input
                      id="max_capacity"
                      type="number"
                      value={studioData.max_capacity}
                      onChange={(e) => setStudioData({ ...studioData, max_capacity: Number(e.target.value) })}
                      placeholder="10"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="amenities">Amenities *</Label>
                    <Input
                      id="amenities"
                      value={studioData.amenities.join(", ")}
                      onChange={(e) =>
                        setStudioData({
                          ...studioData,
                          amenities: e.target.value.split(", ").map((item) => item.trim()),
                        })
                      }
                      placeholder="Air Conditioning, Free Parking"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="equipment">Equipment *</Label>
                    <Input
                      id="equipment"
                      value={studioData.equipment.join(", ")}
                      onChange={(e) =>
                        setStudioData({
                          ...studioData,
                          equipment: e.target.value.split(", ").map((item) => item.trim()),
                        })
                      }
                      placeholder="Professional Camera, Lighting Kit"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="gallery_images">Gallery Images *</Label>
                    <Input
                      id="gallery_images"
                      value={studioData.gallery_images.join(", ")}
                      onChange={(e) =>
                        setStudioData({
                          ...studioData,
                          gallery_images: e.target.value.split(", ").map((item) => item.trim()),
                        })
                      }
                      placeholder="Image URL 1, Image URL 2"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="cover_image">Cover Image *</Label>
                    <Input
                      id="cover_image"
                      value={studioData.cover_image}
                      onChange={(e) => setStudioData({ ...studioData, cover_image: e.target.value })}
                      placeholder="Cover Image URL"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="latitude">Latitude *</Label>
                    <Input
                      id="latitude"
                      type="number"
                      value={studioData.latitude}
                      onChange={(e) => setStudioData({ ...studioData, latitude: Number(e.target.value) })}
                      placeholder="51.5074"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="longitude">Longitude *</Label>
                    <Input
                      id="longitude"
                      type="number"
                      value={studioData.longitude}
                      onChange={(e) => setStudioData({ ...studioData, longitude: Number(e.target.value) })}
                      placeholder="-0.1278"
                      required
                    />
                  </div>
                </div>

                {/* Q1: What type of space do you run? */}
                <div className="space-y-3">
                  <Label>Q1. What type of space do you run? (Multi-Select) *</Label>
                  <div className="grid grid-cols-2 gap-3">
                    {spaceTypes.map((type) => (
                      <div key={type} className="flex items-center space-x-2">
                        <Checkbox
                          id={`space-${type}`}
                          checked={onboardingAnswers.space_types.includes(type)}
                          onCheckedChange={() =>
                            toggleArrayValue(onboardingAnswers.space_types, type, (arr) =>
                              setOnboardingAnswers({ ...onboardingAnswers, space_types: arr }),
                            )
                          }
                        />
                        <Label htmlFor={`space-${type}`} className="font-normal cursor-pointer">
                          {type}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Q2: Booking types you offer */}
                <div className="space-y-3">
                  <Label>Q2. Booking types you offer (Multi-Select) *</Label>
                  <div className="grid grid-cols-2 gap-3">
                    {bookingTypes.map((type) => (
                      <div key={type} className="flex items-center space-x-2">
                        <Checkbox
                          id={`booking-${type}`}
                          checked={onboardingAnswers.booking_types.includes(type)}
                          onCheckedChange={() =>
                            toggleArrayValue(onboardingAnswers.booking_types, type, (arr) =>
                              setOnboardingAnswers({ ...onboardingAnswers, booking_types: arr }),
                            )
                          }
                        />
                        <Label htmlFor={`booking-${type}`} className="font-normal cursor-pointer">
                          {type}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Q3: Typical Session Lengths */}
                <div className="space-y-3">
                  <Label>Q3. Typical Session Lengths (Multi-Select) *</Label>
                  <div className="grid grid-cols-3 gap-3">
                    {sessionLengths.map((length) => (
                      <div key={length} className="flex items-center space-x-2">
                        <Checkbox
                          id={`session-${length}`}
                          checked={onboardingAnswers.session_lengths.includes(length)}
                          onCheckedChange={() =>
                            toggleArrayValue(onboardingAnswers.session_lengths, length, (arr) =>
                              setOnboardingAnswers({ ...onboardingAnswers, session_lengths: arr }),
                            )
                          }
                        />
                        <Label htmlFor={`session-${length}`} className="font-normal cursor-pointer">
                          {length}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Q4: Preferred Creators to Work With */}
                <div className="space-y-3">
                  <Label>Q4. Preferred Creators to Work With (Multi-Select) *</Label>
                  <div className="grid grid-cols-2 gap-3">
                    {preferredCreators.map((creator) => (
                      <div key={creator} className="flex items-center space-x-2">
                        <Checkbox
                          id={`creator-${creator}`}
                          checked={onboardingAnswers.preferred_creators.includes(creator)}
                          onCheckedChange={() =>
                            toggleArrayValue(onboardingAnswers.preferred_creators, creator, (arr) =>
                              setOnboardingAnswers({ ...onboardingAnswers, preferred_creators: arr }),
                            )
                          }
                        />
                        <Label htmlFor={`creator-${creator}`} className="font-normal cursor-pointer">
                          {creator}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Q5: What do you want most from the platform? */}
                <div className="space-y-3">
                  <Label>Q5. What do you want most from the platform? (Rank in order) *</Label>
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
                                onboardingAnswers.priorities.indexOf(priority) ===
                                onboardingAnswers.priorities.length - 1
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

                {/* Q6: How flexible is your availability? */}
                <div className="space-y-3">
                  <Label>Q6. How flexible is your availability? *</Label>
                  <Select
                    value={onboardingAnswers.availability_flexibility}
                    onValueChange={(value) =>
                      setOnboardingAnswers({ ...onboardingAnswers, availability_flexibility: value })
                    }
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="fixed_hours">Fixed hours</SelectItem>
                      <SelectItem value="flexible">Flexible</SelectItem>
                      <SelectItem value="weekends_only">Weekends only</SelectItem>
                      <SelectItem value="24_7">24/7</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-900">
                  <strong>Submit for Verification:</strong> Your studio profile will be live immediately. Our team will
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
