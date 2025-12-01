import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || (session.user.role !== 'teacher' && session.user.role !== 'admin')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const teacher = await prisma.teacher.findUnique({
      where: { id: params.id },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
        updatedAt: true
      }
    })

    if (!teacher) {
      return NextResponse.json({ error: 'Teacher not found' }, { status: 404 })
    }

    return NextResponse.json(teacher)
  } catch (error) {
    console.error('Error fetching teacher:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { email, password, name, role } = body

    // Verificar se o email já existe em outro usuário
    if (email) {
      const existingTeacher = await prisma.teacher.findFirst({
        where: {
          email,
          NOT: { id: params.id }
        }
      })

      if (existingTeacher) {
        return NextResponse.json({ error: 'Email já está em uso' }, { status: 400 })
      }
    }

    const updateData: any = {}
    if (email) updateData.email = email
    if (name) updateData.name = name
    if (role) updateData.role = role
    if (password) {
      updateData.password = await bcrypt.hash(password, 12)
    }

    const teacher = await prisma.teacher.update({
      where: { id: params.id },
      data: updateData,
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
        updatedAt: true
      }
    })

    return NextResponse.json(teacher)
  } catch (error) {
    console.error('Error updating teacher:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Não permitir deletar o próprio usuário
    if (session.user.id === params.id) {
      return NextResponse.json({ error: 'Não é possível deletar seu próprio usuário' }, { status: 400 })
    }

    await prisma.teacher.delete({
      where: { id: params.id }
    })

    return NextResponse.json({ message: 'Teacher deleted successfully' })
  } catch (error) {
    console.error('Error deleting teacher:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}







