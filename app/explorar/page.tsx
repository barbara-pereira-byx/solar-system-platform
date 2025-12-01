"use client"

import { useState } from "react"
import { Navigation } from "@/components/navigation"
import { WorkingSolarSystem } from "@/components/solar-system/working-solar-system"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Eye } from "lucide-react"
import { FIXED_PLANETS, type Planet, type Moon } from "@/lib/planets-data"
import type { Asteroid } from "@/lib/asteroids-data"

export default function ExplorarPage() {
  const [selectedPlanet, setSelectedPlanet] = useState<Planet | Moon | Asteroid | null>(null)
  
  // Usar dados fixos dos planetas
  const planets = FIXED_PLANETS

  // Funções para focar em diferentes objetos do sistema solar
  const focusOnAsteroidBelt = () => {
    if (typeof window !== 'undefined' && (window as any).focusOnAsteroidBelt) {
      ;(window as any).focusOnAsteroidBelt()
    }
  }

  const focusOnPluto = () => {
    if (typeof window !== 'undefined' && (window as any).focusOnPluto) {
      ;(window as any).focusOnPluto()
    }
  }

  const focusOnKuiperBelt = () => {
    if (typeof window !== 'undefined' && (window as any).focusOnKuiperBelt) {
      ;(window as any).focusOnKuiperBelt()
    }
  }

  const focusOnOortCloud = () => {
    if (typeof window !== 'undefined' && (window as any).focusOnOortCloud) {
      ;(window as any).focusOnOortCloud()
    }
  }

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
                <div className="flex items-center justify-between mb-1">
                  <h4 className="font-semibold" style={{ color: '#8B7355' }}>Cinturão de Asteroides</h4>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-7 px-2 text-xs"
                    onClick={focusOnAsteroidBelt}
                  >
                    <Eye className="h-3 w-3 mr-1" />
                    Ver
                  </Button>
                </div>
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
                <div className="flex items-center justify-between mb-1">
                  <h4 className="font-semibold" style={{ color: '#20B2AA' }}>Cinturão de Kuiper</h4>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-7 px-2 text-xs"
                    onClick={focusOnKuiperBelt}
                  >
                    <Eye className="h-3 w-3 mr-1" />
                    Ver
                  </Button>
                </div>
                <p className="text-muted-foreground text-xs mb-1">
                  Além de Netuno (pontos verde-água)
                </p>
                <ul className="text-xs space-y-0.5 text-muted-foreground">
                  <li>• Éris: Mais massivo que Plutão</li>
                  <li>• Makemake: Superfície rica em metano</li>
                  <li>• Objetos gelados ricos em gelo e rocha</li>
                </ul>
              </div>
              
              <div>
                <div className="flex items-center justify-between mb-1">
                  <h4 className="font-semibold" style={{ color: '#87CEEB' }}>Nuvem de Oort</h4>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-7 px-2 text-xs"
                    onClick={focusOnOortCloud}
                  >
                    <Eye className="h-3 w-3 mr-1" />
                    Ver
                  </Button>
                </div>
                <p className="text-muted-foreground text-xs mb-1">
                  Esfera ao redor do sistema (pontos brilhantes)
                </p>
                <ul className="text-xs space-y-0.5 text-muted-foreground">
                  <li>• Trilhões de cometas gelados</li>
                  <li>• Limite gravitacional do Sistema Solar</li>
                  <li>• Fonte dos cometas de período longo</li>
                </ul>
              </div>
              
              <div>
                <div className="flex items-center justify-between mb-1">
                  <h4 className="font-semibold" style={{ color: '#9370DB' }}>Cometa Encke</h4>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-7 px-2 text-xs"
                    onClick={() => {
                      if (typeof window !== 'undefined' && (window as any).focusOnInnerSystem) {
                        ;(window as any).focusOnInnerSystem()
                      }
                    }}
                  >
                    <Eye className="h-3 w-3 mr-1" />
                    Ver
                  </Button>
                </div>
                <p className="text-muted-foreground text-xs mb-1">
                  Sistema solar interno (ponto brilhante)
                </p>
                <ul className="text-xs space-y-0.5 text-muted-foreground">
                  <li>• Período orbital mais curto (3,3 anos)</li>
                  <li>• Origem da chuva de meteoros Taurídas</li>
                  <li>• Núcleo pequeno de aproximadamente 4,8 km</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
