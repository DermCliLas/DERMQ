'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { SERVICES_DATA } from '@/data/services'

const CATEGORY_STYLES: Record<string, any> = {
  'dermatologia-clinica': { icon: 'clinical_notes', color: 'bg-primary/10 text-primary' },
  'laser-avanzado': { icon: 'auto_awesome', color: 'bg-secondary/10 text-secondary' },
  'estetica-inyectables': { icon: 'medical_services', color: 'bg-tertiary/10 text-tertiary' },
}

export default function ServiciosPage() {
  const [activeSlide, setActiveSlide] = useState(0)

  // Carousel Auto-play
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % SERVICES_DATA.length)
    }, 6000)
    return () => clearInterval(timer)
  }, [])

  return (
    <main className="bg-[#f8fafa]">
      {/* Dynamic Carousel Hero - Full Screen to Top */}
      <section className="relative h-[80vh] min-h-[500px] md:h-[90vh] md:min-h-[700px] overflow-hidden bg-black rounded-b-[2rem] md:rounded-b-[4rem] lg:rounded-b-[6rem] z-40 shadow-[0_20px_50px_rgba(0,0,0,0.2)]">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeSlide}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2, ease: "easeInOut" }}
            className="absolute inset-0"
          >
            <Image 
              src={SERVICES_DATA[activeSlide].imageUrl} 
              alt={SERVICES_DATA[activeSlide].name} 
              fill 
              className="object-cover opacity-70"
            />
            {/* Gradient Overlay with a hint of tertiary color for dynamism */}
            <div className="absolute inset-0 bg-gradient-to-r from-primary-container/95 via-primary-container/60 to-tertiary/10 mix-blend-multiply" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30" />
          </motion.div>
        </AnimatePresence>

        <div className="absolute inset-0 z-10 flex items-center pt-10">
          <div className="max-w-7xl mx-auto px-6 w-full">
            <motion.div
              key={activeSlide + '-content'}
              initial={{ x: -30, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="max-w-3xl"
            >
              <div className="flex items-center gap-4 mb-8">
                <div className="h-[2px] w-12 bg-tertiary" />
                <span className="text-tertiary text-sm font-bold uppercase tracking-[0.4em]">
                  Catálogo Clínico
                </span>
              </div>
              
              <h1 className="text-3xl sm:text-5xl md:text-7xl lg:text-[5rem] font-headline font-black tracking-tighter text-white mb-6 md:mb-8 leading-[1.05]">
                {SERVICES_DATA[activeSlide].name.split(' ').map((word, i) => {
                  const isHighlight = word.toLowerCase() === 'láser' || word.toLowerCase() === 'estética' || word.toLowerCase() === 'quirúrgica';
                  return (
                    <span key={i} className={isHighlight ? 'text-tertiary italic' : ''}>
                      {word}{' '}
                    </span>
                  )
                })}
              </h1>
              
              <p className="text-xl md:text-2xl text-white/90 font-serif italic leading-relaxed mb-12 border-l-4 border-tertiary/50 pl-6">
                {SERVICES_DATA[activeSlide].description}
              </p>
              
              <div className="flex flex-col sm:flex-row gap-8 sm:items-center">
                <Link
                  href={`#${SERVICES_DATA[activeSlide].id}`}
                  className="bg-tertiary text-white px-10 py-5 rounded-full font-bold hover:bg-white hover:text-tertiary transition-all shadow-glow hover:shadow-glow-lg group flex items-center justify-center gap-3 w-fit"
                >
                  Explorar Tratamientos
                  <span className="material-symbols-outlined transition-transform group-hover:translate-x-1">arrow_downward</span>
                </Link>
                
                {/* Custom Carousel Indicators */}
                <div className="flex gap-3 items-center">
                  {SERVICES_DATA.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveSlide(i)}
                      className={`h-2 rounded-full transition-all duration-500 ${
                        activeSlide === i ? 'bg-tertiary w-12' : 'bg-white/30 w-3 hover:bg-white/60'
                      }`}
                      aria-label={`Ir al slide ${i + 1}`}
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Categories Sections with Vertical Collage */}
      {SERVICES_DATA.map((cat, idx) => {
        // Section Styles based on explicit index: 0 = Green, 1 = Light, 2 = Salmon
        const isGreen = idx === 0;
        const isLight = idx === 1;
        const isSalmon = idx === 2;

        let sectionBg = '';
        if (isGreen) sectionBg = 'bg-[#014d4e] text-white';
        else if (isLight) sectionBg = 'bg-[#f8fafa] text-[#014d4e]';
        else if (isSalmon) sectionBg = 'bg-[#F5EDE0] text-[#014d4e]';

        const dividerBg = isGreen ? 'bg-[#F0A17E]' : isSalmon ? 'bg-[#02696a]' : 'bg-[#014d4e]';
        const cardBg = isGreen 
          ? 'bg-white/5 border-white/10 hover:bg-white/10' 
          : isSalmon 
            ? 'bg-[#fffdf8] border-[#02696a]/15 hover:bg-white' 
            : 'bg-white border-[#014d4e]/10 hover:border-[#014d4e]/30 shadow-sm';
            
        const titleColor = isGreen ? 'text-white' : 'text-[#014d4e]';
        const numberColor = isSalmon ? 'text-[#02696a]' : 'text-[#F0A17E]';
        const descriptionOpacity = isGreen ? 'text-white/80' : isSalmon ? 'text-[#014d4e]/75' : 'text-on-surface-variant';
        
        const btnStyle = isGreen 
          ? 'bg-[#F0A17E] text-white hover:bg-white hover:text-[#F0A17E]' 
          : isSalmon 
            ? 'bg-[#014d4e] text-white hover:bg-[#02696a] hover:text-white' 
            : 'bg-[#014d4e] text-white hover:bg-[#F0A17E] hover:text-white';

        const sectionZIndex = isGreen ? 'z-30' : isLight ? 'z-20' : 'z-10';
        const sectionShadow = isGreen 
          ? 'shadow-[0_20px_50px_rgba(0,0,0,0.25)]' 
          : isLight 
            ? 'shadow-[0_20px_50px_rgba(0,0,0,0.08)]' 
            : 'shadow-[0_20px_50px_rgba(0,0,0,0.15)]';

        return (
          <section
            key={cat.id}
            id={cat.id}
            className={`pt-48 pb-32 -mt-24 relative overflow-hidden transition-colors duration-500 rounded-b-[4rem] lg:rounded-b-[6rem] ${sectionZIndex} ${sectionShadow} ${sectionBg}`}
          >
            {/* Background Texture for Light Section */}
            {isLight && (
              <div className="absolute inset-0 opacity-5 pointer-events-none" style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/cubes.png")' }} />
            )}

            <div className="max-w-7xl mx-auto px-6 relative z-10">
              <div className={`flex flex-col lg:flex-row gap-20 items-stretch ${idx % 2 !== 0 ? 'lg:flex-row-reverse' : ''}`}>
                
                {/* Text Content */}
                <div className="lg:w-1/2 flex flex-col z-20 py-10">
                  <div className={`w-20 h-20 rounded-3xl flex items-center justify-center mb-10 shadow-2xl border border-white/20 transform rotate-3 ${
                    isGreen ? 'bg-tertiary/20 text-tertiary' : isSalmon ? 'bg-[#014d4e]/10 text-[#014d4e]' : 'bg-[#014d4e]/10 text-[#014d4e]'
                    }`}>
                      <span className="material-symbols-outlined text-5xl">
                        {isGreen ? 'clinical_notes' : isSalmon ? 'auto_awesome' : 'medical_services'}
                      </span>
                    </div>
                  
                  <div className="mb-12">
                    <h2 className={`text-4xl md:text-5xl md:text-7xl font-headline font-extrabold tracking-tighter mb-8 leading-none ${titleColor}`}>
                      {cat.name}
                    </h2>
                    <div className={`h-[4px] w-24 mb-10 ${dividerBg}`} />
                    <p className={`text-2xl leading-relaxed font-serif italic mb-12 ${descriptionOpacity}`}>
                      {cat.description}
                    </p>
                  </div>
                  
                  {/* Detailed Treatments List */}
                  <div className="grid grid-cols-1 gap-6 mb-16">
                    {cat.services.map((service, sIdx) => (
                      <motion.div 
                        whileHover={{ x: 15 }}
                        key={sIdx} 
                        className={`p-8 rounded-3xl border transition-all duration-300 ${cardBg}`}
                      >
                        <div className="flex items-start gap-6">
                          <span className={`font-headline font-bold text-3xl ${numberColor}`}>
                            0{sIdx + 1}
                          </span>
                          <div>
                            <h4 className={`text-xl font-bold tracking-wide mb-2 ${titleColor}`}>
                              {service.name}
                            </h4>
                            <p className={`text-base leading-relaxed ${isGreen ? 'text-white/70' : isSalmon ? 'text-[#014d4e]/70' : 'text-on-surface-variant/80'}`}>
                              {service.description}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  <Link
                    href="/reservar"
                    className={`w-fit inline-flex items-center gap-4 px-12 py-6 rounded-full font-bold transition-all shadow-xl group ${btnStyle}`}
                  >
                    Solicitar Información
                    <span className="material-symbols-outlined transition-transform group-hover:translate-x-2">arrow_forward</span>
                  </Link>
                </div>
                
                {/* 4-Image Full-Height Collage */}
                <div className="lg:w-1/2 relative w-full min-h-[1200px] hidden lg:block">
                  
                  {/* Image 1 (Top Right) */}
                  <motion.div 
                    initial={{ y: 50, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    viewport={{ once: true, margin: "-100px" }}
                    className="absolute top-0 right-0 w-[80%] h-[350px] rounded-2xl overflow-hidden shadow-[0_40px_80px_-20px_rgba(0,0,0,0.4)] border-4 border-white/30 transform rotate-2 z-20"
                  >
                    <Image src={cat.imageUrl} alt={cat.name} fill className="object-cover" />
                    <div className={`absolute inset-0 bg-gradient-to-t ${isSalmon ? 'from-[#014d4e]/40' : 'from-black/40'} to-transparent`} />
                  </motion.div>

                  {/* Image 2 (Upper Middle Left) */}
                  <motion.div 
                    initial={{ x: -50, opacity: 0 }}
                    whileInView={{ x: 0, opacity: 1 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ delay: 0.1 }}
                    className="absolute top-[22%] left-0 w-[75%] h-[400px] rounded-2xl overflow-hidden shadow-[0_40px_80px_-20px_rgba(0,0,0,0.5)] border-4 border-white/40 transform -rotate-3 z-30"
                  >
                    <Image src={cat.imageUrl2} alt={cat.name} fill className="object-cover" />
                    <div className={`absolute inset-0 bg-gradient-to-t ${isSalmon ? 'from-[#014d4e]/30' : 'from-black/30'} to-transparent`} />
                  </motion.div>

                  {/* Image 3 (Lower Middle Right) */}
                  <motion.div 
                    initial={{ x: 50, opacity: 0 }}
                    whileInView={{ x: 0, opacity: 1 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ delay: 0.2 }}
                    className="absolute top-[55%] right-0 w-[85%] h-[350px] rounded-2xl overflow-hidden shadow-[0_40px_80px_-20px_rgba(0,0,0,0.3)] border-4 border-white/20 transform rotate-1 z-10"
                  >
                    <Image src={cat.imageUrl3} alt={cat.name} fill className="object-cover" />
                    <div className={`absolute inset-0 ${isLight ? 'bg-primary-container/10' : 'bg-primary-container/20'}`} />
                  </motion.div>
                  
                  {/* Image 4 (Bottom Left) */}
                  <motion.div 
                    initial={{ y: 50, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ delay: 0.3 }}
                    className="absolute bottom-0 left-5 w-[85%] h-[450px] rounded-2xl overflow-hidden shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] border-4 border-white/50 transform -rotate-1 z-40"
                  >
                    <Image src={cat.imageUrl4} alt={cat.name} fill className="object-cover" />
                    <div className={`absolute inset-0 bg-gradient-to-t ${isSalmon ? 'from-[#014d4e]/50' : 'from-black/50'} to-transparent`} />
                  </motion.div>

                  {/* Decorative Elements */}
                  <div className={`absolute top-[10%] -left-10 w-64 h-64 rounded-full opacity-10 blur-3xl pointer-events-none ${isGreen ? 'bg-white' : isSalmon ? 'bg-white' : 'bg-tertiary'}`} />
                  <div className={`absolute bottom-[20%] -right-10 w-80 h-80 rounded-full opacity-10 blur-3xl pointer-events-none ${isGreen ? 'bg-tertiary' : isSalmon ? 'bg-[#014d4e]' : 'bg-[#014d4e]'}`} />
                </div>

                {/* Mobile Fallback Image Display */}
                <div className="w-full flex lg:hidden flex-col gap-6 mt-10">
                   <div className="relative w-full h-[300px] rounded-2xl overflow-hidden shadow-2xl border-2 border-white/20">
                     <Image src={cat.imageUrl} alt={cat.name} fill className="object-cover" />
                   </div>
                   <div className="relative w-full h-[300px] rounded-2xl overflow-hidden shadow-2xl border-2 border-white/20">
                     <Image src={cat.imageUrl4} alt={cat.name} fill className="object-cover" />
                   </div>
                </div>

              </div>
            </div>
          </section>
        )
      })}
    </main>
  )
}
