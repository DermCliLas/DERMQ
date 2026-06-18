'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { getAppointments, getDoctors, updateAppointmentStatus, getBranches, getServices, getAvailableSlots, searchPatients, createAppointment } from '@/lib/api'
import { format, addHours, startOfDay, eachHourOfInterval, addMinutes } from 'date-fns'
import { es } from 'date-fns/locale'

export default function MasterAgendaPage() {
  const [doctors, setDoctors] = useState<any[]>([])
  const [appointments, setAppointments] = useState<any[]>([])
  const [branches, setBranches] = useState<any[]>([])
  const [selectedBranch, setSelectedBranch] = useState<string>('')
  const [selectedDate, setSelectedDate] = useState<string>(format(new Date(), 'yyyy-MM-dd'))
  const [loading, setLoading] = useState(true)

  // Scheduling modal states
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [services, setServices] = useState<any[]>([])
  const [patientQuery, setPatientQuery] = useState('')
  const [patientSuggestions, setPatientSuggestions] = useState<any[]>([])
  const [selectedPatient, setSelectedPatient] = useState<any>(null)
  const [searchingPatient, setSearchingPatient] = useState(false)
  const [bookingDocId, setBookingDocId] = useState('')
  const [bookingDate, setBookingDate] = useState('')
  const [bookingServiceId, setBookingServiceId] = useState('')
  const [bookingSlotTime, setBookingSlotTime] = useState('')
  const [bookingNotes, setBookingNotes] = useState('')
  const [availableSlots, setAvailableSlots] = useState<any[]>([])
  const [loadingSlots, setLoadingSlots] = useState(false)
  const [submittingBooking, setSubmittingBooking] = useState(false)
  const [bookingError, setBookingError] = useState<string | null>(null)

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

  // Load services for booking
  useEffect(() => {
    async function loadServices() {
      try {
        const res = await getServices()
        setServices(Array.isArray(res) ? res : res.data || [])
      } catch (err) {
        console.error('Error loading services', err)
      }
    }
    if (isModalOpen) {
      loadServices()
    }
  }, [isModalOpen])

  // Debounced patient search
  useEffect(() => {
    if (patientQuery.trim().length < 2 || selectedPatient) {
      setPatientSuggestions([])
      return
    }
    const delayDebounce = setTimeout(async () => {
      setSearchingPatient(true)
      try {
        const res = await searchPatients(patientQuery)
        setPatientSuggestions(res || [])
      } catch (err) {
        console.error('Error searching patients', err)
      } finally {
        setSearchingPatient(false)
      }
    }, 300)
    return () => clearTimeout(delayDebounce)
  }, [patientQuery, selectedPatient])

  // Load slots when doctor and date are chosen
  useEffect(() => {
    async function loadSlots() {
      if (!bookingDocId || !bookingDate) {
        setAvailableSlots([])
        return
      }
      setLoadingSlots(true)
      try {
        const res = await getAvailableSlots(bookingDocId, bookingDate)
        setAvailableSlots(res.slots || [])
      } catch (err) {
        console.error('Error loading slots', err)
      } finally {
        setLoadingSlots(false)
      }
    }
    loadSlots()
  }, [bookingDocId, bookingDate])

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

  const handleCreateAppointment = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedPatient) return setBookingError('Por favor seleccione un paciente.')
    if (!bookingDocId) return setBookingError('Por favor seleccione un especialista.')
    if (!bookingServiceId) return setBookingError('Por favor seleccione un tratamiento.')
    if (!bookingSlotTime) return setBookingError('Por favor elija un horario disponible.')

    setSubmittingBooking(true)
    setBookingError(null)

    try {
      await createAppointment({
        patientId: selectedPatient.id,
        doctorId: bookingDocId,
        serviceId: bookingServiceId,
        date: bookingSlotTime,
        notes: bookingNotes,
      })
      
      // Close and Reset
      setIsModalOpen(false)
      setSelectedPatient(null)
      setPatientQuery('')
      setBookingDocId('')
      setBookingDate('')
      setBookingServiceId('')
      setBookingSlotTime('')
      setBookingNotes('')
      
      loadData() // Reload calendar
    } catch (err: any) {
      setBookingError(err.message || 'Error al agendar la cita.')
    } finally {
      setSubmittingBooking(false)
    }
  }

  return (
    <main className="pt-28 pb-24 bg-[#F2F4F4] min-h-screen">
      <div className="max-w-[1600px] mx-auto px-6">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6 mb-10">
          <div className="flex flex-col md:flex-row md:items-end gap-6">
            <div>
              <p className="text-primary font-bold text-sm uppercase tracking-widest mb-2">Administración Clínica</p>
              <h1 className="font-headline font-black text-4xl md:text-5xl tracking-tighter text-[#1a1c1e]">
                Agenda Maestra
              </h1>
            </div>
            
            <div className="flex gap-3 mb-1">
              <Link 
                href="/dashboard/recepcion/pos"
                className="bg-white hover:bg-slate-50 text-secondary px-6 py-3 rounded-2xl font-bold border border-slate-200 shadow-sm transition-all flex items-center gap-2 text-sm"
              >
                <span className="material-symbols-outlined text-lg">shopping_cart</span>
                Ir al POS (Punto de Venta)
              </Link>
              
              <button 
                onClick={() => setIsModalOpen(true)}
                className="bg-primary hover:bg-[#025657] text-white px-6 py-3 rounded-2xl font-bold shadow-[0_8px_20px_rgba(2,105,106,0.2)] hover:scale-[1.02] active:scale-95 transition-all flex items-center gap-2 text-sm"
              >
                <span className="material-symbols-outlined text-lg">add</span>
                Nueva Cita
              </button>
            </div>
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

      {/* MODAL PARA AGENDAR NUEVA CITA */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-4xl max-w-2xl w-full p-8 shadow-2xl border border-slate-100 flex flex-col max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-headline font-black text-3xl text-[#1a1c1e] flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-4xl">calendar_month</span>
                Agendar Nueva Cita
              </h2>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <form onSubmit={handleCreateAppointment} className="space-y-6">
              {/* Buscador de Paciente */}
              <div className="relative">
                <label className="block text-sm font-bold text-[#1a1c1e] mb-2">Paciente</label>
                {selectedPatient ? (
                  <div className="flex justify-between items-center bg-[#f2fcfc] border-2 border-primary/30 p-4 rounded-2xl">
                    <div>
                      <p className="font-bold text-[#1a1c1e]">{selectedPatient.firstName} {selectedPatient.lastName}</p>
                      <p className="text-xs text-slate-500 font-mono">DNI: {selectedPatient.dni} | Tel: {selectedPatient.phone}</p>
                    </div>
                    <button 
                      type="button" 
                      onClick={() => { setSelectedPatient(null); setPatientQuery(''); }}
                      className="text-red-500 font-bold text-xs hover:underline uppercase"
                    >
                      Cambiar
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="relative flex items-center">
                      <span className="material-symbols-outlined text-slate-400 absolute left-4">search</span>
                      <input 
                        type="text"
                        placeholder="Buscar por Nombre, Apellido o DNI..."
                        className="w-full pl-12 pr-5 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:outline-none focus:border-primary focus:bg-white transition-all text-[#1a1c1e]"
                        value={patientQuery}
                        onChange={(e) => setPatientQuery(e.target.value)}
                      />
                      {searchingPatient && (
                        <span className="w-5 h-5 border-2 border-slate-200 border-t-primary rounded-full animate-spin absolute right-4" />
                      )}
                    </div>

                    {patientSuggestions.length > 0 && (
                      <div className="absolute top-[100%] left-0 right-0 mt-2 bg-white border border-slate-200 rounded-2xl shadow-xl max-h-48 overflow-y-auto z-50">
                        {patientSuggestions.map(p => (
                          <button
                            key={p.id}
                            type="button"
                            className="w-full text-left px-5 py-3 hover:bg-slate-50 transition-colors border-b border-slate-100 last:border-b-0"
                            onClick={() => setSelectedPatient(p)}
                          >
                            <p className="font-bold text-[#1a1c1e] text-sm">{p.firstName} {p.lastName}</p>
                            <p className="text-[10px] text-slate-500 font-mono">DNI: {p.dni} | Tel: {p.phone}</p>
                          </button>
                        ))}
                      </div>
                    )}
                  </>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Doctor */}
                <div>
                  <label className="block text-sm font-bold text-[#1a1c1e] mb-2">Especialista</label>
                  <select
                    className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:outline-none focus:border-primary focus:bg-white transition-all font-bold text-[#1a1c1e]"
                    value={bookingDocId}
                    onChange={(e) => setBookingDocId(e.target.value)}
                  >
                    <option value="">Seleccionar Especialista...</option>
                    {doctors.map(d => (
                      <option key={d.id} value={d.id}>Dr. {d.lastName}</option>
                    ))}
                  </select>
                </div>

                {/* Servicio */}
                <div>
                  <label className="block text-sm font-bold text-[#1a1c1e] mb-2">Tratamiento</label>
                  <select
                    className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:outline-none focus:border-primary focus:bg-white transition-all font-bold text-[#1a1c1e]"
                    value={bookingServiceId}
                    onChange={(e) => setBookingServiceId(e.target.value)}
                  >
                    <option value="">Seleccionar Servicio...</option>
                    {services.map(s => (
                      <option key={s.id} value={s.id}>{s.name} (S/ {s.price.toFixed(2)})</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Fecha */}
                <div>
                  <label className="block text-sm font-bold text-[#1a1c1e] mb-2">Fecha de Cita</label>
                  <input
                    type="date"
                    className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:outline-none focus:border-primary focus:bg-white transition-all font-bold text-[#1a1c1e]"
                    value={bookingDate}
                    onChange={(e) => setBookingDate(e.target.value)}
                  />
                </div>

                {/* Hora / Slots */}
                <div>
                  <label className="block text-sm font-bold text-[#1a1c1e] mb-2">Horario</label>
                  {loadingSlots ? (
                    <div className="flex items-center gap-2 py-4">
                      <span className="w-5 h-5 border-2 border-slate-200 border-t-primary rounded-full animate-spin" />
                      <span className="text-xs text-slate-400 font-bold">Consultando horas libres...</span>
                    </div>
                  ) : (
                    <select
                      className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:outline-none focus:border-primary focus:bg-white transition-all font-bold text-[#1a1c1e]"
                      value={bookingSlotTime}
                      disabled={availableSlots.length === 0}
                      onChange={(e) => setBookingSlotTime(e.target.value)}
                    >
                      <option value="">
                        {bookingDocId && bookingDate 
                          ? (availableSlots.length === 0 ? 'No hay horas disponibles' : 'Seleccionar Hora...') 
                          : 'Seleccione Doctor y Fecha primero'}
                      </option>
                      {availableSlots.map((s, idx) => {
                        const timeStr = new Date(s.time).toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit', hour12: true })
                        return (
                          <option key={idx} value={s.time}>{timeStr}</option>
                        )
                      })}
                    </select>
                  )}
                </div>
              </div>

              {/* Notas */}
              <div>
                <label className="block text-sm font-bold text-[#1a1c1e] mb-2">Notas Especiales / Síntomas</label>
                <textarea
                  className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:outline-none focus:border-primary focus:bg-white transition-all text-[#1a1c1e]"
                  placeholder="Escriba aquí notas para la consulta o síntomas del paciente..."
                  rows={3}
                  value={bookingNotes}
                  onChange={(e) => setBookingNotes(e.target.value)}
                />
              </div>

              {bookingError && (
                <div className="p-4 bg-red-50 text-red-600 rounded-2xl text-sm font-semibold flex items-center gap-2 border border-red-100">
                  <span className="material-symbols-outlined">error</span>
                  {bookingError}
                </div>
              )}

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-6 py-4 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold rounded-2xl transition-all"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={submittingBooking}
                  className="px-8 py-4 bg-primary hover:bg-[#025657] text-white font-bold rounded-2xl shadow-lg transition-all flex items-center justify-center disabled:opacity-70"
                >
                  {submittingBooking ? (
                    <span className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  ) : (
                    'Confirmar Cita'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  )
}
