'use client'

import { useEffect, useState } from 'react'
import { getAppointments } from '@/lib/api'
import { useAuth } from '@/context/AuthContext'
import Link from 'next/link'

export default function DoctorDashboardPage() {
  const { user, isAuthenticated } = useAuth()
  const [appointments, setAppointments] = useState<any[]>([])
  const [waitingPatients, setWaitingPatients] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const loadData = async () => {
    if (!user?.id) return
    try {
      const today = new Date().toISOString().split('T')[0]
      const result = await getAppointments({
        doctorId: user.id,
        startDate: today,
        endDate: today,
      })
      
      const allToday = result.data || []
      setAppointments(allToday)
      setWaitingPatients(allToday.filter((a: any) => a.status === 'ARRIVED'))
    } catch (e) {
      console.error('Error loading doctor agenda', e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
    // Poll for updates every 30 seconds to show arriving patients
    const interval = setInterval(loadData, 30000)
    return () => clearInterval(interval)
  }, [user])

  if (!isAuthenticated) return null

  return (
    <main className="pt-28 pb-24 bg-[#F2F4F4] min-h-screen">
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-12">
          <p className="text-primary font-bold text-sm uppercase tracking-widest mb-2">Panel de Especialista</p>
          <h1 className="font-headline font-black text-4xl md:text-5xl tracking-tighter text-[#1a1c1e]">
            ¡Hola, Dr. {user?.lastName}!
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Waiting Room - Main Focus */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-4xl p-10 shadow-xl border-t-8 border-emerald-500">
               <h2 className="text-2xl font-headline font-black mb-8 flex items-center gap-3">
                 <span className="material-symbols-outlined text-emerald-500 animate-pulse">hail</span>
                 Pacientes en Sala de Espera
                 <span className="bg-emerald-100 text-emerald-600 px-3 py-1 rounded-full text-xs animate-bounce">
                   {waitingPatients.length}
                 </span>
               </h2>

               <div className="space-y-4">
                 {waitingPatients.length === 0 ? (
                   <div className="py-20 text-center bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
                      <p className="text-slate-400 font-bold">No hay pacientes esperando en este momento.</p>
                   </div>
                 ) : (
                   waitingPatients.map(apt => (
                     <div key={apt.id} className="flex items-center gap-6 p-8 bg-emerald-50/50 rounded-3xl border border-emerald-100 group hover:bg-emerald-50 transition-all">
                        <div className="w-16 h-16 rounded-2xl bg-white shadow-sm flex items-center justify-center text-emerald-500 font-black text-2xl group-hover:scale-110 transition-transform">
                          {apt.patient.firstName.charAt(0)}
                        </div>
                        <div className="flex-1">
                          <p className="text-xs font-black uppercase text-emerald-600 tracking-widest mb-1">Paciente Listo</p>
                          <h3 className="text-2xl font-bold text-[#1a1c1e]">{apt.patient.firstName} {apt.patient.lastName}</h3>
                          <p className="font-medium text-slate-500 italic mt-1">{apt.service.name}</p>
                        </div>
                        <Link 
                          href={`/dashboard/pacientes/${apt.patientId}`}
                          className="bg-emerald-500 text-white px-8 py-4 rounded-2xl font-black shadow-lg shadow-emerald-500/20 hover:scale-105 transition-all flex items-center gap-2"
                        >
                          <span className="material-symbols-outlined">clinical_notes</span>
                          Iniciar Consulta
                        </Link>
                     </div>
                   ))
                 )}
               </div>
            </div>
          </div>

          {/* Side stats */}
          <div className="space-y-8">
             <div className="bg-[#1a1c1e] text-white rounded-4xl p-10 shadow-2xl">
                <h3 className="text-lg font-black uppercase text-white/40 mb-6 tracking-widest">Resumen de Hoy</h3>
                <div className="space-y-6">
                   <div className="flex justify-between items-end">
                      <p className="text-white/60 font-medium">Citas Pendientes</p>
                      <p className="text-4xl font-headline font-black text-secondary">
                        {appointments.filter(a => a.status === 'CONFIRMED').length}
                      </p>
                   </div>
                   <div className="flex justify-between items-end">
                      <p className="text-white/60 font-medium">Atendidos</p>
                      <p className="text-4xl font-headline font-black text-emerald-400">
                        {appointments.filter(a => a.status === 'COMPLETED').length}
                      </p>
                   </div>
                </div>
                <div className="mt-10 pt-10 border-t border-white/10">
                   <Link href="/dashboard/recepcion/agenda" className="text-primary font-bold flex items-center gap-2 hover:underline">
                      <span className="material-symbols-outlined">calendar_view_day</span>
                      Ver Agenda Completa
                   </Link>
                </div>
             </div>
          </div>
        </div>
      </div>
    </main>
  )
}
