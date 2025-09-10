"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import type { Planet } from "@/lib/api"
import { Play, Pause, RotateCcw, Settings } from "lucide-react"

interface SolarSystemControlsProps {
  planets: Planet[]
  selectedPlanet?: Planet | null
  onPlanetSelect?: (planet: Planet | null) => void
  className?: string
}

export function SolarSystemControls({ planets, selectedPlanet, onPlanetSelect, className }: SolarSystemControlsProps) {
  const [isPlaying, setIsPlaying] = useState(true)
  const [speed, setSpeed] = useState([1])
  const [showOrbits, setShowOrbits] = useState(true)
  const [showLabels, setShowLabels] = useState(true)

  return (
    <div className={className}>
      {/* Main Controls */}
      <Card className="mb-4">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Controles da Simulação
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Play/Pause */}
          <div className="flex items-center gap-2">
            <Button variant={isPlaying ? "default" : "outline"} size="sm" onClick={() => setIsPlaying(!isPlaying)}>
              {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              {isPlaying ? "Pausar" : "Reproduzir"}
            </Button>
            <Button variant="outline" size="sm">
              <RotateCcw className="h-4 w-4" />
              Reiniciar
            </Button>
          </div>

          {/* Speed Control */}
          <div className="space-y-2">
            <Label>Velocidade da Simulação</Label>
            <Slider value={speed} onValueChange={setSpeed} max={5} min={0.1} step={0.1} className="w-full" />
            <div className="text-sm text-muted-foreground">{speed[0]}x velocidade normal</div>
          </div>

          {/* Display Options */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label htmlFor="show-orbits">Mostrar Órbitas</Label>
              <Switch id="show-orbits" checked={showOrbits} onCheckedChange={setShowOrbits} />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="show-labels">Mostrar Nomes</Label>
              <Switch id="show-labels" checked={showLabels} onCheckedChange={setShowLabels} />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Planet Selection */}
      <Card className="mb-4">
        <CardHeader>
          <CardTitle>Planetas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-2">
            {planets.map((planet) => (
              <Button
                key={planet.id}
                variant={selectedPlanet?.id === planet.id ? "default" : "outline"}
                size="sm"
                onClick={() => onPlanetSelect?.(planet)}
                className="justify-start text-left"
              >
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: planet.color || "#888888" }} />
                  <span className="truncate">{planet.portuguese_name}</span>
                </div>
              </Button>
            ))}
          </div>
          {selectedPlanet && (
            <Button variant="ghost" size="sm" onClick={() => onPlanetSelect?.(null)} className="w-full mt-2">
              Limpar Seleção
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Quick Stats */}
      {selectedPlanet && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full" style={{ backgroundColor: selectedPlanet.color || "#888888" }} />
              {selectedPlanet.portuguese_name}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <span className="text-muted-foreground">Raio:</span>
                <p className="font-medium">{selectedPlanet.radius.toLocaleString()} km</p>
              </div>
              <div>
                <span className="text-muted-foreground">Luas:</span>
                <p className="font-medium">{selectedPlanet.moons_count}</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-1 mt-2">
              <Badge variant="secondary" className="text-xs">
                {selectedPlanet.average_temperature}°C
              </Badge>
              <Badge variant="outline" className="text-xs">
                {selectedPlanet.gravity} m/s²
              </Badge>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
