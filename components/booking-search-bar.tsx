"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { CalendarIcon, MapPin, Clock } from "lucide-react"
import { cn } from "@/lib/utils"

interface BookingSearchBarProps {
  defaultBookingType?: "creator" | "studio" | "combined"
  defaultCity?: string
  onSearch?: (params: SearchParams) => void
}

export interface SearchParams {
  bookingType: "creator" | "studio" | "combined"
  city: string
  date: Date | undefined
  startTime: string
  duration: number
}

export function BookingSearchBar({
  defaultBookingType = "creator",
  defaultCity = "",
  onSearch,
}: BookingSearchBarProps) {
  const router = useRouter()
  const [bookingType, setBookingType] = useState<"creator" | "studio" | "combined">(defaultBookingType)
  const [city, setCity] = useState(defaultCity)
  const [date, setDate] = useState<Date | undefined>(undefined)
  const [startTime, setStartTime] = useState("09:00")
  const [duration, setDuration] = useState(2)

  const handleSearch = () => {
    const params: SearchParams = {
      bookingType,
      city,
      date,
      startTime,
      duration,
    }

    if (onSearch) {
      onSearch(params)
    } else {
      // Navigate to browse results with search params
      const searchParams = new URLSearchParams({
        type: bookingType,
        city: city || "",
        date: date ? format(date, "yyyy-MM-dd") : "",
        time: startTime,
        duration: duration.toString(),
      })
      router.push(`/browse-results?${searchParams.toString()}`)
    }
  }

  return (
    <div className="w-full max-w-5xl mx-auto bg-white rounded-2xl shadow-lg p-6 border border-border">
      {/* Booking Type Toggle */}
      <div className="flex gap-2 mb-6">
        <Button
          variant={bookingType === "creator" ? "default" : "outline"}
          onClick={() => setBookingType("creator")}
          className="flex-1"
        >
          Creator Only
        </Button>
        <Button
          variant={bookingType === "studio" ? "default" : "outline"}
          onClick={() => setBookingType("studio")}
          className="flex-1"
        >
          Studio Only
        </Button>
        <Button
          variant={bookingType === "combined" ? "default" : "outline"}
          onClick={() => setBookingType("combined")}
          className="flex-1"
        >
          Creator + Studio
        </Button>
      </div>

      {/* Search Inputs */}
      <div className="grid md:grid-cols-5 gap-4">
        {/* Location */}
        <div className="md:col-span-2">
          <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Location</label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="City" value={city} onChange={(e) => setCity(e.target.value)} className="pl-10" />
          </div>
        </div>

        {/* Date */}
        <div>
          <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Date</label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn("w-full justify-start text-left font-normal", !date && "text-muted-foreground")}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, "MMM dd") : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                initialFocus
                disabled={(date) => date < new Date()}
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* Time */}
        <div>
          <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Start Time</label>
          <Select value={startTime} onValueChange={setStartTime}>
            <SelectTrigger>
              <Clock className="mr-2 h-4 w-4" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Array.from({ length: 14 }, (_, i) => i + 8).map((hour) => (
                <SelectItem key={hour} value={`${hour.toString().padStart(2, "0")}:00`}>
                  {hour}:00
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Duration */}
        <div>
          <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Duration</label>
          <Select value={duration.toString()} onValueChange={(v) => setDuration(Number.parseInt(v))}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="2">2 hours</SelectItem>
              <SelectItem value="4">4 hours</SelectItem>
              <SelectItem value="6">6 hours</SelectItem>
              <SelectItem value="8">8 hours</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Search Button */}
      <Button onClick={handleSearch} size="lg" className="w-full mt-6" disabled={!city || !date}>
        Search Available{" "}
        {bookingType === "creator" ? "Creators" : bookingType === "studio" ? "Studios" : "Combinations"}
      </Button>
    </div>
  )
}
