"use client"

import { Suspense } from "react"
import { useState } from "react"
import useSWR from "swr"
import { useRouter, useSearchParams, useParams } from "next/navigation"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BookingCalendar } from "@/components/booking-calendar"
import { BookingDetailsForm } from "@/components/booking-details-form"
import { BookingPayment } from "@/components/booking-payment"
import { BookingConfirmation } from "@/components/booking-confirmation"
import { ChevronLeft, Check, Loader2, Clock } from "lucide-react"
import Link from "next/link"

type BookingStep = "package" | "datetime" | "details" | "payment" | "confirmation"

const fetcher = (url: string) => fetch(url).then((r) => r.json())

export default function BookingPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>}>
      <BookingContent />
    </Suspense>
  )
}

function BookingContent() {
  const { slug } = useParams<{ slug: string }>()
  const router = useRouter()
  const searchParams = useSearchParams()
  const preselectedPackageId = searchParams.get("package")

  // Fetch studio from API
  const { data: studios = [] } = useSWR<any[]>(
    `/api/studios?search=${slug}`,
    fetcher
  )
  const studio = studios.find((s: any) => s.slug === slug) || null

  // Fetch packages for this studio from Supabase via a simple API
  const { data: packages = [], isLoading: packagesLoading } = useSWR<any[]>(
    studio ? `/api/packages?studio_id=${studio.id}` : null,
    fetcher
  )

  const [currentStep, setCurrentStep] = useState<BookingStep>(preselectedPackageId ? "datetime" : "package")
  const [selectedPackageId, setSelectedPackageId] = useState<string | null>(preselectedPackageId)
  const [selectedDateTime, setSelectedDateTime] = useState<{ date: string; time: string } | null>(null)
  const [bookingDetails, setBookingDetails] = useState<{
    name: string
    email: string
    phone: string
    notes: string
  } | null>(null)
  const [bookingId, setBookingId] = useState<string | null>(null)

  if (!studio && !packagesLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <SiteHeader />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-muted-foreground mb-4">Studio not found</p>
            <Link href="/studios"><Button variant="outline">Browse Studios</Button></Link>
          </div>
        </main>
        <SiteFooter />
      </div>
    )
  }

  if (!studio) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  const selectedPackage = selectedPackageId ? packages.find((p: any) => p.id === selectedPackageId) : null

  const steps = [
    { id: "package", label: "Select Package", completed: currentStep !== "package" },
    { id: "datetime", label: "Date & Time", completed: ["details", "payment", "confirmation"].includes(currentStep) },
    { id: "details", label: "Your Details", completed: ["payment", "confirmation"].includes(currentStep) },
    { id: "payment", label: "Payment", completed: currentStep === "confirmation" },
  ]

  const handlePackageSelect = (packageId: string) => {
    setSelectedPackageId(packageId)
    setCurrentStep("datetime")
  }

  const handleDateTimeSelect = (date: string, time: string) => {
    setSelectedDateTime({ date, time })
    setCurrentStep("details")
  }

  const handleDetailsSubmit = (details: { name: string; email: string; phone: string; notes: string }) => {
    setBookingDetails(details)
    setCurrentStep("payment")
  }

  const handlePaymentComplete = () => {
    const newBookingId = `booking-${Date.now()}`
    setBookingId(newBookingId)
    setCurrentStep("confirmation")
  }

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />

      <main className="flex-1 bg-secondary/30 py-8">
        <div className="container max-w-6xl">
          <Link href={`/studio/${studio.slug}`}>
            <Button variant="ghost" className="mb-6 bg-transparent">
              <ChevronLeft className="h-4 w-4 mr-2" />
              Back to Studio
            </Button>
          </Link>

          {/* Progress Steps */}
          {currentStep !== "confirmation" && (
            <div className="mb-8">
              <div className="flex items-center justify-between">
                {steps.map((step, index) => (
                  <div key={step.id} className="flex items-center flex-1">
                    <div className="flex items-center">
                      <div
                        className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                          step.completed
                            ? "bg-primary border-primary text-primary-foreground"
                            : currentStep === step.id
                              ? "border-primary text-primary bg-background"
                              : "border-border text-muted-foreground bg-background"
                        }`}
                      >
                        {step.completed ? <Check className="h-5 w-5" /> : <span>{index + 1}</span>}
                      </div>
                      <span
                        className={`ml-3 text-sm font-medium hidden md:inline ${
                          currentStep === step.id ? "text-foreground" : "text-muted-foreground"
                        }`}
                      >
                        {step.label}
                      </span>
                    </div>
                    {index < steps.length - 1 && (
                      <div className={`flex-1 h-0.5 mx-4 ${step.completed ? "bg-primary" : "bg-border"}`} />
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              {currentStep === "package" && (
                <Card>
                  <CardHeader>
                    <CardTitle>Select a Package</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {packagesLoading ? (
                      <div className="flex items-center justify-center py-12">
                        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                      </div>
                    ) : packages.length === 0 ? (
                      <div className="text-center py-8">
                        <p className="text-muted-foreground mb-2">No packages available yet.</p>
                        <p className="text-sm text-muted-foreground">Contact the studio directly for custom booking.</p>
                      </div>
                    ) : (
                      packages.map((pkg: any) => (
                        <div
                          key={pkg.id}
                          className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                            selectedPackageId === pkg.id
                              ? "border-primary bg-primary/5"
                              : "border-border hover:border-primary/50"
                          }`}
                          onClick={() => handlePackageSelect(pkg.id)}
                        >
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <h3 className="font-semibold text-lg">{pkg.name}</h3>
                              {pkg.is_popular && (
                                <span className="text-xs bg-accent text-accent-foreground px-2 py-0.5 rounded-full">Popular</span>
                              )}
                            </div>
                            <div className="text-right">
                              <p className="font-bold text-lg">{"\u00A3"}{pkg.price}</p>
                              <p className="text-sm text-muted-foreground flex items-center gap-1 justify-end">
                                <Clock className="h-3 w-3" />
                                {pkg.duration_hours}h
                              </p>
                            </div>
                          </div>
                          <p className="text-sm text-muted-foreground mb-3">{pkg.description}</p>
                          {pkg.includes && (
                            <div className="flex flex-wrap gap-2">
                              {(pkg.includes as string[]).slice(0, 4).map((item: string) => (
                                <span key={item} className="text-xs bg-secondary px-2 py-1 rounded-md text-secondary-foreground">
                                  {item}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      ))
                    )}

                    {/* Fallback: use studio hourly/half-day/full-day rates as packages */}
                    {packages.length === 0 && !packagesLoading && (
                      <div className="space-y-3 mt-4">
                        <p className="text-sm font-medium">Or book by duration:</p>
                        {[
                          { id: "hourly", name: "1 Hour Session", price: studio.hourly_rate, hours: 1 },
                          { id: "half-day", name: "Half Day (3 Hours)", price: studio.half_day_rate, hours: 3 },
                          { id: "full-day", name: "Full Day (6 Hours)", price: studio.full_day_rate, hours: 6 },
                        ].filter(p => p.price).map((pkg) => (
                          <div
                            key={pkg.id}
                            className="border-2 rounded-lg p-4 cursor-pointer hover:border-primary/50 transition-all border-border"
                            onClick={() => {
                              setSelectedPackageId(pkg.id)
                              setCurrentStep("datetime")
                            }}
                          >
                            <div className="flex justify-between items-center">
                              <span className="font-medium">{pkg.name}</span>
                              <span className="font-bold">{"\u00A3"}{pkg.price}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              {currentStep === "datetime" && selectedPackage && (
                <BookingCalendar
                  packageData={selectedPackage}
                  onSelect={handleDateTimeSelect}
                  onBack={() => setCurrentStep("package")}
                />
              )}

              {currentStep === "details" && (
                <BookingDetailsForm
                  onSubmit={handleDetailsSubmit}
                  onBack={() => setCurrentStep("datetime")}
                  initialData={bookingDetails}
                />
              )}

              {currentStep === "payment" && selectedPackage && bookingDetails && selectedDateTime && (
                <BookingPayment
                  packageData={selectedPackage}
                  bookingDetails={bookingDetails}
                  dateTime={selectedDateTime}
                  onComplete={handlePaymentComplete}
                  onBack={() => setCurrentStep("details")}
                />
              )}

              {currentStep === "confirmation" && bookingId && selectedPackage && bookingDetails && selectedDateTime && (
                <BookingConfirmation
                  bookingId={bookingId}
                  packageData={selectedPackage}
                  studio={studio}
                  creator={null}
                  bookingDetails={bookingDetails}
                  dateTime={selectedDateTime}
                />
              )}
            </div>

            {/* Sidebar */}
            {currentStep !== "confirmation" && (
              <div className="lg:col-span-1">
                <Card className="sticky top-20">
                  <CardHeader>
                    <CardTitle className="text-lg">Booking Summary</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Studio</p>
                      <p className="font-semibold">{studio.name}</p>
                    </div>

                    {selectedPackage && (
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Package</p>
                        <p className="font-semibold">{selectedPackage.name}</p>
                        <p className="text-sm text-muted-foreground">{selectedPackage.duration_hours || selectedPackage.hours}h</p>
                      </div>
                    )}

                    {selectedDateTime && (
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Date & Time</p>
                        <p className="font-semibold">
                          {new Date(selectedDateTime.date).toLocaleDateString("en-GB", {
                            weekday: "long",
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </p>
                        <p className="text-sm text-muted-foreground">{selectedDateTime.time}</p>
                      </div>
                    )}

                    {selectedPackage && (
                      <div className="pt-4 border-t space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Package Price</span>
                          <span>{"\u00A3"}{selectedPackage.price}</span>
                        </div>
                        <div className="flex justify-between text-sm text-muted-foreground">
                          <span>Deposit (50%)</span>
                          <span>{"\u00A3"}{Math.round(selectedPackage.price / 2)}</span>
                        </div>
                        <div className="flex justify-between font-bold text-lg pt-2 border-t">
                          <span>Total</span>
                          <span>{"\u00A3"}{selectedPackage.price}</span>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  )
}
