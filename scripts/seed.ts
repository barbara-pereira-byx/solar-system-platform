import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Iniciando seed do banco de dados...')

  // Criar professor admin
  const hashedPassword = await bcrypt.hash('admin123', 12)
  
  const teacher = await prisma.teacher.upsert({
    where: { email: 'admin@planetario.edu.br' },
    update: {},
    create: {
      email: 'admin@planetario.edu.br',
      password: hashedPassword,
      name: 'Administrador',
      role: 'admin'
    }
  })

  console.log('✅ Professor admin criado:', teacher.email)

  // Criar planetas
  const planets = [
    {
      name: 'mercury',
      displayName: 'Mercúrio',
      description: 'O planeta mais próximo do Sol e o menor do Sistema Solar.',
      mass: 3.3011e23,
      radius: 2439.7,
      gravity: 3.7,
      temperature: 440,
      distance: 5.79e7,
      orbitalPeriod: 88,
      rotationPeriod: 1407.6,
      moons: 0,
      texture: '/mercury-texture.png',
      order: 1
    },
    {
      name: 'venus',
      displayName: 'Vênus',
      description: 'O planeta mais quente do Sistema Solar devido ao efeito estufa.',
      mass: 4.8675e24,
      radius: 6051.8,
      gravity: 8.87,
      temperature: 737,
      distance: 1.082e8,
      orbitalPeriod: 224.7,
      rotationPeriod: -5832.5,
      moons: 0,
      texture: '/venus-texture.png',
      order: 2
    },
    {
      name: 'earth',
      displayName: 'Terra',
      description: 'Nosso planeta natal, o único conhecido com vida.',
      mass: 5.9724e24,
      radius: 6371,
      gravity: 9.81,
      temperature: 288,
      distance: 1.496e8,
      orbitalPeriod: 365.25,
      rotationPeriod: 24,
      moons: 1,
      texture: '/earth-planet-texture-blue-green.jpg',
      order: 3
    },
    {
      name: 'mars',
      displayName: 'Marte',
      description: 'O planeta vermelho, conhecido por suas tempestades de poeira.',
      mass: 6.4171e23,
      radius: 3389.5,
      gravity: 3.71,
      temperature: 210,
      distance: 2.279e8,
      orbitalPeriod: 687,
      rotationPeriod: 24.6,
      moons: 2,
      texture: '/mars-red-texture.png',
      order: 4
    },
    {
      name: 'jupiter',
      displayName: 'Júpiter',
      description: 'O maior planeta do Sistema Solar, um gigante gasoso.',
      mass: 1.8982e27,
      radius: 69911,
      gravity: 24.79,
      temperature: 165,
      distance: 7.785e8,
      orbitalPeriod: 4333,
      rotationPeriod: 9.9,
      moons: 79,
      texture: '/jupiter-gas-giant-planet-texture-bands.jpg',
      order: 5
    }
  ]

  for (const planetData of planets) {
    const planet = await prisma.planet.upsert({
      where: { name: planetData.name },
      update: {},
      create: planetData
    })
    console.log(`✅ Planeta criado: ${planet.displayName}`)
  }

  // Criar campos de comparação
  const comparisonFields = [
    { name: 'mass', displayName: 'Massa', type: 'number', unit: 'kg', order: 1 },
    { name: 'radius', displayName: 'Raio', type: 'number', unit: 'km', order: 2 },
    { name: 'gravity', displayName: 'Gravidade', type: 'number', unit: 'm/s²', order: 3 },
    { name: 'temperature', displayName: 'Temperatura', type: 'number', unit: 'K', order: 4 },
    { name: 'distance', displayName: 'Distância do Sol', type: 'number', unit: 'km', order: 5 },
    { name: 'orbitalPeriod', displayName: 'Período Orbital', type: 'number', unit: 'dias', order: 6 },
    { name: 'rotationPeriod', displayName: 'Período de Rotação', type: 'number', unit: 'horas', order: 7 },
    { name: 'moons', displayName: 'Número de Luas', type: 'number', unit: '', order: 8 }
  ]

  for (const fieldData of comparisonFields) {
    const field = await prisma.comparisonField.upsert({
      where: { id: fieldData.name }, // Usar id em vez de name
      update: {},
      create: {
        id: fieldData.name, // Definir id explicitamente
        ...fieldData
      }
    })
    console.log(`✅ Campo de comparação criado: ${field.displayName}`)
  }

  // Criar quiz inicial
  const quiz = await prisma.quiz.upsert({
    where: { id: 'initial-quiz' },
    update: {},
    create: {
      id: 'initial-quiz',
      title: 'Quiz do Sistema Solar',
      description: 'Teste seus conhecimentos sobre os planetas do Sistema Solar',
      order: 1
    }
  })

  console.log(`✅ Quiz criado: ${quiz.title}`)

  // Criar perguntas do quiz
  const questions = [
    {
      quizId: quiz.id,
      planetId: (await prisma.planet.findUnique({ where: { name: 'mercury' } }))?.id,
      question: 'Qual é o planeta mais próximo do Sol?',
      type: 'multiple_choice',
      options: JSON.stringify(['Mercúrio', 'Vênus', 'Terra', 'Marte']),
      correctAnswer: 'Mercúrio',
      explanation: 'Mercúrio é o planeta mais próximo do Sol, orbitando a uma distância média de 58 milhões de km.',
      points: 1,
      order: 1
    },
    {
      quizId: quiz.id,
      planetId: (await prisma.planet.findUnique({ where: { name: 'jupiter' } }))?.id,
      question: 'Qual é o maior planeta do Sistema Solar?',
      type: 'multiple_choice',
      options: JSON.stringify(['Terra', 'Júpiter', 'Saturno', 'Netuno']),
      correctAnswer: 'Júpiter',
      explanation: 'Júpiter é o maior planeta do Sistema Solar, com uma massa maior que todos os outros planetas juntos.',
      points: 1,
      order: 2
    },
    {
      quizId: quiz.id,
      planetId: (await prisma.planet.findUnique({ where: { name: 'earth' } }))?.id,
      question: 'A Terra é o único planeta conhecido com vida.',
      type: 'true_false',
      options: null,
      correctAnswer: 'true',
      explanation: 'Até onde sabemos, a Terra é o único planeta no Universo que possui vida.',
      points: 1,
      order: 3
    }
  ]

  for (const questionData of questions) {
    const question = await prisma.quizQuestion.create({
      data: questionData
    })
    console.log(`✅ Pergunta criada: ${question.question}`)
  }

  // Criar configurações do sistema
  const systemConfigs = [
    { key: 'app_name', value: 'Sistema Solar Interativo', description: 'Nome da aplicação' },
    { key: 'max_planets_display', value: '8', description: 'Número máximo de planetas a exibir', type: 'number' },
    { key: 'enable_3d_view', value: 'true', description: 'Habilitar visualização 3D', type: 'boolean' },
    { key: 'default_theme', value: 'dark', description: 'Tema padrão da aplicação' }
  ]

  for (const configData of systemConfigs) {
    const config = await prisma.systemConfig.upsert({
      where: { key: configData.key },
      update: {},
      create: configData
    })
    console.log(`✅ Configuração criada: ${config.key}`)
  }

  console.log('🎉 Seed concluído com sucesso!')
  console.log('📧 Login: admin@planetario.edu.br')
  console.log('🔑 Senha: admin123')
}

main()
  .catch((e) => {
    console.error('❌ Erro durante o seed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
