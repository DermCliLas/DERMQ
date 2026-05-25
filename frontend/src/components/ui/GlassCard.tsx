import { HTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

interface GlassCardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'strong' | 'white'
  lift?: boolean
}

export default function GlassCard({
  children,
  className,
  variant = 'default',
  lift = false,
  ...props
}: GlassCardProps) {
  const variantClass = {
    default: 'glass-card',
    strong: 'glass-card-white',
    white: 'bg-white/90 backdrop-blur-sm border border-slate-100',
  }[variant]

  return (
    <div
      className={cn(variantClass, lift && 'card-lift', className)}
      {...props}
    >
      {children}
    </div>
  )
}
