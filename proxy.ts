import { updateSession } from "@/lib/supabase/proxy"
import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"
import { createServerClient } from "@supabase/ssr"

export async function proxy(request: NextRequest) {
  const response = await updateSession(request)

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
        },
      },
    },
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()
  const path = request.nextUrl.pathname

  // Public paths that anyone can access (browsing)
  const publicPaths = [
    "/",
    "/login",
    "/signup",
    "/creators",
    "/studios",
    "/browse",
    "/creator/",
    "/studio/",
    "/auth/callback",
  ]
  const isPublicPath = publicPaths.some((p) => path === p || path.startsWith(p))

  // Protected paths that require authentication
  const protectedPaths = [
    "/dashboard",
    "/profile",
    "/settings",
    "/admin",
    "/bookings",
    "/favorites",
    "/onboarding",
    "/select-role",
  ]
  const isProtectedPath = protectedPaths.some((p) => path.startsWith(p))

  // Booking-related paths that require role selection
  const bookingPaths = ["/book", "/booking", "/checkout"]
  const isBookingPath = bookingPaths.some((p) => path.startsWith(p))

  // If user is not authenticated and trying to access protected/booking paths, redirect to login
  if (!user && (isProtectedPath || isBookingPath)) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  // If user is authenticated, check onboarding status for certain actions
  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("user_role, onboarding_completed, is_admin")
      .eq("id", user.id)
      .single()

    // If trying to book without role, redirect to role selection with booking flag
    if (isBookingPath && (!profile?.user_role || profile?.user_role === "client")) {
      return NextResponse.redirect(new URL("/select-role?from=booking", request.url))
    }

    if (
      profile?.user_role &&
      profile?.user_role !== "client" &&
      !profile?.onboarding_completed &&
      (path.startsWith("/dashboard") || path.startsWith("/profile") || path.startsWith("/settings"))
    ) {
      return NextResponse.redirect(new URL(`/onboarding/${profile.user_role}`, request.url))
    }

    // Admin routes protection
    if (path.startsWith("/admin") && !profile?.is_admin) {
      return NextResponse.redirect(new URL("/", request.url))
    }
  }

  return response
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
}
