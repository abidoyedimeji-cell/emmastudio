"use client"

import { useRef } from "react"
import Link from "next/link"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Calendar, Star, Camera, Video, Mic, Building2 } from "lucide-react"

interface Studio {
  id: string
  name: string
  type: string
  image: string
  hourlyRate: number
  rating: number
  nextAvailable: string
  packageName: string
  packagePrice: number
  packageDescription: string
  city: string
}

interface UpcomingStudiosCarouselProps {
  studios: Studio[]
  title?: string
}

const getStudioIcon = (type: string) => {
  switch (type?.toLowerCase()) {
    case "photography":
      return <Camera className="h-3 w-3" />
    case "videography":
      return <Video className="h-3 w-3" />
    case "audio":
      return <Mic className="h-3 w-3" />
    default:
      return <Building2 className="h-3 w-3" />
  }
}

const getStudioBorderColor = (type: string) => {
  switch (type?.toLowerCase()) {
    case "photography":
      return "border-blue-500"
    case "videography":
      return "border-purple-500"
    case "audio":
      return "border-red-500"
    default:
      return "border-orange-500"
  }
}

export function UpcomingStudiosCarousel({ studios, title = "Available Studios" }: UpcomingStudiosCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null)

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = 300
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      })
    }
  }

  if (studios.length === 0) return null

  return (
    <section className="py-8">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Building2 className="h-5 w-5 text-muted-foreground" />
          <h3 className="text-lg font-semibold">{title}</h3>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="icon" className="h-8 w-8 bg-transparent" onClick={() => scroll("left")}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" className="h-8 w-8 bg-transparent" onClick={() => scroll("right")}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div ref={scrollRef} className="flex gap-4 overflow-x-auto scrollbar-hide snap-x snap-mandatory pb-4">
        {studios.map((studio) => (
          <Link key={studio.id} href={`/studio/${studio.id}`} className="snap-start flex-shrink-0">
            <Card className="w-[260px] overflow-hidden hover:shadow-md transition-shadow">
              <div className={`relative aspect-[4/3] p-1 ${getStudioBorderColor(studio.type)}`}>
                <div className="relative w-full h-full rounded-t overflow-hidden">
                  <Image
                    src={studio.image || "/placeholder.svg?height=200&width=260&query=creative studio"}
                    alt={studio.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-[10px] font-medium px-2 py-0.5 rounded-full flex items-center gap-1">
                  {getStudioIcon(studio.type)}
                  {studio.type}
                </div>
                <div className="absolute bottom-3 right-3 bg-green-500 text-white text-[10px] font-medium px-2 py-0.5 rounded-full flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {studio.nextAvailable}
                </div>
              </div>

              <CardContent className="p-3 bg-zinc-900 text-white">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-sm truncate">{studio.name}</h4>
                  <div className="flex items-center gap-1 text-xs">
                    <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                    {studio.rating}
                  </div>
                </div>

                <p className="text-xs text-gray-400 mb-2">{studio.city}</p>

                <div className="bg-zinc-800 rounded-lg p-2 mb-2">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-medium">{studio.packageName}</span>
                    <span className="text-xs font-bold text-green-400">£{studio.packagePrice}</span>
                  </div>
                  <p className="text-[10px] text-gray-400 line-clamp-2">{studio.packageDescription}</p>
                </div>

                <Button size="sm" className="w-full h-7 text-xs">
                  Book Now
                </Button>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </section>
  )
}
