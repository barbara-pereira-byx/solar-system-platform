"use client"

import { useState } from "react"
import { Navigation } from "@/components/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FIXED_PLANETS, type Planet } from "@/lib/planets-data"
import { FIXED_COMPARISON_FIELDS, getPlanetComparisonValue, formatComparisonValue, calculateWeightOnPlanet, type ComparisonField } from "@/lib/comparison-data"
import { GravitySimulation } from "@/components/gravity-simulation"
import { BarChart3, X, Calculator, Scale, Thermometer, Globe, Clock, Apple, Play, RotateCcw } from "lucide-react"

// Componente para exibir imagem do planeta
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
  
  // Debug: log the image URL
  console.log(`Planet ${planet.name}: imageUrl = ${imageUrl}`)
  
  if (hasRealTexture) {
    return (
      <img
        src={imageUrl}
        alt={planet.portuguese_name}
        className="w-full h-full object-cover"
        onError={(e) => {
          console.error(`Failed to load image: ${imageUrl}`)
          e.currentTarget.style.display = 'none'
        }}
      />
    )
  }
  
  // Fallback para cor sólida
  return (
    <div 
      className="w-full h-full rounded-full"
      style={{ backgroundColor: planet.color || '#8C7853' }}
    />
  )
}

export default function CompararPage() {
  const [selectedPlanets, setSelectedPlanets] = useState<Planet[]>([])
  const [userWeight, setUserWeight] = useState<number>(0)
  
  // Usar dados fixos dos planetas
  const planets = FIXED_PLANETS

  const addPlanet = (planet: Planet) => {
    const isAlreadySelected = selectedPlanets.find((p) => p.id === planet.id)
    
    if (isAlreadySelected) {
      // Remove o planeta se já estiver selecionado
      setSelectedPlanets(selectedPlanets.filter((p) => p.id !== planet.id))
    } else if (selectedPlanets.length < 3) {
      // Adiciona o planeta se não estiver selecionado e há espaço
      setSelectedPlanets([...selectedPlanets, planet])
    }
  }

  const removePlanet = (planetId: string) => {
    setSelectedPlanets(selectedPlanets.filter((p) => p.id !== planetId))
  }

  const clearSelection = () => {
    setSelectedPlanets([])
  }

  const calculateWeight = (planet: Planet) => {
    return calculateWeightOnPlanet(userWeight, planet.gravity).toFixed(1)
  }

  // Usar as funções de formatação dos dados fixos
  const formatPlanetValue = (planet: Planet, fieldName: string) => {
    const value = getPlanetComparisonValue(planet, fieldName)
    const field = FIXED_COMPARISON_FIELDS.find(f => f.name === fieldName)
    if (field) {
      return formatComparisonValue(value, field)
    }
    return String(value)
  }

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


  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Comparar Planetas
          </h1>
          <p className="text-xl text-muted-foreground">
            Compare características e calcule seu peso em diferentes planetas
          </p>
        </div>

        {/* Weight Calculator */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calculator className="h-6 w-6" />
              Calculadora de Peso
            </CardTitle>
            <CardDescription>
              Digite seu peso na Terra para calcular quanto você pesaria em outros planetas
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <Label htmlFor="weight">Seu peso na Terra (kg)</Label>
                <Input
                  id="weight"
                  type="number"
                  value={userWeight}
                  onChange={(e) => setUserWeight(Number(e.target.value) || 0)}
                  placeholder="70"
                  min="0"
                />
              </div>
              <div className="text-sm text-muted-foreground">
                {userWeight === 0 ? "Digite um peso para ver os cálculos" : "Peso calculado para todos os planetas"}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Planet Selection */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-6 w-6" />
              Selecionar Planetas para Comparação
            </CardTitle>
            <CardDescription>
              Escolha até 3 planetas para comparar (atualmente: {selectedPlanets.length}/3)
            </CardDescription>
          </CardHeader>
          <CardContent>
            {selectedPlanets.length > 0 && (
              <div className="mb-4">
                <div className="flex flex-wrap gap-2 mb-4">
                  {selectedPlanets.map((planet) => (
                    <Badge
                      key={planet.id}
                      variant="secondary"
                      className="px-3 py-1"
                    >
                      {planet.portuguese_name}
                      <Button
                        size="sm"
                        variant="ghost"
                        className="ml-2 h-4 w-4 p-0 hover:bg-destructive/20"
                        onClick={() => removePlanet(planet.id)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </Badge>
                  ))}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={clearSelection}
                  className="border-destructive/30 text-destructive hover:bg-destructive/20"
                >
                  Limpar Seleção
                </Button>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {planets.map((planet) => (
                <Card
                  key={planet.id}
                  className={`cursor-pointer transition-all duration-200 hover:scale-105 ${
                    selectedPlanets.find((p) => p.id === planet.id)
                      ? 'ring-2 ring-primary bg-primary/10'
                      : 'hover:bg-accent/5'
                  } ${
                    selectedPlanets.length >= 3 && !selectedPlanets.find((p) => p.id === planet.id)
                      ? 'opacity-50 cursor-not-allowed'
                      : ''
                  }`}
                  onClick={() => addPlanet(planet)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 rounded-full flex-shrink-0 overflow-hidden">
                        <PlanetImage planet={planet} size={48} />
                      </div>
                      <div>
                        <h3 className="font-semibold">{planet.portuguese_name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {planet.moons_count} {planet.moons_count === 1 ? 'lua' : 'luas'}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Comparison Results */}
        {selectedPlanets.length >= 2 && (
          <Tabs defaultValue="gravity" className="space-y-6">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="gravity">
                <Apple className="h-4 w-4 mr-2" />
                Gravidade
              </TabsTrigger>
              <TabsTrigger value="weight">
                <Scale className="h-4 w-4 mr-2" />
                Peso
              </TabsTrigger>
              <TabsTrigger value="physical">
                <Globe className="h-4 w-4 mr-2" />
                Físicas
              </TabsTrigger>
              <TabsTrigger value="orbital">
                <Clock className="h-4 w-4 mr-2" />
                Orbitais
              </TabsTrigger>
              <TabsTrigger value="environment">
                <Thermometer className="h-4 w-4 mr-2" />
                Ambiente
              </TabsTrigger>
            </TabsList>

            <TabsContent value="gravity">
              <GravitySimulation planets={selectedPlanets} />
            </TabsContent>

            <TabsContent value="weight">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Scale className="h-6 w-6" />
                    Comparação de Peso
                  </CardTitle>
                  <CardDescription>
                    Seu peso em diferentes planetas baseado na gravidade
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {selectedPlanets.map((planet) => (
                      <Card key={planet.id}>
                        <CardContent className="p-6">
                          <div className="text-center">
                            <div className="w-16 h-16 rounded-full mx-auto mb-4 overflow-hidden">
                              <PlanetImage planet={planet} size={64} />
                            </div>
                            <h3 className="text-xl font-bold mb-2">{planet.portuguese_name}</h3>
                            <div className="text-3xl font-bold text-primary mb-2">
                              {calculateWeight(planet)} kg
                            </div>
                            <p className="text-sm text-muted-foreground">
                              Gravidade: {planet.gravity} m/s²
                            </p>
                            <div className="mt-4">
                              <div className="text-sm text-muted-foreground mb-1">Comparação com a Terra:</div>
                              <div className={`text-lg font-semibold ${
                                planet.gravity > 9.81 ? 'text-destructive' : 
                                planet.gravity < 9.81 ? 'text-chart-5' : 'text-primary'
                              }`}>
                                {planet.gravity > 9.81 ? 'Mais pesado' : 
                                 planet.gravity < 9.81 ? 'Mais leve' : 'Igual'}
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="physical">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Globe className="h-6 w-6" />
                    Características Físicas
                  </CardTitle>
                  <CardDescription>
                    Massa, raio e outras propriedades físicas
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-border">
                          <th className="text-left p-4">Planeta</th>
                          <th className="text-right p-4">Massa</th>
                          <th className="text-right p-4">Raio</th>
                          <th className="text-right p-4">Gravidade</th>
                          <th className="text-right p-4">Luas</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedPlanets.map((planet) => (
                          <tr key={planet.id} className="border-b border-border">
                            <td className="p-4">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full overflow-hidden">
                                  <PlanetImage planet={planet} size={32} />
                                </div>
                                <span className="font-semibold">{planet.portuguese_name}</span>
                              </div>
                            </td>
                            <td className="text-right p-4">{formatPlanetValue(planet, 'mass')}</td>
                            <td className="text-right p-4">{formatPlanetValue(planet, 'radius')}</td>
                            <td className="text-right p-4">{formatPlanetValue(planet, 'gravity')}</td>
                            <td className="text-right p-4">{formatPlanetValue(planet, 'moons_count')}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="orbital">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-6 w-6" />
                    Características Orbitais
                  </CardTitle>
                  <CardDescription>
                    Distância do Sol, períodos orbital e de rotação
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-border">
                          <th className="text-left p-4">Planeta</th>
                          <th className="text-right p-4">Distância do Sol</th>
                          <th className="text-right p-4">Período Orbital</th>
                          <th className="text-right p-4">Período de Rotação</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedPlanets.map((planet) => (
                          <tr key={planet.id} className="border-b border-border">
                            <td className="p-4">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full overflow-hidden">
                                  <PlanetImage planet={planet} size={32} />
                                </div>
                                <span className="font-semibold">{planet.portuguese_name}</span>
                              </div>
                            </td>
                            <td className="text-right p-4">{formatPlanetValue(planet, 'distance')}</td>
                            <td className="text-right p-4">{formatPlanetValue(planet, 'orbital_period')}</td>
                            <td className="text-right p-4">{formatPlanetValue(planet, 'rotation_period')}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="environment">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Thermometer className="h-6 w-6" />
                    Ambiente e Temperatura
                  </CardTitle>
                  <CardDescription>
                    Temperatura média e condições ambientais
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {selectedPlanets.map((planet) => (
                      <Card key={planet.id} className="bg-white/5 border-white/10">
                        <CardContent className="p-6">
                          <div className="text-center">
                            <div className="w-16 h-16 rounded-full mx-auto mb-4 overflow-hidden">
                              <PlanetImage planet={planet} size={64} />
                            </div>
                            <h3 className="text-xl font-bold mb-2">{planet.portuguese_name}</h3>
                            <div className="text-3xl font-bold text-chart-5 mb-2">
                              {formatPlanetValue(planet, 'temperature')}
                            </div>
                            <p className="text-sm text-muted-foreground mb-4">
                              {planet.description}
                            </p>
                            <div className="space-y-2">
                              <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Gravidade:</span>
                                <span>{formatPlanetValue(planet, 'gravity')}</span>
                              </div>
                              <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Luas:</span>
                                <span>{formatPlanetValue(planet, 'moons_count')}</span>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        )}

        {selectedPlanets.length < 2 && (
          <Card>
            <CardContent className="text-center py-12">
              <BarChart3 className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">
                Selecione pelo menos 2 planetas
              </h3>
              <p className="text-muted-foreground">
                Escolha planetas para ver a comparação detalhada
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}