'use client'

import { useState } from 'react'

interface CmsSaveButtonProps {
  onSave: () => Promise<void>
}

export default function CmsSaveButton({ onSave }: CmsSaveButtonProps) {
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState(false)

  const handleSave = async () => {
    setSaving(true)
    setSaved(false)
    setError(false)
    try {
      await onSave()
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch (e) {
      console.error('Error saving', e)
      setError(true)
      setTimeout(() => setError(false), 4000)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed bottom-8 right-8 z-40">
      <button
        onClick={handleSave}
        disabled={saving}
        className={`flex items-center gap-2 px-6 py-4 rounded-2xl font-bold text-sm shadow-xl transition-all ${
          error
            ? 'bg-rose-600 text-white'
            : saved
              ? 'bg-emerald-500 text-white'
              : 'bg-[#1a1c1e] text-white hover:bg-primary'
        }`}
      >
        {saving ? (
          <>
            <span className="material-symbols-outlined text-lg animate-spin">progress_activity</span>
            Guardando...
          </>
        ) : error ? (
          <>
            <span className="material-symbols-outlined text-lg">error</span>
            Error al guardar
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
  )
}
