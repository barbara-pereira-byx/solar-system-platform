"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { Planet } from "@/lib/api"
import { Scale, Calculator } from "lucide-react"

interface WeightCalculatorProps {
  planet: Planet
}

export function WeightCalculator({ planet }: WeightCalculatorProps) {
  const [earthWeight, setEarthWeight] = useState<string>("")
  const [results, setResults] = useState<{ planet: string; weight: number; gravity: number }[]>([])

  const planets = [
    { name: "Mercúrio", gravity: 3.7 },
    { name: "Vênus", gravity: 8.87 },
    { name: "Terra", gravity: 9.8 },
    { name: "Marte", gravity: 3.71 },
    { name: "Júpiter", gravity: 24.79 },
    { name: "Saturno", gravity: 10.44 },
    { name: "Urano", gravity: 8.69 },
    { name: "Netuno", gravity: 11.15 },
  ]

  const calculateWeights = () => {
    const weight = Number.parseFloat(earthWeight)
    if (isNaN(weight) || weight <= 0) return

    const earthGravity = 9.8
    const mass = weight / earthGravity

    const newResults = planets.map((p) => ({
      planet: p.name,
      weight: mass * p.gravity,
      gravity: p.gravity,
    }))

    setResults(newResults)
  }

  const getCurrentPlanetWeight = () => {
    if (!earthWeight || results.length === 0) return null
    const weight = Number.parseFloat(earthWeight)
    const earthGravity = 9.8
    const mass = weight / earthGravity
    return mass * planet.gravity
  }

  return (
    <div className="space-y-6">
      {/* Calculator */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5" />
            Calculadora de Peso
          </CardTitle>
          <CardDescription>Descubra quanto você pesaria em {planet.portuguese_name} e outros planetas</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4 items-end">
            <div className="flex-1">
              <Label htmlFor="weight">Seu peso na Terra (kg)</Label>
              <Input
                id="weight"
                type="number"
                placeholder="Ex: 70"
                value={earthWeight}
                onChange={(e) => setEarthWeight(e.target.value)}
                min="1"
                max="1000"
              />
            </div>
            <Button onClick={calculateWeights} disabled={!earthWeight}>
              Calcular
            </Button>
          </div>

          {getCurrentPlanetWeight() && (
            <div className="p-4 bg-primary/10 rounded-lg border border-primary/20">
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Seu peso em {planet.portuguese_name}:</p>
                <p className="text-2xl font-bold text-primary">{getCurrentPlanetWeight()!.toFixed(1)} kg</p>
                <p className="text-xs text-muted-foreground mt-1">Gravidade: {planet.gravity} m/s²</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Results */}
      {results.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Scale className="h-5 w-5" />
              Seu peso em todos os planetas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              {results.map((result, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-lg border ${
                    result.planet === planet.portuguese_name
                      ? "bg-primary/10 border-primary/20"
                      : "bg-muted/50 border-border"
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">{result.planet}</p>
                      <p className="text-sm text-muted-foreground">Gravidade: {result.gravity} m/s²</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold">{result.weight.toFixed(1)} kg</p>
                      {result.planet === planet.portuguese_name && (
                        <Badge variant="default" className="text-xs">
                          Planeta atual
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Educational Info */}
      <Card>
        <CardHeader>
          <CardTitle>Como funciona?</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-muted-foreground">
            O peso é a força gravitacional exercida sobre sua massa. Embora sua massa permaneça constante, seu peso
            varia dependendo da gravidade do planeta.
          </p>
          <div className="bg-muted/50 p-3 rounded-lg">
            <p className="text-sm font-mono">Peso = Massa × Gravidade</p>
          </div>
          <p className="text-sm text-muted-foreground">
            Por exemplo, em {planet.portuguese_name} com gravidade de {planet.gravity} m/s², você pesaria{" "}
            {((planet.gravity / 9.8) * 100).toFixed(0)}% do seu peso na Terra.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
