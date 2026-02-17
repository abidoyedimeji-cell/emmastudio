"use client"

import { Suspense, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Camera, Building2, User, X, Loader2 } from "lucide-react"
import { setUserRole } from "@/actions/set-role"

export default function SelectRolePage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>}>
      <SelectRoleContent />
    </Suspense>
  )
}

function SelectRoleContent() {
  const [isLoading, setIsLoading] = useState(false)
  const [selectedRole, setSelectedRole] = useState<"client" | "creator" | "studio" | null>(null)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const searchParams = useSearchParams()

  const fromBooking = searchParams.get("from") === "booking"

  const handleRoleSelect = async () => {
    if (!selectedRole) return

    setIsLoading(true)
    setError(null)

    try {
      await setUserRole(selectedRole)
      router.push(`/onboarding/${selectedRole}`)
    } catch (err) {
      console.error("[v0] Error setting role:", err)
      setError(err instanceof Error ? err.message : "Failed to set role")
    } finally {
      setIsLoading(false)
    }
  }

  const handleExit = () => {
    router.push("/")
  }

  const roles = [
    {
      id: "client" as const,
      title: "Client",
      description: "Book creators and studio spaces for your projects",
      icon: User,
      features: ["Browse verified creators", "Book studio spaces", "Manage your bookings", "Access immediately"],
    },
    {
      id: "creator" as const,
      title: "Creator",
      description: "Offer your services as a photographer, videographer, or audio engineer",
      icon: Camera,
      features: ["Create your portfolio", "Set your packages", "Manage availability", "Get verified"],
    },
    {
      id: "studio" as const,
      title: "Studio / Venue",
      description: "List your studio space for bookings",
      icon: Building2,
      features: ["List your space", "Set hourly rates", "Manage calendar", "Get verified"],
    },
  ]

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-12 relative">
      <Button
        variant="ghost"
        size="icon"
        onClick={handleExit}
        className="absolute top-4 right-4 rounded-full"
        aria-label="Exit and browse"
      >
        <X className="w-5 h-5" />
      </Button>

      <div className="w-full max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold mb-3">Choose Your Role</h1>
          <p className="text-lg text-muted-foreground">Select how you'll be using EMMA STUDIOS</p>
          {fromBooking && (
            <p className="text-sm text-amber-600 mt-2">Please select a role to continue with your booking</p>
          )}
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {roles.map((role) => {
            const Icon = role.icon
            return (
              <Card
                key={role.id}
                className={`cursor-pointer transition-all hover:shadow-lg ${
                  selectedRole === role.id ? "ring-2 ring-primary shadow-lg" : "hover:border-primary/50"
                }`}
                onClick={() => setSelectedRole(role.id)}
              >
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <div
                      className={`p-3 rounded-lg ${
                        selectedRole === role.id ? "bg-primary text-primary-foreground" : "bg-muted"
                      }`}
                    >
                      <Icon className="w-6 h-6" />
                    </div>
                    <CardTitle className="text-xl">{role.title}</CardTitle>
                  </div>
                  <CardDescription className="text-sm leading-relaxed">{role.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {role.features.map((feature, idx) => (
                      <li key={idx} className="text-sm flex items-center gap-2">
                        <span className="text-primary">•</span>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {error && (
          <div className="p-4 rounded-lg bg-red-50 border border-red-200 mb-6">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        <div className="flex justify-center gap-4">
          <Button variant="outline" onClick={handleExit}>
            Browse Without Selecting
          </Button>
          <Button onClick={handleRoleSelect} disabled={!selectedRole || isLoading} size="lg" className="px-12">
            {isLoading ? "Setting up..." : "Continue"}
          </Button>
        </div>
      </div>
    </div>
  )
}
