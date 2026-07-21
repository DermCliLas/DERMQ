'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { getSiteContent } from '@/lib/api'
import { motion } from 'framer-motion'

const DEFAULTS = {
  title: 'Cuatro razones para confiar tu piel a DERMQ',
  subtitle: 'Fusionamos el rigor de la ciencia médica con la tecnología láser de cuarta generación para brindar a tu piel el cuidado de nivel clínico que merece.',
}

const REASONS = [
  {
    id: 'direccion-especializada',
    title: 'Dirección Especializada',
    description: 'Liderados por la Dra. Marcela Leyva, graduada en UNMSM con credenciales avanzadas en Inmunología por Harvard Medical School.',
    imageUrl: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=800',
    link: '/nosotros',
  },
  {
    id: 'tecnologia-laser',
    title: 'Tecnología Láser de Punta',
    description: 'Equipamiento de última generación para tratamientos de rejuvenecimiento, remoción de manchas y regeneración cutánea de alta precisión.',
    imageUrl: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&q=80&w=800',
    link: '/servicios#laser-avanzado',
  },
  {
    id: 'enfoque-humano',
    title: 'Enfoque Humano',
    description: 'Tratamos personas, no solo pieles. Diseñamos planes terapéuticos personalizados adaptados a tu bienestar integral.',
    imageUrl: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&q=80&w=800',
    link: '/nosotros#valores',
  },
  {
    id: 'excelencia-comprobada',
    title: 'Excelencia y Confianza',
    description: 'Más de 10,000 pacientes atendidos de manera exitosa con un 98% de satisfacción clínica en nuestras sedes en Lima.',
    imageUrl: 'https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?auto=format&fit=crop&q=80&w=800',
    link: '/portafolio',
  },
]

export default function PromiseSection() {
  const [content, setContent] = useState(DEFAULTS)

  useEffect(() => {
    async function load() {
      try {
        const siteData = await getSiteContent('promise')
        if (siteData?.data) {
          setContent({ ...DEFAULTS, ...siteData.data })
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
