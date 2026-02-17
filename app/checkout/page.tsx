"use client"

import { Suspense, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { CreditCard, Lock, Check, Loader2 } from "lucide-react"

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>}>
      <CheckoutContent />
    </Suspense>
  )
}

function CheckoutContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const bookingId = searchParams.get("booking")

  const [paymentDetails, setPaymentDetails] = useState({
    cardNumber: "",
    cardName: "",
    expiryDate: "",
    cvv: "",
  })
  const [acceptedTerms, setAcceptedTerms] = useState(false)
  const [processing, setProcessing] = useState(false)

  const handlePayment = async () => {
    if (!acceptedTerms) {
      alert("Please accept the terms and conditions")
      return
    }

    setProcessing(true)

    // Simulate payment processing
    setTimeout(() => {
      console.log("[v0] Processing payment:", paymentDetails)
      router.push(`/booking-confirmation?id=${bookingId}`)
    }, 2000)
  }

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />

      <main className="flex-1 bg-secondary/30 py-12">
        <div className="container max-w-4xl">
          <div className="mb-8">
            <h1 className="font-serif text-4xl font-bold mb-2">Secure Checkout</h1>
            <p className="text-muted-foreground">Complete your booking with a 50% deposit</p>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Payment Form */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5" />
                    Payment Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="cardName">Cardholder Name</Label>
                    <Input
                      id="cardName"
                      placeholder="John Doe"
                      value={paymentDetails.cardName}
                      onChange={(e) => setPaymentDetails({ ...paymentDetails, cardName: e.target.value })}
                    />
                  </div>

                  <div>
                    <Label htmlFor="cardNumber">Card Number</Label>
                    <Input
                      id="cardNumber"
                      placeholder="1234 5678 9012 3456"
                      value={paymentDetails.cardNumber}
                      onChange={(e) => setPaymentDetails({ ...paymentDetails, cardNumber: e.target.value })}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="expiryDate">Expiry Date</Label>
                      <Input
                        id="expiryDate"
                        placeholder="MM/YY"
                        value={paymentDetails.expiryDate}
                        onChange={(e) => setPaymentDetails({ ...paymentDetails, expiryDate: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="cvv">CVV</Label>
                      <Input
                        id="cvv"
                        placeholder="123"
                        value={paymentDetails.cvv}
                        onChange={(e) => setPaymentDetails({ ...paymentDetails, cvv: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="flex items-start gap-2 pt-4">
                    <Checkbox
                      id="terms"
                      checked={acceptedTerms}
                      onCheckedChange={(checked) => setAcceptedTerms(checked === true)}
                    />
                    <label htmlFor="terms" className="text-sm leading-relaxed cursor-pointer">
                      I accept the{" "}
                      <a href="/terms/clients" className="text-primary hover:underline">
                        terms and conditions
                      </a>{" "}
                      and{" "}
                      <a href="/policies" className="text-primary hover:underline">
                        cancellation policy
                      </a>
                    </label>
                  </div>

                  <Button onClick={handlePayment} disabled={processing} className="w-full bg-accent hover:bg-accent/90">
                    {processing ? (
                      "Processing..."
                    ) : (
                      <>
                        <Lock className="h-4 w-4 mr-2" />
                        Pay Securely
                      </>
                    )}
                  </Button>

                  <p className="text-xs text-center text-muted-foreground">
                    Your payment is secured with 256-bit SSL encryption
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Package Price</span>
                      <span>£350</span>
                    </div>
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>Deposit (50%)</span>
                      <span>£175</span>
                    </div>
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>Remaining Balance</span>
                      <span>£175</span>
                    </div>
                  </div>

                  <div className="pt-4 border-t">
                    <div className="flex justify-between font-bold text-lg">
                      <span>Total Due Today</span>
                      <span>£175</span>
                    </div>
                  </div>

                  <div className="pt-4 border-t space-y-2">
                    <div className="flex items-start gap-2 text-sm">
                      <Check className="h-4 w-4 text-primary mt-0.5" />
                      <span>Instant booking confirmation</span>
                    </div>
                    <div className="flex items-start gap-2 text-sm">
                      <Check className="h-4 w-4 text-primary mt-0.5" />
                      <span>Calendar sync via email</span>
                    </div>
                    <div className="flex items-start gap-2 text-sm">
                      <Check className="h-4 w-4 text-primary mt-0.5" />
                      <span>Free cancellation up to 48h</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  )
}
