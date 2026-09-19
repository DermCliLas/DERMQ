'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { getSiteContent } from '@/lib/api'
import { motion } from 'framer-motion'
import { DRA_LEYVA_PHOTOS } from '@/data/draleyva-photos'

const DEFAULTS = {
  title: 'Cuatro razones para confiar tu piel a DERMQ',
  subtitle: 'Fusionamos el rigor de la ciencia médica con la tecnología láser de cuarta generación para brindar a tu piel el cuidado de nivel clínico que merece.',
}

const REASONS = [
  {
    id: 'conocimiento-medico',
    title: 'Conocimiento Médico',
    description: 'Liderados por la Dra. Marcela Leyva, especialista formada en la UNMSM (Hosp. Daniel Alcides Carrión), con credenciales Harvard Medical School HMX y 19 años de ejercicio continuo.',
    imageUrl: DRA_LEYVA_PHOTOS.directoraDeskWorking,
    link: '/nosotros',
  },
  {
    id: 'tecnologia-especializada',
    title: 'Tecnología Especializada',
    description: 'Equipos láser y tecnología avanzada incorporados desde 2012, guiados en todo momento por criterio clínico, capacitación constante y sentido médico.',
    imageUrl: DRA_LEYVA_PHOTOS.laserFotona,
    link: '/servicios#laser-avanzado',
  },
  {
    id: 'seguridad-cientifica',
    title: 'Seguridad y Respaldo',
    description: 'Medicina basada en evidencia. Empleamos exclusivamente técnicas, medicamentos y sustancias con eficacia y seguridad clínicamente demostradas.',
    imageUrl: DRA_LEYVA_PHOTOS.directoraDermatoscope,
    link: '/nosotros#valores',
  },
  {
    id: 'etica-humana',
    title: 'Ética y Enfoque Humano',
    description: 'Detrás de cada consulta hay una persona que deposita su confianza en nosotros. Educamos y protegemos a los pacientes frente a la desinformación digital.',
    imageUrl: DRA_LEYVA_PHOTOS.directoraConsultation,
    link: '/nosotros#historia',
  },
]

export default function PromiseSection() {
  const [content, setContent] = useState(DEFAULTS)

  useEffect(() => {
    async function load() {
      try {
        const siteData = await getSiteContent('promise')
        const loaded = siteData?.data || siteData
        if (loaded && typeof loaded === 'object') {
          setContent((prev) => ({ ...prev, ...loaded }))
        }
      } catch { /* fallback */ }
    }
    load()
  }, [])

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.15
      }
    }
  }

  const cardVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as any }
    }
  }

  return (
    <section className="pt-32 pb-12 bg-[#fafafa] relative overflow-hidden">
      {/* Background patterns */}
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none" 
           style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, black 1px, transparent 0)', backgroundSize: '24px 24px' }}></div>
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#02696a]/10 to-transparent" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Header */}
        <div className="text-center mb-24 max-w-3xl mx-auto flex flex-col items-center">
          <span className="text-tertiary font-headline font-bold tracking-[0.45em] uppercase text-xs block mb-6">
            Nuestros Pilares
          </span>
          <h2 className="text-4xl md:text-6xl font-headline font-black tracking-tight text-primary-container leading-tight uppercase">
            {content.title}
          </h2>
          <div className="h-[2px] w-24 bg-gradient-to-r from-transparent via-tertiary to-transparent mt-6 mb-6" />
          <p className="text-base md:text-lg text-on-surface-variant/80 font-serif italic leading-relaxed max-w-2xl">
            {content.subtitle}
          </p>
        </div>

        {/* 4 Column Interactive Grid */}
        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {REASONS.map((reason) => (
            <motion.div
              key={reason.id}
              variants={cardVariants}
              className="group"
            >
              <Link
                href={reason.link}
                className="relative h-[480px] rounded-3xl overflow-hidden block border border-black/5 hover:border-[#02696a]/20 shadow-[0_15px_40px_rgba(0,0,0,0.015)] hover:shadow-[0_24px_60px_rgba(2,105,106,0.08)] transition-all duration-700 group cursor-pointer hover:-translate-y-1.5"
              >
                <Image
                  src={reason.imageUrl}
                  alt={reason.title}
                  fill
                  className="object-cover transition-transform duration-[1500ms] group-hover:scale-105 opacity-75 group-hover:opacity-90"
                />
                
                {/* Overlays - Dark filter gradient for maximum text contrast */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/40 to-black/90 opacity-90 transition-opacity duration-700 group-hover:opacity-100" />
                
                {/* Content */}
                <div className="absolute inset-0 p-8 flex flex-col justify-end text-center z-10">
                  <div className="mb-4 transform transition-transform duration-700 group-hover:-translate-y-2">
                    <h3 className="text-2xl font-headline font-bold text-white tracking-wide">
                      {reason.title}
                    </h3>
                    <div className="w-8 h-[1px] bg-tertiary/40 mx-auto mt-3 group-hover:w-16 transition-all duration-500" />
                  </div>
                  
                  {/* Arrow Indicator */}
                  <div className="flex justify-center mb-2">
                    <div className="w-10 h-10 rounded-full border border-white/20 group-hover:border-tertiary group-hover:bg-tertiary flex items-center justify-center transition-all duration-500 transform group-hover:rotate-90">
                      <span className="material-symbols-outlined text-white group-hover:text-primary-container text-sm">arrow_forward</span>
                    </div>
                  </div>

                  <div className="overflow-hidden max-h-0 group-hover:max-h-36 transition-all duration-700 ease-in-out">
                    <p className="text-xs text-white/80 font-serif italic leading-relaxed mt-2 px-1">
                      {reason.description}
                    </p>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
        
      </div>
    </section>
  )
}
