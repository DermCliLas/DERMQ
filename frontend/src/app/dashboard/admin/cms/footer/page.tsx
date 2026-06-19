'use client'

import { useEffect, useState } from 'react'
import { getSiteContent, updateSiteContent } from '@/lib/api'
import CmsSaveButton from '@/components/ui/CmsSaveButton'

const DEFAULTS = {
  brandName: 'DERMQ',
  brandDescription: 'Líderes en dermatología avanzada. Fusionamos rigor científico con una visión estética premium para el cuidado integral de tu piel.',
  socials: [
    { icon: 'facebook', label: 'Facebook', href: '#' },
    { icon: 'photo_camera', label: 'Instagram', href: '#' },
    { icon: 'share', label: 'Compartir', href: '#' },
  ],
  companyLinks: [
    { label: 'Nuestra Historia', href: '/nosotros' },
    { label: 'Cuerpo Médico', href: '/nosotros#equipo' },
    { label: 'Instalaciones', href: '/servicios#tecnologia' },
    { label: 'Sedes', href: '/contacto' },
  ],
  serviceLinks: [
    { label: 'Dermatología Clínica', href: '/servicios' },
    { label: 'Estética Avanzada', href: '/servicios#estetica' },
    { label: 'Cirugía Cutánea', href: '/servicios#cirugia' },
    { label: 'Láser & Cabina', href: '/servicios#laser' },
  ],
  contactAddress: 'Av. Camino Real 1234,\nSan Isidro, Lima.',
  contactPhone: '+51 1 234 5678',
  contactEmail: 'informes@dermq.pe',
  contactButtonText: 'Escríbenos',
  contactButtonHref: '/contacto',
  privacyLabel: 'Aviso de Privacidad',
  privacyHref: '#',
  termsLabel: 'Términos y Condiciones',
  termsHref: '#',
}

export default function FooterCmsPage() {
  const [data, setData] = useState(DEFAULTS)

  useEffect(() => {
    async function load() {
      const content = await getSiteContent('footer')
      if (content?.data) setData({ ...DEFAULTS, ...content.data })
    }
    load()
  }, [])

  const handleSave = async () => { await updateSiteContent('footer', data) }
  const update = (field: string, value: any) => setData(prev => ({ ...prev, [field]: value }))

  const updateListItem = (listKey: string, index: number, field: string, value: string) => {
    const items = [...(data as any)[listKey]]
    items[index] = { ...items[index], [field]: value }
    update(listKey, items)
  }

  const addListItem = (listKey: string, template: any) => {
    update(listKey, [...(data as any)[listKey], template])
  }

  const removeListItem = (listKey: string, index: number) => {
    update(listKey, (data as any)[listKey].filter((_: any, i: number) => i !== index))
  }

  const renderLinksEditor = (title: string, listKey: string) => (
    <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-[#1a1c1e] text-sm">{title}</h3>
        <button onClick={() => addListItem(listKey, { label: '', href: '' })} className="text-primary text-xs font-bold flex items-center gap-1 hover:underline">
          <span className="material-symbols-outlined text-sm">add</span>Agregar
        </button>
      </div>
      <div className="space-y-3">
        {((data as any)[listKey] as any[]).map((item: any, index: number) => (
          <div key={index} className="flex gap-3 items-center p-3 bg-slate-50 rounded-xl">
            <div className="flex-1 grid grid-cols-2 gap-3">
              <input type="text" value={item.label} onChange={(e) => updateListItem(listKey, index, 'label', e.target.value)} placeholder="Label"
                className="px-3 py-2 bg-white border border-slate-100 rounded-lg text-xs focus:outline-none focus:border-primary" />
              <input type="text" value={item.href} onChange={(e) => updateListItem(listKey, index, 'href', e.target.value)} placeholder="/ruta"
                className="px-3 py-2 bg-white border border-slate-100 rounded-lg text-xs focus:outline-none focus:border-primary" />
            </div>
            <button onClick={() => removeListItem(listKey, index)}
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
        <span className="material-symbols-outlined text-primary text-2xl">bottom_navigation</span>
        <h1 className="font-headline font-black text-3xl tracking-tighter text-[#1a1c1e]">Footer</h1>
      </div>
      <p className="text-on-surface-variant text-sm ml-[40px] mb-10">Personaliza todos los elementos del footer.</p>

      <div className="space-y-6">
        {/* Brand */}
        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
          <h3 className="font-bold text-[#1a1c1e] mb-4 text-sm">Marca</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-[10px] font-black text-[#1a1c1e] mb-1.5 uppercase tracking-wider">Nombre de Marca</label>
              <input type="text" value={data.brandName} onChange={(e) => update('brandName', e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-xl focus:outline-none focus:border-primary focus:bg-white transition-all text-sm text-[#1a1c1e]" />
            </div>
            <div>
              <label className="block text-[10px] font-black text-[#1a1c1e] mb-1.5 uppercase tracking-wider">Descripción de Marca</label>
              <textarea value={data.brandDescription} onChange={(e) => update('brandDescription', e.target.value)} rows={3}
                className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-xl focus:outline-none focus:border-primary focus:bg-white transition-all text-sm text-[#1a1c1e]" />
            </div>
          </div>
        </div>

        {/* Socials */}
        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-[#1a1c1e] text-sm">Redes Sociales</h3>
            <button onClick={() => addListItem('socials', { icon: 'link', label: '', href: '#' })} className="text-primary text-xs font-bold flex items-center gap-1 hover:underline">
              <span className="material-symbols-outlined text-sm">add</span>Agregar
            </button>
          </div>
          <div className="space-y-3">
            {data.socials.map((social, index) => (
              <div key={index} className="flex gap-3 items-center p-3 bg-slate-50 rounded-xl">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-primary text-lg">{social.icon}</span>
                </div>
                <div className="flex-1 grid grid-cols-3 gap-2">
                  <input type="text" value={social.icon} onChange={(e) => updateListItem('socials', index, 'icon', e.target.value)} placeholder="Icono"
                    className="px-3 py-2 bg-white border border-slate-100 rounded-lg text-xs focus:outline-none focus:border-primary" />
                  <input type="text" value={social.label} onChange={(e) => updateListItem('socials', index, 'label', e.target.value)} placeholder="Label"
                    className="px-3 py-2 bg-white border border-slate-100 rounded-lg text-xs focus:outline-none focus:border-primary" />
                  <input type="text" value={social.href} onChange={(e) => updateListItem('socials', index, 'href', e.target.value)} placeholder="URL"
                    className="px-3 py-2 bg-white border border-slate-100 rounded-lg text-xs focus:outline-none focus:border-primary" />
                </div>
                <button onClick={() => removeListItem('socials', index)}
                  className="p-1 rounded-lg hover:bg-red-50 text-slate-300 hover:text-red-500 transition-colors">
                  <span className="material-symbols-outlined text-sm">close</span>
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Links */}
        {renderLinksEditor('Links — La Clínica', 'companyLinks')}
        {renderLinksEditor('Links — Tratamientos', 'serviceLinks')}

        {/* Contact */}
        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
          <h3 className="font-bold text-[#1a1c1e] mb-4 text-sm">Datos de Contacto</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-[10px] font-black text-[#1a1c1e] mb-1.5 uppercase tracking-wider">Dirección</label>
              <textarea value={data.contactAddress} onChange={(e) => update('contactAddress', e.target.value)} rows={2}
                className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-xl focus:outline-none focus:border-primary focus:bg-white transition-all text-sm text-[#1a1c1e]" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-black text-[#1a1c1e] mb-1.5 uppercase tracking-wider">Teléfono</label>
                <input type="tel" value={data.contactPhone} onChange={(e) => update('contactPhone', e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-xl focus:outline-none focus:border-primary focus:bg-white transition-all text-sm text-[#1a1c1e]" />
              </div>
              <div>
                <label className="block text-[10px] font-black text-[#1a1c1e] mb-1.5 uppercase tracking-wider">Email</label>
                <input type="email" value={data.contactEmail} onChange={(e) => update('contactEmail', e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-xl focus:outline-none focus:border-primary focus:bg-white transition-all text-sm text-[#1a1c1e]" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-black text-[#1a1c1e] mb-1.5 uppercase tracking-wider">Texto Botón CTA</label>
                <input type="text" value={data.contactButtonText} onChange={(e) => update('contactButtonText', e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-xl focus:outline-none focus:border-primary focus:bg-white transition-all text-sm text-[#1a1c1e]" />
              </div>
              <div>
                <label className="block text-[10px] font-black text-[#1a1c1e] mb-1.5 uppercase tracking-wider">URL Botón CTA</label>
                <input type="text" value={data.contactButtonHref} onChange={(e) => update('contactButtonHref', e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-xl focus:outline-none focus:border-primary focus:bg-white transition-all text-sm text-[#1a1c1e]" />
              </div>
            </div>
          </div>
        </div>

        {/* Legal */}
        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
          <h3 className="font-bold text-[#1a1c1e] mb-4 text-sm">Links Legales</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <input type="text" value={data.privacyLabel} onChange={(e) => update('privacyLabel', e.target.value)} placeholder="Label"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-100 rounded-lg text-xs focus:outline-none focus:border-primary" />
              <input type="text" value={data.privacyHref} onChange={(e) => update('privacyHref', e.target.value)} placeholder="URL"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-100 rounded-lg text-xs focus:outline-none focus:border-primary" />
            </div>
            <div className="space-y-2">
              <input type="text" value={data.termsLabel} onChange={(e) => update('termsLabel', e.target.value)} placeholder="Label"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-100 rounded-lg text-xs focus:outline-none focus:border-primary" />
              <input type="text" value={data.termsHref} onChange={(e) => update('termsHref', e.target.value)} placeholder="URL"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-100 rounded-lg text-xs focus:outline-none focus:border-primary" />
            </div>
          </div>
        </div>
      </div>

      <CmsSaveButton onSave={handleSave} />
    </div>
  )
}
