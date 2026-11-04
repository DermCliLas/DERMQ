'use client'

import React, { useRef, useState, MouseEvent } from 'react'
import { motion, useSpring, useMotionValue, useTransform } from 'framer-motion'

interface TiltCard3DProps {
  children: React.ReactNode
  className?: string
  spotlightColor?: string
  maxTilt?: number
}

export default function TiltCard3D({
  children,
  className = '',
  spotlightColor = 'rgba(114, 193, 193, 0.25)',
  maxTilt = 8,
}: TiltCard3DProps) {
  const cardRef = useRef<HTMLDivElement>(null)
  const [isHovered, setIsHovered] = useState(false)

  // Motion values for smooth 3D tilt
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  // Spring physics for natural elastic damping
  const springConfig = { damping: 20, stiffness: 200, mass: 0.5 }
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [maxTilt, -maxTilt]), springConfig)
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-maxTilt, maxTilt]), springConfig)
  const scale = useSpring(isHovered ? 1.02 : 1, springConfig)

  // Spotlight coordinates (percentage 0-100%)
  const [spotlightPos, setSpotlightPos] = useState({ x: 50, y: 50 })

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    const width = rect.width
    const height = rect.height
    
    // Normalized position from -0.5 to 0.5
    const normX = (e.clientX - rect.left) / width - 0.5
    const normY = (e.clientY - rect.top) / height - 0.5

    mouseX.set(normX)
    mouseY.set(normY)

    // Percentage for spotlight
    setSpotlightPos({
      x: ((e.clientX - rect.left) / width) * 100,
      y: ((e.clientY - rect.top) / height) * 100,
    })
  }

  const handleMouseEnter = () => {
    setIsHovered(true)
  }

  const handleMouseLeave = () => {
    setIsHovered(false)
    mouseX.set(0)
    mouseY.set(0)
  }

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        scale,
        transformStyle: 'preserve-3d',
      }}
      className={`relative will-change-transform ${className}`}
    >
      {/* 3D Content wrapper */}
      <div style={{ transform: 'translateZ(0px)' }} className="relative h-full w-full">
        {children}
      </div>

      {/* Dynamic Specular Spotlight Sheen */}
      <div
        className="pointer-events-none absolute inset-0 rounded-3xl transition-opacity duration-500 ease-out z-20"
        style={{
          opacity: isHovered ? 1 : 0,
          background: `radial-gradient(circle at ${spotlightPos.x}% ${spotlightPos.y}%, ${spotlightColor} 0%, rgba(255, 255, 255, 0.05) 35%, transparent 70%)`,
        }}
      />

      {/* Subtle Laser Border Highlight */}
      <div
        className="pointer-events-none absolute -inset-[1px] rounded-3xl transition-opacity duration-500 z-10"
        style={{
          opacity: isHovered ? 0.7 : 0,
          background: `radial-gradient(circle at ${spotlightPos.x}% ${spotlightPos.y}%, rgba(240, 161, 126, 0.6) 0%, transparent 60%)`,
        }}
      />
    </motion.div>
  )
}
