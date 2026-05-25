import Link from 'next/link'

export default function BookingFab() {
  return (
    <Link href="/reservar" className="fixed bottom-10 right-10 z-50 group" aria-label="Reservar cita inmediata">
      <div className="absolute inset-0 bg-primary rounded-full blur-xl opacity-40 animate-pulse group-hover:animate-none group-hover:opacity-80 transition-opacity" />
      <div className="relative bg-primary text-white pl-6 pr-8 py-5 rounded-full shadow-2xl flex items-center gap-4 hover:scale-105 active:scale-95 transition-all">
        <span className="material-symbols-outlined text-2xl">event</span>
        <span className="font-headline font-bold tracking-tight text-lg">Cita Inmediata</span>
      </div>
    </Link>
  )
}
