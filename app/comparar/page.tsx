"use client"

import { useState, useEffect } from "react"
import { Navigation } from "@/components/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { LoadingSpinner } from "@/components/loading-spinner"
import { PlanetComparison } from "@/components/planets/planet-comparison"
import type { Planet } from "@/lib/api"
import { BarChart3, Plus, X } from "lucide-react"

export default function CompararPage() {
  const [selectedPlanets, setSelectedPlanets] = useState<Planet[]>([])
  const [availablePlanets, setAvailablePlanets] = useState<Planet[]>([])
  const [loading, setLoading] = useState(true)

  // Mock planets data
  const mockPlanets: Planet[] = [
    {
      id: 1,
      name: "mercury",
      portuguese_name: "Mercúrio",
      radius: 2439,
      mass: 3.3011e23,
      gravity: 3.7,
      average_temperature: 167,
      distance_from_sun: 57910000,
      orbital_period: 88,
      rotation_period: 1407.6,
      description: "O menor planeta do Sistema Solar e o mais próximo do Sol.",
      curiosities: [],
      image_url: "/mercury-texture.png",
      color: "#8C7853",
      moons_count: 0,
      created_at: "2024-01-01",
      updated_at: "2024-01-01",
    },
    {
      id: 2,
      name: "venus",
      portuguese_name: "Vênus",
      radius: 6051,
      mass: 4.8675e24,
      gravity: 8.87,
      average_temperature: 464,
      distance_from_sun: 108200000,
      orbital_period: 225,
      rotation_period: -5832.5,
      description: "O planeta mais quente do Sistema Solar devido ao efeito estufa.",
      curiosities: [],
      image_url: "/venus-texture.png",
      color: "#FFC649",
      moons_count: 0,
      created_at: "2024-01-01",
      updated_at: "2024-01-01",
    },
    {
      id: 3,
      name: "earth",
      portuguese_name: "Terra",
      radius: 6371,
      mass: 5.972e24,
      gravity: 9.8,
      average_temperature: 15,
      distance_from_sun: 149600000,
      orbital_period: 365.25,
      rotation_period: 24,
      description: "Nosso planeta natal, o único conhecido com vida.",
      curiosities: [],
      image_url: "/earth-planet-texture-blue-green.jpg",
      color: "#6B93D6",
      moons_count: 1,
      created_at: "2024-01-01",
      updated_at: "2024-01-01",
    },
    {
      id: 4,
      name: "mars",
      portuguese_name: "Marte",
      radius: 3389,
      mass: 6.4171e23,
      gravity: 3.71,
      average_temperature: -65,
      distance_from_sun: 227900000,
      orbital_period: 687,
      rotation_period: 24.6,
      description: "O planeta vermelho, alvo de futuras missões tripuladas.",
      curiosities: [],
      image_url: "/mars-red-texture.png",
      color: "#CD5C5C",
      moons_count: 2,
      created_at: "2024-01-01",
      updated_at: "2024-01-01",
    },
    {
      id: 5,
      name: "jupiter",
      portuguese_name: "Júpiter",
      radius: 69911,
      mass: 1.8982e27,
      gravity: 24.79,
      average_temperature: -110,
      distance_from_sun: 778500000,
      orbital_period: 4333,
      rotation_period: 9.9,
      description: "O maior planeta do Sistema Solar, um gigante gasoso.",
      curiosities: [],
      image_url: "/jupiter-gas-giant-planet-texture-bands.jpg",
      color: "#D8CA9D",
      moons_count: 95,
      created_at: "2024-01-01",
      updated_at: "2024-01-01",
    },
  ]

  useEffect(() => {
    // Simulate loading
    setTimeout(() => {
      setAvailablePlanets(mockPlanets)
      setLoading(false)
    }, 1000)
  }, [])

  const addPlanet = (planet: Planet) => {
    if (selectedPlanets.length < 3 && !selectedPlanets.find((p) => p.id === planet.id)) {
      setSelectedPlanets([...selectedPlanets, planet])
    }
  }

  const removePlanet = (planetId: number) => {
    setSelectedPlanets(selectedPlanets.filter((p) => p.id !== planetId))
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
          <div className="text-center">
            <LoadingSpinner size="lg" className="mb-4" />
            <p className="text-lg text-muted-foreground">Carregando planetas...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">Comparar Planetas</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Compare diferentes planetas do Sistema Solar lado a lado e descubra suas diferenças e semelhanças
          </p>
        </div>

        {/* Planet Selection */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Selecionar Planetas
            </CardTitle>
            <CardDescription>
              Escolha até 3 planetas para comparar (atualmente {selectedPlanets.length}/3 selecionados)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
              {availablePlanets.map((planet) => {
                const isSelected = selectedPlanets.find((p) => p.id === planet.id)
                const canAdd = selectedPlanets.length < 3

                return (
                  <div
                    key={planet.id}
                    className={`p-4 rounded-lg border cursor-pointer transition-all ${
                      isSelected
                        ? "bg-primary/10 border-primary/20"
                        : canAdd
                          ? "hover:bg-muted/50 border-border"
                          : "opacity-50 cursor-not-allowed border-border"
                    }`}
                    onClick={() => {
                      if (isSelected) {
                        removePlanet(planet.id)
                      } else if (canAdd) {
                        addPlanet(planet)
                      }
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-6 h-6 rounded-full" style={{ backgroundColor: planet.color }} />
                        <div>
                          <p className="font-medium">{planet.portuguese_name}</p>
                          <p className="text-sm text-muted-foreground">{planet.name}</p>
                        </div>
                      </div>
                      {isSelected ? (
                        <Badge variant="default">
                          <X className="h-3 w-3 mr-1" />
                          Remover
                        </Badge>
                      ) : (
                        canAdd && (
                          <Badge variant="outline">
                            <Plus className="h-3 w-3 mr-1" />
                            Adicionar
                          </Badge>
                        )
                      )}
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Selected Planets */}
            {selectedPlanets.length > 0 && (
              <div>
                <h3 className="font-medium mb-3">Planetas Selecionados:</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedPlanets.map((planet) => (
                    <Badge key={planet.id} variant="default" className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: planet.color }} />
                      {planet.portuguese_name}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-4 w-4 p-0 hover:bg-transparent"
                        onClick={() => removePlanet(planet.id)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Comparison Results */}
        {selectedPlanets.length >= 2 && (
          <div className="space-y-8">
            {selectedPlanets.slice(0, -1).map((planet, index) => (
              <div key={`${planet.id}-comparison`}>
                <h2 className="text-2xl font-bold mb-4 text-center">
                  {planet.portuguese_name} vs {selectedPlanets[index + 1]?.portuguese_name}
                </h2>
                <PlanetComparison currentPlanet={planet} />
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {selectedPlanets.length < 2 && (
          <Card>
            <CardContent className="text-center py-12">
              <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">Selecione pelo menos 2 planetas</h3>
              <p className="text-muted-foreground">
                Escolha planetas acima para começar a comparação e descobrir suas diferenças
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
