import OrganicDivider from '@/components/ui/OrganicDivider'

export default function PromiseSection() {
  return (
    <section className="bg-transparent py-40 text-[#002020] overflow-hidden relative">
      <OrganicDivider type="slope" fill="#f8fafa" flip />
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="max-w-4xl">
          <span className="uppercase tracking-[0.3em] font-bold text-xs opacity-70 mb-6 block">
            Nuestra Promesa
          </span>
          <h2 className="text-5xl md:text-7xl font-headline font-extrabold leading-tight mb-12">
            &ldquo;Elevamos el estándar de la salud cutánea a través de la empatía y la
            innovación.&rdquo;
          </h2>
          <div className="flex items-center gap-12">
            <div className="flex flex-col">
              <span className="text-6xl font-headline font-extrabold">15+</span>
              <span className="text-sm uppercase tracking-widest font-bold opacity-60 mt-2">
                Años
              </span>
            </div>
            <div className="w-px h-16 bg-black/20" />
            <div className="flex flex-col">
              <span className="text-6xl font-headline font-extrabold">10k</span>
              <span className="text-sm uppercase tracking-widest font-bold opacity-60 mt-2">
                Pacientes
              </span>
            </div>
            <div className="w-px h-16 bg-black/20" />
            <div className="flex flex-col">
              <span className="text-6xl font-headline font-extrabold">98%</span>
              <span className="text-sm uppercase tracking-widest font-bold opacity-60 mt-2">
                Satisfacción
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
