"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import type { StudioCollection } from "@/lib/types"

interface StudioOnlyBookingFormProps {
  studio: StudioCollection
  onSubmit: (data: any) => void
  onBack?: () => void
}

export function StudioOnlyBookingForm({ studio, onSubmit, onBack }: StudioOnlyBookingFormProps) {
  const [selectedCapabilities, setSelectedCapabilities] = useState<string[]>([])
  const [formData, setFormData] = useState({
    date: "",
    startTime: "",
    duration: 3,
    clientName: "",
    clientEmail: "",
    clientPhone: "",
    projectType: "",
    specialRequests: "",
    acceptedTerms: false,
    acceptedCancellationPolicy: false,
  })

  const handleCapabilityToggle = (capability: string) => {
    setSelectedCapabilities((prev) =>
      prev.includes(capability) ? prev.filter((c) => c !== capability) : [...prev, capability],
    )
  }

  const totalAmount = formData.duration === 3 ? studio.hourlyRate3h * 3 : studio.hourlyRate6h * 6
  const depositAmount = totalAmount * 0.5

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({
      studioId: studio.id,
      selectedCapabilities,
      ...formData,
      totalAmount,
      depositAmount,
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Book {studio.name}</CardTitle>
        <CardDescription>Studio-only booking without a creator</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Capabilities Selection */}
          <div className="space-y-3">
            <Label>Select Required Capabilities (Multi-select)</Label>
            <div className="grid grid-cols-2 gap-3">
              {studio.capabilities.map((capability) => (
                <div key={capability} className="flex items-center space-x-2">
                  <Checkbox
                    checked={selectedCapabilities.includes(capability)}
                    onCheckedChange={() => handleCapabilityToggle(capability)}
                  />
                  <label className="text-sm">{capability}</label>
                </div>
              ))}
            </div>
          </div>

          {/* Date, Time & Duration */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Date</Label>
              <Input
                type="date"
                required
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Start Time</Label>
              <Input
                type="time"
                required
                value={formData.startTime}
                onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Duration</Label>
            <select
              className="w-full p-2 border rounded-md"
              value={formData.duration}
              onChange={(e) => setFormData({ ...formData, duration: Number(e.target.value) })}
            >
              <option value={3}>3 hours - ${studio.hourlyRate3h * 3}</option>
              <option value={6}>6 hours (Full Day) - ${studio.hourlyRate6h * 6}</option>
            </select>
          </div>

          {/* Client Details */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Your Name</Label>
              <Input
                required
                value={formData.clientName}
                onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input
                type="email"
                required
                value={formData.clientEmail}
                onChange={(e) => setFormData({ ...formData, clientEmail: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Phone</Label>
              <Input
                type="tel"
                required
                value={formData.clientPhone}
                onChange={(e) => setFormData({ ...formData, clientPhone: e.target.value })}
              />
            </div>
          </div>

          {/* Project Details */}
          <div className="space-y-2">
            <Label>Project Type</Label>
            <Input
              required
              placeholder="e.g., Music Video, Product Photography, Podcast Recording"
              value={formData.projectType}
              onChange={(e) => setFormData({ ...formData, projectType: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label>Special Requests (Optional)</Label>
            <Textarea
              placeholder="Any special setup or equipment needs..."
              value={formData.specialRequests}
              onChange={(e) => setFormData({ ...formData, specialRequests: e.target.value })}
            />
          </div>

          {/* Payment Summary */}
          <div className="bg-secondary/30 p-4 rounded-lg space-y-2">
            <h3 className="font-semibold">Payment Summary</h3>
            <div className="flex justify-between text-sm">
              <span>Studio Rental ({formData.duration} hours)</span>
              <span>${totalAmount}</span>
            </div>
            <div className="flex justify-between font-bold text-lg border-t pt-2">
              <span>Total</span>
              <span>${totalAmount}</span>
            </div>
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>50% Deposit Due Now</span>
              <span>${depositAmount}</span>
            </div>
          </div>

          {/* Terms & Conditions */}
          <div className="space-y-3">
            <div className="flex items-start space-x-2">
              <Checkbox
                required
                checked={formData.acceptedTerms}
                onCheckedChange={(checked) => setFormData({ ...formData, acceptedTerms: checked as boolean })}
              />
              <label className="text-sm">
                I agree to the{" "}
                <a href="/terms/clients" className="text-primary underline">
                  Terms & Conditions
                </a>
              </label>
            </div>
            <div className="flex items-start space-x-2">
              <Checkbox
                required
                checked={formData.acceptedCancellationPolicy}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, acceptedCancellationPolicy: checked as boolean })
                }
              />
              <label className="text-sm">
                I understand the{" "}
                <a href="/policies" className="text-primary underline">
                  Cancellation Policy
                </a>
              </label>
            </div>
          </div>

          <div className="flex gap-3">
            {onBack && (
              <Button type="button" variant="outline" onClick={onBack} className="flex-1 bg-transparent">
                Back
              </Button>
            )}
            <Button type="submit" className="flex-1">
              Pay ${depositAmount} Deposit & Book
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
