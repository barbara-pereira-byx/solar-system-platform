import { NextResponse } from 'next/server'
import { getAllQuizzes } from '@/lib/quizzes-data'

export async function GET() {
  try {
    const quizzes = getAllQuizzes()
    return NextResponse.json(quizzes)
  } catch (error) {
    console.error('Error fetching quizzes:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}


