// Shared TypeScript types for the DERMQ frontend

export type ServiceCategory = string // Categoria UUID del backend

export interface ServiceSubItem {
  id: string
  name: string
  description: string
  price: number
  durationMin: number
}

export interface ServiceCategoryOption {
  id: ServiceCategory
  label: string
  description: string
  icon: string
  services: ServiceSubItem[]
}

export interface Doctor {
  id: string
  firstName: string
  lastName: string
  specialty: string
  bio?: string
  avatarUrl?: string
  rating?: number
  reviewCount?: number
}

export interface TimeSlot {
  id: string
  time: string
  available: boolean
}

export interface BookingState {
  selectedCategory: ServiceCategory | null
  selectedService: ServiceSubItem | null
  selectedDoctor: Doctor | null
  selectedDate: string | null
  selectedTimeSlot: TimeSlot | null
  patientNotes: string
}

export interface NavLink {
  label: string
  href: string
}

export interface ProductItem {
  id: string
  name: string
  description: string
  price: number
  imageUrl: string
  badge?: string
  category?: string
}

export interface Testimonial {
  id: string
  quote: string
  author: string
  role: string
  avatarUrl?: string
}
