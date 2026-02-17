import { createClient } from "@/lib/supabase/server"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default async function AdminAddonsPage() {
  const supabase = await createClient()

  const { data: addons } = await supabase
    .from("addons")
    .select("*")
    .order("name")

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-serif text-3xl font-bold mb-2">Add-ons</h1>
          <p className="text-muted-foreground">Manage add-ons available for bookings</p>
        </div>
      </div>

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left p-4 font-semibold">Name</th>
                <th className="text-left p-4 font-semibold">Type</th>
                <th className="text-left p-4 font-semibold">Price</th>
                <th className="text-left p-4 font-semibold">Unit</th>
                <th className="text-left p-4 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody>
              {addons && addons.length > 0 ? (
                addons.map((addon: any) => (
                  <tr key={addon.id} className="border-b hover:bg-secondary/30">
                    <td className="p-4">
                      <div>
                        <p className="font-medium">{addon.name}</p>
                        {addon.description && (
                          <p className="text-xs text-muted-foreground truncate max-w-xs">
                            {addon.description}
                          </p>
                        )}
                      </div>
                    </td>
                    <td className="p-4">
                      <Badge variant="secondary" className="capitalize">
                        {addon.listing_type}
                      </Badge>
                    </td>
                    <td className="p-4 font-semibold">
                      £{Number(addon.price || 0).toFixed(2)}
                    </td>
                    <td className="p-4 text-sm">{addon.unit || "N/A"}</td>
                    <td className="p-4">
                      <Badge variant={addon.active ? "default" : "outline"}>
                        {addon.active ? "Active" : "Inactive"}
                      </Badge>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-muted-foreground">
                    No add-ons found. Add them via the database.
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
