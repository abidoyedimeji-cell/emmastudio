import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { Card, CardContent } from "@/components/ui/card"
import { AlertCircle, CreditCard, Calendar, RefreshCw, Shield } from "lucide-react"

export const metadata = {
  title: "Deposit Policies and Cancellation Terms | EMMA STUDIOS",
  description:
    "Understand EMMA STUDIOS booking policies including 50% deposit requirements, cancellation terms, refund policies, and rescheduling options for creator and studio bookings.",
}

export default function PoliciesPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-24 md:py-32 bg-secondary/30">
          <div className="container max-w-4xl px-6">
            <div className="text-center">
              <h1 className="text-5xl md:text-7xl font-semibold tracking-tighter text-balance mb-6">
                Deposit Policies and Cancellation Terms
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                Clear, fair policies to protect both clients and creators
              </p>
            </div>
          </div>
        </section>

        {/* Deposit Policy */}
        <section className="py-20 md:py-32">
          <div className="container max-w-4xl px-6">
            <div className="mb-16">
              <div className="flex items-center gap-3 mb-6">
                <CreditCard className="h-8 w-8 text-primary" />
                <h2 className="text-4xl md:text-5xl font-semibold tracking-tight">Deposit Requirements</h2>
              </div>
              <Card>
                <CardContent className="p-8">
                  <h3 className="text-2xl font-semibold mb-4">50% Deposit to Secure Booking</h3>
                  <p className="text-muted-foreground mb-6 leading-relaxed">
                    All bookings require a 50% deposit at the time of booking. This deposit secures your creator's time
                    and studio space, and automatically blocks calendars to prevent double-booking.
                  </p>

                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-2">How Deposits Work:</h4>
                      <ul className="space-y-2 text-muted-foreground">
                        <li className="flex gap-2">
                          <span>•</span>
                          <span>50% paid upfront via secure Stripe payment</span>
                        </li>
                        <li className="flex gap-2">
                          <span>•</span>
                          <span>Funds held in escrow until booking completion</span>
                        </li>
                        <li className="flex gap-2">
                          <span>•</span>
                          <span>Remaining 50% due on the day of the session</span>
                        </li>
                        <li className="flex gap-2">
                          <span>•</span>
                          <span>Creator and studio calendars auto-blocked upon deposit</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Cancellation Policy */}
            <div className="mb-16">
              <div className="flex items-center gap-3 mb-6">
                <AlertCircle className="h-8 w-8 text-primary" />
                <h2 className="text-4xl md:text-5xl font-semibold tracking-tight">Cancellation Policy</h2>
              </div>
              <Card>
                <CardContent className="p-8">
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-xl font-semibold mb-3">Client Cancellations</h3>
                      <ul className="space-y-3 text-muted-foreground">
                        <li className="flex gap-2">
                          <span className="font-semibold text-foreground">7+ days before:</span>
                          <span>Full refund of deposit minus 10% processing fee</span>
                        </li>
                        <li className="flex gap-2">
                          <span className="font-semibold text-foreground">3-6 days before:</span>
                          <span>50% refund of deposit</span>
                        </li>
                        <li className="flex gap-2">
                          <span className="font-semibold text-foreground">Less than 3 days:</span>
                          <span>No refund, full deposit forfeited</span>
                        </li>
                      </ul>
                    </div>

                    <div>
                      <h3 className="text-xl font-semibold mb-3">Creator/Studio Cancellations</h3>
                      <p className="text-muted-foreground mb-3">
                        If a creator or studio cancels your booking for any reason:
                      </p>
                      <ul className="space-y-2 text-muted-foreground">
                        <li className="flex gap-2">
                          <span>•</span>
                          <span>Immediate full refund of deposit</span>
                        </li>
                        <li className="flex gap-2">
                          <span>•</span>
                          <span>EMMA STUDIOS helps find replacement creator/studio</span>
                        </li>
                        <li className="flex gap-2">
                          <span>•</span>
                          <span>Priority rebooking assistance</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Rescheduling Policy */}
            <div className="mb-16">
              <div className="flex items-center gap-3 mb-6">
                <Calendar className="h-8 w-8 text-primary" />
                <h2 className="text-4xl md:text-5xl font-semibold tracking-tight">Rescheduling Options</h2>
              </div>
              <Card>
                <CardContent className="p-8">
                  <h3 className="text-2xl font-semibold mb-4">Flexible Rescheduling</h3>
                  <p className="text-muted-foreground mb-6 leading-relaxed">
                    We understand plans change. Rescheduling is available with the following terms:
                  </p>

                  <ul className="space-y-3 text-muted-foreground">
                    <li className="flex gap-2">
                      <span className="font-semibold text-foreground">7+ days before:</span>
                      <span>Free rescheduling, deposit transfers to new date</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="font-semibold text-foreground">3-6 days before:</span>
                      <span>One free reschedule, subsequent changes incur $50 fee</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="font-semibold text-foreground">Less than 3 days:</span>
                      <span>Rescheduling subject to creator/studio availability, $100 fee applies</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>

            {/* Refund Processing */}
            <div className="mb-16">
              <div className="flex items-center gap-3 mb-6">
                <RefreshCw className="h-8 w-8 text-primary" />
                <h2 className="text-4xl md:text-5xl font-semibold tracking-tight">Refund Processing</h2>
              </div>
              <Card>
                <CardContent className="p-8">
                  <ul className="space-y-3 text-muted-foreground">
                    <li className="flex gap-2">
                      <span>•</span>
                      <span>Refunds processed within 5-7 business days</span>
                    </li>
                    <li className="flex gap-2">
                      <span>•</span>
                      <span>Returned to original payment method</span>
                    </li>
                    <li className="flex gap-2">
                      <span>•</span>
                      <span>Email confirmation sent when refund is initiated</span>
                    </li>
                    <li className="flex gap-2">
                      <span>•</span>
                      <span>Processing fees (10%) non-refundable on cancellations</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>

            {/* Protection */}
            <div>
              <div className="flex items-center gap-3 mb-6">
                <Shield className="h-8 w-8 text-primary" />
                <h2 className="text-4xl md:text-5xl font-semibold tracking-tight">Payment Protection</h2>
              </div>
              <Card>
                <CardContent className="p-8">
                  <h3 className="text-2xl font-semibold mb-4">Escrow Protection</h3>
                  <p className="text-muted-foreground mb-6 leading-relaxed">
                    All deposits are held in secure escrow until the booking is completed. This protects both clients
                    and creators:
                  </p>

                  <ul className="space-y-3 text-muted-foreground">
                    <li className="flex gap-2">
                      <span>•</span>
                      <span>Funds released to creators only after successful session completion</span>
                    </li>
                    <li className="flex gap-2">
                      <span>•</span>
                      <span>Dispute resolution handled by EMMA STUDIOS support team</span>
                    </li>
                    <li className="flex gap-2">
                      <span>•</span>
                      <span>Full transaction audit trail maintained</span>
                    </li>
                    <li className="flex gap-2">
                      <span>•</span>
                      <span>Secure payment processing via Stripe</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* FAQs */}
        <section className="py-20 md:py-32 bg-secondary/30">
          <div className="container max-w-4xl px-6">
            <h2 className="text-4xl md:text-5xl font-semibold tracking-tight mb-12 text-center">
              FAQs About Booking and Deposits
            </h2>

            <div className="space-y-6">
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-2">What happens if I'm late to my session?</h3>
                  <p className="text-muted-foreground text-sm">
                    Your session time starts at the booked time. Late arrivals reduce your available session time, and
                    no refunds are provided for time lost due to late arrival.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-2">Can I extend my session on the day?</h3>
                  <p className="text-muted-foreground text-sm">
                    Extensions are subject to creator and studio availability. If available, additional hours are billed
                    at the creator's hourly rate.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-2">What if I'm not satisfied with the final deliverables?</h3>
                  <p className="text-muted-foreground text-sm">
                    Most packages include one round of revisions. Additional revisions may incur extra fees. Contact
                    support for dispute resolution if quality issues arise.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-2">Do I need to pay for the studio separately?</h3>
                  <p className="text-muted-foreground text-sm">
                    Studios are optional. When you book a studio, the discounted studio rate is added to your total and
                    included in the 50% deposit calculation.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  )
}
