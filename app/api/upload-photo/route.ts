import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  const supabase = await createClient()

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const formData = await request.formData()
  const file = formData.get("file") as File
  const type = formData.get("type") as string // "avatar" or "profile"

  if (!file) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 })
  }

  const fileExt = file.name.split(".").pop()
  const fileName = `${user.id}-${Date.now()}.${fileExt}`
  const filePath = type === "avatar" ? `avatars/${fileName}` : `photos/${fileName}`

  // Upload to Supabase Storage
  const { data: uploadData, error: uploadError } = await supabase.storage
    .from("profile-photos")
    .upload(filePath, file, { upsert: true })

  if (uploadError) {
    return NextResponse.json({ error: uploadError.message }, { status: 500 })
  }

  // Get public URL
  const {
    data: { publicUrl },
  } = supabase.storage.from("profile-photos").getPublicUrl(filePath)

  // Update profile with new photo URL
  if (type === "avatar") {
    const { error: updateError } = await supabase.from("profiles").update({ avatar_url: publicUrl }).eq("id", user.id)

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 500 })
    }
  } else {
    // Add to profile_photos table
    const { error: insertError } = await supabase
      .from("profile_photos")
      .insert([{ user_id: user.id, photo_url: publicUrl }])

    if (insertError) {
      return NextResponse.json({ error: insertError.message }, { status: 500 })
    }
  }

  return NextResponse.json({ url: publicUrl })
}
