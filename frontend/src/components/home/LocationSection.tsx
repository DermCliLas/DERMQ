'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { getSiteContent } from '@/lib/api'

interface LocationContent {
  badge: string
  title1: string
  title2: string
  addressTitle: string
  addressLine1: string
  addressLine2: string
  hoursTitle: string
  hoursLine1: string
  hoursLine2: string
  parkingTitle: string
  parkingDescription: string
  mapIframeUrl: string
  googleMapsUrl: string
}

const DEFAULTS: LocationContent = {
  badge: 'Ubicación Primaria',
  title1: 'Encuéntranos en',
  title2: 'San Isidro.',
  addressTitle: 'Nuestra Sede',
  addressLine1: 'Av. José Gálvez Barrenechea 127, Oficina 604',
  addressLine2: 'San Isidro, Lima - Perú',
  hoursTitle: 'Horario de Atención',
  hoursLine1: 'Lunes a Viernes: 9:00 AM — 7:00 PM',
  hoursLine2: 'Sábados: 9:00 AM — 1:00 PM',
  parkingTitle: 'Estacionamiento',
  parkingDescription: 'Contamos con valet parking gratuito para todos nuestros pacientes.',
  mapIframeUrl: 'https://maps.google.com/maps?q=Av.+Jos%C3%A9+G%C3%A1lvez+Barrenechea+127%2C+San+Isidro&t=&z=16&ie=UTF8&iwloc=&output=embed',
  googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Av.+Jos%C3%A9+G%C3%A1lvez+Barrenechea+127%2C+San+Isidro',
}

export default function LocationSection() {
  const [content, setContent] = useState<LocationContent>(DEFAULTS)

  useEffect(() => {
    getSiteContent('location')
      .then((data) => {
        if (data?.data) setContent({ ...DEFAULTS, ...data.data })
      })
      .catch((err) => console.error('Error fetching Ubicacion content:', err))
  }, [])

  return (
    <section className="relative py-16 md:py-32 overflow-hidden bg-white">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          {/* Text Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] as any }}
          >
            <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary-container text-xs font-bold uppercase tracking-widest mb-6">
              {content.badge}
            </span>
            <h2 className="text-5xl md:text-6xl font-headline font-black tracking-tight text-primary-container mb-10 leading-tight">
              {content.title1} <br />
              <span className="text-tertiary italic font-serif font-light">{content.title2}</span>
            </h2>
            
            <div className="space-y-8">
              <motion.div className="flex gap-5 group" whileHover={{ x: 4 }}>
                <div className="w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0 shadow-sm group-hover:scale-105 transition-transform duration-300">
                  <span className="material-symbols-outlined text-primary-container">location_on</span>
                </div>
                <div>
                  <h4 className="font-headline font-bold text-lg text-primary-container mb-1.5">{content.addressTitle}</h4>
                  <p className="text-on-surface-variant leading-relaxed text-sm md:text-base">
                    {content.addressLine1}<br />
                    {content.addressLine2}
                  </p>
                </div>
              </motion.div>

              <motion.div className="flex gap-5 group" whileHover={{ x: 4 }}>
                <div className="w-14 h-14 rounded-2xl bg-secondary/10 border border-secondary/20 flex items-center justify-center shrink-0 shadow-sm group-hover:scale-105 transition-transform duration-300">
                  <span className="material-symbols-outlined text-secondary-container">schedule</span>
                </div>
                <div>
                  <h4 className="font-headline font-bold text-lg text-secondary-container mb-1.5">{content.hoursTitle}</h4>
                  <p className="text-on-surface-variant leading-relaxed text-sm md:text-base">
                    {content.hoursLine1}<br />
                    {content.hoursLine2}
                  </p>
                </div>
              </motion.div>

              <motion.div className="flex gap-5 group" whileHover={{ x: 4 }}>
                <div className="w-14 h-14 rounded-2xl bg-tertiary/10 border border-tertiary/20 flex items-center justify-center shrink-0 shadow-sm group-hover:scale-105 transition-transform duration-300">
                  <span className="material-symbols-outlined text-tertiary-container">directions_car</span>
                </div>
                <div>
                  <h4 className="font-headline font-bold text-lg text-tertiary-container mb-1.5">{content.parkingTitle}</h4>
                  <p className="text-on-surface-variant leading-relaxed text-sm md:text-base">
                    {content.parkingDescription}
                  </p>
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Map Content */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] as any }}
            className="relative h-[350px] md:h-[550px] rounded-[2rem] md:rounded-[3.5rem] overflow-hidden shadow-premium group border-4 border-white"
          >
            <iframe 
              src={content.mapIframeUrl} 
              width="100%" 
              height="100%" 
              style={{ border: 0, filter: 'grayscale(0.2) contrast(1.1) brightness(0.95)' }} 
              allowFullScreen={true} 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
              title="Ubicación DERMQ"
            ></iframe>
            
            {/* Map Overlay Button */}
            <div className="absolute inset-0 bg-black/10 pointer-events-none group-hover:bg-transparent transition-colors duration-500" />
            
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 opacity-90 group-hover:opacity-100 transition-opacity duration-300">
              <a 
                href={content.googleMapsUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-primary-container text-white px-8 py-4 rounded-full font-headline font-bold text-xs uppercase tracking-widest shadow-glow flex items-center gap-2 hover:scale-105 active:scale-95 transition-all duration-300"
              >
                Abrir en Google Maps
                <span className="material-symbols-outlined text-xs">open_in_new</span>
              </a>
            </div>
          </motion.div>

        </div>
      </div>
      
      {/* Background Decorative Blobs */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-80 h-80 bg-primary/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-tertiary/5 rounded-full blur-[140px] pointer-events-none" />
    </section>
  )
}
