"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import type { CreatorCollection, StudioCollection } from "@/lib/types"

interface CreatorBookingFormProps {
  creator: CreatorCollection
  studios?: StudioCollection[]
  onSubmit: (data: any) => void
  onBack?: () => void
}

export function CreatorBookingForm({ creator, studios = [], onSubmit, onBack }: CreatorBookingFormProps) {
  const [selectedServices, setSelectedServices] = useState<string[]>([])
  const [requiresStudio, setRequiresStudio] = useState(false)
  const [selectedStudioId, setSelectedStudioId] = useState<string>("")
  const [formData, setFormData] = useState({
    date: "",
    startTime: "",
    duration: 3,
    clientName: "",
    clientEmail: "",
    clientPhone: "",
    projectDescription: "",
    specialRequests: "",
    acceptedTerms: false,
    acceptedCancellationPolicy: false,
  })

  const handleServiceToggle = (service: string) => {
    setSelectedServices((prev) => (prev.includes(service) ? prev.filter((s) => s !== service) : [...prev, service]))
  }

  const calculateTotal = () => {
    const basePackage = creator.packages[0]
    const basePrice = basePackage ? basePackage.price : 300
    const studioCost = requiresStudio && selectedStudioId ? 150 : 0
    return basePrice + studioCost
  }

  const totalAmount = calculateTotal()
  const depositAmount = totalAmount * 0.5

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({
      creatorId: creator.id,
      selectedServices,
      requiresStudio,
      studioId: selectedStudioId,
      ...formData,
      totalAmount,
      depositAmount,
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Book {creator.name}</CardTitle>
        <CardDescription>Complete the form below to request a booking</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Services Selection */}
          <div className="space-y-3">
            <Label>Select Services (Multi-select)</Label>
            <div className="grid grid-cols-2 gap-3">
              {creator.services.map((service) => (
                <div key={service} className="flex items-center space-x-2">
                  <Checkbox
                    checked={selectedServices.includes(service)}
                    onCheckedChange={() => handleServiceToggle(service)}
                  />
                  <label className="text-sm">{service}</label>
                </div>
              ))}
            </div>
          </div>

          {/* Studio Selection */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Checkbox checked={requiresStudio} onCheckedChange={(checked) => setRequiresStudio(checked as boolean)} />
              <Label>I need a studio space</Label>
            </div>
            {requiresStudio && studios.length > 0 && (
              <select
                className="w-full p-2 border rounded-md"
                value={selectedStudioId}
                onChange={(e) => setSelectedStudioId(e.target.value)}
              >
                <option value="">Select a studio</option>
                {studios.map((studio) => (
                  <option key={studio.id} value={studio.id}>
                    {studio.name} - ${studio.hourlyRate3h}/3hrs
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Date & Time */}
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
              <option value={3}>3 hours</option>
              <option value={6}>6 hours (Full Day)</option>
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
            <Label>Project Description</Label>
            <Textarea
              required
              placeholder="Tell us about your project..."
              value={formData.projectDescription}
              onChange={(e) => setFormData({ ...formData, projectDescription: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label>Special Requests (Optional)</Label>
            <Textarea
              placeholder="Any special requirements or requests..."
              value={formData.specialRequests}
              onChange={(e) => setFormData({ ...formData, specialRequests: e.target.value })}
            />
          </div>

          {/* Payment Summary */}
          <div className="bg-secondary/30 p-4 rounded-lg space-y-2">
            <h3 className="font-semibold">Payment Summary</h3>
            <div className="flex justify-between text-sm">
              <span>Service Fee</span>
              <span>${totalAmount - (requiresStudio && selectedStudioId ? 150 : 0)}</span>
            </div>
            {requiresStudio && selectedStudioId && (
              <div className="flex justify-between text-sm">
                <span>Studio Rental</span>
                <span>$150</span>
              </div>
            )}
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
