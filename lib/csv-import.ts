import { createClient } from "@/lib/supabase/server"

export interface CreatorCSVRow {
  display_name: string
  email: string
  creator_type: string
  specialty: string
  bio: string
  short_bio: string
  city: string
  postcode: string
  hourly_rate: string
  half_day_rate: string
  full_day_rate: string
  years_experience: string
  skills: string // pipe-separated
  portfolio_images: string // pipe-separated URLs
  portfolio_videos: string // pipe-separated URLs
  instagram_url: string
  website_url: string
  is_active: string
  is_verified: string
  is_featured: string
}

export interface StudioCSVRow {
  name: string
  owner_email: string
  studio_type: string
  description: string
  short_bio: string
  address: string
  city: string
  postcode: string
  latitude: string
  longitude: string
  size: string
  hourly_rate: string
  half_day_rate: string
  full_day_rate: string
  amenities: string // pipe-separated
  equipment: string // pipe-separated
  gallery_images: string // pipe-separated URLs
  cover_image: string
  cancellation_policy: string
  rules: string
  is_active: string
  is_verified: string
}

export async function importCreatorsFromCSV(csvData: CreatorCSVRow[]) {
  const supabase = await createClient()
  const results = {
    success: 0,
    errors: [] as { row: number; error: string }[],
  }

  for (let i = 0; i < csvData.length; i++) {
    const row = csvData[i]

    try {
      // Generate slug from display name
      const slug = row.display_name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "")

      // Parse arrays
      const skills = row.skills ? row.skills.split("|").filter(Boolean) : []
      const portfolioImages = row.portfolio_images ? row.portfolio_images.split("|").filter(Boolean) : []
      const portfolioVideos = row.portfolio_videos ? row.portfolio_videos.split("|").filter(Boolean) : []

      // Insert creator
      const { error } = await supabase.from("emma_creators").insert({
        display_name: row.display_name,
        creator_type: row.creator_type,
        specialty: row.specialty,
        bio: row.bio,
        short_bio: row.short_bio,
        city: row.city,
        postcode: row.postcode,
        slug,
        hourly_rate: Number.parseFloat(row.hourly_rate),
        half_day_rate: Number.parseFloat(row.half_day_rate),
        full_day_rate: Number.parseFloat(row.full_day_rate),
        years_experience: Number.parseInt(row.years_experience),
        skills,
        portfolio_images: portfolioImages,
        portfolio_videos: portfolioVideos,
        instagram_url: row.instagram_url || null,
        website_url: row.website_url || null,
        is_active: row.is_active === "true",
        is_verified: row.is_verified === "true",
        is_featured: row.is_featured === "true",
        rating: 0,
        review_count: 0,
        completed_bookings: 0,
        returning_clients: 0,
      })

      if (error) throw error
      results.success++
    } catch (error: any) {
      results.errors.push({
        row: i + 2, // +2 for header row and 0-indexing
        error: error.message,
      })
    }
  }

  return results
}

export async function importStudiosFromCSV(csvData: StudioCSVRow[]) {
  const supabase = await createClient()
  const results = {
    success: 0,
    errors: [] as { row: number; error: string }[],
  }

  for (let i = 0; i < csvData.length; i++) {
    const row = csvData[i]

    try {
      // Generate slug from name
      const slug = row.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "")

      // Parse arrays
      const amenities = row.amenities ? row.amenities.split("|").filter(Boolean) : []
      const equipment = row.equipment ? row.equipment.split("|").filter(Boolean) : []
      const galleryImages = row.gallery_images ? row.gallery_images.split("|").filter(Boolean) : []

      // Insert studio
      const { error } = await supabase.from("emma_studios").insert({
        name: row.name,
        studio_type: row.studio_type,
        description: row.description,
        short_bio: row.short_bio,
        address: row.address,
        city: row.city,
        postcode: row.postcode,
        latitude: Number.parseFloat(row.latitude),
        longitude: Number.parseFloat(row.longitude),
        slug,
        size: row.size,
        hourly_rate: Number.parseFloat(row.hourly_rate),
        half_day_rate: Number.parseFloat(row.half_day_rate),
        full_day_rate: Number.parseFloat(row.full_day_rate),
        amenities,
        equipment,
        gallery_images: galleryImages,
        cover_image: row.cover_image,
        cancellation_policy: row.cancellation_policy,
        rules: row.rules,
        is_active: row.is_active === "true",
        is_verified: row.is_verified === "true",
        rating: 0,
        review_count: 0,
      })

      if (error) throw error
      results.success++
    } catch (error: any) {
      results.errors.push({
        row: i + 2, // +2 for header row and 0-indexing
        error: error.message,
      })
    }
  }

  return results
}

export function parseCSV(csvContent: string): any[] {
  const lines = csvContent.trim().split("\n")
  const headers = lines[0].split(",").map((h) => h.trim().replace(/^"|"$/g, ""))

  return lines.slice(1).map((line) => {
    const values: string[] = []
    let currentValue = ""
    let insideQuotes = false

    for (let i = 0; i < line.length; i++) {
      const char = line[i]

      if (char === '"') {
        insideQuotes = !insideQuotes
      } else if (char === "," && !insideQuotes) {
        values.push(currentValue.trim())
        currentValue = ""
      } else {
        currentValue += char
      }
    }
    values.push(currentValue.trim())

    const row: any = {}
    headers.forEach((header, index) => {
      row[header] = values[index] || ""
    })
    return row
  })
}
