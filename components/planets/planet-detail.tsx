"use client"

import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { WeightCalculator } from "./weight-calculator"
import { PlanetComparison } from "./planet-comparison"
import type { Planet } from "@/lib/api"
import { formatMass, formatDistance, formatTemperature, formatPeriod } from "@/lib/api"
import { ArrowLeft, Globe, Scale, Clock, Moon, Ruler } from "lucide-react"
import { useRouter } from "next/navigation"

interface PlanetDetailProps {
  planet: Planet
}

export function PlanetDetail({ planet }: PlanetDetailProps) {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("overview")

  // Calculate relative values for progress bars (Earth = 100%)
  const earthValues = {
    radius: 6371,
    mass: 5.972e24,
    gravity: 9.8,
    temperature: 15,
  }

  const getRelativeValue = (value: number, earthValue: number) => {
    return Math.min((value / earthValue) * 100, 500) // Cap at 500% for display
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      {/* Header */}
      <div className="border-b border-border/40 bg-background/95 backdrop-blur">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => router.back()}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar
            </Button>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full" style={{ backgroundColor: planet.color }} />
              <div>
                <h1 className="text-3xl font-bold">{planet.portuguese_name}</h1>
                <p className="text-muted-foreground">{planet.name.charAt(0).toUpperCase() + planet.name.slice(1)}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Planet Image */}
          <div className="lg:col-span-1">
            <Card className="overflow-hidden">
              <CardContent className="p-0">
                <div className="aspect-square relative bg-gradient-to-br from-muted to-muted/50">
                  <Image
                    src={planet.image_url || "/placeholder.svg"}
                    alt={planet.portuguese_name}
                    fill
                    className="object-cover"
                    priority
                  />
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5" />
                  Dados Rápidos
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="space-y-1">
                    <p className="text-muted-foreground">Raio</p>
                    <p className="font-medium">{planet.radius.toLocaleString()} km</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-muted-foreground">Massa</p>
                    <p className="font-medium">{formatMass(planet.mass)}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-muted-foreground">Gravidade</p>
                    <p className="font-medium">{planet.gravity} m/s²</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-muted-foreground">Temperatura</p>
                    <p className="font-medium">{formatTemperature(planet.average_temperature)}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-muted-foreground">Distância do Sol</p>
                    <p className="font-medium">{formatDistance(planet.distance_from_sun)}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-muted-foreground">Luas</p>
                    <p className="font-medium">{planet.moons_count}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">Visão Geral</TabsTrigger>
                <TabsTrigger value="data">Dados Científicos</TabsTrigger>
                <TabsTrigger value="calculator">Calculadora</TabsTrigger>
                <TabsTrigger value="compare">Comparar</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6">
                {/* Description */}
                <Card>
                  <CardHeader>
                    <CardTitle>Sobre {planet.portuguese_name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground leading-relaxed">{planet.description}</p>
                  </CardContent>
                </Card>

                {/* Curiosities */}
                <Card>
                  <CardHeader>
                    <CardTitle>Curiosidades</CardTitle>
                    <CardDescription>Fatos interessantes sobre {planet.portuguese_name}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {planet.curiosities.map((curiosity, index) => (
                        <div key={index} className="flex items-start gap-3">
                          <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                          <p className="text-sm text-muted-foreground">{curiosity}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Orbital Info */}
                <div className="grid md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Clock className="h-5 w-5" />
                        Períodos Orbitais
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Ano (órbita completa)</p>
                        <p className="text-lg font-semibold">{formatPeriod(planet.orbital_period)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Dia (rotação completa)</p>
                        <p className="text-lg font-semibold">
                          {planet.rotation_period > 0
                            ? `${planet.rotation_period.toFixed(1)} horas`
                            : `${Math.abs(planet.rotation_period).toFixed(1)} horas (retrógrado)`}
                        </p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Moon className="h-5 w-5" />
                        Sistema de Luas
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-center py-4">
                        <div className="text-3xl font-bold text-primary">{planet.moons_count}</div>
                        <p className="text-sm text-muted-foreground">
                          {planet.moons_count === 0
                            ? "Nenhuma lua conhecida"
                            : planet.moons_count === 1
                              ? "Lua natural"
                              : "Luas naturais conhecidas"}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="data" className="space-y-6">
                {/* Comparative Data */}
                <Card>
                  <CardHeader>
                    <CardTitle>Comparação com a Terra</CardTitle>
                    <CardDescription>Valores relativos usando a Terra como referência (100%)</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-medium flex items-center gap-2">
                            <Ruler className="h-4 w-4" />
                            Raio
                          </span>
                          <span className="text-sm text-muted-foreground">
                            {((planet.radius / earthValues.radius) * 100).toFixed(1)}% da Terra
                          </span>
                        </div>
                        <Progress value={getRelativeValue(planet.radius, earthValues.radius)} className="h-2" />
                      </div>

                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-medium flex items-center gap-2">
                            <Scale className="h-4 w-4" />
                            Massa
                          </span>
                          <span className="text-sm text-muted-foreground">
                            {((planet.mass / earthValues.mass) * 100).toFixed(1)}% da Terra
                          </span>
                        </div>
                        <Progress value={getRelativeValue(planet.mass, earthValues.mass)} className="h-2" />
                      </div>

                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-medium flex items-center gap-2">
                            <Globe className="h-4 w-4" />
                            Gravidade
                          </span>
                          <span className="text-sm text-muted-foreground">
                            {((planet.gravity / earthValues.gravity) * 100).toFixed(1)}% da Terra
                          </span>
                        </div>
                        <Progress value={getRelativeValue(planet.gravity, earthValues.gravity)} className="h-2" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Detailed Measurements */}
                <div className="grid md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Medidas Físicas</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Raio equatorial:</span>
                        <span className="font-medium">{planet.radius.toLocaleString()} km</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Massa:</span>
                        <span className="font-medium">{formatMass(planet.mass)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Gravidade superficial:</span>
                        <span className="font-medium">{planet.gravity} m/s²</span>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Dados Orbitais</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Distância do Sol:</span>
                        <span className="font-medium">{formatDistance(planet.distance_from_sun)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Período orbital:</span>
                        <span className="font-medium">{formatPeriod(planet.orbital_period)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Período de rotação:</span>
                        <span className="font-medium">{planet.rotation_period.toFixed(1)}h</span>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="calculator">
                <WeightCalculator planet={planet} />
              </TabsContent>

              <TabsContent value="compare">
                <PlanetComparison currentPlanet={planet} />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  )
}
