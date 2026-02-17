import { NextResponse } from "next/server"
import { generateICSFile, createCalendarEventFromBooking } from "@/lib/calendar"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)

  const bookingId = searchParams.get("bookingId")
  const date = searchParams.get("date")
  const time = searchParams.get("time")
  const duration = searchParams.get("duration")
  const packageName = searchParams.get("packageName")
  const studioName = searchParams.get("studioName")
  const studioAddress = searchParams.get("studioAddress")
  const studioCity = searchParams.get("studioCity")
  const creatorName = searchParams.get("creatorName")

  if (!bookingId || !date || !time || !duration || !packageName || !studioName) {
    return NextResponse.json({ error: "Missing required parameters" }, { status: 400 })
  }

  const calendarEvent = createCalendarEventFromBooking(
    {
      id: bookingId,
      date,
      time,
      duration: Number.parseInt(duration, 10),
    },
    {
      name: packageName,
    },
    {
      name: studioName,
      location: {
        address: studioAddress || "",
        city: studioCity || "",
      },
    },
    creatorName ? { name: creatorName } : undefined,
  )

  const icsContent = generateICSFile(calendarEvent)

  return new NextResponse(icsContent, {
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Content-Disposition": `attachment; filename="emma-booking-${bookingId}.ics"`,
    },
  })
}
