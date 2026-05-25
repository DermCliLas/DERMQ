'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import BookingStepper from '@/components/booking/BookingStepper'
import BookingSummary from '@/components/booking/BookingSummary'
import { useBooking } from '@/context/BookingContext'
import type { Doctor } from '@/lib/types'
import { getDoctors } from '@/lib/api'

export default function ReservarPaso2() {
  const router = useRouter()
  const { booking, setDoctor } = useBooking()
  const [doctors, setDoctors] = useState<Doctor[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchDoctors() {
      try {
        setLoading(true)
        const response = await getDoctors()
        // API returns an object with a data array typically for /users/doctors, or just an array directly depending on your NextJS setup. let's assume it's direct array or { data: [] }
        const docs = Array.isArray(response) ? response : (response as any).data || []
        setDoctors(docs)
      } catch (err: any) {
        setError(err.message || 'Error al cargar especialistas')
      } finally {
        setLoading(false)
      }
    }
    fetchDoctors()
  }, [])

  const handleSelect = (doctor: Doctor) => {
    setDoctor(doctor)
  }

  const handleNext = () => {
    if (booking.selectedDoctor) {
      router.push('/reservar/horario')
    }
  }

  const handleBack = () => router.push('/reservar')

  return (
    <main className="pt-40 pb-24 relative overflow-hidden bg-surface-container-lowest min-h-screen">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[150px] pointer-events-none soft-float" />
      <div className="absolute bottom-10 left-10 w-[400px] h-[400px] bg-secondary-fixed/20 rounded-full blur-[100px] pointer-events-none soft-float-delayed" />

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10 w-full text-reveal">
        <header className="mb-16 max-w-3xl">
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-widest mb-6">
            Paso 2 de 4
          </span>
          <h1 className="font-headline font-black text-5xl md:text-6xl tracking-tighter text-[#1a1c1e] mb-4 leading-tight">
            Elige tu{' '}
            <span className="italic text-primary">Especialista.</span>
          </h1>
          <p className="font-medium text-on-surface-variant text-xl leading-relaxed">
            Todos nuestros especialistas están certificados y en constante actualización.
          </p>
        </header>

        <BookingStepper currentStep={2} />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          <section className="lg:col-span-8 space-y-6">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-20 text-slate-400">
                <span className="w-10 h-10 border-4 border-slate-100 border-t-primary rounded-full animate-spin mb-4" />
                <p className="font-semibold text-lg">Cargando especialistas...</p>
              </div>
            ) : error ? (
              <div className="bg-red-50 text-red-600 p-8 rounded-3xl border border-red-100 flex flex-col items-center justify-center text-center">
                <span className="material-symbols-outlined text-4xl mb-3">error</span>
                <p className="font-bold text-lg mb-1">¡Ups! Algo salió mal.</p>
                <p className="text-sm opacity-80">{error}</p>
                <button 
                  onClick={() => window.location.reload()}
                  className="mt-4 px-6 py-2 bg-red-600 text-white rounded-full font-bold text-sm hover:bg-red-700 transition"
                >
                  Intentar de nuevo
                </button>
              </div>
            ) : doctors.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-slate-400 text-center">
                <span className="material-symbols-outlined text-5xl mb-4">search_off</span>
                <p className="font-semibold text-xl mb-1">No hay especialistas disponibles</p>
                <p className="max-w-md mx-auto text-sm">Pronto abriremos nuestra agenda con nuevos expertos.</p>
              </div>
            ) : (
              doctors.map(doctor => {
                const isSelected = booking.selectedDoctor?.id === doctor.id
                return (
                  <button
                    key={doctor.id}
                    onClick={() => handleSelect(doctor)}
                    className={`w-full text-left rounded-3xl p-8 border-2 transition-all duration-300 flex gap-8 items-center ${
                      isSelected
                        ? 'border-primary bg-[#f2fcfc] shadow-md'
                        : 'border-slate-100 bg-white hover:border-slate-200 hover:shadow-lg'
                    } card-lift-sm`}
                  >
                    <div className="relative w-24 h-24 rounded-2xl overflow-hidden shrink-0 bg-slate-100 flex items-center justify-center">
                      {doctor.avatarUrl ? (
                        <Image
                          src={doctor.avatarUrl}
                          alt={`Dr. ${doctor.firstName} ${doctor.lastName}`}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <span className="material-symbols-outlined text-4xl text-slate-400">person</span>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h3 className="font-headline font-bold text-2xl text-[#1a1c1e]">
                            Dr. {doctor.firstName} {doctor.lastName}
                          </h3>
                          <p className="text-primary font-semibold text-sm mt-1">
                            {doctor.specialty || 'Dermatología'}
                          </p>
                        </div>
                        <div className="flex items-center gap-1 shrink-0">
                          <span className="material-symbols-filled text-yellow-400 text-lg">star</span>
                          <span className="font-bold text-[#1a1c1e]">{doctor.rating || '5.0'}</span>
                          <span className="text-slate-400 text-sm">({doctor.reviewCount || '10+'})</span>
                        </div>
                      </div>
                      <p className="text-on-surface-variant text-sm mt-3 leading-relaxed">{doctor.bio || 'Especialista en constante actualización.'}</p>
                      <div className="mt-4 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-400" />
                        <span className="text-xs font-semibold text-emerald-700">Disponible esta semana</span>
                      </div>
                    </div>
                    <div
                      className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 ${
                        isSelected ? 'border-primary' : 'border-slate-300'
                      }`}
                    >
                      {isSelected && <div className="w-3 h-3 rounded-full bg-primary" />}
                    </div>
                  </button>
                )
              })
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
                disabled={!booking.selectedDoctor}
                className="luminous-gradient text-white px-10 py-5 rounded-full font-bold text-lg shadow-[0_15px_30px_rgba(2,105,106,0.25)] hover:scale-[1.02] active:scale-95 transition-all flex items-center gap-3 glow-on-hover disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                Siguiente: Horario
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
