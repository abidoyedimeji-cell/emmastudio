"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { Settings, LayoutDashboard, Heart } from "lucide-react"

interface ProfileDashboardProps {
  user: any
  profile: any
}

export function ProfileDashboard({ user, profile }: ProfileDashboardProps) {
  const isCreatorOrStudio = profile.user_role === "creator" || profile.user_role === "studio"

  return (
    <div className="min-h-screen bg-background px-4 py-12">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Welcome back, {profile.full_name}!</h1>
          <p className="text-muted-foreground">Manage your account and preferences</p>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {isCreatorOrStudio && (
            <Link href="/dashboard">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <LayoutDashboard className="w-6 h-6 text-primary" />
                    <CardTitle>Dashboard</CardTitle>
                  </div>
                  <CardDescription>Manage your listings and bookings</CardDescription>
                </CardHeader>
              </Card>
            </Link>
          )}

          <Link href="/settings">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Settings className="w-6 h-6 text-primary" />
                  <CardTitle>Settings</CardTitle>
                </div>
                <CardDescription>Update your profile and preferences</CardDescription>
              </CardHeader>
            </Card>
          </Link>

          {profile.user_role === "client" && (
            <Link href="/favorites">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <Heart className="w-6 h-6 text-primary" />
                    <CardTitle>Favorites</CardTitle>
                  </div>
                  <CardDescription>View your saved creators and studios</CardDescription>
                </CardHeader>
              </Card>
            </Link>
          )}
        </div>

        {/* Profile Information */}
        <Card>
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="font-medium">{profile.email}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Phone</p>
                <p className="font-medium">{profile.phone || "Not provided"}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Role</p>
                <Badge variant="secondary" className="mt-1">
                  {profile.user_role === "client" ? "Client" : profile.user_role === "creator" ? "Creator" : "Studio"}
                </Badge>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Member Since</p>
                <p className="font-medium">{new Date(profile.created_at).toLocaleDateString()}</p>
              </div>
            </div>

            <Button asChild className="mt-4">
              <Link href="/settings">Edit Profile</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
