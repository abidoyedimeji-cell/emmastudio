import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle, MapPin, Mail, Download } from "lucide-react"
import { CalendarIntegration } from "@/components/calendar-integration"
import type { Package, Studio, User } from "@/lib/types"

interface BookingConfirmationProps {
  bookingId: string
  packageData: Package
  studio: Studio
  creator: User | null | undefined
  bookingDetails: { name: string; email: string; phone: string; notes: string }
  dateTime: { date: string; time: string }
}

export function BookingConfirmation({
  bookingId,
  packageData,
  studio,
  creator,
  bookingDetails,
  dateTime,
}: BookingConfirmationProps) {
  const formattedDate = new Date(dateTime.date).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  return (
    <div className="space-y-6">
      <Card className="border-2 border-primary/20 bg-primary/5">
        <CardContent className="pt-6">
          <div className="flex flex-col items-center text-center">
            <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <CheckCircle className="h-10 w-10 text-primary" />
            </div>
            <h2 className="font-serif text-2xl md:text-3xl font-bold mb-2">Booking Confirmed!</h2>
            <p className="text-muted-foreground text-lg mb-4">
              Your booking has been successfully confirmed. We&apos;ve sent a confirmation email to{" "}
              {bookingDetails.email}
            </p>
            <p className="text-sm text-muted-foreground">
              Booking ID: <span className="font-mono font-semibold">{bookingId}</span>
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Booking Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Studio</p>
              <p className="font-semibold">{studio.name}</p>
              <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span>
                  {studio.location.address}, {studio.location.city}
                </span>
              </div>
            </div>

            {creator && (
              <div>
                <p className="text-sm text-muted-foreground mb-1">Creator</p>
                <p className="font-semibold">{creator.name}</p>
                <p className="text-sm text-muted-foreground">{creator.email}</p>
              </div>
            )}

            <div>
              <p className="text-sm text-muted-foreground mb-1">Package</p>
              <p className="font-semibold">{packageData.name}</p>
              <p className="text-sm text-muted-foreground">{packageData.duration} minutes</p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground mb-1">Date & Time</p>
              <p className="font-semibold">{formattedDate}</p>
              <p className="text-sm text-muted-foreground">{dateTime.time}</p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground mb-1">Client</p>
              <p className="font-semibold">{bookingDetails.name}</p>
              <p className="text-sm text-muted-foreground">{bookingDetails.email}</p>
              <p className="text-sm text-muted-foreground">{bookingDetails.phone}</p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground mb-1">Payment</p>
              <p className="font-semibold">£{packageData.deposit || packageData.price} Paid</p>
              {packageData.deposit && (
                <p className="text-sm text-muted-foreground">
                  £{packageData.price - packageData.deposit} due at studio
                </p>
              )}
            </div>
          </div>

          {bookingDetails.notes && (
            <div className="pt-4 border-t">
              <p className="text-sm text-muted-foreground mb-1">Special Requests</p>
              <p className="text-sm">{bookingDetails.notes}</p>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex flex-col sm:flex-row gap-4">
        <CalendarIntegration
          booking={{
            id: bookingId,
            date: dateTime.date,
            time: dateTime.time,
            duration: packageData.duration,
            notes: bookingDetails.notes,
          }}
          packageData={{
            name: packageData.name,
            description: packageData.description,
          }}
          studio={{
            name: studio.name,
            location: studio.location,
          }}
          creator={creator ? { name: creator.name } : undefined}
        />
        <Button variant="outline" className="flex-1 bg-transparent">
          <Mail className="h-4 w-4 mr-2" />
          Email Confirmation
        </Button>
        <Button variant="outline" className="flex-1 bg-transparent">
          <Download className="h-4 w-4 mr-2" />
          Download Receipt
        </Button>
      </div>

      <div className="text-center pt-4">
        <Link href="/browse">
          <Button variant="ghost">Browse More Studios</Button>
        </Link>
      </div>
    </div>
  )
}
