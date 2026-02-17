import { createClient } from "@/lib/supabase/server"
import { stripe } from "@/lib/stripe"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(
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

    // Call RPC to create payment record and validate state
    const { data: paymentId, error: rpcError } = await supabase.rpc(
      "create_payment_intent",
      { p_booking_id: id }
    )

    if (rpcError) {
      console.error("[v0] create_payment_intent RPC error:", rpcError)
      return NextResponse.json(
        { error: rpcError.message || "Booking not ready for payment" },
        { status: 400 }
      )
    }

    // Fetch booking for pricing
    const { data: booking, error: bookingError } = await supabase
      .from("marketplace_bookings")
      .select(`
        id, customer_id, subtotal, service_fee_amount, total, deposit_amount,
        marketplace_packages (name)
      `)
      .eq("id", id)
      .single()

    if (bookingError || !booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 })
    }

    if (booking.customer_id !== user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const depositCents = Math.round((booking.deposit_amount || booking.total * 0.5) * 100)

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "gbp",
            product_data: {
              name: `Booking Deposit - ${booking.marketplace_packages?.name || "Session"}`,
              description: `50% deposit for booking ${id.slice(0, 8)}`,
            },
            unit_amount: depositCents,
          },
          quantity: 1,
        },
      ],
      metadata: {
        booking_id: id,
        payment_id: paymentId,
        user_id: user.id,
        type: "marketplace_deposit",
      },
      success_url: `${process.env.NEXT_PUBLIC_APP_URL || ""}/booking/${id}?payment=success`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL || ""}/booking/${id}?payment=cancelled`,
    })

    // Update the marketplace_payments record with stripe session ID
    await supabase
      .from("marketplace_payments")
      .update({ stripe_pi_id: session.id })
      .eq("id", paymentId)

    return NextResponse.json({
      success: true,
      checkoutUrl: session.url,
      sessionId: session.id,
    })
  } catch (error) {
    console.error("[v0] Payment creation error:", error)
    return NextResponse.json(
      { error: "Failed to create payment session" },
      { status: 500 }
    )
  }
}
