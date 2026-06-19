'use client'

import { useEffect, useState } from 'react'
import { getSiteContent, updateSiteContent, uploadFile } from '@/lib/api'
import CmsSaveButton from '@/components/ui/CmsSaveButton'

const DEFAULTS = {
  image: '/imagenTestimonios.jpg',
  quote: '"Mi piel nunca se sintió tan saludable. La precisión en cada paso del tratamiento fue lo que marcó la diferencia."',
  patientName: 'Elena Ramírez',
  patientRole: 'Paciente de Estética',
  sectionTitle1: 'Por qué confiar',
  sectionTitle2: 'en nosotros.',
  trustItems: [
    { icon: 'verified', title: 'Cuerpo Médico Certificado', description: 'Especialistas egresados de las mejores instituciones, en constante actualización clínica.' },
    { icon: 'precision_manufacturing', title: 'Tecnología de Punta', description: 'Contamos con la última generación de equipos láser y diagnóstico por imagen.' },
    { icon: 'favorite', title: 'Atención Humana', description: 'Protocolos personalizados. No tratamos pieles, tratamos personas.' },
  ],
}

export default function TestimoniosCmsPage() {
  const [data, setData] = useState(DEFAULTS)
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    async function load() {
      const content = await getSiteContent('testimonials')
      if (content?.data) setData({ ...DEFAULTS, ...content.data })
    }
    load()
  }, [])

  const handleSave = async () => { await updateSiteContent('testimonials', data) }
  const update = (field: string, value: any) => setData(prev => ({ ...prev, [field]: value }))

  const updateTrustItem = (index: number, field: string, value: string) => {
    const items = [...data.trustItems]
    items[index] = { ...items[index], [field]: value }
    update('trustItems', items)
  }

  const addTrustItem = () => {
    update('trustItems', [...data.trustItems, { icon: 'star', title: '', description: '' }])
  }

  const removeTrustItem = (index: number) => {
    update('trustItems', data.trustItems.filter((_, i) => i !== index))
  }

  const handleUpload = async (file: File) => {
    setUploading(true)
    try {
      const result = await uploadFile(file)
      update('image', result.url || result)
    } catch (e) { console.error(e) }
    finally { setUploading(false) }
  }

  return (
    <div>
      <div className="flex items-center gap-3 mb-1">
        <span className="material-symbols-outlined text-primary text-2xl">rate_review</span>
        <h1 className="font-headline font-black text-3xl tracking-tighter text-[#1a1c1e]">Testimonios / Confianza</h1>
      </div>
      <p className="text-on-surface-variant text-sm ml-[40px] mb-10">Gestiona la sección de testimonios y puntos de confianza.</p>

      <div className="space-y-6">
        {/* Testimonial Quote */}
        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
          <h3 className="font-bold text-[#1a1c1e] mb-4 text-sm">Testimonio Destacado</h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <label className="block text-[10px] font-black text-[#1a1c1e] mb-1.5 uppercase tracking-wider">Imagen</label>
              <div className="aspect-square bg-slate-100 rounded-xl overflow-hidden border border-slate-200 mb-3">
                <img src={data.image} alt="Preview" className="w-full h-full object-cover" />
              </div>
              <input type="url" value={data.image} onChange={(e) => update('image', e.target.value)} placeholder="URL de la imagen"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-100 rounded-lg text-xs mb-2 focus:outline-none focus:border-primary" />
              <label className="flex items-center justify-center gap-2 px-4 py-2 bg-slate-50 border border-dashed border-slate-200 rounded-lg cursor-pointer hover:border-primary text-xs text-slate-400 hover:text-primary transition-all">
                <span className="material-symbols-outlined text-sm">{uploading ? 'progress_activity' : 'cloud_upload'}</span>
                {uploading ? 'Subiendo...' : 'Subir imagen'}
                <input type="file" accept="image/*" className="hidden" onChange={(e) => { if (e.target.files?.[0]) handleUpload(e.target.files[0]) }} />
              </label>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-[10px] font-black text-[#1a1c1e] mb-1.5 uppercase tracking-wider">Quote</label>
                <textarea value={data.quote} onChange={(e) => update('quote', e.target.value)} rows={4}
                  className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-xl focus:outline-none focus:border-primary focus:bg-white transition-all text-sm text-[#1a1c1e]" />
              </div>
              <div>
                <label className="block text-[10px] font-black text-[#1a1c1e] mb-1.5 uppercase tracking-wider">Nombre del Paciente</label>
                <input type="text" value={data.patientName} onChange={(e) => update('patientName', e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-xl focus:outline-none focus:border-primary focus:bg-white transition-all text-sm text-[#1a1c1e]" />
              </div>
              <div>
                <label className="block text-[10px] font-black text-[#1a1c1e] mb-1.5 uppercase tracking-wider">Rol / Tipo de Paciente</label>
                <input type="text" value={data.patientRole} onChange={(e) => update('patientRole', e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-xl focus:outline-none focus:border-primary focus:bg-white transition-all text-sm text-[#1a1c1e]" />
              </div>
            </div>
          </div>
        </div>

        {/* Section Title */}
        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
          <h3 className="font-bold text-[#1a1c1e] mb-4 text-sm">Título de la Sección</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-black text-[#1a1c1e] mb-1.5 uppercase tracking-wider">Línea 1</label>
              <input type="text" value={data.sectionTitle1} onChange={(e) => update('sectionTitle1', e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-xl focus:outline-none focus:border-primary focus:bg-white transition-all text-sm text-[#1a1c1e]" />
            </div>
            <div>
              <label className="block text-[10px] font-black text-[#1a1c1e] mb-1.5 uppercase tracking-wider">Línea 2 (destacado)</label>
              <input type="text" value={data.sectionTitle2} onChange={(e) => update('sectionTitle2', e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-xl focus:outline-none focus:border-primary focus:bg-white transition-all text-sm text-[#1a1c1e]" />
            </div>
          </div>
        </div>

        {/* Trust Items */}
        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-[#1a1c1e] text-sm">Puntos de Confianza</h3>
            <button onClick={addTrustItem} className="text-primary text-xs font-bold flex items-center gap-1 hover:underline">
              <span className="material-symbols-outlined text-sm">add</span>Agregar
            </button>
          </div>
          <div className="space-y-4">
            {data.trustItems.map((item, index) => (
              <div key={index} className="p-4 bg-slate-50 rounded-xl flex gap-4 items-start">
                <div className="shrink-0 space-y-2">
                  <label className="block text-[10px] font-black text-[#1a1c1e] uppercase tracking-wider">Icono</label>
                  <input type="text" value={item.icon} onChange={(e) => updateTrustItem(index, 'icon', e.target.value)}
                    className="w-32 px-3 py-2 bg-white border border-slate-100 rounded-lg text-xs focus:outline-none focus:border-primary" placeholder="Material icon" />
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <span className="material-symbols-outlined text-primary">{item.icon}</span>
                  </div>
                </div>
                <div className="flex-1 space-y-2">
                  <div>
                    <label className="block text-[10px] font-black text-[#1a1c1e] uppercase tracking-wider">Título</label>
                    <input type="text" value={item.title} onChange={(e) => updateTrustItem(index, 'title', e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-slate-100 rounded-lg text-xs focus:outline-none focus:border-primary" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-[#1a1c1e] uppercase tracking-wider">Descripción</label>
                    <textarea value={item.description} onChange={(e) => updateTrustItem(index, 'description', e.target.value)} rows={2}
                      className="w-full px-3 py-2 bg-white border border-slate-100 rounded-lg text-xs focus:outline-none focus:border-primary" />
                  </div>
                </div>
                <button onClick={() => removeTrustItem(index)}
                  className="p-1 rounded-lg hover:bg-red-50 text-slate-300 hover:text-red-500 transition-colors shrink-0 mt-5">
                  <span className="material-symbols-outlined text-sm">delete</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      <CmsSaveButton onSave={handleSave} />
    </div>
  )
}
