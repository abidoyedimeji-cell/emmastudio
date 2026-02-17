"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface Pricing {
  package_price: number
  addons_total: number
  subtotal: number
  service_fee: number
  total: number
  deposit: number
  balance: number
}

export function BookingSummary({
  pricing,
  packageName,
  showDeposit = true,
}: {
  pricing: Pricing
  packageName?: string
  showDeposit?: boolean
}) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Price Breakdown</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-2 text-sm">
        <div className="flex justify-between">
          <span className="text-muted-foreground">
            {packageName || "Package"}
          </span>
          <span>£{pricing.package_price.toFixed(2)}</span>
        </div>
        {pricing.addons_total > 0 && (
          <div className="flex justify-between">
            <span className="text-muted-foreground">Add-ons</span>
            <span>£{pricing.addons_total.toFixed(2)}</span>
          </div>
        )}
        <div className="flex justify-between">
          <span className="text-muted-foreground">Service fee (8%)</span>
          <span>£{pricing.service_fee.toFixed(2)}</span>
        </div>
        <div className="border-t pt-2 mt-1 flex justify-between font-semibold">
          <span>Total</span>
          <span>£{pricing.total.toFixed(2)}</span>
        </div>
        {showDeposit && (
          <>
            <div className="flex justify-between text-primary font-medium">
              <span>Deposit due now (50%)</span>
              <span>£{pricing.deposit.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-muted-foreground">
              <span>Balance due on day</span>
              <span>£{pricing.balance.toFixed(2)}</span>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}
