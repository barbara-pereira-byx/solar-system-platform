import { NextResponse } from 'next/server'
import { getAllPlanets } from '@/lib/planets-data'

export async function GET() {
  try {
    const planets = getAllPlanets()
    return NextResponse.json(planets)
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}