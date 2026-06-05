'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'

const CASES = [
  {
    id: 1,
    category: 'Clínica',
    treatment: 'Tratamiento de Acné',
    sessions: 6,
    doctor: 'Dr. Carlos Mendoza',
    description: 'Protocolo intensivo combinando activos tópicos, peeling enzimático y cuidado de la barrera cutánea.',
    image: '/portafolio_acne.png',
    badge: 'Más Solicitado',
    color: 'emerald', // Clinical Green
  },
  {
    id: 2,
    category: 'Estética',
    treatment: 'Rejuvenecimiento Facial',
    sessions: 4,
    doctor: 'Dra. Marcela Leyva',
    description: 'Tratamiento anti-envejecimiento con radiofrecuencia fraccionada y bioestimuladores de colágeno.',
    image: '/portafolio_rejuvenecimiento.png',
    badge: 'Premium',
    color: 'tertiary', // Salmon
  },
  {
    id: 3,
    category: 'Estética',
    treatment: 'Peeling Químico',
    sessions: 3,
    doctor: 'Dra. Marcela Leyva',
    description: 'Renovación profunda de la piel con ácidos de grado clínico. Elimina manchas y uniformiza el tono.',
    image: '/portafolio_peeling.png',
    color: 'tertiary',
  },
  {
    id: 4,
    category: 'Clínica',
    treatment: 'Control de Rosácea',
    sessions: 5,
    doctor: 'Dr. Carlos Mendoza',
    description: 'Reducción significativa del eritema y telangiectasias mediante terapia láser vascular y cuidado dermatológico.',
    image: '/portafolio_rosacee.png',
    color: 'emerald',
  },
]

const FILTERS = ['Todos', 'Clínica', 'Estética']

const STATS = [
  { value: '2,400+', label: 'Casos Tratados', icon: 'groups' },
  { value: '98%', label: 'Satisfacción', icon: 'verified' },
  { value: '15+', label: 'Procedimientos', icon: 'medical_services' },
  { value: '4.9 ★', label: 'Valoración', icon: 'grade' },
]

export default function PortafolioPage() {
  const [activeFilter, setActiveFilter] = useState('Todos')

  const filtered = activeFilter === 'Todos'
    ? CASES
    : CASES.filter(c => c.category === activeFilter)

  return (
    <main className="pt-0 overflow-hidden">
      {/* Dynamic Hero Section */}
      <section className="relative min-h-[70vh] flex items-center pt-20 pb-32 overflow-hidden bg-black">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <Image 
            src="/portfolio_hero.png"
            alt="Dermatología Premium"
            fill
            className="object-cover opacity-80"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-10 w-full">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl"
          >
            <span className="inline-block px-5 py-2 rounded-full bg-tertiary/20 border border-white/20 text-tertiary text-xs font-black uppercase tracking-[0.2em] mb-8 backdrop-blur-md">
              Transformaciones Reales
            </span>
            <h1 className="text-6xl md:text-8xl font-headline font-black tracking-tighter text-white mb-10 leading-[0.95]">
              Resultados que <br />
              <span className="text-tertiary italic underline decoration-tertiary/30">hablan solos.</span>
            </h1>
            <p className="text-2xl text-white/80 font-medium leading-relaxed max-w-2xl border-l-4 border-tertiary/50 pl-6">
              Cada caso es un testimonio de nuestro compromiso con la excelencia científica y la salud de tu piel.
            </p>
          </motion.div>

          {/* Dynamic Stats bar - Moved and Styled */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-20 max-w-5xl">
            {STATS.map((stat, idx) => (
              <motion.div 
                key={stat.label}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white/10 backdrop-blur-lg rounded-[2.5rem] p-8 border border-white/10 shadow-2xl group hover:bg-white/20 transition-all duration-500"
              >
                <div className="w-12 h-12 rounded-2xl bg-tertiary/20 flex items-center justify-center text-tertiary mb-4 group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined">{stat.icon}</span>
                </div>
                <p className="font-headline font-black text-3xl text-white mb-1">{stat.value}</p>
                <p className="text-[10px] font-bold uppercase tracking-widest text-white/50">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Cases Grid with Filter Logic */}
      <section className="py-32 bg-white relative overflow-hidden">
        {/* Background Decorative Blobs for Color */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute top-[10%] -left-[10%] w-[40%] h-[40%] bg-tertiary/5 rounded-full blur-[120px]" />
          <div className="absolute bottom-[10%] -right-[10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[120px]" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[#f8fafa]" />
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          
          <div className="flex flex-col md:flex-row justify-between items-center mb-24 gap-8">
            <h2 className="text-5xl font-headline font-black tracking-tight text-[#1a1c1e]">
              Explorar por <span className="text-tertiary">especialidad</span>
            </h2>
            
            {/* Enhanced Filter Pills */}
            <div className="flex gap-2 p-2 bg-white rounded-full border border-slate-200 shadow-xl">
              {FILTERS.map(filter => (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={`px-8 py-3 rounded-full font-bold text-sm transition-all duration-500 relative overflow-hidden ${
                    activeFilter === filter
                      ? 'text-white'
                      : 'text-slate-600 hover:text-primary hover:bg-slate-50'
                  }`}
                >
                  {activeFilter === filter && (
                    <motion.div 
                      layoutId="filter-pill"
                      className="absolute inset-0 bg-primary z-0"
                      transition={{ type: "spring", bounce: 0.25, duration: 0.6 }}
                    />
                  )}
                  <span className="relative z-10">{filter}</span>
                </button>
              ))}
            </div>
          </div>

          <motion.div 
            layout
            className="grid grid-cols-1 md:grid-cols-2 gap-16"
          >
            <AnimatePresence mode="popLayout">
              {filtered.map(c => (
                <motion.div 
                  key={c.id}
                  layout
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.5 }}
                  className="group relative"
                >
                  {/* Dynamic Color Card */}
                  <div className={`h-full rounded-[4.5rem] overflow-hidden transition-all duration-700 border-[4px] relative bg-white ${
                    c.color === 'tertiary' 
                      ? 'border-tertiary/20 shadow-[0_40px_80px_-15px_rgba(240,161,126,0.15)] group-hover:border-tertiary group-hover:shadow-[0_40px_80px_-15px_rgba(240,161,126,0.3)]' 
                      : 'border-primary/20 shadow-[0_40px_80px_-15px_rgba(2,105,106,0.15)] group-hover:border-primary group-hover:shadow-[0_40px_80px_-15px_rgba(2,105,106,0.3)]'
                  }`}>
                    
                    {/* Image Area with Decorative Frame */}
                    <div className={`relative h-[500px] overflow-hidden m-5 rounded-[3.5rem] ${
                      c.color === 'tertiary' ? 'bg-tertiary/5' : 'bg-primary/5'
                    }`}>
                      <Image
                        src={c.image}
                        alt={c.treatment}
                        fill
                        className="object-cover object-center group-hover:scale-110 transition-transform duration-1000 ease-out"
                      />
                      
                      {/* Gradient Overlay colored based on category */}
                      <div className={`absolute inset-0 opacity-40 group-hover:opacity-60 transition-opacity ${
                        c.color === 'tertiary' ? 'bg-gradient-to-t from-tertiary/80 to-transparent' : 'bg-gradient-to-t from-primary/80 to-transparent'
                      }`} />
                      
                      {/* Labels */}
                      <div className="absolute top-8 left-8 flex gap-3">
                        <span className={`px-5 py-2 rounded-full text-xs font-black uppercase tracking-widest backdrop-blur-md border border-white/30 text-white shadow-lg ${
                          c.color === 'tertiary' ? 'bg-tertiary' : 'bg-primary'
                        }`}>
                          {c.category}
                        </span>
                        {c.badge && (
                          <span className="bg-white text-[#1a1c1e] px-5 py-2 rounded-full text-xs font-black uppercase tracking-widest shadow-lg">
                            {c.badge}
                          </span>
                        )}
                      </div>

                      <div className="absolute bottom-10 left-10 right-10">
                        <div className="flex items-center gap-3 mb-3">
                          <div className={`w-3 h-3 rounded-full animate-pulse ${c.color === 'tertiary' ? 'bg-white shadow-[0_0_15px_white]' : 'bg-white shadow-[0_0_15px_white]'}`} />
                          <span className="text-white text-sm font-black uppercase tracking-[0.3em]">{c.sessions} Sesiones</span>
                        </div>
                        <h3 className="font-headline font-black text-5xl text-white tracking-tighter leading-none">
                          {c.treatment}
                        </h3>
                      </div>
                    </div>

                    {/* Content Area */}
                    <div className="p-12">
                      <p className="text-[#1a1c1e]/70 text-xl leading-relaxed mb-10 font-medium font-serif italic">
                        "{c.description}"
                      </p>
                      
                      <div className={`flex items-center justify-between border-t pt-10 ${
                        c.color === 'tertiary' ? 'border-tertiary/10' : 'border-primary/10'
                      }`}>
                        <div className="flex items-center gap-5">
                          <div className={`w-14 h-14 rounded-full flex items-center justify-center overflow-hidden shadow-lg ${
                            c.color === 'tertiary' ? 'bg-tertiary/10 text-tertiary' : 'bg-primary/10 text-primary'
                          }`}>
                            <span className="material-symbols-outlined text-2xl">medical_services</span>
                          </div>
                          <div>
                            <p className={`text-[10px] font-black uppercase tracking-widest mb-1 ${
                              c.color === 'tertiary' ? 'text-tertiary' : 'text-primary'
                            }`}>Atendido por</p>
                            <p className="font-bold text-2xl text-[#1a1c1e] tracking-tight">{c.doctor}</p>
                          </div>
                        </div>
                        
                        <Link 
                          href="/reservar"
                          className={`w-16 h-16 rounded-full flex items-center justify-center transition-all duration-500 shadow-xl hover:scale-110 active:scale-95 ${
                            c.color === 'tertiary' 
                              ? 'bg-tertiary text-white hover:bg-[#1a1c1e]' 
                              : 'bg-primary text-white hover:bg-[#1a1c1e]'
                          }`}
                        >
                          <span className="material-symbols-outlined text-3xl">arrow_forward</span>
                        </Link>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>

          {/* CTA Section */}
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-40 relative rounded-[5rem] overflow-hidden bg-[#014d4e] p-24 text-center text-white shadow-[0_50px_100px_-20px_rgba(1,77,78,0.4)]"
          >
            {/* Decorative background for CTA with dynamic color blobs */}
            <div className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none">
              <div className="absolute top-0 right-0 w-96 h-96 bg-tertiary rounded-full blur-[100px]" />
              <div className="absolute bottom-0 left-0 w-96 h-96 bg-white rounded-full blur-[100px]" />
            </div>
            
            <div className="relative z-10 max-w-3xl mx-auto">
              <h2 className="text-6xl md:text-7xl font-headline font-black mb-10 leading-[0.95] tracking-tighter">
                ¿Listo para tu propia <br />
                <span className="text-tertiary italic underline decoration-white/20">transformación?</span>
              </h2>
              <p className="text-white/80 text-2xl mb-16 font-medium leading-relaxed">
                Únete a los miles de pacientes que han recuperado su confianza de la mano de nuestros especialistas líderes.
              </p>
              <Link
                href="/reservar"
                className="bg-white text-[#014d4e] px-16 py-7 rounded-full font-black text-2xl hover:bg-tertiary hover:text-white transition-all shadow-2xl hover:scale-105 inline-flex items-center gap-4 group"
              >
                Comienza hoy mismo
                <span className="material-symbols-outlined text-3xl transition-transform group-hover:translate-x-3">auto_awesome</span>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  )
}
