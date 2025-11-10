"use client"

import { Suspense, useRef, useState, useEffect, useMemo } from "react"
import { Canvas, useFrame, useLoader, useThree } from "@react-three/fiber"
import { OrbitControls, Stars } from "@react-three/drei"
import * as THREE from "three"
import type { Planet, Moon } from "@/lib/planets-data"
import { getMoonsByPlanet } from "@/lib/planets-data"
import type { Asteroid } from "@/lib/asteroids-data"
import { MAIN_BELT_ASTEROIDS, KUIPER_BELT_OBJECTS, OORT_CLOUD_OBJECTS, SOLAR_SYSTEM_REGIONS } from "@/lib/asteroids-data"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { X, Play, Pause } from "lucide-react"

interface SolarSystemProps {
  planets: Planet[]
  onPlanetSelect?: (planet: Planet | Moon | Asteroid | null) => void
  selectedPlanet?: Planet | Moon | Asteroid | null
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
      <sphereGeometry args={[3, 32, 32]} />
      <meshBasicMaterial color="#FDB813" />
      <pointLight intensity={2} distance={200} />
    </mesh>
  )
}

function AsteroidBelt({ innerRadius, outerRadius, count = 150, onAsteroidClick }: { 
  innerRadius: number; 
  outerRadius: number; 
  count?: number;
  onAsteroidClick?: (asteroid: Asteroid) => void;
}) {
  const asteroids = useMemo(() => {
    const positions = []
    const mainAsteroids = MAIN_BELT_ASTEROIDS.slice(0, 3)
    
    mainAsteroids.forEach((asteroid, index) => {
      const angle = (index / mainAsteroids.length) * Math.PI * 2
      const radius = innerRadius + (outerRadius - innerRadius) * 0.5
      const x = Math.cos(angle) * radius
      const z = Math.sin(angle) * radius
      positions.push({ 
        x, y: 0, z, 
        scale: 0.1,
        isMain: true,
        asteroid
      })
    })
    
    for (let i = 0; i < count - mainAsteroids.length; i++) {
      const angle = Math.random() * Math.PI * 2
      const radius = innerRadius + Math.random() * (outerRadius - innerRadius)
      const x = Math.cos(angle) * radius
      const z = Math.sin(angle) * radius
      positions.push({ 
        x, y: (Math.random() - 0.5) * 1, z, 
        scale: 0.05 + Math.random() * 0.1,
        isMain: false,
        asteroid: null
      })
    }
    return positions
  }, [innerRadius, outerRadius, count])

  return (
    <group>
      {asteroids.map((asteroid, index) => (
        <mesh 
          key={index} 
          position={[asteroid.x, asteroid.y, asteroid.z]} 
          scale={asteroid.scale}
          onClick={(e) => {
            if (asteroid.isMain && asteroid.asteroid && onAsteroidClick) {
              e.stopPropagation()
              onAsteroidClick(asteroid.asteroid)
            }
          }}
        >
          <sphereGeometry args={[1, 8, 8]} />
          <meshStandardMaterial color="#8B7355" roughness={0.9} />
        </mesh>
      ))}
    </group>
  )
}

function OortCloud({ radius = 180, count = 200, onCometClick }: { 
  radius?: number; 
  count?: number;
  onCometClick?: (comet: Asteroid) => void;
}) {
  const objects = useMemo(() => {
    const positions = []
    
    for (let i = 0; i < count; i++) {
      const phi = Math.random() * Math.PI * 2
      const theta = Math.random() * Math.PI
      const r = radius + (Math.random() - 0.5) * 40
      
      const x = r * Math.sin(theta) * Math.cos(phi)
      const y = r * Math.cos(theta)
      const z = r * Math.sin(theta) * Math.sin(phi)
      
      positions.push({ x, y, z, scale: 0.3 + Math.random() * 0.5 })
    }
    return positions
  }, [radius, count])

  return (
    <>
      <group>
        {objects.map((obj, index) => (
          <mesh key={index} position={[obj.x, obj.y, obj.z]} scale={obj.scale}>
            <sphereGeometry args={[1, 8, 8]} />
            <meshStandardMaterial 
              color="#87CEEB" 
              opacity={0.9} 
              transparent 
              emissive="#4169E1" 
              emissiveIntensity={0.5}
              roughness={0.3}
              metalness={0.1}
            />
          </mesh>
        ))}
      </group>
      <pointLight position={[0, 0, 0]} intensity={0.4} distance={radius * 2.5} decay={0.1} />
    </>
  )
}

function KuiperBelt({ radius, count = 100, onObjectClick }: { 
  radius: number; 
  count?: number;
  onObjectClick?: (object: Asteroid) => void;
}) {
  const objects = useMemo(() => {
    const positions = []
    const mainObjects = KUIPER_BELT_OBJECTS.slice(0, 2)
    
    mainObjects.forEach((obj, index) => {
      const angle = (index / mainObjects.length) * Math.PI * 2
      const r = radius + (Math.random() - 0.5) * 5
      const x = Math.cos(angle) * r
      const z = Math.sin(angle) * r
      positions.push({ 
        x, y: 0, z, 
        scale: 0.15,
        isMain: true,
        object: obj
      })
    })
    
    for (let i = 0; i < count - mainObjects.length; i++) {
      const angle = Math.random() * Math.PI * 2
      const r = radius + (Math.random() - 0.5) * 15
      const x = Math.cos(angle) * r
      const z = Math.sin(angle) * r
      positions.push({ 
        x, y: (Math.random() - 0.5) * 3, z, 
        scale: 0.06 + Math.random() * 0.12,
        isMain: false,
        object: null
      })
    }
    return positions
  }, [radius, count])

  return (
    <group>
      {objects.map((obj, index) => (
        <mesh 
          key={index} 
          position={[obj.x, obj.y, obj.z]} 
          scale={obj.scale}
          onClick={(e) => {
            if (obj.isMain && obj.object && onObjectClick) {
              e.stopPropagation()
              onObjectClick(obj.object)
            }
          }}
        >
          <sphereGeometry args={[1, 8, 8]} />
          <meshStandardMaterial color="#4682B4" roughness={0.8} />
        </mesh>
      ))}
    </group>
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

function CameraController({ onOortView }: { onOortView?: () => void }) {
  const { camera, gl } = useThree()
  
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        camera.position.set(0, 250, 0)
        camera.lookAt(0, 0, 0)
        camera.updateProjectionMatrix()
      }
    }
    
    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [camera])
  
  useEffect(() => {
    if (onOortView) {
      const handleOortView = () => {
        camera.position.set(0, 100, 250)
        camera.lookAt(0, 0, 0)
      }
      
      // Expor função globalmente para o botão
      (window as any).viewOortCloud = handleOortView
    }
  }, [camera, onOortView])
  
  return null
}

function SolarSystemScene({ planets, onPlanetSelect }: SolarSystemProps) {
  const [planetPositions, setPlanetPositions] = useState<Record<string, THREE.Vector3>>({})
  
  const getOrbitalRadius = (distance: number) => {
    // Distâncias fixas organizadas para cada planeta
    const planetDistances: Record<string, number> = {
      mercury: 15,
      venus: 20,
      earth: 25,
      mars: 32,
      jupiter: 45,
      saturn: 58,
      uranus: 72,
      neptune: 85
    }
    const planet = planets.find(p => p.distance_from_sun === distance)
    return planetDistances[planet?.name.toLowerCase() || 'mercury'] || 15
  }

  const getPlanetScale = (radius: number) => {
    // Escala mais conservadora baseada no raio real
    const earthRadius = 6371
    const scaleFactor = 0.4
    return Math.max(0.3, Math.min(2.0, (radius / earthRadius) * scaleFactor + 0.2))
  }

  const getMoonScale = (radius: number) => {
    // Escala para luas baseada no raio
    return Math.max(0.02, Math.min(0.3, Math.log(radius / 100) * 0.1 + 0.05))
  }

  const getMoonOrbitalRadius = (distance: number, planetScale: number) => {
    // Distância orbital da lua mais conservadora
    return Math.max(1.2, Math.min(4, planetScale * 1.5 + 0.5))
  }

  return (
    <>
      <ambientLight intensity={0.3} />
      <Stars radius={500} depth={100} count={30000} factor={10} />
      
      <Sun />
      
      {/* Anéis orbitais dos planetas */}
      <OrbitRing radius={15} /> {/* Mercúrio */}
      <OrbitRing radius={20} /> {/* Vênus */}
      <OrbitRing radius={25} /> {/* Terra */}
      <OrbitRing radius={32} /> {/* Marte */}
      <OrbitRing radius={45} /> {/* Júpiter */}
      <OrbitRing radius={58} /> {/* Saturno */}
      <OrbitRing radius={72} /> {/* Urano */}
      <OrbitRing radius={85} /> {/* Netuno */}
      
      {/* Cinturão de Asteroides entre Marte e Júpiter */}
      <AsteroidBelt 
        innerRadius={37} 
        outerRadius={42} 
        count={200} 
        onAsteroidClick={onPlanetSelect}
      />
      
      {/* Cinturão de Kuiper além de Netuno */}
      <KuiperBelt 
        radius={95} 
        count={150} 
        onObjectClick={onPlanetSelect}
      />
      
      {/* Plutão */}
      <PlanetMesh
        planet={{
          id: "pluto",
          name: "pluto",
          portuguese_name: "Plutão",
          radius: 1188.3,
          mass: 1.31e22,
          gravity: 0.62,
          average_temperature: -229,
          distance_from_sun: 5906400000,
          orbital_period: 90560,
          rotation_period: 153.3,
          description: "Ex-planeta, agora classificado como planeta anão no Cinturão de Kuiper.",
          curiosities: [],
          image_url: "",
          color: "#D2B48C",
          moons_count: 5,
          composition: "Rocha e gelo",
          atmosphere: "Nitrogênio tênue",
          magnetic_field: false,
          rings: false,
          axial_tilt: 122.5,
          escape_velocity: 1.21,
          albedo: 0.49,
          created_at: "",
          updated_at: ""
        }}
        orbitalRadius={100}
        scale={0.4}
        speed={0.01}
        onClick={() => onPlanetSelect?.({
          id: "pluto",
          name: "pluto",
          portuguese_name: "Plutão",
          radius: 1188.3,
          mass: 1.31e22,
          gravity: 0.62,
          average_temperature: -229,
          distance_from_sun: 5906400000,
          orbital_period: 90560,
          rotation_period: 153.3,
          description: "Ex-planeta, agora classificado como planeta anão no Cinturão de Kuiper.",
          curiosities: [
            "Ex-nono planeta do Sistema Solar",
            "Reclassificado como planeta anão em 2006",
            "Possui cinco luas conhecidas",
            "Órbita excêntrica e inclinada"
          ],
          image_url: "",
          color: "#D2B48C",
          moons_count: 5,
          composition: "Rocha e gelo",
          atmosphere: "Nitrogênio tênue",
          magnetic_field: false,
          rings: false,
          axial_tilt: 122.5,
          escape_velocity: 1.21,
          albedo: 0.49,
          created_at: "",
          updated_at: ""
        })}
        onPositionUpdate={() => {}}
      />
      <OrbitRing radius={100} />
      
      {/* Nuvem de Oort */}
      <OortCloud 
        radius={160} 
        count={300} 
        onCometClick={onPlanetSelect}
      />
      
      {planets.map((planet, index) => {
        const orbitalRadius = getOrbitalRadius(planet.distance_from_sun)
        const planetScale = getPlanetScale(planet.radius)
        const planetMoons = getMoonsByPlanet(planet.name)
        
        return (
          <group key={planet.id}>
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
            
            {/* Anéis das luas para Saturno */}
            {planet.name === 'saturn' && planetMoons.slice(0, 5).map((moon, moonIndex) => {
              const moonOrbitalRadius = getMoonOrbitalRadius(moon.distance_from_planet, planetScale)
              return (
                <group key={`saturn-ring-${moonIndex}`}>
                  {planetPositions[planet.name] && (
                    <mesh 
                      position={[planetPositions[planet.name].x, planetPositions[planet.name].y, planetPositions[planet.name].z]}
                      rotation={[-Math.PI / 2, 0, 0]}
                    >
                      <ringGeometry args={[moonOrbitalRadius - 0.1, moonOrbitalRadius + 0.1, 32]} />
                      <meshBasicMaterial color="#666666" opacity={0.2} transparent side={2} />
                    </mesh>
                  )}
                </group>
              )
            })}
            
            {/* Luas do planeta */}
            {planetMoons.map((moon, moonIndex) => {
              const moonScale = getMoonScale(moon.radius)
              const moonOrbitalRadius = getMoonOrbitalRadius(moon.distance_from_planet, planetScale)
              const moonSpeed = 2 + moonIndex * 0.5
              
              let moonOffset = 0
              if (planet.name === 'saturn') {
                const totalMoons = planetMoons.length
                const arcAngle = Math.PI * 2 / 3
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
        minDistance={5}
        maxDistance={300}
      />
      
      <CameraController onOortView={() => {}} />
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
        <CardTitle className="text-lg">Controles</CardTitle>
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
        
        <Button 
          onClick={() => {
            if ((window as any).viewOortCloud) {
              (window as any).viewOortCloud()
            }
          }}
          className="w-full"
          variant="outline"
        >
          Ver Nuvem de Oort
        </Button>
      </CardContent>
    </Card>
  )
}

function PlanetModal({ planet, onClose }: { planet: Planet | Moon | Asteroid; onClose: () => void }) {
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
                {'gravity' in planet && (
                  <InfoItem label="Gravidade" value={`${planet.gravity} m/s²`} />
                )}
                {'average_temperature' in planet && (
                  <InfoItem label="Temperatura" value={`${planet.average_temperature}°C`} />
                )}
                {'distance_from_sun' in planet ? (
                  <InfoItem label="Distância do Sol" value={`${(planet.distance_from_sun / 1000000).toFixed(1)} milhões km`} />
                ) : 'distance_from_planet' in planet ? (
                  <InfoItem label="Distância do Planeta" value={`${(planet.distance_from_planet / 1000).toFixed(1)} mil km`} />
                ) : null}
                <InfoItem label="Período Orbital" value={`${planet.orbital_period} dias`} />
                {'rotation_period' in planet && (
                  <InfoItem label="Rotação" value={`${Math.abs(planet.rotation_period)} horas`} />
                )}
                {'moons_count' in planet && (
                  <InfoItem label="Luas" value={planet.moons_count.toString()} />
                )}
                {'parent_planet' in planet && (
                  <InfoItem label="Planeta Pai" value={planet.parent_planet} />
                )}
                {'type' in planet && (
                  <InfoItem label="Tipo" value={planet.type === 'asteroid' ? 'Asteroide' : planet.type === 'comet' ? 'Cometa' : 'Planeta Anão'} />
                )}
                {'location' in planet && (
                  <InfoItem label="Localização" value={
                    planet.location === 'main_belt' ? 'Cinturão Principal' :
                    planet.location === 'kuiper_belt' ? 'Cinturão de Kuiper' :
                    'Nuvem de Oort'
                  } />
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
              {'composition' in planet && 'parent_planet' in planet && !('type' in planet) && (
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
        camera={{ position: [0, 40, 100], fov: 50 }}
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