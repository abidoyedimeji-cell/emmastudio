"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Loader2, Plus, Minus, Check } from "lucide-react"

interface Addon {
  id: string
  name: string
  description: string | null
  price: number
  unit: string | null
}

interface SelectedAddon {
  addon_id: string
  quantity: number
}

export function BundleBuilder({
  listingType,
  listingId,
  selectedAddons,
  onAddonsChange,
}: {
  listingType: string
  listingId: string
  selectedAddons: SelectedAddon[]
  onAddonsChange: (addons: SelectedAddon[]) => void
}) {
  const [addons, setAddons] = useState<Addon[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchAddons() {
      try {
        const res = await fetch(
          `/api/marketplace/addons?listing_type=${listingType}&listing_id=${listingId}`
        )
        if (res.ok) {
          const data = await res.json()
          setAddons(data.addons || [])
        }
      } catch {
        // Handle error
      } finally {
        setLoading(false)
      }
    }
    fetchAddons()
  }, [listingType, listingId])

  function toggleAddon(addonId: string) {
    const existing = selectedAddons.find((a) => a.addon_id === addonId)
    if (existing) {
      onAddonsChange(selectedAddons.filter((a) => a.addon_id !== addonId))
    } else {
      onAddonsChange([...selectedAddons, { addon_id: addonId, quantity: 1 }])
    }
  }

  function updateQuantity(addonId: string, delta: number) {
    onAddonsChange(
      selectedAddons.map((a) => {
        if (a.addon_id === addonId) {
          return { ...a, quantity: Math.max(1, a.quantity + delta) }
        }
        return a
      })
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-6">
        <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (addons.length === 0) return null

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Add-ons</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        {addons.map((addon) => {
          const selected = selectedAddons.find((a) => a.addon_id === addon.id)
          const isSelected = !!selected

          return (
            <div
              key={addon.id}
              className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-colors ${
                isSelected ? "border-primary bg-primary/5" : "hover:bg-muted"
              }`}
              onClick={() => toggleAddon(addon.id)}
            >
              <div className="flex flex-col gap-0.5 flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">{addon.name}</span>
                  {addon.unit && (
                    <Badge variant="secondary" className="text-xs">
                      {addon.unit}
                    </Badge>
                  )}
                </div>
                {addon.description && (
                  <p className="text-xs text-muted-foreground truncate">
                    {addon.description}
                  </p>
                )}
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className="text-sm font-medium">
                  £{addon.price.toFixed(2)}
                </span>
                {isSelected ? (
                  <div
                    className="flex items-center gap-1"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Button
                      variant="outline"
                      size="icon"
                      className="w-6 h-6"
                      onClick={() => updateQuantity(addon.id, -1)}
                    >
                      <Minus className="w-3 h-3" />
                    </Button>
                    <span className="text-sm w-6 text-center">
                      {selected.quantity}
                    </span>
                    <Button
                      variant="outline"
                      size="icon"
                      className="w-6 h-6"
                      onClick={() => updateQuantity(addon.id, 1)}
                    >
                      <Plus className="w-3 h-3" />
                    </Button>
                  </div>
                ) : (
                  <div className="w-6 h-6 rounded-full border flex items-center justify-center">
                    <Plus className="w-3 h-3 text-muted-foreground" />
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </CardContent>
    </Card>
  )
}
