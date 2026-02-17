import { createClient } from "@/lib/supabase/server"
import { ProfileDashboard } from "@/components/profile-dashboard"

export default async function ProfilePage() {
  const supabase = await createClient()
  const { data } = await supabase.auth.getUser()

  if (!data?.user) {
    return null
  }

  const user = data.user

  const { data: profileData } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  if (!profileData) {
    return null
  }

  const profile = profileData

  return <ProfileDashboard user={user} profile={profile} />
}
