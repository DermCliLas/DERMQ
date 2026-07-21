'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { getFeaturedProducts } from '@/data/products'
import { getSiteContent } from '@/lib/api'
import { motion } from 'framer-motion'

const DEFAULTS = {
  title: 'Boutique.',
  subtitle: 'Selección dermatológica de grado clínico para tu tratamiento en casa.',
  ctaText: 'Ver catálogo completo',
  ctaLink: '/productos',
  bannerTitle: '¿No sabes qué elegir?',
  bannerSubtitle: 'Consulta con nuestros especialistas sobre el tratamiento ideal.',
  bannerBtnText: 'Agendar Cita',
  bannerBtnLink: '/reservar',
}

export default function ShopBento() {
  const [content, setContent] = useState(DEFAULTS)

  useEffect(() => {
    getSiteContent('shop')
      .then((data) => {
        if (data?.data) setContent({ ...DEFAULTS, ...data.data })
      })
      .catch((err) => console.error('Error fetching Tienda content:', err))
  }, [])

  const featuredProducts = getFeaturedProducts().slice(0, 3);
  const mainProduct = featuredProducts[0];
  const secondaryProducts = featuredProducts.slice(1);

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.15
      }
    }
  }

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.97, y: 40 },
    visible: { 
      opacity: 1, 
      scale: 1,
      y: 0,
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as any }
    }
  }

  return (
    <section className="pt-12 pb-40 bg-gradient-to-b from-[#faf8f5] via-[#f5f0eb] to-[#faf8f5] relative overflow-hidden">
      {/* Decorative luxury mesh glows */}
      <div className="absolute top-10 left-10 w-[600px] h-[600px] rounded-full bg-primary/5 blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[500px] h-[500px] rounded-full bg-tertiary/5 blur-[120px] pointer-events-none" />
      
      {/* Subtle brand golden pattern line (bottom only, top is covered by the new ElegantDivider) */}
      <div className="absolute left-0 right-0 bottom-0 h-[1px] bg-gradient-to-r from-transparent via-tertiary/20 to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Header - Editorial Style */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-24 gap-8 border-b border-tertiary/10 pb-8">
          <div>
            <span className="text-tertiary font-headline font-black tracking-[0.45em] uppercase text-[10px] block mb-4">
              Cuidado en Casa
            </span>
            <h2 className="text-5xl md:text-7xl font-headline font-black tracking-tight text-primary-container uppercase leading-none">
              Boutique <span className="font-serif italic font-light text-tertiary lowercase">dermocosmética</span>
            </h2>
            <p className="text-on-surface-variant/75 text-lg md:text-xl mt-6 max-w-xl font-serif italic leading-relaxed">
              {content.subtitle}
            </p>
          </div>
          <Link
            href={content.ctaLink}
            className="flex items-center gap-3 font-headline font-extrabold text-xs tracking-[0.3em] text-primary group border-b-2 border-primary/20 pb-3 hover:border-primary transition-all duration-300 uppercase shrink-0"
          >
            {content.ctaText}
            <span className="material-symbols-outlined group-hover:translate-x-2 transition-transform text-sm">
              trending_flat
            </span>
          </Link>
        </div>

        {/* Bento Grid */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-4 md:grid-rows-2 gap-8 md:h-[760px]"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {/* Large Feature Card (Premium Glass design) */}
          {mainProduct && (
            <motion.div 
              variants={cardVariants}
              className="md:col-span-2 md:row-span-2 bg-white/70 backdrop-blur-md rounded-5xl p-12 flex flex-col justify-between shadow-[0_24px_70px_rgba(2,105,106,0.06)] border border-white hover:shadow-[0_30px_90px_rgba(2,105,106,0.12)] transition-all duration-500 group cursor-pointer border-b-4 hover:border-b-tertiary relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-tertiary/5 rounded-full blur-3xl -mr-20 -mt-20 group-hover:bg-tertiary/10 transition-colors duration-700" />
              
              <div className="space-y-6 relative z-10">
                <span 
                  className="px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-[0.2em] inline-block border border-tertiary/30 bg-tertiary/5 text-tertiary-container shadow-sm"
                >
                  Destacado
                </span>
                <h3 className="text-3xl lg:text-4xl font-headline font-bold leading-tight text-primary-container group-hover:text-primary transition-colors">
                  {mainProduct.name}
                </h3>
                <p className="text-4xl font-black font-headline text-primary-container">
                  S/ {mainProduct.price.toFixed(2)}
                </p>
                <div className="h-[1px] w-12 bg-tertiary/30 group-hover:w-32 transition-all duration-700" />
                <p className="text-[10px] uppercase font-bold tracking-widest text-[#8c8c94]">
                  Categoría: {mainProduct.category}
                </p>
              </div>

              {/* Luxury Elliptical Pedestal */}
              <div className="relative flex justify-center mt-12 mb-8 select-none">
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-3/5 h-8 bg-tertiary/10 rounded-full blur-md opacity-70 group-hover:bg-tertiary/20 group-hover:scale-110 transition-all duration-700 pointer-events-none" />
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-1/2 h-4 border border-tertiary/20 rounded-full transform rotate-x-60 opacity-60 group-hover:scale-105 transition-all duration-700 pointer-events-none" />
                <Image
                  src={mainProduct.imageUrl || 'https://images.unsplash.com/photo-1629198688000-71f23e745b6e?auto=format&fit=crop&q=80&w=800'}
                  alt={mainProduct.name}
                  width={240}
                  height={288}
                  className="h-64 md:h-72 w-auto object-cover rounded-2xl relative z-10 group-hover:scale-110 group-hover:-translate-y-6 group-hover:rotate-3 transition-all duration-700 ease-out filter drop-shadow-[0_20px_40px_rgba(0,0,0,0.15)]"
                />
              </div>
            </motion.div>
          )}

          {/* Small Product Cards */}
          {secondaryProducts.map(product => (
            <motion.div
              key={product.id}
              variants={cardVariants}
              className="md:col-span-1 bg-white/90 backdrop-blur-xl border border-white rounded-5xl p-8 flex flex-col justify-between shadow-[0_20px_50px_rgba(0,0,0,0.015)] hover:shadow-[0_32px_80px_rgba(140,78,49,0.06)] hover:border-tertiary/20 transition-all duration-700 group min-h-[340px] cursor-pointer relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-2xl -mr-10 -mt-10 group-hover:bg-primary/10 transition-colors" />

              <div className="flex-1 flex items-center justify-center mb-6 relative select-none">
                <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-4/5 h-4 bg-primary/5 rounded-full blur-md group-hover:bg-primary/10 transition-colors pointer-events-none" />
                <Image
                  src={product.imageUrl || 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?auto=format&fit=crop&q=80&w=800'}
                  alt={product.name}
                  width={160}
                  height={160}
                  className="h-36 md:h-40 w-auto object-cover rounded-xl group-hover:scale-110 group-hover:-translate-y-4 group-hover:-rotate-3 transition-all duration-700 ease-out z-10 filter drop-shadow-[0_15px_30px_rgba(0,0,0,0.1)]"
                />
              </div>

              <div className="px-2">
                <h4 className="font-headline font-bold text-sm md:text-base text-primary-container mb-4 group-hover:text-primary transition-colors min-h-[48px] line-clamp-2 leading-snug">
                  {product.name}
                </h4>
                <div className="flex justify-between items-center mt-2 pb-2">
                  <span className="font-bold text-[#02696a] text-lg">S/ {product.price.toFixed(2)}</span>
                  {/* Micro-interactive purchase button */}
                  <div className="relative group/btn cursor-pointer">
                    <button
                      className="text-white h-10 w-10 group-hover/btn:w-28 rounded-full bg-[#02696a] hover:bg-tertiary flex items-center justify-center transition-all duration-500 overflow-hidden px-3 gap-2 shadow-md shadow-primary/10"
                      aria-label={`Agregar ${product.name} al carrito`}
                    >
                      <span className="material-symbols-outlined text-sm font-bold shrink-0">add</span>
                      <span className="hidden group-hover/btn:inline text-[9px] font-black uppercase tracking-[0.2em] shrink-0 transition-opacity duration-300">
                        Comprar
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}

          {/* CTA Banner (Luxury Velvet Editorial) */}
          <motion.div 
            variants={cardVariants}
            className="md:col-span-2 text-white rounded-5xl p-12 flex flex-col md:flex-row items-center gap-8 overflow-hidden relative group shadow-[0_24px_70px_rgba(2,105,106,0.06)] hover:shadow-[0_32px_90px_rgba(2,105,106,0.16)] transition-all duration-700 hover:-translate-y-1.5 cursor-pointer bg-gradient-to-br from-[#002122] via-[#02696a] to-[#3a3550]"
          >
            <div className="relative z-10 flex-1">
              <span className="text-[9px] uppercase font-black tracking-[0.25em] text-tertiary bg-white/5 border border-white/10 px-4 py-1.5 rounded-full inline-block mb-5">
                Diagnóstico Experto
              </span>
              <h3 className="text-2xl md:text-4xl font-headline font-bold mb-4 leading-tight">{content.bannerTitle}</h3>
              <p className="text-teal-100/80 text-sm md:text-base mb-8 leading-relaxed font-serif italic max-w-md">
                {content.bannerSubtitle}
              </p>
              <Link
                href={content.bannerBtnLink}
                className="bg-white text-primary-container px-10 py-4 rounded-full font-headline font-bold text-xs uppercase tracking-widest hover:bg-tertiary hover:text-primary-container hover:scale-105 active:scale-95 transition-all inline-block shadow-lg"
              >
                {content.bannerBtnText}
              </Link>
            </div>

            <div className="relative z-10 w-24 h-24 bg-white/5 border border-white/10 rounded-full flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform duration-500">
              <span className="material-symbols-outlined text-4xl text-white animate-float">contact_support</span>
            </div>

            <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -mr-24 -mt-24 group-hover:scale-125 transition-transform duration-[1500ms]" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
