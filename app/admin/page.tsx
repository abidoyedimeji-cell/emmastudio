import { Metadata } from "next"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Building2, Users, Calendar, DollarSign, TrendingUp, Clock } from "lucide-react"
import { createClient } from "@/lib/supabase/server"

export const metadata: Metadata = {
  title: "Admin Dashboard",
  robots: { index: false, follow: false },
}

export default async function AdminDashboard() {
  const supabase = await createClient()

  // Fetch real data from database
  const [{ count: totalStudios }, { count: totalCreators }, { data: bookings }, { data: recentBookings }] =
    await Promise.all([
      supabase.from("emma_studios").select("*", { count: "exact", head: true }),
      supabase.from("emma_creators").select("*", { count: "exact", head: true }),
      supabase.from("emma_bookings").select("*"),
      supabase
        .from("emma_bookings")
        .select(`
        *,
        emma_packages!emma_bookings_package_id_fkey(name),
        emma_studios!emma_bookings_studio_id_fkey(name)
      `)
        .order("created_at", { ascending: false })
        .limit(5),
    ])

  const totalBookings = bookings?.length || 0
  const confirmedBookings = bookings?.filter((b) => b.status === "confirmed").length || 0
  const pendingBookings = bookings?.filter((b) => b.status === "pending").length || 0
  const totalRevenue = bookings?.reduce((sum, booking) => sum + (Number(booking.total_price) || 0), 0) || 0

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="font-serif text-3xl font-bold mb-2">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back! Here's what's happening today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Studios</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalStudios || 0}</div>
            <p className="text-xs text-muted-foreground">Active locations</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Creators</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCreators || 0}</div>
            <p className="text-xs text-muted-foreground">Active professionals</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalBookings}</div>
            <p className="text-xs text-muted-foreground">
              {confirmedBookings} confirmed, {pendingBookings} pending
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <TrendingUp className="h-3 w-3" /> Live data
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Bookings */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Recent Bookings</CardTitle>
              <Link href="/admin/bookings" className="text-sm text-primary hover:underline">
                View All
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentBookings && recentBookings.length > 0 ? (
                recentBookings.map((booking) => (
                  <div key={booking.id} className="flex items-center justify-between pb-4 border-b last:border-0">
                    <div className="flex-1">
                      <p className="font-medium">{booking.emma_packages?.name || "Package"}</p>
                      <p className="text-sm text-muted-foreground">{booking.emma_studios?.name || "Studio"}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Clock className="h-3 w-3 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">
                          {booking.booking_date ? new Date(booking.booking_date).toLocaleDateString() : "N/A"}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">${Number(booking.total_price || 0).toLocaleString()}</p>
                      <span
                        className={`inline-block text-xs px-2 py-1 rounded-full ${
                          booking.status === "confirmed"
                            ? "bg-primary/10 text-primary"
                            : booking.status === "pending"
                              ? "bg-accent/10 text-accent"
                              : "bg-secondary text-secondary-foreground"
                        }`}
                      >
                        {booking.status}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4">No bookings yet</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <Link href="/admin/studios">
                <Card className="cursor-pointer hover:bg-secondary/50 transition-colors">
                  <CardContent className="p-6 flex flex-col items-center text-center">
                    <Building2 className="h-8 w-8 text-primary mb-2" />
                    <p className="font-medium text-sm">Manage Studios</p>
                  </CardContent>
                </Card>
              </Link>

              <Link href="/admin/creators">
                <Card className="cursor-pointer hover:bg-secondary/50 transition-colors">
                  <CardContent className="p-6 flex flex-col items-center text-center">
                    <Users className="h-8 w-8 text-primary mb-2" />
                    <p className="font-medium text-sm">Manage Creators</p>
                  </CardContent>
                </Card>
              </Link>

              <Link href="/admin/bookings">
                <Card className="cursor-pointer hover:bg-secondary/50 transition-colors">
                  <CardContent className="p-6 flex flex-col items-center text-center">
                    <Calendar className="h-8 w-8 text-primary mb-2" />
                    <p className="font-medium text-sm">View Bookings</p>
                  </CardContent>
                </Card>
              </Link>

              <Link href="/admin/import">
                <Card className="cursor-pointer hover:bg-secondary/50 transition-colors">
                  <CardContent className="p-6 flex flex-col items-center text-center">
                    <Clock className="h-8 w-8 text-primary mb-2" />
                    <p className="font-medium text-sm">Import CSV</p>
                  </CardContent>
                </Card>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
