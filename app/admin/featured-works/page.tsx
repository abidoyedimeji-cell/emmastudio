"use client"

import { useState } from "react"
import { AdminSidebar } from "@/components/admin-sidebar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ImagePlus, X, GripVertical } from "lucide-react"
import Image from "next/image"

interface FeaturedWork {
  id: number
  creatorName: string
  projectTitle: string
  image: string
  creatorAvatar: string
  category: "slideshow" | "top-rated" | "new" | "favorites"
}

export default function FeaturedWorksPage() {
  const [slideshowWorks, setSlideshowWorks] = useState<FeaturedWork[]>([
    {
      id: 1,
      creatorName: "Creative Team",
      projectTitle: "Urban Fashion Editorial",
      image: "/images/gabos-20london-20x-20emma-20-281-29.jpg",
      creatorAvatar: "/images/gabos-20london-20x-20emma-20-281-29.jpg",
      category: "slideshow",
    },
    {
      id: 2,
      creatorName: "Origin Kicks",
      projectTitle: "Brand Campaign",
      image: "/images/origin-20kicks-20x-20franklin.jpg",
      creatorAvatar: "/images/origin-20kicks-20x-20franklin.jpg",
      category: "slideshow",
    },
  ])

  const [topRatedWorks, setTopRatedWorks] = useState<FeaturedWork[]>([])
  const [newCreatorWorks, setNewCreatorWorks] = useState<FeaturedWork[]>([])
  const [favoritesWorks, setFavoritesWorks] = useState<FeaturedWork[]>([])

  const handleImageUpload = (category: string) => {
    // Placeholder for image upload functionality
    alert("Image upload would integrate with Vercel Blob or your preferred storage")
  }

  const removeWork = (category: string, id: number) => {
    switch (category) {
      case "slideshow":
        setSlideshowWorks((works) => works.filter((w) => w.id !== id))
        break
      case "top-rated":
        setTopRatedWorks((works) => works.filter((w) => w.id !== id))
        break
      case "new":
        setNewCreatorWorks((works) => works.filter((w) => w.id !== id))
        break
      case "favorites":
        setFavoritesWorks((works) => works.filter((w) => w.id !== id))
        break
    }
  }

  const WorkCard = ({ work, category }: { work: FeaturedWork; category: string }) => (
    <Card className="group relative">
      <CardContent className="p-4">
        <div className="flex gap-4">
          <div className="relative w-32 h-32 rounded-lg overflow-hidden flex-shrink-0">
            <Image src={work.image || "/placeholder.svg"} alt={work.projectTitle} fill className="object-cover" />
          </div>
          <div className="flex-1">
            <h4 className="font-semibold text-sm mb-1">{work.creatorName}</h4>
            <p className="text-sm text-muted-foreground mb-3">{work.projectTitle}</p>
            <div className="flex gap-2">
              <Button size="sm" variant="outline">
                Edit
              </Button>
              <Button size="sm" variant="ghost" onClick={() => removeWork(category, work.id)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <div className="cursor-move opacity-0 group-hover:opacity-100 transition-opacity">
            <GripVertical className="h-5 w-5 text-muted-foreground" />
          </div>
        </div>
      </CardContent>
    </Card>
  )

  const CategorySection = ({
    title,
    description,
    works,
    category,
    maxCount = 5,
  }: {
    title: string
    description: string
    works: FeaturedWork[]
    category: string
    maxCount?: number
  }) => (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold">{title}</h3>
        <p className="text-sm text-muted-foreground">
          {description} (Max {maxCount})
        </p>
      </div>

      {works.length < maxCount && (
        <Button onClick={() => handleImageUpload(category)} variant="outline" className="w-full border-dashed">
          <ImagePlus className="h-4 w-4 mr-2" />
          Add Featured Work ({works.length}/{maxCount})
        </Button>
      )}

      <div className="space-y-3">
        {works.map((work) => (
          <WorkCard key={work.id} work={work} category={category} />
        ))}
      </div>
    </div>
  )

  return (
    <div className="flex min-h-screen bg-background">
      <AdminSidebar />
      <main className="flex-1 ml-64">
        <div className="p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight mb-2">Featured Works</h1>
            <p className="text-muted-foreground">Manage featured creator works displayed on the Creators page</p>
          </div>

          <Tabs defaultValue="slideshow" className="space-y-6">
            <TabsList>
              <TabsTrigger value="slideshow">Hero Slideshow</TabsTrigger>
              <TabsTrigger value="top-rated">Top Rated</TabsTrigger>
              <TabsTrigger value="new">New Creators</TabsTrigger>
              <TabsTrigger value="favorites">Client Favorites</TabsTrigger>
            </TabsList>

            <TabsContent value="slideshow" className="space-y-4">
              <CategorySection
                title="Hero Slideshow"
                description="Large format images displayed in the hero section"
                works={slideshowWorks}
                category="slideshow"
                maxCount={6}
              />
            </TabsContent>

            <TabsContent value="top-rated" className="space-y-4">
              <CategorySection
                title="Top Rated Creators"
                description="Highest rated creators based on reviews"
                works={topRatedWorks}
                category="top-rated"
                maxCount={5}
              />
            </TabsContent>

            <TabsContent value="new" className="space-y-4">
              <CategorySection
                title="New Creators"
                description="Recently joined creators"
                works={newCreatorWorks}
                category="new"
                maxCount={5}
              />
            </TabsContent>

            <TabsContent value="favorites" className="space-y-4">
              <CategorySection
                title="Client Favorites"
                description="Most booked and favorited creators"
                works={favoritesWorks}
                category="favorites"
                maxCount={5}
              />
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
}
