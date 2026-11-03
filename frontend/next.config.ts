import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    minimumCacheTTL: 2592000, // Cachear imágenes optimizadas por 30 días para proteger la cuota de transferencia (egress) de Supabase Free
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'gsyvzfkkqiucaeinyddc.supabase.co',
      },
    ],
  },
}

export default nextConfig
