'use client'

import { useBooking } from '@/context/BookingContext'

export default function BookingSummary() {
  const { booking } = useBooking()

  const items = [
    {
      icon: 'spa',
      label: 'Servicio',
      value: booking.selectedService?.name ?? null,
      emptyText: 'Por seleccionar',
    },
    {
      icon: 'medical_information',
      label: 'Especialista',
      value: booking.selectedDoctor
        ? `${booking.selectedDoctor.firstName} ${booking.selectedDoctor.lastName}`
        : null,
      emptyText: 'Por seleccionar',
    },
    {
      icon: 'event',
      label: 'Fecha y Hora',
      value:
        booking.selectedDate && booking.selectedTimeSlot
          ? `${booking.selectedDate} • ${booking.selectedTimeSlot.time}`
          : null,
      emptyText: 'Por seleccionar',
    },
  ]

  const total = booking.selectedService?.price ?? null

  return (
    <aside className="lg:col-span-4">
      <div className="lg:sticky lg:top-32 space-y-6">
        {/* Summary Card */}
        <div className="bg-white rounded-4xl p-10 border border-slate-100 shadow-xl card-lift colored-shadow-hover relative overflow-hidden cursor-default">
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary/5 rounded-full blur-2xl pointer-events-none" />

          <h2 className="font-headline font-extrabold text-3xl mb-8 tracking-tight text-[#1a1c1e] relative z-10">
            Tu Cita
          </h2>

          <div className="space-y-8 relative z-10">
            {items.map(item => (
              <div key={item.label} className={`flex gap-5 ${!item.value ? 'opacity-40' : ''}`}>
                <div
                  className={`h-12 w-12 rounded-2xl flex items-center justify-center flex-shrink-0 ${
                    item.value ? 'bg-primary/10 text-primary' : 'bg-slate-100 text-slate-500'
                  }`}
                >
                  <span className="material-symbols-outlined font-bold">{item.icon}</span>
                </div>
                <div>
                  <span className="block text-[10px] uppercase tracking-widest text-[#1a1c1e] opacity-40 font-black mb-1">
                    {item.label}
                  </span>
                  <span
                    className={`font-bold text-lg leading-tight block ${
                      item.value ? 'text-[#1a1c1e]' : 'text-slate-600 italic'
                    }`}
                  >
                    {item.value ?? item.emptyText}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {total !== null && (
            <div className="mt-10 pt-8 border-t border-slate-100 relative z-10">
              <div className="flex justify-between items-center mb-3">
                <span className="font-medium text-on-surface-variant">Subtotal de reserva</span>
                <span className="font-bold text-[#1a1c1e]">
                  S/ {total.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between items-end text-lg font-bold">
                <div>
                  <span className="block text-xl">Total Estimado</span>
                  <span className="text-xs text-on-surface-variant font-medium">
                    No se cobra ahora
                  </span>
                </div>
                <span className="text-3xl font-black font-headline text-primary">
                  S/ {total.toFixed(2)}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Trust Badge */}
        <div className="bg-primary p-6 rounded-3xl flex flex-col items-center justify-center gap-4 text-center text-white shadow-lg relative overflow-hidden card-lift-sm">
          <div className="absolute -bottom-4 -left-4 w-20 h-20 bg-white/20 rounded-full blur-xl pointer-events-none" />
          <span className="material-symbols-filled text-4xl block relative z-10">security</span>
          <div className="relative z-10">
            <h4 className="font-bold text-base mb-1">Reserva Protegida</h4>
            <p className="text-xs font-medium text-white/80 leading-relaxed max-w-[200px] mx-auto">
              Tu reserva es segura. No se realizará ningún cargo hasta el día de tu consulta en la
              clínica.
            </p>
          </div>
        </div>
      </div>
    </aside>
  )
}
