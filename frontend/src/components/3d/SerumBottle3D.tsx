'use client'

import React, { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

interface SerumBottle3DProps {
  autoRotate?: boolean
  isHovered?: boolean
}

export default function SerumBottle3D({
  autoRotate = true,
  isHovered = false,
}: SerumBottle3DProps) {
  const groupRef = useRef<THREE.Group>(null)
  const liquidRef = useRef<THREE.Mesh>(null)

  // ── Generar Textura de la Etiqueta Médica en Alta Resolución ──
  const labelTexture = useMemo(() => {
    if (typeof document === 'undefined') return null

    const canvas = document.createElement('canvas')
    canvas.width = 1024
    canvas.height = 1024
    const ctx = canvas.getContext('2d')
    if (!ctx) return null

    // Fondo marfil mate clínico de lujo
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, 0, 1024, 1024)

    // Marco y bordes de diseño editorial
    ctx.strokeStyle = '#02696a'
    ctx.lineWidth = 4
    ctx.strokeRect(40, 40, 944, 944)

    ctx.strokeStyle = '#F0A17E'
    ctx.lineWidth = 2
    ctx.strokeRect(55, 55, 914, 914)

    // Logotipo y Tipografía DERMQ
    ctx.fillStyle = '#02696a'
    ctx.font = 'bold 64px "Montserrat", sans-serif'
    ctx.textAlign = 'center'
    ctx.fillText('DERMQ', 512, 180)

    ctx.fillStyle = '#72c1c1'
    ctx.font = 'bold 22px "Montserrat", sans-serif'
    ctx.letterSpacing = '8px'
    ctx.fillText('CLÍNICA & ESTÉTICA DERMATOLÓGICA', 512, 230)

    // Línea divisoria oro rosa
    ctx.fillStyle = '#F0A17E'
    ctx.fillRect(412, 260, 200, 3)

    // Nombre del Producto Cosmecéutico
    ctx.fillStyle = '#1a1c1e'
    ctx.font = 'italic 52px "Playfair Display", serif'
    ctx.fillText('Sérum Celular', 512, 360)
    ctx.fillText('Regenerador', 512, 420)

    // Ingredientes activos clínicos
    ctx.fillStyle = '#02696a'
    ctx.font = 'bold 26px "Montserrat", sans-serif'
    ctx.fillText('ÁCIDO HIALURÓNICO + LÁSER PEPTIDES', 512, 510)

    ctx.fillStyle = '#64748b'
    ctx.font = '300 24px "Montserrat", sans-serif'
    ctx.fillText('Fórmula Magistral de Grado Médico', 512, 570)
    ctx.fillText('Concentración Activa de Máxima Eficacia', 512, 610)

    // Especificaciones
    ctx.fillStyle = '#02696a'
    ctx.font = 'bold 28px "Montserrat", sans-serif'
    ctx.fillText('30 ml  •  1.0 fl. oz.', 512, 730)

    ctx.fillStyle = '#94a3b8'
    ctx.font = '20px "Montserrat", sans-serif'
    ctx.fillText('Dra. Marcela Leyva  •  Lima, Perú', 512, 820)
    ctx.fillText('Dermatología Clínica y Láser S.A.C.', 512, 860)

    const texture = new THREE.CanvasTexture(canvas)
    texture.wrapS = THREE.RepeatWrapping
    texture.wrapT = THREE.ClampToEdgeWrapping
    texture.repeat.set(1, 1)
    return texture
  }, [])

  // ── Animación en tiempo real (60 FPS) ──
  useFrame((state, delta) => {
    if (!groupRef.current) return

    // Oscilación vertical suave (bobbing natural)
    const t = state.clock.getElapsedTime()
    groupRef.current.position.y = Math.sin(t * 1.5) * 0.08

    // Rotación automática suave cuando no se está arrastrando agresivamente
    if (autoRotate) {
      const rotSpeed = isHovered ? 0.35 : 0.6
      groupRef.current.rotation.y += delta * rotSpeed
    }

    // Micro-animación del fluido interior
    if (liquidRef.current) {
      liquidRef.current.rotation.y = -groupRef.current.rotation.y * 0.3
    }
  })

  // ── Silueta Botella de Vidrio mediante LatheGeometry ──
  const bottleGeometry = useMemo(() => {
    const points: THREE.Vector2[] = []
    // Base plana
    points.push(new THREE.Vector2(0, 0))
    points.push(new THREE.Vector2(0.95, 0))
    // Esquina redondeada de la base
    points.push(new THREE.Vector2(1.08, 0.1))
    // Cuerpo cilíndrico de vidrio
    points.push(new THREE.Vector2(1.12, 0.4))
    points.push(new THREE.Vector2(1.12, 2.3))
    // Hombro curvado de la botella
    points.push(new THREE.Vector2(1.05, 2.6))
    points.push(new THREE.Vector2(0.78, 2.85))
    // Cuello
    points.push(new THREE.Vector2(0.58, 3.0))
    points.push(new THREE.Vector2(0.58, 3.4))
    // Labio superior del frasco
    points.push(new THREE.Vector2(0.64, 3.45))
    points.push(new THREE.Vector2(0.64, 3.55))
    points.push(new THREE.Vector2(0.48, 3.55))
    // Retorno hacia el interior (grosor de vidrio realista)
    points.push(new THREE.Vector2(0.48, 3.0))
    points.push(new THREE.Vector2(0.72, 2.8))
    points.push(new THREE.Vector2(0.96, 2.3))
    points.push(new THREE.Vector2(0.96, 0.2))
    points.push(new THREE.Vector2(0, 0.2))

    return new THREE.LatheGeometry(points, 64)
  }, [])

  return (
    <group ref={groupRef} position={[0, -1.6, 0]}>
      {/* ── 1. FRASCO DE VIDRIO TRASLÚCIDO CON REFRACCIÓN FÍSICA (PBR) ── */}
      <mesh geometry={bottleGeometry} castShadow receiveShadow>
        <meshPhysicalMaterial
          transmission={0.92} // 92% paso de luz realista
          roughness={0.06}
          metalness={0.02}
          ior={1.52} // Índice de refracción oficial del vidrio
          thickness={0.5} // Grosor volumétrico para cálculos de luz
          specularIntensity={1.0}
          specularColor={new THREE.Color('#ffffff')}
          color={new THREE.Color('#f0fdfa')}
          transparent
          opacity={0.97}
        />
      </mesh>

      {/* ── 2. LÍQUIDO DEL SÉRUM DERMATOLÓGICO INTERIOR ── */}
      <mesh ref={liquidRef} position={[0, 1.25, 0]}>
        <cylinderGeometry args={[0.93, 0.93, 2.05, 48]} />
        <meshPhysicalMaterial
          color={new THREE.Color('#f0a17e')} // Tono cálido colágeno / néctar vitamínico
          emissive={new THREE.Color('#72c1c1')}
          emissiveIntensity={0.08}
          transmission={0.82}
          roughness={0.12}
          ior={1.34} // IOR de suero acuoso/lipídico
          transparent
          opacity={0.94}
        />
      </mesh>

      {/* ── 3. PIPETA INTERNA DE VIDRIO TRANSPARENTE ── */}
      <mesh position={[0, 2.0, 0]}>
        <cylinderGeometry args={[0.07, 0.07, 2.8, 24]} />
        <meshPhysicalMaterial
          transmission={0.95}
          roughness={0.05}
          ior={1.48}
          color={new THREE.Color('#ffffff')}
          transparent
          opacity={0.9}
        />
      </mesh>

      {/* ── 4. ETIQUETA CLÍNICA IMPRESA ALREDEDOR DEL VIDRIO ── */}
      {labelTexture && (
        <mesh position={[0, 1.35, 0]}>
          <cylinderGeometry
            args={[1.125, 1.125, 1.5, 64, 1, true, -Math.PI * 0.75, Math.PI * 1.5]}
          />
          <meshStandardMaterial
            map={labelTexture}
            roughness={0.4}
            metalness={0.05}
            transparent={false}
            side={THREE.DoubleSide}
          />
        </mesh>
      )}

      {/* ── 5. CUELLO Y ANILLO METÁLICO DEL CUENTAGOTAS (TITANIO ESMERALDA / ORO) ── */}
      <mesh position={[0, 3.48, 0]} castShadow>
        <cylinderGeometry args={[0.62, 0.62, 0.45, 48]} />
        <meshStandardMaterial
          color={new THREE.Color('#02696a')}
          metalness={0.88}
          roughness={0.25}
        />
      </mesh>

      {/* Anillo de acento de oro rosa metálico */}
      <mesh position={[0, 3.73, 0]} castShadow>
        <cylinderGeometry args={[0.63, 0.63, 0.08, 48]} />
        <meshStandardMaterial
          color={new THREE.Color('#f0a17e')}
          metalness={0.95}
          roughness={0.15}
        />
      </mesh>

      {/* ── 6. BULBO DE SILICONA QUIRÚRGICA DEL CUENTAGOTAS ── */}
      <mesh position={[0, 4.25, 0]} castShadow>
        <sphereGeometry args={[0.48, 36, 24]} />
        <meshStandardMaterial
          color={new THREE.Color('#1a1c1e')} // Acabado negro mate de alta cosmecéutica
          roughness={0.85}
          metalness={0.05}
        />
      </mesh>

      {/* ── 7. PEDESTAL CIRCULAR DE SOMBRA Y REFLEJO CONTACTO ── */}
      <mesh position={[0, -0.05, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <circleGeometry args={[2.2, 48]} />
        <meshBasicMaterial
          color={new THREE.Color('#014d4e')}
          transparent
          opacity={0.12}
        />
      </mesh>
    </group>
  )
}
