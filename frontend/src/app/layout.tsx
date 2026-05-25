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

// ─── Metadata ─────────────────────────────────────────────────────────────────

export const metadata: Metadata = {
  title: {
    default: 'DERMQ — Clínica Dermatológica de Vanguardia',
    template: '%s | DERMQ',
  },
  description:
    'DERMQ fusiona precisión clínica y estética avanzada para revelar tu luminosidad natural. Especialistas en dermatología clínica, estética y cirugía cutánea en Lima, Perú.',
  keywords: [
    'dermatología',
    'clínica dermatológica',
    'estética facial',
    'tratamientos piel',
    'Lima',
    'Perú',
    'DERMQ',
  ],
  openGraph: {
    type: 'website',
    locale: 'es_PE',
    siteName: 'DERMQ',
    title: 'DERMQ — Clínica Dermatológica de Vanguardia',
    description:
      'Fusionamos precisión clínica y estética avanzada para revelar tu luminosidad natural.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

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
