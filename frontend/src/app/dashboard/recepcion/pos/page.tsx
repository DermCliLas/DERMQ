'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { getProducts, getServices, createOrder, searchPatientByDni, searchPatients } from '@/lib/api'
import GlassCard from '@/components/ui/GlassCard'

export default function PosPage() {
  const [dni, setDni] = useState('')
  const [patient, setPatient] = useState<any>(null)
  const [products, setProducts] = useState<any[]>([])
  const [cart, setCart] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  // Estados específicos para Lector e Impresora
  const [skuInput, setSkuInput] = useState('')
  const [printerIp, setPrinterIp] = useState('192.168.1.150')
  const [completedOrder, setCompletedOrder] = useState<any>(null)

  // Autocompletado de paciente
  const [searchQuery, setSearchQuery] = useState('')
  const [suggestions, setSuggestions] = useState<any[]>([])
  const [searching, setSearching] = useState(false)

  useEffect(() => {
    if (searchQuery.trim().length < 2) {
      setSuggestions([])
      return
    }
    const delayDebounceFn = setTimeout(async () => {
      setSearching(true)
      try {
        const res = await searchPatients(searchQuery)
        setSuggestions(res || [])
      } catch (err) {
        console.error('Error fetching suggestions', err)
      } finally {
        setSearching(false)
      }
    }, 300)

    return () => clearTimeout(delayDebounceFn)
  }, [searchQuery])

  // Referencias para evitar re-bindear listeners de eventos globales
  const productsRef = useRef<any[]>([])
  const cartRef = useRef<any[]>([])

  useEffect(() => {
    productsRef.current = products
  }, [products])

  useEffect(() => {
    cartRef.current = cart
  }, [cart])

  // Cargar IP de la impresora guardada en localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedIp = localStorage.getItem('dermq_printer_ip')
      if (savedIp) {
        setPrinterIp(savedIp)
      }
    }
  }, [])

  const handleIpChange = (ip: string) => {
    setPrinterIp(ip)
    if (typeof window !== 'undefined') {
      localStorage.setItem('dermq_printer_ip', ip)
    }
  }

  // Cargar Catálogo de Productos
  useEffect(() => {
    async function loadItems() {
      try {
        const p = await getProducts()
        setProducts(p)
      } catch (e) {
        console.error('Error loading POS items', e)
      } finally {
        setLoading(false)
      }
    }
    loadItems()
  }, [])

  // Web Audio API Beep
  const playBeep = () => {
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext
      if (!AudioContextClass) return
      const audioCtx = new AudioContextClass()
      const oscillator = audioCtx.createOscillator()
      const gainNode = audioCtx.createGain()

      oscillator.connect(gainNode)
      gainNode.connect(audioCtx.destination)

      oscillator.type = 'sine'
      oscillator.frequency.setValueAtTime(1400, audioCtx.currentTime) // Tono agudo y limpio
      gainNode.gain.setValueAtTime(0.08, audioCtx.currentTime) // Volumen bajo/medio

      oscillator.start()
      oscillator.stop(audioCtx.currentTime + 0.08) // Duración 80ms
    } catch (err) {
      console.error('Failed to play beep', err)
    }
  }

  // Agregar al carrito
  const addToCart = (item: any) => {
    const currentCart = cartRef.current
    const existing = currentCart.find(i => i.id === item.id)
    if (existing) {
      setCart(currentCart.map(i => i.id === item.id ? { ...i, qty: i.qty + 1 } : i))
    } else {
      setCart([...currentCart, { ...item, qty: 1 }])
    }
  }

  // Manejar el escaneo del SKU
  const handleScanSku = (sku: string) => {
    const found = productsRef.current.find(p => p.sku === sku)
    if (found) {
      playBeep()
      addToCart(found)
    } else {
      console.warn(`Producto no encontrado con el SKU: ${sku}`)
    }
  }

  // Escuchador global para lector de barras (Zebra DS2278 en Bluetooth HID)
  useEffect(() => {
    let buffer = ''
    let lastTime = Date.now()

    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      // Ignorar si el usuario está enfocado en un campo de texto (excepto el de SKU manual)
      const activeEl = document.activeElement
      if (activeEl && (activeEl.tagName === 'INPUT' || activeEl.tagName === 'TEXTAREA')) {
        if (activeEl.id !== 'sku-manual-input') {
          return
        }
      }

      const currentTime = Date.now()
      const timeDiff = currentTime - lastTime
      lastTime = currentTime

      // Si el tiempo entre pulsaciones es mayor a 60ms, reseteamos el buffer
      // (Los lectores simulan escritura a una velocidad altísima < 30ms por tecla)
      if (timeDiff > 60) {
        buffer = ''
      }

      if (e.key === 'Enter') {
        if (buffer.length > 2) {
          e.preventDefault()
          handleScanSku(buffer.trim())
          buffer = ''
          if (activeEl && activeEl.id === 'sku-manual-input') {
            setSkuInput('')
          }
        }
      } else if (e.key.length === 1) {
        buffer += e.key
      }
    }

    window.addEventListener('keydown', handleGlobalKeyDown)
    return () => {
      window.removeEventListener('keydown', handleGlobalKeyDown)
    }
  }, [products])

  const handleSearchPatient = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!dni.trim()) return
    try {
      const res = await searchPatientByDni(dni)
      setPatient(res)
    } catch (err) {
      alert('Paciente no encontrado.')
    }
  }

  const removeFromCart = (id: string) => {
    setCart(cart.filter(i => i.id !== id))
  }

  const updateQuantity = (id: string, qty: number) => {
    if (qty < 1) return
    setCart(cart.map(i => i.id === id ? { ...i, qty } : i))
  }

  const total = cart.reduce((acc, i) => acc + (i.price * i.qty), 0)

  const handleCheckout = async (paymentMethod: string) => {
    if (!patient) return alert('Por favor, identifica a un paciente primero.')
    if (cart.length === 0) return alert('El carrito está vacío.')

    setSubmitting(true)
    try {
      const order = await createOrder({
        items: cart.map(i => ({ productId: i.id, quantity: i.qty })),
        paymentMethod: paymentMethod as any,
        source: 'POS'
      })
      
      // Guardamos la orden completada para mostrar el ticket y opciones de impresión
      setCompletedOrder(order)
      
      // Limpiamos el carrito del POS
      setCart([])
      setPatient(null)
      setDni('')
    } catch (err: any) {
      alert('Error al realizar la venta: ' + (err.message || 'Error del servidor'))
    } finally {
      setSubmitting(false)
    }
  }

  const handleManualSkuSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!skuInput.trim()) return
    const found = products.find(p => p.sku === skuInput.trim())
    if (found) {
      playBeep()
      addToCart(found)
      setSkuInput('')
    } else {
      alert(`Producto con SKU "${skuInput}" no encontrado.`)
    }
  }

  // Enfoque A: Impresión estándar compatible con AirPrint y drivers locales
  const handlePrintStandard = (orderData: any) => {
    const printWindow = window.open('', '_blank', 'width=600,height=800')
    if (!printWindow) {
      alert('No se pudo abrir la ventana de impresión. Por favor, permite las ventanas emergentes (popups).')
      return
    }

    const dateStr = new Date(orderData.createdAt).toLocaleString()
    const docTypeStr = orderData.documentType || 'BOLETA'
    const docNumStr = orderData.documentNumber || 'TICKET INTERNO'
    const clientName = `${orderData.user?.firstName || 'Cliente'} ${orderData.user?.lastName || ''}`
    const clientDni = orderData.user?.dni || 'N/A'

    printWindow.document.write(`
      <html>
        <head>
          <title>Imprimir Ticket - DERMQ</title>
          <style>
            @page {
              size: 80mm auto;
              margin: 0;
            }
            body {
              font-family: 'Courier New', Courier, monospace;
              width: 74mm;
              margin: 0 auto;
              padding: 6px;
              font-size: 11px;
              color: #000;
              line-height: 1.3;
            }
            .center { text-align: center; }
            .bold { font-weight: bold; }
            .text-right { text-align: right; }
            .divider { border-bottom: 1px dashed #000; margin: 6px 0; }
            table { width: 100%; border-collapse: collapse; margin: 4px 0; }
            th { text-align: left; border-bottom: 1px solid #000; font-size: 10px; }
            td { padding: 3px 0; font-size: 10px; vertical-align: top; }
            .total { font-size: 13px; font-weight: bold; margin-top: 8px; }
            .brand { font-size: 18px; letter-spacing: 1px; margin-bottom: 2px; }
          </style>
        </head>
        <body>
          <div class="center bold brand">DERMQ</div>
          <div class="center">Clínica Dermatológica de Vanguardia</div>
          <div class="center">Av. Arequipa 1234, Lima, Perú</div>
          <div class="center">Telf: (01) 456-7890</div>
          <div class="divider"></div>
          <div><strong>Fecha:</strong> ${dateStr}</div>
          <div><strong>Doc:</strong> ${docTypeStr} ${docNumStr}</div>
          <div><strong>Cliente:</strong> ${clientName}</div>
          <div><strong>DNI:</strong> ${clientDni}</div>
          <div class="divider"></div>
          <table>
            <thead>
              <tr>
                <th>Detalle</th>
                <th class="text-right">Cant</th>
                <th class="text-right">Total</th>
              </tr>
            </thead>
            <tbody>
              ${orderData.items.map((item: any) => `
                <tr>
                  <td>${item.product?.name || item.serviceName || 'Item'}</td>
                  <td class="text-right">${item.quantity}</td>
                  <td class="text-right">S/ ${item.subTotal.toFixed(2)}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
          <div class="divider"></div>
          <div class="text-right">Subtotal: S/ ${(orderData.total / 1.18).toFixed(2)}</div>
          <div class="text-right">IGV (18%): S/ ${(orderData.total - (orderData.total / 1.18)).toFixed(2)}</div>
          <div class="text-right total">TOTAL A PAGAR: S/ ${orderData.total.toFixed(2)}</div>
          <div class="divider"></div>
          <div class="center bold" style="margin-top: 10px;">¡Gracias por su preferencia!</div>
          <div class="center" style="font-size: 8px; margin-top: 6px; color: #555;">
            Representación impresa de comprobante de pago electrónico.
          </div>
        </body>
      </html>
    `)

    printWindow.document.close()
    printWindow.focus()
    setTimeout(() => {
      printWindow.print()
      printWindow.close()
    }, 300)
  }

  // Enfoque B: Impresión Directa por Red ePOS XML (Silencioso para Epson en la red local)
  const handlePrintEpos = async (orderData: any) => {
    if (!printerIp) {
      alert('Por favor, configure la dirección IP de la impresora Epson.')
      return
    }

    const dateStr = new Date(orderData.createdAt).toLocaleString()
    const docTypeStr = orderData.documentType || 'BOLETA'
    const docNumStr = orderData.documentNumber || 'TICKET INTERNO'
    const clientName = `${orderData.user?.firstName || 'Cliente'} ${orderData.user?.lastName || ''}`
    const clientDni = orderData.user?.dni || 'N/A'

    let printCommands = ''
    
    // Configurar alineación centrada y cabecera
    printCommands += '<text align="center" />'
    printCommands += '<text width="2" height="2" />DERMQ&#10;<text width="1" height="1" />'
    printCommands += 'Clinica Dermatologica de Vanguardia&#10;'
    printCommands += 'Av. Arequipa 1234, Lima, Peru&#10;'
    printCommands += 'Telf: (01) 456-7890&#10;'
    printCommands += '------------------------------------------&#10;'

    // Datos del comprobante y cliente
    printCommands += '<text align="left" />'
    printCommands += `Fecha: ${dateStr}&#10;`
    printCommands += `Doc: ${docTypeStr} ${docNumStr}&#10;`
    printCommands += `Cliente: ${clientName}&#10;`
    printCommands += `DNI: ${clientDni}&#10;`
    printCommands += '------------------------------------------&#10;'

    // Tabla de Items
    printCommands += 'Item                      Cant    Subtotal&#10;'
    printCommands += '------------------------------------------&#10;'
    
    orderData.items.forEach((item: any) => {
      const name = (item.product?.name || item.serviceName || 'Item').substring(0, 22).padEnd(22, ' ')
      const qty = String(item.quantity).padStart(5, ' ')
      const sub = `S/ ${item.subTotal.toFixed(2)}`.padStart(12, ' ')
      printCommands += `${name}${qty}${sub}&#10;`
    })
    
    printCommands += '------------------------------------------&#10;'

    // Totales
    const subtotal = `S/ ${(orderData.total / 1.18).toFixed(2)}`.padStart(12, ' ')
    const igv = `S/ ${(orderData.total - (orderData.total / 1.18)).toFixed(2)}`.padStart(12, ' ')
    const totalVal = `S/ ${orderData.total.toFixed(2)}`.padStart(12, ' ')

    printCommands += `<text align="right" />Subtotal: ${subtotal}&#10;`
    printCommands += `IGV (18%): ${igv}&#10;`
    printCommands += `<text width="2" height="1" />TOTAL: ${totalVal}&#10;<text width="1" height="1" />`
    printCommands += '------------------------------------------&#10;'

    // Pie de página y comandos de corte
    printCommands += '<text align="center" />'
    printCommands += '¡Gracias por su preferencia!&#10;'
    printCommands += 'Representacion impresa de comprobante&#10;'
    printCommands += 'de pago electronico.&#10;'
    printCommands += '&#10;&#10;&#10;&#10;' // Espacio de avance
    printCommands += '<cut type="feed" />'

    const soapRequest = `<?xml version="1.0" encoding="utf-8"?>
<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
  <soap:Body>
    <epos-print xmlns="http://www.epson-pos.com/schemas/2011/03/epos-print">
      ${printCommands}
    </epos-print>
  </soap:Body>
</soap:Envelope>`

    try {
      const url = `http://${printerIp}/cgi-bin/epos/service.cgi?devid=local_printer&timeout=10000`
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'text/xml; charset=utf-8',
          'If-Modified-Since': 'Thu, 01 Jan 1970 00:00:00 GMT'
        },
        body: soapRequest
      })

      if (response.ok) {
        alert('Ticket enviado a la impresora Epson exitosamente (Silencioso).')
      } else {
        throw new Error(`Código HTTP: ${response.status}`)
      }
    } catch (err: any) {
      console.error(err)
      alert(
        `No se pudo conectar con la impresora Epson en la IP http://${printerIp}.\n\n` +
        `Causas comunes:\n` +
        `1. La impresora no está conectada al mismo Wi-Fi.\n` +
        `2. Si estás accediendo por HTTPS, el navegador bloquea la petición por seguridad (Mixed Content).\n\n` +
        `Por favor, usa el botón "Imprimir Ticket (AirPrint/Estándar)" que funciona en todos los dispositivos de manera segura.`
      )
    }
  }

  return (
    <main className="pt-28 pb-24 bg-[#F2F4F4] min-h-screen">
      <div className="max-w-[1400px] mx-auto px-6">
        
        {/* Encabezado con Configuración de IP */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-10">
          <div className="flex flex-col md:flex-row md:items-end gap-6">
            <div>
              <p className="text-secondary font-bold text-sm uppercase tracking-widest mb-1">POS DERMQ</p>
              <h1 className="font-headline font-black text-4xl tracking-tighter text-[#1a1c1e]">Punto de Venta</h1>
            </div>
            
            <div className="flex gap-3 mb-1">
              <Link 
                href="/dashboard/recepcion/agenda"
                className="bg-white hover:bg-slate-50 text-primary px-6 py-3 rounded-2xl font-bold border border-slate-200 shadow-sm transition-all flex items-center gap-2 text-sm"
              >
                <span className="material-symbols-outlined text-lg">calendar_month</span>
                Ver Agenda Maestra
              </Link>
            </div>
          </div>
          
          {/* Configuración del IP de la Impresora */}
          <div className="flex items-center gap-3 bg-white px-5 py-3 rounded-2xl border border-slate-200 shadow-sm self-start">
            <span className="material-symbols-outlined text-slate-400">print</span>
            <div>
              <label className="block text-[8px] font-black uppercase tracking-wider text-slate-400">IP Impresora Epson (Red Wi-Fi)</label>
              <input 
                type="text" 
                className="bg-transparent font-bold text-sm text-[#1a1c1e] outline-none w-32 focus:border-b focus:border-slate-300"
                value={printerIp}
                onChange={(e) => handleIpChange(e.target.value)}
                placeholder="192.168.1.150"
              />
            </div>
            <button 
              onClick={playBeep}
              className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
              title="Probar sonido beep del escáner"
            >
              <span className="material-symbols-outlined text-lg">volume_up</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Columna Izquierda: Paciente y Catálogo */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Identificar Paciente */}
            <div className="bg-white rounded-4xl p-8 shadow-sm border border-slate-100 relative">
               <h2 className="text-lg font-black uppercase text-slate-400 mb-6 flex items-center gap-2">
                 <span className="material-symbols-outlined">person_search</span>
                 Identificar Paciente
               </h2>
               <div className="relative">
                  <input 
                    type="text" 
                    placeholder="Buscar paciente por Nombre, Apellido o DNI..."
                    className="w-full bg-slate-50 px-6 py-4 rounded-2xl font-bold outline-none border-2 border-transparent focus:border-secondary/20 text-sm text-[#1a1c1e]"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  
                  {/* Menu Desplegable de Sugerencias */}
                  {suggestions.length > 0 && (
                    <div className="absolute top-full left-0 right-0 bg-white border border-slate-200 mt-2 rounded-2xl shadow-xl z-50 overflow-hidden max-h-60 overflow-y-auto">
                      {suggestions.map(p => (
                        <button
                          key={p.id}
                          type="button"
                          onClick={() => {
                            setPatient(p)
                            setSearchQuery('')
                            setSuggestions([])
                          }}
                          className="w-full text-left px-6 py-3.5 hover:bg-slate-50 border-b border-slate-100 last:border-0 flex justify-between items-center transition-colors"
                        >
                          <div className="min-w-0 flex-1">
                            <p className="font-bold text-sm text-[#1a1c1e] truncate">{p.firstName} {p.lastName}</p>
                            <p className="text-[10px] text-slate-400 font-mono mt-0.5">DNI: {p.dni || 'N/A'}</p>
                          </div>
                          <span className="material-symbols-outlined text-slate-300 text-sm">add_circle</span>
                        </button>
                      ))}
                    </div>
                  )}
                  {searching && (
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 border-2 border-slate-200 border-t-secondary rounded-full animate-spin" />
                  )}
               </div>
               
               {patient && (
                 <div className="mt-6 flex justify-between items-center p-4 bg-emerald-50 rounded-2xl border border-emerald-100 animate-fade-in">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-emerald-500 text-white flex items-center justify-center font-black">
                        {patient.firstName.charAt(0)}
                      </div>
                      <div>
                        <p className="font-black text-[#1a1c1e]">{patient.firstName} {patient.lastName}</p>
                        <p className="text-[10px] font-black uppercase text-emerald-600 tracking-widest">DNI: {patient.dni}</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => setPatient(null)}
                      className="p-1 rounded-full hover:bg-emerald-100 text-emerald-600"
                      title="Quitar paciente"
                    >
                      <span className="material-symbols-outlined text-lg">close</span>
                    </button>
                 </div>
               )}
            </div>

            {/* Escáner de Códigos de Barras y Catálogo */}
            <div className="bg-white rounded-4xl p-8 shadow-sm border border-slate-100 space-y-6">
               <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 pb-4 border-b border-slate-100">
                  <h2 className="text-lg font-black uppercase text-slate-400">Catálogo de Productos</h2>
                  
                  {/* Formulario Manual de SKU/Lector */}
                  <form onSubmit={handleManualSkuSubmit} className="flex items-center gap-2 bg-slate-50 px-4 py-2 rounded-xl border border-slate-200">
                    <span className="material-symbols-outlined text-slate-400 text-lg">barcode_scanner</span>
                    <input 
                      id="sku-manual-input"
                      type="text" 
                      placeholder="Escanear o ingresar SKU"
                      className="bg-transparent outline-none text-xs font-bold text-[#1a1c1e] w-48"
                      value={skuInput}
                      onChange={(e) => setSkuInput(e.target.value)}
                    />
                    <button type="submit" className="text-secondary font-bold text-xs uppercase hover:text-primary transition-colors">
                      Agregar
                    </button>
                  </form>
               </div>

               {loading ? (
                 <div className="py-20 flex justify-center"><span className="w-8 h-8 border-4 border-slate-100 border-t-secondary rounded-full animate-spin" /></div>
               ) : (
                 <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {products.map(p => (
                      <button 
                        key={p.id} 
                        onClick={() => addToCart(p)}
                        className="p-5 bg-slate-50 rounded-3xl text-left hover:bg-secondary/5 border-2 border-transparent hover:border-secondary/20 transition-all group flex flex-col justify-between min-h-[140px]"
                      >
                        <div>
                          <p className="font-black text-[#1a1c1e] text-sm group-hover:text-secondary line-clamp-2">{p.name}</p>
                          <p className="text-[9px] font-mono text-slate-400 mt-1">SKU: {p.sku}</p>
                        </div>
                        <div className="mt-4 flex justify-between items-end">
                          <p className="text-xs font-bold text-on-surface-variant">Stock: {p.stock}</p>
                          <p className="text-lg font-headline font-black text-secondary">S/ {p.price.toFixed(2)}</p>
                        </div>
                      </button>
                    ))}
                 </div>
               )}
            </div>
          </div>

          {/* Columna Derecha: Carrito y Resumen */}
          <div className="space-y-8">
            <div className="bg-[#1a1c1e] text-white rounded-4xl p-8 shadow-2xl sticky top-28">
               <h2 className="text-xl font-headline font-black mb-8 flex items-center gap-2">
                 <span className="material-symbols-outlined">shopping_cart</span>
                 Resumen de Venta
               </h2>
               
               <div className="space-y-4 mb-8 min-h-[220px] max-h-[350px] overflow-y-auto pr-1">
                 {cart.length === 0 ? (
                   <p className="text-white/40 font-bold text-center py-12 italic">El carrito está vacío</p>
                 ) : (
                   cart.map(item => (
                     <div key={item.id} className="flex justify-between items-center p-4 bg-white/5 rounded-2xl">
                       <div className="min-w-0 flex-1">
                          <p className="font-bold text-sm truncate">{item.name}</p>
                          <p className="text-[9px] text-white/40 font-mono">SKU: {item.sku}</p>
                          
                          {/* Controles de Cantidad */}
                          <div className="flex items-center gap-3 mt-2">
                            <button 
                              onClick={() => updateQuantity(item.id, item.qty - 1)}
                              className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 text-xs font-bold transition-all"
                            >
                              -
                            </button>
                            <span className="text-xs font-bold">{item.qty}</span>
                            <button 
                              onClick={() => updateQuantity(item.id, item.qty + 1)}
                              className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 text-xs font-bold transition-all"
                            >
                              +
                            </button>
                          </div>
                       </div>
                       
                       <div className="text-right shrink-0 ml-4 flex flex-col items-end gap-2">
                         <span className="font-bold text-sm">S/ {(item.price * item.qty).toFixed(2)}</span>
                         <button onClick={() => removeFromCart(item.id)} className="text-white/40 hover:text-red-400 transition-colors">
                           <span className="material-symbols-outlined text-lg">delete</span>
                         </button>
                       </div>
                     </div>
                   ))
                 )}
               </div>

               {/* Totales */}
               <div className="border-t border-white/10 pt-6 mb-8 text-right">
                  <p className="text-white/50 font-black uppercase tracking-widest text-[10px]">Total a Pagar</p>
                  <p className="text-4xl font-headline font-black text-secondary">S/ {total.toFixed(2)}</p>
               </div>

               {/* Métodos de Pago Físico */}
               <div className="space-y-4">
                  <p className="text-[10px] font-black uppercase text-white/40 mb-2">Seleccionar Método de Pago Físico</p>
                  <div className="grid grid-cols-2 gap-2">
                    <button onClick={() => handleCheckout('CASH')} disabled={submitting || cart.length === 0} className="bg-white/10 p-4 rounded-2xl font-bold flex flex-col items-center gap-1 hover:bg-emerald-500 hover:scale-105 active:scale-95 transition-all disabled:opacity-30 disabled:pointer-events-none">
                      <span className="material-symbols-outlined">payments</span>
                      <span className="text-[10px]">Efectivo</span>
                    </button>
                    <button onClick={() => handleCheckout('CREDIT_CARD')} disabled={submitting || cart.length === 0} className="bg-white/10 p-4 rounded-2xl font-bold flex flex-col items-center gap-1 hover:bg-blue-500 hover:scale-105 active:scale-95 transition-all disabled:opacity-30 disabled:pointer-events-none">
                      <span className="material-symbols-outlined">credit_card</span>
                      <span className="text-[10px]">Tarjeta POS</span>
                    </button>
                    <button onClick={() => handleCheckout('YAPE')} disabled={submitting || cart.length === 0} className="bg-white/10 p-4 rounded-2xl font-bold flex flex-col items-center gap-1 hover:bg-purple-500 hover:scale-105 active:scale-95 transition-all disabled:opacity-30 disabled:pointer-events-none">
                      <span className="material-symbols-outlined">qr_code_2</span>
                      <span className="text-[10px]">Yape / Plin</span>
                    </button>
                    <button onClick={() => handleCheckout('TRANSFER')} disabled={submitting || cart.length === 0} className="bg-white/10 p-4 rounded-2xl font-bold flex flex-col items-center gap-1 hover:bg-orange-500 hover:scale-105 active:scale-95 transition-all disabled:opacity-30 disabled:pointer-events-none">
                      <span className="material-symbols-outlined">account_balance</span>
                      <span className="text-[10px]">Transferencia</span>
                    </button>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de Éxito de Venta y Opciones de Impresión */}
      {completedOrder && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-6 animate-fade-in">
          <div className="bg-white rounded-4xl p-8 max-w-lg w-full shadow-2xl border border-slate-100 flex flex-col max-h-[90vh] animate-scale-up">
            
            {/* Cabecera del Modal */}
            <div className="text-center mb-6">
              <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-3">
                <span className="material-symbols-outlined text-emerald-600 text-3xl">check_circle</span>
              </div>
              <h3 className="font-headline font-black text-2xl text-[#1a1c1e]">¡Venta exitosa!</h3>
              <p className="text-xs text-slate-400 font-mono mt-1">
                Orden #{completedOrder.id.slice(0, 8).toUpperCase()} · {completedOrder.documentType} {completedOrder.documentNumber || 'TICKET'}
              </p>
            </div>

            {/* Previsualización del Ticket Físico */}
            <div className="bg-slate-50 border border-slate-200 rounded-3xl p-5 overflow-y-auto flex-1 font-mono text-xs text-slate-700 leading-normal max-h-60 mb-6">
              <div className="text-center font-bold text-sm text-[#1a1c1e]">DERMQ</div>
              <div className="text-center text-[10px]">Clínica Dermatológica de Vanguardia</div>
              <div className="text-center text-[9px] text-slate-400">Av. Arequipa 1234, Lima</div>
              <div className="border-b border-dashed border-slate-300 my-3"></div>
              
              <div className="space-y-1">
                <div><strong>Fecha:</strong> {new Date(completedOrder.createdAt).toLocaleString()}</div>
                <div><strong>Doc:</strong> {completedOrder.documentType} {completedOrder.documentNumber || 'TICKET INTERNO'}</div>
                <div><strong>Cliente:</strong> {completedOrder.user?.firstName || 'Cliente'} {completedOrder.user?.lastName || ''}</div>
                <div><strong>DNI:</strong> {completedOrder.user?.dni || 'N/A'}</div>
              </div>
              
              <div className="border-b border-dashed border-slate-300 my-3"></div>
              
              {/* Tabla Resumen */}
              <div className="space-y-2">
                <div className="flex justify-between font-bold text-[10px] text-slate-500">
                  <span>Detalle</span>
                  <span className="text-right">Cant/Sub</span>
                </div>
                {completedOrder.items.map((item: any) => (
                  <div key={item.id} className="flex justify-between">
                    <span className="truncate max-w-[180px]">{item.product?.name || item.serviceName || 'Item'}</span>
                    <span className="text-right shrink-0">{item.quantity}x S/ {item.subTotal.toFixed(2)}</span>
                  </div>
                ))}
              </div>
              
              <div className="border-b border-dashed border-slate-300 my-3"></div>
              
              <div className="space-y-1 text-right">
                <div>Subtotal: S/ {(completedOrder.total / 1.18).toFixed(2)}</div>
                <div>IGV (18%): S/ {(completedOrder.total - (completedOrder.total / 1.18)).toFixed(2)}</div>
                <div className="font-bold text-sm text-[#1a1c1e] pt-1">TOTAL: S/ {completedOrder.total.toFixed(2)}</div>
              </div>
            </div>

            {/* Opciones de Impresión */}
            <div className="space-y-3 mb-6">
              <p className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Opciones de Impresión Física</p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Impresión Estándar / AirPrint */}
                <button 
                  onClick={() => handlePrintStandard(completedOrder)}
                  className="flex items-center justify-center gap-2 bg-[#1a1c1e] hover:bg-secondary text-white py-4 px-4 rounded-2xl font-bold transition-all text-xs"
                >
                  <span className="material-symbols-outlined text-lg">print</span>
                  Imprimir (AirPrint/PC/Mac)
                </button>

                {/* Impresión Silenciosa por Red */}
                <button 
                  onClick={() => handlePrintEpos(completedOrder)}
                  className="flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white py-4 px-4 rounded-2xl font-bold transition-all text-xs"
                >
                  <span className="material-symbols-outlined text-lg">rss_feed</span>
                  Impresión Rápida (IP local)
                </button>
              </div>
            </div>

            {/* Botón de Salida */}
            <button 
              onClick={() => setCompletedOrder(null)}
              className="w-full py-4 border-2 border-slate-200 hover:border-slate-300 text-slate-600 font-bold rounded-2xl transition-all text-sm mt-auto"
            >
              Cerrar y Nueva Venta
            </button>
          </div>
        </div>
      )}
    </main>
  )
}
