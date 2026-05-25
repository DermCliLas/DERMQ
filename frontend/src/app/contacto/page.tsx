'use client'

import { useState } from 'react'
import Link from 'next/link'

const CONTACT_INFO = [
  { icon: 'location_on', title: 'Sede Principal', value: 'Av. Camino Real 1234, San Isidro, Lima.', color: 'bg-primary/10 text-primary', href: 'https://maps.google.com' },
  { icon: 'call', title: 'Teléfono', value: '+51 1 234 5678', color: 'bg-primary/10 text-primary', href: 'tel:+5112345678' },
  { icon: 'mail', title: 'Correo', value: 'hola@dermq.pe', color: 'bg-secondary/10 text-secondary', href: 'mailto:hola@dermq.pe' },
  { icon: 'schedule', title: 'Horario', value: 'Lun–Vie: 8am–7pm · Sáb: 9am–1pm', color: 'bg-tertiary/10 text-tertiary', href: null },
]

const SOCIALS = [
  { icon: 'camera_alt', label: 'Instagram', href: '#', color: 'hover:bg-pink-50 hover:text-pink-600' },
  { icon: 'chat', label: 'WhatsApp', href: '#', color: 'hover:bg-green-50 hover:text-green-600' },
  { icon: 'public', label: 'Facebook', href: '#', color: 'hover:bg-blue-50 hover:text-blue-600' },
]

interface FormData {
  firstName: string
  lastName: string
  email: string
  phone: string
  subject: string
  message: string
}

export default function ContactoPage() {
  const [form, setForm] = useState<FormData>({
    firstName: '', lastName: '', email: '', phone: '', subject: 'consulta', message: ''
  })
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    // Simulate sending — replace with real email/API integration in the future
    await new Promise(resolve => setTimeout(resolve, 1500))
    setLoading(false)
    setSubmitted(true)
  }

  return (
    <main className="pt-0">
      <section className="pt-12 pb-24 bg-[#F2F4F4] relative overflow-hidden">
        <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-primary/5 rounded-full blur-[150px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-start">

            {/* Left Info */}
            <div>
              <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-widest mb-8">
                Estamos aquí
              </span>
              <h1 className="text-5xl md:text-7xl font-headline font-extrabold tracking-tighter text-[#1a1c1e] mb-8 leading-[1.05]">
                Hablemos de{' '}
                <span className="text-primary italic">tu piel.</span>
              </h1>
              <p className="text-on-surface-variant text-xl leading-relaxed mb-12">
                Nuestro equipo está disponible para resolver todas tus dudas y ayudarte a encontrar
                el tratamiento ideal para tu tipo de piel.
              </p>

              <div className="space-y-6 mb-12">
                {CONTACT_INFO.map(item => {
                  const content = (
                    <div className={`flex gap-5 items-start group transition-all duration-200 ${item.href ? 'cursor-pointer' : 'cursor-default'}`}>
                      <div className={`w-14 h-14 rounded-2xl ${item.color} flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform`}>
                        <span className="material-symbols-outlined text-xl">{item.icon}</span>
                      </div>
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">{item.title}</p>
                        <p className="font-semibold text-[#1a1c1e]">{item.value}</p>
                      </div>
                    </div>
                  )
                  return item.href ? (
                    <a key={item.title} href={item.href} target="_blank" rel="noopener noreferrer">
                      {content}
                    </a>
                  ) : (
                    <div key={item.title}>{content}</div>
                  )
                })}
              </div>

              {/* Social links */}
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4">Síguenos</p>
                <div className="flex gap-3">
                  {SOCIALS.map(s => (
                    <a
                      key={s.label}
                      href={s.href}
                      aria-label={s.label}
                      className={`w-12 h-12 rounded-2xl bg-white border border-slate-100 flex items-center justify-center text-slate-500 transition-all duration-200 ${s.color}`}
                    >
                      <span className="material-symbols-outlined text-xl">{s.icon}</span>
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Form */}
            <div className="bg-white rounded-4xl p-10 shadow-xl border border-slate-100">
              {submitted ? (
                // Success state
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center mb-6">
                    <span className="material-symbols-outlined text-emerald-600 text-4xl">check_circle</span>
                  </div>
                  <h2 className="font-headline font-black text-3xl text-[#1a1c1e] mb-3">¡Mensaje enviado!</h2>
                  <p className="text-on-surface-variant mb-8 max-w-xs">
                    Hemos recibido tu consulta. Nuestro equipo te responderá dentro de las próximas 24 horas.
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="text-primary font-bold hover:underline"
                  >
                    Enviar otro mensaje
                  </button>
                </div>
              ) : (
                <>
                  <h2 className="font-headline font-extrabold text-2xl mb-8 text-[#1a1c1e]">
                    Envíanos un mensaje
                  </h2>
                  <form className="space-y-5" onSubmit={handleSubmit}>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Nombre</label>
                        <input
                          type="text"
                          name="firstName"
                          value={form.firstName}
                          onChange={handleChange}
                          required
                          placeholder="Tu nombre"
                          className="w-full rounded-2xl border-2 border-slate-100 bg-slate-50 px-5 py-4 font-medium placeholder:text-slate-300 focus:border-primary focus:bg-white focus:outline-none transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Apellido</label>
                        <input
                          type="text"
                          name="lastName"
                          value={form.lastName}
                          onChange={handleChange}
                          required
                          placeholder="Tu apellido"
                          className="w-full rounded-2xl border-2 border-slate-100 bg-slate-50 px-5 py-4 font-medium placeholder:text-slate-300 focus:border-primary focus:bg-white focus:outline-none transition-all"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Correo Electrónico</label>
                      <input
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        required
                        placeholder="correo@ejemplo.com"
                        className="w-full rounded-2xl border-2 border-slate-100 bg-slate-50 px-5 py-4 font-medium placeholder:text-slate-300 focus:border-primary focus:bg-white focus:outline-none transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Teléfono (opcional)</label>
                      <input
                        type="tel"
                        name="phone"
                        value={form.phone}
                        onChange={handleChange}
                        placeholder="+51 987 654 321"
                        className="w-full rounded-2xl border-2 border-slate-100 bg-slate-50 px-5 py-4 font-medium placeholder:text-slate-300 focus:border-primary focus:bg-white focus:outline-none transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Asunto</label>
                      <select
                        name="subject"
                        value={form.subject}
                        onChange={handleChange}
                        className="w-full rounded-2xl border-2 border-slate-100 bg-slate-50 px-5 py-4 font-medium text-[#1a1c1e] focus:border-primary focus:bg-white focus:outline-none transition-all appearance-none"
                      >
                        <option value="consulta">Consulta General</option>
                        <option value="cita">Agendar Cita</option>
                        <option value="productos">Información de Productos</option>
                        <option value="precios">Precios y Tratamientos</option>
                        <option value="otro">Otro</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Mensaje</label>
                      <textarea
                        rows={4}
                        name="message"
                        value={form.message}
                        onChange={handleChange}
                        required
                        placeholder="¿En qué podemos ayudarte?"
                        className="w-full rounded-2xl border-2 border-slate-100 bg-slate-50 px-5 py-4 font-medium placeholder:text-slate-300 focus:border-primary focus:bg-white focus:outline-none transition-all resize-none"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full luminous-gradient text-white py-5 rounded-full font-bold text-lg glow-on-hover hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-70"
                    >
                      {loading ? (
                        <span className="w-6 h-6 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                      ) : (
                        <>
                          <span className="material-symbols-outlined">send</span>
                          Enviar Mensaje
                        </>
                      )}
                    </button>
                  </form>

                  <div className="mt-8 pt-8 border-t border-slate-100 text-center">
                    <p className="text-sm text-on-surface-variant mb-4">¿Prefieres agendar directo?</p>
                    <Link href="/reservar" className="inline-flex items-center gap-2 font-bold text-primary hover:gap-4 transition-all">
                      Reserva una consulta
                      <span className="material-symbols-outlined">arrow_forward</span>
                    </Link>
                  </div>
                </>
              )}
            </div>

          </div>
        </div>
      </section>
    </main>
  )
}
