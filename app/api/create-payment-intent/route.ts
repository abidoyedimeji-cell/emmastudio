import { createClient } from "@/lib/supabase/server"
import { getStripe } from "@/lib/stripe"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  try {
    const { packageIds, partnerPackageId } = await req.json()

    const supabase = await createClient()
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const allPackageIds = [...(packageIds || []), partnerPackageId].filter(Boolean)
    const { data: packagesData, error: packagesError } = await supabase
      .from("emma_packages")
      .select("id, price, name")
      .in("id", allPackageIds)

    if (packagesError || !packagesData?.length) {
      return NextResponse.json({ error: "Invalid packages" }, { status: 400 })
    }

    const totalPrice = packagesData.reduce((sum, pkg) => sum + pkg.price, 0)
    const amountInCents = Math.round(totalPrice * 100)

    const stripe = getStripe()
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountInCents,
      currency: "usd",
      metadata: {
        user_id: user.id,
        package_ids: allPackageIds.join(","),
      },
      automatic_payment_methods: {
        enabled: true,
      },
    })

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      amount: totalPrice,
    })
  } catch (error) {
    console.error("[v0] Payment Intent creation error:", error)
    return NextResponse.json({ error: "Failed to create payment intent" }, { status: 500 })
  }
}
