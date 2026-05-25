'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { useCart } from '@/context/CartContext'

export default function CarritoPage() {
  const { items, totalItems, totalPrice, updateQuantity, removeFromCart } = useCart()
  const tax = totalPrice * 0.18 // 18% IGV (Perú)
  const finalTotal = totalPrice + tax
  return (
    <main className="pt-40 pb-24 min-h-screen bg-surface-container-lowest">
      <div className="max-w-5xl mx-auto px-6">
        <h1 className="font-headline font-black text-4xl md:text-5xl tracking-tighter text-[#1a1c1e] mb-12">
          Tu Carrito
        </h1>
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 text-center">
            <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center mb-8">
              <span className="material-symbols-outlined text-primary text-5xl">shopping_bag</span>
            </div>
            <h2 className="font-headline font-bold text-3xl mb-4 text-[#1a1c1e]">
              Tu carrito está vacío
            </h2>
            <p className="text-on-surface-variant text-lg mb-10">
              Explora nuestros productos clínicos y agrega los que más te interesen.
            </p>
            <Link href="/productos" className="luminous-gradient text-white px-10 py-4 rounded-full font-bold glow-on-hover hover:scale-105 transition-all">
              Ver Productos
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
            <div className="lg:col-span-8 space-y-6">
              {items.map(item => (
                <div key={item.id} className="bg-white rounded-3xl p-6 flex flex-col sm:flex-row items-center gap-6 shadow-sm border border-slate-100 card-lift-sm">
                  <div className="w-24 h-24 rounded-2xl bg-slate-50 flex items-center justify-center shrink-0">
                    {item.imageUrl ? (
                      <Image src={item.imageUrl} alt={item.name} width={80} height={80} className="object-cover rounded-2xl" />
                    ) : (
                      <span className="material-symbols-outlined text-3xl text-slate-300">image</span>
                    )}
                  </div>
                  <div className="flex-1 text-center sm:text-left">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-primary mb-1 block">
                      {item.category}
                    </span>
                    <h3 className="font-headline font-bold text-xl text-[#1a1c1e] mb-2">{item.name}</h3>
                    <p className="text-lg font-black text-[#1a1c1e]">S/ {item.price.toFixed(2)}</p>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="flex items-center gap-3 bg-slate-50 rounded-full p-1 border border-slate-200">
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-8 h-8 rounded-full flex items-center justify-center bg-white shadow-sm hover:text-primary transition"
                      >
                        <span className="material-symbols-outlined text-sm">remove</span>
                      </button>
                      <span className="font-bold w-4 text-center">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-8 h-8 rounded-full flex items-center justify-center bg-white shadow-sm hover:text-primary transition"
                      >
                        <span className="material-symbols-outlined text-sm">add</span>
                      </button>
                    </div>
                    <button 
                      onClick={() => removeFromCart(item.id)}
                      className="w-10 h-10 rounded-full flex items-center justify-center text-red-400 hover:bg-red-50 hover:text-red-600 transition"
                      aria-label="Eliminar"
                    >
                      <span className="material-symbols-outlined">delete</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Resumen de Compra */}
            <div className="lg:col-span-4">
              <div className="bg-white rounded-3xl p-8 shadow-lg border border-slate-100 sticky top-32">
                <h3 className="font-headline font-black text-2xl text-[#1a1c1e] mb-6">Resumen</h3>
                
                <div className="space-y-4 mb-8">
                  <div className="flex justify-between items-center text-on-surface-variant font-medium">
                    <span>Subtotal ({totalItems} items)</span>
                    <span>S/ {totalPrice.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center text-on-surface-variant font-medium">
                    <span>Impuestos (IGV 18%)</span>
                    <span>S/ {tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center text-on-surface-variant font-medium">
                    <span>Delivery</span>
                    <span className="text-emerald-600 font-bold">Por calcular</span>
                  </div>
                </div>
                
                <div className="border-t border-slate-100 pt-6 mb-8">
                  <div className="flex justify-between items-end">
                    <span className="font-bold text-[#1a1c1e]">Total</span>
                    <span className="font-headline font-black text-4xl text-primary">
                      S/ {finalTotal.toFixed(2)}
                    </span>
                  </div>
                </div>
                
                <Link href="/carrito/checkout" className="w-full luminous-gradient text-white py-4 rounded-2xl font-bold glow-on-hover transition-all flex items-center justify-center gap-2">
                  <span className="material-symbols-outlined text-lg">lock</span>
                  Ir a Pagar
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
