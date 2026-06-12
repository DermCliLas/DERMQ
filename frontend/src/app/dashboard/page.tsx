'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useAuth } from '@/context/AuthContext'
import { useRouter } from 'next/navigation'
import { getPatientDashboard } from '@/lib/api'

export default function DashboardPage() {
  const { user, isLoading: authLoading, isAuthenticated } = useAuth()
  const router = useRouter()
  
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!authLoading && isAuthenticated && user) {
      if (user.role === 'ADMIN') {
        router.push('/dashboard/admin')
      } else if (user.role === 'DOCTOR') {
        router.push('/dashboard/doctor')
      } else if (user.role === 'RECEPTION') {
        router.push('/dashboard/recepcion/agenda')
      }
    }
  }, [user, authLoading, isAuthenticated, router])

  useEffect(() => {
    async function fetchDashboardData() {
      if (!isAuthenticated || !user) return
      if (user.role !== 'PATIENT') {
        setLoading(false)
        return
      }
      try {
        const result = await getPatientDashboard()
        setData(result)
      } catch (e) {
        console.error('Error fetching dashboard data', e)
      } finally {
        setLoading(false)
      }
    }
    fetchDashboardData()
  }, [isAuthenticated, user])

  // Allow showing loading only if user is patient or authentication is loading
  if (authLoading || (loading && !data && user?.role === 'PATIENT')) {
    return (
      <main className="pt-40 pb-24 min-h-screen bg-[#F2F4F4] flex flex-col items-center">
        <span className="w-10 h-10 border-4 border-slate-200 border-t-primary rounded-full animate-spin mb-4" />
        <p className="font-semibold text-slate-500">Cargando tu panel de control...</p>
      </main>
    )
  }

  if (!isAuthenticated) return null
  if (user?.role !== 'PATIENT') return null


  const stats = [
    { label: 'Citas Totales', value: data?.stats?.appointmentCount || '0', icon: 'event', color: 'bg-primary/10 text-primary' },
    { label: 'Citas Próximas', value: data?.upcomingAppointments?.length || '0', icon: 'today', color: 'bg-secondary/10 text-secondary' },
    { label: 'Puntos Loyalty', value: data?.stats?.loyaltyPoints || '0', icon: 'workspace_premium', color: 'bg-tertiary/10 text-tertiary' },
    { label: 'Pedidos Realizados', value: data?.stats?.orderCount || '0', icon: 'shopping_bag', color: 'bg-primary/10 text-primary' },
  ]

  return (
    <main className="pt-28 pb-24 bg-[#F2F4F4] min-h-screen">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
          <div>
            <p className="text-primary font-bold text-sm uppercase tracking-widest mb-2">Panel del Paciente</p>
            <h1 className="font-headline font-black text-4xl md:text-5xl tracking-tighter text-[#1a1c1e]">
              ¡Qué bueno verte, {user?.firstName}!
            </h1>
          </div>
          <Link href="/reservar" className="luminous-gradient text-white px-8 py-4 rounded-full font-bold glow-on-hover hover:scale-105 transition-all flex items-center gap-3">
            <span className="material-symbols-outlined">add</span>
            Programar Cita
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {stats.map(stat => (
            <div key={stat.label} className="bg-white rounded-3xl p-8 card-lift-sm cursor-default border border-white">
              <div className={`w-12 h-12 rounded-2xl ${stat.color} flex items-center justify-center mb-4`}>
                <span className="material-symbols-outlined text-xl">{stat.icon}</span>
              </div>
              <span className="block text-4xl font-headline font-black text-[#1a1c1e] mb-1">{stat.value}</span>
              <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">{stat.label}</span>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Upcoming Appointments */}
          <div className="bg-white rounded-4xl p-10 shadow-sm border border-slate-100">
            <h2 className="font-headline font-extrabold text-2xl mb-8 text-[#1a1c1e] flex items-center gap-3">
              <span className="material-symbols-outlined text-primary">calendar_month</span>
              Próximas Citas
            </h2>
            <div className="space-y-4">
              {!data?.upcomingAppointments?.length ? (
                <div className="py-10 text-center bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
                  <p className="text-on-surface-variant font-medium text-sm">No tienes citas próximas programadas.</p>
                  <Link href="/reservar" className="text-primary font-bold text-sm mt-2 inline-block hover:underline">Reserva tu primera cita aquí</Link>
                </div>
              ) : (
                data.upcomingAppointments.map((apt: any) => (
                  <div key={apt.id} className="flex items-center gap-6 p-6 bg-[#F2F4F4] rounded-2xl hover:bg-primary/5 transition-colors group cursor-pointer border border-transparent hover:border-primary/20">
                    <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-primary shrink-0 group-hover:scale-110 transition-transform shadow-sm">
                      <span className="material-symbols-outlined">event</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-[#1a1c1e] truncate">{apt.service?.name}</h3>
                      <p className="text-xs text-on-surface-variant font-medium">Dr. {apt.doctor?.firstName} {apt.doctor?.lastName}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="font-bold text-[#1a1c1e] text-sm">{new Date(apt.date).toLocaleDateString()}</p>
                      <p className="text-xs text-on-surface-variant">{new Date(apt.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest shrink-0 ${
                      apt.status === 'CONFIRMED'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}>
                      {apt.status === 'CONFIRMED' ? 'Confirmada' : 'Pendiente'}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Recent Orders */}
          <div className="bg-white rounded-4xl p-10 shadow-sm border border-slate-100">
            <h2 className="font-headline font-extrabold text-2xl mb-8 text-[#1a1c1e] flex items-center gap-3">
              <span className="material-symbols-outlined text-primary">local_mall</span>
              Pedidos Recientes
            </h2>
            <div className="space-y-4">
              {!data?.recentOrders?.length ? (
                <div className="py-10 text-center bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
                  <p className="text-on-surface-variant font-medium text-sm">Aún no has realizado compras en nuestra tienda.</p>
                  <Link href="/productos" className="text-primary font-bold text-sm mt-2 inline-block hover:underline">Visita nuestra tienda aquí</Link>
                </div>
              ) : (
                data.recentOrders.map((order: any) => (
                  <div key={order.id} className="flex items-center gap-6 p-6 bg-[#F2F4F4] rounded-2xl hover:bg-secondary/5 transition-colors group cursor-pointer border border-transparent hover:border-secondary/20">
                    <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-secondary shrink-0 group-hover:rotate-12 transition-transform shadow-sm">
                      <span className="material-symbols-outlined">shopping_bag</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-[#1a1c1e] text-sm truncate">
                        {order.items?.map((i: any) => i.product.name).join(', ')}
                      </h3>
                      <p className="text-[10px] text-on-surface-variant font-black uppercase tracking-widest">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-2 shrink-0">
                      <p className="font-headline font-black text-primary">S/ {order.total.toFixed(2)}</p>
                      {order.nubeFactPdfUrl && (
                        <a 
                          href={order.nubeFactPdfUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-[10px] font-black text-secondary uppercase hover:underline flex items-center gap-1"
                        >
                          <span className="material-symbols-outlined text-[12px]">download</span>
                          Comprobante
                        </a>
                      )}
                    </div>
                    <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[9px] font-black uppercase tracking-widest shrink-0">
                      Pagado
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
