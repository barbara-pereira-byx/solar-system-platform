"use client"

import { useEffect, useState } from "react"
import { Navigation } from "@/components/navigation"
import { SolarSystem3D } from "@/components/solar-system/solar-system-3d"
import { SolarSystemControls } from "@/components/solar-system/solar-system-controls"
import { LoadingSpinner } from "@/components/loading-spinner"
import { apiClient, type Planet } from "@/lib/api"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertTriangle } from "lucide-react"

export default function ExplorarPage() {
  const [planets, setPlanets] = useState<Planet[]>([])
  const [selectedPlanet, setSelectedPlanet] = useState<Planet | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadPlanets = async () => {
      try {
        setLoading(true)
        setError(null)

        // For demo purposes, we'll use mock data since the API might not be available
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
            curiosities: ["Não possui atmosfera", "Temperaturas extremas"],
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
            curiosities: ["Rotação retrógrada", "Atmosfera densa de CO2"],
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
            curiosities: ["71% da superfície é água", "Possui campo magnético protetor"],
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
            curiosities: ["Possui as maiores montanhas do Sistema Solar", "Evidências de água no passado"],
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
            curiosities: ["Grande Mancha Vermelha", "Mais de 80 luas conhecidas"],
            image_url: "/jupiter-gas-giant-planet-texture-bands.jpg",
            color: "#D8CA9D",
            moons_count: 95,
            created_at: "2024-01-01",
            updated_at: "2024-01-01",
          },
        ]

        // Try to fetch from API first, fallback to mock data
        try {
          const apiPlanets = await apiClient.getPlanets()
          setPlanets(apiPlanets)
        } catch (apiError) {
          console.warn("API not available, using mock data:", apiError)
          setPlanets(mockPlanets)
        }
      } catch (err) {
        setError("Erro ao carregar os planetas. Tente novamente.")
        console.error("Error loading planets:", err)
      } finally {
        setLoading(false)
      }
    }

    loadPlanets()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
          <div className="text-center">
            <LoadingSpinner size="lg" className="mb-4" />
            <p className="text-lg text-muted-foreground">Carregando Sistema Solar...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </div>
      </div>
    )
  }

  return (
    <div className="h-screen overflow-hidden bg-background">
      <Navigation />

      <div className="relative h-[calc(100vh-4rem)]">
        {/* 3D Solar System */}
        <div className="relative h-full">
          <SolarSystem3D planets={planets} selectedPlanet={selectedPlanet} onPlanetSelect={setSelectedPlanet} />
        </div>

        {/* Instructions */}
        <Card className="absolute bottom-4 right-4 w-80 bg-background/90 backdrop-blur-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Como Usar</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <ul className="text-sm text-muted-foreground space-y-2">
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                Clique e arraste para rotacionar a câmera
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                Use a roda do mouse para zoom
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                Clique nos planetas para ver informações
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                Pressione ESC para visão geral
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                Use os controles no canto superior esquerdo
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
