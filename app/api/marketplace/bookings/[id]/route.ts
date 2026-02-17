import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const supabase = await createClient()
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Fetch booking with related data
    const { data: booking, error: bookingError } = await supabase
      .from("marketplace_bookings")
      .select(`
        *,
        marketplace_packages (id, name, base_price, listing_type, listing_id),
        booking_parties (
          id, party_role, listing_type, listing_id, decision, decided_at, profile_id,
          profiles (id, first_name, email, avatar_url)
        ),
        booking_addons (
          id, quantity, unit_price,
          addons (id, name, price)
        ),
        mp_conversations (id)
      `)
      .eq("id", id)
      .single()

    if (bookingError) {
      console.error("[v0] Booking fetch error:", bookingError)
      return NextResponse.json({ error: "Booking not found" }, { status: 404 })
    }

    // Check the user is either customer or a party member
    const isCustomer = booking.customer_id === user.id
    const isParty = booking.booking_parties?.some(
      (p: { profile_id: string }) => p.profile_id === user.id
    )

    // Check admin status
    const { data: profile } = await supabase
      .from("profiles")
      .select("is_admin")
      .eq("id", user.id)
      .maybeSingle()

    const isAdmin = profile?.is_admin === true

    if (!isCustomer && !isParty && !isAdmin) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    // Calculate pricing
    const packagePrice = booking.marketplace_packages?.base_price || 0
    const addonsTotal =
      booking.booking_addons?.reduce(
        (sum: number, a: { quantity: number; unit_price: number }) =>
          sum + a.quantity * a.unit_price,
        0
      ) || 0
    const subtotal = packagePrice + addonsTotal
    const serviceFee = Math.round(subtotal * 0.08 * 100) / 100
    const total = subtotal + serviceFee
    const deposit = Math.round(total * 0.5 * 100) / 100
    const balance = total - deposit

    return NextResponse.json({
      ...booking,
      pricing: {
        package_price: packagePrice,
        addons_total: addonsTotal,
        subtotal,
        service_fee: serviceFee,
        total,
        deposit,
        balance,
      },
      viewer: {
        is_customer: isCustomer,
        is_party: isParty,
        is_admin: isAdmin,
        user_id: user.id,
      },
    })
  } catch (error) {
    console.error("[v0] Booking detail error:", error)
    return NextResponse.json(
      { error: "Failed to fetch booking" },
      { status: 500 }
    )
  }
}
