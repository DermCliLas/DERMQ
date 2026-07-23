'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'

const CASES = [
  {
    id: 1,
    category: 'Clínica',
    tag: 'Más Solicitado',
    treatment: 'Tratamiento de Acné',
    sessions: '6 sesiones',
    doctor: 'Dra. Marcela Leyva',
    description: 'Protocolo intensivo combinando activos tópicos, peeling enzimático y cuidado de la barrera cutánea para piel libre de imperfecciones.',
    before: 'https://images.unsplash.com/photo-1621963678816-ef67dbf44c83?auto=format&fit=crop&w=600&q=80',
    after: 'https://images.unsplash.com/photo-1605462863863-10d9e47e15ee?auto=format&fit=crop&w=600&q=80',
    result: '92% reducción de lesiones',
    accent: '#02696a',
    accentLight: '#e6f4f4',
  },
  {
    id: 2,
    category: 'Estética',
    tag: 'Premium',
    treatment: 'Rejuvenecimiento Facial',
    sessions: '4 sesiones',
    doctor: 'Dra. Marcela Leyva',
    description: 'Tratamiento anti-envejecimiento con radiofrecuencia fraccionada y bioestimuladores de colágeno para recuperar la firmeza natural.',
    before: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=600&q=80',
    after: 'https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?auto=format&fit=crop&w=600&q=80',
    result: 'Piel 10 años más joven',
    accent: '#8C4E31',
    accentLight: '#fdf0e8',
  },
  {
    id: 3,
    category: 'Estética',
    tag: 'Recomendado',
    treatment: 'Peeling Químico',
    sessions: '3 sesiones',
    doctor: 'Dra. Marcela Leyva',
    description: 'Renovación profunda de la piel con ácidos de grado clínico. Elimina manchas, uniformiza el tono y aporta luminosidad duradera.',
    before: 'https://images.unsplash.com/photo-1583064313642-a7c149480c7e?auto=format&fit=crop&w=600&q=80',
    after: 'https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?auto=format&fit=crop&w=600&q=80',
    result: 'Tono uniforme y luminoso',
    accent: '#484360',
    accentLight: '#f0eef8',
  },
  {
    id: 4,
    category: 'Clínica',
    tag: 'Especializado',
    treatment: 'Control de Rosácea',
    sessions: '5 sesiones',
    doctor: 'Dra. Marcela Leyva',
    description: 'Reducción significativa del eritema y telangiectasias mediante terapia láser vascular y cuidado dermatológico especializado.',
    before: 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=600&q=80',
    after: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=600&q=80',
    result: '85% reducción de eritema',
    accent: '#02696a',
    accentLight: '#e6f4f4',
  },
]

const FILTERS = ['Todos', 'Clínica', 'Estética']

const STATS = [
  { value: '2,400+', label: 'Casos Tratados', icon: 'groups' },
  { value: '98%', label: 'Satisfacción', icon: 'verified' },
  { value: '15+', label: 'Procedimientos', icon: 'medical_services' },
  { value: '4.9 ★', label: 'Valoración Google', icon: 'grade' },
]

export default function PortafolioPage() {
  const [activeFilter, setActiveFilter] = useState('Todos')

  const filtered = activeFilter === 'Todos'
    ? CASES
    : CASES.filter(c => c.category === activeFilter)

  return (
    <main className="pt-0 overflow-hidden bg-[#f8fafa]">

      {/* HERO */}
      <section className="relative min-h-[85vh] flex items-end pb-0 overflow-hidden bg-[#014d4e]">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            animate={{ scale: [1, 1.2, 1], x: [0, 40, 0] }}
            transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute -top-40 -right-40 w-[800px] h-[800px] rounded-full blur-[160px] opacity-30"
            style={{ background: '#72C1C1' }}
          />
          <motion.div
            animate={{ scale: [1, 1.1, 1], y: [0, -30, 0] }}
            transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut', delay: 5 }}
            className="absolute -bottom-40 -left-40 w-[600px] h-[600px] rounded-full blur-[140px] opacity-20"
            style={{ background: '#F0A17E' }}
          />
        </div>
        <div
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.5) 1px, transparent 0)', backgroundSize: '36px 36px' }}
        />

        <div className="max-w-7xl mx-auto px-6 lg:px-12 w-full pb-0 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-end">

            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9 }}
              className="pb-20 lg:pb-32"
            >
              <span className="inline-flex items-center gap-2 px-5 py-2 rounded-full text-xs font-black uppercase tracking-[0.2em] mb-8 border border-white/20 backdrop-blur-md" style={{ background: 'rgba(114,193,193,0.2)', color: '#72C1C1' }}>
                <span className="w-2 h-2 rounded-full bg-[#72C1C1] animate-pulse" />
                Resultados Verificados
              </span>
              <h1 className="text-5xl sm:text-6xl md:text-8xl font-headline font-black tracking-tighter text-white leading-[0.92] mb-8">
                Cada piel,<br />
                <span style={{ color: '#72C1C1' }} className="italic">una historia</span><br />
                de éxito.
              </h1>
              <p className="text-white/70 text-lg md:text-xl font-medium leading-relaxed max-w-lg border-l-4 pl-6" style={{ borderColor: '#F0A17E' }}>
                Documentamos cada transformación con rigor científico. Resultados reales de pacientes reales atendidos por la Dra. Leyva.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 60 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, delay: 0.3 }}
              className="hidden lg:flex items-end justify-center relative h-[620px]"
            >
              <div className="absolute bottom-0 right-0 w-[380px] h-[500px] rounded-[3rem] overflow-hidden shadow-2xl border-4 border-white/20 z-20">
                <Image
                  src="https://images.unsplash.com/photo-1607462109225-6b64ae2dd3cb?auto=format&fit=crop&w=800&q=80"
                  alt="Tratamiento dermatológico premium"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#014d4e]/60 to-transparent" />
                <div className="absolute bottom-8 left-8 right-8">
                  <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#72C1C1] block mb-1">Resultado real</span>
                  <span className="text-white font-headline font-bold text-xl">Dra. Marcela Leyva</span>
                </div>
              </div>
              <div className="absolute top-0 left-0 w-[280px] h-[360px] rounded-[2.5rem] overflow-hidden shadow-xl border-4 border-white/20 z-30 -rotate-3">
                <Image
                  src="https://images.unsplash.com/photo-1629198688000-71f23e745b6e?auto=format&fit=crop&w=600&q=80"
                  alt="Cuidado dermatológico"
                  fill
                  className="object-cover"
                />
              </div>
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.8, duration: 0.5 }}
                className="absolute top-[35%] left-[40%] z-40 bg-white rounded-3xl px-6 py-5 shadow-2xl"
              >
                <span className="text-3xl font-headline font-black text-[#014d4e] block">98%</span>
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Satisfacción</span>
              </motion.div>
            </motion.div>
          </div>

          {/* Stats bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 relative z-10 -mb-8 md:-mb-10">
            {STATS.map((stat, idx) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + idx * 0.1 }}
                className="bg-white rounded-3xl p-5 md:p-8 shadow-xl border border-slate-100 flex items-center gap-4"
              >
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-2xl flex items-center justify-center shrink-0" style={{ background: '#e6f4f4', color: '#014d4e' }}>
                  <span className="material-symbols-outlined text-lg md:text-xl">{stat.icon}</span>
                </div>
                <div>
                  <p className="font-headline font-black text-xl md:text-2xl text-[#014d4e] leading-none">{stat.value}</p>
                  <p className="text-[9px] md:text-[10px] font-bold uppercase tracking-widest text-slate-400 mt-1">{stat.label}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CASES */}
      <section className="pt-24 md:pt-28 pb-32 bg-[#f8fafa] relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">

          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-14 gap-6">
            <div>
              <span className="text-[10px] font-black uppercase tracking-[0.35em] text-[#02696a] block mb-3">Casos Clínicos</span>
              <h2 className="text-3xl md:text-5xl font-headline font-black tracking-tight text-[#1a1c1e] leading-none">
                Transformaciones <em className="font-serif font-light text-[#02696a]">reales.</em>
              </h2>
            </div>
            <div className="flex gap-2 p-1.5 bg-white rounded-full border border-slate-200 shadow-md">
              {FILTERS.map(filter => (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={`px-5 py-2.5 rounded-full font-bold text-sm transition-all duration-300 relative overflow-hidden ${
                    activeFilter === filter ? 'text-white' : 'text-slate-500 hover:text-[#014d4e]'
                  }`}
                >
                  {activeFilter === filter && (
                    <motion.div
                      layoutId="filter-pill"
                      className="absolute inset-0 bg-[#014d4e] z-0 rounded-full"
                      transition={{ type: 'spring', bounce: 0.25, duration: 0.5 }}
                    />
                  )}
                  <span className="relative z-10">{filter}</span>
                </button>
              ))}
            </div>
          </div>

          <motion.div layout className="space-y-6 md:space-y-8">
            <AnimatePresence mode="popLayout">
              {filtered.map((c, idx) => (
                <motion.div
                  key={c.id}
                  layout
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  className="group"
                >
                  <div className="bg-white rounded-[2.5rem] md:rounded-[3rem] overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-700 border border-slate-100 hover:border-transparent">
                    <div className={`grid grid-cols-1 lg:grid-cols-2 ${idx % 2 !== 0 ? 'lg:[direction:rtl]' : ''}`}>

                      {/* Before/After panel */}
                      <div className="relative h-[300px] md:h-[460px] overflow-hidden lg:[direction:ltr]" style={{ background: c.accentLight }}>
                        <div className="absolute inset-0 flex">
                          <div className="w-1/2 h-full relative overflow-hidden">
                            <Image
                              src={c.before}
                              alt={`Antes — ${c.treatment}`}
                              fill
                              className="object-cover scale-110 group-hover:scale-100 transition-transform duration-1000"
                            />
                            <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-sm text-white text-[9px] font-black uppercase tracking-[0.25em] px-3 py-1.5 rounded-full">
                              Antes
                            </div>
                          </div>
                          {/* Divider */}
                          <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-[3px] z-10" style={{ background: 'rgba(255,255,255,0.9)' }}>
                            <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-9 h-9 rounded-full bg-white shadow-xl flex items-center justify-center z-20">
                              <span className="material-symbols-outlined text-sm" style={{ color: c.accent }}>compare</span>
                            </div>
                          </div>
                          <div className="w-1/2 h-full relative overflow-hidden">
                            <Image
                              src={c.after}
                              alt={`Después — ${c.treatment}`}
                              fill
                              className="object-cover scale-110 group-hover:scale-100 transition-transform duration-1000"
                            />
                            <div className="absolute top-4 right-4 text-white text-[9px] font-black uppercase tracking-[0.25em] px-3 py-1.5 rounded-full backdrop-blur-sm border border-white/30" style={{ background: `${c.accent}cc` }}>
                              Después
                            </div>
                          </div>
                        </div>
                        {/* Bottom gradient */}
                        <div className="absolute bottom-0 left-0 right-0 px-6 md:px-8 py-5" style={{ background: `linear-gradient(to top, ${c.accent}ee, transparent)` }}>
                          <div className="flex items-center gap-3 flex-wrap">
                            <div className="w-2 h-2 rounded-full bg-white animate-pulse shrink-0" />
                            <span className="text-white text-xs font-black uppercase tracking-[0.2em]">{c.sessions}</span>
                            <span className="text-white/40">·</span>
                            <span className="text-white/90 text-xs md:text-sm font-bold">{c.result}</span>
                          </div>
                        </div>
                      </div>

                      {/* Content panel */}
                      <div className="p-7 md:p-14 flex flex-col justify-between lg:[direction:ltr]">
                        <div>
                          <div className="flex items-center gap-3 mb-6 flex-wrap">
                            <span className="px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest text-white" style={{ background: c.accent }}>
                              {c.category}
                            </span>
                            <span className="px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest border" style={{ color: c.accent, borderColor: `${c.accent}40`, background: c.accentLight }}>
                              {c.tag}
                            </span>
                          </div>

                          <h3 className="text-3xl md:text-5xl font-headline font-black tracking-tight text-[#1a1c1e] mb-5 leading-tight group-hover:text-[#014d4e] transition-colors duration-500">
                            {c.treatment}
                          </h3>

                          <div className="h-[2px] w-12 mb-5 group-hover:w-24 transition-all duration-700" style={{ background: c.accent }} />

                          <p className="text-on-surface-variant text-base md:text-lg leading-relaxed font-serif italic mb-8">
                            "{c.description}"
                          </p>
                        </div>

                        <div className="border-t pt-6 md:pt-8" style={{ borderColor: `${c.accent}20` }}>
                          <div className="flex items-center justify-between flex-wrap gap-4">
                            <div className="flex items-center gap-4">
                              <div className="w-11 h-11 rounded-full flex items-center justify-center shadow-md" style={{ background: c.accentLight }}>
                                <span className="material-symbols-outlined" style={{ color: c.accent }}>person</span>
                              </div>
                              <div>
                                <p className="text-[9px] font-black uppercase tracking-widest mb-0.5" style={{ color: c.accent }}>Tratado por</p>
                                <p className="font-headline font-bold text-base md:text-lg text-[#1a1c1e]">{c.doctor}</p>
                              </div>
                            </div>
                            <Link
                              href="/reservar"
                              className="inline-flex items-center gap-2 font-bold text-xs md:text-sm uppercase tracking-widest px-5 md:px-6 py-3 rounded-full transition-all duration-300 hover:gap-4 hover:shadow-lg whitespace-nowrap"
                              style={{ color: c.accent, background: c.accentLight }}
                            >
                              Reservar
                              <span className="material-symbols-outlined text-base">arrow_forward</span>
                            </Link>
                          </div>
                        </div>
                      </div>

                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-20 md:mt-24 relative rounded-[2.5rem] md:rounded-[3.5rem] overflow-hidden p-10 md:p-20 text-center text-white"
            style={{ background: 'linear-gradient(135deg, #014d4e 0%, #02696a 50%, #3a3550 100%)' }}
          >
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              <div className="absolute top-0 right-0 w-96 h-96 rounded-full blur-[100px] opacity-30" style={{ background: '#72C1C1', transform: 'translate(25%,-25%)' }} />
              <div className="absolute bottom-0 left-0 w-96 h-96 rounded-full blur-[100px] opacity-20" style={{ background: '#F0A17E', transform: 'translate(-25%,25%)' }} />
            </div>
            <div className="relative z-10 max-w-2xl mx-auto">
              <span className="inline-block px-5 py-2 rounded-full text-xs font-black uppercase tracking-[0.2em] mb-8 border border-white/20" style={{ background: 'rgba(114,193,193,0.2)', color: '#72C1C1' }}>
                Tu turno
              </span>
              <h2 className="text-4xl md:text-6xl font-headline font-black mb-6 leading-[1] tracking-tighter">
                ¿Lista para tu propia<br />
                <em className="font-serif font-light" style={{ color: '#72C1C1' }}>transformación?</em>
              </h2>
              <p className="text-white/70 text-lg mb-10 font-medium leading-relaxed">
                Agenda tu consulta con la Dra. Leyva y descubre el protocolo ideal para tu piel.
              </p>
              <Link
                href="/reservar"
                className="inline-flex items-center gap-3 font-black text-base md:text-lg px-10 md:px-12 py-5 rounded-full transition-all duration-300 hover:scale-105 group shadow-xl"
                style={{ background: '#F0A17E', color: '#5c3320' }}
              >
                Comenzar ahora
                <span className="material-symbols-outlined text-xl transition-transform group-hover:translate-x-2">arrow_forward</span>
              </Link>
            </div>
          </motion.div>

        </div>
      </section>

    </main>
  )
}
