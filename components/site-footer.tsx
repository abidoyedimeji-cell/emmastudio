import Link from "next/link"

export function SiteFooter() {
  return (
    <footer className="border-t bg-secondary/30 pb-20">
      <div className="container py-8 sm:py-12 pl-6 sm:pl-11 pr-4 sm:pr-6 max-w-full overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 sm:gap-8">
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="flex items-center space-x-2 mb-4">
              <span className="font-serif text-xl font-bold text-primary">EMMA STUDIOS</span>
            </Link>
            <p className="text-sm text-muted-foreground max-w-md leading-relaxed">
              The premier platform for discovering and booking creative spaces and professionals. From photography
              studios to recording spaces, find your perfect creative match.
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-4">For Clients</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/browse" className="text-muted-foreground hover:text-foreground transition-colors">
                  Browse Studios
                </Link>
              </li>
              <li>
                <Link href="/creators" className="text-muted-foreground hover:text-foreground transition-colors">
                  Find Creators
                </Link>
              </li>
              <li>
                <Link href="/how-it-works" className="text-muted-foreground hover:text-foreground transition-colors">
                  How It Works
                </Link>
              </li>
              <li>
                <Link href="/terms/clients" className="text-muted-foreground hover:text-foreground transition-colors">
                  Client Terms
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">For Creators</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/creators-apply" className="text-muted-foreground hover:text-foreground transition-colors">
                  Join as Creator
                </Link>
              </li>
              <li>
                <Link href="/become-partner" className="text-muted-foreground hover:text-foreground transition-colors">
                  List Your Studio
                </Link>
              </li>
              <li>
                <Link href="/how-it-works" className="text-muted-foreground hover:text-foreground transition-colors">
                  How Bookings Work
                </Link>
              </li>
              <li>
                <Link href="/policies" className="text-muted-foreground hover:text-foreground transition-colors">
                  Booking Policies
                </Link>
              </li>
              <li>
                <Link href="/terms/creators" className="text-muted-foreground hover:text-foreground transition-colors">
                  Creator Terms
                </Link>
              </li>
              <li>
                <Link href="/terms/partners" className="text-muted-foreground hover:text-foreground transition-colors">
                  Partner Terms
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t mt-6 sm:mt-8 pt-6 sm:pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs sm:text-sm text-muted-foreground">
          <p>© 2026 EMMA STUDIOS. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="/privacy" className="hover:text-foreground transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms/clients" className="hover:text-foreground transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
