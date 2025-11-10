import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌍 Atualizando Sistema Solar...')

  // Atualizar planetas com texturas corretas e dados precisos
  const planets = [
    {
      name: 'mercury',
      displayName: 'Mercúrio',
      description: 'O menor planeta do Sistema Solar e o mais próximo do Sol. Não possui atmosfera e tem temperaturas extremas.',
      mass: 3.3011e23,
      radius: 2439.7,
      gravity: 3.7,
      temperature: 167,
      distance: 57910000,
      orbitalPeriod: 88,
      rotationPeriod: 1407.6,
      moons: 0,
      texture: '/mercury-texture.png',
      order: 1,
      isActive: true
    },
    {
      name: 'venus',
      displayName: 'Vênus',
      description: 'O planeta mais quente do Sistema Solar devido ao efeito estufa. Tem uma atmosfera extremamente densa.',
      mass: 4.8675e24,
      radius: 6051.8,
      gravity: 8.87,
      temperature: 464,
      distance: 108200000,
      orbitalPeriod: 225,
      rotationPeriod: -5832.5, // Rotação retrógrada
      moons: 0,
      texture: '/venus-texture.png',
      order: 2,
      isActive: true
    },
    {
      name: 'earth',
      displayName: 'Terra',
      description: 'Nosso planeta natal, o único conhecido com vida. Tem uma atmosfera rica em oxigênio e água líquida.',
      mass: 5.9724e24,
      radius: 6371,
      gravity: 9.81,
      temperature: 15,
      distance: 149600000,
      orbitalPeriod: 365.25,
      rotationPeriod: 24,
      moons: 1,
      texture: '/earth-planet-texture-blue-green.jpg',
      order: 3,
      isActive: true
    },
    {
      name: 'mars',
      displayName: 'Marte',
      description: 'O Planeta Vermelho, conhecido por sua cor avermelhada devido ao óxido de ferro em sua superfície.',
      mass: 6.4171e23,
      radius: 3389.5,
      gravity: 3.71,
      temperature: -65,
      distance: 227900000,
      orbitalPeriod: 687,
      rotationPeriod: 24.6,
      moons: 2,
      texture: '/mars-red-texture.png',
      order: 4,
      isActive: true
    },
    {
      name: 'jupiter',
      displayName: 'Júpiter',
      description: 'O maior planeta do Sistema Solar, um gigante gasoso com uma Grande Mancha Vermelha.',
      mass: 1.8982e27,
      radius: 69911,
      gravity: 24.79,
      temperature: -110,
      distance: 778500000,
      orbitalPeriod: 4333,
      rotationPeriod: 9.9,
      moons: 95,
      texture: '/jupiter-gas-giant-planet-texture-bands.jpg',
      order: 5,
      isActive: true
    },
    {
      name: 'saturn',
      displayName: 'Saturno',
      description: 'Conhecido por seus anéis espetaculares, é um gigante gasoso com baixa densidade.',
      mass: 5.6834e26,
      radius: 58232,
      gravity: 10.44,
      temperature: -140,
      distance: 1432000000,
      orbitalPeriod: 10759,
      rotationPeriod: 10.7,
      moons: 146,
      texture: '/saturn-realistic.svg',
      order: 6,
      isActive: true
    },
    {
      name: 'uranus',
      displayName: 'Urano',
      description: 'Um gigante de gelo que gira de lado, com uma atmosfera rica em metano.',
      mass: 8.6810e25,
      radius: 25362,
      gravity: 8.69,
      temperature: -195,
      distance: 2867000000,
      orbitalPeriod: 30687,
      rotationPeriod: -17.2, // Rotação retrógrada
      moons: 27,
      texture: '/uranus-realistic.svg',
      order: 7,
      isActive: true
    },
    {
      name: 'neptune',
      displayName: 'Netuno',
      description: 'O planeta mais distante do Sol, um gigante de gelo com ventos extremamente rápidos.',
      mass: 1.0243e26,
      radius: 24622,
      gravity: 11.15,
      temperature: -200,
      distance: 4515000000,
      orbitalPeriod: 60190,
      rotationPeriod: 16.1,
      moons: 14,
      texture: '/neptune-realistic.svg',
      order: 8,
      isActive: true
    }
  ]

  // Atualizar planetas
  for (const planetData of planets) {
    const planet = await prisma.planet.upsert({
      where: { name: planetData.name },
      update: planetData,
      create: planetData
    })

    console.log(`✅ Planeta ${planet.displayName} atualizado`)

    // Atualizar valores de comparação
    const fields = await prisma.comparisonField.findMany()
    
    for (const field of fields) {
      let value: string | number = ''
      
      switch (field.name) {
        case 'mass':
          value = planetData.mass?.toString() || ''
          break
        case 'radius':
          value = planetData.radius?.toString() || ''
          break
        case 'gravity':
          value = planetData.gravity?.toString() || ''
          break
        case 'temperature':
          value = planetData.temperature?.toString() || ''
          break
        case 'distance':
          value = planetData.distance?.toString() || ''
          break
        case 'orbitalPeriod':
          value = planetData.orbitalPeriod?.toString() || ''
          break
        case 'rotationPeriod':
          value = planetData.rotationPeriod?.toString() || ''
          break
        case 'moons':
          value = planetData.moons?.toString() || ''
          break
      }

      if (value !== '') {
        await prisma.planetComparisonValue.upsert({
          where: {
            planetId_fieldId: {
              planetId: planet.id,
              fieldId: field.id
            }
          },
          update: { value: value.toString() },
          create: {
            planetId: planet.id,
            fieldId: field.id,
            value: value.toString()
          }
        })
      }
    }
  }

  // Luas completas do Sistema Solar
  const moons = [
    // Lua da Terra
    {
      name: 'Lua',
      planetName: 'earth',
      description: 'O único satélite natural da Terra, responsável pelas marés.',
      mass: 7.342e22,
      radius: 1737.4,
      distance: 384400,
      orbitalPeriod: 27.3,
      texture: '/placeholder.jpg',
      order: 1,
      isActive: true
    },
    // Luas de Marte
    {
      name: 'Fobos',
      planetName: 'mars',
      description: 'A maior e mais próxima lua de Marte.',
      mass: 1.0659e16,
      radius: 11.3,
      distance: 9376,
      orbitalPeriod: 0.32,
      texture: '/placeholder.jpg',
      order: 1,
      isActive: true
    },
    {
      name: 'Deimos',
      planetName: 'mars',
      description: 'A menor e mais distante lua de Marte.',
      mass: 1.4762e15,
      radius: 6.2,
      distance: 23463,
      orbitalPeriod: 1.26,
      texture: '/placeholder.jpg',
      order: 2,
      isActive: true
    },
    // Luas principais de Júpiter (Galileanas + outras importantes)
    {
      name: 'Io',
      planetName: 'jupiter',
      description: 'A lua mais vulcanicamente ativa do Sistema Solar.',
      mass: 8.9319e22,
      radius: 1821.6,
      distance: 421700,
      orbitalPeriod: 1.77,
      texture: '/placeholder.jpg',
      order: 1,
      isActive: true
    },
    {
      name: 'Europa',
      planetName: 'jupiter',
      description: 'Uma lua gelada com um oceano subterrâneo que pode abrigar vida.',
      mass: 4.7998e22,
      radius: 1560.8,
      distance: 671034,
      orbitalPeriod: 3.55,
      texture: '/placeholder.jpg',
      order: 2,
      isActive: true
    },
    {
      name: 'Ganimedes',
      planetName: 'jupiter',
      description: 'A maior lua do Sistema Solar, maior que Mercúrio.',
      mass: 1.4819e23,
      radius: 2634.1,
      distance: 1070412,
      orbitalPeriod: 7.15,
      texture: '/placeholder.jpg',
      order: 3,
      isActive: true
    },
    {
      name: 'Calisto',
      planetName: 'jupiter',
      description: 'A lua mais distante das quatro luas galileanas de Júpiter.',
      mass: 1.0759e23,
      radius: 2410.3,
      distance: 1882709,
      orbitalPeriod: 16.69,
      texture: '/placeholder.jpg',
      order: 4,
      isActive: true
    },
    {
      name: 'Amalteia',
      planetName: 'jupiter',
      description: 'Uma das luas internas de Júpiter, com formato irregular.',
      mass: 2.08e18,
      radius: 83.5,
      distance: 181400,
      orbitalPeriod: 0.5,
      texture: '/placeholder.jpg',
      order: 5,
      isActive: true
    },
    {
      name: 'Himalia',
      planetName: 'jupiter',
      description: 'A maior das luas irregulares de Júpiter.',
      mass: 4.2e18,
      radius: 85,
      distance: 11460000,
      orbitalPeriod: 250.6,
      texture: '/placeholder.jpg',
      order: 6,
      isActive: true
    },
    // Luas principais de Saturno
    {
      name: 'Titã',
      planetName: 'saturn',
      description: 'A maior lua de Saturno, com uma atmosfera densa e lagos de metano.',
      mass: 1.3452e23,
      radius: 2574.7,
      distance: 1221830,
      orbitalPeriod: 15.95,
      texture: '/placeholder.jpg',
      order: 1,
      isActive: true
    },
    {
      name: 'Encélado',
      planetName: 'saturn',
      description: 'Uma lua gelada com gêiseres de água que podem indicar um oceano subterrâneo.',
      mass: 1.0802e20,
      radius: 252.1,
      distance: 238020,
      orbitalPeriod: 1.37,
      texture: '/placeholder.jpg',
      order: 2,
      isActive: true
    },
    {
      name: 'Mimas',
      planetName: 'saturn',
      description: 'Conhecida como a "Estrela da Morte" devido à sua grande cratera.',
      mass: 3.75e19,
      radius: 198.2,
      distance: 185520,
      orbitalPeriod: 0.94,
      texture: '/placeholder.jpg',
      order: 3,
      isActive: true
    },
    {
      name: 'Dione',
      planetName: 'saturn',
      description: 'Uma lua gelada com vales e falhas em sua superfície.',
      mass: 1.095e21,
      radius: 561.4,
      distance: 377396,
      orbitalPeriod: 2.74,
      texture: '/placeholder.jpg',
      order: 4,
      isActive: true
    },
    {
      name: 'Reia',
      planetName: 'saturn',
      description: 'A segunda maior lua de Saturno, com uma superfície antiga e craterizada.',
      mass: 2.306e21,
      radius: 763.8,
      distance: 527108,
      orbitalPeriod: 4.52,
      texture: '/placeholder.jpg',
      order: 5,
      isActive: true
    },
    {
      name: 'Jápeto',
      planetName: 'saturn',
      description: 'Conhecida por sua coloração bicolor e crista equatorial.',
      mass: 1.805e21,
      radius: 734.5,
      distance: 3560820,
      orbitalPeriod: 79.33,
      texture: '/placeholder.jpg',
      order: 6,
      isActive: true
    },
    // Luas principais de Urano
    {
      name: 'Miranda',
      planetName: 'uranus',
      description: 'A menor das cinco luas principais de Urano, com uma superfície muito variada.',
      mass: 6.59e19,
      radius: 235.8,
      distance: 129390,
      orbitalPeriod: 1.41,
      texture: '/placeholder.jpg',
      order: 1,
      isActive: true
    },
    {
      name: 'Ariel',
      planetName: 'uranus',
      description: 'Uma lua com vales e falhas extensas em sua superfície.',
      mass: 1.35e21,
      radius: 578.9,
      distance: 191020,
      orbitalPeriod: 2.52,
      texture: '/placeholder.jpg',
      order: 2,
      isActive: true
    },
    {
      name: 'Umbriel',
      planetName: 'uranus',
      description: 'Uma lua escura com poucas características superficiais visíveis.',
      mass: 1.17e21,
      radius: 584.7,
      distance: 266000,
      orbitalPeriod: 4.14,
      texture: '/placeholder.jpg',
      order: 3,
      isActive: true
    },
    {
      name: 'Titânia',
      planetName: 'uranus',
      description: 'A maior lua de Urano, com vales e falhas extensas.',
      mass: 3.4e21,
      radius: 788.9,
      distance: 436300,
      orbitalPeriod: 8.71,
      texture: '/placeholder.jpg',
      order: 4,
      isActive: true
    },
    {
      name: 'Oberon',
      planetName: 'uranus',
      description: 'A segunda maior lua de Urano, com uma superfície antiga e craterizada.',
      mass: 3.1e21,
      radius: 761.4,
      distance: 583500,
      orbitalPeriod: 13.46,
      texture: '/placeholder.jpg',
      order: 5,
      isActive: true
    },
    // Luas principais de Netuno
    {
      name: 'Tritão',
      planetName: 'neptune',
      description: 'A maior lua de Netuno, com uma órbita retrógrada e gêiseres de nitrogênio.',
      mass: 2.14e22,
      radius: 1353.4,
      distance: 354759,
      orbitalPeriod: -5.88, // Órbita retrógrada
      texture: '/placeholder.jpg',
      order: 1,
      isActive: true
    },
    {
      name: 'Nereida',
      planetName: 'neptune',
      description: 'Uma lua com uma órbita muito excêntrica ao redor de Netuno.',
      mass: 3.1e19,
      radius: 170,
      distance: 5513400,
      orbitalPeriod: 360.14,
      texture: '/placeholder.jpg',
      order: 2,
      isActive: true
    },
    {
      name: 'Proteu',
      planetName: 'neptune',
      description: 'A segunda maior lua de Netuno, com formato irregular.',
      mass: 5.0e19,
      radius: 210,
      distance: 117647,
      orbitalPeriod: 1.12,
      texture: '/placeholder.jpg',
      order: 3,
      isActive: true
    }
  ]

  // Atualizar luas
  for (const moonData of moons) {
    const planet = await prisma.planet.findUnique({
      where: { name: moonData.planetName }
    })

    if (planet) {
      const existingMoon = await prisma.moon.findFirst({
        where: {
          name: moonData.name,
          planetId: planet.id
        }
      })

      if (!existingMoon) {
        await prisma.moon.create({
          data: {
            name: moonData.name,
            planetId: planet.id,
            description: moonData.description,
            mass: moonData.mass,
            radius: moonData.radius,
            distance: moonData.distance,
            orbitalPeriod: moonData.orbitalPeriod,
            texture: moonData.texture,
            order: moonData.order,
            isActive: moonData.isActive
          }
        })
      } else {
        await prisma.moon.update({
          where: { id: existingMoon.id },
          data: {
            description: moonData.description,
            mass: moonData.mass,
            radius: moonData.radius,
            distance: moonData.distance,
            orbitalPeriod: moonData.orbitalPeriod,
            texture: moonData.texture,
            order: moonData.order,
            isActive: moonData.isActive
          }
        })
      }

      console.log(`✅ Lua ${moonData.name} (${moonData.planetName}) atualizada`)
    }
  }

  console.log('🎉 Sistema Solar atualizado com sucesso!')
  console.log(`📊 Estatísticas:`)
  console.log(`   - ${planets.length} planetas`)
  console.log(`   - ${moons.length} luas`)
  console.log(`   - Texturas e posicionamentos corrigidos`)
}

main()
  .catch((e) => {
    console.error('❌ Erro ao atualizar Sistema Solar:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
