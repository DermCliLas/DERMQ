'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const STEPS = [
  { number: '01', label: 'Servicio', href: '/reservar' },
  { number: '02', label: 'Especialista', href: '/reservar/especialista' },
  { number: '03', label: 'Horario', href: '/reservar/horario' },
  { number: '04', label: 'Confirmar', href: '/reservar/confirmar' },
]

interface BookingStepperProps {
  currentStep: number
}

export default function BookingStepper({ currentStep }: BookingStepperProps) {
  const pathname = usePathname()

  return (
    <div className="grid grid-cols-4 gap-2 md:gap-8 mb-12 md:mb-20 max-w-4xl mx-auto md:mx-0 relative">
      <div className="absolute bottom-0 left-0 w-full h-[3px] bg-slate-100" />

      {STEPS.map((step, index) => {
        const stepNumber = index + 1
        const isActive = stepNumber === currentStep
        const isCompleted = stepNumber < currentStep
        const isClickable = isCompleted || isActive

        const content = (
          <div
            className={`pb-4 relative z-10 border-b-[3px] transition-all duration-300 ${
              isActive
                ? 'border-primary'
                : isCompleted
                ? 'border-primary/40'
                : 'border-transparent hover:border-slate-300'
            } ${isClickable ? 'cursor-pointer' : 'cursor-default'}`}
          >
            <span
              className={`hidden sm:block text-[10px] font-black uppercase tracking-[0.2em] mb-2 transition-colors ${
                isActive ? 'text-primary' : isCompleted ? 'text-primary/70' : 'text-slate-400'
              }`}
            >
              Paso {step.number}
            </span>
            <span
              className={`font-headline font-extrabold text-sm md:text-lg transition-colors ${
                isActive ? 'text-primary' : isCompleted ? 'text-slate-600' : 'text-slate-400'
              }`}
            >
              {isCompleted && (
                <span className="material-symbols-outlined text-base mr-1 align-middle text-primary/70">
                  check_small
                </span>
              )}
              {step.label}
            </span>
          </div>
        )

        return isClickable ? (
          <Link key={step.href} href={step.href}>
            {content}
          </Link>
        ) : (
          <div key={step.href}>{content}</div>
        )
      })}
    </div>
  )
}
