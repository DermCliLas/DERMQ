'use client'

import { useEffect, useState } from 'react'
import { getSiteContent, updateSiteContent, uploadFile } from '@/lib/api'
import CmsSaveButton from '@/components/ui/CmsSaveButton'

interface ServiceCategory {
  id: string
  name: string
  description: string
  imageUrl: string
  imageUrl2: string
  imageUrl3: string
  imageUrl4: string
  services: { name: string; description: string }[]
}

const DEFAULT_DATA: ServiceCategory[] = [
  {
    id: 'dermatologia-clinica',
    name: 'Dermatología Clínica y Quirúrgica',
    description: 'Diagnóstico y tratamiento experto de afecciones de la piel, pelo y uñas.',
    imageUrl: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=1200',
    imageUrl2: '', imageUrl3: '', imageUrl4: '',
    services: [
      { name: 'Consulta médica especializada', description: 'Evaluación clínica exhaustiva.' },
    ],
  },
]

export default function ServiciosCmsPage() {
  const [categories, setCategories] = useState<ServiceCategory[]>(DEFAULT_DATA)
  const [editingCat, setEditingCat] = useState<number | null>(null)
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    async function load() {
      const content = await getSiteContent('services')
      if (content?.data?.categories) {
        setCategories(content.data.categories)
      }
    }
    load()
  }, [])

  const handleSave = async () => {
    await updateSiteContent('services', { categories })
  }

  const updateCategory = (index: number, field: string, value: any) => {
    const updated = [...categories]
    updated[index] = { ...updated[index], [field]: value }
    setCategories(updated)
  }

  const addCategory = () => {
    const id = `cat-${Date.now()}`
    setCategories([...categories, {
      id, name: '', description: '', imageUrl: '', imageUrl2: '', imageUrl3: '', imageUrl4: '',
      services: [],
    }])
    setEditingCat(categories.length)
  }

  const removeCategory = (index: number) => {
    setCategories(categories.filter((_, i) => i !== index))
    setEditingCat(null)
  }

  const addService = (catIndex: number) => {
    const updated = [...categories]
    updated[catIndex].services.push({ name: '', description: '' })
    setCategories(updated)
  }

  const updateService = (catIndex: number, svcIndex: number, field: string, value: string) => {
    const updated = [...categories]
    updated[catIndex].services[svcIndex] = { ...updated[catIndex].services[svcIndex], [field]: value }
    setCategories(updated)
  }

  const removeService = (catIndex: number, svcIndex: number) => {
    const updated = [...categories]
    updated[catIndex].services = updated[catIndex].services.filter((_, i) => i !== svcIndex)
    setCategories(updated)
  }

  const handleImageUpload = async (catIndex: number, field: string, file: File) => {
    setUploading(true)
    try {
      const result = await uploadFile(file)
      updateCategory(catIndex, field, result.url || result)
    } catch (e) {
      console.error('Upload error', e)
    } finally {
      setUploading(false)
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-10">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <span className="material-symbols-outlined text-primary text-2xl">medical_services</span>
            <h1 className="font-headline font-black text-3xl tracking-tighter text-[#1a1c1e]">Servicios</h1>
          </div>
          <p className="text-on-surface-variant text-sm ml-[40px]">Gestiona las categorías de servicios y tratamientos mostrados en la página principal.</p>
        </div>
        <button onClick={addCategory}
          className="bg-primary text-white px-5 py-3 rounded-xl font-bold text-sm flex items-center gap-2 hover:bg-primary-container transition-colors shadow-sm">
          <span className="material-symbols-outlined text-lg">add</span>
          Nueva Categoría
        </button>
      </div>

      <div className="space-y-4">
        {categories.map((cat, catIndex) => (
          <div key={cat.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
              <div className="flex items-center gap-3">
                {cat.imageUrl && <img src={cat.imageUrl} alt="" className="w-10 h-10 rounded-lg object-cover" />}
                <div>
                  <h3 className="font-bold text-[#1a1c1e] text-sm">{cat.name || 'Sin nombre'}</h3>
                  <p className="text-[10px] text-slate-400">{cat.services.length} servicio(s)</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => setEditingCat(editingCat === catIndex ? null : catIndex)}
                  className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-primary transition-colors">
                  <span className="material-symbols-outlined text-lg">{editingCat === catIndex ? 'expand_less' : 'edit'}</span>
                </button>
                <button onClick={() => removeCategory(catIndex)}
                  className="p-1.5 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-600 transition-colors">
                  <span className="material-symbols-outlined text-lg">delete</span>
                </button>
              </div>
            </div>

            {editingCat === catIndex && (
              <div className="p-6 space-y-5">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-black text-[#1a1c1e] mb-1.5 uppercase tracking-wider">ID (slug)</label>
                    <input type="text" value={cat.id} onChange={(e) => updateCategory(catIndex, 'id', e.target.value)}
                      className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-xl focus:outline-none focus:border-primary focus:bg-white transition-all text-sm text-[#1a1c1e]" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-[#1a1c1e] mb-1.5 uppercase tracking-wider">Nombre</label>
                    <input type="text" value={cat.name} onChange={(e) => updateCategory(catIndex, 'name', e.target.value)}
                      className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-xl focus:outline-none focus:border-primary focus:bg-white transition-all text-sm text-[#1a1c1e]" />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-black text-[#1a1c1e] mb-1.5 uppercase tracking-wider">Descripción</label>
                  <textarea value={cat.description} onChange={(e) => updateCategory(catIndex, 'description', e.target.value)} rows={3}
                    className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-xl focus:outline-none focus:border-primary focus:bg-white transition-all text-sm text-[#1a1c1e]" />
                </div>

                {/* Image URLs */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  {(['imageUrl', 'imageUrl2', 'imageUrl3', 'imageUrl4'] as const).map((field, imgIdx) => (
                    <div key={field}>
                      <label className="block text-[10px] font-black text-[#1a1c1e] mb-1.5 uppercase tracking-wider">Imagen {imgIdx + 1}</label>
                      <div className="space-y-2">
                        {cat[field] && <img src={cat[field]} alt="" className="w-full h-24 object-cover rounded-lg border border-slate-200" />}
                        <input type="url" value={cat[field]} onChange={(e) => updateCategory(catIndex, field, e.target.value)} placeholder="URL..."
                          className="w-full px-3 py-2 bg-slate-50 border border-slate-100 rounded-lg text-xs focus:outline-none focus:border-primary" />
                        <label className="flex items-center justify-center gap-1 px-2 py-1.5 bg-slate-50 border border-dashed border-slate-200 rounded-lg cursor-pointer hover:border-primary text-[10px] text-slate-400 hover:text-primary transition-all">
                          <span className="material-symbols-outlined text-xs">cloud_upload</span>
                          Subir
                          <input type="file" accept="image/*" className="hidden" onChange={(e) => {
                            if (e.target.files?.[0]) handleImageUpload(catIndex, field, e.target.files[0])
                          }} />
                        </label>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Sub-services */}
                <div className="border-t border-slate-100 pt-5">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-xs font-black text-[#1a1c1e] uppercase tracking-wider">Tratamientos / Sub-servicios</h4>
                    <button onClick={() => addService(catIndex)}
                      className="text-primary text-xs font-bold flex items-center gap-1 hover:underline">
                      <span className="material-symbols-outlined text-sm">add</span>Agregar
                    </button>
                  </div>
                  <div className="space-y-3">
                    {cat.services.map((svc, svcIndex) => (
                      <div key={svcIndex} className="flex gap-3 items-start p-3 bg-slate-50 rounded-xl">
                        <div className="flex-1 space-y-2">
                          <input type="text" value={svc.name} onChange={(e) => updateService(catIndex, svcIndex, 'name', e.target.value)}
                            placeholder="Nombre del tratamiento" className="w-full px-3 py-2 bg-white border border-slate-100 rounded-lg text-xs focus:outline-none focus:border-primary" />
                          <input type="text" value={svc.description} onChange={(e) => updateService(catIndex, svcIndex, 'description', e.target.value)}
                            placeholder="Descripción breve" className="w-full px-3 py-2 bg-white border border-slate-100 rounded-lg text-xs focus:outline-none focus:border-primary" />
                        </div>
                        <button onClick={() => removeService(catIndex, svcIndex)}
                          className="p-1 rounded-lg hover:bg-red-50 text-slate-300 hover:text-red-500 transition-colors shrink-0">
                          <span className="material-symbols-outlined text-sm">close</span>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <CmsSaveButton onSave={handleSave} />
    </div>
  )
}
