'use client'

import { useRouter } from 'next/navigation'
import BookingStepper from '@/components/booking/BookingStepper'
import BookingSummary from '@/components/booking/BookingSummary'
import { useBooking } from '@/context/BookingContext'
import type { ServiceCategory, ServiceSubItem, ServiceCategoryOption } from '@/lib/types'
import { getServices } from '@/lib/api'
import { useEffect, useState } from 'react'

// ─── Default Icons ────────────────────────────────────────────────────────
const CATEGORY_ICONS: Record<string, string> = {
  'Clínica': 'clinical_notes',
  'Estética': 'auto_awesome',
  'Quirúrgica': 'medical_services',
}

const CATEGORIES: ServiceCategoryOption[] = [
  {
    id: 'CLINICA' as ServiceCategory,
    label: 'Clínica',
    description: 'Tratamientos médicos para patologías de la piel, pelo y uñas.',
    icon: 'clinical_notes',
    services: [
      { id: 'c1', name: 'Consulta Dermatológica General', description: '45 min • Primera consulta', price: 120, durationMin: 45 },
      { id: 'c2', name: 'Diagnóstico por Dermatoscopia', description: '60 min • Análisis digital avanzado', price: 180, durationMin: 60 },
      { id: 'c3', name: 'Tratamiento de Acné Clínico', description: '45 min • Protocolo anti-acné', price: 150, durationMin: 45 },
    ],
  },
  {
    id: 'ESTETICA' as ServiceCategory,
    label: 'Estética',
    description: 'Rejuvenecimiento y cuidado avanzado de la piel facial y corporal.',
    icon: 'auto_awesome',
    services: [
      { id: 'e1', name: 'Limpieza Facial Profunda con Hidratación', description: '60 min • Tecnología DERMQ Pure', price: 85, durationMin: 60 },
      { id: 'e2', name: 'Peeling Químico Revitalizante', description: '45 min • Renovación celular completa', price: 120, durationMin: 45 },
      { id: 'e3', name: 'Terapia de Luz LED (Skin Glow)', description: '30 min • Protocolo anti-inflamatorio', price: 65, durationMin: 30 },
    ],
  },
  {
    id: 'QUIRURGICA' as ServiceCategory,
    label: 'Quirúrgica',
    description: 'Procedimientos menores y cirugía dermatológica especializada.',
    icon: 'medical_services',
    services: [
      { id: 'q1', name: 'Extirpación de Lesiones Benignas', description: '30–60 min • Cirugía menor', price: 350, durationMin: 45 },
      { id: 'q2', name: 'Criocirugía', description: '20 min • Tratamiento por frío', price: 220, durationMin: 20 },
    ],
  },
]

export default function ReservarPaso1() {
  const router = useRouter()
  const { booking, setCategory, setService } = useBooking()

  const [categories, setCategories] = useState<ServiceCategoryOption[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadServices() {
      try {
        setIsLoading(true)
        const response = await getServices()
        const fetchedServices = response.data

        // Group by category
        const categoryMap = new Map<string, ServiceCategoryOption>()
        
        for (const svc of fetchedServices) {
          const cat = svc.category
          if (!cat) continue

          const catId = cat.id as ServiceCategory
          if (!categoryMap.has(catId)) {
            categoryMap.set(catId, {
              id: catId,
              label: cat.name,
              description: cat.description || `Tratamientos de ${cat.name}`,
              icon: CATEGORY_ICONS[cat.name] || 'spa',
              services: [],
            })
          }
          
          categoryMap.get(catId)!.services.push({
            id: svc.id,
            name: svc.name,
            description: svc.description || '',
            price: svc.price,
            durationMin: svc.durationMin,
          })
        }

        setCategories(Array.from(categoryMap.values()))
      } catch (err: any) {
        setError(err.message || 'Error cargando los servicios')
      } finally {
        setIsLoading(false)
      }
    }

    loadServices()
  }, [])

  // Derived state
  const activeCategory = categories.find(c => c.id === booking.selectedCategory) ?? categories[0]
  const activeServices = activeCategory?.services || []



  const handleCategorySelect = (cat: typeof CATEGORIES[0]) => {
    setCategory(cat.id)
  }

  const handleServiceSelect = (svc: ServiceSubItem) => {
    setService(svc)
  }

  const handleNext = () => {
    if (booking.selectedService) {
      router.push('/reservar/especialista')
    }
  }

  return (
    <main className="pt-24 md:pt-40 pb-24 relative overflow-hidden bg-surface-container-lowest min-h-screen">
      {/* Ambient blurs */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[150px] pointer-events-none soft-float" />
      <div className="absolute bottom-10 left-10 w-[400px] h-[400px] bg-secondary-fixed/20 rounded-full blur-[100px] pointer-events-none soft-float-delayed" />

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10 w-full text-reveal">
        {/* Header */}
        <header className="mb-16 text-center md:text-left max-w-3xl">
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-widest mb-6">
            Concierge Dermatológico
          </span>
          <h1 className="font-headline font-black text-4xl sm:text-5xl md:text-6xl lg:text-7xl tracking-tighter text-[#1a1c1e] mb-6 leading-tight">
            Agenda tu{' '}
            <span className="italic text-primary">Experiencia.</span>
          </h1>
          <p className="font-medium text-on-surface-variant text-xl leading-relaxed">
            Personaliza tu tratamiento dermatológico en cuatro sencillos pasos. Claridad y
            precisión en cada etapa.
          </p>
        </header>

        <BookingStepper currentStep={1} />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          {/* Left Column */}
          <section className="lg:col-span-8 space-y-12">
            
            {isLoading ? (
              <div className="flex flex-col items-center justify-center p-20 space-y-6">
                <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
                <p className="text-on-surface-variant font-medium">Cargando catálogo de servicios disponibles...</p>
              </div>
            ) : error ? (
              <div className="bg-red-50 text-red-600 p-8 rounded-3xl border border-red-100 flex flex-col items-center">
                <span className="material-symbols-outlined text-4xl mb-4">error</span>
                <p className="font-bold">{error}</p>
                <p className="text-sm mt-2 opacity-80">(Por favor asegúrate de inicializar la Base de Datos con el Seed)</p>
              </div>
            ) : categories.length === 0 ? (
              <div className="bg-slate-50 text-slate-500 p-8 rounded-3xl border border-slate-100 flex flex-col items-center">
                <span className="material-symbols-outlined text-4xl mb-4">inbox</span>
                <p className="font-bold">No hay servicios disponibles en este momento.</p>
              </div>
            ) : (
              <>
                {/* Category Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {categories.map(cat => {
                    const isSelected = activeCategory?.id === cat.id
                    return (
                      <button
                        key={cat.id}
                        onClick={() => handleCategorySelect(cat)}
                        className={`text-left h-full rounded-3xl bg-white p-8 transition-all duration-300 border-2 hover:shadow-xl card-lift ${
                          isSelected
                            ? 'border-primary bg-[#f2fcfc] shadow-md'
                            : 'border-slate-100 hover:border-slate-200'
                        }`}
                      >
                        <div
                          className={`mb-6 h-12 w-12 rounded-full flex items-center justify-center transition-colors ${
                            isSelected ? 'bg-primary text-white' : 'bg-slate-100 text-slate-500'
                          }`}
                        >
                          <span className="material-symbols-outlined">{cat.icon}</span>
                        </div>
                        <h3 className="font-headline font-bold text-2xl mb-3 text-[#1a1c1e]">
                          {cat.label}
                        </h3>
                        <p className="text-sm font-medium text-on-surface-variant mb-6 leading-relaxed">
                          {cat.description}
                        </p>
                        <div
                          className={`flex items-center gap-2 font-bold text-[10px] uppercase tracking-widest transition-colors ${
                            isSelected ? 'text-primary' : 'text-slate-400'
                          }`}
                        >
                          {isSelected ? 'Seleccionado' : 'Selección'}
                          <span className="material-symbols-outlined text-sm">
                            {isSelected ? 'check_circle' : 'arrow_forward'}
                          </span>
                        </div>
                      </button>
                    )
                  })}
                </div>

                {/* Service List */}
                {activeCategory && (
                  <div className="bg-white border border-slate-100 rounded-4xl p-10 shadow-sm">
                    <h4 className="font-headline font-extrabold text-2xl mb-8 text-[#1a1c1e] tracking-tight">
                      Tratamientos de {activeCategory?.label} Disponibles
                    </h4>
                    <div className="space-y-4">
                      {activeServices.map(svc => {
                        const isSelected = booking.selectedService?.id === svc.id
                        return (
                          <button
                            key={svc.id}
                            onClick={() => handleServiceSelect(svc)}
                            className={`w-full text-left flex flex-col sm:flex-row items-start sm:items-center sm:justify-between gap-3 p-5 md:p-6 rounded-2xl border-2 transition-all ${
                              isSelected
                                ? 'border-primary bg-[#f2fcfc]'
                                : 'border-transparent bg-slate-50 hover:border-primary/30'
                            }`}
                          >
                            <div className="flex items-center gap-5">
                              <div
                                className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                                  isSelected ? 'border-primary' : 'border-slate-300'
                                }`}
                              >
                                {isSelected && (
                                  <div className="w-3 h-3 rounded-full bg-primary" />
                                )}
                              </div>
                              <div>
                                <span className="block font-bold text-lg text-[#1a1c1e] mb-1">
                                  {svc.name}
                                </span>
                                <span className="text-sm font-medium text-on-surface-variant">
                                  {svc.description}
                                </span>
                              </div>
                            </div>
                            <span
                              className={`font-headline font-black text-xl whitespace-nowrap ml-6 ${
                                isSelected ? 'text-primary' : 'text-slate-800'
                              }`}
                            >
                              S/ {svc.price.toFixed(2)}
                            </span>
                          </button>
                        )
                      })}
                    </div>
                  </div>
                )}

                {/* Navigation */}
                <div className="flex justify-between items-center pt-8">
                  <button className="text-slate-400 font-bold hover:text-[#1a1c1e] transition-colors px-4 py-2">
                    Cancelar
                  </button>
                  <button
                    onClick={handleNext}
                    disabled={!booking.selectedService}
                    className="luminous-gradient text-white px-10 py-5 rounded-full font-bold text-lg shadow-[0_15px_30px_rgba(2,105,106,0.25)] hover:scale-[1.02] active:scale-95 transition-all flex items-center gap-3 glow-on-hover disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100"
                  >
                    Siguiente: Especialista
                    <span className="material-symbols-outlined font-bold">arrow_forward</span>
                  </button>
                </div>
              </>
            )}
          </section>

          <BookingSummary />
        </div>
      </div>
    </main>
  )
}
