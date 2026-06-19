'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { getFeaturedProducts } from '@/data/products'
import { getSiteContent } from '@/lib/api'

const DEFAULTS = {
  title: 'Tienda.',
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

  return (
    <section className="py-32 bg-transparent">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
          <div>
            <h2 className="text-5xl font-headline font-extrabold tracking-tight">{content.title}</h2>
            <p className="text-on-surface-variant text-xl mt-4 max-w-md">
              {content.subtitle}
            </p>
          </div>
          <Link
            href={content.ctaLink}
            className="flex items-center gap-3 font-bold text-primary group"
          >
            {content.ctaText}
            <span className="material-symbols-outlined group-hover:translate-x-2 transition-transform">
              trending_flat
            </span>
          </Link>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 md:grid-rows-2 gap-6 md:h-[700px]">
          {/* Large Feature Card */}
          {mainProduct && (
            <div className="md:col-span-2 md:row-span-2 bg-white rounded-5xl p-12 flex flex-col justify-between shadow-sm border border-slate-100 hover:shadow-2xl transition-all duration-500 hover:-translate-y-3 group cursor-pointer border-b-4 hover:border-b-primary">
              <div className="space-y-6">
                <span 
                  className="px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest"
                  style={{ backgroundColor: 'rgba(2, 105, 106, 0.1)', color: '#02696a' }}
                >
                  Destacado
                </span>
                <h3 className="text-4xl font-headline font-bold leading-tight whitespace-pre-line">
                  {mainProduct.name}
                </h3>
                <p className="text-on-surface-variant text-lg font-bold" style={{ color: '#02696a' }}>
                  S/ {mainProduct.price.toFixed(2)}
                </p>
                <p className="text-on-surface-variant text-base opacity-70">
                  Categoría: {mainProduct.category}
                </p>
              </div>
              <div className="relative flex justify-center mt-8">
                <div className="absolute inset-0 bg-primary/5 rounded-full blur-3xl scale-75" />
                <Image
                  src={mainProduct.imageUrl || 'https://images.unsplash.com/photo-1629198688000-71f23e745b6e?auto=format&fit=crop&q=80&w=800'}
                  alt={mainProduct.name}
                  width={240}
                  height={288}
                  className="h-72 w-auto object-cover rounded-xl relative z-10 group-hover:scale-105 transition-transform duration-500"
                />
              </div>
            </div>
          )}

          {/* Small Product Cards */}
          {secondaryProducts.map(product => (
            <div
              key={product.id}
              className="md:col-span-1 bg-surface-container-lowest rounded-5xl p-8 flex flex-col justify-between shadow-sm hover:shadow-2xl transition-all duration-500 hover:-translate-y-3 group min-h-[300px] cursor-pointer"
            >
              <div className="flex-1 flex items-center justify-center mb-6">
                <Image
                  src={product.imageUrl || 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?auto=format&fit=crop&q=80&w=800'}
                  alt={product.name}
                  width={160}
                  height={160}
                  className="h-40 w-auto object-cover rounded-lg group-hover:-translate-y-2 transition-transform duration-500"
                />
              </div>
              <div>
                <h4 className="font-bold text-sm mb-2">{product.name}</h4>
                <div className="flex justify-between items-center mt-2">
                  <span className="font-bold" style={{ color: '#02696a' }}>S/ {product.price.toFixed(2)}</span>
                  <button
                    className="text-white p-2 rounded-full leading-none transition-colors hover:scale-110"
                    style={{ backgroundColor: '#02696a' }}
                    aria-label={`Agregar ${product.name} al carrito`}
                  >
                    <span className="material-symbols-outlined text-sm">add</span>
                  </button>
                </div>
              </div>
            </div>
          ))}

          {/* CTA Banner */}
          <div 
            className="md:col-span-2 text-white rounded-5xl p-10 flex items-center gap-8 overflow-hidden relative group shadow-sm hover:shadow-2xl transition-all duration-500 hover:-translate-y-3 cursor-pointer"
            style={{ backgroundColor: '#02696a' }}
          >
            <div className="relative z-10 flex-1">
              <h3 className="text-2xl font-bold mb-2 italic">{content.bannerTitle}</h3>
              <p className="text-white/80 text-sm mb-4">
                {content.bannerSubtitle}
              </p>
              <Link
                href={content.bannerBtnLink}
                className="bg-white px-6 py-3 rounded-full font-bold text-sm hover:scale-105 transition-all inline-block"
                style={{ color: '#02696a' }}
              >
                {content.bannerBtnText}
              </Link>
            </div>
            <div className="relative z-10 w-24 h-24 bg-white/20 rounded-full flex items-center justify-center">
              <span className="material-symbols-outlined text-4xl">contact_support</span>
            </div>
            <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -mr-10 -mt-10 group-hover:scale-150 transition-transform duration-700" />
          </div>
        </div>
      </div>
    </section>
  )
}
