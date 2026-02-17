"use client"

import { useRef } from "react"
import Link from "next/link"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Calendar, Star, Camera, Video, Mic, Palette, Sparkles } from "lucide-react"

interface Creator {
  id: string
  name: string
  type: string
  specialty: string
  profileImage: string
  hourlyRate: number
  rating: number
  nextAvailable: string
  packageName: string
  packagePrice: number
  packageDescription: string
}

interface UpcomingCreatorsCarouselProps {
  creators: Creator[]
  title?: string
}

const getCreatorIcon = (type: string) => {
  switch (type?.toLowerCase()) {
    case "photographer":
      return <Camera className="h-3 w-3" />
    case "videographer":
      return <Video className="h-3 w-3" />
    case "audio_engineer":
      return <Mic className="h-3 w-3" />
    case "editor":
      return <Palette className="h-3 w-3" />
    default:
      return <Sparkles className="h-3 w-3" />
  }
}

const getCreatorBorderColor = (type: string) => {
  switch (type?.toLowerCase()) {
    case "photographer":
      return "border-blue-500"
    case "videographer":
      return "border-purple-500"
    case "audio_engineer":
      return "border-red-500"
    case "editor":
      return "border-green-500"
    default:
      return "border-orange-500"
  }
}

export function UpcomingCreatorsCarousel({ creators, title = "Available Creators" }: UpcomingCreatorsCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null)

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = 280
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      })
    }
  }

  if (creators.length === 0) return null

  return (
    <section className="py-4 sm:py-6 md:py-8 w-full max-w-full overflow-hidden">
      <div className="flex items-center justify-between mb-3 sm:mb-4 px-1">
        <div className="flex items-center gap-2 min-w-0 flex-1">
          <Calendar className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground flex-shrink-0" />
          <h3 className="text-base sm:text-lg md:text-xl font-semibold truncate">{title}</h3>
        </div>
        <div className="flex gap-1 sm:gap-2 flex-shrink-0">
          <Button
            variant="outline"
            size="icon"
            className="h-7 w-7 sm:h-8 sm:w-8 bg-transparent"
            onClick={() => scroll("left")}
          >
            <ChevronLeft className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="h-7 w-7 sm:h-8 sm:w-8 bg-transparent"
            onClick={() => scroll("right")}
          >
            <ChevronRight className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
          </Button>
        </div>
      </div>

      <div
        ref={scrollRef}
        className="flex gap-3 sm:gap-4 overflow-x-auto scrollbar-hide snap-x snap-mandatory pb-3 sm:pb-4 -mx-1 px-1"
        style={{ WebkitOverflowScrolling: "touch" }}
      >
        {creators.map((creator) => (
          <Link key={creator.id} href={`/creator/${creator.id}`} className="snap-start flex-shrink-0">
            <Card className="w-[220px] sm:w-[240px] md:w-[260px] overflow-hidden hover:shadow-md transition-shadow">
              <div className={`relative aspect-[4/3] p-0.5 sm:p-1 ${getCreatorBorderColor(creator.type)}`}>
                <div className="relative w-full h-full rounded-t overflow-hidden">
                  <Image
                    src={creator.profileImage || "/placeholder.svg?height=200&width=260&query=creative professional"}
                    alt={creator.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="absolute top-2 sm:top-3 left-2 sm:left-3 bg-white/90 backdrop-blur-sm text-[9px] sm:text-[10px] font-medium px-1.5 sm:px-2 py-0.5 rounded-full flex items-center gap-0.5 sm:gap-1">
                  {getCreatorIcon(creator.type)}
                  <span className="truncate max-w-[80px]">{creator.type}</span>
                </div>
                <div className="absolute bottom-2 sm:bottom-3 right-2 sm:right-3 bg-green-500 text-white text-[9px] sm:text-[10px] font-medium px-1.5 sm:px-2 py-0.5 rounded-full flex items-center gap-0.5 sm:gap-1 whitespace-nowrap">
                  <Calendar className="h-2.5 w-2.5 sm:h-3 sm:w-3 flex-shrink-0" />
                  {creator.nextAvailable}
                </div>
              </div>

              <CardContent className="p-2.5 sm:p-3 bg-zinc-900 text-white">
                <div className="flex items-center justify-between mb-1.5 sm:mb-2 gap-2">
                  <h4 className="font-semibold text-xs sm:text-sm truncate flex-1 min-w-0">{creator.name}</h4>
                  <div className="flex items-center gap-0.5 sm:gap-1 text-[10px] sm:text-xs flex-shrink-0 whitespace-nowrap">
                    <Star className="h-2.5 w-2.5 sm:h-3 sm:w-3 fill-yellow-400 text-yellow-400" />
                    {creator.rating}
                  </div>
                </div>

                <p className="text-[10px] sm:text-xs text-gray-400 mb-1.5 sm:mb-2 truncate">{creator.specialty}</p>

                <div className="bg-zinc-800 rounded-lg p-1.5 sm:p-2 mb-1.5 sm:mb-2">
                  <div className="flex items-center justify-between mb-0.5 sm:mb-1 gap-2">
                    <span className="text-[10px] sm:text-xs font-medium truncate flex-1 min-w-0">
                      {creator.packageName}
                    </span>
                    <span className="text-[10px] sm:text-xs font-bold text-green-400 whitespace-nowrap flex-shrink-0">
                      £{creator.packagePrice}
                    </span>
                  </div>
                  <p className="text-[9px] sm:text-[10px] text-gray-400 line-clamp-2 break-words">
                    {creator.packageDescription}
                  </p>
                </div>

                <Button size="sm" className="w-full h-6 sm:h-7 text-[10px] sm:text-xs">
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
