"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Upload } from "lucide-react"

type Props = {
  type: "avatar" | "profile"
  onUploadComplete: (url: string) => void
}

export default function PhotoUpload({ type, onUploadComplete }: Props) {
  const [uploading, setUploading] = useState(false)

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)

    const formData = new FormData()
    formData.append("file", file)
    formData.append("type", type)

    const res = await fetch("/api/upload-photo", {
      method: "POST",
      body: formData,
    })

    if (res.ok) {
      const data = await res.json()
      onUploadComplete(data.url)
    } else {
      alert("Upload failed")
    }

    setUploading(false)
  }

  return (
    <div>
      <input
        type="file"
        id={`photo-upload-${type}`}
        className="hidden"
        accept="image/*"
        onChange={handleFileChange}
        disabled={uploading}
      />
      <label htmlFor={`photo-upload-${type}`}>
        <Button
          type="button"
          variant="outline"
          disabled={uploading}
          onClick={() => document.getElementById(`photo-upload-${type}`)?.click()}
          asChild
        >
          <span>
            <Upload className="w-4 h-4 mr-2" />
            {uploading ? "Uploading..." : `Upload ${type === "avatar" ? "Avatar" : "Photo"}`}
          </span>
        </Button>
      </label>
    </div>
  )
}
