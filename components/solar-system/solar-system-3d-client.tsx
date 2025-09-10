"use client"

import { Suspense, useRef, useState, useEffect } from "react"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import { OrbitControls, Stars, Text, Html } from "@react-three/drei"
import * as THREE from "three"
import type { Planet } from "@/lib/api"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { X, Info, Eye, RotateCcw } from "lucide-react"

interface SolarSystem3DProps {
  planets: Planet[]
  onPlanetSelect?: (planet: Planet | null) => void
  selectedPlanet?: Planet | null
}

function SimplePlanetMesh({
  planet,
  orbitalRadius,
  scale,
  speed,
  onClick,
  onPointerOver,
  onPointerOut,
}: {
  planet: Planet
  orbitalRadius: number
  scale: number
  speed: number
  onClick?: () => void
  onPointerOver?: () => void
  onPointerOut?: () => void
}) {
  const meshRef = useRef<THREE.Mesh>(null!)
  const groupRef = useRef<THREE.Group>(null!)
  const [time, setTime] = useState(0)

  useFrame((state, delta) => {
    if (!groupRef.current || !meshRef.current) return

    setTime((prev) => prev + delta * speed)
    groupRef.current.position.x = Math.cos(time) * orbitalRadius
    groupRef.current.position.z = Math.sin(time) * orbitalRadius
    meshRef.current.rotation.y += delta * 0.5
  })

  const getPlanetColor = (planet: Planet): string => {
    if (planet.color) return planet.color

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

function Sun() {
  const meshRef = useRef<THREE.Mesh>(null!)

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.5
    }
  })

  return (
    <mesh ref={meshRef} position={[0, 0, 0]}>
      <sphereGeometry args={[2, 32, 32]} />
      <meshBasicMaterial color="#FDB813" />
      <pointLight position={[0, 0, 0]} intensity={2} distance={100} />
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

function PlanetInfoPanel({
  planet,
  onClose,
  onViewDetails,
}: { planet: Planet; onClose: () => void; onViewDetails: () => void }) {
  return (
    <Html position={[0, 4, 0]} center>
      <Card className="w-96 bg-background/95 backdrop-blur-sm border-primary/20 shadow-2xl">
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

          <div className="flex gap-2 pt-2">
            <Button className="flex-1" onClick={onViewDetails}>
              <Info className="h-4 w-4 mr-2" />
              Ver Detalhes Completos
            </Button>
            <Button variant="outline" size="sm" onClick={onClose}>
              <Eye className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </Html>
  )
}

function CameraController({
  selectedPlanet,
  onEscapePress,
}: { selectedPlanet: Planet | null; onEscapePress: () => void }) {
  const { camera } = useThree()
  const controlsRef = useRef<any>(null)

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onEscapePress()
        if (camera && camera.position) {
          camera.position.set(0, 50, 0)
          camera.lookAt(0, 0, 0)
          if (controlsRef.current && controlsRef.current.update) {
            controlsRef.current.update()
          }
        }
      }
    }

    window.addEventListener("keydown", handleKeyPress)
    return () => window.removeEventListener("keydown", handleKeyPress)
  }, [camera, onEscapePress])

  return (
    <OrbitControls
      ref={controlsRef}
      enablePan={true}
      enableZoom={true}
      enableRotate={true}
      minDistance={5}
      maxDistance={100}
      autoRotate={false}
    />
  )
}

function SolarSystemScene({ planets, onPlanetSelect, selectedPlanet }: SolarSystem3DProps) {
  const [hoveredPlanet, setHoveredPlanet] = useState<Planet | null>(null)

  const getOrbitalRadius = (distanceFromSun: number) => {
    return Math.log(distanceFromSun / 1000000) * 2 + 5
  }

  const handleEscapePress = () => {
    onPlanetSelect?.(null)
  }

  const handlePlanetClick = (planet: Planet) => {
    onPlanetSelect?.(planet)
  }

  const handleViewDetails = () => {
    if (selectedPlanet && typeof window !== "undefined") {
      window.open(`/planeta/${selectedPlanet.id}`, "_blank")
    }
  }

  return (
    <>
      <ambientLight intensity={0.3} />
      <Stars radius={300} depth={60} count={20000} factor={7} saturation={0} fade speed={1} />

      <Sun />

      {planets.map((planet, index) => {
        const orbitalRadius = getOrbitalRadius(planet.distance_from_sun)
        const planetScale = Math.log(planet.radius / 1000) * 0.3 + 0.5

        return (
          <group key={planet.id}>
            <OrbitRing radius={orbitalRadius} />
            <SimplePlanetMesh
              planet={planet}
              orbitalRadius={orbitalRadius}
              scale={planetScale}
              speed={0.01 / (index + 1)}
              onClick={() => handlePlanetClick(planet)}
              onPointerOver={() => setHoveredPlanet(planet)}
              onPointerOut={() => setHoveredPlanet(null)}
            />
            <Text
              position={[orbitalRadius + 1, 1, 0]}
              fontSize={0.5}
              color={hoveredPlanet?.id === planet.id ? "#ffffff" : "#888888"}
              anchorX="left"
              anchorY="middle"
            >
              {planet.portuguese_name}
            </Text>
          </group>
        )
      })}

      {selectedPlanet && (
        <PlanetInfoPanel
          planet={selectedPlanet}
          onClose={() => onPlanetSelect?.(null)}
          onViewDetails={handleViewDetails}
        />
      )}

      <CameraController selectedPlanet={selectedPlanet} onEscapePress={handleEscapePress} />
    </>
  )
}

export function SolarSystem3DClient({ planets, onPlanetSelect, selectedPlanet }: SolarSystem3DProps) {
  const [showHelp, setShowHelp] = useState(false)

  return (
    <div className="w-full h-screen bg-gradient-to-b from-slate-900 to-black relative">
      <Canvas
        camera={{ position: [0, 10, 30], fov: 60 }}
        gl={{ antialias: true, alpha: false }}
        dpr={[1, 2]}
        performance={{ min: 0.5 }}
        onCreated={({ gl }) => {
          gl.setClearColor("#000000", 1)
        }}
      >
        <Suspense fallback={null}>
          <SolarSystemScene planets={planets} onPlanetSelect={onPlanetSelect} selectedPlanet={selectedPlanet} />
        </Suspense>
      </Canvas>

      <div className="absolute bottom-4 right-4 z-10 flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowHelp(!showHelp)}
          className="bg-background/80 backdrop-blur-sm"
        >
          <Info className="h-4 w-4 mr-2" />
          Como Usar
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            window.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }))
          }}
          className="bg-background/80 backdrop-blur-sm"
        >
          <RotateCcw className="h-4 w-4 mr-2" />
          Vista Geral
        </Button>
      </div>

      {showHelp && (
        <div className="absolute top-4 right-4 z-10">
          <Card className="w-80 bg-background/95 backdrop-blur-sm border-primary/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-lg">Como Usar</CardTitle>
              <Button variant="ghost" size="sm" onClick={() => setShowHelp(false)}>
                <X className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div>
                <h4 className="font-medium mb-1">Navegação 3D:</h4>
                <ul className="text-muted-foreground space-y-1">
                  <li>• Clique e arraste para rotacionar</li>
                  <li>• Scroll do mouse para zoom</li>
                  <li>• Clique direito e arraste para mover</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-1">Interações:</h4>
                <ul className="text-muted-foreground space-y-1">
                  <li>• Clique em planetas para ver detalhes</li>
                  <li>• Pressione ESC para visão de cima</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}