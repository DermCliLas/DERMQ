'use client'

import { useEffect, useState } from 'react'
import { getSiteContent, updateSiteContent, uploadFile } from '@/lib/api'
import CmsSaveButton from '@/components/ui/CmsSaveButton'

const DEFAULTS = {
  doctorImage: '/leyva.png',
  title1: 'The Expertise',
  title2: 'Behind the Glow.',
  paragraph1: 'Founded by world-renowned dermatologists, DERMQ bridges the gap between high-level laboratory research and luxury skincare experiences.',
  paragraph2: 'Every consultation is a journey through your skin\'s molecular needs, utilizing AI-driven analysis and proprietary laser technology.',
  stat1Value: '98%', stat1Label: 'Patient Satisfaction',
  stat2Value: '40k', stat2Label: 'Active Treatments',
  ctaText: 'Conoce nuestro equipo', ctaHref: '/nosotros',
  badgeValue: '15+', badgeLine1: 'Years of Clinical', badgeLine2: 'Research',
}

export default function ExpertiseCmsPage() {
  const [data, setData] = useState(DEFAULTS)
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    async function load() {
      const content = await getSiteContent('expertise')
      if (content?.data) setData({ ...DEFAULTS, ...content.data })
    }
    load()
  }, [])

  const handleSave = async () => {
    await updateSiteContent('expertise', data)
  }

  const update = (field: string, value: string) => setData(prev => ({ ...prev, [field]: value }))

  const handleUpload = async (file: File) => {
    setUploading(true)
    try {
      const result = await uploadFile(file)
      update('doctorImage', result.url || result as any)
    } catch (e) { console.error(e) }
    finally { setUploading(false) }
  }

  return (
    <div>
      <div className="flex items-center gap-3 mb-1">
        <span className="material-symbols-outlined text-primary text-2xl">psychology</span>
        <h1 className="font-headline font-black text-3xl tracking-tighter text-[#1a1c1e]">Expertise / Nosotros</h1>
      </div>
      <p className="text-on-surface-variant text-sm ml-[40px] mb-10">Edita la sección de expertise con imagen, textos y estadísticas.</p>

      <div className="space-y-6">
        {/* Image */}
        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
          <h3 className="font-bold text-[#1a1c1e] mb-4 text-sm">Imagen Principal</h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="aspect-[3/4] bg-slate-100 rounded-xl overflow-hidden border border-slate-200">
              <img src={data.doctorImage} alt="Preview" className="w-full h-full object-cover" />
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-[10px] font-black text-[#1a1c1e] mb-1.5 uppercase tracking-wider">URL de Imagen</label>
                <input type="url" value={data.doctorImage} onChange={(e) => update('doctorImage', e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-xl focus:outline-none focus:border-primary focus:bg-white transition-all text-sm text-[#1a1c1e]" />
              </div>
              <label className="flex items-center justify-center gap-2 px-4 py-3 bg-slate-50 border-2 border-dashed border-slate-200 rounded-xl cursor-pointer hover:border-primary hover:bg-primary/5 transition-all text-sm text-slate-400 hover:text-primary">
                <span className="material-symbols-outlined text-lg">{uploading ? 'progress_activity' : 'cloud_upload'}</span>
                {uploading ? 'Subiendo...' : 'Subir nueva imagen'}
                <input type="file" accept="image/*" className="hidden" onChange={(e) => {
                  if (e.target.files?.[0]) handleUpload(e.target.files[0])
                }} />
              </label>
            </div>
          </div>
        </div>

        {/* Texts */}
        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
          <h3 className="font-bold text-[#1a1c1e] mb-4 text-sm">Textos</h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-[10px] font-black text-[#1a1c1e] mb-1.5 uppercase tracking-wider">Título Línea 1</label>
              <input type="text" value={data.title1} onChange={(e) => update('title1', e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-xl focus:outline-none focus:border-primary focus:bg-white transition-all text-sm text-[#1a1c1e]" />
            </div>
            <div>
              <label className="block text-[10px] font-black text-[#1a1c1e] mb-1.5 uppercase tracking-wider">Título Línea 2</label>
              <input type="text" value={data.title2} onChange={(e) => update('title2', e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-xl focus:outline-none focus:border-primary focus:bg-white transition-all text-sm text-[#1a1c1e]" />
            </div>
          </div>
          <div>
            <label className="block text-[10px] font-black text-[#1a1c1e] mb-1.5 uppercase tracking-wider">Párrafo 1</label>
            <textarea value={data.paragraph1} onChange={(e) => update('paragraph1', e.target.value)} rows={3}
              className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-xl focus:outline-none focus:border-primary focus:bg-white transition-all text-sm text-[#1a1c1e] mb-4" />
          </div>
          <div>
            <label className="block text-[10px] font-black text-[#1a1c1e] mb-1.5 uppercase tracking-wider">Párrafo 2</label>
            <textarea value={data.paragraph2} onChange={(e) => update('paragraph2', e.target.value)} rows={3}
              className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-xl focus:outline-none focus:border-primary focus:bg-white transition-all text-sm text-[#1a1c1e]" />
          </div>
        </div>

        {/* Stats */}
        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
          <h3 className="font-bold text-[#1a1c1e] mb-4 text-sm">Estadísticas</h3>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { vField: 'stat1Value', lField: 'stat1Label', label: 'Estadística 1' },
              { vField: 'stat2Value', lField: 'stat2Label', label: 'Estadística 2' },
            ].map(({ vField, lField, label }) => (
              <div key={vField} className="col-span-1 space-y-2">
                <label className="block text-[10px] font-black text-[#1a1c1e] uppercase tracking-wider">{label} - Valor</label>
                <input type="text" value={(data as any)[vField]} onChange={(e) => update(vField, e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-xl focus:outline-none focus:border-primary focus:bg-white transition-all text-sm text-[#1a1c1e]" />
                <label className="block text-[10px] font-black text-[#1a1c1e] uppercase tracking-wider">{label} - Label</label>
                <input type="text" value={(data as any)[lField]} onChange={(e) => update(lField, e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-xl focus:outline-none focus:border-primary focus:bg-white transition-all text-sm text-[#1a1c1e]" />
              </div>
            ))}
          </div>
        </div>

        {/* Badge & CTA */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
            <h3 className="font-bold text-[#1a1c1e] mb-4 text-sm">Badge Flotante</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-[10px] font-black text-[#1a1c1e] mb-1.5 uppercase tracking-wider">Valor (ej: 15+)</label>
                <input type="text" value={data.badgeValue} onChange={(e) => update('badgeValue', e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-xl focus:outline-none focus:border-primary focus:bg-white transition-all text-sm text-[#1a1c1e]" />
              </div>
              <div>
                <label className="block text-[10px] font-black text-[#1a1c1e] mb-1.5 uppercase tracking-wider">Línea 1</label>
                <input type="text" value={data.badgeLine1} onChange={(e) => update('badgeLine1', e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-xl focus:outline-none focus:border-primary focus:bg-white transition-all text-sm text-[#1a1c1e]" />
              </div>
              <div>
                <label className="block text-[10px] font-black text-[#1a1c1e] mb-1.5 uppercase tracking-wider">Línea 2</label>
                <input type="text" value={data.badgeLine2} onChange={(e) => update('badgeLine2', e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-xl focus:outline-none focus:border-primary focus:bg-white transition-all text-sm text-[#1a1c1e]" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
            <h3 className="font-bold text-[#1a1c1e] mb-4 text-sm">Botón CTA</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-[10px] font-black text-[#1a1c1e] mb-1.5 uppercase tracking-wider">Texto del botón</label>
                <input type="text" value={data.ctaText} onChange={(e) => update('ctaText', e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-xl focus:outline-none focus:border-primary focus:bg-white transition-all text-sm text-[#1a1c1e]" />
              </div>
              <div>
                <label className="block text-[10px] font-black text-[#1a1c1e] mb-1.5 uppercase tracking-wider">Enlace (href)</label>
                <input type="text" value={data.ctaHref} onChange={(e) => update('ctaHref', e.target.value)}
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
