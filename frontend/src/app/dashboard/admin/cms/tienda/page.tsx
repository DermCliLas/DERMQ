'use client'

import { useEffect, useState } from 'react'
import { getSiteContent, updateSiteContent } from '@/lib/api'
import CmsSaveButton from '@/components/ui/CmsSaveButton'

const DEFAULTS = {
  title: 'Tienda.',
  subtitle: 'Selección dermatológica de grado clínico para tu tratamiento en casa.',
  ctaLinkText: 'Ver catálogo completo',
  ctaLinkHref: '/productos',
  bannerTitle: '¿No sabes qué elegir?',
  bannerSubtitle: 'Consulta con nuestros especialistas sobre el tratamiento ideal.',
  bannerButtonText: 'Agendar Cita',
  bannerButtonHref: '/reservar',
}

export default function TiendaCmsPage() {
  const [data, setData] = useState(DEFAULTS)

  useEffect(() => {
    async function load() {
      const content = await getSiteContent('shop')
      if (content?.data) setData({ ...DEFAULTS, ...content.data })
    }
    load()
  }, [])

  const handleSave = async () => { await updateSiteContent('shop', data) }
  const update = (field: string, value: string) => setData(prev => ({ ...prev, [field]: value }))

  return (
    <div>
      <div className="flex items-center gap-3 mb-1">
        <span className="material-symbols-outlined text-primary text-2xl">storefront</span>
        <h1 className="font-headline font-black text-3xl tracking-tighter text-[#1a1c1e]">Tienda Home</h1>
      </div>
      <p className="text-on-surface-variant text-sm ml-[40px] mb-10">Edita los textos del header y el banner CTA de la sección de tienda.</p>

      <div className="space-y-6">
        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
          <h3 className="font-bold text-[#1a1c1e] mb-4 text-sm">Encabezado de la Sección</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-[10px] font-black text-[#1a1c1e] mb-1.5 uppercase tracking-wider">Título</label>
              <input type="text" value={data.title} onChange={(e) => update('title', e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-xl focus:outline-none focus:border-primary focus:bg-white transition-all text-sm text-[#1a1c1e]" />
            </div>
            <div>
              <label className="block text-[10px] font-black text-[#1a1c1e] mb-1.5 uppercase tracking-wider">Subtítulo</label>
              <textarea value={data.subtitle} onChange={(e) => update('subtitle', e.target.value)} rows={2}
                className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-xl focus:outline-none focus:border-primary focus:bg-white transition-all text-sm text-[#1a1c1e]" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-black text-[#1a1c1e] mb-1.5 uppercase tracking-wider">Texto Link Catálogo</label>
                <input type="text" value={data.ctaLinkText} onChange={(e) => update('ctaLinkText', e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-xl focus:outline-none focus:border-primary focus:bg-white transition-all text-sm text-[#1a1c1e]" />
              </div>
              <div>
                <label className="block text-[10px] font-black text-[#1a1c1e] mb-1.5 uppercase tracking-wider">URL del Link</label>
                <input type="text" value={data.ctaLinkHref} onChange={(e) => update('ctaLinkHref', e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-xl focus:outline-none focus:border-primary focus:bg-white transition-all text-sm text-[#1a1c1e]" />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
          <h3 className="font-bold text-[#1a1c1e] mb-4 text-sm">Banner CTA (parte inferior)</h3>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-black text-[#1a1c1e] mb-1.5 uppercase tracking-wider">Título del Banner</label>
                <input type="text" value={data.bannerTitle} onChange={(e) => update('bannerTitle', e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-xl focus:outline-none focus:border-primary focus:bg-white transition-all text-sm text-[#1a1c1e]" />
              </div>
              <div>
                <label className="block text-[10px] font-black text-[#1a1c1e] mb-1.5 uppercase tracking-wider">Subtítulo del Banner</label>
                <input type="text" value={data.bannerSubtitle} onChange={(e) => update('bannerSubtitle', e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-xl focus:outline-none focus:border-primary focus:bg-white transition-all text-sm text-[#1a1c1e]" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-black text-[#1a1c1e] mb-1.5 uppercase tracking-wider">Texto del Botón</label>
                <input type="text" value={data.bannerButtonText} onChange={(e) => update('bannerButtonText', e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-xl focus:outline-none focus:border-primary focus:bg-white transition-all text-sm text-[#1a1c1e]" />
              </div>
              <div>
                <label className="block text-[10px] font-black text-[#1a1c1e] mb-1.5 uppercase tracking-wider">Redirección del Botón</label>
                <input type="text" value={data.bannerButtonHref} onChange={(e) => update('bannerButtonHref', e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-xl focus:outline-none focus:border-primary focus:bg-white transition-all text-sm text-[#1a1c1e]" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <CmsSaveButton onSave={handleSave} />
    </div>
  )
}
