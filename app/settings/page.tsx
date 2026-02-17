import { createClient } from "@/lib/supabase/server"
import { SettingsContent } from "@/components/settings-content"

export default async function SettingsPage() {
  const supabase = await createClient()
  const { data } = await supabase.auth.getUser()

  if (!data?.user) {
    return null
  }

  const user = data.user

  const { data: profileData } = await supabase.from("profiles").select("*").eq("id", user.id).single()
  const profile = profileData

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Settings</h1>
          <p className="text-muted-foreground mt-2">Manage your account settings and preferences</p>
        </div>
        <SettingsContent user={user} profile={profile} />
      </div>
    </div>
  )
}
