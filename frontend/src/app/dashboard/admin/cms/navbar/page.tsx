'use client'

import { useEffect, useState } from 'react'
import { getSiteContent, updateSiteContent } from '@/lib/api'
import CmsSaveButton from '@/components/ui/CmsSaveButton'

const DEFAULTS = {
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
  ctaHref: '/reservar',
}

export default function NavbarCmsPage() {
  const [data, setData] = useState(DEFAULTS)

  useEffect(() => {
    async function load() {
      const content = await getSiteContent('navbar')
      if (content?.data) setData({ ...DEFAULTS, ...content.data })
    }
    load()
  }, [])

  const handleSave = async () => { await updateSiteContent('navbar', data) }
  const update = (field: string, value: any) => setData(prev => ({ ...prev, [field]: value }))

  const updateLink = (side: 'linksLeft' | 'linksRight', index: number, field: string, value: string) => {
    const items = [...data[side]]
    items[index] = { ...items[index], [field]: value }
    update(side, items)
  }

  const addLink = (side: 'linksLeft' | 'linksRight') => {
    update(side, [...data[side], { label: '', href: '' }])
  }

  const removeLink = (side: 'linksLeft' | 'linksRight', index: number) => {
    update(side, data[side].filter((_, i) => i !== index))
  }

  const renderLinksList = (title: string, side: 'linksLeft' | 'linksRight') => (
    <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-[#1a1c1e] text-sm">{title}</h3>
        <button onClick={() => addLink(side)} className="text-primary text-xs font-bold flex items-center gap-1 hover:underline">
          <span className="material-symbols-outlined text-sm">add</span>Agregar
        </button>
      </div>
      <div className="space-y-3">
        {data[side].map((link, index) => (
          <div key={index} className="flex gap-3 items-center p-3 bg-slate-50 rounded-xl">
            <span className="text-sm font-black text-slate-300 w-6">#{index + 1}</span>
            <div className="flex-1 grid grid-cols-2 gap-3">
              <input type="text" value={link.label} onChange={(e) => updateLink(side, index, 'label', e.target.value)} placeholder="Label"
                className="px-3 py-2 bg-white border border-slate-100 rounded-lg text-xs focus:outline-none focus:border-primary" />
              <input type="text" value={link.href} onChange={(e) => updateLink(side, index, 'href', e.target.value)} placeholder="/ruta"
                className="px-3 py-2 bg-white border border-slate-100 rounded-lg text-xs focus:outline-none focus:border-primary" />
            </div>
            <button onClick={() => removeLink(side, index)}
              className="p-1 rounded-lg hover:bg-red-50 text-slate-300 hover:text-red-500 transition-colors">
              <span className="material-symbols-outlined text-sm">close</span>
            </button>
          </div>
        ))}
      </div>
    </div>
  )

  return (
    <div>
      <div className="flex items-center gap-3 mb-1">
        <span className="material-symbols-outlined text-primary text-2xl">menu</span>
        <h1 className="font-headline font-black text-3xl tracking-tighter text-[#1a1c1e]">Navbar</h1>
      </div>
      <p className="text-on-surface-variant text-sm ml-[40px] mb-10">Gestiona los links de navegación, el logo y el botón CTA.</p>

      <div className="space-y-6">
        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
          <h3 className="font-bold text-[#1a1c1e] mb-4 text-sm">Logo</h3>
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 rounded-full bg-white border-2 border-slate-200 flex items-center justify-center overflow-hidden">
              <img src={data.logoUrl} alt="Logo" className="w-[75%] h-[75%] object-contain" />
            </div>
            <div className="flex-1">
              <label className="block text-[10px] font-black text-[#1a1c1e] mb-1.5 uppercase tracking-wider">URL del Logo</label>
              <input type="text" value={data.logoUrl} onChange={(e) => update('logoUrl', e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-xl focus:outline-none focus:border-primary focus:bg-white transition-all text-sm text-[#1a1c1e]" />
            </div>
          </div>
        </div>

        {renderLinksList('Links — Lado Izquierdo', 'linksLeft')}
        {renderLinksList('Links — Lado Derecho', 'linksRight')}

        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
          <h3 className="font-bold text-[#1a1c1e] mb-4 text-sm">Botón CTA</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-black text-[#1a1c1e] mb-1.5 uppercase tracking-wider">Texto del botón</label>
              <input type="text" value={data.ctaText} onChange={(e) => update('ctaText', e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-xl focus:outline-none focus:border-primary focus:bg-white transition-all text-sm text-[#1a1c1e]" />
            </div>
            <div>
              <label className="block text-[10px] font-black text-[#1a1c1e] mb-1.5 uppercase tracking-wider">Redirección</label>
              <input type="text" value={data.ctaHref} onChange={(e) => update('ctaHref', e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-xl focus:outline-none focus:border-primary focus:bg-white transition-all text-sm text-[#1a1c1e]" />
            </div>
          </div>
        </div>
      </div>

      <CmsSaveButton onSave={handleSave} />
    </div>
  )
}
