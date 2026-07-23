'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { getSiteContent } from '@/lib/api'
import { SERVICES_DATA as DEFAULT_SERVICES } from '@/data/services'
import { motion } from 'framer-motion'

export default function ServicesGrid() {
  const [services, setServices] = useState(DEFAULT_SERVICES)

  useEffect(() => {
    async function load() {
      try {
        const content = await getSiteContent('services')
        if (content?.data?.categories && content.data.categories.length > 0) {
          setServices(content.data.categories)
        }
      } catch { /* fallback to defaults */ }
    }
    load()
  }, [])

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.2
      }
    }
  }

  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as any }
    }
  }

  const getGlowColor = (id: string) => {
    switch (id) {
      case 'dermatologia-clinica':
        return 'group-hover:shadow-[0_20px_50px_rgba(114,193,193,0.35)]'
      case 'laser-avanzado':
        return 'group-hover:shadow-[0_20px_50px_rgba(240,161,126,0.35)]'
      case 'estetica-inyectables':
        return 'group-hover:shadow-[0_20px_50px_rgba(183,176,211,0.35)]'
      default:
        return 'group-hover:shadow-premium'
    }
  }

  const getBorderColor = (id: string) => {
    switch (id) {
      case 'dermatologia-clinica':
        return 'group-hover:border-primary/50'
      case 'laser-avanzado':
        return 'group-hover:border-tertiary/50'
      case 'estetica-inyectables':
        return 'group-hover:border-secondary/50'
      default:
        return 'group-hover:border-white/30'
    }
  }

  const getBadgeColor = (id: string) => {
    switch (id) {
      case 'dermatologia-clinica':
        return 'text-primary border-primary/30 bg-primary/5'
      case 'laser-avanzado':
        return 'text-tertiary border-tertiary/30 bg-tertiary/5'
      case 'estetica-inyectables':
        return 'text-secondary border-secondary/30 bg-secondary/5'
      default:
        return 'text-white border-white/30 bg-white/5'
    }
  }

  return (
    <section id="services" className="py-32 bg-[#014d4e] relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none" 
           style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/carbon-fibre.png")' }}></div>
      <div className="absolute -top-24 -left-24 w-[500px] h-[500px] bg-tertiary/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-[550px] h-[550px] bg-primary/15 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-[1400px] mx-auto px-6 relative z-10">
        
        {/* Header (Restored to original text and style) */}
        <div className="text-center mb-24 max-w-3xl mx-auto flex flex-col items-center">
          <span className="text-tertiary font-headline font-bold tracking-[0.4em] uppercase text-xs block mb-6 px-4 py-1.5 border border-tertiary/30 rounded-full">
            Excelencia Médica
          </span>
          <h2 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-headline font-black tracking-tight text-white mb-8 leading-none">
            Especialidades <br />
            <span className="italic font-serif font-light text-tertiary">de Vanguardia</span>
          </h2>
          <div className="h-[2px] w-32 bg-gradient-to-r from-transparent via-tertiary to-transparent mb-8" />
          <p className="text-lg md:text-xl text-white/70 font-serif italic leading-relaxed">
            Fusionamos la precisión quirúrgica con la tecnología láser más avanzada para transformar la salud de tu piel.
          </p>
        </div>

        {/* 3 Column Vertical Grid (Restored rounded-3xl cards and original text button layout) */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {services.map((service) => (
            <motion.div
              key={service.id}
              variants={cardVariants}
              className="group"
            >
              <Link
                href={`/servicios#${service.id}`}
                className={`relative h-[420px] md:h-[650px] rounded-3xl overflow-hidden block border border-white/10 ${getBorderColor(service.id)} transition-all duration-700 ${getGlowColor(service.id)} transform hover:-translate-y-2 shadow-2xl`}
              >
                <Image
                  src={service.imageUrl}
                  alt={service.name}
                  fill
                  className="object-cover transition-transform duration-[1200ms] group-hover:scale-105 opacity-75 group-hover:opacity-90"
                />
                
                {/* Overlays */}
                <div className="absolute inset-0 bg-gradient-to-b from-[#014d4e]/40 via-transparent to-black/90 opacity-90 transition-opacity duration-700 group-hover:opacity-100" />
                <div className="absolute inset-0 border-[1px] border-white/10 m-5 rounded-2xl transition-all duration-700 group-hover:border-white/20 pointer-events-none" />
                
                {/* Content */}
                <div className="absolute inset-0 p-6 md:p-10 flex flex-col justify-end text-center z-10">
                  <div className="mb-6 transform transition-transform duration-700 group-hover:-translate-y-3">
                    <span className={`inline-block px-3 py-1 text-[10px] uppercase font-bold tracking-widest rounded-full border mb-4 ${getBadgeColor(service.id)}`}>
                      {service.id.replace('-', ' ')}
                    </span>
                    <h3 className="text-3xl lg:text-4xl font-headline font-bold text-white mb-4 tracking-wide leading-tight">
                      {service.name}
                    </h3>
                    <div className="w-12 h-[1px] bg-tertiary mx-auto mb-4 transition-all duration-700 group-hover:w-20" />
                  </div>
                  
                  <div className="overflow-hidden max-h-0 group-hover:max-h-36 transition-all duration-700 ease-in-out">
                    <p className="text-sm md:text-base text-white/85 font-serif italic leading-relaxed mb-6 px-2">
                      {service.description}
                    </p>
                    <div className="text-tertiary">
                      <span className="font-headline font-bold text-xs uppercase tracking-[0.3em] border-b border-tertiary/50 pb-1.5 hover:border-tertiary transition-colors">
                        Explorar Tratamientos
                      </span>
                    </div>
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
