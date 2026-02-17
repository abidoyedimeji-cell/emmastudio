"use client"

import { Suspense, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { AvailabilityCalendar } from "@/components/marketplace/availability-calendar"
import { BundleBuilder } from "@/components/marketplace/bundle-builder"
import { BookingSummary } from "@/components/marketplace/booking-summary"
import { Camera, Building2, Layers, ChevronRight, ChevronLeft, Loader2 } from "lucide-react"

type Step = "type" | "datetime" | "packages" | "addons" | "review"

const DURATION_OPTIONS = [2, 4, 6, 8]

export default function NewBookingPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    }>
      <NewBookingContent />
    </Suspense>
  )
}

function NewBookingContent() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const presetType = searchParams.get("type") as string | null
  const presetId = searchParams.get("id")

  const [step, setStep] = useState<Step>(presetType ? "datetime" : "type")
  const [listingType, setListingType] = useState(presetType || "")
  const [studioId, setStudioId] = useState(presetType === "studio" ? presetId || "" : "")
  const [creatorId, setCreatorId] = useState(presetType === "creator" ? presetId || "" : "")
  const [selectedDate, setSelectedDate] = useState("")
  const [selectedTime, setSelectedTime] = useState("")
  const [duration, setDuration] = useState(2)
  const [packageId, setPackageId] = useState("")
  const [selectedAddons, setSelectedAddons] = useState<{ addon_id: string; quantity: number }[]>([])
  const [note, setNote] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState("")

  // Placeholder pricing for the summary card
  const packagePrice = 150 // Would come from selected package
  const addonsTotal = selectedAddons.length * 25 // Simplified
  const subtotal = packagePrice + addonsTotal
  const serviceFee = Math.round(subtotal * 0.08 * 100) / 100
  const total = subtotal + serviceFee
  const deposit = Math.round(total * 0.5 * 100) / 100

  const pricing = {
    package_price: packagePrice,
    addons_total: addonsTotal,
    subtotal,
    service_fee: serviceFee,
    total,
    deposit,
    balance: total - deposit,
  }

  async function handleSubmit() {
    setSubmitting(true)
    setError("")

    try {
      const res = await fetch("/api/marketplace/bookings/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          listing_type: listingType,
          studio_id: studioId || null,
          creator_id: creatorId || null,
          package_id: packageId,
          addon_ids: selectedAddons.map((a) => a.addon_id),
          requested_date: selectedDate,
          requested_start: selectedTime + ":00",
          duration_hours: duration,
          customer_note: note,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || "Failed to submit request")
      }

      router.push(`/booking/${data.bookingId}`)
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setSubmitting(false)
    }
  }

  const steps: { key: Step; label: string }[] = [
    { key: "type", label: "Type" },
    { key: "datetime", label: "Date & Time" },
    { key: "packages", label: "Package" },
    { key: "addons", label: "Add-ons" },
    { key: "review", label: "Review" },
  ]

  const currentIndex = steps.findIndex((s) => s.key === step)

  function goNext() {
    if (currentIndex < steps.length - 1) {
      setStep(steps[currentIndex + 1].key)
    }
  }

  function goBack() {
    if (currentIndex > 0) {
      setStep(steps[currentIndex - 1].key)
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SiteHeader />
      <main className="flex-1 container max-w-2xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6 text-balance">Request a Booking</h1>

        {/* Step indicator */}
        <div className="flex items-center gap-1 mb-8">
          {steps.map((s, i) => (
            <div key={s.key} className="flex items-center gap-1 flex-1">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium ${
                  i < currentIndex
                    ? "bg-primary text-primary-foreground"
                    : i === currentIndex
                      ? "bg-primary/20 text-primary ring-2 ring-primary"
                      : "bg-muted text-muted-foreground"
                }`}
              >
                {i + 1}
              </div>
              {i < steps.length - 1 && (
                <div className={`h-0.5 flex-1 ${i < currentIndex ? "bg-primary" : "bg-muted"}`} />
              )}
            </div>
          ))}
        </div>

        {/* Step: Type */}
        {step === "type" && (
          <div className="flex flex-col gap-4">
            <h2 className="text-lg font-semibold">What do you need?</h2>
            <div className="grid gap-3">
              {[
                { value: "studio", label: "Studio Only", desc: "Book a studio space", icon: Building2 },
                { value: "creator", label: "Creator Only", desc: "Book a photographer or videographer", icon: Camera },
                { value: "bundle", label: "Studio + Creator", desc: "Book both together", icon: Layers },
              ].map((opt) => (
                <Card
                  key={opt.value}
                  className={`cursor-pointer transition-colors ${
                    listingType === opt.value ? "border-primary ring-2 ring-primary/20" : "hover:bg-muted"
                  }`}
                  onClick={() => setListingType(opt.value)}
                >
                  <CardContent className="flex items-center gap-4 p-4">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <opt.icon className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">{opt.label}</p>
                      <p className="text-sm text-muted-foreground">{opt.desc}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Step: Date & Time */}
        {step === "datetime" && (
          <div className="flex flex-col gap-6">
            <h2 className="text-lg font-semibold">Choose date and time</h2>
            {(listingType === "studio" || listingType === "bundle") && studioId && (
              <AvailabilityCalendar
                listingType="studio"
                listingId={studioId}
                onSelectSlot={(date, time) => {
                  setSelectedDate(date)
                  setSelectedTime(time)
                }}
                selectedDate={selectedDate}
                selectedTime={selectedTime}
              />
            )}
            {listingType === "creator" && creatorId && (
              <AvailabilityCalendar
                listingType="creator"
                listingId={creatorId}
                onSelectSlot={(date, time) => {
                  setSelectedDate(date)
                  setSelectedTime(time)
                }}
                selectedDate={selectedDate}
                selectedTime={selectedTime}
              />
            )}
            {!studioId && !creatorId && (
              <div className="flex flex-col gap-3">
                <Label>Enter listing ID</Label>
                <Input
                  placeholder="Listing ID..."
                  value={listingType === "studio" ? studioId : creatorId}
                  onChange={(e) => {
                    if (listingType === "studio" || listingType === "bundle") {
                      setStudioId(e.target.value)
                    } else {
                      setCreatorId(e.target.value)
                    }
                  }}
                />
              </div>
            )}
            <div className="flex flex-col gap-2">
              <Label>Duration</Label>
              <div className="flex gap-2">
                {DURATION_OPTIONS.map((d) => (
                  <Button
                    key={d}
                    variant={duration === d ? "default" : "outline"}
                    size="sm"
                    onClick={() => setDuration(d)}
                  >
                    {d}h
                  </Button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Step: Package */}
        {step === "packages" && (
          <div className="flex flex-col gap-4">
            <h2 className="text-lg font-semibold">Select a package</h2>
            <Label>Package ID</Label>
            <Input
              placeholder="Package ID..."
              value={packageId}
              onChange={(e) => setPackageId(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              Select the package for your booking. Package selection will be populated from your chosen listing.
            </p>
          </div>
        )}

        {/* Step: Add-ons */}
        {step === "addons" && (
          <div className="flex flex-col gap-4">
            <h2 className="text-lg font-semibold">Optional add-ons</h2>
            <BundleBuilder
              listingType={listingType === "bundle" ? "studio" : listingType}
              listingId={studioId || creatorId}
              selectedAddons={selectedAddons}
              onAddonsChange={setSelectedAddons}
            />
          </div>
        )}

        {/* Step: Review */}
        {step === "review" && (
          <div className="flex flex-col gap-4">
            <h2 className="text-lg font-semibold">Review your request</h2>
            <Card>
              <CardContent className="flex flex-col gap-3 p-4 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Type</span>
                  <span className="capitalize">{listingType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Date</span>
                  <span>{selectedDate || "Not selected"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Time</span>
                  <span>{selectedTime || "Not selected"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Duration</span>
                  <span>{duration} hours</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Add-ons</span>
                  <span>{selectedAddons.length}</span>
                </div>
              </CardContent>
            </Card>
            <BookingSummary pricing={pricing} />
            <div className="flex flex-col gap-2">
              <Label>Note for the provider (optional)</Label>
              <Textarea
                placeholder="Any special requests..."
                value={note}
                onChange={(e) => setNote(e.target.value)}
                rows={3}
              />
            </div>
            <p className="text-xs text-muted-foreground">
              Your request will be sent to all parties for approval. You have 24 hours to receive a response. Once approved, you will need to pay a 50% deposit within 2 hours.
            </p>
            {error && <p className="text-sm text-destructive">{error}</p>}
          </div>
        )}

        {/* Navigation */}
        <div className="flex justify-between mt-8">
          <Button variant="outline" onClick={goBack} disabled={currentIndex === 0}>
            <ChevronLeft className="w-4 h-4 mr-1" />
            Back
          </Button>
          {step === "review" ? (
            <Button onClick={handleSubmit} disabled={submitting}>
              {submitting && <Loader2 className="w-4 h-4 animate-spin mr-1.5" />}
              Submit Request
            </Button>
          ) : (
            <Button
              onClick={goNext}
              disabled={
                (step === "type" && !listingType) ||
                (step === "datetime" && (!selectedDate || !selectedTime))
              }
            >
              Next
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          )}
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}
