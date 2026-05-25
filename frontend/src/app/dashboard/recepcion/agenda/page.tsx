'use client'

import { useEffect, useState } from 'react'
import { getAppointments, getDoctors, updateAppointmentStatus, getBranches } from '@/lib/api'
import { format, addHours, startOfDay, eachHourOfInterval, addMinutes } from 'date-fns'
import { es } from 'date-fns/locale'

export default function MasterAgendaPage() {
  const [doctors, setDoctors] = useState<any[]>([])
  const [appointments, setAppointments] = useState<any[]>([])
  const [branches, setBranches] = useState<any[]>([])
  const [selectedBranch, setSelectedBranch] = useState<string>('')
  const [selectedDate, setSelectedDate] = useState<string>(format(new Date(), 'yyyy-MM-dd'))
  const [loading, setLoading] = useState(true)

  // Calendar configuration
  const HOURES = eachHourOfInterval({
    start: addHours(startOfDay(new Date()), 8), // 8 AM
    end: addHours(startOfDay(new Date()), 20),   // 8 PM
  })

  const loadData = async () => {
    setLoading(true)
    try {
      const [docs, brs] = await Promise.all([getDoctors(), getBranches()])
      setDoctors(docs)
      setBranches(brs)
      
      if (brs.length > 0 && !selectedBranch) {
        setSelectedBranch(brs[0].id)
      }

      const agendaData = await getAppointments({
        startDate: selectedDate,
        endDate: selectedDate,
        branchId: selectedBranch || brs[0]?.id
      })
      setAppointments(agendaData.data || [])
    } catch (e) {
      console.error('Error loading agenda', e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [selectedDate, selectedBranch])

  const handleCheckIn = async (appointmentId: string) => {
    try {
      await updateAppointmentStatus(appointmentId, 'ARRIVED')
      loadData() // Refresh
    } catch (err) {
      alert('Error al marcar llegada del paciente.')
    }
  }

  const getAptForSlot = (doctorId: string, hour: Date) => {
    return appointments.find(apt => {
        const aptDate = new Date(apt.date)
        return apt.doctorId === doctorId && 
               aptDate.getHours() === hour.getHours() &&
               aptDate.getMinutes() < 30; // Simplification for 1 hour slots in this view
    })
  }

  return (
    <main className="pt-28 pb-24 bg-[#F2F4F4] min-h-screen">
      <div className="max-w-[1600px] mx-auto px-6">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6 mb-10">
          <div>
            <p className="text-primary font-bold text-sm uppercase tracking-widest mb-2">Administración Clínica</p>
            <h1 className="font-headline font-black text-4xl md:text-5xl tracking-tighter text-[#1a1c1e]">
              Agenda Maestra
            </h1>
          </div>
          
          <div className="flex flex-wrap gap-4 bg-white p-4 rounded-3xl shadow-sm border border-slate-100">
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-black uppercase text-slate-400 ml-2">Sede</label>
              <select 
                className="bg-slate-50 px-4 py-2 rounded-xl font-bold outline-none border-2 border-transparent focus:border-primary/20"
                value={selectedBranch}
                onChange={(e) => setSelectedBranch(e.target.value)}
              >
                {branches.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
              </select>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-black uppercase text-slate-400 ml-2">Fecha</label>
              <input 
                type="date"
                className="bg-slate-50 px-4 py-2 rounded-xl font-bold outline-none border-2 border-transparent focus:border-primary/20"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
              />
            </div>
          </div>
        </div>

        {loading ? (
          <div className="bg-white rounded-4xl p-40 flex flex-col items-center justify-center">
            <span className="w-12 h-12 border-4 border-slate-200 border-t-primary rounded-full animate-spin mb-6" />
            <p className="font-bold text-slate-400 tracking-tight">Sincronizando agenda maestra...</p>
          </div>
        ) : (
          <div className="bg-white rounded-4xl shadow-xl overflow-hidden border border-slate-100">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-[#1a1c1e] text-white">
                    <th className="p-6 text-left font-black uppercase tracking-widest text-xs w-24 sticky left-0 bg-[#1a1c1e] z-30 border-r border-white/10">Hora</th>
                    {doctors.map(doc => (
                      <th key={doc.id} className="p-6 text-center border-l border-white/10 min-w-[280px]">
                        <div className="flex items-center justify-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-xs font-black">
                            {doc.firstName.charAt(0)}
                          </div>
                          <div className="text-left">
                            <p className="font-bold leading-none mb-1">Dr. {doc.lastName}</p>
                            <p className="text-[9px] font-black uppercase text-primary tracking-widest">{doc.specialty}</p>
                          </div>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {HOURES.map((hour, hIdx) => (
                    <tr key={hIdx} className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors">
                      <td className="p-6 font-black text-slate-400 text-sm border-r border-slate-100 sticky left-0 bg-white z-20">
                        {format(hour, 'HH:mm')}
                      </td>
                      {doctors.map(doc => {
                        const apt = getAptForSlot(doc.id, hour);
                        return (
                          <td key={`${doc.id}-${hIdx}`} className="p-3 h-32 border-l border-slate-100 relative">
                            {apt ? (
                              <div className={`h-full rounded-2xl p-4 border-l-4 shadow-sm flex flex-col justify-between transition-all hover:scale-[1.02] cursor-pointer ${
                                apt.status === 'ARRIVED' ? 'bg-emerald-50 border-emerald-500' :
                                apt.status === 'CONFIRMED' ? 'bg-blue-50 border-blue-500' :
                                'bg-slate-50 border-slate-300'
                              }`}>
                                <div>
                                  <div className="flex justify-between items-start mb-2">
                                    <h4 className="font-black text-[#1a1c1e] text-sm leading-tight uppercase">
                                      {apt.patient.firstName} {apt.patient.lastName}
                                    </h4>
                                    <span className={`px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-tighter ${
                                      apt.status === 'ARRIVED' ? 'bg-emerald-500 text-white' : 
                                      apt.status === 'CONFIRMED' ? 'bg-blue-500 text-white' : 'bg-slate-400 text-white'
                                    }`}>
                                      {apt.status === 'ARRIVED' ? 'En Sede' : apt.status === 'CONFIRMED' ? 'Confirmada' : 'Pendiente'}
                                    </span>
                                  </div>
                                  <p className="text-[10px] font-bold text-on-surface-variant truncate">{apt.service.name}</p>
                                </div>
                                
                                {apt.status === 'CONFIRMED' && (
                                  <button 
                                    onClick={(e) => { e.stopPropagation(); handleCheckIn(apt.id); }}
                                    className="w-full mt-2 bg-emerald-500 text-white text-[10px] font-black py-2 rounded-xl hover:bg-emerald-600 transition-colors flex items-center justify-center gap-1"
                                  >
                                    <span className="material-symbols-outlined text-xs">how_to_reg</span>
                                    Marcar Llegada
                                  </button>
                                )}
                              </div>
                            ) : (
                              <div className="h-full border-2 border-dashed border-slate-100 rounded-2xl" />
                            )}
                          </td>
                        )
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
