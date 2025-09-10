"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { Planet } from "@/lib/api"
import { formatMass, formatTemperature, formatPeriod } from "@/lib/api"
import { BarChart3, Globe, Scale, Thermometer, User, Calculator } from "lucide-react"
import Image from "next/image"

interface PlanetComparisonProps {
  currentPlanet: Planet
}

export function PlanetComparison({ currentPlanet }: PlanetComparisonProps) {
  const [selectedPlanet, setSelectedPlanet] = useState<Planet | null>(null)
  const [userWeight, setUserWeight] = useState<number>(70)

  // Mock planets data - in real app, this would come from API
  const allPlanets: Planet[] = [
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

  const availablePlanets = allPlanets.filter((p) => p.id !== currentPlanet.id)

  const getComparisonValue = (value1: number, value2: number) => {
    const ratio = value1 / value2
    if (ratio > 1) {
      return `${ratio.toFixed(1)}x maior`
    } else {
      return `${(1 / ratio).toFixed(1)}x menor`
    }
  }

  const getProgressValue = (value1: number, value2: number) => {
    const max = Math.max(value1, value2)
    return (value1 / max) * 100
  }

  const calculateWeight = (gravity: number) => {
    return ((userWeight * gravity) / 9.8).toFixed(1)
  }

  return (
    <div className="space-y-6">
      {/* Planet Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Comparar Planetas
          </CardTitle>
          <CardDescription>Compare {currentPlanet.portuguese_name} com outro planeta do Sistema Solar</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 items-center flex-wrap">
            <div className="flex items-center gap-3 p-3 rounded-lg border bg-muted/50">
              <Image
                src={currentPlanet.image_url || "/placeholder.svg"}
                alt={currentPlanet.portuguese_name}
                width={40}
                height={40}
                className="rounded-full"
              />
              <div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: currentPlanet.color }} />
                  <span className="font-medium">{currentPlanet.portuguese_name}</span>
                </div>
                <span className="text-xs text-muted-foreground">{currentPlanet.name}</span>
              </div>
            </div>

            <span className="text-muted-foreground font-medium">VS</span>

            <Select
              onValueChange={(value) => {
                const planet = availablePlanets.find((p) => p.id.toString() === value)
                setSelectedPlanet(planet || null)
              }}
            >
              <SelectTrigger className="w-64">
                <SelectValue placeholder="Selecione um planeta para comparar" />
              </SelectTrigger>
              <SelectContent>
                {availablePlanets.map((planet) => (
                  <SelectItem key={planet.id} value={planet.id.toString()}>
                    <div className="flex items-center gap-3">
                      <Image
                        src={planet.image_url || "/placeholder.svg"}
                        alt={planet.portuguese_name}
                        width={24}
                        height={24}
                        className="rounded-full"
                      />
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: planet.color }} />
                        {planet.portuguese_name}
                      </div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5" />
            Calculadora de Peso
          </CardTitle>
          <CardDescription>Descubra quanto você pesaria em diferentes planetas</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <Label htmlFor="weight">Seu peso na Terra (kg)</Label>
              <Input
                id="weight"
                type="number"
                value={userWeight}
                onChange={(e) => setUserWeight(Number(e.target.value) || 70)}
                className="mt-1"
                min="1"
                max="500"
              />
            </div>
            <div className="flex items-center gap-2 text-sm">
              <User className="h-4 w-4" />
              <span className="text-muted-foreground">Pessoa de referência</span>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="text-center p-4 rounded-lg border bg-muted/50">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Image
                  src={currentPlanet.image_url || "/placeholder.svg"}
                  alt={currentPlanet.portuguese_name}
                  width={32}
                  height={32}
                  className="rounded-full"
                />
                <span className="font-medium text-sm">{currentPlanet.portuguese_name}</span>
              </div>
              <p className="text-2xl font-bold text-primary">{calculateWeight(currentPlanet.gravity)} kg</p>
              <p className="text-xs text-muted-foreground">Gravidade: {currentPlanet.gravity} m/s²</p>
            </div>

            {selectedPlanet && (
              <div className="text-center p-4 rounded-lg border bg-muted/50">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Image
                    src={selectedPlanet.image_url || "/placeholder.svg"}
                    alt={selectedPlanet.portuguese_name}
                    width={32}
                    height={32}
                    className="rounded-full"
                  />
                  <span className="font-medium text-sm">{selectedPlanet.portuguese_name}</span>
                </div>
                <p className="text-2xl font-bold text-primary">{calculateWeight(selectedPlanet.gravity)} kg</p>
                <p className="text-xs text-muted-foreground">Gravidade: {selectedPlanet.gravity} m/s²</p>
              </div>
            )}

            {/* Earth reference */}
            <div className="text-center p-4 rounded-lg border bg-primary/10">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Image
                  src="/earth-planet-texture-blue-green.jpg"
                  alt="Terra"
                  width={32}
                  height={32}
                  className="rounded-full"
                />
                <span className="font-medium text-sm">Terra (Referência)</span>
              </div>
              <p className="text-2xl font-bold">{userWeight} kg</p>
              <p className="text-xs text-muted-foreground">Gravidade: 9.8 m/s²</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Comparison Results */}
      {selectedPlanet && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                Comparação Visual de Tamanho
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-center gap-8">
                <div className="text-center">
                  <div className="relative mb-3">
                    <Image
                      src={currentPlanet.image_url || "/placeholder.svg"}
                      alt={currentPlanet.portuguese_name}
                      width={Math.min(currentPlanet.radius / 100, 120)}
                      height={Math.min(currentPlanet.radius / 100, 120)}
                      className="rounded-full mx-auto"
                    />
                  </div>
                  <h3 className="font-medium">{currentPlanet.portuguese_name}</h3>
                  <p className="text-sm text-muted-foreground">{currentPlanet.radius.toLocaleString()} km</p>
                </div>

                <div className="text-center">
                  <div className="relative mb-3">
                    <Image
                      src={selectedPlanet.image_url || "/placeholder.svg"}
                      alt={selectedPlanet.portuguese_name}
                      width={Math.min(selectedPlanet.radius / 100, 120)}
                      height={Math.min(selectedPlanet.radius / 100, 120)}
                      className="rounded-full mx-auto"
                    />
                  </div>
                  <h3 className="font-medium">{selectedPlanet.portuguese_name}</h3>
                  <p className="text-sm text-muted-foreground">{selectedPlanet.radius.toLocaleString()} km</p>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">Comparação de Raio</span>
                  <span className="text-sm text-muted-foreground">
                    {getComparisonValue(currentPlanet.radius, selectedPlanet.radius)}
                  </span>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full" style={{ backgroundColor: currentPlanet.color }} />
                    <span className="text-sm w-20">{currentPlanet.portuguese_name}</span>
                    <Progress
                      value={getProgressValue(currentPlanet.radius, selectedPlanet.radius)}
                      className="flex-1 h-2"
                    />
                    <span className="text-sm w-24 text-right">{currentPlanet.radius.toLocaleString()} km</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full" style={{ backgroundColor: selectedPlanet.color }} />
                    <span className="text-sm w-20">{selectedPlanet.portuguese_name}</span>
                    <Progress
                      value={getProgressValue(selectedPlanet.radius, currentPlanet.radius)}
                      className="flex-1 h-2"
                    />
                    <span className="text-sm w-24 text-right">{selectedPlanet.radius.toLocaleString()} km</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Size Comparison */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                Comparação de Tamanho
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">Raio</span>
                  <span className="text-sm text-muted-foreground">
                    {getComparisonValue(currentPlanet.radius, selectedPlanet.radius)}
                  </span>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full" style={{ backgroundColor: currentPlanet.color }} />
                    <span className="text-sm w-20">{currentPlanet.portuguese_name}</span>
                    <Progress
                      value={getProgressValue(currentPlanet.radius, selectedPlanet.radius)}
                      className="flex-1 h-2"
                    />
                    <span className="text-sm w-24 text-right">{currentPlanet.radius.toLocaleString()} km</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full" style={{ backgroundColor: selectedPlanet.color }} />
                    <span className="text-sm w-20">{selectedPlanet.portuguese_name}</span>
                    <Progress
                      value={getProgressValue(selectedPlanet.radius, currentPlanet.radius)}
                      className="flex-1 h-2"
                    />
                    <span className="text-sm w-24 text-right">{selectedPlanet.radius.toLocaleString()} km</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Physical Properties */}
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Scale className="h-5 w-5" />
                  Massa e Gravidade
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm font-medium mb-2">Massa</p>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">{currentPlanet.portuguese_name}</p>
                      <p className="font-medium">{formatMass(currentPlanet.mass)}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">{selectedPlanet.portuguese_name}</p>
                      <p className="font-medium">{formatMass(selectedPlanet.mass)}</p>
                    </div>
                  </div>
                  <Badge variant="outline" className="mt-2 text-xs">
                    {getComparisonValue(currentPlanet.mass, selectedPlanet.mass)}
                  </Badge>
                </div>

                <div>
                  <p className="text-sm font-medium mb-2">Gravidade</p>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">{currentPlanet.portuguese_name}</p>
                      <p className="font-medium">{currentPlanet.gravity} m/s²</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">{selectedPlanet.portuguese_name}</p>
                      <p className="font-medium">{selectedPlanet.gravity} m/s²</p>
                    </div>
                  </div>
                  <Badge variant="outline" className="mt-2 text-xs">
                    {getComparisonValue(currentPlanet.gravity, selectedPlanet.gravity)}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Thermometer className="h-5 w-5" />
                  Temperatura e Órbita
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm font-medium mb-2">Temperatura Média</p>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">{currentPlanet.portuguese_name}</p>
                      <p className="font-medium">{formatTemperature(currentPlanet.average_temperature)}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">{selectedPlanet.portuguese_name}</p>
                      <p className="font-medium">{formatTemperature(selectedPlanet.average_temperature)}</p>
                    </div>
                  </div>
                  <Badge variant="outline" className="mt-2 text-xs">
                    Diferença: {Math.abs(currentPlanet.average_temperature - selectedPlanet.average_temperature)}°C
                  </Badge>
                </div>

                <div>
                  <p className="text-sm font-medium mb-2">Período Orbital</p>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">{currentPlanet.portuguese_name}</p>
                      <p className="font-medium">{formatPeriod(currentPlanet.orbital_period)}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">{selectedPlanet.portuguese_name}</p>
                      <p className="font-medium">{formatPeriod(selectedPlanet.orbital_period)}</p>
                    </div>
                  </div>
                  <Badge variant="outline" className="mt-2 text-xs">
                    {getComparisonValue(currentPlanet.orbital_period, selectedPlanet.orbital_period)}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Resumo da Comparação</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium mb-3 flex items-center gap-2">
                    <Image
                      src={currentPlanet.image_url || "/placeholder.svg"}
                      alt={currentPlanet.portuguese_name}
                      width={24}
                      height={24}
                      className="rounded-full"
                    />
                    {currentPlanet.portuguese_name}
                  </h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• {currentPlanet.radius > selectedPlanet.radius ? "Maior" : "Menor"} em tamanho</li>
                    <li>• {currentPlanet.mass > selectedPlanet.mass ? "Mais" : "Menos"} massivo</li>
                    <li>• {currentPlanet.gravity > selectedPlanet.gravity ? "Maior" : "Menor"} gravidade</li>
                    <li>
                      •{" "}
                      {currentPlanet.average_temperature > selectedPlanet.average_temperature
                        ? "Mais quente"
                        : "Mais frio"}
                    </li>
                    <li>
                      •{" "}
                      {currentPlanet.distance_from_sun < selectedPlanet.distance_from_sun
                        ? "Mais próximo"
                        : "Mais distante"}{" "}
                      do Sol
                    </li>
                    <li>• Você pesaria {calculateWeight(currentPlanet.gravity)} kg aqui</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium mb-3 flex items-center gap-2">
                    <Image
                      src={selectedPlanet.image_url || "/placeholder.svg"}
                      alt={selectedPlanet.portuguese_name}
                      width={24}
                      height={24}
                      className="rounded-full"
                    />
                    {selectedPlanet.portuguese_name}
                  </h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• {selectedPlanet.radius > currentPlanet.radius ? "Maior" : "Menor"} em tamanho</li>
                    <li>• {selectedPlanet.mass > currentPlanet.mass ? "Mais" : "Menos"} massivo</li>
                    <li>• {selectedPlanet.gravity > currentPlanet.gravity ? "Maior" : "Menor"} gravidade</li>
                    <li>
                      •{" "}
                      {selectedPlanet.average_temperature > currentPlanet.average_temperature
                        ? "Mais quente"
                        : "Mais frio"}
                    </li>
                    <li>
                      •{" "}
                      {selectedPlanet.distance_from_sun < currentPlanet.distance_from_sun
                        ? "Mais próximo"
                        : "Mais distante"}{" "}
                      do Sol
                    </li>
                    <li>• Você pesaria {calculateWeight(selectedPlanet.gravity)} kg aqui</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
