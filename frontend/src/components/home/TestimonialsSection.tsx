import Image from 'next/image'

const TRUST_ITEMS = [
  {
    icon: 'verified',
    title: 'Cuerpo Médico Certificado',
    description: 'Especialistas egresados de las mejores instituciones, en constante actualización clínica.',
    color: 'bg-primary-fixed-dim text-primary',
    hoverRotate: 'group-hover:rotate-12 group-hover:scale-125',
  },
  {
    icon: 'precision_manufacturing',
    title: 'Tecnología de Punta',
    description: 'Contamos con la última generación de equipos láser y diagnóstico por imagen.',
    color: 'bg-secondary-fixed-dim text-secondary',
    hoverRotate: 'group-hover:rotate-6',
  },
  {
    icon: 'favorite',
    title: 'Atención Humana',
    description: 'Protocolos personalizados. No tratamos pieles, tratamos personas.',
    color: 'bg-tertiary-fixed-dim text-tertiary',
    hoverRotate: 'group-hover:rotate-6',
  },
]

export default function TestimonialsSection() {
  return (
    <section className="py-32 bg-[#F2F4F4] overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-12 gap-12 items-center">
          {/* Left: Image + Testimonial */}
          <div className="col-span-12 lg:col-span-5 relative">
            <div className="aspect-square bg-slate-100 rounded-[4rem] overflow-hidden">
              <Image
                src="/imagenTestimonios.jpg"
                alt="Paciente satisfecha con tratamiento DERMQ"
                width={600}
                height={600}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-8 -right-8 bg-[#ffdbcd]/30 backdrop-blur-md border border-white/40 text-on-tertiary-fixed p-10 rounded-[3rem] shadow-2xl max-w-sm">
              <span className="material-symbols-outlined text-5xl mb-4">format_quote</span>
              <p className="text-xl font-medium leading-relaxed italic">
                &ldquo;Mi piel nunca se sintió tan saludable. La precisión en cada paso del
                tratamiento fue lo que marcó la diferencia.&rdquo;
              </p>
              <div className="mt-6">
                <p className="font-bold">Elena Ramírez</p>
                <p className="text-xs opacity-70 uppercase tracking-widest font-bold">
                  Paciente de Estética
                </p>
              </div>
            </div>
          </div>

          {/* Right: Trust Points */}
          <div className="col-span-12 lg:col-span-6 lg:col-start-8 space-y-12">
            <h2 className="text-5xl font-headline font-extrabold tracking-tight leading-tight">
              Por qué confiar <br />
              <span className="text-primary italic">en nosotros.</span>
            </h2>
            <div className="space-y-10">
              {TRUST_ITEMS.map(item => (
                <div key={item.icon} className="flex gap-8 group">
                  <div
                    className={`w-16 h-16 rounded-2xl ${item.color} flex items-center justify-center shrink-0 ${item.hoverRotate} transition-all duration-500 shadow-sm group-hover:shadow-lg`}
                  >
                    <span className="material-symbols-outlined text-3xl">{item.icon}</span>
                  </div>
                  <div>
                    <h4 className="text-xl font-bold mb-2">{item.title}</h4>
                    <p className="text-on-surface-variant leading-relaxed">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
