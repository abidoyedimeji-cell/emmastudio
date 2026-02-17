"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import useSWR from "swr"
import Link from "next/link"
import Image from "next/image"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { ChevronLeft, Save, Trash2, Upload, Plus, X, Loader2 } from "lucide-react"
import { createClient } from "@/lib/supabase/client"

const fetcher = (url: string) => fetch(url).then((r) => r.json())

export default function EditStudioPage() {
  const router = useRouter()
  const { id } = useParams<{ id: string }>()
  const { data: studios = [], isLoading } = useSWR("/api/studios", fetcher)
  const studio = studios.find((s: any) => s.id === id)

  const [formData, setFormData] = useState({
    name: "", description: "", location: "", address: "", hourly_rate: 0,
    amenities: [] as string[], categories: [] as string[], equipment: [] as string[],
  })

  useEffect(() => {
    if (studio) {
      setFormData({
        name: studio.name || "", description: studio.description || "",
        city: studio.city || "", address: studio.address || "",
        hourly_rate: studio.hourly_rate || 0,
        amenities: studio.amenities || [], categories: studio.categories || [],
        equipment: studio.equipment || [],
      })
    }
  }, [studio])

  const [newAmenity, setNewAmenity] = useState("")
  const [newCategory, setNewCategory] = useState("")

  const handleSave = async () => {
    const supabase = createClient()
    const { error } = await supabase.from("emma_studios").update({
      name: formData.name, description: formData.description,
      city: formData.city, address: formData.address,
      hourly_rate: formData.hourly_rate, amenities: formData.amenities,
      categories: formData.categories, equipment: formData.equipment,
    }).eq("id", id)
    if (!error) router.push("/admin/studios")
  }

  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete this studio?")) {
      const supabase = createClient()
      await supabase.from("emma_studios").delete().eq("id", id)
      router.push("/admin/studios")
    }
  }

  const addAmenity = () => { if (newAmenity && !formData.amenities.includes(newAmenity)) { setFormData({ ...formData, amenities: [...formData.amenities, newAmenity] }); setNewAmenity("") } }
  const removeAmenity = (a: string) => { setFormData({ ...formData, amenities: formData.amenities.filter((x) => x !== a) }) }
  const addCategory = () => { if (newCategory && !formData.categories.includes(newCategory)) { setFormData({ ...formData, categories: [...formData.categories, newCategory] }); setNewCategory("") } }
  const removeCategory = (c: string) => { setFormData({ ...formData, categories: formData.categories.filter((x) => x !== c) }) }

  if (isLoading) return <div className="p-8 flex items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>
  if (!studio) return <div className="p-8">Studio not found</div>

  return (
    <div className="p-8">
      <div className="mb-6">
        <Link href="/admin/studios"><Button variant="ghost" className="mb-4 bg-transparent"><ChevronLeft className="h-4 w-4 mr-2" />Back to Studios</Button></Link>
        <div className="flex items-center justify-between">
          <h1 className="font-serif text-3xl font-bold">Edit Studio</h1>
          <div className="flex gap-2">
            <Button variant="destructive" onClick={handleDelete}><Trash2 className="h-4 w-4 mr-2" />Delete</Button>
            <Button onClick={handleSave} className="bg-accent hover:bg-accent/90"><Save className="h-4 w-4 mr-2" />Save Changes</Button>
          </div>
        </div>
      </div>
      <div className="grid gap-6">
        <Card>
          <CardHeader><CardTitle>Cover Image</CardTitle></CardHeader>
          <CardContent>
            <div className="relative h-64 w-full rounded-lg overflow-hidden bg-secondary mb-4">
              <Image src={studio.cover_image || "/placeholder.svg"} alt={studio.name} fill className="object-cover" />
            </div>
            <Button variant="outline" className="bg-transparent"><Upload className="h-4 w-4 mr-2" />Upload New Image</Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Basic Information</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div><Label htmlFor="name">Studio Name</Label><Input id="name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} /></div>
            <div><Label htmlFor="description">Description</Label><Textarea id="description" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} rows={4} /></div>
            <div className="grid md:grid-cols-2 gap-4">
              <div><Label htmlFor="city">City</Label><Input id="city" value={formData.city} onChange={(e) => setFormData({ ...formData, city: e.target.value })} /></div>
              <div><Label htmlFor="hourly_rate">Hourly Rate</Label><Input id="hourly_rate" type="number" value={formData.hourly_rate} onChange={(e) => setFormData({ ...formData, hourly_rate: Number(e.target.value) })} /></div>
            </div>
            <div><Label htmlFor="address">Full Address</Label><Input id="address" value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} /></div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Amenities</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2"><Input placeholder="Add amenity..." value={newAmenity} onChange={(e) => setNewAmenity(e.target.value)} onKeyDown={(e) => e.key === "Enter" && addAmenity()} /><Button onClick={addAmenity}><Plus className="h-4 w-4" /></Button></div>
            <div className="flex flex-wrap gap-2">{formData.amenities.map((a) => (<Badge key={a} variant="secondary" className="gap-2">{a}<button onClick={() => removeAmenity(a)} className="hover:text-destructive"><X className="h-3 w-3" /></button></Badge>))}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Categories</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2"><Input placeholder="Add category..." value={newCategory} onChange={(e) => setNewCategory(e.target.value)} onKeyDown={(e) => e.key === "Enter" && addCategory()} /><Button onClick={addCategory}><Plus className="h-4 w-4" /></Button></div>
            <div className="flex flex-wrap gap-2">{formData.categories.map((c) => (<Badge key={c} variant="secondary" className="gap-2">{c}<button onClick={() => removeCategory(c)} className="hover:text-destructive"><X className="h-3 w-3" /></button></Badge>))}</div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
