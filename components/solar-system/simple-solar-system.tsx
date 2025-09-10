"use client"

import { Suspense, useRef, useState, useEffect } from "react"
import type { Planet } from "@/lib/api"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { X, Info } from "lucide-react"

interface SolarSystemProps {
  planets: Planet[]
  onPlanetSelect?: (planet: Planet | null) => void
  selectedPlanet?: Planet | null
}

// Simple planet component without Three.js initially
function PlanetOrb({ 
  planet, 
  size, 
  distance, 
  onClick 
}: { 
  planet: Planet
  size: number
  distance: number
  onClick: () => void
}) {
  const [rotation, setRotation] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setRotation(prev => prev + 0.5)
    }, 50)
    return () => clearInterval(interval)
  }, [])

  return (
    <div
      className="absolute rounded-full cursor-pointer transition-all hover:scale-110 hover:brightness-125"
      style={{
        width: `${size}px`,
        height: `${size}px`,
        backgroundColor: planet.color || "#888",
        left: `${distance}px`,
        top: "50%",
        transform: `translateY(-50%) rotate(${rotation}deg)`,
        transformOrigin: `-${distance}px center`,
        boxShadow: `0 0 ${size/2}px ${planet.color || "#888"}40`
      }}
      onClick={onClick}
      title={planet.portuguese_name}
    />
  )
}

function PlanetInfo({ planet, onClose }: { planet: Planet; onClose: () => void }) {
  return (
    <Card className="absolute top-4 right-4 w-96 bg-background/95 backdrop-blur-sm border-primary/20 shadow-2xl z-10">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
        <div>
          <CardTitle className="text-xl flex items-center gap-2">
            <div className="w-4 h-4 rounded-full" style={{ backgroundColor: planet.color }} />
            {planet.portuguese_name}
          </CardTitle>
          <Badge variant="secondary" className="mt-1">
            {planet.name}
          </Badge>
        </div>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="space-y-1">
            <span className="text-muted-foreground text-xs">RAIO</span>
            <p className="font-medium">{planet.radius.toLocaleString()} km</p>
          </div>
          <div className="space-y-1">
            <span className="text-muted-foreground text-xs">MASSA</span>
            <p className="font-medium">{(planet.mass / 1e24).toFixed(2)} × 10²⁴ kg</p>
          </div>
          <div className="space-y-1">
            <span className="text-muted-foreground text-xs">GRAVIDADE</span>
            <p className="font-medium">{planet.gravity} m/s²</p>
          </div>
          <div className="space-y-1">
            <span className="text-muted-foreground text-xs">TEMPERATURA</span>
            <p className="font-medium">{planet.average_temperature}°C</p>
          </div>
        </div>
        <div className="pt-2 border-t">
          <p className="text-sm text-muted-foreground leading-relaxed">{planet.description}</p>
        </div>
      </CardContent>
    </Card>
  )
}

export function SimpleSolarSystem({ planets, onPlanetSelect, selectedPlanet }: SolarSystemProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 })

  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        setContainerSize({
          width: containerRef.current.offsetWidth,
          height: containerRef.current.offsetHeight
        })
      }
    }

    updateSize()
    window.addEventListener('resize', updateSize)
    return () => window.removeEventListener('resize', updateSize)
  }, [])

  const getOrbitDistance = (planetDistance: number) => {
    const minDistance = 80
    const maxDistance = Math.min(containerSize.width * 0.4, 400)
    const logDistance = Math.log(planetDistance / 1000000)
    return minDistance + (logDistance - 4) * 30
  }

  const getPlanetSize = (radius: number) => {
    return Math.max(8, Math.min(40, Math.log(radius) * 3))
  }

  return (
    <div 
      ref={containerRef}
      className="w-full h-screen bg-gradient-to-b from-slate-900 via-purple-900 to-black relative overflow-hidden"
    >
      {/* Stars background */}
      <div className="absolute inset-0">
        {Array.from({ length: 200 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              opacity: Math.random() * 0.8 + 0.2
            }}
          />
        ))}
      </div>

      {/* Sun */}
      <div 
        className="absolute w-16 h-16 bg-yellow-400 rounded-full shadow-lg"
        style={{
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)',
          boxShadow: '0 0 40px #FDB813, 0 0 80px #FDB81350'
        }}
      />

      {/* Orbital paths */}
      {planets.map((planet) => {
        const distance = getOrbitDistance(planet.distance_from_sun)
        return (
          <div
            key={`orbit-${planet.id}`}
            className="absolute border border-gray-600/30 rounded-full"
            style={{
              width: `${distance * 2}px`,
              height: `${distance * 2}px`,
              left: '50%',
              top: '50%',
              transform: 'translate(-50%, -50%)'
            }}
          />
        )
      })}

      {/* Planets */}
      {planets.map((planet) => {
        const distance = getOrbitDistance(planet.distance_from_sun)
        const size = getPlanetSize(planet.radius)
        
        return (
          <div
            key={planet.id}
            className="absolute"
            style={{
              left: '50%',
              top: '50%',
              transform: 'translate(-50%, -50%)'
            }}
          >
            <PlanetOrb
              planet={planet}
              size={size}
              distance={distance}
              onClick={() => onPlanetSelect?.(planet)}
            />
          </div>
        )
      })}

      {/* Planet info panel */}
      {selectedPlanet && (
        <PlanetInfo 
          planet={selectedPlanet} 
          onClose={() => onPlanetSelect?.(null)} 
        />
      )}

      {/* Instructions */}
      <Card className="absolute bottom-4 left-4 w-80 bg-background/80 backdrop-blur-sm">
        <CardContent className="p-4">
          <h3 className="font-semibold mb-2 flex items-center gap-2">
            <Info className="h-4 w-4" />
            Sistema Solar Interativo
          </h3>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• Clique nos planetas para ver informações</li>
            <li>• Observe as órbitas e tamanhos relativos</li>
            <li>• Os planetas rotacionam em suas órbitas</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}