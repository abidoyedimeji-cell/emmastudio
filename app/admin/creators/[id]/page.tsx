"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import useSWR from "swr"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { ChevronLeft, Save, Trash2, Upload, Plus, X, Loader2 } from "lucide-react"
import { createClient } from "@/lib/supabase/client"

const fetcher = (url: string) => fetch(url).then((r) => r.json())

export default function EditCreatorPage() {
  const router = useRouter()
  const { id } = useParams<{ id: string }>()
  const { data: creators = [], isLoading } = useSWR("/api/creators", fetcher)
  const creator = creators.find((c: any) => c.id === id)

  const [formData, setFormData] = useState({
    name: "", bio: "", specialty: "", location: "", hourly_rate: 0,
    years_experience: 0, skills: [] as string[], instagram: "", website: "",
  })

  useEffect(() => {
    if (creator) {
      setFormData({
        name: creator.name || "", bio: creator.bio || "",
        specialty: creator.specialty || "", city: creator.city || "",
        hourly_rate: creator.hourly_rate || 0, years_experience: creator.years_experience || 0,
        skills: creator.skills || [], instagram: creator.instagram || "", website: creator.website || "",
      })
    }
  }, [creator])

  const [newSkill, setNewSkill] = useState("")

  const handleSave = async () => {
    const supabase = createClient()
    const { error } = await supabase.from("emma_creators").update({
      name: formData.name, bio: formData.bio, specialty: formData.specialty,
      city: formData.city, hourly_rate: formData.hourly_rate,
      years_experience: formData.years_experience, skills: formData.skills,
      instagram: formData.instagram, website: formData.website,
    }).eq("id", id)
    if (!error) router.push("/admin/creators")
  }

  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete this creator?")) {
      const supabase = createClient()
      await supabase.from("emma_creators").delete().eq("id", id)
      router.push("/admin/creators")
    }
  }

  const addSkill = () => { if (newSkill && !formData.skills.includes(newSkill)) { setFormData({ ...formData, skills: [...formData.skills, newSkill] }); setNewSkill("") } }
  const removeSkill = (s: string) => { setFormData({ ...formData, skills: formData.skills.filter((x) => x !== s) }) }

  if (isLoading) return <div className="p-8 flex items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>
  if (!creator) return <div className="p-8">Creator not found</div>

  return (
    <div className="p-8">
      <div className="mb-6">
        <Link href="/admin/creators"><Button variant="ghost" className="mb-4 bg-transparent"><ChevronLeft className="h-4 w-4 mr-2" />Back to Creators</Button></Link>
        <div className="flex items-center justify-between">
          <h1 className="font-serif text-3xl font-bold">Edit Creator Profile</h1>
          <div className="flex gap-2">
            <Button variant="destructive" onClick={handleDelete}><Trash2 className="h-4 w-4 mr-2" />Delete</Button>
            <Button onClick={handleSave} className="bg-accent hover:bg-accent/90"><Save className="h-4 w-4 mr-2" />Save Changes</Button>
          </div>
        </div>
      </div>
      <div className="grid gap-6">
        <Card>
          <CardHeader><CardTitle>Profile Picture</CardTitle></CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <div className="h-24 w-24 rounded-full bg-secondary flex items-center justify-center text-3xl font-semibold">{formData.name.charAt(0)}</div>
              <Button variant="outline" className="bg-transparent"><Upload className="h-4 w-4 mr-2" />Upload New Photo</Button>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Basic Information</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div><Label htmlFor="name">Full Name</Label><Input id="name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} /></div>
              <div><Label htmlFor="specialty">Specialty</Label><Input id="specialty" value={formData.specialty} onChange={(e) => setFormData({ ...formData, specialty: e.target.value })} /></div>
            </div>
            <div><Label htmlFor="bio">Bio</Label><Textarea id="bio" value={formData.bio} onChange={(e) => setFormData({ ...formData, bio: e.target.value })} rows={4} /></div>
            <div className="grid md:grid-cols-3 gap-4">
              <div><Label htmlFor="city">City</Label><Input id="city" value={formData.city} onChange={(e) => setFormData({ ...formData, city: e.target.value })} /></div>
              <div><Label htmlFor="experience">Years of Experience</Label><Input id="experience" type="number" value={formData.years_experience} onChange={(e) => setFormData({ ...formData, years_experience: Number(e.target.value) })} /></div>
              <div><Label htmlFor="hourly_rate">Hourly Rate</Label><Input id="hourly_rate" type="number" value={formData.hourly_rate} onChange={(e) => setFormData({ ...formData, hourly_rate: Number(e.target.value) })} /></div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Skills</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2"><Input placeholder="Add skill..." value={newSkill} onChange={(e) => setNewSkill(e.target.value)} onKeyDown={(e) => e.key === "Enter" && addSkill()} /><Button onClick={addSkill}><Plus className="h-4 w-4" /></Button></div>
            <div className="flex flex-wrap gap-2">{formData.skills.map((s) => (<Badge key={s} variant="secondary" className="gap-2">{s}<button onClick={() => removeSkill(s)} className="hover:text-destructive"><X className="h-3 w-3" /></button></Badge>))}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Social Media &amp; Portfolio</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div><Label htmlFor="instagram">Instagram Handle</Label><Input id="instagram" placeholder="@username" value={formData.instagram} onChange={(e) => setFormData({ ...formData, instagram: e.target.value })} /></div>
            <div><Label htmlFor="website">Portfolio Website</Label><Input id="website" placeholder="https://..." value={formData.website} onChange={(e) => setFormData({ ...formData, website: e.target.value })} /></div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
