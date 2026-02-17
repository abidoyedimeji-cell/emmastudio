import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"

export const metadata = {
  title: "Partner Terms & Conditions - EMMA STUDIOS",
  description: "Terms and conditions for studio partners on EMMA STUDIOS platform",
}

export default function PartnerTermsPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />

      <main className="flex-1 py-20">
        <div className="container max-w-4xl px-6">
          <h1 className="text-4xl md:text-5xl font-semibold tracking-tight mb-6">Partner Terms & Conditions</h1>
          <p className="text-muted-foreground mb-12">Last updated: {new Date().toLocaleDateString()}</p>

          <div className="prose prose-neutral dark:prose-invert max-w-none space-y-8">
            <section>
              <h2 className="text-2xl font-semibold mb-4">1. Partnership Agreement</h2>
              <p className="text-muted-foreground leading-relaxed">
                By listing your studio on EMMA STUDIOS, you agree to these Partner Terms. This agreement governs your
                relationship with the platform and outlines responsibilities, revenue sharing, and operational
                standards.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">2. Studio Verification & Listing</h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  <strong>2.1 Verification Process:</strong> All studios undergo thorough verification including
                  facility inspection, documentation review, and quality assessment.
                </p>
                <p>
                  <strong>2.2 Listing Requirements:</strong> Provide accurate descriptions, high-quality photos,
                  complete amenity lists, and current availability.
                </p>
                <p>
                  <strong>2.3 Updates:</strong> Keep your listing information current. Notify EMMA STUDIOS of any
                  changes to facilities or services.
                </p>
                <p>
                  <strong>2.4 Standards:</strong> Maintain professional standards for cleanliness, equipment, and
                  customer service.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">3. Revenue & Commission Structure</h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  <strong>3.1 Commission Rate:</strong> EMMA STUDIOS retains a commission on each booking (rate varies
                  by package tier).
                </p>
                <p>
                  <strong>3.2 Pricing Control:</strong> Partners set their base rates. EMMA STUDIOS may offer
                  promotional discounts from platform margins.
                </p>
                <p>
                  <strong>3.3 Payout Schedule:</strong> Payments processed within 7 business days after booking
                  completion.
                </p>
                <p>
                  <strong>3.4 Studio Discounts:</strong> Partners agree to exclusive platform pricing which may be lower
                  than direct-booking rates.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">4. Booking Management</h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  <strong>4.1 Calendar Accuracy:</strong> Maintain accurate, real-time availability. Sync external
                  calendars to prevent double-bookings.
                </p>
                <p>
                  <strong>4.2 Confirmation:</strong> Respond to booking requests within 24 hours. Auto-confirmation is
                  recommended.
                </p>
                <p>
                  <strong>4.3 Cancellations:</strong> Studio-initiated cancellations may result in penalties or listing
                  suspension.
                </p>
                <p>
                  <strong>4.4 Access:</strong> Ensure timely studio access for all confirmed bookings.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">5. Quality & Service Standards</h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  <strong>5.1 Facility Maintenance:</strong> Keep studios clean, well-maintained, and equipped as
                  advertised.
                </p>
                <p>
                  <strong>5.2 Equipment:</strong> All listed equipment must be functional and professional-grade.
                </p>
                <p>
                  <strong>5.3 Support:</strong> Provide technical support and assistance during bookings when needed.
                </p>
                <p>
                  <strong>5.4 Safety:</strong> Comply with all safety regulations and insurance requirements.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">6. Insurance & Liability</h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  <strong>6.1 Studio Insurance:</strong> Partners must maintain adequate liability insurance for their
                  facilities.
                </p>
                <p>
                  <strong>6.2 Equipment Coverage:</strong> Partners responsible for equipment damage caused by clients
                  (insurance recommended).
                </p>
                <p>
                  <strong>6.3 Platform Liability:</strong> EMMA STUDIOS is not liable for incidents occurring at partner
                  studios.
                </p>
                <p>
                  <strong>6.4 Client Issues:</strong> Partners handle direct client disputes; platform provides
                  mediation support.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">7. Exclusivity & Competition</h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  <strong>7.1 Multi-Platform Listing:</strong> Partners may list on other platforms but must honor EMMA
                  STUDIOS bookings.
                </p>
                <p>
                  <strong>7.2 Direct Bookings:</strong> Direct client bookings outside the platform are permitted but
                  not encouraged during active listings.
                </p>
                <p>
                  <strong>7.3 Pricing Parity:</strong> Platform pricing should be competitive with direct booking rates.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">8. Marketing & Promotion</h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  <strong>8.1 Platform Marketing:</strong> EMMA STUDIOS markets partner studios through various
                  channels.
                </p>
                <p>
                  <strong>8.2 Content Usage:</strong> Platform may use studio photos and information for promotional
                  purposes.
                </p>
                <p>
                  <strong>8.3 Featured Listings:</strong> High-performing studios may receive featured placement
                  (criteria apply).
                </p>
                <p>
                  <strong>8.4 Reviews:</strong> Partner ratings and reviews are publicly displayed to maintain
                  transparency.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">9. Data & Privacy</h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  <strong>9.1 Client Data:</strong> Partners receive booking information necessary for service delivery
                  only.
                </p>
                <p>
                  <strong>9.2 Data Protection:</strong> Partners must comply with data protection regulations (GDPR,
                  etc.).
                </p>
                <p>
                  <strong>9.3 Platform Analytics:</strong> EMMA STUDIOS may use anonymized booking data for platform
                  improvements.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">10. Termination</h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  <strong>10.1 Partner-Initiated:</strong> Partners may terminate with 30 days notice after fulfilling
                  existing bookings.
                </p>
                <p>
                  <strong>10.2 Platform-Initiated:</strong> EMMA STUDIOS may terminate partnerships for policy
                  violations or quality issues.
                </p>
                <p>
                  <strong>10.3 Outstanding Payments:</strong> All financial obligations settled within 30 days of
                  termination.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">11. Contact Information</h2>
              <p className="text-muted-foreground leading-relaxed">
                For partnership inquiries:{" "}
                <a href="mailto:partners@emmastudios.com" className="text-primary hover:underline">
                  partners@emmastudios.com
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
