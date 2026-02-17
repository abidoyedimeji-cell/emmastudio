import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import ApprovalItem from "@/components/admin/approval-item"

export default async function AdminApprovalsPage() {
  const supabase = await createClient()

  // Fetch pending creators and studios
  const [{ data: pendingCreators }, { data: pendingStudios }] = await Promise.all([
    supabase
      .from("emma_creators")
      .select(
        `
        *,
        profiles!emma_creators_user_id_fkey(first_name, email, phone)
      `,
      )
      .eq("status", "pending")
      .order("created_at", { ascending: false }),
    supabase
      .from("emma_studios")
      .select(
        `
        *,
        profiles!emma_studios_owner_id_fkey(first_name, email, phone)
      `,
      )
      .eq("status", "pending")
      .order("created_at", { ascending: false }),
  ])

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="font-serif text-3xl font-bold mb-2">Approvals</h1>
        <p className="text-muted-foreground">Review and approve pending creator and studio profiles</p>
      </div>

      <Tabs defaultValue="creators" className="w-full">
        <TabsList className="grid w-full grid-cols-2 max-w-md">
          <TabsTrigger value="creators">Creators ({pendingCreators?.length || 0})</TabsTrigger>
          <TabsTrigger value="studios">Studios ({pendingStudios?.length || 0})</TabsTrigger>
        </TabsList>

        <TabsContent value="creators" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Pending Creator Approvals</CardTitle>
            </CardHeader>
            <CardContent>
              {pendingCreators && pendingCreators.length > 0 ? (
                <div className="space-y-4">
                  {pendingCreators.map((creator: any) => (
                    <ApprovalItem key={creator.id} entity="emma_creators" item={creator} type="creator" />
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-center py-8">No pending creator approvals</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="studios" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Pending Studio Approvals</CardTitle>
            </CardHeader>
            <CardContent>
              {pendingStudios && pendingStudios.length > 0 ? (
                <div className="space-y-4">
                  {pendingStudios.map((studio: any) => (
                    <ApprovalItem key={studio.id} entity="emma_studios" item={studio} type="studio" />
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-center py-8">No pending studio approvals</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
