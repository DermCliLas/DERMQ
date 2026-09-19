'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { DRA_LEYVA_PHOTOS } from '@/data/draleyva-photos'

// Paleta Serene Derm — tokens oficiales
// Claros: #72C1C1 (teal), #B7B0D3 (lavanda), #F0A17E (salmón), #FDF7E4 (crema/hueso), #F2F4F4 (neutro claro)
// Oscuros: #02696A (teal dark), #484360 (púrpura dark), #8C4E31 (terracota dark)

const VALUES = [
  {
    icon: 'school',
    title: 'Conocimiento Médico',
    subtitle: 'El Criterio Ante Todo',
    desc: 'Detrás de cada tratamiento existe una evaluación médica integral y un diagnóstico responsable. La tecnología solo aporta valor cuando está dirigida por criterio clínico y formación rigurosa.',
    bg: '#72C1C1',
    text: '#014141',
    iconBg: '#02696A',
    iconColor: '#ffffff',
  },
  {
    icon: 'medical_services',
    title: 'Tecnología Especializada',
    subtitle: 'Innovación con Sentido',
    desc: 'Equipos láser y tecnología médica avanzada incorporados desde 2012. Cada equipo y protocolo cuenta con permanente capacitación técnica para maximizar resultados con absoluta precisión.',
    bg: '#B7B0D3',
    text: '#2c2842',
    iconBg: '#484360',
    iconColor: '#ffffff',
  },
  {
    icon: 'verified_user',
    title: 'Seguridad y Respaldo',
    subtitle: 'Medicina Basada en Evidencia',
    desc: 'Empleamos exclusivamente técnicas, sustancias y medicamentos cuya eficacia y seguridad clínica estén respaldadas por evidencia científica y autorizaciones oficiales.',
    bg: '#F0A17E',
    text: '#5c3320',
    iconBg: '#8C4E31',
    iconColor: '#ffffff',
  },
  {
    icon: 'diversity_3',
    title: 'Ética y Enfoque Humano',
    subtitle: 'Detrás de Cada Piel, una Persona',
    desc: 'Asumimos el deber de educar y orientar con rigor frente a la desinformación en redes sociales de personas no especializadas. Tu confianza es nuestro mayor compromiso.',
    bg: '#02696A',
    text: '#ffffff',
    iconBg: 'rgba(255,255,255,0.2)',
    iconColor: '#72C1C1',
  },
]

const CERTIFICATIONS = [
  { name: 'Colegio Médico del Perú', org: 'CMP', bg: '#72C1C1', text: '#014141' },
  { name: 'Sociedad Peruana de Dermatología', org: 'SPD', bg: '#B7B0D3', text: '#2c2842' },
  { name: 'Círculo Dermatológico del Perú', org: 'CIDERM', bg: '#F0A17E', text: '#5c3320' },
  { name: 'Harvard Medical School HMX', org: 'HMS', bg: '#02696A', text: '#ffffff' },
]

const TIMELINE = [
  {
    year: '2004 – 2007',
    badge: 'Especialización Médica',
    title: 'Residencia en Hospital Nacional Daniel Alcides Carrión (UNMSM)',
    desc: 'Ingreso riguroso a la especialidad de Dermatología. Tres años de formación teórica y práctica 100% presencial, con evaluaciones permanentes de la Cátedra de Dermatología de la Universidad Nacional Mayor de San Marcos y médicos titulares.',
    dot: '#72C1C1',
  },
  {
    year: '2007 – 2011',
    badge: 'Práctica Médica Privada',
    title: 'Consultorios en Callao, San Isidro y La Molina',
    desc: 'Obtención del título de especialista e inicio de la práctica privada. Años de contacto directo con pacientes, atendiendo diversas necesidades clínicas y cultivando la búsqueda de alternativas terapéuticas más efectivas y seguras.',
    dot: '#B7B0D3',
  },
  {
    year: '2012',
    badge: 'Vanguardia Tecnológica',
    title: 'Incorporación de Equipos Láser con Criterio Clínico',
    desc: 'Incursión pionera en tecnología láser y aparatología médica especializada. Bajo una premisa fundamental: la tecnología por sí sola no es suficiente; cada equipo debe estar sustentado en capacitación continua y criterio médico.',
    dot: '#F0A17E',
  },
  {
    year: '20 de Julio, 2013',
    badge: 'Fundación Institucional',
    title: 'Inicio Oficial de Dermatología Clínica y Láser S.A.C.',
    desc: 'Nacimiento formal de la empresa, consolidando en una institución médica una sólida trayectoria previa. Se establecen los tres pilares fundacionales: conocimiento médico, tecnología especializada y seguridad del paciente.',
    dot: '#72C1C1',
  },
  {
    year: 'Presente (19 Años)',
    badge: 'Liderazgo y Ética',
    title: '19 Años de Ejercicio y Compromiso Contra la Desinformación',
    desc: 'Actualización científica permanente, credenciales Harvard Medical School en Inmunología, rol directivo en la Sociedad Peruana de Dermatología y un rol activo educando a la población con evidencia frente a falsas promesas en redes sociales.',
    dot: '#F0A17E',
  },
]

const STATS = [
  { number: '19', label: 'Años de Ejercicio Profesional', accent: '#72C1C1' },
  { number: '2013', label: 'Fundación Oficial (20 de Julio)', accent: '#B7B0D3' },
  { number: '3', label: 'Pilares: Conocimiento, Tecnología y Seguridad', accent: '#F0A17E' },
  { number: '10k+', label: 'Pacientes Atendidos con Criterio Médico', accent: '#72C1C1' },
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
                Dermatología Clínica y Láser S.A.C.
              </span>

              <h1 className="text-5xl sm:text-7xl md:text-[5.5rem] font-headline font-black tracking-tighter text-white mb-8 leading-[0.92]">
                19 años de<br />
                <span style={{ color: '#72C1C1' }}>criterio médico</span><br />
                y vocación.
              </h1>

              <p
                className="text-xl font-medium leading-relaxed max-w-lg mb-12 pl-6"
                style={{ color: 'rgba(255,255,255,0.85)', borderLeft: '4px solid #F0A17E' }}
              >
                La historia de DERMQ nace de una vocación médica construida sobre la formación rigurosa en la UNMSM, la experiencia clínica continua y, sobre todo, el compromiso inquebrantable con el bienestar de cada paciente.
              </p>

              <div className="flex flex-wrap gap-4">
                <Link
                  href="#historia"
                  className="inline-flex items-center gap-3 font-black text-base px-8 py-4 rounded-full transition-all duration-300 hover:scale-105 shadow-xl"
                  style={{ background: '#F0A17E', color: '#5c3320' }}
                >
                  Conoce nuestra historia
                  <span className="material-symbols-outlined text-xl">menu_book</span>
                </Link>
                <Link
                  href="#directora"
                  className="inline-flex items-center gap-2 font-bold text-base px-8 py-4 rounded-full transition-all duration-300 text-white hover:bg-white/10 border border-white/30"
                >
                  Directora Médica
                  <span className="material-symbols-outlined text-lg">arrow_downward</span>
                </Link>
              </div>
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
                  <span className="text-xs font-bold uppercase tracking-[0.15em] leading-snug block" style={{ color: 'rgba(255,255,255,0.75)' }}>{s.label}</span>
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
                <Image src={DRA_LEYVA_PHOTOS.directoraPortrait} alt="Dra. Marcela Leyva" fill className="object-cover object-center" priority />
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
              <span
                className="inline-block px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-[0.2em] mb-4"
                style={{ background: 'rgba(2,105,106,0.1)', color: '#02696A' }}
              >
                Dirección Médica & Especialista
              </span>
              <h2 className="text-5xl font-headline font-black tracking-tight mb-8 leading-[1.1]" style={{ color: '#02696A' }}>
                Criterio médico,<br />
                <span style={{ color: '#8C4E31' }}>experiencia y vocación</span><br />
                al servicio de tu piel.
              </h2>

              <blockquote
                className="p-6 rounded-3xl mb-8 italic text-lg font-medium leading-relaxed text-on-surface shadow-sm"
                style={{ background: 'rgba(2, 105, 106, 0.05)', borderLeft: '4px solid #02696a' }}
              >
                "Detrás de cada consulta, cada procedimiento y cada tratamiento existe una persona que deposita su confianza en nosotros. Y esa confianza representa una responsabilidad que nos impulsa a seguir aprendiendo e innovando para ofrecer una Dermatología de calidad."
                <footer className="mt-3 text-xs font-black not-italic text-[#02696A] tracking-wider uppercase">
                  — Dra. Marcela Leyva · Fundadora y Directora Médica
                </footer>
              </blockquote>

              <p className="text-lg leading-relaxed mb-8 text-on-surface-variant">
                La Dra. Marcela Leyva Sartori decidió consagrar su vida profesional a una disciplina médica que exige constante preparación, rigor científico y una profunda responsabilidad social: la Dermatología. Con 19 años de ejercicio profesional continuo, combina la solidez de la formación clínica tradicional de la UNMSM con los avances más vanguardistas en láser e inmunología cutánea de Harvard Medical School.
              </p>

              {/* Highlights del CV */}
              <div className="mb-10 space-y-4">
                <div className="flex items-start gap-4">
                  <span className="material-symbols-outlined mt-1" style={{ color: '#02696a' }}>school</span>
                  <div>
                    <h4 className="text-on-surface font-extrabold text-sm">Formación y Residencia UNMSM</h4>
                    <p className="text-xs text-on-surface-variant/80">Especialidad en Dermatología (2004–2007) en el Hospital Nacional Daniel Alcides Carrión, con formación 100% presencial evaluada por la Cátedra de la Universidad Nacional Mayor de San Marcos.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <span className="material-symbols-outlined mt-1" style={{ color: '#02696a' }}>workspace_premium</span>
                  <div>
                    <h4 className="text-on-surface font-extrabold text-sm">Harvard Medical School HMX</h4>
                    <p className="text-xs text-on-surface-variant/80">Certificada en Immunology y Pro Immunology (Terapias biológicas para inflamación crónica y patologías autoinmunes cutáneas).</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <span className="material-symbols-outlined mt-1" style={{ color: '#02696a' }}>groups</span>
                  <div>
                    <h4 className="text-on-surface font-extrabold text-sm">Liderazgo Institucional</h4>
                    <p className="text-xs text-on-surface-variant/80">Ex-Vicepresidenta de la Sociedad Peruana de Dermatología (2019-2020) y ex-miembro directivo de Círculo Dermatológico del Perú.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <span className="material-symbols-outlined mt-1" style={{ color: '#02696a' }}>medical_information</span>
                  <div>
                    <h4 className="text-on-surface font-extrabold text-sm">19 Años de Ejercicio Profesional</h4>
                    <p className="text-xs text-on-surface-variant/80">Práctica privada desde 2007 en consultorios de Callao, San Isidro y La Molina. Médica dermatóloga en Clínica SANNA San Borja.</p>
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

      {/* ── NUEVA SECCIÓN: HISTORIA OFICIAL Y MANIFIESTO ÉTICO — Blanco Nieve #FFFFFF ── */}
      <section id="historia" className="relative pt-48 pb-32 -mt-24 overflow-hidden rounded-b-[4rem] lg:rounded-b-[6rem] z-25 shadow-[0_20px_50px_rgba(0,0,0,0.06)] bg-white">
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-1/4 right-0 w-[500px] h-[500px] rounded-full blur-[140px]" style={{ background: 'rgba(114,193,193,0.12)' }} />
          <div className="absolute bottom-10 left-10 w-[500px] h-[500px] rounded-full blur-[140px]" style={{ background: 'rgba(240,161,126,0.1)' }} />
        </div>

        <div className="max-w-6xl mx-auto px-6 relative z-10">

          {/* Encabezado Editorial */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-3xl mx-auto mb-20"
          >
            <span
              className="inline-block px-5 py-2 rounded-full text-xs font-black uppercase tracking-[0.2em] mb-6"
              style={{ background: 'rgba(2,105,106,0.1)', color: '#02696A' }}
            >
              Nuestra Historia
            </span>
            <h2 className="text-4xl sm:text-6xl font-headline font-black tracking-tighter text-[#1a1c1e] mb-6">
              El origen de una institución médica fundada en la <em style={{ color: '#02696A' }}>excelencia.</em>
            </h2>
            <p className="text-lg md:text-xl font-medium leading-relaxed text-[#52525b]">
              La historia de <strong>Dermatología Clínica y Láser S.A.C.</strong> nace de una vocación médica construida sobre la formación rigurosa, la experiencia y, sobre todo, el compromiso incondicional con el paciente.
            </p>
          </motion.div>

          {/* 3 Capítulos Editoriales */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            
            {/* Capítulo 1 */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="rounded-[2.5rem] p-8 md:p-10 flex flex-col justify-between border border-slate-100 shadow-lg hover:shadow-xl transition-all"
              style={{ background: '#F8FAFA' }}
            >
              <div>
                <span className="inline-block px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest mb-6" style={{ background: '#72C1C1', color: '#014141' }}>
                  2004 — 2011 · Los Inicios
                </span>
                <h3 className="font-headline font-black text-2xl mb-4 text-[#02696A]">
                  La Vocación y el Rigor Formativo
                </h3>
                <p className="text-sm font-medium leading-relaxed text-[#52525b] mb-4">
                  Todo comenzó con la decisión de dedicar la vida profesional a una especialidad que exige constante preparación: la Dermatología.
                </p>
                <p className="text-xs leading-relaxed text-[#71717a]">
                  Entre 2004 y 2007, tras un riguroso proceso de ingreso, la Dra. Leyva cursó su residentado en el <strong>Hospital Nacional Daniel Alcides Carrión</strong> (UNMSM), recibiendo una formación presencial intensiva bajo la Cátedra de Dermatología. Culminar la especialidad dio inicio a su práctica privada en consultorios de <strong>Callao, San Isidro y La Molina</strong>, comprendiendo a fondo las necesidades y expectativas de los pacientes.
                </p>
              </div>
              <div className="mt-8 pt-6 border-t border-slate-200/80 flex items-center gap-3">
                <span className="material-symbols-outlined text-[#02696A]">school</span>
                <span className="text-xs font-bold text-[#02696A]">Formación Médica UNMSM</span>
              </div>
            </motion.div>

            {/* Capítulo 2 */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="rounded-[2.5rem] p-8 md:p-10 flex flex-col justify-between border border-slate-100 shadow-lg hover:shadow-xl transition-all"
              style={{ background: '#FAF7F2' }}
            >
              <div>
                <span className="inline-block px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest mb-6" style={{ background: '#F0A17E', color: '#5c3320' }}>
                  2012 — 2013 · Innovación
                </span>
                <h3 className="font-headline font-black text-2xl mb-4 text-[#8C4E31]">
                  Láser con Criterio y Fundación
                </h3>
                <p className="text-sm font-medium leading-relaxed text-[#52525b] mb-4">
                  A partir de 2012, se incorporan equipos láser y tecnología de vanguardia bajo una premisa inquebrantable: <em>la tecnología por sí sola no es suficiente</em>.
                </p>
                <p className="text-xs leading-relaxed text-[#71717a]">
                  Cada equipo y procedimiento debía estar acompañado de conocimiento, capacitación y estricto criterio médico. Con esta visión, el <strong>20 de julio de 2013</strong> se formaliza <strong>Dermatología Clínica y Láser S.A.C.</strong>, consolidando en una institución formal una trayectoria profesional sustentada en tres pilares: conocimiento médico, tecnología especializada y seguridad.
                </p>
              </div>
              <div className="mt-8 pt-6 border-t border-slate-200/80 flex items-center gap-3">
                <span className="material-symbols-outlined text-[#8C4E31]">calendar_month</span>
                <span className="text-xs font-bold text-[#8C4E31]">Fundación: 20 de Julio 2013</span>
              </div>
            </motion.div>

            {/* Capítulo 3 */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="rounded-[2.5rem] p-8 md:p-10 flex flex-col justify-between border border-slate-100 shadow-lg hover:shadow-xl transition-all"
              style={{ background: '#F4F3F8' }}
            >
              <div>
                <span className="inline-block px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest mb-6" style={{ background: '#B7B0D3', color: '#2c2842' }}>
                  19 Años · Compromiso Ético
                </span>
                <h3 className="font-headline font-black text-2xl mb-4 text-[#484360]">
                  Frente a la Desinformación Digital
                </h3>
                <p className="text-sm font-medium leading-relaxed text-[#52525b] mb-4">
                  El acceso masivo a redes sociales ha democratizado la salud, pero también ha generado una avalancha de información incorrecta difundida por no especialistas.
                </p>
                <p className="text-xs leading-relaxed text-[#71717a]">
                  Nuestra responsabilidad como especialistas no es solo curar la piel: <strong>tenemos el deber ético de educar, orientar y transmitir información veraz</strong> a la población. Actuamos bajo principios de respeto profesional, prescribiendo solo medicamentos y técnicas con eficacia y seguridad científicamente demostradas.
                </p>
              </div>
              <div className="mt-8 pt-6 border-t border-slate-200/80 flex items-center gap-3">
                <span className="material-symbols-outlined text-[#484360]">verified</span>
                <span className="text-xs font-bold text-[#484360]">Medicina Basada en Evidencia</span>
              </div>
            </motion.div>

          </div>

          {/* Galería Fotográfica de la Clínica y Tecnología Médica Real */}
          <div className="mb-20">
            <div className="text-center mb-10">
              <span
                className="inline-block px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-[0.2em] mb-3"
                style={{ background: 'rgba(2,105,106,0.08)', color: '#02696A' }}
              >
                Espacios e Infraestructura
              </span>
              <h3 className="text-2xl sm:text-3xl font-headline font-black text-[#1a1c1e]">
                Nuestras Instalaciones y Tecnología Médica
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  img: DRA_LEYVA_PHOTOS.receptionDesk,
                  title: 'Recepción DERMQ',
                  subtitle: 'Atención personalizada en un ambiente cálido y profesional',
                },
                {
                  img: DRA_LEYVA_PHOTOS.consultationRoomWide,
                  title: 'Consultorio Médico',
                  subtitle: 'Espacio privado para evaluación y diagnóstico clínico',
                },
                {
                  img: DRA_LEYVA_PHOTOS.directoraSkinModel,
                  title: 'Educación al Paciente',
                  subtitle: 'Explicación anatómica clara y criterio médico en cada consulta',
                },
                {
                  img: DRA_LEYVA_PHOTOS.laserQuantaSystem,
                  title: 'Quanta System Láser',
                  subtitle: 'Plataforma Q-Plus EVO de alta precisión dermatológica',
                },
              ].map((item, i) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="group rounded-3xl overflow-hidden bg-slate-50 border border-slate-100 shadow-md hover:shadow-xl transition-all duration-300"
                >
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <Image
                      src={item.img}
                      alt={item.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />
                  </div>
                  <div className="p-5">
                    <h4 className="font-headline font-black text-base text-[#02696A] mb-1">
                      {item.title}
                    </h4>
                    <p className="text-xs text-[#71717a] leading-relaxed">
                      {item.subtitle}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Gran Cita de Compromiso */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="rounded-[3rem] p-10 md:p-14 text-white relative overflow-hidden shadow-2xl"
            style={{ background: '#02696A' }}
          >
            <div className="relative z-10 max-w-4xl mx-auto text-center">
              <span className="material-symbols-outlined text-4xl mb-4" style={{ color: '#72C1C1' }}>format_quote</span>
              <p className="text-xl sm:text-2xl md:text-3xl font-headline font-light italic leading-relaxed mb-6">
                "Detrás de cada consulta, cada procedimiento y cada tratamiento existe una persona que deposita su confianza en nosotros. Y esa confianza representa una responsabilidad que nos impulsa a seguir aprendiendo, innovando y trabajando cada día para ofrecer una Dermatología de calidad."
              </p>
              <div className="inline-block border-t border-white/20 pt-4">
                <span className="block font-headline font-black text-base uppercase tracking-widest text-[#72C1C1]">
                  Dermatología Clínica y Láser S.A.C.
                </span>
                <span className="text-xs uppercase tracking-widest text-white/70">
                  19 Años de Ejercicio Profesional · Criterio Médico Garantizado
                </span>
              </div>
            </div>
          </motion.div>

        </div>
      </section>

      {/* ── VALORES / PILARES — Fondo neutro con tarjetas de color ── */}
      <section id="valores" className="relative pt-48 pb-32 -mt-24 overflow-hidden rounded-b-[4rem] lg:rounded-b-[6rem] z-20 shadow-[0_20px_50px_rgba(0,0,0,0.1)]" style={{ background: '#F2F4F4' }}>
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
              Pilares Institucionales
            </span>
            <h2 className="text-4xl sm:text-6xl font-headline font-black tracking-tighter mb-5" style={{ color: '#02696A' }}>
              Los tres pilares que <em style={{ color: '#8C4E31' }}>nos definen.</em>
            </h2>
            <p className="text-xl max-w-2xl mx-auto font-medium text-[#52525b]">
              Conocimiento médico, tecnología especializada y seguridad: los principios innegociables con los que nació y se consolida Dermatología Clínica y Láser S.A.C.
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
                className="rounded-[3rem] p-10 shadow-xl hover:-translate-y-4 transition-all duration-400 flex flex-col justify-between"
                style={{ background: v.bg }}
              >
                <div>
                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center mb-8 shadow-md"
                    style={{ background: v.iconBg }}
                  >
                    <span className="material-symbols-outlined text-2xl" style={{ color: v.iconColor }}>{v.icon}</span>
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-widest block mb-2 opacity-75" style={{ color: v.text }}>
                    {v.subtitle}
                  </span>
                  <h3 className="font-headline font-black text-2xl mb-4" style={{ color: v.text }}>{v.title}</h3>
                  <p className="leading-relaxed font-medium text-sm" style={{ color: v.text, opacity: 0.88 }}>{v.desc}</p>
                </div>
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
              Línea de Tiempo Oficial
            </span>
            <h2 className="text-4xl sm:text-6xl font-headline font-black tracking-tighter text-white mb-4">
              Nuestra <em style={{ color: '#F0A17E' }}>Trayectoria Real.</em>
            </h2>
            <p className="text-xl font-medium" style={{ color: 'rgba(255,255,255,0.75)' }}>
              19 años construyendo salud cutánea sobre bases científicas comprobadas.
            </p>
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
                  className={`flex items-center gap-6 md:gap-10 ${index % 2 === 0 ? 'flex-col sm:flex-row' : 'flex-col sm:flex-row-reverse'}`}
                >
                  <div className="flex-1">
                    <div
                      className={`rounded-3xl p-6 md:p-8 transition-all w-full ${index % 2 === 0 ? 'sm:text-right text-left' : 'text-left'}`}
                      style={{ background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.2)' }}
                    >
                      <div className={`flex items-center gap-2 mb-3 ${index % 2 === 0 ? 'sm:justify-end justify-start' : 'justify-start'}`}>
                        <span
                          className="inline-block text-xs font-black uppercase tracking-[0.2em] px-4 py-1.5 rounded-full"
                          style={{ background: item.dot, color: '#1a1c1e' }}
                        >
                          {item.year}
                        </span>
                        <span className="text-[10px] uppercase tracking-wider font-extrabold text-white/60">
                          {item.badge}
                        </span>
                      </div>
                      <h4 className="text-white font-headline font-bold text-xl leading-snug mb-2">{item.title}</h4>
                      <p className="text-white/80 font-normal text-sm leading-relaxed">{item.desc}</p>
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
            Tu piel en manos de<br />
            <em style={{ color: '#F0A17E' }}>auténticos especialistas.</em>
          </h2>
          <p className="text-xl mb-12 font-medium max-w-xl mx-auto" style={{ color: 'rgba(255,255,255,0.85)' }}>
            Experimenta una dermatología basada en evidencia, criterio médico y calidez humana. La Dra. Leyva y su equipo te esperan.
          </p>
          <Link
            href="/reservar"
            className="inline-flex items-center gap-4 font-black text-xl px-14 py-6 rounded-full transition-all duration-300 hover:scale-105 group"
            style={{ background: '#F0A17E', color: '#5c3320', boxShadow: '0 10px 40px rgba(240,161,126,0.4)' }}
          >
            Agendar mi cita médica
            <span className="material-symbols-outlined text-2xl transition-transform group-hover:translate-x-2">arrow_forward</span>
          </Link>
        </motion.div>
      </section>

    </main>
  )
}
