import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || (session.user.role !== 'teacher' && session.user.role !== 'admin')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const quizId = searchParams.get('quizId')

    const questions = await prisma.quizQuestion.findMany({
      where: quizId ? { quizId } : {},
      include: {
        quiz: true
      },
      orderBy: {
        order: 'asc'
      }
    })

    return NextResponse.json(questions)
  } catch (error) {
    console.error('Error fetching quiz questions:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || (session.user.role !== 'teacher' && session.user.role !== 'admin')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const {
      quizId,
      planetId,
      question,
      type,
      options,
      correctAnswer,
      explanation,
      points,
      order,
      isActive
    } = body

    const questionData = await prisma.quizQuestion.create({
      data: {
        quizId,
        planetId: planetId || null,
        question,
        type: type || 'multiple_choice',
        options: Array.isArray(options) ? options.filter(opt => opt.trim()) : (options ? options.split('\n').filter(opt => opt.trim()) : null),
        correctAnswer,
        explanation,
        points: points ? parseInt(points) : 1,
        order: order ? parseInt(order) : 0,
        isActive: isActive ?? true,
      }
    })

    return NextResponse.json(questionData, { status: 201 })
  } catch (error) {
    console.error('Error creating quiz question:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}


