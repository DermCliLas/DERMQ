'use client'

import { useState } from 'react'
import Link from 'next/link'
import { searchPatients } from '@/lib/api'

export default function PacientesSearchPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [patients, setPatients] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [searched, setSearched] = useState(false)

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!searchQuery.trim()) return

    setLoading(true)
    setError('')
    setPatients([])
    setSearched(true)

    try {
      const results = await searchPatients(searchQuery)
      setPatients(results)
      if (results.length === 0) {
        setError('No se encontraron pacientes que coincidan con la búsqueda.')
      }
    } catch (err: any) {
      setError(err.message || 'Error al realizar la búsqueda.')
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
            Ingresa el nombre, apellido o DNI del paciente para acceder a su historia clínica o crear una nueva evolución.
          </p>
        </div>

        <div className="bg-white rounded-4xl p-10 shadow-sm border border-slate-100 mb-10">
          <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">search</span>
              <input
                type="text"
                placeholder="Nombre, Apellido o DNI..."
                className="w-full bg-slate-50 border-2 border-transparent focus:border-primary/20 focus:bg-white rounded-2xl py-4 pl-12 pr-4 outline-none transition-all font-bold text-[#1a1c1e]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
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
            <div className="mt-6 p-4 bg-red-50 text-red-600 rounded-2xl flex items-center gap-3 font-medium text-sm">
              <span className="material-symbols-outlined">error</span>
              {error}
            </div>
          )}
        </div>

        {/* List of Patients Found */}
        {searched && patients.length > 0 && (
          <div className="space-y-6">
            <h3 className="text-xs font-black uppercase text-slate-400 tracking-wider">
              Resultados de Búsqueda ({patients.length})
            </h3>
            
            <div className="space-y-4">
              {patients.map(patient => (
                <div key={patient.id} className="bg-white rounded-4xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-shadow duration-300">
                  <div className="flex flex-col sm:flex-row items-center gap-6 justify-between">
                    <div className="flex items-center gap-4 text-center sm:text-left">
                      <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary text-2xl font-black shrink-0 overflow-hidden">
                        {patient.avatarUrl ? (
                          <img src={patient.avatarUrl} alt={patient.firstName} className="w-full h-full object-cover" />
                        ) : (
                          patient.firstName.charAt(0)
                        )}
                      </div>
                      <div>
                        <h2 className="text-xl font-headline font-black text-[#1a1c1e]">
                          {patient.firstName} {patient.lastName}
                        </h2>
                        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 mt-1.5 text-xs text-slate-500 font-bold">
                          <span className="flex items-center gap-1 bg-slate-50 px-2.5 py-1 rounded-full border border-slate-100">
                            <span className="material-symbols-outlined text-[14px]">badge</span>
                            DNI: {patient.dni || 'N/A'}
                          </span>
                          <span className="flex items-center gap-1 bg-slate-50 px-2.5 py-1 rounded-full border border-slate-100">
                            <span className="material-symbols-outlined text-[14px]">mail</span>
                            {patient.email}
                          </span>
                          {patient.phone && (
                            <span className="flex items-center gap-1 bg-slate-50 px-2.5 py-1 rounded-full border border-slate-100">
                              <span className="material-symbols-outlined text-[14px]">call</span>
                              {patient.phone}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <Link
                      href={`/dashboard/pacientes/${patient.id}`}
                      className="luminous-gradient text-white px-8 py-3.5 rounded-2xl font-bold glow-on-hover hover:scale-105 transition-all text-sm w-full sm:w-auto text-center"
                    >
                      Ver Historia Clínica
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
