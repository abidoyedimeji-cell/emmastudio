"use client"

import { useState } from "react"
import useSWR from "swr"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Calendar, Clock, Plus, Trash2, Download, Loader2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"

const fetcher = (url: string) => fetch(url).then((r) => r.json())

const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]

interface TimeSlot {
  day: number
  startTime: string
  endTime: string
  isActive: boolean
}

interface Creator {
  id: string
  name: string
  specialty: string
  bio: string
  is_active: boolean
  years_experience: number
}

export default function AvailabilityPage() {
  const { data: creators = [], isLoading } = useSWR<Creator[]>("/api/creators", fetcher)
  const [selectedCreatorId, setSelectedCreatorId] = useState<string>("")
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([
    { day: 1, startTime: "09:00", endTime: "17:00", isActive: true },
    { day: 2, startTime: "09:00", endTime: "17:00", isActive: true },
    { day: 3, startTime: "09:00", endTime: "17:00", isActive: true },
    { day: 4, startTime: "09:00", endTime: "17:00", isActive: true },
    { day: 5, startTime: "09:00", endTime: "17:00", isActive: true },
  ])
  const [blockedDates, setBlockedDates] = useState<{ date: string; reason: string }[]>([])
  const [newBlockedDate, setNewBlockedDate] = useState("")
  const [newBlockedReason, setNewBlockedReason] = useState("")

  const selectedCreator = creators.find((c) => c.id === selectedCreatorId)

  const addTimeSlot = () => { setTimeSlots([...timeSlots, { day: 1, startTime: "09:00", endTime: "17:00", isActive: true }]) }
  const updateTimeSlot = (index: number, field: keyof TimeSlot, value: string | number | boolean) => { const updated = [...timeSlots]; updated[index] = { ...updated[index], [field]: value }; setTimeSlots(updated) }
  const removeTimeSlot = (index: number) => { setTimeSlots(timeSlots.filter((_, i) => i !== index)) }
  const addBlockedDate = () => { if (newBlockedDate) { setBlockedDates([...blockedDates, { date: newBlockedDate, reason: newBlockedReason }]); setNewBlockedDate(""); setNewBlockedReason("") } }
  const removeBlockedDate = (index: number) => { setBlockedDates(blockedDates.filter((_, i) => i !== index)) }

  if (isLoading) return <div className="p-8 flex items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="font-serif text-3xl font-bold mb-2">Availability Management</h1>
        <p className="text-muted-foreground">Manage working hours and calendar sync for creators</p>
      </div>

      <Card className="mb-6">
        <CardHeader><CardTitle className="text-lg">Select Creator</CardTitle></CardHeader>
        <CardContent>
          <Select value={selectedCreatorId} onValueChange={setSelectedCreatorId}>
            <SelectTrigger className="max-w-md"><SelectValue placeholder="Choose a creator" /></SelectTrigger>
            <SelectContent>
              {creators.map((creator) => (
                <SelectItem key={creator.id} value={creator.id}>{creator.name} - {creator.specialty}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          {selectedCreator && (
            <div className="mt-4 p-4 bg-secondary rounded-lg">
              <p className="font-semibold mb-1">{selectedCreator.name}</p>
              <p className="text-sm text-muted-foreground mb-2">{selectedCreator.bio}</p>
              <div className="flex gap-2">
                <Badge variant={selectedCreator.is_active !== false ? "default" : "secondary"}>{selectedCreator.is_active !== false ? "Active" : "Inactive"}</Badge>
                <Badge variant="outline">{selectedCreator.years_experience || 0} years</Badge>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Clock className="h-5 w-5" />Working Hours</CardTitle>
            <CardDescription>Set regular availability for each day of the week</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {timeSlots.map((slot, index) => (
                <div key={index} className="flex items-center gap-3 p-3 border rounded-lg">
                  <div className="flex-1 grid grid-cols-2 sm:grid-cols-4 gap-2 items-center">
                    <Select value={slot.day.toString()} onValueChange={(value) => updateTimeSlot(index, "day", Number.parseInt(value))}>
                      <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                      <SelectContent>{daysOfWeek.map((day, i) => (<SelectItem key={i} value={i.toString()}>{day}</SelectItem>))}</SelectContent>
                    </Select>
                    <Input type="time" value={slot.startTime} onChange={(e) => updateTimeSlot(index, "startTime", e.target.value)} />
                    <Input type="time" value={slot.endTime} onChange={(e) => updateTimeSlot(index, "endTime", e.target.value)} />
                    <div className="flex items-center gap-2">
                      <Switch checked={slot.isActive} onCheckedChange={(checked) => updateTimeSlot(index, "isActive", checked)} />
                      <Label className="text-xs">Active</Label>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => removeTimeSlot(index)} className="bg-transparent"><Trash2 className="h-4 w-4 text-destructive" /></Button>
                </div>
              ))}
              <Button variant="outline" onClick={addTimeSlot} className="w-full bg-transparent"><Plus className="h-4 w-4 mr-2" />Add Time Slot</Button>
            </div>
            <div className="mt-6 pt-6 border-t"><Button className="w-full bg-accent hover:bg-accent/90">Save Working Hours</Button></div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Calendar className="h-5 w-5" />Calendar Sync</CardTitle>
              <CardDescription>Connect external calendars to sync availability</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center"><Calendar className="h-5 w-5 text-primary" /></div>
                  <div><p className="font-medium">Google Calendar</p><p className="text-sm text-muted-foreground">Sync with your Google account</p></div>
                </div>
                <Button variant="outline" size="sm" className="bg-transparent">Connect</Button>
              </div>
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center"><Calendar className="h-5 w-5 text-primary" /></div>
                  <div><p className="font-medium">Outlook Calendar</p><p className="text-sm text-muted-foreground">Sync with your Outlook account</p></div>
                </div>
                <Button variant="outline" size="sm" className="bg-transparent">Connect</Button>
              </div>
              <div className="bg-secondary/50 p-4 rounded-lg"><p className="text-sm text-muted-foreground">When connected, your external calendar events will automatically block time slots on EMMA STUDIOS.</p></div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Blocked Dates</CardTitle><CardDescription>Block specific dates when you{"'"}re unavailable</CardDescription></CardHeader>
            <CardContent>
              <div className="space-y-4 mb-4">
                {blockedDates.map((blocked, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">{new Date(blocked.date).toLocaleDateString("en-GB", { weekday: "short", year: "numeric", month: "short", day: "numeric" })}</p>
                      {blocked.reason && <p className="text-sm text-muted-foreground">{blocked.reason}</p>}
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => removeBlockedDate(index)} className="bg-transparent"><Trash2 className="h-4 w-4 text-destructive" /></Button>
                  </div>
                ))}
              </div>
              <div className="space-y-3 p-4 bg-secondary/30 rounded-lg">
                <div><Label htmlFor="blockedDate" className="text-sm mb-2 block">Date</Label><Input id="blockedDate" type="date" value={newBlockedDate} onChange={(e) => setNewBlockedDate(e.target.value)} /></div>
                <div><Label htmlFor="blockedReason" className="text-sm mb-2 block">Reason (optional)</Label><Input id="blockedReason" placeholder="e.g., Personal day, vacation" value={newBlockedReason} onChange={(e) => setNewBlockedReason(e.target.value)} /></div>
                <Button onClick={addBlockedDate} disabled={!newBlockedDate} className="w-full bg-accent hover:bg-accent/90"><Plus className="h-4 w-4 mr-2" />Block Date</Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Export Availability</CardTitle><CardDescription>Download your availability schedule</CardDescription></CardHeader>
            <CardContent><Button variant="outline" className="w-full bg-transparent"><Download className="h-4 w-4 mr-2" />Download as iCal</Button></CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
