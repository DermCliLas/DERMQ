'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { useCart } from '@/context/CartContext'
import { useAuth } from '@/context/AuthContext'
import { createOrder, type OrderPayload } from '@/lib/api'

// ─── Types ──────────────────────────────────────────────────────────────────
type PaymentMethod = 'CREDIT_CARD' | 'YAPE' | 'PLIN' | 'CASH' | 'TRANSFER'
type DocType = 'BOLETA' | 'FACTURA'
type CheckoutStep = 'form' | 'processing' | 'success' | 'error'

const PAYMENT_METHODS: { id: PaymentMethod; label: string; icon: string; desc: string }[] = [
  { id: 'CREDIT_CARD', label: 'Tarjeta de Crédito/Débito', icon: 'credit_card', desc: 'Visa, Mastercard, AMEX' },
  { id: 'YAPE', label: 'Yape', icon: 'phone_iphone', desc: 'Pago desde tu app' },
  { id: 'PLIN', label: 'Plin', icon: 'phone_iphone', desc: 'Pago desde tu app' },
  { id: 'TRANSFER', label: 'Transferencia Bancaria', icon: 'account_balance', desc: 'BCP, Interbank, BBVA' },
]

const PROCESSING_STEPS = [
  'Verificando método de pago...',
  'Procesando transacción segura...',
  'Actualizando inventario...',
  'Generando comprobante...',
]

export default function CheckoutPage() {
  const router = useRouter()
  const { items, totalPrice, totalItems, clearCart } = useCart()
  const { user, isAuthenticated } = useAuth()

  const [step, setStep] = useState<CheckoutStep>('form')
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('CREDIT_CARD')
  const [docType, setDocType] = useState<DocType>('BOLETA')
  const [ruc, setRuc] = useState('')
  const [processingStep, setProcessingStep] = useState(0)
  const [orderResult, setOrderResult] = useState<any>(null)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  const tax = totalPrice * 0.18
  const finalTotal = totalPrice + tax

  // Guard: must be logged in with items
  if (!isAuthenticated) {
    return (
      <main className="pt-40 pb-24 min-h-screen bg-[#F2F4F4] flex flex-col items-center justify-center">
        <div className="text-center">
          <span className="material-symbols-outlined text-5xl text-slate-300 mb-4 block">lock</span>
          <h2 className="font-headline font-bold text-2xl mb-3 text-[#1a1c1e]">Inicia sesión para continuar</h2>
          <p className="text-on-surface-variant mb-8">Necesitas una cuenta para completar tu compra.</p>
          <Link href="/login" className="luminous-gradient text-white px-8 py-4 rounded-full font-bold glow-on-hover transition-all">
            Iniciar Sesión
          </Link>
        </div>
      </main>
    )
  }

  if (items.length === 0 && step === 'form') {
    return (
      <main className="pt-40 pb-24 min-h-screen bg-[#F2F4F4] flex flex-col items-center justify-center">
        <div className="text-center">
          <span className="material-symbols-outlined text-5xl text-slate-300 mb-4 block">shopping_bag</span>
          <h2 className="font-headline font-bold text-2xl mb-3 text-[#1a1c1e]">Tu carrito está vacío</h2>
          <Link href="/productos" className="luminous-gradient text-white px-8 py-4 rounded-full font-bold glow-on-hover transition-all">
            Ver Productos
          </Link>
        </div>
      </main>
    )
  }

  const simulateProcessing = async () => {
    setStep('processing')
    // Animate through steps
    for (let i = 0; i < PROCESSING_STEPS.length; i++) {
      setProcessingStep(i)
      await new Promise(r => setTimeout(r, 900))
    }
  }

  const handleConfirm = async () => {
    try {
      await simulateProcessing()

      const payload: OrderPayload = {
        items: items.map(item => ({ productId: item.id, quantity: item.quantity })),
        paymentMethod,
        documentType: docType,
        source: 'WEB',
      }

      const result = await createOrder(payload)
      setOrderResult(result)
      clearCart()
      setStep('success')
    } catch (err: any) {
      setErrorMsg(err.message || 'Error al procesar el pago. Inténtalo de nuevo.')
      setStep('error')
    }
  }

  // ─── Processing Screen ──────────────────────────────────────────────────
  if (step === 'processing') {
    return (
      <main className="pt-28 pb-24 min-h-screen bg-[#F2F4F4] flex flex-col items-center justify-center">
        <div className="bg-white rounded-4xl p-16 shadow-xl border border-slate-100 max-w-md w-full text-center mx-4">
          {/* Animated lock icon */}
          <div className="relative w-24 h-24 mx-auto mb-8">
            <div className="absolute inset-0 rounded-full luminous-gradient opacity-20 animate-ping" />
            <div className="relative w-24 h-24 rounded-full luminous-gradient flex items-center justify-center">
              <span className="material-symbols-outlined text-white text-4xl">lock</span>
            </div>
          </div>

          <h2 className="font-headline font-black text-2xl text-[#1a1c1e] mb-3">
            Procesando tu pago...
          </h2>
          <p className="text-on-surface-variant mb-10 text-sm">
            Por favor no cierres esta ventana
          </p>

          {/* Animated steps */}
          <div className="space-y-3 text-left">
            {PROCESSING_STEPS.map((text, i) => (
              <div key={i} className={`flex items-center gap-3 transition-all duration-500 ${i <= processingStep ? 'opacity-100' : 'opacity-30'}`}>
                <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 transition-all duration-300 ${
                  i < processingStep ? 'bg-emerald-100' : i === processingStep ? 'luminous-gradient' : 'bg-slate-100'
                }`}>
                  {i < processingStep ? (
                    <span className="material-symbols-outlined text-emerald-600 text-xs">check</span>
                  ) : i === processingStep ? (
                    <span className="w-3 h-3 border-2 border-white/40 border-t-white rounded-full animate-spin block" />
                  ) : (
                    <span className="w-2 h-2 rounded-full bg-slate-300 block" />
                  )}
                </div>
                <span className={`text-sm font-medium ${i === processingStep ? 'text-primary font-bold' : 'text-on-surface-variant'}`}>
                  {text}
                </span>
              </div>
            ))}
          </div>

          {/* Progress bar */}
          <div className="mt-10 h-1.5 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full luminous-gradient rounded-full transition-all duration-700 ease-out"
              style={{ width: `${((processingStep + 1) / PROCESSING_STEPS.length) * 100}%` }}
            />
          </div>
        </div>
      </main>
    )
  }

  // ─── Success Screen ──────────────────────────────────────────────────────
  if (step === 'success') {
    return (
      <main className="pt-28 pb-24 min-h-screen bg-[#F2F4F4] flex flex-col items-center justify-center">
        <div className="bg-white rounded-4xl p-16 shadow-xl border border-slate-100 max-w-lg w-full text-center mx-4">
          <div className="w-24 h-24 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-8 animate-bounce-once">
            <span className="material-symbols-outlined text-emerald-600 text-5xl">check_circle</span>
          </div>
          <h2 className="font-headline font-black text-3xl text-[#1a1c1e] mb-3">¡Compra exitosa!</h2>
          <p className="text-on-surface-variant mb-2">Tu orden ha sido procesada correctamente.</p>
          {orderResult?.id && (
            <p className="text-xs text-slate-400 font-mono mb-8">Order #{orderResult.id.slice(0, 8).toUpperCase()}</p>
          )}

          <div className="bg-slate-50 rounded-3xl p-6 text-left mb-8 space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-on-surface-variant">Método de pago</span>
              <span className="font-semibold text-[#1a1c1e]">{PAYMENT_METHODS.find(p => p.id === paymentMethod)?.label}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-on-surface-variant">Comprobante</span>
              <span className="font-semibold text-[#1a1c1e]">{docType}</span>
            </div>
            <div className="flex justify-between text-sm border-t border-slate-200 pt-3 mt-1">
              <span className="font-bold text-[#1a1c1e]">Total pagado</span>
              <span className="font-headline font-black text-xl text-primary">S/ {finalTotal.toFixed(2)}</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href="/productos"
              className="flex-1 py-4 rounded-2xl border-2 border-primary text-primary font-bold text-center hover:bg-primary/5 transition-all"
            >
              Seguir comprando
            </Link>
            <Link
              href="/dashboard"
              className="flex-1 luminous-gradient text-white py-4 rounded-2xl font-bold text-center glow-on-hover hover:scale-[1.02] transition-all"
            >
              Ver mis pedidos
            </Link>
          </div>
        </div>
      </main>
    )
  }

  // ─── Error Screen ────────────────────────────────────────────────────────
  if (step === 'error') {
    return (
      <main className="pt-28 pb-24 min-h-screen bg-[#F2F4F4] flex flex-col items-center justify-center">
        <div className="bg-white rounded-4xl p-16 shadow-xl border border-slate-100 max-w-md w-full text-center mx-4">
          <div className="w-24 h-24 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-8">
            <span className="material-symbols-outlined text-red-500 text-5xl">error</span>
          </div>
          <h2 className="font-headline font-black text-3xl text-[#1a1c1e] mb-3">Error al procesar</h2>
          <p className="text-on-surface-variant mb-8">{errorMsg}</p>
          <button
            onClick={() => setStep('form')}
            className="w-full luminous-gradient text-white py-4 rounded-2xl font-bold glow-on-hover transition-all"
          >
            Intentar de nuevo
          </button>
        </div>
      </main>
    )
  }

  // ─── Main Checkout Form ──────────────────────────────────────────────────
  return (
    <main className="pt-28 pb-24 bg-[#F2F4F4] min-h-screen">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="flex items-center gap-4 mb-12">
          <Link href="/carrito" className="p-2 rounded-full hover:bg-slate-200 text-slate-500 transition-all">
            <span className="material-symbols-outlined">arrow_back</span>
          </Link>
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-primary">Paso final</p>
            <h1 className="font-headline font-black text-3xl md:text-4xl tracking-tight text-[#1a1c1e]">
              Confirmar Compra
            </h1>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left: Forms */}
          <div className="lg:col-span-7 space-y-8">

            {/* Customer Info (readonly from profile) */}
            <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm">
              <h2 className="font-headline font-bold text-xl text-[#1a1c1e] mb-6 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">person</span>
                Datos del Comprador
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Nombre</label>
                  <div className="bg-slate-50 rounded-2xl px-5 py-4 font-semibold text-[#1a1c1e] border-2 border-slate-100">
                    {user?.firstName} {user?.lastName}
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Email</label>
                  <div className="bg-slate-50 rounded-2xl px-5 py-4 font-semibold text-[#1a1c1e] border-2 border-slate-100 truncate">
                    {user?.email}
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm">
              <h2 className="font-headline font-bold text-xl text-[#1a1c1e] mb-6 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">payments</span>
                Método de Pago
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {PAYMENT_METHODS.map(method => (
                  <button
                    key={method.id}
                    onClick={() => setPaymentMethod(method.id)}
                    className={`flex items-center gap-4 p-5 rounded-2xl border-2 text-left transition-all duration-200 ${
                      paymentMethod === method.id
                        ? 'border-primary bg-primary/5 shadow-sm'
                        : 'border-slate-100 bg-slate-50 hover:border-slate-200'
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                      paymentMethod === method.id ? 'bg-primary/10 text-primary' : 'bg-slate-200 text-slate-500'
                    }`}>
                      <span className="material-symbols-outlined text-xl">{method.icon}</span>
                    </div>
                    <div>
                      <p className={`font-bold text-sm ${paymentMethod === method.id ? 'text-primary' : 'text-[#1a1c1e]'}`}>
                        {method.label}
                      </p>
                      <p className="text-xs text-on-surface-variant">{method.desc}</p>
                    </div>
                    {paymentMethod === method.id && (
                      <span className="material-symbols-outlined text-primary ml-auto text-sm">check_circle</span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Document Type */}
            <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm">
              <h2 className="font-headline font-bold text-xl text-[#1a1c1e] mb-6 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">receipt_long</span>
                Tipo de Comprobante
              </h2>
              <div className="flex gap-4">
                {(['BOLETA', 'FACTURA'] as DocType[]).map(type => (
                  <button
                    key={type}
                    onClick={() => setDocType(type)}
                    className={`flex-1 py-4 rounded-2xl border-2 font-bold transition-all text-sm ${
                      docType === type
                        ? 'border-primary bg-primary/5 text-primary'
                        : 'border-slate-100 bg-slate-50 text-slate-600 hover:border-slate-200'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
              {docType === 'FACTURA' && (
                <div className="mt-5">
                  <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">RUC</label>
                  <input
                    type="text"
                    value={ruc}
                    onChange={e => setRuc(e.target.value)}
                    placeholder="20123456789"
                    maxLength={11}
                    className="w-full rounded-2xl border-2 border-slate-100 bg-slate-50 px-5 py-4 font-medium focus:border-primary focus:bg-white focus:outline-none transition-all"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Right: Order Summary */}
          <div className="lg:col-span-5">
            <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-lg sticky top-32">
              <h3 className="font-headline font-black text-xl text-[#1a1c1e] mb-6">
                Resumen ({totalItems} {totalItems === 1 ? 'producto' : 'productos'})
              </h3>

              <div className="space-y-4 mb-6 max-h-56 overflow-y-auto pr-2">
                {items.map(item => (
                  <div key={item.id} className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center shrink-0">
                      {item.imageUrl ? (
                        <Image src={item.imageUrl} alt={item.name} width={44} height={44} className="object-cover rounded-xl" />
                      ) : (
                        <span className="material-symbols-outlined text-slate-300 text-xl">image</span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm text-[#1a1c1e] truncate">{item.name}</p>
                      <p className="text-xs text-on-surface-variant">x{item.quantity}</p>
                    </div>
                    <span className="font-bold text-sm text-[#1a1c1e] shrink-0">
                      S/ {(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="border-t border-slate-100 pt-6 space-y-3 mb-8">
                <div className="flex justify-between text-sm text-on-surface-variant">
                  <span>Subtotal</span>
                  <span>S/ {totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm text-on-surface-variant">
                  <span>IGV (18%)</span>
                  <span>S/ {tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-end pt-2 border-t border-slate-100">
                  <span className="font-bold text-[#1a1c1e]">Total</span>
                  <span className="font-headline font-black text-3xl text-primary">
                    S/ {finalTotal.toFixed(2)}
                  </span>
                </div>
              </div>

              <button
                id="btn-confirm-checkout"
                onClick={handleConfirm}
                className="w-full luminous-gradient text-white py-5 rounded-2xl font-bold text-lg glow-on-hover hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3"
              >
                <span className="material-symbols-outlined">lock</span>
                Confirmar y Pagar
              </button>

              <p className="text-center text-xs text-slate-400 mt-4 flex items-center justify-center gap-1">
                <span className="material-symbols-outlined text-xs">shield</span>
                Pago seguro · Datos encriptados SSL
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
