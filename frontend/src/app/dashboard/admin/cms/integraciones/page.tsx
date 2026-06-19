'use client'

import { useEffect, useState } from 'react'
import { getSiteContent, updateSiteContent } from '@/lib/api'
import CmsSaveButton from '@/components/ui/CmsSaveButton'

const DEFAULTS = {
  items: [
    { icon: 'calendar_today', label: 'Google Calendar' },
    { icon: 'chat_bubble', label: 'WhatsApp Support' },
    { icon: 'credit_score', label: 'Safe Payments' },
    { icon: 'mail_outline', label: 'Email Reports' },
  ],
}

export default function IntegracionesCmsPage() {
  const [data, setData] = useState(DEFAULTS)

  useEffect(() => {
    async function load() {
      const content = await getSiteContent('integrations')
      if (content?.data) setData({ ...DEFAULTS, ...content.data })
    }
    load()
  }, [])

  const handleSave = async () => { await updateSiteContent('integrations', data) }

  const updateItem = (index: number, field: string, value: string) => {
    const items = [...data.items]
    items[index] = { ...items[index], [field]: value }
    setData({ ...data, items })
  }

  const addItem = () => {
    setData({ ...data, items: [...data.items, { icon: 'star', label: '' }] })
  }

  const removeItem = (index: number) => {
    setData({ ...data, items: data.items.filter((_, i) => i !== index) })
  }

  return (
    <div>
      <div className="flex items-center gap-3 mb-1">
        <span className="material-symbols-outlined text-primary text-2xl">hub</span>
        <h1 className="font-headline font-black text-3xl tracking-tighter text-[#1a1c1e]">Integraciones</h1>
      </div>
      <p className="text-on-surface-variant text-sm ml-[40px] mb-10">Gestiona los iconos y labels de la barra de integraciones.</p>

      <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-bold text-[#1a1c1e] text-sm">Items de Integración</h3>
          <button onClick={addItem} className="text-primary text-xs font-bold flex items-center gap-1 hover:underline">
            <span className="material-symbols-outlined text-sm">add</span>Agregar
          </button>
        </div>
        <div className="space-y-3">
          {data.items.map((item, index) => (
            <div key={index} className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl">
              <div className="w-12 h-12 rounded-xl bg-[#F0A17E] flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-white text-xl">{item.icon}</span>
              </div>
              <div className="flex-1 grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-black text-[#1a1c1e] mb-1 uppercase tracking-wider">Icono Material</label>
                  <input type="text" value={item.icon} onChange={(e) => updateItem(index, 'icon', e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-100 rounded-lg text-xs focus:outline-none focus:border-primary" />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-[#1a1c1e] mb-1 uppercase tracking-wider">Label</label>
                  <input type="text" value={item.label} onChange={(e) => updateItem(index, 'label', e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-100 rounded-lg text-xs focus:outline-none focus:border-primary" />
                </div>
              </div>
              <button onClick={() => removeItem(index)}
                className="p-1.5 rounded-lg hover:bg-red-50 text-slate-300 hover:text-red-500 transition-colors shrink-0">
                <span className="material-symbols-outlined text-sm">delete</span>
              </button>
            </div>
          ))}
        </div>
      </div>

      <CmsSaveButton onSave={handleSave} />
    </div>
  )
}
