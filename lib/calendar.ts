interface CalendarEvent {
  title: string
  description: string
  location: string
  startTime: Date
  endTime: Date
  attendees?: string[]
}

// Generate ICS file content for Apple Calendar / iCal
export function generateICSFile(event: CalendarEvent): string {
  const formatDate = (date: Date): string => {
    return date.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z"
  }

  const escapeText = (text: string): string => {
    return text.replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/,/g, "\\,").replace(/\n/g, "\\n")
  }

  const uid = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}@emmastudios.com`
  const now = formatDate(new Date())

  return `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//EMMA Studios//Booking System//EN
CALSCALE:GREGORIAN
METHOD:PUBLISH
BEGIN:VEVENT
UID:${uid}
DTSTAMP:${now}
DTSTART:${formatDate(event.startTime)}
DTEND:${formatDate(event.endTime)}
SUMMARY:${escapeText(event.title)}
DESCRIPTION:${escapeText(event.description)}
LOCATION:${escapeText(event.location)}
STATUS:CONFIRMED
SEQUENCE:0
BEGIN:VALARM
TRIGGER:-P1D
ACTION:DISPLAY
DESCRIPTION:Reminder: ${escapeText(event.title)} tomorrow
END:VALARM
BEGIN:VALARM
TRIGGER:-PT2H
ACTION:DISPLAY
DESCRIPTION:Reminder: ${escapeText(event.title)} in 2 hours
END:VALARM
END:VEVENT
END:VCALENDAR`
}

// Download ICS file (client-side)
export function downloadICSFile(event: CalendarEvent, filename?: string): void {
  const icsContent = generateICSFile(event)
  const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" })
  const url = URL.createObjectURL(blob)

  const link = document.createElement("a")
  link.href = url
  link.download = filename || `emma-booking-${Date.now()}.ics`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

// Generate Google Calendar URL
export function generateGoogleCalendarURL(event: CalendarEvent): string {
  const formatGoogleDate = (date: Date): string => {
    return date.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z"
  }

  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: event.title,
    details: event.description,
    location: event.location,
    dates: `${formatGoogleDate(event.startTime)}/${formatGoogleDate(event.endTime)}`,
  })

  return `https://calendar.google.com/calendar/render?${params.toString()}`
}

// Generate Outlook Calendar URL
export function generateOutlookCalendarURL(event: CalendarEvent): string {
  const params = new URLSearchParams({
    path: "/calendar/action/compose",
    rru: "addevent",
    subject: event.title,
    body: event.description,
    location: event.location,
    startdt: event.startTime.toISOString(),
    enddt: event.endTime.toISOString(),
  })

  return `https://outlook.live.com/calendar/0/deeplink/compose?${params.toString()}`
}

// Create calendar event from booking data
export function createCalendarEventFromBooking(
  booking: {
    id: string
    date: string
    time: string
    duration: number // in minutes
    notes?: string
  },
  packageData: {
    name: string
    description?: string
  },
  studio: {
    name: string
    location: { address: string; city: string }
  },
  creator?: {
    name: string
  },
): CalendarEvent {
  // Parse the date and time
  const [hours, minutes] =
    booking.time.includes("AM") || booking.time.includes("PM")
      ? parseTime12Hour(booking.time)
      : booking.time.split(":").map(Number)

  const startTime = new Date(booking.date)
  startTime.setHours(hours, minutes, 0, 0)

  const endTime = new Date(startTime)
  endTime.setMinutes(endTime.getMinutes() + booking.duration)

  const title = creator
    ? `EMMA Studios: ${packageData.name} with ${creator.name}`
    : `EMMA Studios: ${packageData.name} at ${studio.name}`

  const description = [
    `Booking ID: ${booking.id}`,
    `Package: ${packageData.name}`,
    creator ? `Creator: ${creator.name}` : null,
    `Studio: ${studio.name}`,
    `Duration: ${booking.duration} minutes`,
    packageData.description ? `\nDetails: ${packageData.description}` : null,
    booking.notes ? `\nNotes: ${booking.notes}` : null,
    `\n---`,
    `Booked via EMMA Studios`,
    `https://emmastudios.com`,
  ]
    .filter(Boolean)
    .join("\n")

  return {
    title,
    description,
    location: `${studio.name}, ${studio.location.address}, ${studio.location.city}`,
    startTime,
    endTime,
  }
}

// Helper to parse 12-hour time format
function parseTime12Hour(time: string): [number, number] {
  const match = time.match(/(\d{1,2}):(\d{2})\s*(AM|PM)/i)
  if (!match) return [9, 0] // Default to 9 AM

  let hours = Number.parseInt(match[1], 10)
  const minutes = Number.parseInt(match[2], 10)
  const period = match[3].toUpperCase()

  if (period === "PM" && hours !== 12) {
    hours += 12
  } else if (period === "AM" && hours === 12) {
    hours = 0
  }

  return [hours, minutes]
}

// Types for Google Calendar API integration
export interface GoogleCalendarConfig {
  clientId: string
  apiKey: string
  scopes: string[]
}

export interface CalendarIntegrationStatus {
  google: {
    connected: boolean
    email?: string
    lastSynced?: string
  }
  apple: {
    supported: boolean // Always true - uses ICS download
  }
  outlook: {
    supported: boolean // Always true - uses URL redirect
  }
}
