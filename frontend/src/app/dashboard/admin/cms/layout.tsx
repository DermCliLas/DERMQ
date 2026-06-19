'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'

const CMS_NAV = [
  { label: 'Vista General', href: '/dashboard/admin/cms', icon: 'dashboard' },
  { label: 'Hero / Carrusel', href: '/dashboard/admin/cms/hero', icon: 'view_carousel' },
  { label: 'Servicios', href: '/dashboard/admin/cms/servicios', icon: 'medical_services' },
  { label: 'Expertise', href: '/dashboard/admin/cms/expertise', icon: 'psychology' },
  { label: 'Nuestra Promesa', href: '/dashboard/admin/cms/promesa', icon: 'volunteer_activism' },
  { label: 'Tienda Home', href: '/dashboard/admin/cms/tienda', icon: 'storefront' },
  { label: 'Testimonios', href: '/dashboard/admin/cms/testimonios', icon: 'rate_review' },
  { label: 'Integraciones', href: '/dashboard/admin/cms/integraciones', icon: 'hub' },
  { label: 'Ubicación', href: '/dashboard/admin/cms/ubicacion', icon: 'location_on' },
  { label: 'Footer', href: '/dashboard/admin/cms/footer', icon: 'bottom_navigation' },
  { label: 'Navbar', href: '/dashboard/admin/cms/navbar', icon: 'menu' },
  { label: 'SEO & Metadata', href: '/dashboard/admin/cms/seo', icon: 'travel_explore' },
]

export default function CmsLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const { user, isAuthenticated, isLoading } = useAuth()

  useEffect(() => {
    if (!isLoading && (!isAuthenticated || user?.role !== 'ADMIN')) {
      router.push('/dashboard')
    }
  }, [isLoading, isAuthenticated, user, router])

  if (isLoading || !isAuthenticated || user?.role !== 'ADMIN') {
    return (
      <main className="pt-40 pb-24 min-h-screen bg-[#F2F4F4] flex flex-col items-center justify-center">
        <span className="w-10 h-10 border-4 border-slate-200 border-t-primary rounded-full animate-spin mb-4" />
        <p className="font-semibold text-slate-500">Cargando panel CMS...</p>
      </main>
    )
  }

  return (
    <div className="flex min-h-screen" style={{ marginTop: '-105px', paddingTop: '105px' }}>
      {/* Sidebar */}
      <aside className="w-[260px] bg-[#1a1c1e] text-white flex flex-col shrink-0 fixed top-[105px] bottom-0 left-0 z-30 overflow-y-auto">
        {/* Sidebar Header */}
        <div className="px-6 pt-8 pb-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
              <span className="material-symbols-outlined text-primary text-xl">edit_note</span>
            </div>
            <div>
              <h2 className="font-bold text-sm tracking-wide">DermQ CMS</h2>
              <p className="text-[10px] text-white/40 font-medium uppercase tracking-widest">Gestor de Contenido</p>
            </div>
          </div>
        </div>

        {/* Nav Items */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {CMS_NAV.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-primary/20 text-primary'
                    : 'text-white/60 hover:text-white hover:bg-white/5'
                }`}
              >
                <span className={`material-symbols-outlined text-lg ${isActive ? 'text-primary' : ''}`}>
                  {item.icon}
                </span>
                {item.label}
              </Link>
            )
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="px-6 py-6 border-t border-white/10 space-y-3">
          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-2 text-xs text-white/40 hover:text-primary transition-colors font-medium"
          >
            <span className="material-symbols-outlined text-sm">open_in_new</span>
            Ver Sitio Público
          </Link>
          <Link
            href="/dashboard/admin"
            className="flex items-center gap-2 text-xs text-white/40 hover:text-white transition-colors font-medium"
          >
            <span className="material-symbols-outlined text-sm">arrow_back</span>
            Volver al Dashboard
          </Link>
          <div className="flex items-center gap-2 pt-2">
            <div className="w-8 h-8 rounded-full bg-primary/30 flex items-center justify-center">
              <span className="material-symbols-outlined text-primary text-sm">person</span>
            </div>
            <div>
              <p className="text-xs font-bold text-white/80">{user?.firstName} {user?.lastName}</p>
              <p className="text-[10px] text-white/30">Administrador</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-[260px] bg-[#F2F4F4] min-h-screen">
        <div className="max-w-6xl mx-auto px-8 py-10">
          {children}
        </div>
      </main>
    </div>
  )
}
