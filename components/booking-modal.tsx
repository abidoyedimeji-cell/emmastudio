"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { Loader2, Clock } from "lucide-react"
import { loadStripe } from "@stripe/stripe-js"
import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js"

let stripePromise: ReturnType<typeof loadStripe> | null = null
const getStripe = () => {
  if (!stripePromise && process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY) {
    stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY)
  }
  return stripePromise
}

type Package = {
  id: string
  name: string
  price: number
  duration_hours: number
  description: string
  includes: string[]
}

type Partner = {
  id: string
  name: string
  display_name?: string
  avatar_url?: string
  cover_image?: string
  city?: string
  studio_type?: string
  creator_type?: string
}

interface BookingModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  profileType: "creator" | "studio"
  profileId: string
  profileName: string
  packages: Package[]
}

function PaymentForm({
  profileType,
  profileId,
  date,
  time,
  duration,
  bookingType,
  packageIds,
  partnerId,
  partnerPackageId,
  totalPrice,
  onSuccess,
  onCancel,
}: {
  profileType: string
  profileId: string
  date: string
  time: string
  duration: number
  bookingType: string
  packageIds: string[]
  partnerId?: string
  partnerPackageId?: string
  totalPrice: number
  onSuccess: () => void
  onCancel: () => void
}) {
  const stripe = useStripe()
  const elements = useElements()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!stripe || !elements) {
      return
    }

    setLoading(true)
    setError(null)

    const { error: submitError } = await elements.submit()
    if (submitError) {
      setError(submitError.message || "Payment submission failed")
      setLoading(false)
      return
    }

    const { error: confirmError, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: window.location.origin + "/dashboard",
      },
      redirect: "if_required",
    })

    if (confirmError) {
      setError(confirmError.message || "Payment failed")
      setLoading(false)
      return
    }

    if (paymentIntent?.status === "succeeded") {
      try {
        const res = await fetch("/api/bookings/create", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            profileType,
            profileId,
            date,
            time,
            duration,
            bookingType,
            packageIds,
            partnerId,
            partnerPackageId,
            paymentIntentId: paymentIntent.id,
          }),
        })

        const data = await res.json()

        if (data.success) {
          onSuccess()
        } else {
          setError(data.error || "Booking creation failed")
        }
      } catch (err) {
        setError("Failed to create booking")
      } finally {
        setLoading(false)
      }
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <PaymentElement />

      {error && <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-md">{error}</div>}

      <div className="flex gap-2">
        <Button type="button" variant="outline" onClick={onCancel} className="flex-1 bg-transparent" disabled={loading}>
          Cancel
        </Button>
        <Button type="submit" disabled={!stripe || loading} className="flex-1">
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : (
            `Pay £${(totalPrice / 100).toFixed(2)}`
          )}
        </Button>
      </div>
    </form>
  )
}

export function BookingModal({ open, onOpenChange, profileType, profileId, profileName, packages }: BookingModalProps) {
  const [date, setDate] = useState<Date>()
  const [time, setTime] = useState("")
  const [duration, setDuration] = useState(2)
  const [bookingType, setBookingType] = useState<"single" | "combined">("single")
  const [selectedPackages, setSelectedPackages] = useState<Package[]>([])
  const [availablePartners, setAvailablePartners] = useState<Partner[]>([])
  const [selectedPartner, setSelectedPartner] = useState<Partner | null>(null)
  const [partnerPackages, setPartnerPackages] = useState<Package[]>([])
  const [selectedPartnerPackage, setSelectedPartnerPackage] = useState<Package | null>(null)
  const [loading, setLoading] = useState(false)
  const [checkingAvailability, setCheckingAvailability] = useState(false)
  const [step, setStep] = useState<"details" | "payment">("details")
  const [clientSecret, setClientSecret] = useState<string | null>(null)

  useEffect(() => {
    if (bookingType === "combined" && date && time && duration) {
      setCheckingAvailability(true)
      fetch("/api/check-availability", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          profileType,
          profileId,
          date: date.toISOString().split("T")[0],
          time,
          duration,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          setAvailablePartners(data.partners || [])
          setCheckingAvailability(false)
        })
        .catch(() => setCheckingAvailability(false))
    }
  }, [bookingType, date, time, duration, profileType, profileId])

  useEffect(() => {
    if (selectedPartner) {
      const partnerType = profileType === "creator" ? "studio" : "creator"
      fetch(`/api/packages?type=${partnerType}&id=${selectedPartner.id}`)
        .then((res) => res.json())
        .then((data) => setPartnerPackages(data.packages || []))
    }
  }, [selectedPartner, profileType])

  const totalPrice =
    selectedPackages.reduce((sum, p) => sum + p.price, 0) + (selectedPartnerPackage ? selectedPartnerPackage.price : 0)

  const togglePackage = (pkg: Package) => {
    setSelectedPackages((prev) => {
      if (prev.find((p) => p.id === pkg.id)) {
        return prev.filter((p) => p.id !== pkg.id)
      }
      return [...prev, pkg]
    })
  }

  const handleContinueToPayment = async () => {
    if (!date || !time || selectedPackages.length === 0) return

    setLoading(true)
    try {
      const res = await fetch("/api/create-payment-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          packageIds: selectedPackages.map((p) => p.id),
          partnerPackageId: selectedPartnerPackage?.id,
        }),
      })

      const data = await res.json()

      if (data.clientSecret) {
        setClientSecret(data.clientSecret)
        setStep("payment")
      } else {
        alert("Failed to initialize payment")
      }
    } catch (error) {
      alert("Payment initialization failed")
    } finally {
      setLoading(false)
    }
  }

  const handleBookingSuccess = () => {
    alert("Booking confirmed! Check your dashboard for details.")
    onOpenChange(false)
    window.location.href = "/dashboard"
  }

  const timeSlots = Array.from({ length: 14 }, (_, i) => {
    const hour = i + 8
    return `${hour.toString().padStart(2, "0")}:00`
  })

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{step === "details" ? `Book ${profileName}` : "Complete Payment"}</DialogTitle>
        </DialogHeader>

        {step === "details" && (
          <div className="space-y-6">
            {/* Date & Time Selection */}
            <div className="space-y-4">
              <div>
                <Label>Select Date</Label>
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  disabled={(date) => date < new Date()}
                  className="rounded-md border"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Time</Label>
                  <Select value={time} onValueChange={setTime}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select time" />
                    </SelectTrigger>
                    <SelectContent>
                      {timeSlots.map((slot) => (
                        <SelectItem key={slot} value={slot}>
                          {slot}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Duration (hours)</Label>
                  <Select value={duration.toString()} onValueChange={(v) => setDuration(Number(v))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {[2, 4, 6, 8].map((h) => (
                        <SelectItem key={h} value={h.toString()}>
                          {h} hours
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Booking Type */}
            <div>
              <Label>Booking Type</Label>
              <RadioGroup value={bookingType} onValueChange={(v: any) => setBookingType(v)}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="single" id="single" />
                  <Label htmlFor="single" className="font-normal">
                    Single booking ({profileType} only)
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="combined" id="combined" />
                  <Label htmlFor="combined" className="font-normal">
                    Combined booking ({profileType} + {profileType === "creator" ? "studio" : "creator"})
                  </Label>
                </div>
              </RadioGroup>
            </div>

            {/* Single Booking - Package Selection */}
            {bookingType === "single" && (
              <div>
                <Label>Select Packages</Label>
                <div className="space-y-2 mt-2">
                  {packages.map((pkg) => (
                    <Card key={pkg.id} className="cursor-pointer" onClick={() => togglePackage(pkg)}>
                      <CardContent className="flex items-start space-x-3 p-4">
                        <Checkbox
                          checked={selectedPackages.some((p) => p.id === pkg.id)}
                          onCheckedChange={() => togglePackage(pkg)}
                        />
                        <div className="flex-1">
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="font-medium">{pkg.name}</p>
                              <p className="text-sm text-muted-foreground">{pkg.description}</p>
                            </div>
                            <p className="font-semibold">£{(pkg.price / 100).toFixed(2)}</p>
                          </div>
                          <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            <span>{pkg.duration_hours}h</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Combined Booking - Partner Selection */}
            {bookingType === "combined" && (
              <div className="space-y-4">
                <div>
                  <Label>Available {profileType === "creator" ? "Studios" : "Creators"}</Label>
                  {checkingAvailability ? (
                    <div className="flex items-center justify-center py-8">
                      <Loader2 className="h-6 w-6 animate-spin" />
                    </div>
                  ) : (
                    <Select
                      onValueChange={(id) => {
                        const partner = availablePartners.find((p) => p.id === id) || null
                        setSelectedPartner(partner)
                        setSelectedPartnerPackage(null)
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={`Select ${profileType === "creator" ? "studio" : "creator"}`} />
                      </SelectTrigger>
                      <SelectContent>
                        {availablePartners.map((p) => (
                          <SelectItem key={p.id} value={p.id}>
                            <div className="flex items-center gap-2">
                              <span>{p.name || p.display_name}</span>
                              {p.city && <span className="text-xs text-muted-foreground">• {p.city}</span>}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                </div>

                {selectedPartner && partnerPackages.length > 0 && (
                  <div>
                    <Label>Select Package from {selectedPartner.name || selectedPartner.display_name}</Label>
                    <RadioGroup
                      value={selectedPartnerPackage?.id || ""}
                      onValueChange={(id) => {
                        const pkg = partnerPackages.find((p) => p.id === id) || null
                        setSelectedPartnerPackage(pkg)
                      }}
                    >
                      {partnerPackages.map((pkg) => (
                        <Card key={pkg.id} className="cursor-pointer">
                          <CardContent className="flex items-start space-x-3 p-4">
                            <RadioGroupItem value={pkg.id} id={pkg.id} />
                            <Label htmlFor={pkg.id} className="flex-1 cursor-pointer">
                              <div className="flex justify-between items-start">
                                <div>
                                  <p className="font-medium">{pkg.name}</p>
                                  <p className="text-sm text-muted-foreground">{pkg.description}</p>
                                </div>
                                <p className="font-semibold">£{(pkg.price / 100).toFixed(2)}</p>
                              </div>
                            </Label>
                          </CardContent>
                        </Card>
                      ))}
                    </RadioGroup>
                  </div>
                )}
              </div>
            )}

            {/* Total Price */}
            <div className="border-t pt-4">
              <div className="flex justify-between items-center text-lg font-semibold">
                <span>Total</span>
                <span>£{(totalPrice / 100).toFixed(2)}</span>
              </div>
            </div>

            {/* Continue to Payment Button */}
            <Button
              onClick={handleContinueToPayment}
              disabled={!date || !time || totalPrice === 0 || loading}
              className="w-full"
              size="lg"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Loading...
                </>
              ) : (
                `Continue to Payment - £${(totalPrice / 100).toFixed(2)}`
              )}
            </Button>
          </div>
        )}

        {step === "payment" && clientSecret && (
          <div className="space-y-4">
            {/* Booking Summary */}
            <div className="bg-muted p-4 rounded-lg space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Date:</span>
                <span className="font-medium">{date?.toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Time:</span>
                <span className="font-medium">{time}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Duration:</span>
                <span className="font-medium">{duration} hours</span>
              </div>
              <div className="flex justify-between pt-2 border-t">
                <span className="font-semibold">Total:</span>
                <span className="font-semibold">£{(totalPrice / 100).toFixed(2)}</span>
              </div>
            </div>

            {/* Stripe Elements Payment Form */}
            <Elements stripe={getStripe()} options={{ clientSecret }}>
              <PaymentForm
                profileType={profileType}
                profileId={profileId}
                date={date!.toISOString().split("T")[0]}
                time={time}
                duration={duration}
                bookingType={bookingType}
                packageIds={selectedPackages.map((p) => p.id)}
                partnerId={selectedPartner?.id}
                partnerPackageId={selectedPartnerPackage?.id}
                totalPrice={totalPrice}
                onSuccess={handleBookingSuccess}
                onCancel={() => setStep("details")}
              />
            </Elements>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
