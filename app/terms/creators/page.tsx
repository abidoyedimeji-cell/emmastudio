import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"

export const metadata = {
  title: "Creator Terms & Conditions - EMMA STUDIOS",
  description: "Terms and conditions for creators on EMMA STUDIOS platform",
}

export default function CreatorTermsPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />

      <main className="flex-1 py-20">
        <div className="container max-w-4xl px-6">
          <h1 className="text-4xl md:text-5xl font-semibold tracking-tight mb-6">Creator Terms & Conditions</h1>
          <p className="text-muted-foreground mb-12">Last updated: {new Date().toLocaleDateString()}</p>

          <div className="prose prose-neutral dark:prose-invert max-w-none space-y-8">
            <section>
              <h2 className="text-2xl font-semibold mb-4">1. Creator Agreement</h2>
              <p className="text-muted-foreground leading-relaxed">
                By joining EMMA STUDIOS as a creator (photographer, videographer, or creative professional), you agree
                to these terms. This agreement defines your relationship with the platform and client engagement
                standards.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">2. Verification & Profile</h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  <strong>2.1 Creator Verification:</strong> All creators undergo verification including portfolio
                  review, credential check, and quality assessment.
                </p>
                <p>
                  <strong>2.2 Profile Requirements:</strong> Maintain an updated profile with bio, specialties,
                  portfolio, pricing, and availability.
                </p>
                <p>
                  <strong>2.3 Portfolio Quality:</strong> Display high-quality work samples relevant to your listed
                  specialties.
                </p>
                <p>
                  <strong>2.4 Professional Standards:</strong> Maintain professional conduct, punctuality, and
                  communication standards.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">3. Commission & Payments</h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  <strong>3.1 Commission Rate:</strong> EMMA STUDIOS retains 20% commission on all bookings (includes
                  payment processing and platform services).
                </p>
                <p>
                  <strong>3.2 Pricing:</strong> Creators set their own rates within platform guidelines. Fixed package
                  pricing required.
                </p>
                <p>
                  <strong>3.3 Payment Schedule:</strong> Receive payment within 7 business days after project completion
                  and client approval.
                </p>
                <p>
                  <strong>3.4 Tips & Bonuses:</strong> Keep 100% of client tips and performance bonuses.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">4. Booking Management</h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  <strong>4.1 Availability:</strong> Maintain accurate calendar availability. Sync external calendars to
                  prevent conflicts.
                </p>
                <p>
                  <strong>4.2 Response Time:</strong> Respond to booking inquiries within 24 hours. Auto-accept
                  recommended for qualified bookings.
                </p>
                <p>
                  <strong>4.3 Cancellations:</strong> Creator-initiated cancellations may result in penalties, rating
                  impact, or account suspension.
                </p>
                <p>
                  <strong>4.4 Studio Coordination:</strong> When studio booking included, coordinate directly with
                  studio partners via platform.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">5. Service Delivery Standards</h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  <strong>5.1 Deliverables:</strong> Provide all services and deliverables as specified in package
                  description.
                </p>
                <p>
                  <strong>5.2 Timeline:</strong> Deliver final work within agreed timeframe (typically 7-14 days for
                  editing/post-production).
                </p>
                <p>
                  <strong>5.3 Quality:</strong> Maintain professional quality standards. Work must match portfolio
                  samples.
                </p>
                <p>
                  <strong>5.4 Revisions:</strong> Provide reasonable revisions as outlined in package terms.
                </p>
                <p>
                  <strong>5.5 Communication:</strong> Keep clients updated on project progress and delivery timelines.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">6. Fixed Packages & Add-Ons</h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  <strong>6.1 Package Structure:</strong> Offer clear fixed packages with defined studio time,
                  deliverables, and pricing.
                </p>
                <p>
                  <strong>6.2 Additional Services:</strong> Clients may request add-ons (extra hours, rush delivery,
                  additional editing, etc.).
                </p>
                <p>
                  <strong>6.3 Pricing Changes:</strong> Package updates apply to new bookings only; honor existing
                  booking prices.
                </p>
                <p>
                  <strong>6.4 Scope Management:</strong> Clearly communicate what's included vs. additional services.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">7. Insurance & Liability</h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  <strong>7.1 Professional Insurance:</strong> Creators recommended to carry professional liability
                  insurance.
                </p>
                <p>
                  <strong>7.2 Equipment:</strong> Creators responsible for their own equipment; platform not liable for
                  damage or loss.
                </p>
                <p>
                  <strong>7.3 Studio Respect:</strong> Treat partner studios and equipment with care; liable for any
                  damages caused.
                </p>
                <p>
                  <strong>7.4 Client Data:</strong> Protect client data and work files according to data protection
                  regulations.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">8. Intellectual Property</h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  <strong>8.1 Client Ownership:</strong> Unless otherwise agreed, clients own final deliverables upon
                  full payment.
                </p>
                <p>
                  <strong>8.2 Portfolio Rights:</strong> Creators may request permission to use work for portfolio and
                  marketing purposes.
                </p>
                <p>
                  <strong>8.3 Usage Agreement:</strong> Clearly communicate usage rights and restrictions with each
                  client.
                </p>
                <p>
                  <strong>8.4 Raw Files:</strong> Creators retain rights to raw/unedited files unless specifically
                  included in package.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">9. Reviews & Ratings</h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  <strong>9.1 Client Reviews:</strong> Clients can review creators after project completion. Reviews are
                  public.
                </p>
                <p>
                  <strong>9.2 Performance Metrics:</strong> Maintain high ratings and response times for better platform
                  visibility.
                </p>
                <p>
                  <strong>9.3 Dispute Resolution:</strong> Contest unfair reviews through platform support with
                  documentation.
                </p>
                <p>
                  <strong>9.4 Featured Status:</strong> Top-rated creators may receive featured placement and
                  promotional benefits.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">10. Platform Support & Growth</h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  <strong>10.1 Marketing:</strong> EMMA STUDIOS promotes creators through platform marketing and
                  featured listings.
                </p>
                <p>
                  <strong>10.2 Training:</strong> Access to resources, best practices, and community support.
                </p>
                <p>
                  <strong>10.3 Analytics:</strong> View booking stats, earnings reports, and performance metrics.
                </p>
                <p>
                  <strong>10.4 SaaS Features:</strong> Future platform tools may include additional fees for premium
                  features.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">11. Termination & Suspension</h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  <strong>11.1 Creator-Initiated:</strong> May leave platform with 30 days notice after completing
                  existing bookings.
                </p>
                <p>
                  <strong>11.2 Platform-Initiated:</strong> EMMA STUDIOS may suspend or terminate accounts for policy
                  violations or quality issues.
                </p>
                <p>
                  <strong>11.3 Pending Payments:</strong> All financial obligations settled within 30 days of
                  termination.
                </p>
                <p>
                  <strong>11.4 Reactivation:</strong> Suspended accounts may appeal for reactivation with documented
                  improvements.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">12. Contact Information</h2>
              <p className="text-muted-foreground leading-relaxed">
                For creator support:{" "}
                <a href="mailto:creators@emmastudios.com" className="text-primary hover:underline">
                  creators@emmastudios.com
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
