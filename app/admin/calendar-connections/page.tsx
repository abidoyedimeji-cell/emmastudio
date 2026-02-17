import { createClient } from "@/lib/supabase/server"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CalendarConnectionForm } from "./calendar-connection-form"

export default async function AdminCalendarConnectionsPage() {
  const supabase = await createClient()

  const { data: connections } = await supabase
    .from("calendar_connections")
    .select("*")
    .order("created_at", { ascending: false })

  const { data: busyBlockCount } = await supabase
    .from("calendar_busy_blocks")
    .select("id", { count: "exact", head: true })

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-serif text-3xl font-bold mb-2">Calendar Connections</h1>
          <p className="text-muted-foreground">
            Manage iCal calendar sync for listings. {busyBlockCount} busy blocks tracked.
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="flex flex-col gap-6">
          <CalendarConnectionForm />
        </div>
        <div className="flex flex-col gap-4">
          <h2 className="text-lg font-semibold">Active Connections</h2>
          {connections && connections.length > 0 ? (
            connections.map((conn: any) => (
              <Card key={conn.id} className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="capitalize">
                      {conn.listing_type}
                    </Badge>
                    <Badge variant="outline">{conn.provider}</Badge>
                  </div>
                  <Badge variant={conn.active ? "default" : "secondary"}>
                    {conn.active ? "Active" : "Inactive"}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground truncate mb-1">
                  {conn.ical_url || "No URL"}
                </p>
                <p className="text-xs text-muted-foreground">
                  Listing ID: {conn.listing_id?.slice(0, 8)}...
                  {conn.last_synced_at && (
                    <> | Last synced: {new Date(conn.last_synced_at).toLocaleString("en-GB")}</>
                  )}
                </p>
              </Card>
            ))
          ) : (
            <p className="text-sm text-muted-foreground">No calendar connections yet.</p>
          )}
        </div>
      </div>
    </div>
  )
}
