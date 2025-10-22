"use client"

import { Suspense, useRef, useState, useEffect } from "react"
import { Canvas, useFrame, useLoader, useThree } from "@react-three/fiber"
import { OrbitControls, Stars } from "@react-three/drei"
import * as THREE from "three"
import type { Planet, Moon } from "@/lib/planets-data"
import { getMoonsByPlanet } from "@/lib/planets-data"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { X, Play, Pause } from "lucide-react"

interface SolarSystemProps {
  planets: Planet[]
  onPlanetSelect?: (planet: Planet | Moon | null) => void
  selectedPlanet?: Planet | Moon | null
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

  useFrame((state, delta) => {
    if (!groupRef.current || !meshRef.current) return
    
    if (!globalAnimationState.isPaused) {
      const effectiveSpeed = speed * globalAnimationState.speed
      
      // Orbital motion
      setTime(prev => prev + delta * effectiveSpeed)
      groupRef.current.position.x = Math.cos(time) * orbitalRadius
      groupRef.current.position.z = Math.sin(time) * orbitalRadius
      
      // Update planet position for moons
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
          color={planet.color}
          roughness={0.8}
          metalness={0.2}
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

function MoonMesh({ 
  moon, 
  planetPosition, 
  orbitalRadius, 
  scale, 
  speed, 
  moonOffset = 0,
  onClick 
}: { 
  moon: Moon
  planetPosition: THREE.Vector3
  orbitalRadius: number
  scale: number
  speed: number
  moonOffset?: number
  onClick: () => void
}) {
  const meshRef = useRef<THREE.Mesh>(null!)
  const [time, setTime] = useState(Math.random() * Math.PI * 2)

  useFrame((state, delta) => {
    if (!meshRef.current) return
    
    if (!globalAnimationState.isPaused) {
      setTime(prev => prev + delta * globalAnimationState.speed * speed)
      const angle = time + moonOffset
      meshRef.current.position.x = planetPosition.x + Math.cos(angle) * orbitalRadius
      meshRef.current.position.z = planetPosition.z + Math.sin(angle) * orbitalRadius
      meshRef.current.rotation.y += delta * globalAnimationState.speed
    }
  })

  return (
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
      <sphereGeometry args={[1, 16, 16]} />
      <meshStandardMaterial 
        color={moon.color}
        roughness={0.9}
        metalness={0.1}
      />
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
  const [planetPositions, setPlanetPositions] = useState<Record<string, THREE.Vector3>>({})
  
  const getOrbitalRadius = (distance: number) => {
    // Usar distâncias fixas para evitar sobreposição
    const planetDistances: Record<string, number> = {
      mercury: 12,
      venus: 18,
      earth: 24,
      mars: 30,
      jupiter: 40,
      saturn: 50,
      uranus: 60,
      neptune: 70
    }
    return planetDistances[planets.find(p => p.distance_from_sun === distance)?.name.toLowerCase() || 'mercury'] || 12
  }

  const getPlanetScale = (radius: number) => {
    // Escala mais conservadora para evitar planetas muito grandes
    return Math.max(0.2, Math.min(1.2, Math.log(radius / 1000) * 0.3 + 0.5))
  }

  const getMoonScale = (radius: number) => {
    // Escala para luas baseada no raio
    return Math.max(0.02, Math.min(0.3, Math.log(radius / 100) * 0.1 + 0.05))
  }

  const getMoonOrbitalRadius = (distance: number, planetScale: number) => {
    // Distância orbital da lua baseada na distância real e escala do planeta
    return Math.max(1.5, Math.min(8, (distance / 100000) * 0.1 + planetScale * 2))
  }

  return (
    <>
      <ambientLight intensity={0.4} />
      <Stars radius={300} depth={60} count={20000} factor={7} />
      
      <Sun />
      
      {planets.map((planet, index) => {
        const orbitalRadius = getOrbitalRadius(planet.distance_from_sun)
        const planetScale = getPlanetScale(planet.radius)
        const planetMoons = getMoonsByPlanet(planet.name)
        
        return (
          <group key={planet.id}>
            <OrbitRing radius={orbitalRadius} />
            <PlanetMesh
              planet={planet}
              orbitalRadius={orbitalRadius}
              scale={planetScale}
              speed={0.3 / (index + 1)}
              onClick={() => onPlanetSelect?.(planet)}
              onPositionUpdate={(position) => {
                setPlanetPositions(prev => ({
                  ...prev,
                  [planet.name]: position
                }))
              }}
            />
            
            {/* Luas do planeta */}
            {planetMoons.map((moon, moonIndex) => {
              const moonScale = getMoonScale(moon.radius)
              const moonOrbitalRadius = getMoonOrbitalRadius(moon.distance_from_planet, planetScale)
              const moonSpeed = 2 + moonIndex * 0.5 // Velocidade orbital da lua
              
              // Para Saturno, criar um arco de luas
              let moonOffset = 0
              if (planet.name === 'saturn') {
                // Distribuir as luas em um arco de 120 graus
                const totalMoons = planetMoons.length
                const arcAngle = Math.PI * 2 / 3 // 120 graus
                const angleStep = arcAngle / (totalMoons - 1)
                moonOffset = (moonIndex * angleStep) - (arcAngle / 2)
              }
              
              return (
                <MoonMesh
                  key={moon.id}
                  moon={moon}
                  planetPosition={planetPositions[planet.name] || new THREE.Vector3()}
                  orbitalRadius={moonOrbitalRadius}
                  scale={moonScale}
                  speed={moonSpeed}
                  moonOffset={moonOffset}
                  onClick={() => onPlanetSelect?.(moon)}
                />
              )
            })}
          </group>
        )
      })}
      
      <OrbitControls
        enablePan={true}
        enableZoom={true}
        enableRotate={true}
        minDistance={10}
        maxDistance={150}
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

function PlanetModal({ planet, onClose }: { planet: Planet | Moon; onClose: () => void }) {
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
                  src={planet.image_url || "/placeholder.jpg"} 
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
                {'distance_from_sun' in planet ? (
                  <InfoItem label="Distância do Sol" value={`${(planet.distance_from_sun / 1000000).toFixed(1)} milhões km`} />
                ) : (
                  <InfoItem label="Distância do Planeta" value={`${(planet.distance_from_planet / 1000).toFixed(1)} mil km`} />
                )}
                <InfoItem label="Período Orbital" value={`${planet.orbital_period} dias`} />
                <InfoItem label="Rotação" value={`${Math.abs(planet.rotation_period)} horas`} />
                {'moons_count' in planet && (
                  <InfoItem label="Luas" value={planet.moons_count.toString()} />
                )}
                {'parent_planet' in planet && (
                  <InfoItem label="Planeta Pai" value={planet.parent_planet} />
                )}
              </div>
              
              {/* Informações adicionais para planetas */}
              {'composition' in planet && 'rings' in planet && (
                <div className="grid grid-cols-2 gap-3">
                  <InfoItem label="Composição" value={planet.composition} />
                  <InfoItem label="Atmosfera" value={planet.atmosphere} />
                  <InfoItem label="Campo Magnético" value={planet.magnetic_field ? "Sim" : "Não"} />
                  <InfoItem label="Anéis" value={planet.rings ? "Sim" : "Não"} />
                  <InfoItem label="Inclinação Axial" value={`${planet.axial_tilt}°`} />
                  <InfoItem label="Velocidade de Escape" value={`${planet.escape_velocity} km/s`} />
                  <InfoItem label="Albedo" value={planet.albedo.toFixed(3)} />
                </div>
              )}
              
              {/* Informações adicionais para luas */}
              {'composition' in planet && 'parent_planet' in planet && (
                <div className="grid grid-cols-2 gap-3">
                  <InfoItem label="Composição" value={planet.composition} />
                  <InfoItem label="Atmosfera" value={planet.atmosphere} />
                  <InfoItem label="Campo Magnético" value={planet.magnetic_field ? "Sim" : "Não"} />
                  <InfoItem label="Inclinação Axial" value={`${planet.axial_tilt}°`} />
                  <InfoItem label="Albedo" value={planet.albedo.toFixed(3)} />
                </div>
              )}
              
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


export function WorkingSolarSystem({ planets, onPlanetSelect, selectedPlanet }: SolarSystemProps) {
  return (
    <div className="w-full h-screen bg-gradient-to-b from-slate-900 to-black relative">
      <Canvas
        camera={{ position: [0, 30, 80], fov: 50 }}
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