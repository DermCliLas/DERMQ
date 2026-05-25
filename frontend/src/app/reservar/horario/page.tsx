'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import BookingStepper from '@/components/booking/BookingStepper'
import BookingSummary from '@/components/booking/BookingSummary'
import { useBooking } from '@/context/BookingContext'
import type { TimeSlot } from '@/lib/types'
import { getAvailableSlots } from '@/lib/api'

// ─── Mock calendar data ───────────────────────────────────────────────────────

function getNextDays(count: number): { date: string; label: string; dayName: string }[] {
  const result = []
  const now = new Date()
  const days = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb']
  const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic']
  for (let i = 1; i <= count; i++) {
    const d = new Date(now)
    d.setDate(now.getDate() + i)
    if (d.getDay() !== 0) {
      // Skip Sundays
      result.push({
        date: d.toISOString().split('T')[0],
        label: `${d.getDate()} ${months[d.getMonth()]}`,
        dayName: days[d.getDay()],
      })
    }
  }
  return result.slice(0, 9) // Show 9 days
}

export default function ReservarPaso3() {
  const router = useRouter()
  const { booking, setDate, setTimeSlot } = useBooking()
  const [localDate, setLocalDate] = useState<string>(booking.selectedDate ?? '')
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const days = getNextDays(14)

  useEffect(() => {
    async function fetchSlots() {
      if (!localDate || !booking.selectedDoctor) return
      
      try {
        setLoading(true)
        setError(null)
        const response = await getAvailableSlots(booking.selectedDoctor.id, localDate)
        const rawSlots = response.slots || []
        
        const mappedSlots = rawSlots.map((s: any, idx: number) => {
          const dateObj = new Date(s.time)
          const timeString = dateObj.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })
          // Check if selected service is among available services for this slot
          const serviceId = booking.selectedService?.id
          const isServiceAvailable = s.availableServices.some((availSvc: any) => availSvc.serviceId === serviceId)
          
          return {
            id: `slot-${idx}`,
            time: timeString,
            rawTime: s.time,
            available: isServiceAvailable
          }
        })

        setTimeSlots(mappedSlots)
      } catch (err: any) {
        setError(err.message || 'Error al cargar horarios')
        setTimeSlots([])
      } finally {
        setLoading(false)
      }
    }

    fetchSlots()
  }, [localDate, booking.selectedDoctor])

  const handleDateSelect = (date: string) => {
    setLocalDate(date)
    setDate(date)
    // clear old slot selection
  }

  const handleSlotSelect = (slot: TimeSlot) => {
    if (slot.available) setTimeSlot(slot)
  }

  const handleNext = () => {
    if (booking.selectedDate && booking.selectedTimeSlot) {
      router.push('/reservar/confirmar')
    }
  }

  const handleBack = () => router.push('/reservar/especialista')

  return (
    <main className="pt-40 pb-24 relative overflow-hidden bg-surface-container-lowest min-h-screen">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[150px] pointer-events-none soft-float" />
      <div className="absolute bottom-10 left-10 w-[400px] h-[400px] bg-secondary-fixed/20 rounded-full blur-[100px] pointer-events-none soft-float-delayed" />

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10 w-full text-reveal">
        <header className="mb-16 max-w-3xl">
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-widest mb-6">
            Paso 3 de 4
          </span>
          <h1 className="font-headline font-black text-5xl md:text-6xl tracking-tighter text-[#1a1c1e] mb-4 leading-tight">
            Elige tu{' '}
            <span className="italic text-primary">Horario.</span>
          </h1>
          <p className="font-medium text-on-surface-variant text-xl leading-relaxed">
            Selecciona la fecha y hora que mejor se adapte a tu agenda.
          </p>
        </header>

        <BookingStepper currentStep={3} />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          <section className="lg:col-span-8 space-y-10">
            {/* Date Selection */}
            <div className="bg-white rounded-4xl p-10 border border-slate-100 shadow-sm">
              <h4 className="font-headline font-extrabold text-2xl mb-6 text-[#1a1c1e]">
                Selecciona una Fecha
              </h4>
              <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
                {days.map(day => {
                  const isSelected = localDate === day.date
                  return (
                    <button
                      key={day.date}
                      onClick={() => handleDateSelect(day.date)}
                      className={`flex flex-col items-center py-4 px-3 rounded-2xl border-2 transition-all duration-200 ${
                        isSelected
                          ? 'border-primary bg-[#f2fcfc] text-primary'
                          : 'border-slate-100 bg-slate-50 hover:border-primary/30 text-slate-700'
                      }`}
                    >
                      <span className="text-[10px] font-bold uppercase tracking-wider opacity-70 mb-1">
                        {day.dayName}
                      </span>
                      <span className="font-headline font-extrabold text-lg">{day.label}</span>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Time Slots */}
            {localDate && (
              <div className="bg-white rounded-4xl p-10 border border-slate-100 shadow-sm">
                <h4 className="font-headline font-extrabold text-2xl mb-6 text-[#1a1c1e]">
                  Horarios Disponibles
                </h4>
                
                {loading ? (
                  <div className="flex flex-col items-center justify-center py-10 text-slate-400">
                    <span className="w-8 h-8 border-4 border-slate-100 border-t-primary rounded-full animate-spin mb-3" />
                    <p className="font-semibold text-sm">Buscando horarios...</p>
                  </div>
                ) : error ? (
                  <div className="bg-red-50 text-red-600 p-6 rounded-2xl border border-red-100 text-center">
                    <span className="material-symbols-outlined text-2xl mb-2">error</span>
                    <p className="text-sm font-semibold">{error}</p>
                  </div>
                ) : timeSlots.length === 0 ? (
                  <div className="text-center py-10 bg-slate-50 rounded-2xl border border-slate-100">
                    <span className="material-symbols-outlined text-4xl text-slate-300 mb-2">event_busy</span>
                    <p className="font-medium text-slate-500">No hay horarios disponibles en esta fecha.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {timeSlots.map(slot => {
                      const isSelected = booking.selectedTimeSlot?.id === slot.id
                      return (
                        <button
                          key={slot.id}
                          onClick={() => handleSlotSelect(slot)}
                          disabled={!slot.available}
                          className={`py-4 px-4 rounded-2xl font-bold text-sm border-2 transition-all duration-200 ${
                            !slot.available
                              ? 'border-slate-100 bg-slate-50 text-slate-300 cursor-not-allowed line-through'
                              : isSelected
                              ? 'border-primary bg-primary text-white shadow-glow'
                              : 'border-slate-100 bg-slate-50 hover:border-primary/50 text-slate-700'
                          }`}
                        >
                          {slot.time}
                          {!slot.available && (
                            <span className="block text-[10px] font-normal mt-0.5">Ocupado</span>
                          )}
                        </button>
                      )
                    })}
                  </div>
                )}
                
                <p className="text-xs text-slate-400 mt-6 font-medium">
                  * Cada cita incluye 10 min adicionales de preparación.
                </p>
              </div>
            )}

            <div className="flex justify-between items-center pt-8">
              <button
                onClick={handleBack}
                className="flex items-center gap-2 text-slate-500 font-bold hover:text-[#1a1c1e] transition-colors px-4 py-2"
              >
                <span className="material-symbols-outlined">arrow_back</span>
                Atrás
              </button>
              <button
                onClick={handleNext}
                disabled={!booking.selectedDate || !booking.selectedTimeSlot}
                className="luminous-gradient text-white px-10 py-5 rounded-full font-bold text-lg shadow-[0_15px_30px_rgba(2,105,106,0.25)] hover:scale-[1.02] active:scale-95 transition-all flex items-center gap-3 glow-on-hover disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                Siguiente: Confirmar
                <span className="material-symbols-outlined">arrow_forward</span>
              </button>
            </div>
          </section>

          <BookingSummary />
        </div>
      </div>
    </main>
  )
}
