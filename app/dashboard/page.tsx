import { Metadata } from "next"
import { createClient } from "@/lib/supabase/server"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { Camera, Calendar, Heart, Settings, User, LogOut, Building2, Video } from "lucide-react"

export const metadata: Metadata = {
  title: "Dashboard",
  robots: { index: false, follow: false },
}

export default async function DashboardPage() {
  try {
    const supabase = await createClient()
    const { data } = await supabase.auth.getUser()

    if (!data?.user) {
      console.log("[v0] No user found in dashboard")
      return null
    }

    const user = data.user

    const { data: profileData, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single()

    if (profileError || !profileData) {
      console.error("[v0] Profile fetch error:", profileError)
      return (
        <div className="min-h-screen flex items-center justify-center">
          <p className="text-muted-foreground">Unable to load profile data</p>
        </div>
      )
    }

    const profile = profileData

    let roleData = null
    if (profile.user_role === "creator") {
      const { data: creatorData, error: creatorError } = await supabase
        .from("emma_creators")
        .select("display_name, rating, review_count, completed_bookings")
        .eq("user_id", user.id)
        .single()
      if (creatorError) {
        console.error("[v0] Creator data fetch error:", creatorError)
      }
      roleData = creatorData
    } else if (profile.user_role === "studio") {
      const { data: studioData, error: studioError } = await supabase
        .from("emma_studios")
        .select("name, rating, review_count")
        .eq("owner_id", user.id)
        .single()
      if (studioError) {
        console.error("[v0] Studio data fetch error:", studioError)
      }
      roleData = studioData
    }

    return (
      <div className="min-h-screen bg-[#fafafa]">
        {/* Header */}
        <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <Link href="/" className="flex items-center gap-2">
                <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center">
                  <Camera className="h-4 w-4 text-white" />
                </div>
                <span className="text-lg font-semibold tracking-tight">EMMA STUDIOS</span>
              </Link>
              <div className="flex items-center gap-4">
                <Link href="/settings">
                  <Button variant="ghost" size="sm">
                    <Settings className="h-4 w-4 mr-2" />
                    Settings
                  </Button>
                </Link>
                <form action="/api/auth/signout" method="POST">
                  <Button variant="ghost" size="sm" className="text-gray-500">
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign out
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Welcome Section */}
          <div className="mb-12">
            <h1 className="text-3xl font-semibold text-gray-900">
              Welcome back, {profile?.full_name || user.email?.split("@")[0]}
            </h1>
            <p className="text-gray-500 mt-2">
              {profile.user_role === "client" && "Manage your bookings, favorites, and account settings"}
              {profile.user_role === "creator" && "Manage your bookings, portfolio, and availability"}
              {profile.user_role === "studio" && "Manage your bookings, space details, and availability"}
            </p>
          </div>

          {/* Role-specific stats for creators and studios */}
          {(profile.user_role === "creator" || profile.user_role === "studio") && roleData && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              <Card className="border-0 shadow-md">
                <CardContent className="p-6">
                  <p className="text-sm text-gray-500">Rating</p>
                  <p className="text-2xl font-semibold mt-1">{roleData.rating || "0.0"} ⭐</p>
                  <p className="text-xs text-gray-400 mt-1">{roleData.review_count || 0} reviews</p>
                </CardContent>
              </Card>
              <Card className="border-0 shadow-md">
                <CardContent className="p-6">
                  <p className="text-sm text-gray-500">
                    {profile.user_role === "creator" ? "Completed Jobs" : "Total Bookings"}
                  </p>
                  <p className="text-2xl font-semibold mt-1">{roleData.completed_bookings || 0}</p>
                </CardContent>
              </Card>
              <Card className="border-0 shadow-md">
                <CardContent className="p-6">
                  <p className="text-sm text-gray-500">Profile Name</p>
                  <p className="text-2xl font-semibold mt-1 truncate">
                    {profile.user_role === "creator" ? roleData.display_name : roleData.name}
                  </p>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <Link href="/">
              <Card className="border-0 shadow-md hover:shadow-lg transition-shadow cursor-pointer h-full">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
                    <Camera className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900">Browse</h3>
                  <p className="text-sm text-gray-500 mt-1">Find creators & studios</p>
                </CardContent>
              </Card>
            </Link>

            <Link href="/dashboard/bookings">
              <Card className="border-0 shadow-md hover:shadow-lg transition-shadow cursor-pointer h-full">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-4">
                    <Calendar className="h-6 w-6 text-green-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900">Bookings</h3>
                  <p className="text-sm text-gray-500 mt-1">
                    {profile.user_role === "client" ? "Your bookings" : "Manage bookings"}
                  </p>
                </CardContent>
              </Card>
            </Link>

            {profile.user_role === "client" && (
              <Link href="/dashboard/favorites">
                <Card className="border-0 shadow-md hover:shadow-lg transition-shadow cursor-pointer h-full">
                  <CardContent className="p-6">
                    <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center mb-4">
                      <Heart className="h-6 w-6 text-red-600" />
                    </div>
                    <h3 className="font-semibold text-gray-900">Favorites</h3>
                    <p className="text-sm text-gray-500 mt-1">Saved creators & studios</p>
                  </CardContent>
                </Card>
              </Link>
            )}

            {(profile.user_role === "creator" || profile.user_role === "studio") && (
              <Link
                href={
                  profile.user_role === "creator"
                    ? `/creator/${user.id}`
                    : profile.user_role === "studio"
                      ? `/studio/${user.id}`
                      : "#"
                }
              >
                <Card className="border-0 shadow-md hover:shadow-lg transition-shadow cursor-pointer h-full">
                  <CardContent className="p-6">
                    <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4">
                      {profile.user_role === "creator" ? (
                        <Video className="h-6 w-6 text-purple-600" />
                      ) : (
                        <Building2 className="h-6 w-6 text-purple-600" />
                      )}
                    </div>
                    <h3 className="font-semibold text-gray-900">My Profile</h3>
                    <p className="text-sm text-gray-500 mt-1">View public profile</p>
                  </CardContent>
                </Card>
              </Link>
            )}

            <Link href="/settings">
              <Card className="border-0 shadow-md hover:shadow-lg transition-shadow cursor-pointer h-full">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center mb-4">
                    <Settings className="h-6 w-6 text-gray-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900">Settings</h3>
                  <p className="text-sm text-gray-500 mt-1">Account preferences</p>
                </CardContent>
              </Card>
            </Link>
          </div>

          {/* Account Info */}
          <Card className="border-0 shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                  <User className="h-5 w-5 text-gray-600" />
                </div>
                Account Information
              </CardTitle>
              <CardDescription>Your profile details</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-medium">{user.email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Account Type</p>
                  <p className="font-medium capitalize">{profile?.user_role || "Client"}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Member Since</p>
                  <p className="font-medium">
                    {new Date(user.created_at).toLocaleDateString("en-GB", {
                      month: "long",
                      year: "numeric",
                    })}
                  </p>
                </div>
                {profile?.phone && (
                  <div>
                    <p className="text-sm text-gray-500">Phone</p>
                    <p className="font-medium">{profile.phone}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    )
  } catch (error) {
    console.error("[v0] Dashboard page error:", error)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">An error occurred loading your dashboard</p>
      </div>
    )
  }
}
