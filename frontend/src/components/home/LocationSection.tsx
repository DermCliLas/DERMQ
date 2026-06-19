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
  addressLine1: 'Av. Camino Real 1234, Piso 4',
  addressLine2: 'San Isidro, Lima - Perú',
  hoursTitle: 'Horario de Atención',
  hoursLine1: 'Lunes a Viernes: 9:00 AM — 7:00 PM',
  hoursLine2: 'Sábados: 9:00 AM — 1:00 PM',
  parkingTitle: 'Estacionamiento',
  parkingDescription: 'Contamos con valet parking gratuito para todos nuestros pacientes.',
  mapIframeUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3901.325997233827!2d-77.0371!3d-12.0964!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x9105c8695029c049%3A0xc3c5092a95c490a!2sAv.%20Camino%20Real%201234%2C%20San%20Isidro%2015073!5e0!3m2!1ses-419!2spe!4v1700000000000!5m2!1ses-419!2spe',
  googleMapsUrl: 'https://maps.app.goo.gl/uX3L5q6fX6X6X6X6',
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
    <section className="relative py-24 overflow-hidden bg-white">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* Text Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary-container text-xs font-bold uppercase tracking-widest mb-6">
              {content.badge}
            </span>
            <h2 className="text-5xl md:text-6xl font-headline font-black tracking-tight text-primary-container mb-8">
              {content.title1} <br />
              <span className="text-tertiary">{content.title2}</span>
            </h2>
            
            <div className="space-y-8">
              <div className="flex gap-5">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-primary-container">location_on</span>
                </div>
                <div>
                  <h4 className="font-bold text-lg text-primary-container mb-1">{content.addressTitle}</h4>
                  <p className="text-on-surface-variant leading-relaxed">
                    {content.addressLine1}<br />
                    {content.addressLine2}
                  </p>
                </div>
              </div>

              <div className="flex gap-5">
                <div className="w-12 h-12 rounded-2xl bg-secondary/10 flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-secondary-container">schedule</span>
                </div>
                <div>
                  <h4 className="font-bold text-lg text-secondary-container mb-1">{content.hoursTitle}</h4>
                  <p className="text-on-surface-variant leading-relaxed">
                    {content.hoursLine1}<br />
                    {content.hoursLine2}
                  </p>
                </div>
              </div>

              <div className="flex gap-5">
                <div className="w-12 h-12 rounded-2xl bg-tertiary/10 flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-tertiary-container">directions_car</span>
                </div>
                <div>
                  <h4 className="font-bold text-lg text-tertiary-container mb-1">{content.parkingTitle}</h4>
                  <p className="text-on-surface-variant leading-relaxed">
                    {content.parkingDescription}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Map Content */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative h-[500px] rounded-[3rem] overflow-hidden shadow-premium group"
            style={{ border: '1px solid rgba(0,0,0,0.05)' }}
          >
            <iframe 
              src={content.mapIframeUrl} 
              width="100%" 
              height="100%" 
              style={{ border: 0, filter: 'grayscale(0.1) contrast(1.1) brightness(0.95)' }} 
              allowFullScreen={true} 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
              title="Ubicación DERMQ"
            ></iframe>
            
            {/* Map Overlay Button */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <a 
                href={content.googleMapsUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-white text-primary-container px-6 py-3 rounded-full font-bold text-sm shadow-xl flex items-center gap-2 hover:scale-105 transition-transform"
              >
                Abrir en Google Maps
                <span className="material-symbols-outlined text-sm">open_in_new</span>
              </a>
            </div>
          </motion.div>

        </div>
      </div>
      
      {/* Background Decorative Blobs */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-64 h-64 bg-primary/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-tertiary/5 rounded-full blur-[120px] pointer-events-none" />
    </section>
  )
}
