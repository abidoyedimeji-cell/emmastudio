"use client"

import { Check, Clock, X, CreditCard, Star } from "lucide-react"

const STEPS = [
  { key: "requested", label: "Requested", icon: Clock },
  { key: "party_confirmed", label: "Parties Accepted", icon: Check },
  { key: "pending_payment", label: "Payment", icon: CreditCard },
  { key: "confirmed", label: "Confirmed", icon: Check },
  { key: "completed", label: "Completed", icon: Star },
]

const STATUS_ORDER: Record<string, number> = {
  requested: 0,
  party_confirmed: 1,
  pending_payment: 2,
  confirmed: 3,
  completed: 4,
  cancelled: -1,
  declined: -1,
  expired: -1,
}

export function StatusTimeline({ status }: { status: string }) {
  const currentIndex = STATUS_ORDER[status] ?? -1
  const isFailed = currentIndex === -1

  return (
    <div className="flex items-center gap-1 w-full overflow-x-auto py-2">
      {STEPS.map((step, i) => {
        const isActive = i === currentIndex
        const isComplete = i < currentIndex && !isFailed
        const Icon = step.icon

        return (
          <div key={step.key} className="flex items-center gap-1 flex-1 min-w-0">
            <div
              className={`flex items-center justify-center w-8 h-8 rounded-full shrink-0 ${
                isComplete
                  ? "bg-primary text-primary-foreground"
                  : isActive
                    ? "bg-primary/20 text-primary ring-2 ring-primary"
                    : "bg-muted text-muted-foreground"
              }`}
            >
              {isComplete ? <Check className="w-4 h-4" /> : <Icon className="w-4 h-4" />}
            </div>
            <span
              className={`text-xs truncate hidden sm:block ${
                isActive ? "font-semibold text-foreground" : "text-muted-foreground"
              }`}
            >
              {step.label}
            </span>
            {i < STEPS.length - 1 && (
              <div
                className={`h-0.5 flex-1 mx-1 ${
                  isComplete ? "bg-primary" : "bg-muted"
                }`}
              />
            )}
          </div>
        )
      })}
      {isFailed && (
        <div className="flex items-center gap-1 ml-2">
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-destructive text-destructive-foreground shrink-0">
            <X className="w-4 h-4" />
          </div>
          <span className="text-xs font-semibold text-destructive capitalize">
            {status}
          </span>
        </div>
      )}
    </div>
  )
}
