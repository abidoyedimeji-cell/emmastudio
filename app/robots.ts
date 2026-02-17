import { MetadataRoute } from "next"

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://emmastudios.com"

  return {
    rules: [
      {
        userAgent: "*",
        allow: [
          "/",
          "/creators",
          "/creators/*",
          "/studios",
          "/studio/*",
          "/services/*",
          "/browse",
          "/how-it-works",
          "/become-partner",
          "/terms/*",
          "/policies",
          "/privacy",
        ],
        disallow: [
          "/admin/*",
          "/dashboard/*",
          "/messages/*",
          "/availability/*",
          "/checkout/*",
          "/booking-confirmation/*",
          "/settings/*",
          "/profile/*",
          "/onboarding/*",
          "/select-role",
          "/api/*",
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
