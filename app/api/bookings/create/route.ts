import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  try {
    const {
      profileType,
      profileId,
      date,
      time,
      duration,
      bookingType,
      packageIds,
      partnerId,
      partnerPackageId,
      paymentIntentId,
    } = await req.json()

    if (!paymentIntentId) {
      return NextResponse.json({ error: "Payment required" }, { status: 400 })
    }

    const supabase = await createClient()
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const bookingDate = new Date(date)
    const [hours, minutes] = time.split(":").map(Number)
    const startTime = `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:00`
    const endTime = new Date(bookingDate)
    endTime.setHours(hours + duration, minutes, 0)
    const endTimeStr = `${endTime.getHours().toString().padStart(2, "0")}:${endTime.getMinutes().toString().padStart(2, "0")}:00`

    const allPackageIds = [...packageIds, partnerPackageId].filter(Boolean)
    const { data: packagesData, error: packagesError } = await supabase
      .from("emma_packages")
      .select("id, price, creator_id, studio_id")
      .in("id", allPackageIds)

    if (packagesError) {
      console.error("[v0] Packages fetch error:", packagesError)
      return NextResponse.json({ error: "Invalid packages" }, { status: 400 })
    }

    const totalPrice = packagesData.reduce((sum, pkg) => sum + pkg.price, 0)

    const bookingPayload = {
      client_id: user.id,
      booking_date: date,
      start_time: startTime,
      end_time: endTimeStr,
      booking_type: bookingType,
      duration_hours: duration,
      total_price: totalPrice,
      status: "confirmed",
      payment_status: "paid",
      stripe_payment_intent_id: paymentIntentId,
      creator_id: profileType === "creator" ? profileId : partnerId,
      studio_id: profileType === "studio" ? profileId : partnerId,
      package_id: packageIds[0],
    }

    const { data: booking, error: bookingError } = await supabase
      .from("emma_bookings")
      .insert(bookingPayload)
      .select()
      .single()

    if (bookingError) {
      console.error("[v0] Booking creation error:", bookingError)
      return NextResponse.json({ error: "Failed to create booking" }, { status: 500 })
    }

    const bookingPackages = packageIds.map((pkgId: string) => ({
      booking_id: booking.id,
      package_id: pkgId,
      owner_type: profileType,
    }))

    if (partnerPackageId) {
      bookingPackages.push({
        booking_id: booking.id,
        package_id: partnerPackageId,
        owner_type: profileType === "creator" ? "studio" : "creator",
      })
    }

    await supabase.from("booking_packages").insert(bookingPackages)

    const participants = []
    if (profileType === "creator" || partnerId) {
      const creatorId = profileType === "creator" ? profileId : partnerId
      participants.push({
        booking_id: booking.id,
        participant_id: creatorId,
        participant_type: "creator",
        role: "primary",
      })
    }

    if (profileType === "studio" || partnerId) {
      const studioId = profileType === "studio" ? profileId : partnerId
      participants.push({
        booking_id: booking.id,
        participant_id: studioId,
        participant_type: "studio",
        role: profileType === "studio" ? "primary" : "venue",
      })
    }

    if (participants.length > 0) {
      await supabase.from("booking_participants").insert(participants)
    }

    return NextResponse.json({
      success: true,
      bookingId: booking.id,
    })
  } catch (error) {
    console.error("[v0] Create booking error:", error)
    return NextResponse.json({ error: "Failed to create booking: " + (error as Error).message }, { status: 500 })
  }
}
