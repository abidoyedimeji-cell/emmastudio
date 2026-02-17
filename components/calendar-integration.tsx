"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Calendar, ChevronDown, Check, Download, ExternalLink } from "lucide-react"
import {
  generateGoogleCalendarURL,
  generateOutlookCalendarURL,
  downloadICSFile,
  createCalendarEventFromBooking,
} from "@/lib/calendar"

interface CalendarIntegrationProps {
  booking: {
    id: string
    date: string
    time: string
    duration: number
    notes?: string
  }
  packageData: {
    name: string
    description?: string
  }
  studio: {
    name: string
    location: { address: string; city: string }
  }
  creator?: {
    name: string
  }
  variant?: "default" | "compact"
}

export function CalendarIntegration({
  booking,
  packageData,
  studio,
  creator,
  variant = "default",
}: CalendarIntegrationProps) {
  const [showSuccess, setShowSuccess] = useState(false)
  const [selectedCalendar, setSelectedCalendar] = useState<string | null>(null)

  const calendarEvent = createCalendarEventFromBooking(booking, packageData, studio, creator)

  const handleGoogleCalendar = () => {
    const url = generateGoogleCalendarURL(calendarEvent)
    window.open(url, "_blank", "noopener,noreferrer")
    setSelectedCalendar("Google Calendar")
    setShowSuccess(true)
  }

  const handleOutlookCalendar = () => {
    const url = generateOutlookCalendarURL(calendarEvent)
    window.open(url, "_blank", "noopener,noreferrer")
    setSelectedCalendar("Outlook Calendar")
    setShowSuccess(true)
  }

  const handleAppleCalendar = () => {
    downloadICSFile(calendarEvent, `emma-booking-${booking.id}.ics`)
    setSelectedCalendar("Apple Calendar")
    setShowSuccess(true)
  }

  const handleDownloadICS = () => {
    downloadICSFile(calendarEvent, `emma-booking-${booking.id}.ics`)
    setSelectedCalendar("ICS file")
    setShowSuccess(true)
  }

  if (variant === "compact") {
    return (
      <>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="bg-transparent">
              <Calendar className="h-4 w-4 mr-2" />
              Add to Calendar
              <ChevronDown className="h-3 w-3 ml-1" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuItem onClick={handleGoogleCalendar}>
              <svg className="h-4 w-4 mr-2" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M19.5 22h-15A2.5 2.5 0 0 1 2 19.5v-15A2.5 2.5 0 0 1 4.5 2h15A2.5 2.5 0 0 1 22 4.5v15a2.5 2.5 0 0 1-2.5 2.5zM9 18h6v-2H9v2zm0-4h6v-2H9v2zm0-4h6V8H9v2z"
                />
              </svg>
              Google Calendar
              <ExternalLink className="h-3 w-3 ml-auto opacity-50" />
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleAppleCalendar}>
              <svg className="h-4 w-4 mr-2" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83z"
                />
              </svg>
              Apple Calendar
              <Download className="h-3 w-3 ml-auto opacity-50" />
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleOutlookCalendar}>
              <svg className="h-4 w-4 mr-2" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M7.88 12.04q0 .45-.11.87-.1.41-.33.74-.22.33-.58.52-.37.2-.87.2t-.85-.2q-.35-.21-.57-.55-.22-.33-.33-.75-.1-.42-.1-.86t.1-.87q.1-.43.34-.76.22-.34.59-.54.36-.2.87-.2t.86.2q.35.21.57.55.22.34.31.77.1.43.1.88zM24 12v9.38q0 .46-.33.8-.33.32-.8.32H7.13q-.46 0-.8-.33-.32-.33-.32-.8V18H1q-.41 0-.7-.3-.3-.29-.3-.7V7q0-.41.3-.7Q.58 6 1 6h6.13V2.55q0-.44.32-.78.34-.34.81-.34h7.05l5.69 5.7V12zm-4.5 0h-5.88q-.44 0-.78.31-.33.33-.33.78v9.06H19.5V12zM15 4.14V8h3.87L15 4.14z"
                />
              </svg>
              Outlook Calendar
              <ExternalLink className="h-3 w-3 ml-auto opacity-50" />
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleDownloadICS}>
              <Download className="h-4 w-4 mr-2" />
              Download .ics file
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Dialog open={showSuccess} onOpenChange={setShowSuccess}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <div className="mx-auto h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Check className="h-6 w-6 text-primary" />
              </div>
              <DialogTitle className="text-center">Added to {selectedCalendar}</DialogTitle>
              <DialogDescription className="text-center">
                Your booking has been added to your calendar. You&apos;ll receive reminders before your session.
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      </>
    )
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button className="flex-1 bg-accent hover:bg-accent/90">
            <Calendar className="h-4 w-4 mr-2" />
            Add to Calendar
            <ChevronDown className="h-4 w-4 ml-2" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="center" className="w-64">
          <DropdownMenuItem onClick={handleGoogleCalendar} className="py-3">
            <div className="flex items-center gap-3 w-full">
              <div className="h-8 w-8 rounded-lg bg-red-100 flex items-center justify-center">
                <svg className="h-5 w-5 text-red-600" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M19.5 22h-15A2.5 2.5 0 0 1 2 19.5v-15A2.5 2.5 0 0 1 4.5 2h15A2.5 2.5 0 0 1 22 4.5v15a2.5 2.5 0 0 1-2.5 2.5z"
                  />
                  <path fill="white" d="M9 18h6v-2H9v2zm0-4h6v-2H9v2zm0-4h6V8H9v2z" />
                </svg>
              </div>
              <div className="flex-1">
                <p className="font-medium">Google Calendar</p>
                <p className="text-xs text-muted-foreground">Opens in new tab</p>
              </div>
              <ExternalLink className="h-4 w-4 opacity-50" />
            </div>
          </DropdownMenuItem>

          <DropdownMenuItem onClick={handleAppleCalendar} className="py-3">
            <div className="flex items-center gap-3 w-full">
              <div className="h-8 w-8 rounded-lg bg-gray-100 flex items-center justify-center">
                <svg className="h-5 w-5 text-gray-800" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83z"
                  />
                </svg>
              </div>
              <div className="flex-1">
                <p className="font-medium">Apple Calendar</p>
                <p className="text-xs text-muted-foreground">Downloads .ics file</p>
              </div>
              <Download className="h-4 w-4 opacity-50" />
            </div>
          </DropdownMenuItem>

          <DropdownMenuItem onClick={handleOutlookCalendar} className="py-3">
            <div className="flex items-center gap-3 w-full">
              <div className="h-8 w-8 rounded-lg bg-blue-100 flex items-center justify-center">
                <svg className="h-5 w-5 text-blue-600" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M7.88 12.04q0 .45-.11.87-.1.41-.33.74-.22.33-.58.52-.37.2-.87.2t-.85-.2q-.35-.21-.57-.55-.22-.33-.33-.75-.1-.42-.1-.86t.1-.87q.1-.43.34-.76.22-.34.59-.54.36-.2.87-.2t.86.2q.35.21.57.55.22.34.31.77.1.43.1.88zM24 12v9.38q0 .46-.33.8-.33.32-.8.32H7.13q-.46 0-.8-.33-.32-.33-.32-.8V18H1q-.41 0-.7-.3-.3-.29-.3-.7V7q0-.41.3-.7Q.58 6 1 6h6.13V2.55q0-.44.32-.78.34-.34.81-.34h7.05l5.69 5.7V12z"
                  />
                </svg>
              </div>
              <div className="flex-1">
                <p className="font-medium">Outlook Calendar</p>
                <p className="text-xs text-muted-foreground">Opens in new tab</p>
              </div>
              <ExternalLink className="h-4 w-4 opacity-50" />
            </div>
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem onClick={handleDownloadICS} className="py-3">
            <div className="flex items-center gap-3 w-full">
              <div className="h-8 w-8 rounded-lg bg-secondary flex items-center justify-center">
                <Download className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <p className="font-medium">Download .ics file</p>
                <p className="text-xs text-muted-foreground">Works with any calendar</p>
              </div>
            </div>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={showSuccess} onOpenChange={setShowSuccess}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="mx-auto h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <Check className="h-8 w-8 text-primary" />
            </div>
            <DialogTitle className="text-center text-xl">Added to {selectedCalendar}</DialogTitle>
            <DialogDescription className="text-center">
              Your booking has been added to your calendar. You&apos;ll receive automatic reminders:
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2 py-4">
            <div className="flex items-center gap-3 text-sm">
              <div className="h-2 w-2 rounded-full bg-primary" />
              <span>24 hours before your session</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <div className="h-2 w-2 rounded-full bg-primary" />
              <span>2 hours before your session</span>
            </div>
          </div>
          <Button onClick={() => setShowSuccess(false)} className="w-full">
            Done
          </Button>
        </DialogContent>
      </Dialog>
    </>
  )
}
