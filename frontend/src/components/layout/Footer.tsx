'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { getSiteContent } from '@/lib/api'

interface LinkItem {
  label: string
  href: string
}

interface FooterContent {
  brandName: string
  brandDescription: string
  facebookUrl: string
  instagramUrl: string
  linkedinUrl: string
  twitterUrl: string
  companyLinks: LinkItem[]
  serviceLinks: LinkItem[]
  address: string
  phone: string
  email: string
  ctaText: string
  ctaLink: string
  privacyText: string
  privacyLink: string
  termsText: string
  termsLink: string
}

const DEFAULTS: FooterContent = {
  brandName: 'DERMQ',
  brandDescription: 'Líderes en dermatología avanzada. Fusionamos rigor científico con una visión estética premium para el cuidado integral de tu piel.',
  facebookUrl: '#',
  instagramUrl: '#',
  linkedinUrl: '#',
  twitterUrl: '#',
  companyLinks: [
    { label: 'Nuestra Historia', href: '/nosotros' },
    { label: 'Cuerpo Médico', href: '/nosotros#equipo' },
    { label: 'Instalaciones', href: '/servicios#tecnologia' },
    { label: 'Sedes', href: '/contacto' },
  ],
  serviceLinks: [
    { label: 'Dermatología Clínica', href: '/servicios' },
    { label: 'Estética Avanzada', href: '/servicios#estetica' },
    { label: 'Cirugía Cutánea', href: '/servicios#cirugia' },
    { label: 'Láser & Cabina', href: '/servicios#laser' },
  ],
  address: 'Av. Camino Real 1234, San Isidro, Lima.',
  phone: '+51 1 234 5678',
  email: 'informes@dermq.pe',
  ctaText: 'Escríbenos',
  ctaLink: '/contacto',
  privacyText: 'Aviso de Privacidad',
  privacyLink: '#',
  termsText: 'Términos y Condiciones',
  termsLink: '#',
}

export default function Footer() {
  const [content, setContent] = useState<FooterContent>(DEFAULTS)

  useEffect(() => {
    getSiteContent('footer')
      .then((data) => {
        if (data?.data) setContent({ ...DEFAULTS, ...data.data })
      })
      .catch((err) => console.error('Error fetching Footer content:', err))
  }, [])

  return (
    <footer className="relative z-20 bg-[#02696a] text-white pt-24 pb-12 font-body border-t-4 border-tertiary">
      <div className="max-w-7xl mx-auto px-6">
        {/* Top Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-20">
          {/* Col 1: Brand */}
          <div className="space-y-8">
            <div className="text-4xl font-black tracking-widest font-headline text-tertiary">
              {content.brandName}
            </div>
            <p className="text-white/70 text-sm leading-relaxed max-w-xs font-serif italic">
              {content.brandDescription}
            </p>
            <div className="flex gap-4 pt-4">
              {[
                { icon: 'facebook', label: 'Facebook', href: content.facebookUrl },
                { icon: 'photo_camera', label: 'Instagram', href: content.instagramUrl },
                { icon: 'share', label: 'LinkedIn', href: content.linkedinUrl || '#' },
              ].map(social => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="w-10 h-10 rounded-full bg-tertiary/10 border border-tertiary/30 hover:bg-tertiary/30 flex items-center justify-center transition-all hover:scale-110 text-tertiary"
                >
                  <span className="material-symbols-outlined text-lg">{social.icon}</span>
                </a>
              ))}
            </div>
          </div>

          {/* Col 2: Company */}
          <div className="space-y-8">
            <h4 className="font-headline font-bold text-2xl tracking-wide text-tertiary border-b border-tertiary/30 pb-4">La Clínica</h4>
            <nav className="flex flex-col gap-5">
              {content.companyLinks.map(link => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-white/80 hover:text-tertiary transition-colors font-medium text-sm tracking-wider uppercase"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Col 3: Services */}
          <div className="space-y-8">
            <h4 className="font-headline font-bold text-2xl tracking-wide text-tertiary border-b border-tertiary/30 pb-4">Tratamientos</h4>
            <nav className="flex flex-col gap-5">
              {content.serviceLinks.map(link => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="text-white/80 hover:text-tertiary transition-colors font-medium text-sm tracking-wider uppercase"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Col 4: Contact */}
          <div className="space-y-8">
            <h4 className="font-headline font-bold text-2xl tracking-wide text-tertiary border-b border-tertiary/30 pb-4">Contáctanos</h4>
            <div className="flex flex-col gap-6">
              <div className="flex gap-4 items-start">
                <span className="material-symbols-outlined text-tertiary shrink-0">location_on</span>
                <p className="text-white/80 text-sm font-medium leading-relaxed font-serif whitespace-pre-line">
                  {content.address}
                </p>
              </div>
              <div className="flex gap-4 items-center">
                <span className="material-symbols-outlined text-tertiary">call</span>
                <p className="text-white/80 text-sm font-medium font-serif">{content.phone}</p>
              </div>
              <div className="flex gap-4 items-center">
                <span className="material-symbols-outlined text-tertiary">mail</span>
                <p className="text-white/80 text-sm font-medium font-serif">{content.email}</p>
              </div>
              <Link
                href={content.ctaLink}
                className="mt-4 bg-tertiary text-primary-container font-headline font-bold py-3 px-8 rounded-sm text-sm tracking-widest uppercase hover:bg-white transition-colors w-fit text-center"
              >
                {content.ctaText}
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-12 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8">
            <p className="text-xs text-white/50 font-medium tracking-widest uppercase font-headline">
              © {new Date().getFullYear()} {content.brandName} Clínica Dermatológica.
            </p>
            <div className="flex gap-6">
              <a
                href={content.privacyLink}
                className="text-[10px] uppercase font-bold text-white/40 tracking-[0.15em] hover:text-tertiary transition-colors"
              >
                {content.privacyText}
              </a>
              <a
                href={content.termsLink}
                className="text-[10px] uppercase font-bold text-white/40 tracking-[0.15em] hover:text-tertiary transition-colors"
              >
                {content.termsText}
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
