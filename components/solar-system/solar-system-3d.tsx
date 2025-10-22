"use client"

import { useState, useEffect } from "react"
import dynamic from "next/dynamic"
import type { Planet, Moon } from "@/lib/planets-data"

// Load the working solar system
const WorkingSolarSystem = dynamic(
  () => import("./working-solar-system").then(mod => ({ default: mod.WorkingSolarSystem })), 
  { 
    ssr: false,
    loading: () => (
      <div className="w-full h-screen bg-gradient-to-b from-slate-900 to-black flex items-center justify-center">
        <div className="text-white text-lg animate-pulse">Carregando Sistema Solar 3D...</div>
      </div>
    )
  }
)

interface SolarSystem3DProps {
  planets: Planet[]
  onPlanetSelect?: (planet: Planet | Moon | null) => void
  selectedPlanet?: Planet | Moon | null
}

export function SolarSystem3D({ planets, onPlanetSelect, selectedPlanet }: SolarSystem3DProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="w-full h-screen bg-gradient-to-b from-slate-900 to-black flex items-center justify-center">
        <div className="text-white text-lg animate-pulse">Inicializando Sistema Solar...</div>
      </div>
    )
  }

  return (
    <WorkingSolarSystem 
      planets={planets} 
      onPlanetSelect={onPlanetSelect} 
      selectedPlanet={selectedPlanet} 
    />
  )
}
