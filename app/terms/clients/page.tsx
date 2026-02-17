import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"

export const metadata = {
  title: "Client Terms & Conditions - EMMA STUDIOS",
  description: "Terms and conditions for clients using EMMA STUDIOS booking platform",
}

export default function ClientTermsPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />

      <main className="flex-1 py-20">
        <div className="container max-w-4xl px-6">
          <h1 className="text-4xl md:text-5xl font-semibold tracking-tight mb-6">Client Terms & Conditions</h1>
          <p className="text-muted-foreground mb-12">Last updated: {new Date().toLocaleDateString()}</p>

          <div className="prose prose-neutral dark:prose-invert max-w-none space-y-8">
            <section>
              <h2 className="text-2xl font-semibold mb-4">1. Agreement to Terms</h2>
              <p className="text-muted-foreground leading-relaxed">
                By accessing and using EMMA STUDIOS ("Platform"), you agree to be bound by these Client Terms and
                Conditions. If you do not agree to these terms, you may not use our services.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">2. Booking Process</h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  <strong>2.1 Account Creation:</strong> You must create an account before completing a booking. All
                  information provided must be accurate and current.
                </p>
                <p>
                  <strong>2.2 Booking Confirmation:</strong> Bookings are confirmed upon payment of the required deposit
                  (50% or flat rate as specified).
                </p>
                <p>
                  <strong>2.3 Payment Terms:</strong> Full payment is required before the booking date. Deposits are
                  non-refundable except as outlined in our cancellation policy.
                </p>
                <p>
                  <strong>2.4 Escrow Protection:</strong> Funds are held in escrow until service completion. This
                  protects both clients and service providers.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">3. Pricing & Fees</h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  <strong>3.1 Fixed Packages:</strong> All pricing is transparent with fixed packages for studio time
                  and deliverables.
                </p>
                <p>
                  <strong>3.2 Service Fees:</strong> EMMA STUDIOS charges a service fee included in the displayed price.
                </p>
                <p>
                  <strong>3.3 Additional Services:</strong> Additional services can be requested and will be quoted
                  separately.
                </p>
                <p>
                  <strong>3.4 No Hidden Fees:</strong> All costs are disclosed upfront during the booking process.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">4. Cancellation & Refund Policy</h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  <strong>4.1 Client Cancellation:</strong> Cancellations made 48+ hours before booking: 50% refund.
                  Cancellations within 48 hours: No refund.
                </p>
                <p>
                  <strong>4.2 Creator/Studio Cancellation:</strong> If a creator or studio cancels, you receive a full
                  refund or priority rebooking.
                </p>
                <p>
                  <strong>4.3 No-Show Policy:</strong> Failure to show up for a booking results in forfeiture of all
                  payments.
                </p>
                <p>
                  <strong>4.4 Weather/Emergency:</strong> Force majeure events may qualify for rescheduling without
                  penalty.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">5. Loyalty & Referral Program</h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  <strong>5.1 Earning Points:</strong> Clients earn loyalty points on every completed booking.
                </p>
                <p>
                  <strong>5.2 Referral Bonuses:</strong> Refer new clients and receive bonus credits when they complete
                  their first booking.
                </p>
                <p>
                  <strong>5.3 Redemption:</strong> Points can be redeemed for discounts on future bookings as per
                  program terms.
                </p>
                <p>
                  <strong>5.4 Expiration:</strong> Points may expire after 12 months of account inactivity.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">6. Client Responsibilities</h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  <strong>6.1 Punctuality:</strong> Arrive on time for bookings. Late arrivals may result in shortened
                  sessions.
                </p>
                <p>
                  <strong>6.2 Studio Care:</strong> Treat studios and equipment with respect. Damage may result in
                  additional charges.
                </p>
                <p>
                  <strong>6.3 Compliance:</strong> Follow all studio rules and creator instructions during sessions.
                </p>
                <p>
                  <strong>6.4 Communication:</strong> Respond promptly to messages from creators and studios regarding
                  your booking.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">7. Intellectual Property</h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  <strong>7.1 Content Ownership:</strong> Unless otherwise agreed, clients own the final deliverables
                  from their booking.
                </p>
                <p>
                  <strong>7.2 Usage Rights:</strong> Creators may request permission to use content for portfolio
                  purposes.
                </p>
                <p>
                  <strong>7.3 Platform Content:</strong> All platform content, branding, and design remains property of
                  EMMA STUDIOS.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">8. Disputes & Resolution</h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  <strong>8.1 Platform Mediation:</strong> EMMA STUDIOS provides dispute resolution services for
                  booking-related issues.
                </p>
                <p>
                  <strong>8.2 Refund Requests:</strong> Submit refund requests within 7 days of service completion with
                  supporting documentation.
                </p>
                <p>
                  <strong>8.3 Review System:</strong> Honest reviews are encouraged; false or defamatory reviews may
                  result in account suspension.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">9. Limitation of Liability</h2>
              <p className="text-muted-foreground leading-relaxed">
                EMMA STUDIOS acts as a marketplace connecting clients with studios and creators. We are not liable for
                the quality of services provided, personal injury, property damage, or disputes between parties. Our
                maximum liability is limited to the amount paid for the specific booking in question.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">10. Changes to Terms</h2>
              <p className="text-muted-foreground leading-relaxed">
                EMMA STUDIOS reserves the right to modify these terms at any time. Continued use of the platform after
                changes constitutes acceptance of updated terms. Material changes will be communicated via email.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">11. Contact Information</h2>
              <p className="text-muted-foreground leading-relaxed">
                For questions about these terms, contact us at:{" "}
                <a href="mailto:legal@emmastudios.com" className="text-primary hover:underline">
                  legal@emmastudios.com
                </a>
              </p>
            </section>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  )
}
