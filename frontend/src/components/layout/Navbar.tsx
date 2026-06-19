'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import { useCart } from '@/context/CartContext'
import { getSiteContent } from '@/lib/api'

interface NavLink {
  label: string
  href: string
}

interface NavbarContent {
  logoUrl: string
  linksLeft: NavLink[]
  linksRight: NavLink[]
  ctaText: string
  ctaLink: string
}

const DEFAULTS: NavbarContent = {
  logoUrl: '/logo.png',
  linksLeft: [
    { label: 'Inicio', href: '/' },
    { label: 'Nosotros', href: '/nosotros' },
    { label: 'Servicios', href: '/servicios' },
  ],
  linksRight: [
    { label: 'Productos', href: '/productos' },
    { label: 'Portafolio', href: '/portafolio' },
    { label: 'Contacto', href: '/contacto' },
  ],
  ctaText: 'Reservar cita',
  ctaLink: '/reservar',
}

export default function Navbar() {
  const pathname = usePathname()
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const { isAuthenticated, logout } = useAuth()
  const { totalItems } = useCart()
  const [content, setContent] = useState<NavbarContent>(DEFAULTS)

  useEffect(() => {
    getSiteContent('navbar')
      .then((data) => {
        if (data) setContent({ ...DEFAULTS, ...data })
      })
      .catch((err) => console.error('Error fetching Navbar content:', err))
  }, [])

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    setMobileOpen(false)
  }, [pathname])

  return (
    <>
      <div
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 border-b border-white/10 ${
          scrolled ? 'bg-[#02696a]/90 backdrop-blur-xl shadow-2xl' : 'bg-[#02696a] backdrop-blur-xl'
        }`}
      >
        {/* Main Navbar Bar */}
        <nav className={`w-full relative flex items-center justify-center transition-all duration-500 ${scrolled ? 'h-[75px]' : 'h-[105px]'}`}>
          
          {/* Subtle Background Pattern */}
          <div className="absolute inset-0 opacity-5 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '24px 24px' }}></div>

          <div className="w-full max-w-[1400px] px-6 lg:px-12 flex items-center justify-between relative z-10">
            
            {/* Left Links */}
            <div className="hidden md:flex w-1/2 items-center justify-end gap-4 lg:gap-8 pr-[75px] lg:pr-[95px]">
              {content.linksLeft.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-sm lg:text-base transition-colors whitespace-nowrap ${
                    pathname === link.href
                      ? 'text-tertiary font-bold'
                      : 'text-white hover:text-tertiary font-medium'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Center Logo */}
            <div className={`flex-shrink-0 absolute left-1/2 -translate-x-1/2 z-50 transition-all duration-500 ${scrolled ? 'top-2' : 'top-4'}`}>
              <Link href="/" className="flex items-center justify-center group">
                <div className={`bg-white rounded-full flex items-center justify-center shadow-[0_8px_30px_rgb(0,0,0,0.3)] border-[4px] border-tertiary transition-all duration-500 overflow-hidden group-hover:scale-105 ${scrolled ? 'w-[100px] h-[100px]' : 'w-[140px] h-[140px]'}`}>
                  <img 
                    src={content.logoUrl || '/logo.png'} 
                    alt="Logo" 
                    className="w-[75%] h-[75%] object-contain"
                  />
                </div>
              </Link>
            </div>

            {/* Right Links & Actions */}
            <div className="hidden md:flex w-1/2 items-center justify-start gap-3 lg:gap-5 pl-[75px] lg:pl-[95px]">
              {content.linksRight.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-sm lg:text-base transition-colors whitespace-nowrap ${
                    pathname === link.href
                      ? 'text-tertiary font-bold'
                      : 'text-white hover:text-tertiary font-medium'
                  }`}
                >
                  {link.label}
                </Link>
              ))}

              <div className="flex items-center gap-2 lg:gap-4 ml-auto border-l border-white/20 pl-3 lg:pl-5">
                <Link
                  href="/carrito"
                  className="relative text-white hover:text-tertiary transition-colors"
                  aria-label="Carrito"
                >
                  <span className="material-symbols-outlined text-[22px] lg:text-[26px]">shopping_cart</span>
                  {totalItems > 0 && (
                    <span className="absolute -top-2 -right-2 bg-tertiary text-white text-[10px] font-bold w-4 h-4 lg:w-5 lg:h-5 flex items-center justify-center rounded-full">
                      {totalItems}
                    </span>
                  )}
                </Link>

                {isAuthenticated ? (
                  <div className="flex items-center gap-1 lg:gap-2">
                    <Link href="/dashboard" className="text-white hover:text-tertiary transition-colors">
                      <span className="material-symbols-outlined text-[22px] lg:text-[26px]">person</span>
                    </Link>
                    <button onClick={logout} className="text-white hover:text-red-400 transition-colors">
                      <span className="material-symbols-outlined text-[22px] lg:text-[26px]">logout</span>
                    </button>
                  </div>
                ) : (
                  <Link href="/login" className="text-white hover:text-tertiary transition-colors">
                    <span className="material-symbols-outlined text-[22px] lg:text-[26px]">login</span>
                  </Link>
                )}

                <Link
                  href={content.ctaLink}
                  className="bg-tertiary text-white px-3 lg:px-6 py-2 rounded-full font-bold text-[10px] lg:text-sm hover:bg-white hover:text-primary-container transition-all flex items-center gap-1 group shadow-lg whitespace-nowrap"
                >
                  {content.ctaText}
                  <span className="material-symbols-outlined text-base lg:text-lg transition-transform group-hover:translate-x-1 hidden xl:block">chevron_right</span>
                </Link>
              </div>
            </div>

            {/* Mobile Hamburger */}
            <div className="md:hidden flex flex-1 justify-end">
              <button
                className="p-2 text-white hover:text-tertiary transition-colors"
                onClick={() => setMobileOpen(!mobileOpen)}
              >
                <span className="material-symbols-outlined text-3xl">
                  {mobileOpen ? 'close' : 'menu'}
                </span>
              </button>
            </div>
          </div>
        </nav>
      </div>

      {/* Spacer to prevent content from going under the navbar since it's fixed */}
      <div className="h-[105px] w-full" style={{ background: '#02696a' }} />

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 bg-primary-container/98 backdrop-blur-xl flex flex-col pt-32 px-8 pb-12">
          <nav className="flex flex-col gap-8 items-center flex-1">
            {[...content.linksLeft, ...content.linksRight].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-2xl font-semibold text-white hover:text-tertiary transition-colors"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href={content.ctaLink}
              className="mt-8 bg-tertiary text-white px-8 py-4 rounded-full font-bold text-xl flex items-center justify-center gap-2 w-full max-w-xs"
            >
              {content.ctaText}
              <span className="material-symbols-outlined">chevron_right</span>
            </Link>
          </nav>
        </div>
      )}
    </>
  )
}
