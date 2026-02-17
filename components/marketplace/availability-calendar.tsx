"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react"

interface Slot {
  start: string
  end: string
  available: boolean
}

interface DaySlots {
  date: string
  slots: Slot[]
}

export function AvailabilityCalendar({
  listingType,
  listingId,
  onSelectSlot,
  selectedDate,
  selectedTime,
}: {
  listingType: string
  listingId: string
  onSelectSlot: (date: string, time: string) => void
  selectedDate?: string
  selectedTime?: string
}) {
  const [days, setDays] = useState<DaySlots[]>([])
  const [loading, setLoading] = useState(true)
  const [weekOffset, setWeekOffset] = useState(0)

  useEffect(() => {
    fetchSlots()
  }, [listingType, listingId, weekOffset])

  async function fetchSlots() {
    setLoading(true)
    try {
      const start = new Date()
      start.setDate(start.getDate() + weekOffset * 7)
      const end = new Date(start)
      end.setDate(end.getDate() + 6)

      const res = await fetch(
        `/api/marketplace/availability/slots?listing_type=${listingType}&listing_id=${listingId}&start_date=${start.toISOString().split("T")[0]}&end_date=${end.toISOString().split("T")[0]}`
      )
      if (res.ok) {
        const data = await res.json()
        setDays(data.slots || [])
      }
    } catch {
      // Handle error
    } finally {
      setLoading(false)
    }
  }

  const formatDay = (dateStr: string) => {
    const d = new Date(dateStr + "T00:00:00")
    return {
      dayName: d.toLocaleDateString("en-GB", { weekday: "short" }),
      dayNum: d.getDate(),
      month: d.toLocaleDateString("en-GB", { month: "short" }),
    }
  }

  const formatTime = (isoStr: string) => {
    return new Date(isoStr).toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setWeekOffset(Math.max(0, weekOffset - 1))}
          disabled={weekOffset === 0}
        >
          <ChevronLeft className="w-4 h-4" />
        </Button>
        <span className="text-sm font-medium">
          {days.length > 0 && (
            <>
              {formatDay(days[0].date).month} {formatDay(days[0].date).dayNum} -{" "}
              {formatDay(days[days.length - 1].date).month}{" "}
              {formatDay(days[days.length - 1].date).dayNum}
            </>
          )}
        </span>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setWeekOffset(weekOffset + 1)}
          disabled={weekOffset >= 3}
        >
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>

      <div className="grid grid-cols-7 gap-1">
        {days.map((day) => {
          const { dayName, dayNum } = formatDay(day.date)
          const hasAvailable = day.slots.some((s) => s.available)
          const isSelected = day.date === selectedDate

          return (
            <div key={day.date} className="flex flex-col items-center gap-1">
              <span className="text-xs text-muted-foreground">{dayName}</span>
              <button
                onClick={() => {
                  if (hasAvailable) {
                    const firstAvailable = day.slots.find((s) => s.available)
                    if (firstAvailable) {
                      onSelectSlot(day.date, formatTime(firstAvailable.start))
                    }
                  }
                }}
                disabled={!hasAvailable}
                className={`w-10 h-10 rounded-full text-sm font-medium transition-colors ${
                  isSelected
                    ? "bg-primary text-primary-foreground"
                    : hasAvailable
                      ? "bg-muted hover:bg-accent cursor-pointer"
                      : "text-muted-foreground/40 cursor-not-allowed"
                }`}
              >
                {dayNum}
              </button>
            </div>
          )
        })}
      </div>

      {selectedDate && (
        <div className="flex flex-col gap-2 mt-2">
          <p className="text-sm font-medium">Available times</p>
          <div className="grid grid-cols-3 gap-2">
            {days
              .find((d) => d.date === selectedDate)
              ?.slots.filter((s) => s.available)
              .map((slot) => {
                const time = formatTime(slot.start)
                const endTime = formatTime(slot.end)
                const isSelected = time === selectedTime

                return (
                  <Button
                    key={slot.start}
                    variant={isSelected ? "default" : "outline"}
                    size="sm"
                    onClick={() => onSelectSlot(selectedDate, time)}
                    className="text-xs"
                  >
                    {time} - {endTime}
                  </Button>
                )
              })}
          </div>
        </div>
      )}
    </div>
  )
}
