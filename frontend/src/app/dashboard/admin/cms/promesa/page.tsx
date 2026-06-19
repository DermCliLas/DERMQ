'use client'

import { useEffect, useState } from 'react'
import { getSiteContent, updateSiteContent } from '@/lib/api'
import CmsSaveButton from '@/components/ui/CmsSaveButton'

const DEFAULTS = {
  label: 'Nuestra Promesa',
  quote: '"Elevamos el estándar de la salud cutánea a través de la empatía y la innovación."',
  stat1Value: '15+', stat1Label: 'Años',
  stat2Value: '10k', stat2Label: 'Pacientes',
  stat3Value: '98%', stat3Label: 'Satisfacción',
}

export default function PromesaCmsPage() {
  const [data, setData] = useState(DEFAULTS)

  useEffect(() => {
    async function load() {
      const content = await getSiteContent('promise')
      if (content?.data) setData({ ...DEFAULTS, ...content.data })
    }
    load()
  }, [])

  const handleSave = async () => { await updateSiteContent('promise', data) }
  const update = (field: string, value: string) => setData(prev => ({ ...prev, [field]: value }))

  return (
    <div>
      <div className="flex items-center gap-3 mb-1">
        <span className="material-symbols-outlined text-primary text-2xl">volunteer_activism</span>
        <h1 className="font-headline font-black text-3xl tracking-tighter text-[#1a1c1e]">Nuestra Promesa</h1>
      </div>
      <p className="text-on-surface-variant text-sm ml-[40px] mb-10">Edita la cita principal y las estadísticas de impacto.</p>

      <div className="space-y-6">
        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
          <h3 className="font-bold text-[#1a1c1e] mb-4 text-sm">Texto Principal</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-[10px] font-black text-[#1a1c1e] mb-1.5 uppercase tracking-wider">Etiqueta Superior</label>
              <input type="text" value={data.label} onChange={(e) => update('label', e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-xl focus:outline-none focus:border-primary focus:bg-white transition-all text-sm text-[#1a1c1e]" />
            </div>
            <div>
              <label className="block text-[10px] font-black text-[#1a1c1e] mb-1.5 uppercase tracking-wider">Cita / Quote</label>
              <textarea value={data.quote} onChange={(e) => update('quote', e.target.value)} rows={4}
                className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-xl focus:outline-none focus:border-primary focus:bg-white transition-all text-sm text-[#1a1c1e]" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
          <h3 className="font-bold text-[#1a1c1e] mb-4 text-sm">Estadísticas de Impacto</h3>
          <div className="grid grid-cols-3 gap-6">
            {[
              { v: 'stat1Value', l: 'stat1Label', title: 'Estadística 1' },
              { v: 'stat2Value', l: 'stat2Label', title: 'Estadística 2' },
              { v: 'stat3Value', l: 'stat3Label', title: 'Estadística 3' },
            ].map(({ v, l, title }) => (
              <div key={v} className="space-y-3 p-4 bg-slate-50 rounded-xl">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">{title}</p>
                <div>
                  <label className="block text-[10px] font-black text-[#1a1c1e] mb-1 uppercase tracking-wider">Valor</label>
                  <input type="text" value={(data as any)[v]} onChange={(e) => update(v, e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-100 rounded-lg text-sm focus:outline-none focus:border-primary" />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-[#1a1c1e] mb-1 uppercase tracking-wider">Label</label>
                  <input type="text" value={(data as any)[l]} onChange={(e) => update(l, e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-100 rounded-lg text-sm focus:outline-none focus:border-primary" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <CmsSaveButton onSave={handleSave} />
    </div>
  )
}
