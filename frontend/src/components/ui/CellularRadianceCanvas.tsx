'use client'

import React, { useEffect, useRef } from 'react'

interface CellularRadianceCanvasProps {
  className?: string
  interactive?: boolean
}

export default function CellularRadianceCanvas({
  className = '',
  interactive = true,
}: CellularRadianceCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d', { alpha: true })
    if (!ctx) return

    let animationFrameId: number
    let isVisible = true
    let width = (canvas.width = canvas.offsetWidth * (window.devicePixelRatio || 1))
    let height = (canvas.height = canvas.offsetHeight * (window.devicePixelRatio || 1))

    // Normalized mouse / target coordinates
    let mouse = {
      x: width * 0.5,
      y: height * 0.45,
      targetX: width * 0.5,
      targetY: height * 0.45,
    }

    // Handle resize
    const handleResize = () => {
      if (!canvas) return
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      width = canvas.width = canvas.offsetWidth * dpr
      height = canvas.height = canvas.offsetHeight * dpr
      mouse.targetX = width * 0.5
      mouse.targetY = height * 0.45
    }

    window.addEventListener('resize', handleResize)

    // Handle mouse move
    const handleMouseMove = (e: MouseEvent) => {
      if (!interactive || !canvas) return
      const rect = canvas.getBoundingClientRect()
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      mouse.targetX = (e.clientX - rect.left) * dpr
      mouse.targetY = (e.clientY - rect.top) * dpr
    }

    if (interactive) {
      window.addEventListener('mousemove', handleMouseMove, { passive: true })
    }

    // Particles system (cellular vitality & laser light quanta)
    const particleCount = 42
    const particles = Array.from({ length: particleCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      baseRadius: 1 + Math.random() * 2.5,
      radius: 1 + Math.random() * 2.5,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      alpha: 0.2 + Math.random() * 0.6,
      color: Math.random() > 0.4 ? 'rgba(114, 193, 193,' : 'rgba(240, 161, 126,',
      pulseSpeed: 0.02 + Math.random() * 0.03,
      angle: Math.random() * Math.PI * 2,
    }))

    // Time counter
    let t = 0

    // Intersection Observer to stop rendering when not visible
    const observer = new IntersectionObserver(([entry]) => {
      isVisible = entry.isIntersecting
    })
    observer.observe(canvas)

    // Render loop
    const render = () => {
      if (!isVisible) {
        animationFrameId = requestAnimationFrame(render)
        return
      }

      t += 0.015

      // Smooth mouse follow with inertia
      mouse.x += (mouse.targetX - mouse.x) * 0.05
      mouse.y += (mouse.targetY - mouse.y) * 0.05

      ctx.clearRect(0, 0, width, height)

      // ── 1. AMBIENT CELLULAR ORB (3D ORGANIC REVITALIZATION SPHERE) ──
      const orbRadius = Math.min(width, height) * 0.26
      const orbX = mouse.x
      const orbY = mouse.y

      // Multi-layer volumetric gradient
      const outerGlow = ctx.createRadialGradient(
        orbX,
        orbY,
        orbRadius * 0.2,
        orbX,
        orbY,
        orbRadius * 1.8,
      )
      outerGlow.addColorStop(0, 'rgba(114, 193, 193, 0.45)') // Turquesa DERMQ
      outerGlow.addColorStop(0.35, 'rgba(2, 105, 106, 0.35)') // Esmeralda clínico
      outerGlow.addColorStop(0.7, 'rgba(240, 161, 126, 0.18)') // Oro rosa colágeno
      outerGlow.addColorStop(1, 'rgba(0, 0, 0, 0)')

      ctx.save()
      ctx.fillStyle = outerGlow
      ctx.beginPath()
      ctx.arc(orbX, orbY, orbRadius * 1.8, 0, Math.PI * 2)
      ctx.fill()
      ctx.restore()

      // Organic pulsating membrane (morphing 3D shape)
      ctx.save()
      ctx.beginPath()
      const segments = 60
      for (let i = 0; i <= segments; i++) {
        const theta = (i / segments) * Math.PI * 2
        // Organic sinusoidal harmonic distortion
        const distortion =
          Math.sin(theta * 3 + t) * 6 +
          Math.cos(theta * 5 - t * 0.8) * 4 +
          Math.sin(theta * 2 + t * 1.5) * 3
        const r = orbRadius + distortion
        const px = orbX + Math.cos(theta) * r
        const py = orbY + Math.sin(theta) * r
        if (i === 0) ctx.moveTo(px, py)
        else ctx.lineTo(px, py)
      }
      ctx.closePath()

      // Inner membrane gradient with specular highlight
      const membraneGrad = ctx.createRadialGradient(
        orbX - orbRadius * 0.35,
        orbY - orbRadius * 0.35,
        orbRadius * 0.05,
        orbX,
        orbY,
        orbRadius,
      )
      membraneGrad.addColorStop(0, 'rgba(255, 255, 255, 0.65)')
      membraneGrad.addColorStop(0.25, 'rgba(114, 193, 193, 0.5)')
      membraneGrad.addColorStop(0.7, 'rgba(2, 105, 106, 0.4)')
      membraneGrad.addColorStop(0.95, 'rgba(240, 161, 126, 0.55)')
      membraneGrad.addColorStop(1, 'rgba(114, 193, 193, 0.15)')

      ctx.fillStyle = membraneGrad
      ctx.shadowColor = 'rgba(114, 193, 193, 0.5)'
      ctx.shadowBlur = 30
      ctx.fill()

      // Subtle specular rim
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)'
      ctx.lineWidth = 1.5
      ctx.stroke()
      ctx.restore()

      // ── 2. FLOATING PARTICLES (COLLAGEN & LASER QUANTA) ──
      for (let p of particles) {
        p.x += p.vx
        p.y += p.vy
        p.angle += p.pulseSpeed
        p.radius = p.baseRadius + Math.sin(p.angle) * 0.8

        // Wrap around screen boundaries
        if (p.x < 0) p.x = width
        if (p.x > width) p.x = 0
        if (p.y < 0) p.y = height
        if (p.y > height) p.y = 0

        // Attraction towards orb center when nearby
        const dx = orbX - p.x
        const dy = orbY - p.y
        const dist = Math.sqrt(dx * dx + dy * dy)
        if (dist < orbRadius * 1.6 && dist > 10) {
          p.x += (dx / dist) * 0.35
          p.y += (dy / dist) * 0.35
        }

        ctx.save()
        ctx.beginPath()
        ctx.arc(p.x, p.y, Math.max(0.5, p.radius), 0, Math.PI * 2)
        ctx.fillStyle = `${p.color} ${p.alpha})`
        ctx.shadowColor = p.color === 'rgba(114, 193, 193,' ? 'rgba(114, 193, 193, 0.8)' : 'rgba(240, 161, 126, 0.8)'
        ctx.shadowBlur = 8
        ctx.fill()
        ctx.restore()
      }

      animationFrameId = requestAnimationFrame(render)
    }

    render()

    return () => {
      cancelAnimationFrame(animationFrameId)
      window.removeEventListener('resize', handleResize)
      if (interactive) window.removeEventListener('mousemove', handleMouseMove)
      observer.disconnect()
    }
  }, [interactive])

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 w-full h-full pointer-events-none transition-opacity duration-1000 ${className}`}
      style={{ mixBlendMode: 'screen' }}
    />
  )
}
