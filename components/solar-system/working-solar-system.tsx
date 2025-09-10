"use client"

import { Suspense, useRef, useState, useEffect } from "react"
import { Canvas, useFrame, useLoader, useThree } from "@react-three/fiber"
import { OrbitControls, Stars } from "@react-three/drei"
import * as THREE from "three"
import type { Planet } from "@/lib/api"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { X, Play, Pause } from "lucide-react"

interface SolarSystemProps {
  planets: Planet[]
  onPlanetSelect?: (planet: Planet | null) => void
  selectedPlanet?: Planet | null
}

// Global animation state
let globalAnimationState = {
  isPaused: false,
  speed: 1
}

function PlanetMesh({ 
  planet, 
  orbitalRadius, 
  scale, 
  speed, 
  onClick,
  onPositionUpdate
}: { 
  planet: Planet
  orbitalRadius: number
  scale: number
  speed: number
  onClick: () => void
  onPositionUpdate?: (position: THREE.Vector3) => void
}) {
  const meshRef = useRef<THREE.Mesh>(null!)
  const groupRef = useRef<THREE.Group>(null!)
  const [time, setTime] = useState(Math.random() * Math.PI * 2)
  
  // Load texture
  const texture = useLoader(THREE.TextureLoader, getTextureUrl(planet.name), undefined, () => {
    console.log(`Failed to load texture for ${planet.name}`)
  })

  useFrame((state, delta) => {
    if (!groupRef.current || !meshRef.current) return
    
    if (!globalAnimationState.isPaused) {
      const effectiveSpeed = speed * globalAnimationState.speed
      
      // Orbital motion
      setTime(prev => prev + delta * effectiveSpeed)
      groupRef.current.position.x = Math.cos(time) * orbitalRadius
      groupRef.current.position.z = Math.sin(time) * orbitalRadius
      
      // Update Earth position for Moon
      if (onPositionUpdate) {
        onPositionUpdate(groupRef.current.position)
      }
      
      // Planet rotation
      meshRef.current.rotation.y += delta * effectiveSpeed * 3
    }
  })

  return (
    <group ref={groupRef}>
      <mesh
        ref={meshRef}
        scale={scale}
        onClick={(e) => {
          e.stopPropagation()
          onClick()
        }}
        onPointerOver={() => {
          document.body.style.cursor = "pointer"
        }}
        onPointerOut={() => {
          document.body.style.cursor = "auto"
        }}
      >
        <sphereGeometry args={[1, 32, 32]} />
        <meshStandardMaterial 
          map={texture} 
          color={texture ? "#ffffff" : getPlanetColor(planet.name)}
        />
      </mesh>
    </group>
  )
}

function Sun() {
  const meshRef = useRef<THREE.Mesh>(null!)

  useFrame((state, delta) => {
    if (meshRef.current && !globalAnimationState.isPaused) {
      meshRef.current.rotation.y += delta * globalAnimationState.speed * 0.5
    }
  })

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[2, 32, 32]} />
      <meshBasicMaterial color="#FDB813" />
      <pointLight intensity={2} distance={200} />
    </mesh>
  )
}

function OrbitRing({ radius }: { radius: number }) {
  const points = []
  for (let i = 0; i <= 64; i++) {
    const angle = (i / 64) * Math.PI * 2
    points.push(Math.cos(angle) * radius, 0, Math.sin(angle) * radius)
  }

  return (
    <line>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={points.length / 3}
          array={new Float32Array(points)}
          itemSize={3}
        />
      </bufferGeometry>
      <lineBasicMaterial color="#444444" opacity={0.3} transparent />
    </line>
  )
}

function Moon({ earthPosition, onClick }: { earthPosition: THREE.Vector3; onClick: () => void }) {
  const meshRef = useRef<THREE.Mesh>(null!)
  const [time, setTime] = useState(0)

  useFrame((state, delta) => {
    if (!meshRef.current) return
    
    if (!globalAnimationState.isPaused) {
      setTime(prev => prev + delta * globalAnimationState.speed * 2)
      const moonDistance = 3
      meshRef.current.position.x = earthPosition.x + Math.cos(time) * moonDistance
      meshRef.current.position.z = earthPosition.z + Math.sin(time) * moonDistance
      meshRef.current.rotation.y += delta * globalAnimationState.speed
    }
  })

  return (
    <mesh 
      ref={meshRef} 
      scale={0.15}
      onClick={(e) => {
        e.stopPropagation()
        onClick()
      }}
      onPointerOver={() => {
        document.body.style.cursor = "pointer"
      }}
      onPointerOut={() => {
        document.body.style.cursor = "auto"
      }}
    >
      <sphereGeometry args={[1, 16, 16]} />
      <meshStandardMaterial color="#C0C0C0" />
    </mesh>
  )
}

function CameraController() {
  const { camera, gl } = useThree()
  
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        camera.position.set(0, 80, 0)
        camera.lookAt(0, 0, 0)
      }
    }
    
    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [camera])
  
  return null
}

function SolarSystemScene({ planets, onPlanetSelect }: SolarSystemProps) {
  const [earthPosition, setEarthPosition] = useState(new THREE.Vector3())
  
  const moonData = {
    id: 999,
    name: "moon",
    portuguese_name: "Lua",
    radius: 1737,
    mass: 7.342e22,
    gravity: 1.62,
    average_temperature: -20,
    distance_from_sun: 149600000,
    orbital_period: 27.3,
    rotation_period: 655.7,
    description: "O único satélite natural da Terra, responsável pelas marés e estabilização do eixo terrestre.",
    curiosities: ["Sempre mostra a mesma face para a Terra", "Está se afastando da Terra 3,8 cm por ano", "Tem água congelada nos polos"],
    image_url: "/placeholder.jpg",
    color: "#C0C0C0",
    moons_count: 0,
    created_at: "2024-01-01",
    updated_at: "2024-01-01",
  }
  
  const getOrbitalRadius = (distance: number) => {
    return Math.log(distance / 1000000) * 3 + 8
  }

  const getPlanetScale = (radius: number) => {
    return Math.max(0.3, Math.min(2, Math.log(radius / 1000) * 0.4 + 0.8))
  }

  return (
    <>
      <ambientLight intensity={0.4} />
      <Stars radius={300} depth={60} count={20000} factor={7} />
      
      <Sun />
      
      {planets.map((planet, index) => {
        const orbitalRadius = getOrbitalRadius(planet.distance_from_sun)
        const planetScale = getPlanetScale(planet.radius)
        
        return (
          <group key={planet.id}>
            <OrbitRing radius={orbitalRadius} />
            <PlanetMesh
              planet={planet}
              orbitalRadius={orbitalRadius}
              scale={planetScale}
              speed={0.3 / (index + 1)}
              onClick={() => onPlanetSelect?.(planet)}
              onPositionUpdate={planet.name === 'earth' ? setEarthPosition : undefined}
            />
          </group>
        )
      })}
      
      {/* Lua ao redor da Terra */}
      <Moon earthPosition={earthPosition} onClick={() => onPlanetSelect?.(moonData)} />
      
      <OrbitControls
        enablePan={true}
        enableZoom={true}
        enableRotate={true}
        minDistance={3}
        maxDistance={200}
      />
      
      <CameraController />
    </>
  )
}

function SimulationControls() {
  const [isPaused, setIsPaused] = useState(false)
  const [speed, setSpeed] = useState(1)

  const togglePause = () => {
    const newPaused = !isPaused
    setIsPaused(newPaused)
    globalAnimationState.isPaused = newPaused
  }

  const changeSpeed = (newSpeed: number) => {
    setSpeed(newSpeed)
    globalAnimationState.speed = newSpeed
  }

  return (
    <Card className="w-80 bg-background/90 backdrop-blur-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Controles de Simulação</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button 
          onClick={togglePause}
          className="w-full"
          variant={isPaused ? "default" : "outline"}
        >
          {isPaused ? <Play className="w-4 h-4 mr-2" /> : <Pause className="w-4 h-4 mr-2" />}
          {isPaused ? "Reproduzir" : "Pausar"}
        </Button>
        
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-sm font-medium">Velocidade</span>
            <span className="text-sm text-muted-foreground">{speed.toFixed(1)}x</span>
          </div>
          <input
            type="range"
            min="0.1"
            max="3"
            step="0.1"
            value={speed}
            onChange={(e) => changeSpeed(parseFloat(e.target.value))}
            className="w-full"
          />
        </div>
      </CardContent>
    </Card>
  )
}

function PlanetModal({ planet, onClose }: { planet: Planet; onClose: () => void }) {
  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-4xl h-[85vh] flex flex-col">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 flex-shrink-0">
          <div>
            <CardTitle className="text-2xl flex items-center gap-3">
              <div 
                className="w-6 h-6 rounded-full" 
                style={{ backgroundColor: planet.color }} 
              />
              {planet.portuguese_name}
            </CardTitle>
            <Badge variant="secondary" className="mt-1">
              {planet.name.toUpperCase()}
            </Badge>
          </div>
          <Button variant="ghost" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </CardHeader>
        
        <CardContent className="flex-1 overflow-y-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
            <div className="space-y-4">
              <div className="w-full h-64 rounded-lg overflow-hidden bg-slate-900">
                <img 
                  src={planet.image_url || getTextureUrl(planet.name)} 
                  alt={planet.portuguese_name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = "/placeholder.jpg"
                  }}
                />
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-2">Descrição</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{planet.description}</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <InfoItem label="Raio" value={`${planet.radius.toLocaleString()} km`} />
                <InfoItem label="Massa" value={`${(planet.mass / 1e24).toFixed(2)} × 10²⁴ kg`} />
                <InfoItem label="Gravidade" value={`${planet.gravity} m/s²`} />
                <InfoItem label="Temperatura" value={`${planet.average_temperature}°C`} />
                <InfoItem label="Distância do Sol" value={`${(planet.distance_from_sun / 1000000).toFixed(1)} milhões km`} />
                <InfoItem label="Período Orbital" value={`${planet.orbital_period} dias`} />
                <InfoItem label="Rotação" value={`${Math.abs(planet.rotation_period)} horas`} />
                <InfoItem label="Luas" value={planet.moons_count.toString()} />
              </div>
              
              {planet.curiosities && planet.curiosities.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold mb-2">Curiosidades</h3>
                  <ul className="space-y-1">
                    {planet.curiosities.map((curiosity, index) => (
                      <li key={index} className="flex items-start gap-2 text-muted-foreground text-sm">
                        <span className="text-primary mt-1">•</span>
                        {curiosity}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function InfoItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="space-y-1">
      <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{label}</span>
      <p className="font-semibold">{value}</p>
    </div>
  )
}

function getTextureUrl(planetName: string): string {
  const textureMap: Record<string, string> = {
    mercury: "/mercury-texture.png",
    venus: "/venus-texture.png", 
    earth: "/earth-planet-texture-blue-green.jpg",
    mars: "/mars-red-texture.png",
    jupiter: "/jupiter-gas-giant-planet-texture-bands.jpg"
  }
  return textureMap[planetName.toLowerCase()] || "/placeholder.jpg"
}

function getPlanetColor(planetName: string): string {
  const colorMap: Record<string, string> = {
    mercury: "#8C7853",
    venus: "#FFC649",
    earth: "#6B93D6", 
    mars: "#CD5C5C",
    jupiter: "#D8CA9D",
    saturn: "#FAD5A5",
    uranus: "#4FD0E7",
    neptune: "#4B70DD"
  }
  return colorMap[planetName.toLowerCase()] || "#888888"
}

export function WorkingSolarSystem({ planets, onPlanetSelect, selectedPlanet }: SolarSystemProps) {
  return (
    <div className="w-full h-screen bg-gradient-to-b from-slate-900 to-black relative">
      <Canvas
        camera={{ position: [0, 20, 40], fov: 60 }}
        gl={{ antialias: true }}
      >
        <Suspense fallback={null}>
          <SolarSystemScene planets={planets} onPlanetSelect={onPlanetSelect} />
        </Suspense>
      </Canvas>

      <div className="absolute top-4 left-4">
        <SimulationControls />
      </div>

      {selectedPlanet && (
        <PlanetModal planet={selectedPlanet} onClose={() => onPlanetSelect?.(null)} />
      )}
    </div>
  )
}