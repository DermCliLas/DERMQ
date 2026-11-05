'use client'

import React, { Suspense, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, ContactShadows, Float } from '@react-three/drei'
import SerumBottle3D from './SerumBottle3D'

interface SerumBottleCanvasProps {
  className?: string
}

export default function SerumBottleCanvas({
  className = '',
}: SerumBottleCanvasProps) {
  const [isInteracting, setIsInteracting] = useState(false)
  const [isHovered, setIsHovered] = useState(false)

  return (
    <div
      className={`relative w-full h-full select-none cursor-grab active:cursor-grabbing ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false)
        setIsInteracting(false)
      }}
      onPointerDown={() => setIsInteracting(true)}
      onPointerUp={() => setIsInteracting(false)}
    >
      <Canvas
        shadows
        camera={{ position: [0, 1.2, 5.8], fov: 42 }}
        dpr={[1, 2]} // Optimizado para pantallas Retina sin sobrecalentar GPU
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
        }}
        className="w-full h-full"
      >
        {/* Iluminación de Estudio Dermatológico de Vanguardia */}
        <ambientLight intensity={1.2} />
        <directionalLight
          position={[5, 8, 5]}
          intensity={2.2}
          castShadow
          shadow-mapSize={[1024, 1024]}
          shadow-bias={-0.0001}
        />
        {/* Luz de relleno esmeralda clínica */}
        <pointLight position={[-6, 3, -4]} intensity={1.6} color="#72c1c1" />
        {/* Luz de contorno cálida (resalta el líquido interior y el vidrio) */}
        <spotLight
          position={[0, 6, -5]}
          intensity={3.0}
          color="#f0a17e"
          angle={0.6}
          penumbra={0.8}
        />

        <Suspense fallback={null}>
          <Float
            speed={isInteracting ? 0 : 2}
            rotationIntensity={isInteracting ? 0 : 0.4}
            floatIntensity={isInteracting ? 0 : 0.6}
          >
            <SerumBottle3D
              autoRotate={!isInteracting}
              isHovered={isHovered}
            />
          </Float>

          {/* Sombra de contacto suave realista en el pedestal */}
          <ContactShadows
            position={[0, -1.65, 0]}
            opacity={0.65}
            scale={5}
            blur={2.4}
            far={4}
            color="#014d4e"
          />

          {/* Controles de Órbita 360° con Físicas de Inercia */}
          <OrbitControls
            enableZoom={false}
            enablePan={false}
            minPolarAngle={Math.PI / 3} // Evita ver debajo de la base
            maxPolarAngle={Math.PI / 1.7} // Evita ángulos cenitales forzados
            dampingFactor={0.05}
            rotateSpeed={0.8}
          />
        </Suspense>
      </Canvas>

      {/* Badge Interactivo Flotante */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 pointer-events-none px-4 py-1.5 rounded-full bg-white/80 backdrop-blur-md border border-[#02696a]/20 shadow-md text-[#02696a] text-[10px] font-headline font-black uppercase tracking-widest flex items-center gap-1.5 transition-opacity duration-300">
        <span className="material-symbols-outlined text-xs animate-spin-slow">
          360
        </span>
        Arrastra para rotar en 3D
      </div>
    </div>
  )
}
