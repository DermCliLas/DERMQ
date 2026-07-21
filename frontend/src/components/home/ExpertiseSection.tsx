'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import OrganicDivider from '@/components/ui/OrganicDivider'
import { getSiteContent } from '@/lib/api'
import { motion } from 'framer-motion'

const DEFAULTS = {
  doctorImage: '/leyva.png',
  title1: 'The Expertise',
  title2: 'Behind the Glow.',
  paragraph1: 'Founded by world-renowned dermatologists, DERMQ bridges the gap between high-level laboratory research and luxury skincare experiences.',
  paragraph2: 'Every consultation is a journey through your skin\'s molecular needs, utilizing AI-driven analysis and proprietary laser technology.',
  stat1Value: '98%', stat1Label: 'Patient Satisfaction',
  stat2Value: '40k', stat2Label: 'Active Treatments',
  ctaText: 'Conoce nuestro equipo', ctaHref: '/nosotros',
  badgeValue: '15+', badgeLine1: 'Years of Clinical', badgeLine2: 'Research',
}

export default function ExpertiseSection() {
  const [data, setData] = useState(DEFAULTS)

  useEffect(() => {
    async function load() {
      try {
        const content = await getSiteContent('expertise')
        if (content?.data) setData({ ...DEFAULTS, ...content.data })
      } catch { /* fallback */ }
    }
    load()
  }, [])

  return (
    <section className="py-32 bg-transparent relative z-10 overflow-hidden">
      <OrganicDivider type="slope" fill="#f8fafa" />
      <OrganicDivider type="slope" fill="#72C1C1" flip />
      
      <div className="max-w-7xl mx-auto px-6 relative">
        <div className="flex flex-col lg:flex-row relative">
          
          {/* Doctor Image Block */}
          <motion.div 
            className="w-full lg:w-[65%] h-[500px] lg:h-[700px] rounded-5xl overflow-hidden relative shadow-premium border-4 border-white"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] as any }}
          >
            <Image
              src={data.doctorImage}
              alt="Especialista DERMQ"
              fill
              className="object-cover hover:scale-105 transition-all duration-[1500ms] ease-out"
            />
            {/* Soft gradient overlay on image */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent pointer-events-none" />
          </motion.div>

          {/* Floating White Card */}
          <motion.div 
            className="w-full lg:w-[45%] lg:absolute lg:right-0 lg:top-1/2 lg:-translate-y-1/2 glass-card-white rounded-5xl p-10 md:p-14 shadow-premium mt-[-4rem] lg:mt-0 z-10 cursor-default"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] as any }}
          >
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-headline font-black text-[#1a1c1e] leading-[1.05] mb-8 tracking-tight">
              {data.title1}
              <br />
              <span className="text-primary italic font-serif font-light">{data.title2}</span>
            </h2>

            <div className="space-y-6 text-[#52525b] font-medium leading-relaxed mb-10 text-base md:text-lg">
              <p>{data.paragraph1}</p>
              <p>{data.paragraph2}</p>
            </div>

            <hr className="border-[#e4e4e7] mb-8" />

            <div className="flex gap-12">
              <div>
                <span className="block text-4xl font-black text-[#02696a] font-headline mb-1">
                  {data.stat1Value}
                </span>
                <span className="text-[10px] uppercase font-extrabold tracking-widest text-[#71717a] block">
                  {data.stat1Label}
                </span>
              </div>
              <div>
                <span className="block text-4xl font-black text-[#02696a] font-headline mb-1">
                  {data.stat2Value}
                </span>
                <span className="text-[10px] uppercase font-extrabold tracking-widest text-[#71717a] block">
                  {data.stat2Label}
                </span>
              </div>
            </div>

            <div className="mt-10">
              <Link
                href={data.ctaHref}
                className="inline-flex items-center gap-2 font-bold text-[#02696a] hover:gap-4 transition-all duration-300 group"
              >
                {data.ctaText}
                <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
              </Link>
            </div>
          </motion.div>

          {/* Green Floating Badge */}
          <motion.div 
            className="absolute bottom-[-2rem] lg:bottom-12 left-6 lg:left-[55%] lg:-translate-x-1/2 bg-[#005c5c] text-white p-8 rounded-3xl shadow-2xl z-20 w-56 cursor-pointer"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
            whileHover={{ y: -8, rotate: 2, scale: 1.05 }}
          >
            <span className="text-4xl font-black font-headline block mb-2">{data.badgeValue}</span>
            <span className="text-[10px] font-extrabold uppercase tracking-widest leading-snug block text-teal-100">
              {data.badgeLine1}
              <br />
              {data.badgeLine2}
            </span>
          </motion.div>
          
        </div>
      </div>
    </section>
  )
}
