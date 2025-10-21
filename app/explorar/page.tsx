"use client"

import { useState } from "react"
import { Navigation } from "@/components/navigation"
import { SolarSystem3D } from "@/components/solar-system/solar-system-3d"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FIXED_PLANETS, type Planet } from "@/lib/planets-data"

export default function ExplorarPage() {
  const [selectedPlanet, setSelectedPlanet] = useState<Planet | null>(null)
  
  // Usar dados fixos dos planetas
  const planets = FIXED_PLANETS

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
