import { NextRequest, NextResponse } from 'next/server'
import { getPlanetByName } from '@/lib/planets-data'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const planet = getPlanetByName(params.id)
    
    if (!planet) {
      return NextResponse.json(
        { error: 'Planet not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(planet)
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}