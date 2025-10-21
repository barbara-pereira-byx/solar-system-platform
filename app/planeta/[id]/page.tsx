"use client"

import { useParams, useRouter } from "next/navigation"
import { Navigation } from "@/components/navigation"
import { PlanetDetail } from "@/components/planets/planet-detail"
import { FIXED_PLANETS, getPlanetByName, type Planet } from "@/lib/planets-data"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { ArrowLeft, AlertTriangle } from "lucide-react"

export default function PlanetPage() {
  const params = useParams()
  const router = useRouter()
  
  // Buscar planeta pelos dados fixos usando o nome do parâmetro
  const planetName = params.id as string
  const planet = getPlanetByName(planetName)

  if (!planet) {
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
            <AlertDescription>Planeta não encontrado</AlertDescription>
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
