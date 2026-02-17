import { createClient } from "@/lib/supabase/server"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default async function AdminPackagesPage() {
  const supabase = await createClient()

  const { data: packages } = await supabase
    .from("marketplace_packages")
    .select("*")
    .order("created_at", { ascending: false })

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-serif text-3xl font-bold mb-2">Marketplace Packages</h1>
          <p className="text-muted-foreground">Manage packages for studios and creators</p>
        </div>
      </div>

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left p-4 font-semibold">Name</th>
                <th className="text-left p-4 font-semibold">Type</th>
                <th className="text-left p-4 font-semibold">Base Price</th>
                <th className="text-left p-4 font-semibold">Duration</th>
                <th className="text-left p-4 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody>
              {packages && packages.length > 0 ? (
                packages.map((pkg: any) => (
                  <tr key={pkg.id} className="border-b hover:bg-secondary/30">
                    <td className="p-4">
                      <div>
                        <p className="font-medium">{pkg.name}</p>
                        {pkg.description && (
                          <p className="text-xs text-muted-foreground truncate max-w-xs">
                            {pkg.description}
                          </p>
                        )}
                      </div>
                    </td>
                    <td className="p-4">
                      <Badge variant="secondary" className="capitalize">
                        {pkg.listing_type}
                      </Badge>
                    </td>
                    <td className="p-4 font-semibold">
                      £{Number(pkg.base_price || 0).toFixed(2)}
                    </td>
                    <td className="p-4 text-sm">
                      {pkg.default_duration_hours ? `${pkg.default_duration_hours}h` : "N/A"}
                    </td>
                    <td className="p-4">
                      <Badge variant={pkg.active ? "default" : "outline"}>
                        {pkg.active ? "Active" : "Inactive"}
                      </Badge>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-muted-foreground">
                    No packages found. Add packages via the database.
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
