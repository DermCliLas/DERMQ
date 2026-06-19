'use client'

import { useEffect, useState } from 'react'
import { getSiteContent, updateSiteContent } from '@/lib/api'
import CmsSaveButton from '@/components/ui/CmsSaveButton'

const DEFAULTS = {
  titleDefault: 'DERMQ — Clínica Dermatológica de Vanguardia',
  titleTemplate: '%s | DERMQ',
  description: 'DERMQ fusiona precisión clínica y estética avanzada para revelar tu luminosidad natural. Especialistas en dermatología clínica, estética y cirugía cutánea en Lima, Perú.',
  keywords: 'dermatología, clínica dermatológica, estética facial, tratamientos piel, Lima, Perú, DERMQ',
  ogType: 'website',
  ogLocale: 'es_PE',
  ogSiteName: 'DERMQ',
  ogTitle: 'DERMQ — Clínica Dermatológica de Vanguardia',
  ogDescription: 'Fusionamos precisión clínica y estética avanzada para revelar tu luminosidad natural.',
  ogImageUrl: '',
  robotsIndex: true,
  robotsFollow: true,
}

export default function SeoCmsPage() {
  const [data, setData] = useState(DEFAULTS)

  useEffect(() => {
    async function load() {
      const content = await getSiteContent('seo')
      if (content?.data) setData({ ...DEFAULTS, ...content.data })
    }
    load()
  }, [])

  const handleSave = async () => { await updateSiteContent('seo', data) }
  const update = (field: string, value: any) => setData(prev => ({ ...prev, [field]: value }))

  return (
    <div>
      <div className="flex items-center gap-3 mb-1">
        <span className="material-symbols-outlined text-primary text-2xl">travel_explore</span>
        <h1 className="font-headline font-black text-3xl tracking-tighter text-[#1a1c1e]">SEO & Metadata</h1>
      </div>
      <p className="text-on-surface-variant text-sm ml-[40px] mb-10">Configura cómo aparece tu sitio web en los motores de búsqueda y redes sociales.</p>

      <div className="space-y-6">
        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
          <h3 className="font-bold text-[#1a1c1e] mb-4 text-sm">Metadatos Generales</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-[10px] font-black text-[#1a1c1e] mb-1.5 uppercase tracking-wider">Título por Defecto</label>
              <input type="text" value={data.titleDefault} onChange={(e) => update('titleDefault', e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-xl focus:outline-none focus:border-primary focus:bg-white transition-all text-sm text-[#1a1c1e]" />
            </div>
            <div>
              <label className="block text-[10px] font-black text-[#1a1c1e] mb-1.5 uppercase tracking-wider">Template de Título (para sub-páginas)</label>
              <input type="text" value={data.titleTemplate} onChange={(e) => update('titleTemplate', e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-xl focus:outline-none focus:border-primary focus:bg-white transition-all text-sm text-[#1a1c1e]" />
              <p className="text-[10px] text-slate-400 mt-1">Usa %s como placeholder para el nombre de la página</p>
            </div>
            <div>
              <label className="block text-[10px] font-black text-[#1a1c1e] mb-1.5 uppercase tracking-wider">Meta Descripción</label>
              <textarea value={data.description} onChange={(e) => update('description', e.target.value)} rows={3}
                className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-xl focus:outline-none focus:border-primary focus:bg-white transition-all text-sm text-[#1a1c1e]" />
              <p className="text-[10px] text-slate-400 mt-1">{data.description.length}/160 caracteres recomendados</p>
            </div>
            <div>
              <label className="block text-[10px] font-black text-[#1a1c1e] mb-1.5 uppercase tracking-wider">Keywords (separadas por coma)</label>
              <textarea value={data.keywords} onChange={(e) => update('keywords', e.target.value)} rows={2}
                className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-xl focus:outline-none focus:border-primary focus:bg-white transition-all text-sm text-[#1a1c1e]" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
          <h3 className="font-bold text-[#1a1c1e] mb-4 text-sm">Open Graph (Redes Sociales)</h3>
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-[10px] font-black text-[#1a1c1e] mb-1.5 uppercase tracking-wider">Tipo</label>
                <input type="text" value={data.ogType} onChange={(e) => update('ogType', e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-xl focus:outline-none focus:border-primary focus:bg-white transition-all text-sm text-[#1a1c1e]" />
              </div>
              <div>
                <label className="block text-[10px] font-black text-[#1a1c1e] mb-1.5 uppercase tracking-wider">Locale</label>
                <input type="text" value={data.ogLocale} onChange={(e) => update('ogLocale', e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-xl focus:outline-none focus:border-primary focus:bg-white transition-all text-sm text-[#1a1c1e]" />
              </div>
              <div>
                <label className="block text-[10px] font-black text-[#1a1c1e] mb-1.5 uppercase tracking-wider">Nombre del Sitio</label>
                <input type="text" value={data.ogSiteName} onChange={(e) => update('ogSiteName', e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-xl focus:outline-none focus:border-primary focus:bg-white transition-all text-sm text-[#1a1c1e]" />
              </div>
            </div>
            <div>
              <label className="block text-[10px] font-black text-[#1a1c1e] mb-1.5 uppercase tracking-wider">OG Título</label>
              <input type="text" value={data.ogTitle} onChange={(e) => update('ogTitle', e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-xl focus:outline-none focus:border-primary focus:bg-white transition-all text-sm text-[#1a1c1e]" />
            </div>
            <div>
              <label className="block text-[10px] font-black text-[#1a1c1e] mb-1.5 uppercase tracking-wider">OG Descripción</label>
              <textarea value={data.ogDescription} onChange={(e) => update('ogDescription', e.target.value)} rows={2}
                className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-xl focus:outline-none focus:border-primary focus:bg-white transition-all text-sm text-[#1a1c1e]" />
            </div>
            <div>
              <label className="block text-[10px] font-black text-[#1a1c1e] mb-1.5 uppercase tracking-wider">OG Imagen URL</label>
              <input type="url" value={data.ogImageUrl} onChange={(e) => update('ogImageUrl', e.target.value)} placeholder="https://..."
                className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-xl focus:outline-none focus:border-primary focus:bg-white transition-all text-sm text-[#1a1c1e]" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
          <h3 className="font-bold text-[#1a1c1e] mb-4 text-sm">Robots</h3>
          <div className="flex gap-8">
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" checked={data.robotsIndex} onChange={(e) => update('robotsIndex', e.target.checked)}
                className="w-5 h-5 rounded-lg border-2 border-slate-200 accent-primary" />
              <span className="text-sm font-medium text-[#1a1c1e]">Permitir indexación (index)</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" checked={data.robotsFollow} onChange={(e) => update('robotsFollow', e.target.checked)}
                className="w-5 h-5 rounded-lg border-2 border-slate-200 accent-primary" />
              <span className="text-sm font-medium text-[#1a1c1e]">Permitir seguimiento de links (follow)</span>
            </label>
          </div>
        </div>

        {/* Google Preview */}
        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
          <h3 className="font-bold text-[#1a1c1e] mb-4 text-sm">Vista Previa en Google</h3>
          <div className="bg-white p-6 rounded-xl border border-slate-200 max-w-xl">
            <p className="text-sm text-[#1a0dab] font-medium mb-1 truncate">{data.titleDefault}</p>
            <p className="text-xs text-[#006621] mb-1">https://dermq.pe</p>
            <p className="text-xs text-[#545454] line-clamp-2">{data.description}</p>
          </div>
        </div>
      </div>

      <CmsSaveButton onSave={handleSave} />
    </div>
  )
}
