import HeroSection from '@/components/home/HeroSection'
import ServicesGrid from '@/components/home/ServicesGrid'
import PromiseSection from '@/components/home/PromiseSection'
import ShopBento from '@/components/home/ShopBento'
import IntegrationsBar from '@/components/home/IntegrationsBar'
import BookingFab from '@/components/ui/BookingFab'
import DynamicAtmosphere from '@/components/ui/DynamicAtmosphere'
import SectionWrapper from '@/components/ui/SectionWrapper'
import ElegantDivider from '@/components/ui/ElegantDivider'
import IntroLoader from '@/components/ui/IntroLoader'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'DERMQ — Clínica Dermatológica de Vanguardia',
  description:
    'Fusionamos precisión clínica y estética avanzada para revelar tu luminosidad natural. Especialistas en dermatología clínica, estética y cirugía cutánea en Lima, Perú.',
}

import LocationSection from '@/components/home/LocationSection'

export default function HomePage() {
  return (
    <main className="relative min-h-screen">
      <IntroLoader />
      <DynamicAtmosphere />
      
      <SectionWrapper sectionId="hero" bgTone="#02696a" accent1="#F0A17E" accent2="#ffffff">
        <HeroSection />
      </SectionWrapper>

      <SectionWrapper sectionId="services" bgTone="#02696a" accent1="#F0A17E" accent2="#72c1c1">
        <ServicesGrid />
      </SectionWrapper>

      <SectionWrapper sectionId="promise" bgTone="#72C1C1" accent1="#02696a" accent2="#ffffff">
        <PromiseSection />
      </SectionWrapper>

      <ElegantDivider fromBg="#fafafa" toBg="#faf8f5" />

      <SectionWrapper sectionId="shop" bgTone="#f8fafa" accent1="#72c1c1" accent2="#02696a">
        <ShopBento />
      </SectionWrapper>

      <IntegrationsBar />
      <LocationSection />
      <BookingFab />
    </main>
  )
}
