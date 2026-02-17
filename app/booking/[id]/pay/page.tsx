"use client"

import { useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"
import { SiteHeader } from "@/components/site-header"

export default function BookingPayPage() {
  const { id } = useParams()
  const router = useRouter()

  useEffect(() => {
    async function initPayment() {
      try {
        const res = await fetch(`/api/marketplace/bookings/${id}/pay`, {
          method: "POST",
        })
        const data = await res.json()

        if (data.checkoutUrl) {
          window.location.href = data.checkoutUrl
        } else {
          router.push(`/booking/${id}?payment=error`)
        }
      } catch {
        router.push(`/booking/${id}?payment=error`)
      }
    }

    initPayment()
  }, [id, router])

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SiteHeader />
      <main className="flex-1 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Redirecting to payment...</p>
        </div>
      </main>
    </div>
  )
}
