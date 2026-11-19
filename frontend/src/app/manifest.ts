import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'DERMQ — Clínica Dermatológica de Vanguardia',
    short_name: 'DERMQ',
    description: 'Dermatología clínica, láser y cosmecéutica de vanguardia en Lima, Perú.',
    start_url: '/',
    display: 'standalone',
    background_color: '#02696a',
    theme_color: '#02696a',
    icons: [
      {
        src: '/icon.png',
        sizes: '512x512',
        type: 'image/png',
      },
      {
        src: '/apple-touch-icon.png',
        sizes: '180x180',
        type: 'image/png',
      },
    ],
  }
}
