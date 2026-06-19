'use client'

import { useEffect, useState } from 'react'
import { getSiteContent, updateSiteContent } from '@/lib/api'
import CmsSaveButton from '@/components/ui/CmsSaveButton'

const DEFAULTS = {
  badge: 'Ubicación Primaria',
  title1: 'Encuéntranos en',
  title2: 'San Isidro.',
  address: 'Av. Camino Real 1234, Piso 4\nSan Isidro, Lima - Perú',
  schedule: 'Lunes a Viernes: 9:00 AM — 7:00 PM\nSábados: 9:00 AM — 1:00 PM',
  parking: 'Contamos con valet parking gratuito para todos nuestros pacientes.',
  mapsEmbedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3901.325997233827!2d-77.0371!3d-12.0964!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x9105c8695029c049%3A0xc3c5092a95c490a!2sAv.%20Camino%20Real%201234%2C%20San%20Isidro%2015073!5e0!3m2!1ses-419!2spe!4v1700000000000!5m2!1ses-419!2spe',
  mapsLinkUrl: 'https://maps.app.goo.gl/uX3L5q6fX6X6X6X6',
}

export default function UbicacionCmsPage() {
  const [data, setData] = useState(DEFAULTS)

  useEffect(() => {
    async function load() {
      const content = await getSiteContent('location')
      if (content?.data) setData({ ...DEFAULTS, ...content.data })
    }
    load()
  }, [])

  const handleSave = async () => { await updateSiteContent('location', data) }
  const update = (field: string, value: string) => setData(prev => ({ ...prev, [field]: value }))

  return (
    <div>
      <div className="flex items-center gap-3 mb-1">
        <span className="material-symbols-outlined text-primary text-2xl">location_on</span>
        <h1 className="font-headline font-black text-3xl tracking-tighter text-[#1a1c1e]">Ubicación</h1>
      </div>
      <p className="text-on-surface-variant text-sm ml-[40px] mb-10">Gestiona la información de contacto y el mapa de ubicación.</p>

      <div className="space-y-6">
        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
          <h3 className="font-bold text-[#1a1c1e] mb-4 text-sm">Encabezado</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-[10px] font-black text-[#1a1c1e] mb-1.5 uppercase tracking-wider">Badge</label>
              <input type="text" value={data.badge} onChange={(e) => update('badge', e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-xl focus:outline-none focus:border-primary focus:bg-white transition-all text-sm text-[#1a1c1e]" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-black text-[#1a1c1e] mb-1.5 uppercase tracking-wider">Título Línea 1</label>
                <input type="text" value={data.title1} onChange={(e) => update('title1', e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-xl focus:outline-none focus:border-primary focus:bg-white transition-all text-sm text-[#1a1c1e]" />
              </div>
              <div>
                <label className="block text-[10px] font-black text-[#1a1c1e] mb-1.5 uppercase tracking-wider">Título Línea 2 (destacado)</label>
                <input type="text" value={data.title2} onChange={(e) => update('title2', e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-xl focus:outline-none focus:border-primary focus:bg-white transition-all text-sm text-[#1a1c1e]" />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
          <h3 className="font-bold text-[#1a1c1e] mb-4 text-sm">Información</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-[10px] font-black text-[#1a1c1e] mb-1.5 uppercase tracking-wider">Dirección</label>
              <textarea value={data.address} onChange={(e) => update('address', e.target.value)} rows={2}
                className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-xl focus:outline-none focus:border-primary focus:bg-white transition-all text-sm text-[#1a1c1e]" />
            </div>
            <div>
              <label className="block text-[10px] font-black text-[#1a1c1e] mb-1.5 uppercase tracking-wider">Horario de Atención</label>
              <textarea value={data.schedule} onChange={(e) => update('schedule', e.target.value)} rows={2}
                className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-xl focus:outline-none focus:border-primary focus:bg-white transition-all text-sm text-[#1a1c1e]" />
            </div>
            <div>
              <label className="block text-[10px] font-black text-[#1a1c1e] mb-1.5 uppercase tracking-wider">Estacionamiento</label>
              <input type="text" value={data.parking} onChange={(e) => update('parking', e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-xl focus:outline-none focus:border-primary focus:bg-white transition-all text-sm text-[#1a1c1e]" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
          <h3 className="font-bold text-[#1a1c1e] mb-4 text-sm">Google Maps</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-[10px] font-black text-[#1a1c1e] mb-1.5 uppercase tracking-wider">URL Embed del Mapa (iframe src)</label>
              <textarea value={data.mapsEmbedUrl} onChange={(e) => update('mapsEmbedUrl', e.target.value)} rows={3}
                className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-xl focus:outline-none focus:border-primary focus:bg-white transition-all text-xs text-[#1a1c1e] font-mono" />
            </div>
            <div>
              <label className="block text-[10px] font-black text-[#1a1c1e] mb-1.5 uppercase tracking-wider">Link &quot;Abrir en Google Maps&quot;</label>
              <input type="url" value={data.mapsLinkUrl} onChange={(e) => update('mapsLinkUrl', e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-xl focus:outline-none focus:border-primary focus:bg-white transition-all text-sm text-[#1a1c1e]" />
            </div>
            {data.mapsEmbedUrl && (
              <div>
                <label className="block text-[10px] font-black text-[#1a1c1e] mb-1.5 uppercase tracking-wider">Vista Previa</label>
                <div className="aspect-video rounded-xl overflow-hidden border border-slate-200">
                  <iframe src={data.mapsEmbedUrl} width="100%" height="100%" style={{ border: 0 }} loading="lazy" />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <CmsSaveButton onSave={handleSave} />
    </div>
  )
}
