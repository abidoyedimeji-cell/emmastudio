// Core data types for EMMA STUDIOS booking platform

export type BookingType = "appointment" | "session" | "event"
export type BookingStatus = "pending" | "confirmed" | "completed" | "cancelled"
export type UserRole = "client" | "creator" | "studio_admin" | "super_admin"

export interface User {
  id: string
  email: string
  name: string
  role: UserRole
  avatar?: string
  phone?: string
  createdAt: string
}

export interface Studio {
  id: string
  name: string
  slug: string
  description: string
  coverImage: string
  images: string[]
  location: {
    address: string
    city: string
    state: string
    zipCode: string
    coordinates?: { lat: number; lng: number }
  }
  amenities: string[]
  categories: string[]
  rating: number
  reviewCount: number
  createdAt: string
}

export interface Creator {
  id: string
  userId: string
  studioId: string
  bio: string
  specialties: string[]
  experience: string
  portfolio: string[]
  rating: number
  reviewCount: number
  isActive: boolean
}

export interface Package {
  id: string
  creatorId: string
  studioId: string
  name: string
  description: string
  bookingType: BookingType
  duration: number // in minutes
  price: number
  deposit?: number
  features: string[]
  maxCapacity?: number
  isActive: boolean
}

export interface Booking {
  id: string
  packageId: string
  clientId: string
  creatorId: string
  studioId: string
  startTime: string
  endTime: string
  status: BookingStatus
  totalPrice: number
  depositPaid: number
  notes?: string
  createdAt: string
  updatedAt: string
}

export interface Availability {
  id: string
  creatorId: string
  dayOfWeek: number // 0-6, Sunday = 0
  startTime: string // HH:MM format
  endTime: string // HH:MM format
  isActive: boolean
}

export interface BlockedDate {
  id: string
  creatorId: string
  date: string
  startTime?: string
  endTime?: string
  reason?: string
}

export interface Review {
  id: string
  bookingId: string
  clientId: string
  targetId: string // creator or studio id
  targetType: "creator" | "studio"
  rating: number
  comment: string
  createdAt: string
}

export interface StudioCollection {
  id: string
  name: string
  slug: string
  description: string
  type: "audio" | "visual" | "hybrid"
  coverImage: string
  images: string[]
  location: {
    address: string
    city: string
    state: string
    zipCode: string
    postcode: string
    coordinates?: { lat: number; lng: number }
  }
  // Multi-select capabilities
  capabilities: string[] // ["Photography", "Videography", "Green Screen", "Podcast Recording", etc.]
  amenities: string[]
  equipment: string[] // Included equipment
  size: string // "Small (< 500 sq ft)", "Medium (500-1000 sq ft)", "Large (> 1000 sq ft)"
  interiorType: string[] // ["Modern", "Industrial", "Classic", "Minimalist"]
  maxCapacity: number
  // Pricing
  hourlyRate3h: number // 3-hour minimum package
  hourlyRate6h: number // 6-hour full day package
  depositPercentage: number // Default 50%
  // Calendar & Availability
  availability: StudioAvailability[]
  blockedDates: BlockedDate[]
  // Terms & Conditions
  termsAndConditions: string
  cancellationPolicy: string
  // Metadata
  rating: number
  reviewCount: number
  featured: boolean
  verified: boolean
  createdAt: string
  updatedAt: string
}

export interface CreatorCollection {
  id: string
  userId: string
  name: string
  slug: string
  email: string
  phone: string
  avatar?: string
  bio: string
  shortBio: string // For card display
  // Multi-select services
  services: string[] // ["Photography", "Videography", "Editing", "Color Grading", etc.]
  specialties: string[] // ["Wedding", "Portrait", "Commercial", "Music Video", etc.]
  skills: string[] // ["Adobe Premiere", "DaVinci Resolve", "Lightroom", etc.]
  type: "photographer" | "videographer" | "audio_engineer" | "editor" | "multi_discipline"
  experience: string // "5+ years"
  // Portfolio
  portfolio: {
    url: string
    title: string
    description: string
    category: string
  }[]
  featuredWorks: {
    image: string
    projectTitle: string
    creatorName: string
  }[]
  // Package prices
  packages: CreatorPackage[]
  // Location & Availability
  location: {
    city: string
    state: string
    postcode: string
    willingToTravel: boolean
    travelRadius: number // in miles
  }
  availability: Availability[]
  blockedDates: BlockedDate[]
  // Terms & Conditions
  termsAndConditions: string
  cancellationPolicy: string
  // Ratings & Stats
  rating: number
  reviewCount: number
  completedBookings: number
  responseTime: string // "< 1 hour"
  featured: boolean
  topRated: boolean
  newCreator: boolean
  returningClientFavorite: boolean
  // Badge system for performance-based achievements
  badges?: {
    id: string
    name: string
    icon: string
    color: string
    earnedDate: string
  }[]
  // Metadata
  isActive: boolean
  verifiedIdentity: boolean
  backgroundChecked: boolean
  createdAt: string
  updatedAt: string
}

export interface CreatorPackage {
  id: string
  name: string
  description: string
  duration: number // in hours
  price: number
  depositPercentage: number // Default 50%
  deliverables: string[]
  addOns: {
    name: string
    price: number
    description: string
  }[]
  isActive: boolean
}

export interface StudioAvailability {
  dayOfWeek: number // 0-6
  startTime: string
  endTime: string
  isAvailable: boolean
}

export interface CreatorBookingForm {
  creatorId: string
  clientId: string
  // Multi-select services
  selectedServices: string[]
  packageId?: string
  // Optional studio
  requiresStudio: boolean
  studioId?: string
  // Date & Time
  date: string
  startTime: string
  duration: number // in hours
  // Client details
  clientName: string
  clientEmail: string
  clientPhone: string
  // Notes
  specialRequests: string
  projectDescription: string
  // Payment
  totalAmount: number
  depositAmount: number // 50% of total
  depositPaid: boolean
  // Terms
  acceptedTerms: boolean
  acceptedCancellationPolicy: boolean
  // Metadata
  status: BookingStatus
  createdAt: string
}

export interface StudioOnlyBookingForm {
  studioId: string
  clientId: string
  // Multi-select capabilities needed
  selectedCapabilities: string[]
  // Date & Time
  date: string
  startTime: string
  duration: number // 3h or 6h
  // Client details
  clientName: string
  clientEmail: string
  clientPhone: string
  // Notes
  specialRequests: string
  projectType: string
  // Payment
  totalAmount: number
  depositAmount: number // 50% of total
  depositPaid: boolean
  // Terms
  acceptedTerms: boolean
  acceptedCancellationPolicy: boolean
  // Metadata
  status: BookingStatus
  createdAt: string
}

export type EmailType =
  | "booking_submitted"
  | "deposit_received"
  | "pre_booking_meeting"
  | "booking_confirmed"
  | "reminder_24h"
  | "reminder_48h"
  | "final_payment_reminder"
  | "post_service_followup"
  | "creator_pending_confirmation"
  | "creator_booking_confirmed"
  | "creator_reminder"
  | "creator_cancellation"
  | "studio_new_booking"
  | "studio_booking_confirmed"
  | "studio_reminder"
  | "studio_cancellation"
  | "schedule_change"
  | "replacement_creator"

export interface EmailTemplate {
  id: string
  type: EmailType
  recipientType: "client" | "creator" | "studio"
  subject: string
  htmlContent: string
  textContent: string
  variables: string[] // Template variables like {{clientName}}, {{bookingDate}}
  isActive: boolean
}

export interface EmailLog {
  id: string
  bookingId: string
  templateId: string
  recipientEmail: string
  recipientType: "client" | "creator" | "studio"
  subject: string
  sentAt: string
  status: "sent" | "failed" | "bounced"
  errorMessage?: string
}
