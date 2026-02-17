"use client"

import { useEffect, useState } from "react"
import { Clock } from "lucide-react"

function formatTimeLeft(ms: number) {
  if (ms <= 0) return "Expired"
  const hours = Math.floor(ms / 3600000)
  const minutes = Math.floor((ms % 3600000) / 60000)
  const seconds = Math.floor((ms % 60000) / 1000)
  if (hours > 0) return `${hours}h ${minutes}m`
  if (minutes > 0) return `${minutes}m ${seconds}s`
  return `${seconds}s`
}

export function ExpiryCountdown({
  expiresAt,
  label,
}: {
  expiresAt: string
  label?: string
}) {
  const [timeLeft, setTimeLeft] = useState<number>(
    new Date(expiresAt).getTime() - Date.now()
  )

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(new Date(expiresAt).getTime() - Date.now())
    }, 1000)
    return () => clearInterval(interval)
  }, [expiresAt])

  const isUrgent = timeLeft > 0 && timeLeft < 3600000
  const isExpired = timeLeft <= 0

  return (
    <div
      className={`flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-md ${
        isExpired
          ? "bg-muted text-muted-foreground"
          : isUrgent
            ? "bg-destructive/10 text-destructive"
            : "bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-400"
      }`}
    >
      <Clock className="w-3.5 h-3.5" />
      <span className="font-medium">
        {label && `${label}: `}
        {formatTimeLeft(timeLeft)}
      </span>
    </div>
  )
}
