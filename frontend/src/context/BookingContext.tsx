'use client'

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import type { BookingState, ServiceCategory, ServiceSubItem, Doctor, TimeSlot } from '@/lib/types'

// ─── Initial State ───────────────────────────────────────────────────────────

const INITIAL_STATE: BookingState = {
  selectedCategory: null,
  selectedService: null,
  selectedDoctor: null,
  selectedDate: null,
  selectedTimeSlot: null,
  patientNotes: '',
}

const SESSION_KEY = 'dermq_booking'

// ─── Context Types ───────────────────────────────────────────────────────────

interface BookingContextType {
  booking: BookingState
  setCategory: (category: ServiceCategory) => void
  setService: (service: ServiceSubItem) => void
  setDoctor: (doctor: Doctor) => void
  setDate: (date: string) => void
  setTimeSlot: (slot: TimeSlot) => void
  setNotes: (notes: string) => void
  resetBooking: () => void
  currentStep: number
}

// ─── Context ─────────────────────────────────────────────────────────────────

const BookingContext = createContext<BookingContextType | null>(null)

// ─── Helper: sessionStorage ───────────────────────────────────────────────────

function loadFromSession(): BookingState {
  if (typeof window === 'undefined') return INITIAL_STATE
  try {
    const stored = sessionStorage.getItem(SESSION_KEY)
    if (stored) return { ...INITIAL_STATE, ...JSON.parse(stored) }
  } catch {
    // Ignore parse errors
  }
  return INITIAL_STATE
}

function saveToSession(state: BookingState) {
  if (typeof window === 'undefined') return
  try {
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(state))
  } catch {
    // Ignore storage errors
  }
}

// ─── Provider ────────────────────────────────────────────────────────────────

export function BookingProvider({ children }: { children: React.ReactNode }) {
  const [booking, setBooking] = useState<BookingState>(INITIAL_STATE)
  const [hydrated, setHydrated] = useState(false)

  // Hydrate from sessionStorage on mount (client only)
  useEffect(() => {
    setBooking(loadFromSession())
    setHydrated(true)
  }, [])

  // Sync to sessionStorage on every change
  useEffect(() => {
    if (hydrated) {
      saveToSession(booking)
    }
  }, [booking, hydrated])

  const setCategory = useCallback((category: ServiceCategory) => {
    setBooking(prev => ({
      ...prev,
      selectedCategory: category,
      selectedService: null, // reset downstream
    }))
  }, [])

  const setService = useCallback((service: ServiceSubItem) => {
    setBooking(prev => ({ ...prev, selectedService: service }))
  }, [])

  const setDoctor = useCallback((doctor: Doctor) => {
    setBooking(prev => ({ ...prev, selectedDoctor: doctor }))
  }, [])

  const setDate = useCallback((date: string) => {
    setBooking(prev => ({ ...prev, selectedDate: date, selectedTimeSlot: null }))
  }, [])

  const setTimeSlot = useCallback((slot: TimeSlot) => {
    setBooking(prev => ({ ...prev, selectedTimeSlot: slot }))
  }, [])

  const setNotes = useCallback((notes: string) => {
    setBooking(prev => ({ ...prev, patientNotes: notes }))
  }, [])

  const resetBooking = useCallback(() => {
    setBooking(INITIAL_STATE)
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem(SESSION_KEY)
    }
  }, [])

  // Derived: which step is the user on (1–4)
  const currentStep = (() => {
    if (!booking.selectedService) return 1
    if (!booking.selectedDoctor) return 2
    if (!booking.selectedTimeSlot) return 3
    return 4
  })()

  return (
    <BookingContext.Provider
      value={{
        booking,
        setCategory,
        setService,
        setDoctor,
        setDate,
        setTimeSlot,
        setNotes,
        resetBooking,
        currentStep,
      }}
    >
      {children}
    </BookingContext.Provider>
  )
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useBooking(): BookingContextType {
  const ctx = useContext(BookingContext)
  if (!ctx) {
    throw new Error('useBooking must be used within a <BookingProvider>')
  }
  return ctx
}
