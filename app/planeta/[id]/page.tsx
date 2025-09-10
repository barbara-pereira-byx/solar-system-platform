"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Navigation } from "@/components/navigation"
import { PlanetDetail } from "@/components/planets/planet-detail"
import { LoadingSpinner } from "@/components/loading-spinner"
import type { Planet } from "@/lib/api"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { ArrowLeft, AlertTriangle } from "lucide-react"

export default function PlanetPage() {
  const params = useParams()
  const router = useRouter()
  const [planet, setPlanet] = useState<Planet | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadPlanet = async () => {
      try {
        setLoading(true)
        setError(null)

        const planetId = Number.parseInt(params.id as string)
        if (isNaN(planetId)) {
          setError("ID do planeta inválido")
          return
        }

        // Mock data for demo - replace with API call
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
            description:
              "Mercúrio é o menor planeta do Sistema Solar e o mais próximo do Sol. Sua superfície é coberta por crateras, semelhante à Lua, resultado de bilhões de anos de impactos de meteoritos.",
            curiosities: [
              "Não possui atmosfera significativa",
              "Temperaturas variam de -173°C a 427°C",
              "Um dia em Mercúrio dura 176 dias terrestres",
              "É o planeta com maior variação de temperatura",
            ],
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
            description:
              "Vênus é o planeta mais quente do Sistema Solar devido ao intenso efeito estufa causado por sua densa atmosfera de dióxido de carbono. É frequentemente chamado de 'planeta irmão' da Terra devido ao tamanho similar.",
            curiosities: [
              "Rotação retrógrada (gira no sentido contrário)",
              "Atmosfera 90 vezes mais densa que a Terra",
              "Chuvas de ácido sulfúrico",
              "Pressão atmosférica equivalente a 900m de profundidade no oceano",
            ],
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
            description:
              "A Terra é o terceiro planeta do Sistema Solar e o único conhecido que abriga vida. Possui uma atmosfera rica em oxigênio e nitrogênio, além de vastos oceanos que cobrem 71% de sua superfície.",
            curiosities: [
              "71% da superfície é coberta por água",
              "Possui campo magnético protetor",
              "Única lua natural relativamente grande",
              "Placas tectônicas ativas",
            ],
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
            description:
              "Marte, conhecido como o 'Planeta Vermelho', é o quarto planeta do Sistema Solar. Sua cor característica vem do óxido de ferro (ferrugem) presente em sua superfície. É o principal alvo para futuras missões tripuladas.",
            curiosities: [
              "Possui as maiores montanhas do Sistema Solar",
              "Evidências de água líquida no passado",
              "Tempestades de areia globais",
              "Calotas polares de gelo de água e CO2",
            ],
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
            description:
              "Júpiter é o maior planeta do Sistema Solar, um gigante gasoso com mais massa que todos os outros planetas combinados. Sua Grande Mancha Vermelha é uma tempestade maior que a Terra que dura há séculos.",
            curiosities: [
              "Grande Mancha Vermelha é uma tempestade gigante",
              "Mais de 95 luas conhecidas",
              "Protege planetas internos de asteroides",
              "Poderia ter se tornado uma estrela se fosse maior",
            ],
            image_url: "/jupiter-gas-giant-planet-texture-bands.jpg",
            color: "#D8CA9D",
            moons_count: 95,
            created_at: "2024-01-01",
            updated_at: "2024-01-01",
          },
        ]

        const foundPlanet = mockPlanets.find((p) => p.id === planetId)
        if (!foundPlanet) {
          setError("Planeta não encontrado")
          return
        }

        setPlanet(foundPlanet)
      } catch (err) {
        setError("Erro ao carregar informações do planeta")
        console.error("Error loading planet:", err)
      } finally {
        setLoading(false)
      }
    }

    loadPlanet()
  }, [params.id])

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
          <div className="text-center">
            <LoadingSpinner size="lg" className="mb-4" />
            <p className="text-lg text-muted-foreground">Carregando informações do planeta...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error || !planet) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <Button variant="ghost" onClick={() => router.back()} className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>{error || "Planeta não encontrado"}</AlertDescription>
          </Alert>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <PlanetDetail planet={planet} />
    </div>
  )
}
