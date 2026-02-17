import type React from "react"
import { AdminSidebar } from "@/components/admin-sidebar"
import { createClient } from "@/lib/supabase/server"
import { requireAdmin } from "@/lib/admin-auth"

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data } = await supabase.auth.getUser()

  if (!data?.user) {
    return null
  }

  await requireAdmin()

  const user = data.user

  return (
    <div className="flex min-h-screen bg-sidebar">
      <AdminSidebar />
      <main className="flex-1 ml-64 bg-background">{children}</main>
    </div>
  )
}
