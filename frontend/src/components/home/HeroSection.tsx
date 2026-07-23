'use client'

import { useState, useEffect, useRef, SyntheticEvent } from 'react'
import Link from 'next/link'
import { getSiteContent } from '@/lib/api'
import { motion, AnimatePresence } from 'framer-motion'

const DEFAULT_SLIDES = [
  {
    type: 'video',
    src: 'https://gsyvzfkkqiucaeinyddc.supabase.co/storage/v1/object/public/dermq/clinic_intro.mp4',
    title: 'Clínica DERMQ',
    subtitle: 'La cúspide de la excelencia dermatológica y estética.',
  },
  {
    type: 'image',
    src: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80&w=2000',
    title: 'Precisión & Arte',
    subtitle: 'Tecnología vanguardista para el cuidado integral de tu piel.',
  },
  {
    type: 'image',
    src: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=2000',
    title: 'Estética Avanzada',
    subtitle: 'Especialistas dedicados a revelar tu luminosidad natural.',
  },
]

interface VideoSlideProps {
  src: string
  isActive: boolean
  onEnded: () => void
  onLoadedMetadata: (e: SyntheticEvent<HTMLVideoElement>) => void
  className?: string
}

function VideoSlide({
  src,
  isActive,
  onEnded,
  onLoadedMetadata,
  className,
}: VideoSlideProps) {
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    if (isActive) {
      video.currentTime = 0
      video.play().catch((err) => console.log('Video play error:', err))
    } else {
      video.pause()
    }
  }, [isActive])

  return (
    <video
      ref={videoRef}
      src={src}
      muted
      playsInline
      onEnded={onEnded}
      onLoadedMetadata={onLoadedMetadata}
      className={className}
    />
  )
}

export default function HeroSection() {
  const [slides, setSlides] = useState(DEFAULT_SLIDES)
  const [currentSlide, setCurrentSlide] = useState(0)
  const [videoDuration, setVideoDuration] = useState<number>(30)

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
    const isVideo = slides[currentSlide]?.type === 'video'
    const durationMs = isVideo ? (videoDuration * 1000 + 2000) : 7000

    const timer = setTimeout(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, durationMs)

    return () => clearTimeout(timer)
  }, [currentSlide, slides.length, videoDuration, slides])

  return (
    <section className="relative h-screen min-h-[600px] flex items-center overflow-hidden bg-primary-container">
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
              <VideoSlide
                src={slide.src}
                isActive={isActive}
                onEnded={() => setCurrentSlide((prev) => (prev + 1) % slides.length)}
                onLoadedMetadata={(e) => {
                  const duration = e.currentTarget.duration
                  if (duration && !isNaN(duration)) {
                    setVideoDuration(duration)
                  }
                }}
                className={`w-full h-full object-cover ${isActive ? 'animate-ken-burns' : ''}`}
              />
            ) : (
              <img
                src={slide.src}
                alt={slide.title}
                className={`w-full h-full object-cover ${isActive ? 'animate-ken-burns' : ''}`}
              />
            )}
            {/* Filter Overlay (Filtro) - Dark Emerald mix-blend overlay */}
            <div className="absolute inset-0 bg-[#002f30]/40 mix-blend-multiply" />
            <div className="absolute inset-0 bg-black/20" />
          </div>
        )
      })}

      {/* Content Container (Left-aligned, mimicking Catedral de Lima layout) */}
      <div className="relative z-20 max-w-7xl mx-auto px-6 lg:px-12 w-full flex items-center justify-start h-full pt-16 md:pt-20">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 40 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] as any }}
            className="max-w-2xl text-left"
          >
            <span className="text-white font-headline text-lg md:text-2xl block mb-2 font-medium">
              Bienvenidos a la
            </span>

            <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-headline font-black leading-tight tracking-tight mb-4 text-white">
              {slides[currentSlide]?.title}
            </h1>

            <p className="text-base md:text-lg text-white/80 font-serif max-w-lg mb-8 leading-relaxed">
              {slides[currentSlide]?.subtitle}
            </p>

            <div className="flex">
              <Link
                href="/reservar"
                className="bg-tertiary text-primary-container px-8 py-3.5 rounded-full font-headline font-bold text-xs tracking-wider uppercase hover:bg-white hover:text-primary-container transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg shadow-tertiary/20 inline-flex items-center gap-2"
              >
                Reservar Cita
                <span className="material-symbols-outlined text-xs">arrow_forward</span>
              </Link>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Slide Indicators */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 md:left-auto md:translate-x-0 md:right-12 md:bottom-12 z-20 flex gap-3">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`transition-all duration-300 h-1.5 rounded-full ${
              currentSlide === index ? 'w-10 bg-tertiary' : 'w-4 bg-white/30 hover:bg-white/60'
            }`}
            aria-label={`Ir a la diapositiva ${index + 1}`}
          />
        ))}
      </div>
    </section>
  )
}
