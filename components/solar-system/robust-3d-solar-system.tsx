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

// Lazy load Three.js components
let Canvas: any = null
let useFrame: any = null
let useThree: any = null
let OrbitControls: any = null
let Stars: any = null
let Text: any = null
let Html: any = null
let THREE: any = null

async function loadThreeJS() {
  try {
    const fiber = await import('@react-three/fiber')
    const drei = await import('@react-three/drei')
    THREE = await import('three')
    
    Canvas = fiber.Canvas
    useFrame = fiber.useFrame
    useThree = fiber.useThree
    OrbitControls = drei.OrbitControls
    Stars = drei.Stars
    Text = drei.Text
    Html = drei.Html
    
    return true
  } catch (error) {
    console.error('Failed to load Three.js:', error)
    return false
  }
}

function Planet3D({ 
  planet, 
  orbitalRadius, 
  scale, 
  speed, 
  onClick 
}: { 
  planet: Planet
  orbitalRadius: number
  scale: number
  speed: number
  onClick: () => void
}) {
  const meshRef = useRef<any>(null)
  const groupRef = useRef<any>(null)
  const [time, setTime] = useState(0)
  const [texture, setTexture] = useState<any>(null)

  useEffect(() => {
    if (THREE?.TextureLoader) {
      const loader = new THREE.TextureLoader()
      const texturePath = getPlanetTexture(planet.name)
      if (texturePath) {
        loader.load(texturePath, (loadedTexture: any) => {
          setTexture(loadedTexture)
        })
      }
    }
  }, [planet.name])

  if (useFrame) {
    useFrame((state: any, delta: number) => {
      if (!groupRef.current || !meshRef.current) return

      // Orbital motion
      setTime((prev) => prev + delta * speed)
      groupRef.current.position.x = Math.cos(time) * orbitalRadius
      groupRef.current.position.z = Math.sin(time) * orbitalRadius
      
      // Planet rotation
      meshRef.current.rotation.y += delta * 2
    })
  }

  const getPlanetTexture = (planetName: string): string | null => {
    const textureMap: Record<string, string> = {
      mercury: "/mercury-texture.png",
      venus: "/venus-texture.png",
      earth: "/earth-planet-texture-blue-green.jpg",
      mars: "/mars-red-texture.png",
      jupiter: "/jupiter-gas-giant-planet-texture-bands.jpg"
    }
    return textureMap[planetName.toLowerCase()] || null
  }

  const getPlanetColor = (planet: Planet): string => {
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
        onClick={(e: any) => {
          e.stopPropagation()
          onClick()
        }}
        onPointerOver={(e: any) => {
          e.stopPropagation()
          if (typeof document !== "undefined") {
            document.body.style.cursor = "pointer"
          }
        }}
        onPointerOut={(e: any) => {
          e.stopPropagation()
          if (typeof document !== "undefined") {
            document.body.style.cursor = "auto"
          }
        }}
      >
        <sphereGeometry args={[1, 32, 32]} />
        {texture ? (
          <meshStandardMaterial map={texture} />
        ) : (
          <meshStandardMaterial color={getPlanetColor(planet)} />
        )}
      </mesh>
    </group>
  )
}

function Sun3D() {
  const meshRef = useRef<any>(null)

  if (useFrame) {
    useFrame((state: any, delta: number) => {
      if (meshRef.current) {
        meshRef.current.rotation.y += delta * 0.5
      }
    })
  }

  return (
    <mesh ref={meshRef} position={[0, 0, 0]}>
      <sphereGeometry args={[2, 32, 32]} />
      <meshBasicMaterial color="#FDB813" />
      <pointLight position={[0, 0, 0]} intensity={2} distance={100} />
    </mesh>
  )
}

function OrbitRing3D({ radius }: { radius: number }) {
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

function SolarSystemScene3D({ planets, onPlanetSelect, selectedPlanet, isPaused, speed }: SolarSystemProps & { isPaused: boolean; speed: number }) {
  const [hoveredPlanet, setHoveredPlanet] = useState<Planet | null>(null)

  const getOrbitalRadius = (distanceFromSun: number) => {
    return Math.log(distanceFromSun / 1000000) * 2 + 5
  }

  const handlePlanetClick = (planet: Planet) => {
    onPlanetSelect?.(planet)
  }

  return (
    <>
      <ambientLight intensity={0.3} />
      {Stars && <Stars radius={300} depth={60} count={20000} factor={7} saturation={0} fade speed={1} />}

      <Sun3D />

      {planets.map((planet, index) => {
        const orbitalRadius = getOrbitalRadius(planet.distance_from_sun)
        const planetScale = Math.log(planet.radius / 1000) * 0.3 + 0.5

        return (
          <group key={planet.id}>
            <OrbitRing3D radius={orbitalRadius} />
            <Planet3D
              planet={planet}
              orbitalRadius={orbitalRadius}
              scale={planetScale}
              speed={isPaused ? 0 : (0.01 / (index + 1)) * speed}
              onClick={() => handlePlanetClick(planet)}
            />
            {Text && (
              <Text
                position={[orbitalRadius + 1, 1, 0]}
                fontSize={0.5}
                color={hoveredPlanet?.id === planet.id ? "#ffffff" : "#888888"}
                anchorX="left"
                anchorY="middle"
              >
                {planet.portuguese_name}
              </Text>
            )}
          </group>
        )
      })}

      {OrbitControls && (
        <OrbitControls
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          minDistance={5}
          maxDistance={100}
          autoRotate={false}
        />
      )}
    </>
  )
}

function PlanetModal({ planet, onClose }: { planet: Planet; onClose: () => void }) {
  const getPlanetImage = (planetName: string): string => {
    const imageMap: Record<string, string> = {
      mercury: "/mercury-texture.png",
      venus: "/venus-texture.png",
      earth: "/earth-planet-texture-blue-green.jpg",
      mars: "/mars-red-texture.png",
      jupiter: "/jupiter-gas-giant-planet-texture-bands.jpg"
    }
    return imageMap[planetName.toLowerCase()] || "/placeholder.jpg"
  }

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-background border-primary/20 shadow-2xl">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div>
            <CardTitle className="text-2xl flex items-center gap-3">
              <div className="w-6 h-6 rounded-full" style={{ backgroundColor: planet.color }} />
              {planet.portuguese_name}
            </CardTitle>
            <Badge variant="secondary" className="mt-2">
              {planet.name.toUpperCase()}
            </Badge>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="w-full h-64 rounded-lg overflow-hidden bg-slate-900">
            <img 
              src={getPlanetImage(planet.name)} 
              alt={planet.portuguese_name}
              className="w-full h-full object-cover"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <span className="text-muted-foreground text-sm font-medium">RAIO</span>
              <p className="text-lg font-semibold">{planet.radius.toLocaleString()} km</p>
            </div>
            <div className="space-y-2">
              <span className="text-muted-foreground text-sm font-medium">MASSA</span>
              <p className="text-lg font-semibold">{(planet.mass / 1e24).toFixed(2)} × 10²⁴ kg</p>
            </div>
            <div className="space-y-2">
              <span className="text-muted-foreground text-sm font-medium">GRAVIDADE</span>
              <p className="text-lg font-semibold">{planet.gravity} m/s²</p>
            </div>
            <div className="space-y-2">
              <span className="text-muted-foreground text-sm font-medium">TEMPERATURA MÉDIA</span>
              <p className="text-lg font-semibold">{planet.average_temperature}°C</p>
            </div>
            <div className="space-y-2">
              <span className="text-muted-foreground text-sm font-medium">DISTÂNCIA DO SOL</span>
              <p className="text-lg font-semibold">{(planet.distance_from_sun / 1000000).toFixed(1)} milhões km</p>
            </div>
            <div className="space-y-2">
              <span className="text-muted-foreground text-sm font-medium">PERÍODO ORBITAL</span>
              <p className="text-lg font-semibold">{planet.orbital_period} dias</p>
            </div>
            <div className="space-y-2">
              <span className="text-muted-foreground text-sm font-medium">PERÍODO DE ROTAÇÃO</span>
              <p className="text-lg font-semibold">{Math.abs(planet.rotation_period)} horas</p>
            </div>
            <div className="space-y-2">
              <span className="text-muted-foreground text-sm font-medium">LUAS</span>
              <p className="text-lg font-semibold">{planet.moons_count}</p>
            </div>
          </div>

          <div className="pt-4 border-t">
            <h3 className="font-semibold mb-2">Descrição</h3>
            <p className="text-muted-foreground leading-relaxed">{planet.description}</p>
          </div>

          {planet.curiosities && planet.curiosities.length > 0 && (
            <div className="pt-4 border-t">
              <h3 className="font-semibold mb-2">Curiosidades</h3>
              <ul className="space-y-1">
                {planet.curiosities.map((curiosity, index) => (
                  <li key={index} className="text-muted-foreground flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    {curiosity}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export function Robust3DSolarSystem({ planets, onPlanetSelect, selectedPlanet }: SolarSystemProps) {
  const [threeLoaded, setThreeLoaded] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [speed, setSpeed] = useState(1)

  useEffect(() => {
    const initThree = async () => {
      try {
        const success = await loadThreeJS()
        if (success) {
          setThreeLoaded(true)
        } else {
          setError(true)
        }
      } catch (err) {
        console.error('Error loading Three.js:', err)
        setError(true)
      } finally {
        setLoading(false)
      }
    }

    initThree()
  }, [])

  if (loading) {
    return (
      <div className="w-full h-screen bg-gradient-to-b from-slate-900 to-black flex items-center justify-center">
        <div className="text-white text-lg animate-pulse">Carregando Sistema Solar 3D...</div>
      </div>
    )
  }

  if (error || !threeLoaded || !Canvas) {
    // Fallback to simple version
    const { SimpleSolarSystem } = require('./simple-solar-system')
    return <SimpleSolarSystem planets={planets} onPlanetSelect={onPlanetSelect} selectedPlanet={selectedPlanet} />
  }

  return (
    <div className="w-full h-screen bg-gradient-to-b from-slate-900 to-black relative">
      <Canvas
        camera={{ position: [0, 10, 30], fov: 60 }}
        gl={{ antialias: true, alpha: false }}
        dpr={[1, 2]}
        performance={{ min: 0.5 }}
        onCreated={({ gl }: any) => {
          gl.setClearColor("#000000", 1)
        }}
      >
        <Suspense fallback={null}>
          <SolarSystemScene3D planets={planets} onPlanetSelect={onPlanetSelect} selectedPlanet={selectedPlanet} isPaused={isPaused} speed={speed} />
        </Suspense>
      </Canvas>

      {selectedPlanet && (
        <PlanetModal planet={selectedPlanet} onClose={() => onPlanetSelect?.(null)} />
      )}

      {/* Controles de Simulação */}
      <Card className="absolute top-4 left-4 w-80 bg-background/90 backdrop-blur-sm">
        <CardContent className="p-4">
          <h3 className="font-semibold mb-3 flex items-center gap-2">
            <Info className="h-4 w-4" />
            Controles de Simulação
          </h3>
          
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Button 
                size="sm" 
                variant={isPaused ? "default" : "outline"}
                onClick={() => setIsPaused(!isPaused)}
                className="flex-1"
              >
                {isPaused ? "▶️ Reproduzir" : "⏸️ Pausar"}
              </Button>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Velocidade: {speed}x</label>
              <input
                type="range"
                min="0.1"
                max="5"
                step="0.1"
                value={speed}
                onChange={(e) => setSpeed(parseFloat(e.target.value))}
                className="w-full"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Instruções */}
      <Card className="absolute bottom-4 right-4 w-80 bg-background/80 backdrop-blur-sm">
        <CardContent className="p-4">
          <h3 className="font-semibold mb-2 flex items-center gap-2">
            <Info className="h-4 w-4" />
            Como Usar
          </h3>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• Clique e arraste para rotacionar a câmera</li>
            <li>• Use a roda do mouse para zoom</li>
            <li>• Clique nos planetas para ver informações</li>
            <li>• Use os controles para pausar/acelerar</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}