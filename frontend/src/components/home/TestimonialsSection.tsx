'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { getSiteContent } from '@/lib/api'
import { motion } from 'framer-motion'

interface TrustItem {
  icon: string
  title: string
  description: string
  color?: string
}

interface TestimonialsContent {
  image: string
  quote: string
  patientName: string
  patientTitle: string
  titleHighlight: string
  trustItems: TrustItem[]
}

const DEFAULTS: TestimonialsContent = {
  image: '/imagenTestimonios.jpg',
  quote: 'Mi piel nunca se sintió tan saludable. La precisión en cada paso del tratamiento fue lo que marcó la diferencia.',
  patientName: 'Elena Ramírez',
  patientTitle: 'Paciente de Estética',
  titleHighlight: 'Por qué confiar en nosotros.',
  trustItems: [
    {
      icon: 'verified',
      title: 'Cuerpo Médico Certificado',
      description: 'Especialistas egresados de las mejores instituciones, en constante actualización clínica.',
      color: 'bg-primary/10 text-primary border-primary/20',
    },
    {
      icon: 'precision_manufacturing',
      title: 'Tecnología de Punta',
      description: 'Contamos con la última generación de equipos láser y diagnóstico por imagen.',
      color: 'bg-secondary/10 text-secondary border-secondary/20',
    },
    {
      icon: 'favorite',
      title: 'Atención Humana',
      description: 'Protocolos personalizados. No tratamos pieles, tratamos personas.',
      color: 'bg-tertiary/10 text-tertiary border-tertiary/20',
    },
  ],
}

export default function TestimonialsSection() {
  const [content, setContent] = useState<TestimonialsContent>(DEFAULTS)

  useEffect(() => {
    getSiteContent('testimonials')
      .then((data) => {
        if (data?.data) setContent({ ...DEFAULTS, ...data.data })
      })
      .catch((err) => console.error('Error fetching Testimonios content:', err))
  }, [])

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.2
      }
    }
  }

  const leftVariants = {
    hidden: { opacity: 0, x: -50 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as any }
    }
  }

  const rightVariants = {
    hidden: { opacity: 0, x: 50 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as any }
    }
  }

  return (
    <section className="py-32 bg-[#F2F4F4] overflow-hidden relative">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div 
          className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {/* Left: Image + Testimonial */}
          <motion.div 
            className="col-span-12 lg:col-span-5 relative pb-20 sm:pb-24 lg:pb-0"
            variants={leftVariants}
          >
            <div className="aspect-square bg-slate-100 rounded-[3.5rem] overflow-hidden shadow-premium border-4 border-white">
              <Image
                src={content.image || '/imagenTestimonios.jpg'}
                alt="Paciente satisfecha con tratamiento DERMQ"
                width={600}
                height={600}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-[1200ms] ease-out"
              />
            </div>
            
            {/* Absolute Testimonial bubble */}
            <motion.div 
              className="absolute -bottom-16 left-4 right-4 sm:left-auto sm:-bottom-8 sm:-right-4 md:-right-8 glass-card-white border border-white/60 text-[#1a1c1e] p-6 md:p-8 lg:p-10 rounded-[2rem] lg:rounded-[2.5rem] shadow-2xl max-w-full sm:max-w-sm"
              initial={{ scale: 0.9, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              <span className="material-symbols-outlined text-4xl text-tertiary mb-3">format_quote</span>
              <p className="text-lg md:text-xl font-medium leading-relaxed italic text-primary-container">
                &ldquo;{content.quote}&rdquo;
              </p>
              <div className="mt-6 flex flex-col">
                <span className="font-headline font-black text-primary-container">{content.patientName}</span>
                <span className="text-[10px] opacity-70 uppercase tracking-widest font-extrabold text-[#71717a] mt-1">
                  {content.patientTitle}
                </span>
              </div>
            </motion.div>
          </motion.div>

          {/* Right: Trust Points */}
          <motion.div 
            className="col-span-12 lg:col-span-6 lg:col-start-8 space-y-8 lg:space-y-12"
            variants={rightVariants}
          >
            <span className="text-primary font-headline font-bold tracking-[0.4em] uppercase text-xs block mb-4">
              Nuestra Mística
            </span>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-headline font-black tracking-tight leading-[1.1] text-primary-container">
              {content.titleHighlight}
            </h2>
            
            <div className="space-y-8">
              {content.trustItems.map((item, idx) => {
                const colorClass = item.color || (
                  idx === 0 ? 'bg-primary/10 text-primary border-primary/20' :
                  idx === 1 ? 'bg-secondary/10 text-secondary border-secondary/20' :
                  'bg-tertiary/10 text-tertiary border-tertiary/20'
                )
                return (
                  <motion.div 
                    key={idx} 
                    className="flex gap-6 group items-start border-b border-black/5 pb-6 last:border-b-0"
                    whileHover={{ x: 6 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  >
                    <div
                      className={`w-14 h-14 rounded-2xl ${colorClass} border flex items-center justify-center shrink-0 group-hover:rotate-6 transition-all duration-500 shadow-sm`}
                    >
                      <span className="material-symbols-outlined text-2xl">{item.icon}</span>
                    </div>
                    <div>
                      <h4 className="text-lg font-headline font-bold text-primary-container mb-2 group-hover:text-primary transition-colors">{item.title}</h4>
                      <p className="text-on-surface-variant leading-relaxed text-sm md:text-base">{item.description}</p>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
