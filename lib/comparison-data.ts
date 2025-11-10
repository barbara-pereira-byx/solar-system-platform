import type { Planet } from "@/lib/planets-data"

// Interface para campos de comparação fixos
export interface ComparisonField {
  id: string
  name: string
  displayName: string
  unit: string
  type: 'number' | 'text' | 'boolean'
  order: number
  isActive: boolean
}

// Campos de comparação fixos
export const FIXED_COMPARISON_FIELDS: ComparisonField[] = [
  {
    id: 'mass',
    name: 'mass',
    displayName: 'Massa',
    unit: 'kg',
    type: 'number',
    order: 1,
    isActive: true
  },
  {
    id: 'radius',
    name: 'radius',
    displayName: 'Raio',
    unit: 'km',
    type: 'number',
    order: 2,
    isActive: true
  },
  {
    id: 'gravity',
    name: 'gravity',
    displayName: 'Gravidade',
    unit: 'm/s²',
    type: 'number',
    order: 3,
    isActive: true
  },
  {
    id: 'temperature',
    name: 'temperature',
    displayName: 'Temperatura',
    unit: '°C',
    type: 'number',
    order: 4,
    isActive: true
  },
  {
    id: 'distance',
    name: 'distance',
    displayName: 'Distância do Sol',
    unit: 'km',
    type: 'number',
    order: 5,
    isActive: true
  },
  {
    id: 'orbital_period',
    name: 'orbital_period',
    displayName: 'Período Orbital',
    unit: 'dias',
    type: 'number',
    order: 6,
    isActive: true
  },
  {
    id: 'rotation_period',
    name: 'rotation_period',
    displayName: 'Período de Rotação',
    unit: 'horas',
    type: 'number',
    order: 7,
    isActive: true
  },
  {
    id: 'moons_count',
    name: 'moons_count',
    displayName: 'Número de Luas',
    unit: '',
    type: 'number',
    order: 8,
    isActive: true
  }
]

// Função para obter valor de comparação de um planeta
export function getPlanetComparisonValue(planet: Planet, fieldName: string): string | number {
  switch (fieldName) {
    case 'mass':
      return planet.mass
    case 'radius':
      return planet.radius
    case 'gravity':
      return planet.gravity
    case 'temperature':
      return planet.average_temperature
    case 'distance':
      return planet.distance_from_sun
    case 'orbital_period':
      return planet.orbital_period
    case 'rotation_period':
      return planet.rotation_period
    case 'moons_count':
      return planet.moons_count
    default:
      return ''
  }
}

// Função para formatar valores de comparação
export function formatComparisonValue(value: string | number, field: ComparisonField): string {
  if (value === '' || value === null || value === undefined) {
    return 'N/A'
  }

  switch (field.name) {
    case 'mass':
      if (typeof value === 'number') {
        if (value >= 1e24) return `${(value / 1e24).toFixed(2)} × 10²⁴ kg`
        if (value >= 1e21) return `${(value / 1e21).toFixed(2)} × 10²¹ kg`
        if (value >= 1e18) return `${(value / 1e18).toFixed(2)} × 10¹⁸ kg`
        if (value >= 1e15) return `${(value / 1e15).toFixed(2)} × 10¹⁵ kg`
        if (value >= 1e12) return `${(value / 1e12).toFixed(2)} × 10¹² kg`
        if (value >= 1e9) return `${(value / 1e9).toFixed(2)} × 10⁹ kg`
        if (value >= 1e6) return `${(value / 1e6).toFixed(2)} × 10⁶ kg`
        if (value >= 1e3) return `${(value / 1e3).toFixed(2)} × 10³ kg`
        return `${value.toFixed(2)} kg`
      }
      return `${value} kg`
    
    case 'radius':
      if (typeof value === 'number') {
        return `${value.toLocaleString()} km`
      }
      return `${value} km`
    
    case 'gravity':
      if (typeof value === 'number') {
        return `${value} m/s²`
      }
      return `${value} m/s²`
    
    case 'temperature':
      if (typeof value === 'number') {
        return `${value}°C`
      }
      return `${value}°C`
    
    case 'distance':
      if (typeof value === 'number') {
        if (value >= 1e9) return `${(value / 1e9).toFixed(1)} bilhões km`
        if (value >= 1e6) return `${(value / 1e6).toFixed(1)} milhões km`
        return `${value.toLocaleString()} km`
      }
      return `${value} km`
    
    case 'orbital_period':
      if (typeof value === 'number') {
        return `${value} dias`
      }
      return `${value} dias`
    
    case 'rotation_period':
      if (typeof value === 'number') {
        const absValue = Math.abs(value)
        const sign = value < 0 ? ' (retrógrada)' : ''
        return `${absValue} horas${sign}`
      }
      return `${value} horas`
    
    case 'moons_count':
      if (typeof value === 'number') {
        return value === 1 ? '1 lua' : `${value} luas`
      }
      return `${value} luas`
    
    default:
      return String(value)
  }
}

// Função para calcular peso em diferentes planetas
export function calculateWeightOnPlanet(weightOnEarth: number, planetGravity: number): number {
  if (weightOnEarth === 0) return 0
  return (weightOnEarth * planetGravity / 9.81)
}

// Função para obter todos os campos de comparação ativos
export function getActiveComparisonFields(): ComparisonField[] {
  return FIXED_COMPARISON_FIELDS.filter(field => field.isActive)
}

// Função para obter um campo específico
export function getComparisonField(fieldName: string): ComparisonField | undefined {
  return FIXED_COMPARISON_FIELDS.find(field => field.name === fieldName)
}
