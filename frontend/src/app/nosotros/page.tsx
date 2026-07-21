'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'

// Paleta Serene Derm — hex directos para evitar tree-shaking de Tailwind
// Claros: #72C1C1 (teal), #B7B0D3 (lavanda), #F0A17E (salmón)  → texto oscuro
// Oscuros: #02696A (teal dark), #484360 (púrpura dark), #8C4E31 (terracota dark) → texto blanco

const VALUES = [
  { icon: 'science',          title: 'Rigor Científico', desc: 'Cada tratamiento basado en evidencia clínica actualizada y protocolos internacionales.',   bg: '#72C1C1', text: '#014141', iconBg: '#02696A', iconColor: '#ffffff' },
  { icon: 'diversity_3',      title: 'Enfoque Humano',   desc: 'Tratamos personas, no solo pieles. Tu bienestar integral es nuestra prioridad absoluta.',   bg: '#B7B0D3', text: '#2c2842', iconBg: '#484360', iconColor: '#ffffff' },
  { icon: 'emoji_objects',    title: 'Innovación',       desc: 'Incorporamos técnicas y tecnologías de vanguardia en dermatología clínica y estética.',      bg: '#F0A17E', text: '#5c3320', iconBg: '#8C4E31', iconColor: '#ffffff' },
  { icon: 'workspace_premium',title: 'Excelencia',       desc: 'Estándares internacionales en cada consulta, cada tratamiento y cada resultado.',            bg: '#02696A', text: '#ffffff', iconBg: 'rgba(255,255,255,0.2)', iconColor: '#72C1C1' },
]

const CERTIFICATIONS = [
  { name: 'Colegio Médico del Perú',        org: 'CMP', bg: '#72C1C1', text: '#014141' },
  { name: 'Sociedad Peruana de Dermatología',org: 'SPD', bg: '#B7B0D3', text: '#2c2842' },
  { name: 'International Society of Derm.',  org: 'ISD', bg: '#F0A17E', text: '#5c3320' },
  { name: 'American Academy of Dermatology',org: 'AAD', bg: '#02696A', text: '#ffffff' },
]

const TIMELINE = [
  { year: '2009', event: 'Fundación de DERMQ en San Isidro, Lima.',            dot: '#72C1C1' },
  { year: '2013', event: 'Apertura de segunda sede en Miraflores.',             dot: '#B7B0D3' },
  { year: '2018', event: 'Certificación internacional ISO 9001.',               dot: '#F0A17E' },
  { year: '2024', event: 'Implementación de tecnología láser de 4ª generación.',dot: '#72C1C1' },
]

const STATS = [
  { number: '15+',  label: 'Años de Experiencia', accent: '#72C1C1' },
  { number: '10k+', label: 'Pacientes Atendidos',  accent: '#B7B0D3' },
  { number: '98%',  label: 'Satisfacción Clínica', accent: '#F0A17E' },
  { number: '3',    label: 'Sedes en Lima',         accent: '#72C1C1' },
]

export default function NosotrosPage() {
  return (
    <main className="pt-0 overflow-hidden bg-background">

      {/* ── HERO — Teal Oscuro #02696A ── */}
      <section className="relative min-h-[90vh] flex items-center pt-24 pb-32 overflow-hidden rounded-b-[4rem] lg:rounded-b-[6rem] z-40 shadow-[0_20px_50px_rgba(0,0,0,0.2)]" style={{ background: '#02696A' }}>
        {/* Blobs animados */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <motion.div
            animate={{ scale: [1, 1.2, 1], x: [0, 30, 0] }}
            transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute -top-40 -right-40 w-[700px] h-[700px] rounded-full blur-[130px]"
            style={{ background: 'rgba(114,193,193,0.35)' }}
          />
          <motion.div
            animate={{ scale: [1, 1.15, 1], y: [0, -40, 0] }}
            transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut', delay: 4 }}
            className="absolute -bottom-40 -left-40 w-[600px] h-[600px] rounded-full blur-[130px]"
            style={{ background: 'rgba(240,161,126,0.25)' }}
          />
          <div
            className="absolute top-1/2 left-1/3 w-[500px] h-[500px] rounded-full blur-[100px]"
            style={{ background: 'rgba(183,176,211,0.15)' }}
          />
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-10 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

            {/* Headline */}
            <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
              <span
                className="inline-flex items-center gap-2 px-5 py-2 rounded-full text-xs font-black uppercase tracking-[0.2em] mb-8"
                style={{ background: 'rgba(114,193,193,0.25)', border: '1px solid rgba(114,193,193,0.5)', color: '#72C1C1' }}
              >
                <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: '#72C1C1' }} />
                Quiénes Somos
              </span>

              <h1 className="text-7xl md:text-[5.5rem] font-headline font-black tracking-tighter text-white mb-8 leading-[0.92]">
                La ciencia<br />
                <span style={{ color: '#72C1C1' }}>que cuida</span><br />
                tu piel.
              </h1>

              <p
                className="text-xl font-medium leading-relaxed max-w-lg mb-12 pl-6"
                style={{ color: 'rgba(255,255,255,0.8)', borderLeft: '4px solid #F0A17E' }}
              >
                DERMQ nació de la convicción de que la salud de tu piel merece el más alto estándar científico y la experiencia más humana.
              </p>

              <Link
                href="#directora"
                className="inline-flex items-center gap-3 font-black text-lg px-10 py-5 rounded-full transition-all duration-300 hover:scale-105 shadow-xl"
                style={{ background: '#F0A17E', color: '#5c3320' }}
              >
                Conoce a nuestra directora
                <span className="material-symbols-outlined">arrow_downward</span>
              </Link>
            </motion.div>

            {/* Stats grid */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="grid grid-cols-2 gap-5"
            >
              {STATS.map((s, i) => (
                <motion.div
                  key={s.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + i * 0.1 }}
                  className="rounded-[2.5rem] p-8 hover:-translate-y-1 transition-all duration-300"
                  style={{ background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.2)' }}
                >
                  <span className="block text-5xl font-headline font-black mb-2" style={{ color: s.accent }}>{s.number}</span>
                  <span className="text-xs font-bold uppercase tracking-[0.15em]" style={{ color: 'rgba(255,255,255,0.65)' }}>{s.label}</span>
                </motion.div>
              ))}
            </motion.div>

          </div>
        </div>
      </section>

      {/* ── DRA. LEYVA — Color Hueso #FDF7E4 ── */}
      <section id="directora" className="relative pt-48 pb-32 -mt-24 overflow-hidden rounded-b-[4rem] lg:rounded-b-[6rem] z-30 shadow-[0_20px_50px_rgba(0,0,0,0.08)]" style={{ background: '#FDF7E4' }}>
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full blur-[130px]" style={{ background: 'rgba(183,176,211,0.15)', transform: 'translate(25%,-25%)' }} />
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] rounded-full blur-[130px]" style={{ background: 'rgba(114,193,193,0.1)', transform: 'translate(-25%,25%)' }} />
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">

            {/* Foto */}
            <motion.div
              initial={{ opacity: 0, scale: 0.92 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <div
                className="relative w-full aspect-[4/5] rounded-[4rem] overflow-hidden"
                style={{ border: '4px solid #ffffff', boxShadow: '0 40px 80px rgba(0,0,0,0.15)' }}
              >
                <Image src="/leyva.png" alt="Dra. Marcela Leyva" fill className="object-cover object-center" />
                <div
                  className="absolute bottom-0 left-0 right-0 p-10 pt-24"
                  style={{ background: 'linear-gradient(to top, #02696a 0%, transparent 100%)' }}
                >
                  <h3 className="text-3xl font-headline font-black text-white mb-1">Dra. Marcela Leyva</h3>
                  <p className="font-bold uppercase tracking-widest text-sm" style={{ color: '#72C1C1' }}>Directora Médica · Fundadora</p>
                </div>
              </div>
            </motion.div>

            {/* Contenido */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-5xl font-headline font-black tracking-tight mb-8 leading-[1.1]" style={{ color: '#02696A' }}>
                Transformando vidas,<br />
                <span style={{ color: '#8C4E31' }}>un diagnóstico</span><br />
                a la vez.
              </h2>

              <blockquote
                className="p-6 rounded-3xl mb-8 italic text-lg font-medium leading-relaxed text-on-surface"
                style={{ background: 'rgba(2, 105, 106, 0.05)', borderLeft: '4px solid #02696a' }}
              >
                "Mi visión al fundar DERMQ fue crear un espacio donde la excelencia médica se encontrara con la empatía genuina. No solo tratamos pieles — restauramos la confianza."
              </blockquote>

              <p className="text-lg leading-relaxed mb-8 text-on-surface-variant">
                La Dra. Marcela Leyva Sartori es una destacada especialista en dermatología clínica y estética avanzada. Formada en la Universidad Nacional Mayor de San Marcos (UNMSM), ha complementado su práctica profesional con credenciales avanzadas en Inmunología de Harvard Medical School (HMX Fundamentals & Pro).
              </p>

              {/* Highlights del CV */}
              <div className="mb-10 space-y-4">
                <div className="flex items-start gap-4">
                  <span className="material-symbols-outlined mt-1" style={{ color: '#02696a' }}>school</span>
                  <div>
                    <h4 className="text-on-surface font-extrabold text-sm">Formación y Residencia</h4>
                    <p className="text-xs text-on-surface-variant/80">Especialidad en Dermatología por la UNMSM, sede Hospital Nacional Daniel Alcides Carrión.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <span className="material-symbols-outlined mt-1" style={{ color: '#02696a' }}>workspace_premium</span>
                  <div>
                    <h4 className="text-on-surface font-extrabold text-sm">Harvard Medical School HMX</h4>
                    <p className="text-xs text-on-surface-variant/80">Certificada en Immunology y Pro Immunology (Terapias biológicas para inflamación crónica y autoinmunidad).</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <span className="material-symbols-outlined mt-1" style={{ color: '#02696a' }}>groups</span>
                  <div>
                    <h4 className="text-on-surface font-extrabold text-sm">Liderazgo Médico</h4>
                    <p className="text-xs text-on-surface-variant/80">Ex-Vicepresidenta de la Sociedad Peruana de Dermatología (2019-2020) y ex-miembro directivo de Círculo Dermatológico del Perú.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <span className="material-symbols-outlined mt-1" style={{ color: '#02696a' }}>medical_information</span>
                  <div>
                    <h4 className="text-on-surface font-extrabold text-sm">Trayectoria Clínica</h4>
                    <p className="text-xs text-on-surface-variant/80">Dermatóloga Asistente en la Clínica SANNA San Borja, ex-dermatóloga de Jockey Salud y Hospital San José del Callao.</p>
                  </div>
                </div>
              </div>

              {/* Certificaciones */}
              <div className="grid grid-cols-2 gap-3">
                {CERTIFICATIONS.map((c) => (
                  <div
                    key={c.org}
                    className="flex items-center gap-3 rounded-2xl p-4 transition-all"
                    style={{ background: 'rgba(2, 105, 106, 0.03)', border: '1px solid rgba(2, 105, 106, 0.08)' }}
                  >
                    <span
                      className="w-10 h-10 rounded-xl flex items-center justify-center font-black text-xs shrink-0"
                      style={{ background: c.bg, color: c.text }}
                    >
                      {c.org}
                    </span>
                    <p className="text-xs font-bold leading-tight text-on-surface-variant">{c.name}</p>
                  </div>
                ))}
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* ── VALORES — Fondo neutro con tarjetas de color ── */}
      <section className="relative pt-48 pb-32 -mt-24 overflow-hidden rounded-b-[4rem] lg:rounded-b-[6rem] z-20 shadow-[0_20px_50px_rgba(0,0,0,0.1)]" style={{ background: '#F2F4F4' }}>
        <div className="absolute inset-0 pointer-events-none" style={{ background: 'linear-gradient(180deg, #F2F4F4 0%, rgba(114,193,193,0.08) 100%)' }} />

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <span
              className="inline-block px-5 py-2 rounded-full text-xs font-black uppercase tracking-[0.2em] mb-6"
              style={{ background: '#B7B0D3', color: '#2c2842' }}
            >
              Nuestros Pilares
            </span>
            <h2 className="text-6xl font-headline font-black tracking-tighter mb-5" style={{ color: '#02696A' }}>
              Lo que nos <em style={{ color: '#8C4E31' }}>define.</em>
            </h2>
            <p className="text-xl max-w-2xl mx-auto font-medium" style={{ color: 'rgba(26,28,30,0.6)' }}>
              Los valores que guían nuestra práctica médica cada día.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {VALUES.map((v, i) => (
              <motion.div
                key={v.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="rounded-[3rem] p-10 shadow-xl hover:-translate-y-4 transition-all duration-400"
                style={{ background: v.bg }}
              >
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center mb-8 shadow-md"
                  style={{ background: v.iconBg }}
                >
                  <span className="material-symbols-outlined text-2xl" style={{ color: v.iconColor }}>{v.icon}</span>
                </div>
                <h3 className="font-headline font-black text-2xl mb-4" style={{ color: v.text }}>{v.title}</h3>
                <p className="leading-relaxed font-medium text-sm" style={{ color: v.text, opacity: 0.85 }}>{v.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TRAYECTORIA — Terracota Oscuro #8C4E31 ── */}
      <section className="relative pt-48 pb-32 -mt-24 overflow-hidden rounded-b-[4rem] lg:rounded-b-[6rem] z-10 shadow-[0_20px_50px_rgba(0,0,0,0.15)]" style={{ background: '#8C4E31' }}>
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full blur-[130px]"
            style={{ background: 'rgba(240,161,126,0.3)' }}
          />
          <div className="absolute -bottom-40 -right-40 w-[500px] h-[500px] rounded-full blur-[130px]" style={{ background: 'rgba(114,193,193,0.15)' }} />
        </div>

        <div className="max-w-5xl mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <span
              className="inline-block px-5 py-2 rounded-full text-xs font-black uppercase tracking-[0.2em] mb-6"
              style={{ background: '#F0A17E', color: '#5c3320' }}
            >
              Historia
            </span>
            <h2 className="text-6xl font-headline font-black tracking-tighter text-white mb-4">
              Nuestra <em style={{ color: '#F0A17E' }}>Trayectoria.</em>
            </h2>
            <p className="text-xl font-medium" style={{ color: 'rgba(255,255,255,0.65)' }}>15 años construyendo confianza.</p>
          </motion.div>

          {/* Timeline zigzag */}
          <div className="relative">
            <div className="absolute left-1/2 top-0 bottom-0 w-0.5 -translate-x-1/2" style={{ background: 'rgba(255,255,255,0.2)' }} />
            <div className="space-y-16">
              {TIMELINE.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.15 }}
                  className={`flex items-center gap-10 ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}
                >
                  <div className="flex-1">
                    <div
                      className={`rounded-3xl p-8 transition-all ${index % 2 === 0 ? 'text-right' : 'text-left'}`}
                      style={{ background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.2)' }}
                    >
                      <span
                        className="inline-block text-xs font-black uppercase tracking-[0.2em] mb-3 px-4 py-1.5 rounded-full"
                        style={{ background: item.dot, color: '#1a1c1e' }}
                      >
                        {item.year}
                      </span>
                      <p className="text-white font-bold text-lg leading-snug">{item.event}</p>
                    </div>
                  </div>
                  <div className="relative flex-shrink-0 z-10">
                    <div className="w-6 h-6 rounded-full border-4" style={{ background: item.dot, borderColor: '#8C4E31', boxShadow: '0 0 0 4px rgba(255,255,255,0.3)' }} />
                  </div>
                  <div className="flex-1" />
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA — Teal Oscuro #02696A ── */}
      <section className="relative pt-48 pb-32 -mt-24 text-center overflow-hidden z-0" style={{ background: '#02696A' }}>
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute top-0 right-0 w-96 h-96 rounded-full blur-[100px]"
            style={{ background: 'rgba(114,193,193,0.3)', transform: 'translate(25%,-25%)' }}
          />
          <motion.div
            animate={{ scale: [1, 1.15, 1] }}
            transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
            className="absolute bottom-0 left-0 w-96 h-96 rounded-full blur-[100px]"
            style={{ background: 'rgba(240,161,126,0.25)', transform: 'translate(-25%,25%)' }}
          />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-3xl mx-auto px-6 relative z-10"
        >
          <h2 className="text-5xl md:text-7xl font-headline font-black mb-8 text-white leading-tight">
            Tu piel en las<br />
            <em style={{ color: '#F0A17E' }}>mejores manos.</em>
          </h2>
          <p className="text-xl mb-12 font-medium max-w-xl mx-auto" style={{ color: 'rgba(255,255,255,0.75)' }}>
            Da el primer paso hacia una piel más saludable. La Dra. Leyva y su equipo te esperan.
          </p>
          <Link
            href="/reservar"
            className="inline-flex items-center gap-4 font-black text-xl px-14 py-6 rounded-full transition-all duration-300 hover:scale-105 group"
            style={{ background: '#F0A17E', color: '#5c3320', boxShadow: '0 10px 40px rgba(240,161,126,0.4)' }}
          >
            Agendar mi cita hoy
            <span className="material-symbols-outlined text-2xl transition-transform group-hover:translate-x-2">arrow_forward</span>
          </Link>
        </motion.div>
      </section>

    </main>
  )
}
