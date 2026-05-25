'use client'

import { useState, useEffect } from 'react'
import { getProducts, getServices, createOrder, searchPatientByDni } from '@/lib/api'
import GlassCard from '@/components/ui/GlassCard'

export default function PosPage() {
  const [dni, setDni] = useState('')
  const [patient, setPatient] = useState<any>(null)
  const [products, setProducts] = useState<any[]>([])
  const [services, setServices] = useState<any[]>([])
  const [cart, setCart] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    async function loadItems() {
      try {
        const [p, s] = await Promise.all([getProducts(), getServices()])
        setProducts(p)
        // Services come in { data: [...] } format from getServices
        setServices((s as any).data || [])
      } catch (e) {
        console.error('Error loading POS items', e)
      } finally {
        setLoading(false)
      }
    }
    loadItems()
  }, [])

  const handleSearchPatient = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const res = await searchPatientByDni(dni)
      setPatient(res)
    } catch (err) {
      alert('Paciente no encontrado.')
    }
  }

  const addToCart = (item: any) => {
    const existing = cart.find(i => i.id === item.id)
    if (existing) {
      setCart(cart.map(i => i.id === item.id ? { ...i, qty: i.qty + 1 } : i))
    } else {
      setCart([...cart, { ...item, qty: 1 }])
    }
  }

  const removeFromCart = (id: string) => {
    setCart(cart.filter(i => i.id !== id))
  }

  const total = cart.reduce((acc, i) => acc + (i.price * i.qty), 0)

  const handleCheckout = async (paymentMethod: string) => {
    if (!patient) return alert('Por favor, busca un paciente primero.')
    if (cart.length === 0) return alert('El carrito está vacío.')

    setSubmitting(true)
    try {
      await createOrder({
        items: cart.map(i => ({ productId: i.id, quantity: i.qty })),
        paymentMethod: paymentMethod as any,
        source: 'POS'
      })
      alert('Venta realizada con éxito.')
      setCart([])
      setPatient(null)
      setDni('')
    } catch (err) {
      alert('Error al realizar la venta.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <main className="pt-28 pb-24 bg-[#F2F4F4] min-h-screen">
      <div className="max-w-[1400px] mx-auto px-6">
        <div className="flex justify-between items-center mb-10">
          <div>
            <p className="text-secondary font-bold text-sm uppercase tracking-widest mb-2">POS DERMQ</p>
            <h1 className="font-headline font-black text-4xl tracking-tighter text-[#1a1c1e]">Punto de Venta</h1>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Left Column: Patient & Products */}
          <div className="lg:col-span-2 space-y-8">
            {/* Patient Search */}
            <div className="bg-white rounded-4xl p-8 shadow-sm border border-slate-100">
               <h2 className="text-lg font-black uppercase text-slate-400 mb-6 flex items-center gap-2">
                 <span className="material-symbols-outlined">person_search</span>
                 Identificar Paciente
               </h2>
               <form onSubmit={handleSearchPatient} className="flex gap-4">
                  <input 
                    type="text" 
                    placeholder="Ingrese DNI"
                    className="flex-1 bg-slate-50 px-6 py-4 rounded-2xl font-bold outline-none border-2 border-transparent focus:border-secondary/20"
                    value={dni}
                    onChange={(e) => setDni(e.target.value)}
                  />
                  <button type="submit" className="bg-[#1a1c1e] text-white px-8 rounded-2xl font-bold hover:bg-secondary transition-all">
                    Buscar
                  </button>
               </form>
               {patient && (
                 <div className="mt-6 flex items-center gap-4 p-4 bg-emerald-50 rounded-2xl border border-emerald-100">
                    <div className="w-12 h-12 rounded-full bg-emerald-500 text-white flex items-center justify-center font-black">
                      {patient.firstName.charAt(0)}
                    </div>
                    <div>
                      <p className="font-black text-[#1a1c1e]">{patient.firstName} {patient.lastName}</p>
                      <p className="text-[10px] font-black uppercase text-emerald-600 tracking-widest">DNI: {patient.dni}</p>
                    </div>
                 </div>
               )}
            </div>

            {/* Catalog */}
            <div className="bg-white rounded-4xl p-8 shadow-sm border border-slate-100">
               <h2 className="text-lg font-black uppercase text-slate-400 mb-6">Catálogo de Productos y Servicios</h2>
               {loading ? (
                 <div className="py-20 flex justify-center"><span className="w-8 h-8 border-4 border-slate-100 border-t-secondary rounded-full animate-spin" /></div>
               ) : (
                 <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {products.map(p => (
                      <button 
                        key={p.id} 
                        onClick={() => addToCart(p)}
                        className="p-4 bg-slate-50 rounded-3xl text-left hover:bg-secondary/5 border-2 border-transparent hover:border-secondary/20 transition-all group"
                      >
                        <p className="font-black text-[#1a1c1e] text-sm group-hover:text-secondary truncate">{p.name}</p>
                        <p className="text-xs font-bold text-on-surface-variant mb-2">Stock: {p.stock}</p>
                        <p className="text-lg font-headline font-black text-secondary">S/ {p.price.toFixed(2)}</p>
                      </button>
                    ))}
                 </div>
               )}
            </div>
          </div>

          {/* Right Column: Cart & Summary */}
          <div className="space-y-8">
            <div className="bg-[#1a1c1e] text-white rounded-4xl p-8 shadow-2xl sticky top-28">
               <h2 className="text-xl font-headline font-black mb-8 flex items-center gap-2">
                 <span className="material-symbols-outlined">shopping_cart</span>
                 Resumen de Venta
               </h2>
               
               <div className="space-y-4 mb-8 min-h-[200px]">
                 {cart.length === 0 ? (
                   <p className="text-white/40 font-bold text-center py-10 italic">El carrito está vacío</p>
                 ) : (
                   cart.map(item => (
                     <div key={item.id} className="flex justify-between items-center p-4 bg-white/5 rounded-2xl">
                       <div className="min-w-0">
                         <p className="font-bold text-sm truncate">{item.name}</p>
                         <p className="text-[10px] text-white/50 font-black tracking-widest">{item.qty} x S/ {item.price.toFixed(2)}</p>
                       </div>
                       <button onClick={() => removeFromCart(item.id)} className="text-white/40 hover:text-red-400 transition-colors">
                         <span className="material-symbols-outlined text-lg">delete</span>
                       </button>
                     </div>
                   ))
                 )}
               </div>

               <div className="border-t border-white/10 pt-6 mb-8 text-right">
                  <p className="text-white/50 font-black uppercase tracking-widest text-[10px]">Total a Pagar</p>
                  <p className="text-4xl font-headline font-black text-secondary">S/ {total.toFixed(2)}</p>
               </div>

               <div className="space-y-4">
                  <p className="text-[10px] font-black uppercase text-white/40 mb-2">Seleccionar Método de Pago Físico</p>
                  <div className="grid grid-cols-2 gap-2">
                    <button onClick={() => handleCheckout('CASH')} disabled={submitting} className="bg-white/10 p-4 rounded-2xl font-bold flex flex-col items-center gap-1 hover:bg-emerald-500 transition-all disabled:opacity-50">
                      <span className="material-symbols-outlined">payments</span>
                      <span className="text-[10px]">Efectivo</span>
                    </button>
                    <button onClick={() => handleCheckout('CREDIT_CARD')} disabled={submitting} className="bg-white/10 p-4 rounded-2xl font-bold flex flex-col items-center gap-1 hover:bg-blue-500 transition-all disabled:opacity-50">
                      <span className="material-symbols-outlined">credit_card</span>
                      <span className="text-[10px]">Tarjeta POS</span>
                    </button>
                    <button onClick={() => handleCheckout('YAPE')} disabled={submitting} className="bg-white/10 p-4 rounded-2xl font-bold flex flex-col items-center gap-1 hover:bg-purple-500 transition-all disabled:opacity-50">
                      <span className="material-symbols-outlined">qr_code_2</span>
                      <span className="text-[10px]">Yape / Plin</span>
                    </button>
                    <button onClick={() => handleCheckout('TRANSFER')} disabled={submitting} className="bg-white/10 p-4 rounded-2xl font-bold flex flex-col items-center gap-1 hover:bg-orange-500 transition-all disabled:opacity-50">
                      <span className="material-symbols-outlined">account_balance</span>
                      <span className="text-[10px]">Transferencia</span>
                    </button>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
