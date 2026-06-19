'use client'

import { useEffect, useState } from 'react'
import { getSiteContent, updateSiteContent, uploadFile } from '@/lib/api'

interface Slide {
  type: 'video' | 'image'
  src: string
  title: string
  subtitle: string
}

const DEFAULT_SLIDES: Slide[] = [
  {
    type: 'video',
    src: 'https://assets.mixkit.co/videos/preview/mixkit-medical-professional-examining-patient-skin-40090-large.mp4',
    title: 'DERMQ LIMA',
    subtitle: 'La cúspide de la excelencia dermatológica.',
  },
  {
    type: 'image',
    src: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80&w=2000',
    title: 'ARTE Y CIENCIA',
    subtitle: 'Tecnología vanguardista para el cuidado integral de tu piel.',
  },
  {
    type: 'image',
    src: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=2000',
    title: 'ESTÉTICA AVANZADA',
    subtitle: 'Especialistas dedicados a revelar tu luminosidad natural.',
  },
]

export default function HeroCmsPage() {
  const [slides, setSlides] = useState<Slide[]>(DEFAULT_SLIDES)
  const [editingIndex, setEditingIndex] = useState<number | null>(null)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    async function load() {
      const content = await getSiteContent('hero')
      if (content?.data?.slides) {
        setSlides(content.data.slides)
      }
    }
    load()
  }, [])

  const handleSave = async () => {
    setSaving(true)
    setSaved(false)
    try {
      await updateSiteContent('hero', { slides })
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch (e) {
      console.error('Error saving hero', e)
    } finally {
      setSaving(false)
    }
  }

  const handleAddSlide = () => {
    setSlides([...slides, { type: 'image', src: '', title: '', subtitle: '' }])
    setEditingIndex(slides.length)
  }

  const handleRemoveSlide = (index: number) => {
    const newSlides = slides.filter((_, i) => i !== index)
    setSlides(newSlides)
    setEditingIndex(null)
  }

  const handleUpdateSlide = (index: number, field: keyof Slide, value: string) => {
    const newSlides = [...slides]
    newSlides[index] = { ...newSlides[index], [field]: value }
    setSlides(newSlides)
  }

  const handleMoveSlide = (index: number, direction: 'up' | 'down') => {
    const newSlides = [...slides]
    const targetIndex = direction === 'up' ? index - 1 : index + 1
    if (targetIndex < 0 || targetIndex >= newSlides.length) return
    ;[newSlides[index], newSlides[targetIndex]] = [newSlides[targetIndex], newSlides[index]]
    setSlides(newSlides)
  }

  const handleImageUpload = async (index: number, file: File) => {
    setUploading(true)
    try {
      const result = await uploadFile(file)
      const url = result.url || result
      handleUpdateSlide(index, 'src', url as string)
    } catch (e) {
      console.error('Error uploading image', e)
    } finally {
      setUploading(false)
    }
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-10">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <span className="material-symbols-outlined text-primary text-2xl">view_carousel</span>
            <h1 className="font-headline font-black text-3xl tracking-tighter text-[#1a1c1e]">
              Hero / Carrusel
            </h1>
          </div>
          <p className="text-on-surface-variant text-sm ml-[40px]">
            Gestiona los slides del carrusel principal del sitio web.
          </p>
        </div>
        <button
          onClick={handleAddSlide}
          className="bg-primary text-white px-5 py-3 rounded-xl font-bold text-sm flex items-center gap-2 hover:bg-primary-container transition-colors shadow-sm"
        >
          <span className="material-symbols-outlined text-lg">add</span>
          Nuevo Slide
        </button>
      </div>

      {/* Slides List */}
      <div className="space-y-4">
        {slides.map((slide, index) => (
          <div
            key={index}
            className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden"
          >
            {/* Slide Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
              <div className="flex items-center gap-4">
                <span className="text-sm font-black text-slate-300 w-8">#{index + 1}</span>
                <h3 className="font-bold text-[#1a1c1e] text-sm">{slide.title || 'Sin título'}</h3>
                <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider ${
                  slide.type === 'video' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'
                }`}>
                  {slide.type === 'video' ? 'Video' : 'Imagen'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => handleMoveSlide(index, 'up')} disabled={index === 0}
                  className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-[#1a1c1e] transition-colors disabled:opacity-30">
                  <span className="material-symbols-outlined text-lg">arrow_upward</span>
                </button>
                <button onClick={() => handleMoveSlide(index, 'down')} disabled={index === slides.length - 1}
                  className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-[#1a1c1e] transition-colors disabled:opacity-30">
                  <span className="material-symbols-outlined text-lg">arrow_downward</span>
                </button>
                <button onClick={() => setEditingIndex(editingIndex === index ? null : index)}
                  className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-primary transition-colors">
                  <span className="material-symbols-outlined text-lg">{editingIndex === index ? 'expand_less' : 'edit'}</span>
                </button>
                <button onClick={() => handleRemoveSlide(index)}
                  className="p-1.5 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-600 transition-colors">
                  <span className="material-symbols-outlined text-lg">delete</span>
                </button>
              </div>
            </div>

            {/* Slide Editor */}
            {editingIndex === index && (
              <div className="p-6 space-y-5">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Left: Preview */}
                  <div>
                    <label className="block text-[10px] font-black text-[#1a1c1e] mb-2 uppercase tracking-wider">Vista Previa</label>
                    <div className="relative aspect-video bg-slate-100 rounded-xl overflow-hidden border border-slate-200">
                      {slide.src ? (
                        slide.type === 'video' ? (
                          <video src={slide.src} muted loop autoPlay playsInline className="w-full h-full object-cover" />
                        ) : (
                          <img src={slide.src} alt={slide.title} className="w-full h-full object-cover" />
                        )
                      ) : (
                        <div className="flex items-center justify-center h-full text-slate-300">
                          <span className="material-symbols-outlined text-4xl">image</span>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center text-white text-center p-4">
                        <div>
                          <h4 className="text-xl font-bold mb-1">{slide.title || 'Título'}</h4>
                          <p className="text-sm opacity-80">{slide.subtitle || 'Subtítulo'}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right: Form */}
                  <div className="space-y-4">
                    <div>
                      <label className="block text-[10px] font-black text-[#1a1c1e] mb-1.5 uppercase tracking-wider">Tipo de Media</label>
                      <select
                        value={slide.type}
                        onChange={(e) => handleUpdateSlide(index, 'type', e.target.value)}
                        className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-xl focus:outline-none focus:border-primary focus:bg-white transition-all text-sm text-[#1a1c1e]"
                      >
                        <option value="image">Imagen</option>
                        <option value="video">Video</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] font-black text-[#1a1c1e] mb-1.5 uppercase tracking-wider">Título</label>
                      <input
                        type="text"
                        value={slide.title}
                        onChange={(e) => handleUpdateSlide(index, 'title', e.target.value)}
                        placeholder="ej. DERMQ LIMA"
                        className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-xl focus:outline-none focus:border-primary focus:bg-white transition-all text-sm text-[#1a1c1e]"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black text-[#1a1c1e] mb-1.5 uppercase tracking-wider">Subtítulo</label>
                      <input
                        type="text"
                        value={slide.subtitle}
                        onChange={(e) => handleUpdateSlide(index, 'subtitle', e.target.value)}
                        placeholder="ej. La cúspide de la excelencia dermatológica."
                        className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-xl focus:outline-none focus:border-primary focus:bg-white transition-all text-sm text-[#1a1c1e]"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black text-[#1a1c1e] mb-1.5 uppercase tracking-wider">
                        URL de la {slide.type === 'video' ? 'Video' : 'Imagen'}
                      </label>
                      <input
                        type="url"
                        value={slide.src}
                        onChange={(e) => handleUpdateSlide(index, 'src', e.target.value)}
                        placeholder="https://..."
                        className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-xl focus:outline-none focus:border-primary focus:bg-white transition-all text-sm text-[#1a1c1e]"
                      />
                    </div>
                    {slide.type === 'image' && (
                      <div>
                        <label className="block text-[10px] font-black text-[#1a1c1e] mb-1.5 uppercase tracking-wider">
                          O subir imagen
                        </label>
                        <label className="flex items-center justify-center gap-2 px-4 py-3 bg-slate-50 border-2 border-dashed border-slate-200 rounded-xl cursor-pointer hover:border-primary hover:bg-primary/5 transition-all text-sm text-slate-400 hover:text-primary">
                          <span className="material-symbols-outlined text-lg">{uploading ? 'progress_activity' : 'cloud_upload'}</span>
                          {uploading ? 'Subiendo...' : 'Seleccionar archivo'}
                          <input type="file" accept="image/*" className="hidden" onChange={(e) => {
                            if (e.target.files?.[0]) handleImageUpload(index, e.target.files[0])
                          }} />
                        </label>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Save Button */}
      <div className="fixed bottom-8 right-8 z-40">
        <button
          onClick={handleSave}
          disabled={saving}
          className={`flex items-center gap-2 px-6 py-4 rounded-2xl font-bold text-sm shadow-xl transition-all ${
            saved
              ? 'bg-emerald-500 text-white'
              : 'bg-[#1a1c1e] text-white hover:bg-primary'
          }`}
        >
          {saving ? (
            <>
              <span className="material-symbols-outlined text-lg animate-spin">progress_activity</span>
              Guardando...
            </>
          ) : saved ? (
            <>
              <span className="material-symbols-outlined text-lg">check_circle</span>
              ¡Guardado!
            </>
          ) : (
            <>
              <span className="material-symbols-outlined text-lg">save</span>
              Guardar Cambios
            </>
          )}
        </button>
      </div>
    </div>
  )
}
