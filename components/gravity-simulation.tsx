"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Apple, Play, RotateCcw, Pause } from "lucide-react"
import type { Planet } from "@/lib/planets-data"

interface GravitySimulationProps {
  planets: Planet[]
}

interface AppleState {
  y: number
  velocity: number
  isDropped: boolean
  hasLanded: boolean
  dropTime: number
}

function PlanetImage({ planet, size = 48 }: { planet: Planet; size?: number }) {
  const getTextureUrl = (planetName: string): string => {
    const textureMap: Record<string, string> = {
      mercury: "/mercury-texture.png",
      venus: "/venus-texture.png", 
      earth: "/earth-planet-texture-blue-green.jpg",
      mars: "/mars-red-texture.png",
      jupiter: "/jupiter-gas-giant-planet-texture-bands.jpg",
      saturn: "/saturn-realistic.jpg",
      uranus: "/uranus-realistic.jpg",
      neptune: "/neptune-realistic.jpg"
    }
    return textureMap[planetName.toLowerCase()] || "/placeholder.jpg"
  }
  
  const imageUrl = planet.image_url || getTextureUrl(planet.name)
  const hasRealTexture = imageUrl && imageUrl !== "/placeholder.jpg"
  
  if (hasRealTexture) {
    return (
      <img
        src={imageUrl}
        alt={planet.portuguese_name}
        className="w-full h-full object-cover rounded-full"
        onError={(e) => {
          e.currentTarget.style.display = 'none'
        }}
      />
    )
  }
  
  return (
    <div 
      className="w-full h-full rounded-full"
      style={{ backgroundColor: planet.color || '#8C7853' }}
    />
  )
}

function AppleComponent({ y, isVisible }: { y: number; isVisible: boolean }) {
  if (!isVisible) return null
  
  return (
    <div 
      className="absolute left-1/2 transform -translate-x-1/2 transition-none"
      style={{ top: `${y}px` }}
    >
      <div className="w-6 h-6 bg-red-500 rounded-full relative">
        <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-green-600 rounded-full"></div>
        <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-1 h-3 bg-green-800"></div>
      </div>
    </div>
  )
}

export function GravitySimulation({ planets }: GravitySimulationProps) {
  const [isRunning, setIsRunning] = useState(false)
  const [apples, setApples] = useState<Record<string, AppleState>>({})
  const animationRef = useRef<number>()
  const startTimeRef = useRef<number>()

  const SIMULATION_HEIGHT = 300
  const GROUND_LEVEL = SIMULATION_HEIGHT - 50
  const DROP_HEIGHT = 50

  useEffect(() => {
    // Initialize apple states for each planet
    const initialApples: Record<string, AppleState> = {}
    planets.forEach(planet => {
      initialApples[planet.id] = {
        y: DROP_HEIGHT,
        velocity: 0,
        isDropped: false,
        hasLanded: false,
        dropTime: 0
      }
    })
    setApples(initialApples)
  }, [planets])

  const startSimulation = () => {
    setIsRunning(true)
    startTimeRef.current = Date.now()
    
    // Reset all apples
    const resetApples: Record<string, AppleState> = {}
    planets.forEach(planet => {
      resetApples[planet.id] = {
        y: DROP_HEIGHT,
        velocity: 0,
        isDropped: true,
        hasLanded: false,
        dropTime: 0
      }
    })
    setApples(resetApples)
    
    animate()
  }

  const resetSimulation = () => {
    setIsRunning(false)
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current)
    }
    
    const resetApples: Record<string, AppleState> = {}
    planets.forEach(planet => {
      resetApples[planet.id] = {
        y: DROP_HEIGHT,
        velocity: 0,
        isDropped: false,
        hasLanded: false,
        dropTime: 0
      }
    })
    setApples(resetApples)
  }

  const animate = () => {
    setApples(prevApples => {
      const newApples = { ...prevApples }
      let allLanded = true
      
      planets.forEach(planet => {
        const apple = newApples[planet.id]
        if (!apple || apple.hasLanded) return
        
        const deltaTime = 0.016 // ~60fps
        const gravity = planet.gravity // m/s²
        const pixelsPerMeter = 10 // Scale factor for visualization
        
        // Physics calculation: v = v0 + gt, y = y0 + v0*t + 0.5*g*t²
        apple.velocity += gravity * deltaTime * pixelsPerMeter
        apple.y += apple.velocity * deltaTime
        apple.dropTime += deltaTime
        
        // Check if apple has hit the ground
        if (apple.y >= GROUND_LEVEL) {
          apple.y = GROUND_LEVEL
          apple.hasLanded = true
          apple.velocity = 0
        } else {
          allLanded = false
        }
      })
      
      if (allLanded) {
        setIsRunning(false)
      }
      
      return newApples
    })
    
    if (isRunning) {
      animationRef.current = requestAnimationFrame(animate)
    }
  }

  useEffect(() => {
    if (isRunning) {
      animate()
    }
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [isRunning])

  const calculateFallTime = (gravity: number) => {
    // t = sqrt(2h/g) where h is height in meters
    const heightInMeters = (GROUND_LEVEL - DROP_HEIGHT) / 10 // Convert pixels to meters
    return Math.sqrt((2 * heightInMeters) / gravity)
  }

  const calculateFinalVelocity = (gravity: number) => {
    // v = sqrt(2gh)
    const heightInMeters = (GROUND_LEVEL - DROP_HEIGHT) / 10
    return Math.sqrt(2 * gravity * heightInMeters)
  }

  if (planets.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-12">
          <Apple className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">
            Selecione planetas para simular
          </h3>
          <p className="text-muted-foreground">
            Escolha planetas para ver como a gravidade afeta a queda de objetos
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Apple className="h-6 w-6" />
          Simulação de Gravidade
        </CardTitle>
        <CardDescription>
          Compare como uma maçã cai em diferentes planetas devido à variação da gravidade
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Controls */}
          <div className="flex gap-4 justify-center">
            <Button 
              onClick={startSimulation} 
              disabled={isRunning}
              className="flex items-center gap-2"
            >
              <Play className="h-4 w-4" />
              Iniciar Simulação
            </Button>
            <Button 
              onClick={resetSimulation}
              variant="outline"
              className="flex items-center gap-2"
            >
              <RotateCcw className="h-4 w-4" />
              Reiniciar
            </Button>
          </div>

          {/* Simulation Area */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {planets.map((planet) => {
              const apple = apples[planet.id]
              const fallTime = calculateFallTime(planet.gravity)
              const finalVelocity = calculateFinalVelocity(planet.gravity)
              
              return (
                <Card key={planet.id} className="relative">
                  <CardContent className="p-4">
                    <div className="text-center mb-4">
                      <div className="w-16 h-16 rounded-full mx-auto mb-2 overflow-hidden">
                        <PlanetImage planet={planet} size={64} />
                      </div>
                      <h3 className="font-semibold">{planet.portuguese_name}</h3>
                      <Badge variant="secondary" className="text-xs">
                        {planet.gravity} m/s²
                      </Badge>
                    </div>
                    
                    {/* Simulation Container */}
                    <div 
                      className="relative border-2 border-dashed border-muted-foreground/30 rounded-lg mx-auto bg-gradient-to-b from-sky-100 to-green-100 dark:from-sky-900/20 dark:to-green-900/20"
                      style={{ height: `${SIMULATION_HEIGHT}px`, width: '120px' }}
                    >
                      {/* Ground */}
                      <div 
                        className="absolute bottom-0 left-0 right-0 bg-green-600 rounded-b-lg"
                        style={{ height: '20px' }}
                      />
                      
                      {/* Apple */}
                      {apple && (
                        <AppleComponent 
                          y={apple.y} 
                          isVisible={apple.isDropped || apple.hasLanded}
                        />
                      )}
                      
                      {/* Drop indicator */}
                      <div 
                        className="absolute left-1/2 transform -translate-x-1/2 w-8 h-0.5 bg-dashed border-t-2 border-dashed border-muted-foreground/50"
                        style={{ top: `${DROP_HEIGHT}px` }}
                      />
                    </div>
                    
                    {/* Results */}
                    <div className="mt-4 space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Tempo teórico:</span>
                        <span className="font-mono">{fallTime.toFixed(2)}s</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Velocidade final:</span>
                        <span className="font-mono">{finalVelocity.toFixed(1)} m/s</span>
                      </div>
                      {apple?.hasLanded && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Tempo real:</span>
                          <span className="font-mono text-primary">{apple.dropTime.toFixed(2)}s</span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          {/* Information */}
          <Card className="bg-muted/50">
            <CardContent className="p-4">
              <h4 className="font-semibold mb-2">Informações da Simulação:</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <h5 className="font-medium text-sm mb-1">Parâmetros:</h5>
                  <ul className="text-sm space-y-1 text-muted-foreground">
                    <li>• <strong>Altura de queda:</strong> 25 metros</li>
                    <li>• <strong>Objeto:</strong> Maçã (massa não afeta o tempo)</li>
                    <li>• <strong>Condições:</strong> Sem resistência do ar</li>
                  </ul>
                </div>
                <div>
                  <h5 className="font-medium text-sm mb-1">Fórmulas Físicas:</h5>
                  <ul className="text-sm space-y-1 text-muted-foreground">
                    <li>• <strong>Tempo:</strong> t = √(2h/g)</li>
                    <li>• <strong>Velocidade final:</strong> v = √(2gh)</li>
                    <li>• <strong>h:</strong> altura (25m), <strong>g:</strong> gravidade</li>
                  </ul>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                <strong>Observação:</strong> Planetas com maior gravidade fazem objetos caírem mais rápido. 
                A massa do objeto não afeta o tempo de queda no vácuo.
              </p>
            </CardContent>
          </Card>
        </div>
      </CardContent>
    </Card>
  )
}