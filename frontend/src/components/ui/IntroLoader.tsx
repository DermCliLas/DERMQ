'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'

interface IntroLoaderProps {
  onComplete?: () => void;
}

export default function IntroLoader({ onComplete }: IntroLoaderProps) {
  const [isMounted, setIsMounted] = useState(true)

  useEffect(() => {
    // End the intro after 2.8 seconds
    const timer = setTimeout(() => {
      setIsMounted(false)
      if (onComplete) onComplete()
    }, 2800)

    return () => clearTimeout(timer)
  }, [onComplete])

  return (
    <AnimatePresence>
      {isMounted && (
        <motion.div
          initial={{ y: 0 }}
          exit={{ 
            y: '-100%',
            transition: { duration: 1.1, ease: [0.76, 0, 0.24, 1] } 
          }}
          className="fixed inset-0 bg-[#02696a] z-[9999] flex flex-col items-center justify-center select-none"
        >
          {/* Subtle global dot texture applied internally for premium depth */}
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
               style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/carbon-fibre.png")' }} />

          {/* Glowing backlights */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full bg-white/5 blur-3xl pointer-events-none" />

          {/* Logo container */}
          <div className="flex flex-col items-center gap-6 z-10">
            <motion.div
              initial={{ opacity: 0, scale: 0.8, filter: 'blur(10px)' }}
              animate={{ 
                opacity: 1, 
                scale: 1, 
                filter: 'blur(0px)',
                transition: { duration: 1.2, ease: [0.16, 1, 0.3, 1] }
              }}
              className="relative w-32 h-32 md:w-36 md:h-36 rounded-full bg-white p-3 shadow-[0_20px_50px_rgba(0,0,0,0.15)] flex items-center justify-center border border-white/20"
            >
              <Image 
                src="/logo.png" 
                alt="DERMQ Logo" 
                width={120} 
                height={120} 
                className="object-contain"
                priority
              />
            </motion.div>

            {/* Title / Line */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ 
                opacity: 1, 
                y: 0,
                transition: { duration: 0.8, delay: 0.6, ease: [0.16, 1, 0.3, 1] }
              }}
              className="text-center space-y-3"
            >
              <h2 className="text-white font-headline text-2xl md:text-3xl tracking-widest font-extrabold uppercase">
                DERMQ
              </h2>
              <div className="h-[1px] w-12 bg-tertiary mx-auto" />
              <p className="text-tertiary font-headline font-semibold text-[10px] md:text-xs tracking-[0.4em] uppercase">
                Clínica Dermatológica
              </p>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
