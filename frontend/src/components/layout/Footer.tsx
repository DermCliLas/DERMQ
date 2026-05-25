import Link from 'next/link'

const COMPANY_LINKS = [
  { label: 'Nuestra Historia', href: '/nosotros' },
  { label: 'Cuerpo Médico', href: '/nosotros#equipo' },
  { label: 'Instalaciones', href: '/servicios#tecnologia' },
  { label: 'Sedes', href: '/contacto' },
]

const SERVICE_LINKS = [
  { label: 'Dermatología Clínica', href: '/servicios' },
  { label: 'Estética Avanzada', href: '/servicios#estetica' },
  { label: 'Cirugía Cutánea', href: '/servicios#cirugia' },
  { label: 'Láser & Cabina', href: '/servicios#laser' },
]

export default function Footer() {
  return (
    <footer className="relative z-20 bg-[#02696a] text-white pt-24 pb-12 font-body border-t-4 border-tertiary">
      <div className="max-w-7xl mx-auto px-6">
        {/* Top Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-20">
          {/* Col 1: Brand */}
          <div className="space-y-8">
            <div className="text-4xl font-black tracking-widest font-headline text-tertiary">DERMQ</div>
            <p className="text-white/70 text-sm leading-relaxed max-w-xs font-serif italic">
              Líderes en dermatología avanzada. Fusionamos rigor científico con una visión estética
              premium para el cuidado integral de tu piel.
            </p>
            <div className="flex gap-4 pt-4">
              {[
                { icon: 'facebook', label: 'Facebook' },
                { icon: 'photo_camera', label: 'Instagram' },
                { icon: 'share', label: 'Compartir' },
              ].map(social => (
                <a
                  key={social.icon}
                  href="#"
                  aria-label={social.label}
                  className="w-10 h-10 rounded-full bg-tertiary/10 border border-tertiary/30 hover:bg-tertiary/30 flex items-center justify-center transition-all hover:scale-110 text-tertiary"
                >
                  <span className="material-symbols-outlined text-lg">{social.icon}</span>
                </a>
              ))}
            </div>
          </div>

          {/* Col 2: Company */}
          <div className="space-y-8">
            <h4 className="font-headline font-bold text-2xl tracking-wide text-tertiary border-b border-tertiary/30 pb-4">La Clínica</h4>
            <nav className="flex flex-col gap-5">
              {COMPANY_LINKS.map(link => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-white/80 hover:text-tertiary transition-colors font-medium text-sm tracking-wider uppercase"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Col 3: Services */}
          <div className="space-y-8">
            <h4 className="font-headline font-bold text-2xl tracking-wide text-tertiary border-b border-tertiary/30 pb-4">Tratamientos</h4>
            <nav className="flex flex-col gap-5">
              {SERVICE_LINKS.map(link => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="text-white/80 hover:text-tertiary transition-colors font-medium text-sm tracking-wider uppercase"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Col 4: Contact */}
          <div className="space-y-8">
            <h4 className="font-headline font-bold text-2xl tracking-wide text-tertiary border-b border-tertiary/30 pb-4">Contáctanos</h4>
            <div className="flex flex-col gap-6">
              <div className="flex gap-4 items-start">
                <span className="material-symbols-outlined text-tertiary shrink-0">location_on</span>
                <p className="text-white/80 text-sm font-medium leading-relaxed font-serif">
                  Av. Camino Real 1234,
                  <br />
                  San Isidro, Lima.
                </p>
              </div>
              <div className="flex gap-4 items-center">
                <span className="material-symbols-outlined text-tertiary">call</span>
                <p className="text-white/80 text-sm font-medium font-serif">+51 1 234 5678</p>
              </div>
              <div className="flex gap-4 items-center">
                <span className="material-symbols-outlined text-tertiary">mail</span>
                <p className="text-white/80 text-sm font-medium font-serif">informes@dermq.pe</p>
              </div>
              <Link
                href="/contacto"
                className="mt-4 bg-tertiary text-primary-container font-headline font-bold py-3 px-8 rounded-sm text-sm tracking-widest uppercase hover:bg-white transition-colors w-fit text-center"
              >
                Escríbenos
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-12 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8">
            <p className="text-xs text-white/50 font-medium tracking-widest uppercase font-headline">
              © {new Date().getFullYear()} DERMQ Clínica Dermatológica.
            </p>
            <div className="flex gap-6">
              <a
                href="#"
                className="text-[10px] uppercase font-bold text-white/40 tracking-[0.15em] hover:text-tertiary transition-colors"
              >
                Aviso de Privacidad
              </a>
              <a
                href="#"
                className="text-[10px] uppercase font-bold text-white/40 tracking-[0.15em] hover:text-tertiary transition-colors"
              >
                Términos y Condiciones
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
