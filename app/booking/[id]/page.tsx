"use client"

import { Suspense, useState, useEffect } from "react"
import { useParams, useSearchParams } from "next/navigation"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { BookingStatusBadge } from "@/components/marketplace/booking-status-badge"
import { StatusTimeline } from "@/components/marketplace/status-timeline"
import { ExpiryCountdown } from "@/components/marketplace/expiry-countdown"
import { AcceptDeclineControls } from "@/components/marketplace/accept-decline-controls"
import { BookingSummary } from "@/components/marketplace/booking-summary"
import { BookingChat } from "@/components/marketplace/booking-chat"
import { Calendar, Clock, CreditCard, Loader2, MapPin, Check, X } from "lucide-react"

interface BookingData {
  id: string
  status: string
  listing_type: string
  requested_date: string
  requested_start: string
  duration_hours: number
  customer_note: string
  customer_id: string
  request_expires_at: string
  hold_expires_at: string | null
  created_at: string
  marketplace_packages: { id: string; name: string; base_price: number } | null
  booking_parties: Array<{
    id: string
    party_role: string
    listing_type: string
    decision: string
    decided_at: string | null
    profile_id: string
    profiles: { id: string; first_name: string; email: string; avatar_url: string | null }
  }>
  booking_addons: Array<{
    id: string
    quantity: number
    unit_price: number
    addons: { id: string; name: string; price: number }
  }>
  mp_conversations: { id: string }[] | null
  pricing: {
    package_price: number
    addons_total: number
    subtotal: number
    service_fee: number
    total: number
    deposit: number
    balance: number
  }
  viewer: {
    is_customer: boolean
    is_party: boolean
    is_admin: boolean
    user_id: string
  }
}

export default function BookingDetailPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    }>
      <BookingDetailContent />
    </Suspense>
  )
}

function BookingDetailContent() {
  const { id } = useParams()
  const searchParams = useSearchParams()
  const paymentStatus = searchParams.get("payment")

  const [booking, setBooking] = useState<BookingData | null>(null)
  const [loading, setLoading] = useState(true)
  const [payLoading, setPayLoading] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    fetchBooking()
  }, [id])

  async function fetchBooking() {
    try {
      const res = await fetch(`/api/marketplace/bookings/${id}`)
      if (!res.ok) throw new Error("Failed to load booking")
      const data = await res.json()
      setBooking(data)
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setLoading(false)
    }
  }

  async function handlePay() {
    setPayLoading(true)
    try {
      const res = await fetch(`/api/marketplace/bookings/${id}/pay`, {
        method: "POST",
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl
      }
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setPayLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <SiteHeader />
        <main className="flex-1 flex items-center justify-center">
          <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
        </main>
      </div>
    )
  }

  if (error || !booking) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <SiteHeader />
        <main className="flex-1 flex items-center justify-center">
          <p className="text-destructive">{error || "Booking not found"}</p>
        </main>
      </div>
    )
  }

  const conversationId = booking.mp_conversations?.[0]?.id
  const isCustomer = booking.viewer.is_customer
  const isPartyMember = booking.viewer.is_party
  const canAcceptDecline =
    isPartyMember &&
    booking.status === "requested" &&
    booking.booking_parties?.some(
      (p) => p.profile_id === booking.viewer.user_id && p.decision === "pending"
    )
  const canPay = isCustomer && booking.status === "pending_payment"

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SiteHeader />
      <main className="flex-1 container max-w-3xl mx-auto px-4 py-8">
        {/* Payment result banner */}
        {paymentStatus === "success" && (
          <div className="flex items-center gap-2 bg-green-50 dark:bg-green-950 text-green-700 dark:text-green-400 p-3 rounded-lg mb-6 text-sm">
            <Check className="w-4 h-4" />
            Payment successful. Your booking is now confirmed.
          </div>
        )}
        {paymentStatus === "cancelled" && (
          <div className="flex items-center gap-2 bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-400 p-3 rounded-lg mb-6 text-sm">
            <X className="w-4 h-4" />
            Payment was cancelled. You can try again below.
          </div>
        )}

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-balance">Booking Details</h1>
            <p className="text-sm text-muted-foreground mt-1">
              ID: {booking.id.slice(0, 8)}...
            </p>
          </div>
          <BookingStatusBadge status={booking.status} />
        </div>

        {/* Status Timeline */}
        <StatusTimeline status={booking.status} />

        {/* Expiry Countdowns */}
        <div className="flex flex-wrap gap-2 mt-4 mb-6">
          {booking.status === "requested" && booking.request_expires_at && (
            <ExpiryCountdown
              expiresAt={booking.request_expires_at}
              label="Request expires"
            />
          )}
          {booking.status === "pending_payment" && booking.hold_expires_at && (
            <ExpiryCountdown
              expiresAt={booking.hold_expires_at}
              label="Payment deadline"
            />
          )}
        </div>

        <div className="grid gap-6 lg:grid-cols-5">
          {/* Main content */}
          <div className="lg:col-span-3 flex flex-col gap-6">
            {/* Booking Info */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Booking Details</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-3 text-sm">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <span>
                    {new Date(booking.requested_date).toLocaleDateString("en-GB", {
                      weekday: "long",
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                  <span>
                    {booking.requested_start?.slice(0, 5)} - {booking.duration_hours}h session
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-muted-foreground" />
                  <span className="capitalize">{booking.listing_type} booking</span>
                </div>
                {booking.customer_note && (
                  <div className="mt-2 p-3 bg-muted rounded-md">
                    <p className="text-xs font-medium text-muted-foreground mb-1">Customer note</p>
                    <p className="text-sm">{booking.customer_note}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Parties */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Parties</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-3">
                {booking.booking_parties?.map((party) => (
                  <div key={party.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar className="w-8 h-8">
                        <AvatarImage src={party.profiles?.avatar_url || undefined} />
                        <AvatarFallback className="text-xs">
                          {party.profiles?.first_name?.charAt(0) || "?"}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium">{party.profiles?.first_name}</p>
                        <p className="text-xs text-muted-foreground capitalize">
                          {party.party_role} ({party.listing_type})
                        </p>
                      </div>
                    </div>
                    <div>
                      {party.decision === "accepted" && (
                        <span className="flex items-center gap-1 text-xs text-green-600">
                          <Check className="w-3 h-3" /> Accepted
                        </span>
                      )}
                      {party.decision === "declined" && (
                        <span className="flex items-center gap-1 text-xs text-destructive">
                          <X className="w-3 h-3" /> Declined
                        </span>
                      )}
                      {party.decision === "pending" && (
                        <span className="text-xs text-muted-foreground">Pending</span>
                      )}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Accept/Decline */}
            {canAcceptDecline && (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">Your Decision</CardTitle>
                </CardHeader>
                <CardContent>
                  <AcceptDeclineControls
                    bookingId={booking.id}
                    onAction={fetchBooking}
                  />
                </CardContent>
              </Card>
            )}

            {/* Pay deposit */}
            {canPay && (
              <Card className="border-primary">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <CreditCard className="w-4 h-4" />
                    Pay Deposit
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col gap-3">
                  <p className="text-sm text-muted-foreground">
                    All parties have accepted. Pay the 50% deposit to confirm your booking.
                  </p>
                  <Button onClick={handlePay} disabled={payLoading} className="w-full">
                    {payLoading && <Loader2 className="w-4 h-4 animate-spin mr-1.5" />}
                    Pay £{booking.pricing.deposit.toFixed(2)} Deposit
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Chat */}
            {conversationId && (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">Conversation</CardTitle>
                </CardHeader>
                <CardContent>
                  <BookingChat
                    conversationId={conversationId}
                    currentUserId={booking.viewer.user_id}
                  />
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            <BookingSummary
              pricing={booking.pricing}
              packageName={booking.marketplace_packages?.name}
            />

            {/* Addons */}
            {booking.booking_addons && booking.booking_addons.length > 0 && (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">Add-ons</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col gap-2 text-sm">
                  {booking.booking_addons.map((ba) => (
                    <div key={ba.id} className="flex justify-between">
                      <span>
                        {ba.addons?.name} x{ba.quantity}
                      </span>
                      <span>£{(ba.quantity * ba.unit_price).toFixed(2)}</span>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}
