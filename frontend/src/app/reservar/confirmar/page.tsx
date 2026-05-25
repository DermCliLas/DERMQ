'use client'

import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import BookingStepper from '@/components/booking/BookingStepper'
import { useBooking } from '@/context/BookingContext'
import { createAppointment, createGuestAppointment } from '@/lib/api'

import { useAuth } from '@/context/AuthContext'

export default function ReservarPaso4() {
  const router = useRouter()
  const { booking, setNotes, resetBooking } = useBooking()
  const { user } = useAuth()
  
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [guestData, setGuestData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    dni: '',
    phone: '',
  })

  const handleConfirm = async () => {
    if (!booking.selectedDoctor || !booking.selectedService || !booking.selectedDate || !booking.selectedTimeSlot) {
      setError('Faltan datos para crear la reserva. Por favor, revisa los pasos anteriores.')
      return
    }

    if (!user && (!guestData.firstName || !guestData.lastName || !guestData.email || !guestData.dni)) {
      setError('Por favor, completa tus datos de contacto obligatorios para finalizar la reserva.')
      return
    }

    setLoading(true)
    setError(null)
    try {
      const timeStr = booking.selectedTimeSlot.time;
      let combinedDateStr = (booking.selectedTimeSlot as any).rawTime;
      
      if (!combinedDateStr) {
        const dateStr = booking.selectedDate;
        const [time, modifier] = timeStr.split(' ');
        let [hours, minutes] = time.split(':');
        if (hours === '12') hours = '00';
        if (modifier === 'PM') hours = String(parseInt(hours, 10) + 12);
        combinedDateStr = new Date(`${dateStr}T${hours.padStart(2, '0')}:${minutes}:00`).toISOString();
      }

      if (user) {
        await createAppointment({
          patientId: user.id,
          doctorId: booking.selectedDoctor.id,
          serviceId: booking.selectedService.id,
          date: combinedDateStr,
          notes: booking.patientNotes || '',
        })
      } else {
        await createGuestAppointment({
          doctorId: booking.selectedDoctor.id,
          serviceId: booking.selectedService.id,
          date: combinedDateStr,
          notes: booking.patientNotes || '',
          ...guestData,
        })
      }
      
      setSubmitted(true)
      // resetBooking() - keeping context until fully redirect
    } catch (err: any) {
      setError(err.message || 'Error al conectar con el servidor.')
    } finally {
      setLoading(false)
    }
  }

  const handleBack = () => router.push('/reservar/horario')

  if (submitted) {
    return (
      <main className="pt-40 pb-24 flex items-center justify-center min-h-screen bg-surface-container-lowest">
        <div className="max-w-xl w-full mx-auto px-6 text-center text-reveal">
          <div className="w-24 h-24 rounded-full luminous-gradient flex items-center justify-center mx-auto mb-8 shadow-glow-lg">
            <span className="material-symbols-filled text-white text-5xl">check_circle</span>
          </div>
          <h1 className="font-headline font-black text-5xl tracking-tighter text-[#1a1c1e] mb-4">
            ¡Reserva Confirmada!
          </h1>
          <p className="text-on-surface-variant text-lg mb-10 leading-relaxed">
            Recibirás un correo de confirmación. Recuerda llegar 10 minutos antes de tu cita.
          </p>
          <button
            onClick={() => router.push('/')}
            className="luminous-gradient text-white px-10 py-5 rounded-full font-bold text-lg glow-on-hover hover:scale-105 transition-all"
          >
            Volver al Inicio
          </button>
        </div>
      </main>
    )
  }

  const details = [
    {
      icon: 'spa',
      label: 'Servicio',
      value: booking.selectedService?.name ?? '—',
    },
    {
      icon: 'medical_information',
      label: 'Especialista',
      value: booking.selectedDoctor
        ? `Dr. ${booking.selectedDoctor.firstName} ${booking.selectedDoctor.lastName}`
        : '—',
    },
    {
      icon: 'event',
      label: 'Fecha',
      value: booking.selectedDate ?? '—',
    },
    {
      icon: 'schedule',
      label: 'Hora',
      value: booking.selectedTimeSlot?.time ?? '—',
    },
    {
      icon: 'payments',
      label: 'Precio estimado',
      value: booking.selectedService ? `S/ ${booking.selectedService.price.toFixed(2)}` : '—',
    },
  ]

  return (
    <main className="pt-40 pb-24 relative overflow-hidden bg-surface-container-lowest min-h-screen">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[150px] pointer-events-none soft-float" />

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10 w-full text-reveal">
        <header className="mb-16 max-w-3xl">
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-widest mb-6">
            Paso 4 de 4
          </span>
          <h1 className="font-headline font-black text-5xl md:text-6xl tracking-tighter text-[#1a1c1e] mb-4 leading-tight">
            Confirma tu{' '}
            <span className="italic text-primary">Reserva.</span>
          </h1>
          <p className="font-medium text-on-surface-variant text-xl leading-relaxed">
            Revisa los detalles de tu cita antes de finalizar. No se realizará ningún cobro ahora.
          </p>
        </header>

        <BookingStepper currentStep={4} />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          <section className="lg:col-span-8 space-y-8">
            {/* Appointment Detail Card */}
            <div className="bg-white rounded-4xl p-10 border border-slate-100 shadow-sm">
              <h4 className="font-headline font-extrabold text-2xl mb-8 text-[#1a1c1e]">
                Resumen de tu Cita
              </h4>
              <div className="space-y-6">
                {details.map(detail => (
                  <div
                    key={detail.label}
                    className="flex items-center gap-5 py-3 border-b border-slate-50 last:border-0"
                  >
                    <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                      <span className="material-symbols-outlined text-xl">{detail.icon}</span>
                    </div>
                    <div className="flex-1">
                      <span className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-0.5">
                        {detail.label}
                      </span>
                      <span className="font-bold text-[#1a1c1e] text-lg">{detail.value}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Specialist Card */}
            {booking.selectedDoctor && (
              <div className="bg-white rounded-4xl p-8 border border-slate-100 shadow-sm flex gap-6 items-center">
                <div className="relative w-20 h-20 rounded-2xl overflow-hidden shrink-0">
                  {booking.selectedDoctor.avatarUrl && (
                    <Image
                      src={booking.selectedDoctor.avatarUrl}
                      alt={`Dr. ${booking.selectedDoctor.firstName}`}
                      fill
                      className="object-cover"
                    />
                  )}
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                    Tu especialista
                  </p>
                  <h4 className="font-headline font-bold text-xl text-[#1a1c1e]">
                    Dr. {booking.selectedDoctor.firstName} {booking.selectedDoctor.lastName}
                  </h4>
                  <p className="text-primary font-semibold text-sm">
                    {booking.selectedDoctor.specialty}
                  </p>
                </div>
              </div>
            )}

            {/* Guest Form (If not logged in) */}
            {!user && (
              <div className="bg-white rounded-4xl p-10 border border-slate-100 shadow-sm animate-fade-in">
                <h4 className="font-headline font-extrabold text-xl mb-6 text-[#1a1c1e] flex items-center gap-3">
                  <span className="material-symbols-outlined text-primary">person_add</span>
                  Tus Datos Personales
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Nombre *</label>
                    <input type="text" value={guestData.firstName} onChange={e => setGuestData({...guestData, firstName: e.target.value})} className="w-full rounded-2xl border-2 border-slate-100 bg-slate-50 p-4 text-sm focus:border-primary focus:bg-white outline-none transition-colors" placeholder="P. ej. Juan" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Apellidos *</label>
                    <input type="text" value={guestData.lastName} onChange={e => setGuestData({...guestData, lastName: e.target.value})} className="w-full rounded-2xl border-2 border-slate-100 bg-slate-50 p-4 text-sm focus:border-primary focus:bg-white outline-none transition-colors" placeholder="P. ej. Pérez" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">DNI / CE *</label>
                    <input type="text" value={guestData.dni} onChange={e => setGuestData({...guestData, dni: e.target.value})} className="w-full rounded-2xl border-2 border-slate-100 bg-slate-50 p-4 text-sm focus:border-primary focus:bg-white outline-none transition-colors" placeholder="71234567" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Correo Electrónico *</label>
                    <input type="email" value={guestData.email} onChange={e => setGuestData({...guestData, email: e.target.value})} className="w-full rounded-2xl border-2 border-slate-100 bg-slate-50 p-4 text-sm focus:border-primary focus:bg-white outline-none transition-colors" placeholder="correo@ejemplo.com" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-bold text-slate-700 mb-2">Celular</label>
                    <input type="tel" value={guestData.phone} onChange={e => setGuestData({...guestData, phone: e.target.value})} className="w-full rounded-2xl border-2 border-slate-100 bg-slate-50 p-4 text-sm focus:border-primary focus:bg-white outline-none transition-colors" placeholder="+51 987 654 321" />
                  </div>
                </div>
              </div>
            )}

            {/* Notes */}
            <div className="bg-white rounded-4xl p-10 border border-slate-100 shadow-sm">
              <h4 className="font-headline font-extrabold text-xl mb-4 text-[#1a1c1e]">
                Notas adicionales (opcional)
              </h4>
              <textarea
                value={booking.patientNotes}
                onChange={e => setNotes(e.target.value)}
                placeholder="Indica si tienes alguna alergia, condición especial o consulta previa para tu especialista..."
                rows={4}
                className="w-full rounded-2xl border-2 border-slate-100 bg-slate-50 p-5 text-[#1a1c1e] font-medium placeholder:text-slate-300 focus:border-primary focus:bg-white focus:outline-none transition-all resize-none"
              />
            </div>

            {/* Extra Info */}
            <p className="text-sm text-on-surface-variant leading-relaxed px-2">
              Al confirmar aceptas nuestros{' '}
              <a href="#" className="text-primary font-semibold hover:underline">
                Términos de Servicio
              </a>{' '}
              y{' '}
              <a href="#" className="text-primary font-semibold hover:underline">
                Política de Privacidad
              </a>
              . No realizaremos ningún cobro en este momento.
            </p>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 text-red-600 p-6 rounded-2xl border border-red-100 flex items-start gap-4">
                <span className="material-symbols-outlined shrink-0">error</span>
                <p className="text-sm font-semibold leading-relaxed">{error}</p>
              </div>
            )}

            {/* Actions */}
            <div className="flex justify-between items-center pt-4">
              <button
                onClick={handleBack}
                className="flex items-center gap-2 text-slate-500 font-bold hover:text-[#1a1c1e] transition-colors px-4 py-2"
              >
                <span className="material-symbols-outlined">arrow_back</span>
                Atrás
              </button>
              <button
                onClick={handleConfirm}
                disabled={loading}
                className="luminous-gradient text-white px-12 py-5 rounded-full font-bold text-lg shadow-[0_15px_30px_rgba(2,105,106,0.25)] hover:scale-[1.02] active:scale-95 transition-all flex items-center gap-3 glow-on-hover disabled:opacity-70 min-w-[240px] justify-center"
              >
                {loading ? (
                  <>
                    <span className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                    Confirmando...
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined">check_circle</span>
                    Confirmar Reserva
                  </>
                )}
              </button>
            </div>
          </section>

          {/* Right side trust info */}
          <aside className="lg:col-span-4">
            <div className="lg:sticky lg:top-32 space-y-6">
              <div className="bg-primary text-white rounded-4xl p-8 shadow-xl relative overflow-hidden">
                <div className="absolute -bottom-6 -left-6 w-24 h-24 bg-white/10 rounded-full blur-xl pointer-events-none" />
                <span className="material-symbols-filled text-4xl block mb-4 relative z-10">
                  security
                </span>
                <div className="relative z-10">
                  <h4 className="font-bold text-xl mb-3">Reserva 100% Segura</h4>
                  <p className="text-white/80 text-sm leading-relaxed">
                    No se realiza ningún cargo hasta el día de tu consulta. Puedes cancelar hasta
                    24h antes sin costo.
                  </p>
                </div>
              </div>

              <div className="bg-white rounded-4xl p-8 border border-slate-100 shadow-sm space-y-5">
                <h4 className="font-headline font-bold text-lg text-[#1a1c1e]">
                  ¿Qué pasa después?
                </h4>
                {[
                  { step: '01', text: 'Recibirás un email de confirmación inmediatamente.' },
                  { step: '02', text: 'El evento se agendará en tu Google Calendar automáticamente.' },
                  { step: '03', text: 'Te enviaremos un recordatorio 24h antes de tu cita.' },
                ].map(item => (
                  <div key={item.step} className="flex gap-4">
                    <span className="text-[10px] font-black text-primary tracking-widest mt-0.5">{item.step}</span>
                    <p className="text-sm font-medium text-on-surface-variant leading-relaxed">{item.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  )
}
