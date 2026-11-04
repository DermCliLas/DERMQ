'use client'

import React, { useState, useRef, MouseEvent, TouchEvent, useCallback } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import TiltCard3D from '@/components/ui/TiltCard3D'
import MagneticButton from '@/components/ui/MagneticButton'

interface CaseStudy {
  id: string
  title: string
  treatment: string
  technology: string
  sessions: string
  downtime: string
  stats: { label: string; value: string }[]
  beforeImage: string
  afterImage: string
  description: string
}

const CLINICAL_CASES: CaseStudy[] = [
  {
    id: 'laser-pigmentos',
    title: 'Tratamiento de Melasma & Daño Solar',
    treatment: 'Protocolo Láser Fraccionado Quanta',
    technology: 'Láser Nd:YAG Q-Switched & Fotona StarWalker',
    sessions: '3 Sesiones',
    downtime: 'Mínimo (24 a 48h)',
    stats: [
      { label: 'Aclaramiento de máculas', value: '88%' },
      { label: 'Uniformidad del tono', value: '94%' },
      { label: 'Colágeno estimulado', value: '100%' },
    ],
    // High-resolution dermatological clinical imagery
    beforeImage: 'https://images.unsplash.com/photo-1512290900672-1f41d9129598?auto=format&fit=crop&w=1200&q=80',
    afterImage: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=1200&q=80',
    description:
      'Atenuación focalizada de pigmentaciones profundas sin alterar el tejido circundante. Regeneración de la matriz extracelular dérmica guiada por la Dra. Marcela Leyva.',
  },
  {
    id: 'rejuvenecimiento-facial',
    title: 'Textura Cutánea & Cicatrices de Acné',
    treatment: 'Resurfacing Láser No Ablativo',
    technology: 'Láser Erbio Fraccional de 4ta Generación',
    sessions: '2 Sesiones',
    downtime: 'Sin tiempo de reposo',
    stats: [
      { label: 'Cierre de poros visibles', value: '82%' },
      { label: 'Tersura y firmeza', value: '91%' },
      { label: 'Eficacia comprobada', value: '96%' },
    ],
    beforeImage: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=1200&q=80',
    afterImage: 'https://images.unsplash.com/photo-1509967419530-da38b4704bc6?auto=format&fit=crop&w=1200&q=80',
    description:
      'Reestructuración dermo-epidérmica para suavizar depresiones residuales de acné y líneas de expresión, restaurando la reflectividad natural de la luz en la piel.',
  },
]

export default function ClinicalBeforeAfterInteractive() {
  const [selectedCaseIndex, setSelectedCaseIndex] = useState(0)
  const [sliderPosition, setSliderPosition] = useState(50) // percentage 0 - 100
  const [isDragging, setIsDragging] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const activeCase = CLINICAL_CASES[selectedCaseIndex]

  const updatePosition = useCallback((clientX: number) => {
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    const pos = ((clientX - rect.left) / rect.width) * 100
    setSliderPosition(Math.max(5, Math.min(95, pos)))
  }, [])

  const handleMouseDown = () => setIsDragging(true)
  const handleMouseUp = () => setIsDragging(false)

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!isDragging) return
    updatePosition(e.clientX)
  }

  const handleTouchMove = (e: TouchEvent<HTMLDivElement>) => {
    if (e.touches[0]) {
      updatePosition(e.touches[0].clientX)
    }
  }

  return (
    <section className="py-28 bg-[#013536] text-white relative overflow-hidden">
      {/* Background radial atmosphere */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#02696a]/25 rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-tertiary/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-[1400px] mx-auto px-6 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-tertiary font-headline font-bold tracking-[0.35em] uppercase text-xs inline-block mb-4 px-4 py-1.5 border border-tertiary/30 rounded-full bg-tertiary/5">
            Ciencia & Transformación Real
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-6xl font-headline font-black tracking-tight text-white mb-6">
            Evidencia Clínica <br />
            <span className="italic font-serif font-light text-tertiary">
              en Cada Sesión
            </span>
          </h2>
          <p className="text-base md:text-lg text-white/70 font-serif italic leading-relaxed">
            Compara la evolución clínica antes y después de nuestros protocolos láser de alta precisión. Desliza la barra para observar los cambios tisulares a nivel epidérmico.
          </p>

          {/* Case selector tabs */}
          <div className="flex flex-wrap items-center justify-center gap-3 mt-8">
            {CLINICAL_CASES.map((item, idx) => (
              <button
                key={item.id}
                onClick={() => {
                  setSelectedCaseIndex(idx)
                  setSliderPosition(50)
                }}
                className={`px-5 py-2.5 rounded-full text-xs font-headline font-bold uppercase tracking-wider transition-all duration-300 ${
                  selectedCaseIndex === idx
                    ? 'bg-tertiary text-[#014d4e] shadow-[0_0_20px_rgba(114,193,193,0.4)] scale-105'
                    : 'bg-white/5 text-white/70 hover:bg-white/10 hover:text-white border border-white/10'
                }`}
              >
                {item.title}
              </button>
            ))}
          </div>
        </div>

        {/* Interactive Comparison Split Area */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          {/* Left: Interactive 3D Comparison Frame */}
          <div className="lg:col-span-7">
            <TiltCard3D maxTilt={4} spotlightColor="rgba(240, 161, 126, 0.2)">
              <div
                ref={containerRef}
                onMouseDown={handleMouseDown}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                onMouseMove={handleMouseMove}
                onTouchMove={handleTouchMove}
                className="relative h-[380px] sm:h-[480px] md:h-[540px] w-full rounded-3xl overflow-hidden shadow-2xl border border-white/20 select-none cursor-ew-resize group"
              >
                {/* AFTER IMAGE (Background / Full) */}
                <Image
                  src={activeCase.afterImage}
                  alt={`${activeCase.title} - Después`}
                  fill
                  sizes="(max-width: 1024px) 100vw, 60vw"
                  className="object-cover"
                  priority
                />

                {/* AFTER BADGE */}
                <div className="absolute top-6 right-6 z-10 px-4 py-1.5 rounded-full bg-emerald-950/80 backdrop-blur-md border border-emerald-400/40 text-emerald-300 font-headline font-bold text-xs uppercase tracking-widest shadow-lg flex items-center gap-1.5 pointer-events-none">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  Después (Protocolo DERMQ)
                </div>

                {/* BEFORE IMAGE (Clipped / Foreground) */}
                <div
                  className="absolute inset-0 overflow-hidden"
                  style={{ width: `${sliderPosition}%` }}
                >
                  <div className="relative h-full w-[100vw] max-w-[1400px]">
                    <Image
                      src={activeCase.beforeImage}
                      alt={`${activeCase.title} - Antes`}
                      fill
                      sizes="(max-width: 1024px) 100vw, 60vw"
                      className="object-cover"
                      priority
                    />
                  </div>

                  {/* BEFORE BADGE */}
                  <div className="absolute top-6 left-6 z-10 px-4 py-1.5 rounded-full bg-black/80 backdrop-blur-md border border-white/30 text-white/90 font-headline font-bold text-xs uppercase tracking-widest shadow-lg pointer-events-none">
                    Antes de Tratamiento
                  </div>
                </div>

                {/* SLIDER DIVIDER LINE & LASER HANDLE */}
                <div
                  className="absolute top-0 bottom-0 w-[3px] bg-gradient-to-b from-transparent via-tertiary to-transparent shadow-[0_0_15px_#72c1c1] pointer-events-none"
                  style={{ left: `${sliderPosition}%` }}
                >
                  {/* Glowing Tactile Circular Handle */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-[#014d4e] border-2 border-tertiary shadow-[0_0_20px_rgba(114,193,193,0.8)] flex items-center justify-center text-tertiary transform group-hover:scale-110 transition-transform">
                    <span className="material-symbols-outlined text-lg select-none">
                      drag_indicator
                    </span>
                  </div>
                </div>

                {/* Instructional hint at bottom */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 px-4 py-1 rounded-full bg-black/60 backdrop-blur-sm text-[11px] text-white/70 font-medium tracking-wider pointer-events-none">
                  ↔ Desliza para contrastar los resultados
                </div>
              </div>
            </TiltCard3D>
          </div>

          {/* Right: Clinical Details & Metrics */}
          <div className="lg:col-span-5 space-y-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeCase.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.4 }}
                className="space-y-6"
              >
                <div>
                  <span className="text-xs uppercase font-headline font-bold tracking-[0.25em] text-tertiary block mb-2">
                    {activeCase.technology}
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-headline font-black text-white leading-tight">
                    {activeCase.treatment}
                  </h3>
                </div>

                <p className="text-sm md:text-base text-white/80 font-serif italic leading-relaxed">
                  {activeCase.description}
                </p>

                {/* Protocol Info Pills */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
                    <span className="text-[10px] uppercase font-bold text-white/50 tracking-wider block mb-1">
                      Sesiones estimadas
                    </span>
                    <strong className="text-tertiary font-headline text-lg">
                      {activeCase.sessions}
                    </strong>
                  </div>
                  <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
                    <span className="text-[10px] uppercase font-bold text-white/50 tracking-wider block mb-1">
                      Tiempo de recuperación
                    </span>
                    <strong className="text-tertiary font-headline text-lg">
                      {activeCase.downtime}
                    </strong>
                  </div>
                </div>

                {/* Quantitative Clinical Stats */}
                <div className="space-y-3 pt-2">
                  {activeCase.stats.map((stat, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-3.5 rounded-xl bg-gradient-to-r from-white/5 to-transparent border-l-2 border-tertiary"
                    >
                      <span className="text-xs md:text-sm text-white/85 font-medium">
                        {stat.label}
                      </span>
                      <span className="text-base md:text-lg font-headline font-black text-tertiary">
                        {stat.value}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Call To Action */}
                <div className="pt-4 flex flex-col sm:flex-row gap-4">
                  <MagneticButton>
                    <Link
                      href="/reservar"
                      className="px-8 py-4 rounded-full bg-gradient-to-r from-tertiary to-[#F0A17E] text-[#014d4e] font-headline font-bold text-sm uppercase tracking-widest hover:shadow-[0_0_30px_rgba(114,193,193,0.5)] transition-all flex items-center justify-center gap-2"
                    >
                      <span className="material-symbols-outlined text-base">
                        calendar_month
                      </span>
                      Evaluación con la Especialista
                    </Link>
                  </MagneticButton>
                  <Link
                    href="/servicios#laser-avanzado"
                    className="px-6 py-4 rounded-full border border-white/20 text-white/80 hover:text-white hover:border-white/50 text-xs font-headline font-bold uppercase tracking-wider transition-colors flex items-center justify-center"
                  >
                    Ver Tecnología Láser
                  </Link>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  )
}
