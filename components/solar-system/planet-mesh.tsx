"use client"

import { useRef, useState } from "react"
import type { Planet } from "@/lib/api"
import type * as THREE from "three"

interface PlanetMeshProps {
  planet: Planet
  orbitalRadius: number
  scale: number
  speed: number
  onClick?: () => void
  onPointerOver?: () => void
  onPointerOut?: () => void
}

export function PlanetMesh({
  planet,
  orbitalRadius,
  scale,
  speed,
  onClick,
  onPointerOver,
  onPointerOut,
}: PlanetMeshProps) {
  const meshRef = useRef<THREE.Mesh>(null!)
  const groupRef = useRef<THREE.Group>(null!)
  const [time, setTime] = useState(0)

  // Dynamic import to prevent SSR issues
  if (typeof window !== "undefined") {
    const { useFrame } = require("@react-three/fiber")
    
    useFrame((state: any, delta: number) => {
      if (!groupRef.current || !meshRef.current) return

      // Update orbital position
      setTime((prev) => prev + delta * speed)
      groupRef.current.position.x = Math.cos(time) * orbitalRadius
      groupRef.current.position.z = Math.sin(time) * orbitalRadius

      // Planet rotation
      meshRef.current.rotation.y += delta * 0.5
    })
  }

  // Get planet color based on its properties or use a default
  const getPlanetColor = (planet: Planet): string => {
    if (planet.color) return planet.color

    // Default colors based on planet names
    const colorMap: Record<string, string> = {
      mercury: "#8C7853",
      venus: "#FFC649",
      earth: "#6B93D6",
      mars: "#CD5C5C",
      jupiter: "#D8CA9D",
      saturn: "#FAD5A5",
      uranus: "#4FD0E7",
      neptune: "#4B70DD",
    }

    return colorMap[planet.name.toLowerCase()] || "#888888"
  }

  return (
    <group ref={groupRef}>
      <mesh
        ref={meshRef}
        position={[0, 0, 0]}
        scale={scale}
        onClick={(e) => {
          e.stopPropagation()
          onClick?.()
        }}
        onPointerOver={(e) => {
          e.stopPropagation()
          onPointerOver?.()
          if (typeof document !== "undefined") {
            document.body.style.cursor = "pointer"
          }
        }}
        onPointerOut={(e) => {
          e.stopPropagation()
          onPointerOut?.()
          if (typeof document !== "undefined") {
            document.body.style.cursor = "auto"
          }
        }}
      >
        <sphereGeometry args={[1, 32, 32]} />
        <meshStandardMaterial color={getPlanetColor(planet)} />
      </mesh>
    </group>
  )
}
