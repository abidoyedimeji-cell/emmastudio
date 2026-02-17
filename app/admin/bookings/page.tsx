import { createClient } from "@/lib/supabase/server"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default async function BookingsPage() {
  const supabase = await createClient()

  const { data: bookings } = await supabase
    .from("emma_bookings")
    .select(`
      *,
      emma_packages!emma_bookings_package_id_fkey(name, price),
      emma_studios!emma_bookings_studio_id_fkey(name, city),
      emma_creators!emma_bookings_creator_id_fkey(display_name),
      profiles!emma_bookings_client_id_fkey(first_name, email)
    `)
    .order("created_at", { ascending: false })
    .limit(50)

  const totalBookings = bookings?.length || 0
  const confirmedBookings = bookings?.filter((b) => b.status === "confirmed").length || 0
  const pendingBookings = bookings?.filter((b) => b.status === "pending").length || 0
  const completedBookings = bookings?.filter((b) => b.status === "completed").length || 0

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-serif text-3xl font-bold mb-2">Bookings</h1>
          <p className="text-muted-foreground">View and manage all bookings</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <Card className="p-4">
          <p className="text-sm text-muted-foreground">Total Bookings</p>
          <p className="text-2xl font-bold">{totalBookings}</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-muted-foreground">Confirmed</p>
          <p className="text-2xl font-bold text-green-600">{confirmedBookings}</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-muted-foreground">Pending</p>
          <p className="text-2xl font-bold text-yellow-600">{pendingBookings}</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-muted-foreground">Completed</p>
          <p className="text-2xl font-bold text-blue-600">{completedBookings}</p>
        </Card>
      </div>

      {/* Bookings Table */}
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left p-4 font-semibold">Booking ID</th>
                <th className="text-left p-4 font-semibold">Client</th>
                <th className="text-left p-4 font-semibold">Package</th>
                <th className="text-left p-4 font-semibold">Studio/Creator</th>
                <th className="text-left p-4 font-semibold">Date & Time</th>
                <th className="text-left p-4 font-semibold">Status</th>
                <th className="text-left p-4 font-semibold">Amount</th>
              </tr>
            </thead>
            <tbody>
              {bookings && bookings.length > 0 ? (
                bookings.map((booking: any) => (
                  <tr key={booking.id} className="border-b hover:bg-secondary/30">
                    <td className="p-4">
                      <span className="font-mono text-sm">{booking.id.slice(0, 8)}</span>
                    </td>
                    <td className="p-4">
                      <div>
                        <p className="font-medium">{booking.profiles?.first_name || "N/A"}</p>
                        <p className="text-sm text-muted-foreground">{booking.profiles?.email}</p>
                      </div>
                    </td>
                    <td className="p-4">
                      <p className="font-medium">{booking.emma_packages?.name || "Custom"}</p>
                    </td>
                    <td className="p-4">
                      <div>
                        <p>{booking.emma_studios?.name || booking.emma_creators?.display_name}</p>
                        <p className="text-sm text-muted-foreground">{booking.emma_studios?.city}</p>
                      </div>
                    </td>
                    <td className="p-4">
                      <div>
                        <p className="font-medium">
                          {booking.booking_date
                            ? new Date(booking.booking_date).toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              })
                            : "N/A"}
                        </p>
                        <p className="text-sm text-muted-foreground">{booking.start_time || "Time TBD"}</p>
                      </div>
                    </td>
                    <td className="p-4">
                      <Badge
                        variant={
                          booking.status === "confirmed"
                            ? "default"
                            : booking.status === "pending"
                              ? "secondary"
                              : "outline"
                        }
                      >
                        {booking.status}
                      </Badge>
                    </td>
                    <td className="p-4">
                      <p className="font-semibold">${Number(booking.total_price || 0).toLocaleString()}</p>
                      {booking.deposit_paid && <p className="text-xs text-muted-foreground">Deposit paid</p>}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-muted-foreground">
                    No bookings found
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
