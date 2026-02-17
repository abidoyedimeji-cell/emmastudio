import type React from "react"
import type { Metadata } from "next"
import { Suspense } from "react"
import { Geist, Geist_Mono, Playfair_Display } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { FloatingNav } from "@/components/floating-nav"
import { OnboardingReminder } from "@/components/onboarding-reminder"
import "./globals.css"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })
const _playfairDisplay = Playfair_Display({ subsets: ["latin"], weight: ["400", "600", "700"] })

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://emmastudios.com"

export const metadata: Metadata = {
  title: {
    default: "Book Professional Creators and Studios | Photography, Videography, Audio | EMMA STUDIOS",
    template: "%s | EMMA STUDIOS",
  },
  description:
    "Find and book verified photographers, videographers, and audio engineers. Professional studio spaces with seamless online booking. View portfolios, compare packages, and book instantly.",
  generator: "v0.app",
  metadataBase: new URL(siteUrl),
  openGraph: {
    type: "website",
    locale: "en_GB",
    url: siteUrl,
    siteName: "EMMA STUDIOS",
    title: "Book Professional Creators and Studios | EMMA STUDIOS",
    description: "Find and book verified photographers, videographers, and audio engineers. Professional studio spaces with seamless online booking.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Book Professional Creators and Studios | EMMA STUDIOS",
    description: "Find and book verified photographers, videographers, and audio engineers.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION,
  },
  icons: {
    icon: [
      {
        url: "/icon-light-32x32.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/icon-dark-32x32.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/icon.svg",
        type: "image/svg+xml",
      },
    ],
    apple: "/apple-icon.png",
  },
}

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="bg-background">
      <body className={`font-sans antialiased pb-24 md:pb-0`}>
        {children}
        <Suspense fallback={null}>
          <OnboardingReminder />
        </Suspense>
        <Suspense fallback={null}>
          <FloatingNav />
        </Suspense>
        <Analytics />
      </body>
    </html>
  )
}
