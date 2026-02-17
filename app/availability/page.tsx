"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar } from "@/components/ui/calendar"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Trash2, Clock } from "lucide-react"

type AvailabilitySlot = {
  id: string
  start_time: string
  end_time: string
  recurring: boolean
  recurring_rule: string | null
}

export default function AvailabilityPage() {
  const [slots, setSlots] = useState<AvailabilitySlot[]>([])
  const [userId, setUserId] = useState<string | null>(null)
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
  const [startTime, setStartTime] = useState("09:00")
  const [endTime, setEndTime] = useState("17:00")
  const [recurring, setRecurring] = useState(false)
  const [daysOfWeek, setDaysOfWeek] = useState<number[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    async function init() {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (user) {
        setUserId(user.id)
        await fetchAvailability(user.id)
      }
    }
    init()
  }, [])

  async function fetchAvailability(uid: string) {
    try {
      const res = await fetch(`/api/availability?user_id=${uid}`)
      if (res.ok) {
        const data: AvailabilitySlot[] = await res.json()
        setSlots(data)
      }
    } catch (error) {
      console.error("Error fetching availability:", error)
    }
  }

  async function handleAddSlot() {
    if (!selectedDate || !userId) {
      alert("Please select a date")
      return
    }

    setLoading(true)
    try {
      const dateStr = selectedDate.toISOString().split("T")[0]
      const start = `${dateStr}T${startTime}:00.000Z`
      const end = `${dateStr}T${endTime}:00.000Z`

      let recurring_rule = null
      if (recurring && daysOfWeek.length > 0) {
        const dayCodes = ["SU", "MO", "TU", "WE", "TH", "FR", "SA"]
        const selectedDays = daysOfWeek.map((d) => dayCodes[d]).join(",")
        recurring_rule = `FREQ=WEEKLY;BYDAY=${selectedDays}`
      }

      const payload = {
        user_id: userId,
        start_time: start,
        end_time: end,
        recurring,
        recurring_rule,
      }

      const res = await fetch("/api/availability", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      if (res.ok) {
        await fetchAvailability(userId)
        setStartTime("09:00")
        setEndTime("17:00")
        setRecurring(false)
        setDaysOfWeek([])
      } else {
        const error = await res.json()
        alert(error.error || "Failed to create availability")
      }
    } catch (error) {
      console.error("Error adding slot:", error)
      alert("Failed to add availability slot")
    } finally {
      setLoading(false)
    }
  }

  async function handleDeleteSlot(slotId: string) {
    if (!confirm("Delete this availability slot?")) return

    try {
      const res = await fetch(`/api/availability?id=${slotId}`, {
        method: "DELETE",
      })

      if (res.ok && userId) {
        await fetchAvailability(userId)
      }
    } catch (error) {
      console.error("Error deleting slot:", error)
    }
  }

  function toggleDay(dayIndex: number) {
    setDaysOfWeek((prev) => (prev.includes(dayIndex) ? prev.filter((d) => d !== dayIndex) : [...prev, dayIndex]))
  }

  function formatDateTime(dateTime: string) {
    return new Date(dateTime).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    })
  }

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Manage Your Availability</h1>
        <p className="text-muted-foreground">Set your available time slots for bookings</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Add Availability Form */}
        <Card>
          <CardHeader>
            <CardTitle>Add Availability</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Select Date</Label>
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                className="rounded-md border"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Start Time</Label>
                <Input type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} />
              </div>
              <div>
                <Label>End Time</Label>
                <Input type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} />
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="recurring"
                checked={recurring}
                onCheckedChange={(checked) => setRecurring(checked === true)}
              />
              <Label htmlFor="recurring" className="cursor-pointer">
                Repeat weekly
              </Label>
            </div>

            {recurring && (
              <div>
                <Label className="mb-2 block">Select Days</Label>
                <div className="flex flex-wrap gap-2">
                  {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day, idx) => (
                    <Button
                      key={day}
                      type="button"
                      size="sm"
                      variant={daysOfWeek.includes(idx) ? "default" : "outline"}
                      onClick={() => toggleDay(idx)}
                    >
                      {day}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            <Button onClick={handleAddSlot} disabled={loading} className="w-full">
              {loading ? "Adding..." : "Add Availability"}
            </Button>
          </CardContent>
        </Card>

        {/* Existing Slots */}
        <Card>
          <CardHeader>
            <CardTitle>Your Availability Slots</CardTitle>
          </CardHeader>
          <CardContent>
            {slots.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No availability slots set</p>
                <p className="text-sm">Add slots to let clients book you</p>
              </div>
            ) : (
              <div className="space-y-3">
                {slots.map((slot) => (
                  <div key={slot.id} className="flex items-start justify-between p-3 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">{formatDateTime(slot.start_time)}</span>
                      </div>
                      <div className="text-sm text-muted-foreground">to {formatDateTime(slot.end_time)}</div>
                      {slot.recurring && (
                        <Badge variant="secondary" className="mt-2">
                          Recurring
                        </Badge>
                      )}
                    </div>
                    <Button size="sm" variant="ghost" onClick={() => handleDeleteSlot(slot.id)}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
