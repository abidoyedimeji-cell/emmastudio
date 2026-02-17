import { createClient } from "@/lib/supabase/server"
import { Card } from "@/components/ui/card"
import { BookingStatusBadge } from "@/components/marketplace/booking-status-badge"
import Link from "next/link"

export default async function AdminMarketplaceBookingsPage() {
  const supabase = await createClient()

  const { data: bookings } = await supabase
    .from("marketplace_bookings")
    .select(`
      id, status, listing_type, requested_date, requested_start,
      duration_hours, subtotal, service_fee_amount, total, deposit_amount,
      customer_id, created_at, request_expires_at,
      marketplace_packages (name, base_price),
      booking_parties (id, party_role, listing_type, decision, profile_id,
        profiles (first_name, email)
      )
    `)
    .order("created_at", { ascending: false })
    .limit(100)

  const total = bookings?.length || 0
  const requested = bookings?.filter((b) => b.status === "requested").length || 0
  const confirmed = bookings?.filter((b) => b.status === "confirmed").length || 0
  const pending = bookings?.filter((b) => b.status === "pending_payment").length || 0
  const cancelled = bookings?.filter((b) => ["cancelled", "declined", "expired"].includes(b.status)).length || 0

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="font-serif text-3xl font-bold mb-2">Marketplace Bookings</h1>
        <p className="text-muted-foreground">Manage request-to-confirm bookings</p>
      </div>

      <div className="grid grid-cols-5 gap-4 mb-6">
        <Card className="p-4">
          <p className="text-sm text-muted-foreground">Total</p>
          <p className="text-2xl font-bold">{total}</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-muted-foreground">Requested</p>
          <p className="text-2xl font-bold text-amber-600">{requested}</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-muted-foreground">Awaiting Pay</p>
          <p className="text-2xl font-bold text-blue-600">{pending}</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-muted-foreground">Confirmed</p>
          <p className="text-2xl font-bold text-green-600">{confirmed}</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-muted-foreground">Cancelled</p>
          <p className="text-2xl font-bold text-destructive">{cancelled}</p>
        </Card>
      </div>

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left p-4 font-semibold">ID</th>
                <th className="text-left p-4 font-semibold">Type</th>
                <th className="text-left p-4 font-semibold">Package</th>
                <th className="text-left p-4 font-semibold">Date</th>
                <th className="text-left p-4 font-semibold">Parties</th>
                <th className="text-left p-4 font-semibold">Status</th>
                <th className="text-left p-4 font-semibold">Total</th>
              </tr>
            </thead>
            <tbody>
              {bookings && bookings.length > 0 ? (
                bookings.map((b: any) => (
                  <tr key={b.id} className="border-b hover:bg-secondary/30">
                    <td className="p-4">
                      <Link
                        href={`/booking/${b.id}`}
                        className="font-mono text-sm text-primary hover:underline"
                      >
                        {b.id.slice(0, 8)}
                      </Link>
                    </td>
                    <td className="p-4 capitalize text-sm">{b.listing_type}</td>
                    <td className="p-4 text-sm">
                      {b.marketplace_packages?.name || "N/A"}
                    </td>
                    <td className="p-4 text-sm">
                      {b.requested_date
                        ? new Date(b.requested_date).toLocaleDateString("en-GB", {
                            day: "numeric",
                            month: "short",
                          })
                        : "N/A"}
                      <span className="text-muted-foreground ml-1">
                        {b.requested_start?.slice(0, 5)}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex flex-col gap-0.5">
                        {b.booking_parties?.map((p: any) => (
                          <span key={p.id} className="text-xs">
                            {p.profiles?.first_name || "Unknown"}{" "}
                            <span
                              className={`${
                                p.decision === "accepted"
                                  ? "text-green-600"
                                  : p.decision === "declined"
                                    ? "text-destructive"
                                    : "text-muted-foreground"
                              }`}
                            >
                              ({p.decision})
                            </span>
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="p-4">
                      <BookingStatusBadge status={b.status} />
                    </td>
                    <td className="p-4 font-semibold text-sm">
                      {b.total ? `£${Number(b.total).toFixed(2)}` : "N/A"}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-muted-foreground">
                    No marketplace bookings yet
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
