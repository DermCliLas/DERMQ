'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { getSiteContent } from '@/lib/api'

const DEFAULT_SLIDES = [
  {
    type: 'video',
    src: 'https://assets.mixkit.co/videos/preview/mixkit-medical-professional-examining-patient-skin-40090-large.mp4',
    title: 'DERMQ LIMA',
    subtitle: 'La cúspide de la excelencia dermatológica.',
  },
  {
    type: 'image',
    src: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80&w=2000',
    title: 'ARTE Y CIENCIA',
    subtitle: 'Tecnología vanguardista para el cuidado integral de tu piel.',
  },
  {
    type: 'image',
    src: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=2000',
    title: 'ESTÉTICA AVANZADA',
    subtitle: 'Especialistas dedicados a revelar tu luminosidad natural.',
  },
]

export default function HeroSection() {
  const [slides, setSlides] = useState(DEFAULT_SLIDES)
  const [currentSlide, setCurrentSlide] = useState(0)

  useEffect(() => {
    async function load() {
      try {
        const content = await getSiteContent('hero')
        if (content?.data?.slides && content.data.slides.length > 0) {
          setSlides(content.data.slides)
        }
      } catch { /* fallback to defaults */ }
    }
    load()
  }, [])

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, 6000)
    return () => clearInterval(timer)
  }, [slides.length])

  return (
    <section className="relative h-screen min-h-[800px] flex items-center justify-center overflow-hidden bg-primary-container">
      {/* Carousel Backgrounds */}
      {slides.map((slide, index) => {
        const isActive = index === currentSlide
        return (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              isActive ? 'opacity-100 z-10' : 'opacity-0 z-0'
            }`}
          >
            {slide.type === 'video' ? (
              <video
                src={slide.src}
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-cover"
              />
            ) : (
              <img
                src={slide.src}
                alt={slide.title}
                className="w-full h-full object-cover"
              />
            )}
            {/* Dark Overlay for Majestic Look */}
            <div className="absolute inset-0 bg-primary-container/60 mix-blend-multiply" />
            <div className="absolute inset-0 bg-black/40" />
          </div>
        )
      })}

      {/* Content */}
      <div className="relative z-20 max-w-5xl mx-auto px-6 text-center text-white flex flex-col items-center">
        <div className="overflow-hidden mb-6">
          <span className="text-tertiary font-headline font-bold tracking-[0.3em] uppercase text-sm block animate-text-reveal">
            Bienvenidos a
          </span>
        </div>
        
        <h1 className="text-6xl md:text-8xl lg:text-9xl font-headline font-black leading-none tracking-tight mb-8 drop-shadow-2xl text-white">
          {slides[currentSlide]?.title}
        </h1>
        
        <p className="text-lg md:text-2xl text-white/90 font-serif italic max-w-2xl mb-12 drop-shadow-md">
          {slides[currentSlide]?.subtitle}
        </p>
        
        <div className="flex flex-col sm:flex-row gap-6">
          <Link
            href="/reservar"
            className="bg-tertiary text-primary-container px-12 py-5 rounded-sm font-headline font-bold text-lg tracking-widest uppercase hover:bg-white hover:text-primary-container transition-colors duration-300 transform hover:scale-105 active:scale-95"
          >
            Reservar Cita
          </Link>
          <Link
            href="/servicios"
            className="border border-tertiary text-tertiary px-12 py-5 rounded-sm font-headline font-bold text-lg tracking-widest uppercase hover:bg-tertiary/10 transition-colors duration-300"
          >
            Nuestros Servicios
          </Link>
        </div>
      </div>

      {/* Slide Indicators */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-20 flex gap-4">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`transition-all duration-300 h-1 rounded-full ${
              currentSlide === index ? 'w-12 bg-tertiary' : 'w-6 bg-white/40 hover:bg-white/70'
            }`}
            aria-label={`Ir a diapositiva ${index + 1}`}
          />
        ))}
      </div>
    </section>
  )
}
