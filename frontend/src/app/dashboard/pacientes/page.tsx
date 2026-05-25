'use client'

import { useState } from 'react'
import Link from 'next/link'
import { searchPatientByDni } from '@/lib/api'

export default function PacientesSearchPage() {
  const [dni, setDni] = useState('')
  const [patient, setPatient] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!dni) return

    setLoading(true)
    setError('')
    setPatient(null)

    try {
      const result = await searchPatientByDni(dni)
      setPatient(result)
    } catch (err: any) {
      setError(err.message || 'No se encontró al paciente.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="pt-28 pb-24 bg-[#F2F4F4] min-h-screen">
      <div className="max-w-4xl mx-auto px-6">
        <div className="mb-12">
          <p className="text-primary font-bold text-sm uppercase tracking-widest mb-2">Gestión Clínica</p>
          <h1 className="font-headline font-black text-4xl md:text-5xl tracking-tighter text-[#1a1c1e]">
            Buscar Paciente
          </h1>
          <p className="text-on-surface-variant mt-4 font-medium">
            Ingresa el DNI del paciente para acceder a su historia clínica o crear una nueva evolución.
          </p>
        </div>

        <div className="bg-white rounded-4xl p-10 shadow-sm border border-slate-100 mb-10">
          <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">search</span>
              <input
                type="text"
                placeholder="Número de DNI (8 dígitos)"
                className="w-full bg-slate-50 border-2 border-transparent focus:border-primary/20 focus:bg-white rounded-2xl py-4 pl-12 pr-4 outline-none transition-all font-bold text-[#1a1c1e]"
                value={dni}
                onChange={(e) => setDni(e.target.value)}
                maxLength={8}
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="bg-[#1a1c1e] text-white px-10 py-4 rounded-2xl font-bold hover:bg-primary transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <span className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  Buscando...
                </>
              ) : (
                'Buscar'
              )}
            </button>
          </form>

          {error && (
            <div className="mt-6 p-4 bg-red-50 text-red-600 rounded-2xl flex items-center gap-3 font-medium">
              <span className="material-symbols-outlined">error</span>
              {error}
            </div>
          )}
        </div>

        {patient && (
          <div className="bg-white rounded-4xl p-10 shadow-xl border-t-8 border-primary animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="w-32 h-32 bg-primary/10 rounded-3xl flex items-center justify-center text-primary text-5xl font-black shrink-0 overflow-hidden">
                {patient.avatarUrl ? (
                  <img src={patient.avatarUrl} alt={patient.firstName} className="w-full h-full object-cover" />
                ) : (
                  patient.firstName.charAt(0)
                )}
              </div>
              <div className="flex-1 text-center md:text-left">
                <h2 className="text-3xl font-headline font-black text-[#1a1c1e] mb-1">
                  {patient.firstName} {patient.lastName}
                </h2>
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 mt-4">
                  <div className="flex items-center gap-2 bg-slate-100 px-4 py-2 rounded-full text-xs font-bold text-slate-600">
                    <span className="material-symbols-outlined text-sm">badge</span>
                    DNI: {patient.dni}
                  </div>
                  <div className="flex items-center gap-2 bg-slate-100 px-4 py-2 rounded-full text-xs font-bold text-slate-600">
                    <span className="material-symbols-outlined text-sm">mail</span>
                    {patient.email}
                  </div>
                  {patient.phone && (
                    <div className="flex items-center gap-2 bg-slate-100 px-4 py-2 rounded-full text-xs font-bold text-slate-600">
                      <span className="material-symbols-outlined text-sm">call</span>
                      {patient.phone}
                    </div>
                  )}
                </div>
              </div>
              <Link
                href={`/dashboard/pacientes/${patient.id}`}
                className="luminous-gradient text-white px-10 py-5 rounded-2xl font-bold glow-on-hover hover:scale-105 transition-all text-center"
              >
                Ver Historia Clínica
              </Link>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
