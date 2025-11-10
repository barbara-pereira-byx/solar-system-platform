"use client"

import { useState } from "react"
import { Navigation } from "@/components/navigation"
import { WorkingSolarSystem } from "@/components/solar-system/working-solar-system"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FIXED_PLANETS, type Planet, type Moon } from "@/lib/planets-data"
import type { Asteroid } from "@/lib/asteroids-data"

export default function ExplorarPage() {
  const [selectedPlanet, setSelectedPlanet] = useState<Planet | Moon | Asteroid | null>(null)
  
  // Usar dados fixos dos planetas
  const planets = FIXED_PLANETS

  return (
    <div className="h-screen overflow-hidden bg-background">
      <Navigation />

      <div className="relative h-[calc(100vh-4rem)]">
        {/* 3D Solar System */}
        <div className="relative h-full">
          <WorkingSolarSystem planets={planets} selectedPlanet={selectedPlanet} onPlanetSelect={setSelectedPlanet} />
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
                Clique nos planetas, asteroides e cometas para informações
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                Pressione ESC para visão geral
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                Use os controles para pausar e ajustar velocidade
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                Explore asteroides, cometas e a Nuvem de Oort
              </li>
            </ul>
          </CardContent>
        </Card>
        
        {/* Informações sobre Asteroides e Cometas */}
        <Card className="absolute bottom-4 left-4 w-80 bg-background/90 backdrop-blur-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Objetos do Sistema Solar</CardTitle>
          </CardHeader>
          <CardContent className="pt-0 max-h-64 overflow-y-auto">
            <div className="space-y-3 text-sm">
              <div>
                <h4 className="font-semibold text-primary mb-1">Cinturão de Asteroides</h4>
                <p className="text-muted-foreground text-xs mb-1">
                  Entre Marte e Júpiter (pontos marrons)
                </p>
                <ul className="text-xs space-y-0.5 text-muted-foreground">
                  <li>• Ceres: Maior asteroide (planeta anão)</li>
                  <li>• Vesta: Segundo maior, superfície basáltica</li>
                  <li>• Mais de 1 milhão de asteroides conhecidos</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold text-orange-400 mb-1">Plutão</h4>
                <p className="text-muted-foreground text-xs mb-1">
                  Planeta anão visível (ponto bege)
                </p>
                <ul className="text-xs space-y-0.5 text-muted-foreground">
                  <li>• Ex-nono planeta do Sistema Solar</li>
                  <li>• Reclassificado em 2006</li>
                  <li>• Possui 5 luas, incluindo Caronte</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold text-blue-400 mb-1">Cinturão de Kuiper</h4>
                <p className="text-muted-foreground text-xs mb-1">
                  Além de Netuno (pontos azuis)
                </p>
                <ul className="text-xs space-y-0.5 text-muted-foreground">
                  <li>• Éris: Mais massivo que Plutão</li>
                  <li>• Makemake: Superfície rica em metano</li>
                  <li>• Objetos gelados ricos em gelo e rocha</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold text-purple-400 mb-1">Nuvem de Oort</h4>
                <p className="text-muted-foreground text-xs mb-1">
                  Esfera ao redor do sistema (pontos brilhantes)
                </p>
                <ul className="text-xs space-y-0.5 text-muted-foreground">
                  <li>• Trilhões de cometas gelados</li>
                  <li>• Cometa Halley: Período de 75 anos</li>
                  <li>• Limite gravitacional do Sistema Solar</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
