import { NextRequest, NextResponse } from 'next/server'
import { getQuizById } from '@/lib/quizzes-data'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const quiz = getQuizById(params.id)

    if (!quiz) {
      return NextResponse.json({ error: 'Quiz not found' }, { status: 404 })
    }

    return NextResponse.json(quiz)
  } catch (error) {
    console.error('Error fetching quiz:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}







