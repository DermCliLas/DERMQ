import type { Metadata } from 'next'
import { Inter, Manrope } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'

// ─── Fonts ───────────────────────────────────────────────────────────────────

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const manrope = Manrope({
  subsets: ['latin'],
  variable: '--font-manrope',
  display: 'swap',
})

export async function generateMetadata(): Promise<Metadata> {
  const DEFAULTS = {
    titleDefault: 'DERMQ — Clínica Dermatológica de Vanguardia',
    titleTemplate: '%s | DERMQ',
    description: 'DERMQ fusiona precisión clínica y estética avanzada para revelar tu luminosidad natural. Especialistas en dermatología clínica, estética y cirugía cutánea en Lima, Perú.',
    keywords: 'dermatología, clínica dermatológica, estética facial, tratamientos piel, Lima, Perú, DERMQ',
    ogTitle: 'DERMQ — Clínica Dermatológica de Vanguardia',
    ogDescription: 'Fusionamos precisión clínica y estética avanzada para revelar tu luminosidad natural.',
    robotsIndex: true,
    robotsFollow: true,
  }

  let seoData = DEFAULTS
  try {
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api/v1'
    const res = await fetch(`${API_BASE_URL}/site-content/seo`, {
      next: { revalidate: 60 }, // cache for 60 seconds
    })
    if (res.ok) {
      const json = await res.json()
      const data = json.success && json.data ? json.data : json
      if (data) seoData = { ...DEFAULTS, ...data }
    }
  } catch (err) {
    // Fallback if backend is not reachable during build time
  }

  return {
    title: {
      default: seoData.titleDefault,
      template: seoData.titleTemplate,
    },
    description: seoData.description,
    keywords: seoData.keywords.split(',').map((k) => k.trim()),
    openGraph: {
      type: 'website',
      locale: 'es_PE',
      siteName: 'DERMQ',
      title: seoData.ogTitle,
      description: seoData.ogDescription,
    },
    robots: {
      index: seoData.robotsIndex,
      follow: seoData.robotsFollow,
    },
  }
}

import { AuthProvider } from '@/context/AuthContext'
import { CartProvider } from '@/context/CartContext'

// ─── Root Layout ──────────────────────────────────────────────────────────────

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es" className={`${inter.variable} ${manrope.variable}`}>
      <head>
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Filled:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap" />
      </head>
      <body className="bg-background text-on-surface font-body antialiased overflow-x-hidden">
        <AuthProvider>
          <CartProvider>
            <Navbar />
            <div className="flex flex-col min-h-screen">
              {children}
            </div>
            <Footer />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
