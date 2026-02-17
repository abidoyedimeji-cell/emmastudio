import { MetadataRoute } from "next"
import { createClient } from "@/lib/supabase/server"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://emmastudios.com"
  const supabase = await createClient()

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${baseUrl}/creators`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/studios`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/browse`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/services/photography`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/services/videography`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/services/audio`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/how-it-works`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/become-partner`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/terms/clients`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.3,
    },
    {
      url: `${baseUrl}/terms/creators`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.3,
    },
    {
      url: `${baseUrl}/policies`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.3,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.3,
    },
  ]

  // Fetch approved creators
  const { data: creators } = await supabase
    .from("emma_creators")
    .select("id, slug, updated_at")
    .eq("status", "approved")
    .eq("active", true)

  const creatorPages: MetadataRoute.Sitemap = (creators || []).map((creator) => ({
    url: `${baseUrl}/creator/${creator.slug || creator.id}`,
    lastModified: creator.updated_at ? new Date(creator.updated_at) : new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }))

  // Fetch approved studios
  const { data: studios } = await supabase
    .from("emma_studios")
    .select("id, slug, updated_at")
    .eq("status", "approved")
    .eq("active", true)

  const studioPages: MetadataRoute.Sitemap = (studios || []).map((studio) => ({
    url: `${baseUrl}/studio/${studio.slug || studio.id}`,
    lastModified: studio.updated_at ? new Date(studio.updated_at) : new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }))

  // Programmatic SEO pages - City + Service combinations
  const cities = ["london", "manchester", "birmingham", "leeds", "liverpool", "bristol", "edinburgh", "glasgow"]
  const services = ["photography", "videography", "audio", "podcast-studio", "music-studio"]

  const locationPages: MetadataRoute.Sitemap = cities.flatMap((city) =>
    services.map((service) => ({
      url: `${baseUrl}/${city}/${service}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    }))
  )

  return [...staticPages, ...creatorPages, ...studioPages, ...locationPages]
}
