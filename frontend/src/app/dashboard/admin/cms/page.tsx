'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { getAllSiteContent } from '@/lib/api'

const SECTIONS = [
  { key: 'hero', label: 'Hero / Carrusel', icon: 'view_carousel', description: 'Slides principales, títulos y botones del hero', href: '/dashboard/admin/cms/hero' },
  { key: 'services', label: 'Servicios', icon: 'medical_services', description: 'Categorías de servicio, imágenes y descripciones', href: '/dashboard/admin/cms/servicios' },
  { key: 'expertise', label: 'Expertise / Nosotros', icon: 'psychology', description: 'Imagen doctora, textos, estadísticas y badge', href: '/dashboard/admin/cms/expertise' },
  { key: 'promise', label: 'Nuestra Promesa', icon: 'volunteer_activism', description: 'Quote principal y cifras de impacto', href: '/dashboard/admin/cms/promesa' },
  { key: 'shop', label: 'Tienda Home', icon: 'storefront', description: 'Textos del header y CTA de la tienda', href: '/dashboard/admin/cms/tienda' },
  { key: 'testimonials', label: 'Testimonios', icon: 'rate_review', description: 'Imagen, quote, trust items', href: '/dashboard/admin/cms/testimonios' },
  { key: 'integrations', label: 'Integraciones', icon: 'hub', description: 'Iconos y labels de la barra', href: '/dashboard/admin/cms/integraciones' },
  { key: 'location', label: 'Ubicación', icon: 'location_on', description: 'Dirección, horarios, embed de Google Maps', href: '/dashboard/admin/cms/ubicacion' },
  { key: 'footer', label: 'Footer', icon: 'bottom_navigation', description: 'Links, datos de contacto, redes sociales', href: '/dashboard/admin/cms/footer' },
  { key: 'navbar', label: 'Navbar', icon: 'menu', description: 'Links de navegación y logo', href: '/dashboard/admin/cms/navbar' },
  { key: 'seo', label: 'SEO & Metadata', icon: 'travel_explore', description: 'Título, descripción, keywords, OpenGraph', href: '/dashboard/admin/cms/seo' },
]

export default function CmsOverviewPage() {
  const [siteContent, setSiteContent] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const data = await getAllSiteContent()
        setSiteContent(data)
      } catch (e) {
        console.error('Error loading site content', e)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const configuredSections = new Set(siteContent.map(s => s.section))

  return (
    <div>
      {/* Header */}
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-2">
          <span className="material-symbols-outlined text-primary text-3xl">edit_note</span>
          <h1 className="font-headline font-black text-3xl md:text-4xl tracking-tighter text-[#1a1c1e]">
            Gestor de Contenido
          </h1>
        </div>
        <p className="text-on-surface-variant text-sm ml-[42px]">
          Personaliza cada sección de tu sitio web. Los cambios se reflejan en tiempo real.
        </p>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-3 gap-4 mb-10">
        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center">
              <span className="material-symbols-outlined text-emerald-600 text-lg">check_circle</span>
            </div>
            <div>
              <span className="block text-2xl font-headline font-black text-[#1a1c1e]">{configuredSections.size}</span>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Configuradas</span>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center">
              <span className="material-symbols-outlined text-amber-600 text-lg">pending</span>
            </div>
            <div>
              <span className="block text-2xl font-headline font-black text-[#1a1c1e]">{SECTIONS.length - configuredSections.size}</span>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Pendientes</span>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
              <span className="material-symbols-outlined text-blue-600 text-lg">web</span>
            </div>
            <div>
              <span className="block text-2xl font-headline font-black text-[#1a1c1e]">{SECTIONS.length}</span>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Total Secciones</span>
            </div>
          </div>
        </div>
      </div>

      {/* Sections Grid */}
      {loading ? (
        <div className="py-20 flex flex-col items-center">
          <span className="w-10 h-10 border-4 border-slate-200 border-t-primary rounded-full animate-spin mb-4" />
          <p className="text-slate-500 font-medium text-sm">Cargando secciones...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {SECTIONS.map((section) => {
            const isConfigured = configuredSections.has(section.key)
            const lastContent = siteContent.find(s => s.section === section.key)
            return (
              <Link
                key={section.key}
                href={section.href}
                className="group bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-md hover:border-primary/30 transition-all duration-300 hover:-translate-y-1"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="w-11 h-11 rounded-xl bg-[#1a1c1e] flex items-center justify-center group-hover:bg-primary transition-colors duration-300">
                    <span className="material-symbols-outlined text-white text-lg">{section.icon}</span>
                  </div>
                  {isConfigured ? (
                    <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-[9px] font-black uppercase tracking-wider">
                      Activo
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-400 text-[9px] font-black uppercase tracking-wider">
                      Por defecto
                    </span>
                  )}
                </div>
                <h3 className="font-bold text-[#1a1c1e] mb-1">{section.label}</h3>
                <p className="text-xs text-on-surface-variant leading-relaxed mb-3">{section.description}</p>
                {lastContent && (
                  <p className="text-[10px] text-slate-400">
                    Última edición: {new Date(lastContent.updatedAt).toLocaleDateString('es-PE')}
                  </p>
                )}
                <div className="mt-4 flex items-center gap-1 text-primary text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                  Editar sección
                  <span className="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform">arrow_forward</span>
                </div>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
