import Image from 'next/image'
import Link from 'next/link'
import OrganicDivider from '@/components/ui/OrganicDivider'

export default function ExpertiseSection() {
  return (
    <section className="py-32 bg-transparent relative z-10 overflow-hidden">
      <OrganicDivider type="slope" fill="#f8fafa" />
      <OrganicDivider type="slope" fill="#72C1C1" flip />
      <div className="max-w-7xl mx-auto px-6 relative">
        <div className="flex flex-col lg:flex-row relative">
          {/* Doctor Image */}
          <div className="w-full lg:w-[65%] h-[500px] lg:h-[700px] rounded-4xl overflow-hidden relative">
            <Image
              src="/leyva.png"
              alt="Especialista DERMQ"
              fill
              className="object-cover hover:scale-105 transition-all duration-700"
            />
          </div>

          {/* Floating White Card */}
          <div className="w-full lg:w-[45%] lg:absolute lg:right-0 lg:top-1/2 lg:-translate-y-1/2 bg-[#f8fafa] rounded-4xl p-10 md:p-14 shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-white mt-[-4rem] lg:mt-0 z-10 colored-shadow-hover card-lift cursor-default">
            <h2 className="text-4xl md:text-5xl font-headline font-extrabold text-[#1a1c1e] leading-[1.1] mb-8 tracking-tight">
              The Expertise
              <br />
              Behind the Glow.
            </h2>

            <div className="space-y-6 text-[#52525b] font-medium leading-relaxed mb-10 text-lg">
              <p>
                Founded by world-renowned dermatologists, DERMQ bridges the gap between high-level
                laboratory research and luxury skincare experiences.
              </p>
              <p>
                Every consultation is a journey through your skin&apos;s molecular needs, utilizing
                AI-driven analysis and proprietary laser technology.
              </p>
            </div>

            <hr className="border-[#e4e4e7] mb-8" />

            <div className="flex gap-12">
              <div>
                <span className="block text-3xl font-black text-[#02696a] font-headline mb-1">
                  98%
                </span>
                <span className="text-[10px] uppercase font-extrabold tracking-widest text-[#71717a] block">
                  Patient Satisfaction
                </span>
              </div>
              <div>
                <span className="block text-3xl font-black text-[#02696a] font-headline mb-1">
                  40k
                </span>
                <span className="text-[10px] uppercase font-extrabold tracking-widest text-[#71717a] block">
                  Active Treatments
                </span>
              </div>
            </div>

            <div className="mt-10">
              <Link
                href="/nosotros"
                className="inline-flex items-center gap-2 font-bold text-[#02696a] hover:gap-4 transition-all"
              >
                Conoce nuestro equipo
                <span className="material-symbols-outlined">arrow_forward</span>
              </Link>
            </div>
          </div>

          {/* Green Floating Badge */}
          <div className="absolute bottom-[-2rem] lg:bottom-12 left-6 lg:left-[55%] lg:-translate-x-1/2 bg-[#005c5c] text-white p-8 rounded-2xl shadow-xl z-20 w-56 transition-all duration-500 hover:-translate-y-4 hover:rotate-3 hover:shadow-2xl cursor-pointer">
            <span className="text-4xl font-black font-headline block mb-2">15+</span>
            <span className="text-[10px] font-extrabold uppercase tracking-widest leading-snug block text-teal-50">
              Years of Clinical
              <br />
              Research
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}
