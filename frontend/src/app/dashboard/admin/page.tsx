'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useAuth } from '@/context/AuthContext'
import { getProducts, getAllOrders, getAppointments } from '@/lib/api'

export default function AdminDashboardPage() {
  const { user, isAuthenticated } = useAuth()
  
  const [orders, setOrders] = useState<any[]>([])
  const [products, setProducts] = useState<any[]>([])
  const [appointmentsCount, setAppointmentsCount] = useState(0)
  
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadAdminData() {
      try {
        const [o, p, a] = await Promise.all([
          getAllOrders(),
          getProducts(),
          getAppointments({ limit: 250 })
        ])
        
        setOrders(o || [])
        setProducts(p || [])
        setAppointmentsCount(a?.meta?.total || a?.data?.length || 0)
      } catch (e) {
        console.error('Error loading admin dashboard data', e)
      } finally {
        setLoading(false)
      }
    }
    loadAdminData()
  }, [])

  if (!isAuthenticated) return null
  if (user?.role !== 'ADMIN') {
    return (
      <main className="pt-40 pb-24 min-h-screen bg-[#F2F4F4] flex flex-col items-center">
        <span className="material-symbols-outlined text-red-500 text-5xl mb-4">gpp_maybe</span>
        <h2 className="font-headline font-bold text-2xl text-[#1a1c1e] mb-2">Acceso Restringido</h2>
        <p className="text-slate-500 text-sm">No tienes permisos para ver este panel de administración.</p>
        <Link href="/dashboard" className="mt-6 text-primary font-bold hover:underline">Volver a mi panel</Link>
      </main>
    )
  }

  // Cálculos de métricas
  const totalSales = orders.reduce((acc, o) => acc + (o.total || 0), 0)
  const totalOrdersCount = orders.length
  
  // Alertas de stock bajo (< 3 unidades)
  const lowStockProducts = products.filter(p => p.stock <= 3)
  const lowStockCount = lowStockProducts.length

  // Métodos de pago
  const paymentsBreakdown = orders.reduce((acc: any, o) => {
    const method = o.paymentMethod || 'CASH'
    acc[method] = (acc[method] || 0) + (o.total || 0)
    return acc
  }, {})

  // Canales de venta
  const channelsBreakdown = orders.reduce((acc: any, o) => {
    const source = o.source || 'POS'
    acc[source] = (acc[source] || 0) + (o.total || 0)
    return acc
  }, {})

  const stats = [
    { label: 'Ingresos Totales', value: `S/ ${totalSales.toFixed(2)}`, icon: 'payments', color: 'bg-emerald-100 text-emerald-800' },
    { label: 'Pedidos Procesados', value: totalOrdersCount, icon: 'receipt_long', color: 'bg-blue-100 text-blue-800' },
    { label: 'Citas Programadas', value: appointmentsCount, icon: 'calendar_month', color: 'bg-purple-100 text-purple-800' },
    { label: 'Stock Crítico (≤ 3)', value: lowStockCount, icon: 'warning', color: lowStockCount > 0 ? 'bg-red-100 text-red-800 animate-pulse' : 'bg-slate-100 text-slate-800' },
  ]

  const getMethodLabel = (m: string) => {
    const map: Record<string, string> = {
      CASH: 'Efectivo',
      CREDIT_CARD: 'Tarjeta POS/Web',
      YAPE: 'Yape / Plin',
      PLIN: 'Yape / Plin',
      TRANSFER: 'Transferencia'
    }
    return map[m] || m
  }

  const getMethodColor = (m: string) => {
    const map: Record<string, string> = {
      CASH: 'bg-emerald-500',
      CREDIT_CARD: 'bg-blue-500',
      YAPE: 'bg-purple-500',
      TRANSFER: 'bg-orange-500'
    }
    return map[m] || 'bg-slate-500'
  }

  return (
    <main className="pt-28 pb-24 bg-[#F2F4F4] min-h-screen">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Encabezado */}
        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-end gap-6 mb-12">
          <div>
            <p className="text-primary font-bold text-sm uppercase tracking-widest mb-1">Panel de Control</p>
            <h1 className="font-headline font-black text-4xl md:text-5xl tracking-tighter text-[#1a1c1e]">
              Administración General
            </h1>
          </div>
          
          {/* Navegación de Administración */}
          <div className="flex flex-wrap gap-3">
            <Link 
              href="/dashboard/admin/productos"
              className="bg-white hover:bg-slate-50 text-[#1a1c1e] px-6 py-3 rounded-2xl font-bold border border-slate-200 shadow-sm transition-all flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-lg">inventory_2</span>
              Gestionar Catálogo
            </Link>
            <Link 
              href="/dashboard/recepcion/pos"
              className="bg-white hover:bg-slate-50 text-secondary px-6 py-3 rounded-2xl font-bold border border-slate-200 shadow-sm transition-all flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-lg">shopping_cart</span>
              Ir al POS
            </Link>
            <Link 
              href="/dashboard/recepcion/agenda"
              className="bg-white hover:bg-slate-50 text-primary px-6 py-3 rounded-2xl font-bold border border-slate-200 shadow-sm transition-all flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-lg">calendar_month</span>
              Ver Agenda
            </Link>
          </div>
        </div>

        {loading ? (
          <div className="py-32 flex flex-col items-center justify-center">
            <span className="w-12 h-12 border-4 border-slate-200 border-t-primary rounded-full animate-spin mb-4" />
            <p className="font-bold text-slate-500">Cargando métricas y reportes...</p>
          </div>
        ) : (
          <div className="space-y-10">
            
            {/* KPIs */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map(stat => (
                <div key={stat.label} className="bg-white rounded-3xl p-8 border border-white shadow-sm hover:shadow-md transition-all">
                  <div className={`w-12 h-12 rounded-2xl ${stat.color} flex items-center justify-center mb-4`}>
                    <span className="material-symbols-outlined text-xl">{stat.icon}</span>
                  </div>
                  <span className="block text-3xl md:text-4xl font-headline font-black text-[#1a1c1e] mb-1">{stat.value}</span>
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{stat.label}</span>
                </div>
              ))}
            </div>

            {/* Fila Central: Reportes */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
              
              {/* Canales y Métodos de Pago */}
              <div className="bg-white rounded-4xl p-10 shadow-sm border border-slate-100 flex flex-col justify-between">
                <div>
                  <h2 className="text-xl font-headline font-black text-[#1a1c1e] mb-6 flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary">pie_chart</span>
                    Métodos de Pago
                  </h2>
                  <div className="space-y-5">
                    {Object.keys(paymentsBreakdown).length === 0 ? (
                      <p className="text-slate-400 text-xs italic">No hay datos de ventas.</p>
                    ) : (
                      Object.keys(paymentsBreakdown).map(method => {
                        const amount = paymentsBreakdown[method]
                        const percentage = totalSales > 0 ? (amount / totalSales) * 100 : 0
                        return (
                          <div key={method} className="space-y-1">
                            <div className="flex justify-between text-xs font-bold text-[#1a1c1e]">
                              <span>{getMethodLabel(method)}</span>
                              <span>S/ {amount.toFixed(2)} ({percentage.toFixed(0)}%)</span>
                            </div>
                            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                              <div 
                                className={`h-full ${getMethodColor(method)} rounded-full`}
                                style={{ width: `${percentage}%` }}
                              />
                            </div>
                          </div>
                        )
                      })
                    )}
                  </div>
                </div>

                <div className="border-t border-slate-100 pt-6 mt-8">
                  <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-4">Canales de Venta</h3>
                  <div className="flex gap-6">
                    <div className="flex-1">
                      <p className="text-[10px] font-bold text-slate-400 uppercase">POS (En Clínica)</p>
                      <p className="text-2xl font-headline font-black text-secondary">
                        S/ {(channelsBreakdown.POS || 0).toFixed(2)}
                      </p>
                    </div>
                    <div className="flex-1 border-l border-slate-100 pl-6">
                      <p className="text-[10px] font-bold text-slate-400 uppercase">Web (Tienda Online)</p>
                      <p className="text-2xl font-headline font-black text-primary">
                        S/ {(channelsBreakdown.WEB || 0).toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Alerta de Stock Bajo */}
              <div className="bg-white rounded-4xl p-10 shadow-sm border border-slate-100 lg:col-span-2">
                <h2 className="text-xl font-headline font-black text-[#1a1c1e] mb-6 flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-red-500">warning</span>
                    Alertas de Inventario Crítico
                  </span>
                  {lowStockCount > 0 && (
                    <span className="bg-red-100 text-red-700 font-bold px-3 py-1 rounded-full text-xs">
                      {lowStockCount} alertas
                    </span>
                  )}
                </h2>

                <div className="space-y-3 max-h-[280px] overflow-y-auto pr-1">
                  {lowStockCount === 0 ? (
                    <div className="py-12 text-center bg-emerald-50 rounded-3xl border border-emerald-100 text-emerald-800">
                      <span className="material-symbols-outlined text-3xl mb-2">check_circle</span>
                      <p className="font-bold text-sm">¡Excelente! Todos los productos tienen stock saludable.</p>
                    </div>
                  ) : (
                    lowStockProducts.map(p => (
                      <div key={p.id} className="flex justify-between items-center p-4 bg-red-50/50 hover:bg-red-50 border border-red-100 rounded-2xl transition-colors">
                        <div>
                          <p className="font-bold text-sm text-[#1a1c1e]">{p.name}</p>
                          <p className="text-[10px] font-mono text-slate-400 mt-0.5">SKU: {p.sku}</p>
                        </div>
                        <div className="text-right flex items-center gap-6">
                          <div>
                            <p className="text-[9px] font-bold text-slate-400 uppercase">Inventario</p>
                            <p className={`text-xl font-headline font-black ${p.stock === 0 ? 'text-red-600' : 'text-amber-600'}`}>
                              {p.stock} uds.
                            </p>
                          </div>
                          <Link 
                            href="/dashboard/admin/productos" 
                            className="bg-white hover:bg-slate-100 border border-slate-200 text-[#1a1c1e] px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-sm"
                          >
                            Abastecer
                          </Link>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* Ventas Recientes */}
            <div className="bg-white rounded-4xl p-10 shadow-sm border border-slate-100">
              <h2 className="text-xl font-headline font-black text-[#1a1c1e] mb-8 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">history</span>
                Historial de Ventas Recientes
              </h2>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 text-[10px] font-black uppercase tracking-wider text-slate-400 pb-4">
                      <th className="pb-4">Fecha</th>
                      <th className="pb-4">Comprobante</th>
                      <th className="pb-4">Cliente</th>
                      <th className="pb-4">Método de Pago</th>
                      <th className="pb-4">Origen</th>
                      <th className="pb-4 text-right">Total</th>
                      <th className="pb-4 text-center">Acción</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="py-12 text-center text-slate-400 italic">No hay órdenes registradas.</td>
                      </tr>
                    ) : (
                      orders.slice(0, 8).map(order => (
                        <tr key={order.id} className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors">
                          <td className="py-4 text-xs font-bold text-[#1a1c1e]">
                            {new Date(order.createdAt).toLocaleDateString()}
                          </td>
                          <td className="py-4 text-xs font-bold text-[#1a1c1e]">
                            <div className="flex flex-col">
                              <span>{order.documentType}</span>
                              <span className="text-[10px] text-slate-400 font-mono">{order.documentNumber || 'Interno'}</span>
                            </div>
                          </td>
                          <td className="py-4 text-xs">
                            <p className="font-bold text-[#1a1c1e]">{order.user?.firstName} {order.user?.lastName}</p>
                            <p className="text-[10px] text-slate-400 font-mono">DNI: {order.user?.dni || 'N/A'}</p>
                          </td>
                          <td className="py-4 text-xs font-medium text-slate-600">
                            {getMethodLabel(order.paymentMethod)}
                          </td>
                          <td className="py-4 text-xs">
                            <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider ${
                              order.source === 'POS' ? 'bg-orange-100 text-orange-800' : 'bg-purple-100 text-purple-800'
                            }`}>
                              {order.source}
                            </span>
                          </td>
                          <td className="py-4 text-xs font-headline font-black text-right text-primary">
                            S/ {order.total.toFixed(2)}
                          </td>
                          <td className="py-4 text-center">
                            {order.nubeFactPdfUrl ? (
                              <a 
                                href={order.nubeFactPdfUrl} 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="text-secondary hover:text-primary text-xs font-black uppercase flex items-center justify-center gap-1 hover:underline"
                              >
                                <span className="material-symbols-outlined text-[16px]">picture_as_pdf</span>
                                PDF
                              </a>
                            ) : (
                              <span className="text-slate-300 text-[10px] italic">No disponible</span>
                            )}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}
      </div>
    </main>
  )
}
