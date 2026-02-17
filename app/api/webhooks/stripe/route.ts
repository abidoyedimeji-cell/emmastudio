import { getStripe } from "@/lib/stripe"
import { createClient } from "@/lib/supabase/server"
import { headers } from "next/headers"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  const body = await req.text()
  const headersList = await headers()
  const signature = headersList.get("stripe-signature")

  if (!signature) {
    return NextResponse.json({ error: "No signature" }, { status: 400 })
  }

  let event

  const stripe = getStripe()
  try {
    event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch (err) {
    console.error("[v0] Webhook signature verification failed:", err)
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 })
  }

  const supabase = await createClient()

  switch (event.type) {
    case "payment_intent.succeeded": {
      const paymentIntent = event.data.object

      const { data: booking, error } = await supabase
        .from("emma_bookings")
        .update({
          payment_status: "paid",
          status: "confirmed",
        })
        .eq("stripe_payment_intent_id", paymentIntent.id)
        .select("*, profiles!emma_bookings_client_id_fkey(first_name, email)")
        .single()

      if (error) {
        console.error("[v0] Failed to update booking:", error)
      } else if (booking) {
        // Create notification for client
        await supabase.from("notifications").insert({
          user_id: booking.client_id,
          type: "booking_confirmed",
          title: "Booking Confirmed!",
          message: "Your payment was successful and your booking is confirmed.",
          action_url: `/dashboard`,
          created_at: new Date().toISOString(),
        })

        // Create notification for provider (creator or studio owner)
        if (booking.creator_id) {
          await supabase.from("notifications").insert({
            user_id: booking.creator_id,
            type: "booking_confirmed",
            title: "New Booking!",
            message: "You have a new confirmed booking.",
            action_url: `/dashboard`,
            created_at: new Date().toISOString(),
          })
        } else if (booking.studio_id) {
          const { data: studio } = await supabase
            .from("emma_studios")
            .select("owner_id")
            .eq("id", booking.studio_id)
            .single()
          if (studio) {
            await supabase.from("notifications").insert({
              user_id: studio.owner_id,
              type: "booking_confirmed",
              title: "New Booking!",
              message: "You have a new confirmed booking at your studio.",
              action_url: `/dashboard`,
              created_at: new Date().toISOString(),
            })
          }
        }
      }
      break
    }

    case "payment_intent.payment_failed": {
      const paymentIntent = event.data.object

      const { data: booking } = await supabase
        .from("emma_bookings")
        .update({
          payment_status: "failed",
          status: "cancelled",
        })
        .eq("stripe_payment_intent_id", paymentIntent.id)
        .select("client_id")
        .single()

      if (booking) {
        await supabase.from("notifications").insert({
          user_id: booking.client_id,
          type: "payment_failed",
          title: "Payment Failed",
          message: "Your payment could not be processed. Please try again.",
          action_url: `/dashboard`,
          created_at: new Date().toISOString(),
        })
      }
      break
    }

    case "checkout.session.completed": {
      const session = event.data.object
      const metadata = session.metadata || {}

      // Handle marketplace deposit payments
      if (metadata.type === "marketplace_deposit" && metadata.booking_id) {
        const bookingId = metadata.booking_id
        const paymentId = metadata.payment_id

        // Idempotency: check if already processed
        if (paymentId) {
          const { data: existingPayment } = await supabase
            .from("marketplace_payments")
            .select("status")
            .eq("id", paymentId)
            .single()

          if (existingPayment?.status === "completed") {
            console.log("[v0] Payment already processed, skipping:", paymentId)
            break
          }
        }

        // Call the RPC to mark booking as paid
        const { error: rpcError } = await supabase.rpc("mark_booking_paid", {
          p_booking_id: bookingId,
          p_payment_id: paymentId,
          p_stripe_pi_id: session.payment_intent || session.id,
        })

        if (rpcError) {
          console.error("[v0] mark_booking_paid RPC error:", rpcError)
        } else {
          console.log("[v0] Marketplace booking confirmed via payment:", bookingId)

          // Create notification for customer
          if (metadata.user_id) {
            await supabase.from("notifications").insert({
              user_id: metadata.user_id,
              type: "booking_confirmed",
              title: "Booking Confirmed!",
              message: "Your deposit payment was successful and your booking is confirmed.",
              action_url: `/booking/${bookingId}`,
              created_at: new Date().toISOString(),
            })
          }
        }
      }
      break
    }

    default:
      console.log(`[v0] Unhandled event type: ${event.type}`)
  }

  return NextResponse.json({ received: true })
}
