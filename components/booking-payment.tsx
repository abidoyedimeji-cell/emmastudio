"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import type { Package } from "@/lib/types"
import { CreditCard, Lock } from "lucide-react"

interface BookingPaymentProps {
  packageData: Package
  bookingDetails: { name: string; email: string; phone: string; notes: string }
  dateTime: { date: string; time: string }
  onComplete: () => void
  onBack: () => void
}

export function BookingPayment({ packageData, onComplete, onBack }: BookingPaymentProps) {
  const [cardNumber, setCardNumber] = useState("")
  const [expiryDate, setExpiryDate] = useState("")
  const [cvv, setCvv] = useState("")
  const [acceptedTerms, setAcceptedTerms] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Mock payment processing
    setTimeout(() => {
      onComplete()
    }, 1000)
  }

  const isValid = cardNumber.length >= 16 && expiryDate && cvv && acceptedTerms

  return (
    <Card>
      <CardHeader>
        <CardTitle>Payment Information</CardTitle>
        <CardDescription>Secure payment powered by Stripe</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-secondary/50 p-4 rounded-lg flex items-start gap-3">
            <Lock className="h-5 w-5 text-primary mt-0.5" />
            <div className="text-sm">
              <p className="font-medium mb-1">Your payment is secure</p>
              <p className="text-muted-foreground text-xs">
                All transactions are encrypted and secure. We never store your payment information.
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="cardNumber">Card Number</Label>
            <div className="relative">
              <Input
                id="cardNumber"
                type="text"
                placeholder="1234 5678 9012 3456"
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value.replace(/\D/g, "").slice(0, 16))}
                maxLength={16}
                required
              />
              <CreditCard className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="expiryDate">Expiry Date</Label>
              <Input
                id="expiryDate"
                type="text"
                placeholder="MM/YY"
                value={expiryDate}
                onChange={(e) => setExpiryDate(e.target.value)}
                maxLength={5}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="cvv">CVV</Label>
              <Input
                id="cvv"
                type="text"
                placeholder="123"
                value={cvv}
                onChange={(e) => setCvv(e.target.value.replace(/\D/g, "").slice(0, 4))}
                maxLength={4}
                required
              />
            </div>
          </div>

          <div className="bg-secondary p-4 rounded-lg space-y-2">
            <div className="flex justify-between text-sm">
              <span>Package Price</span>
              <span>${packageData.price}</span>
            </div>
            {packageData.deposit && (
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Deposit (due today)</span>
                <span>${packageData.deposit}</span>
              </div>
            )}
            <div className="flex justify-between font-bold text-lg pt-2 border-t border-border">
              <span>Total Due Today</span>
              <span>${packageData.deposit || packageData.price}</span>
            </div>
            {packageData.deposit && (
              <p className="text-xs text-muted-foreground pt-2">
                Remaining balance of ${packageData.price - packageData.deposit} due at the studio
              </p>
            )}
          </div>

          <div className="flex items-start gap-2">
            <Checkbox
              id="terms"
              checked={acceptedTerms}
              onCheckedChange={(checked) => setAcceptedTerms(checked === true)}
            />
            <Label htmlFor="terms" className="text-sm leading-relaxed cursor-pointer">
              I agree to the terms and conditions, cancellation policy, and understand that this booking is subject to
              studio availability
            </Label>
          </div>

          <div className="flex gap-4 pt-4">
            <Button type="button" variant="outline" onClick={onBack} className="flex-1 bg-transparent">
              Back
            </Button>
            <Button type="submit" disabled={!isValid} className="flex-1 bg-accent hover:bg-accent/90">
              Complete Booking
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
