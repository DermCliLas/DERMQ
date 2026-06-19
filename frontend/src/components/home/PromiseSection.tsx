'use client'

import { useEffect, useState } from 'react'
import OrganicDivider from '@/components/ui/OrganicDivider'
import { getSiteContent } from '@/lib/api'

const DEFAULTS = {
  label: 'Nuestra Promesa',
  quote: '\u201cElevamos el estándar de la salud cutánea a través de la empatía y la innovación.\u201d',
  stat1Value: '15+', stat1Label: 'Años',
  stat2Value: '10k', stat2Label: 'Pacientes',
  stat3Value: '98%', stat3Label: 'Satisfacción',
}

export default function PromiseSection() {
  const [data, setData] = useState(DEFAULTS)

  useEffect(() => {
    async function load() {
      try {
        const content = await getSiteContent('promise')
        if (content?.data) setData({ ...DEFAULTS, ...content.data })
      } catch { /* fallback */ }
    }
    load()
  }, [])

  return (
    <section className="bg-transparent py-40 text-[#002020] overflow-hidden relative">
      <OrganicDivider type="slope" fill="#f8fafa" flip />
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="max-w-4xl">
          <span className="uppercase tracking-[0.3em] font-bold text-xs opacity-70 mb-6 block">
            {data.label}
          </span>
          <h2 className="text-5xl md:text-7xl font-headline font-extrabold leading-tight mb-12">
            {data.quote}
          </h2>
          <div className="flex items-center gap-12">
            <div className="flex flex-col">
              <span className="text-6xl font-headline font-extrabold">{data.stat1Value}</span>
              <span className="text-sm uppercase tracking-widest font-bold opacity-60 mt-2">
                {data.stat1Label}
              </span>
            </div>
            <div className="w-px h-16 bg-black/20" />
            <div className="flex flex-col">
              <span className="text-6xl font-headline font-extrabold">{data.stat2Value}</span>
              <span className="text-sm uppercase tracking-widest font-bold opacity-60 mt-2">
                {data.stat2Label}
              </span>
            </div>
            <div className="w-px h-16 bg-black/20" />
            <div className="flex flex-col">
              <span className="text-6xl font-headline font-extrabold">{data.stat3Value}</span>
              <span className="text-sm uppercase tracking-widest font-bold opacity-60 mt-2">
                {data.stat3Label}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
