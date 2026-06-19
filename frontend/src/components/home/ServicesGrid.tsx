'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { getSiteContent } from '@/lib/api'
import { SERVICES_DATA as DEFAULT_SERVICES } from '@/data/services'

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

  return (
    <section className="py-32 bg-[#014d4e] relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none" 
           style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/carbon-fibre.png")' }}></div>
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-tertiary/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-primary/20 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-[1400px] mx-auto px-6 relative z-10">
        
        {/* Header Catedral Style */}
        <div className="text-center mb-24 max-w-3xl mx-auto flex flex-col items-center">
          <span className="text-tertiary font-headline font-bold tracking-[0.4em] uppercase text-xs block mb-6 px-4 py-1 border border-tertiary/30 rounded-full">
            Excelencia Médica
          </span>
          <h2 className="text-5xl md:text-8xl font-headline font-black tracking-tight text-white mb-10 leading-none">
            Especialidades <br />
            <span className="italic font-serif font-light text-tertiary">de Vanguardia</span>
          </h2>
          <div className="h-[2px] w-32 bg-gradient-to-r from-transparent via-tertiary to-transparent mb-10" />
          <p className="text-xl text-white/70 font-serif italic leading-relaxed">
            Fusionamos la precisión quirúrgica con la tecnología láser más avanzada
            para transformar la salud de tu piel.
          </p>
        </div>

        {/* 3 Column Vertical Grid (Premium Style) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <Link
              key={service.id}
              href={`/servicios#${service.id}`}
              className="group relative h-[700px] rounded-sm overflow-hidden block border border-white/5 hover:border-tertiary/50 transition-all duration-700 shadow-2xl"
            >
              <Image
                src={service.imageUrl}
                alt={service.name}
                fill
                className="object-cover transition-transform duration-1000 group-hover:scale-110 opacity-80 group-hover:opacity-100"
              />
              
              {/* Overlays */}
              <div className="absolute inset-0 bg-gradient-to-b from-[#014d4e]/60 via-transparent to-black opacity-90 transition-opacity duration-700 group-hover:opacity-100" />
              <div className="absolute inset-0 border-[1px] border-white/10 m-4 transition-all duration-700 group-hover:border-tertiary/40 pointer-events-none" />
              
              {/* Content */}
              <div className="absolute inset-0 p-10 flex flex-col justify-end text-center">
                <div className="mb-8 transform transition-transform duration-700 group-hover:-translate-y-4">
                  <h3 className="text-4xl lg:text-5xl font-headline font-bold text-white mb-6 tracking-wide leading-[1.1]">
                    {service.name.split(' ').map((word: string, i: number) => (
                      <span key={i} className={i % 2 !== 0 ? 'text-tertiary italic block' : 'block'}>
                        {word}{' '}
                      </span>
                    ))}
                  </h3>
                  <div className="w-12 h-[1px] bg-tertiary mx-auto mb-6 transition-all duration-700 group-hover:w-24" />
                </div>
                
                <div className="overflow-hidden max-h-0 group-hover:max-h-40 transition-all duration-1000 ease-in-out">
                  <p className="text-base text-white/80 font-serif italic leading-relaxed mb-10 px-4">
                    {service.description}
                  </p>
                  <div className="text-tertiary">
                    <span className="font-headline font-bold text-xs uppercase tracking-[0.3em] border-b border-tertiary/50 pb-2 hover:border-tertiary transition-colors">
                      Explorar Tratamientos
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
        
      </div>
    </section>
  )
}
