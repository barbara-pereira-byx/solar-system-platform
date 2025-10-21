// Definir o tipo Planet localmente
export interface Planet {
  id: string
  name: string
  portuguese_name: string
  radius: number
  mass: number
  gravity: number
  average_temperature: number
  distance_from_sun: number
  orbital_period: number
  rotation_period: number
  description: string
  curiosities: string[]
  image_url: string
  color: string
  moons_count: number
  created_at: string
  updated_at: string
}

// Dados fixos dos planetas do Sistema Solar
export const FIXED_PLANETS: Planet[] = [
  {
    id: "1",
    name: "mercury",
    portuguese_name: "Mercúrio",
    radius: 2439.7,
    mass: 3.3011e23,
    gravity: 3.7,
    average_temperature: 167,
    distance_from_sun: 57910000,
    orbital_period: 88,
    rotation_period: 1407.6,
    description: "O menor planeta do Sistema Solar e o mais próximo do Sol. Não possui atmosfera e tem temperaturas extremas.",
    curiosities: [
      "Não possui atmosfera",
      "Temperaturas extremas entre -173°C e 427°C",
      "Um dia em Mercúrio dura 176 dias terrestres",
      "É o planeta mais rápido do Sistema Solar"
    ],
    image_url: "/mercury-texture.png",
    color: "#8C7853",
    moons_count: 0,
    created_at: "2024-01-01",
    updated_at: "2024-01-01",
  },
  {
    id: "2",
    name: "venus",
    portuguese_name: "Vênus",
    radius: 6051.8,
    mass: 4.8675e24,
    gravity: 8.87,
    average_temperature: 464,
    distance_from_sun: 108200000,
    orbital_period: 225,
    rotation_period: -5832.5,
    description: "O planeta mais quente do Sistema Solar devido ao efeito estufa. Tem uma atmosfera extremamente densa.",
    curiosities: [
      "Rotação retrógrada (gira no sentido contrário)",
      "Atmosfera densa de CO2",
      "Pressão atmosférica 92 vezes maior que a Terra",
      "É o planeta mais brilhante no céu noturno"
    ],
    image_url: "/venus-texture.png",
    color: "#FFC649",
    moons_count: 0,
    created_at: "2024-01-01",
    updated_at: "2024-01-01",
  },
  {
    id: "3",
    name: "earth",
    portuguese_name: "Terra",
    radius: 6371,
    mass: 5.9724e24,
    gravity: 9.81,
    average_temperature: 15,
    distance_from_sun: 149600000,
    orbital_period: 365.25,
    rotation_period: 24,
    description: "Nosso planeta natal, o único conhecido com vida. Tem uma atmosfera rica em oxigênio e água líquida.",
    curiosities: [
      "71% da superfície é coberta por água",
      "Possui campo magnético protetor",
      "Único planeta conhecido com vida",
      "Tem uma lua que estabiliza seu eixo"
    ],
    image_url: "/earth-planet-texture-blue-green.jpg",
    color: "#6B93D6",
    moons_count: 1,
    created_at: "2024-01-01",
    updated_at: "2024-01-01",
  },
  {
    id: "4",
    name: "mars",
    portuguese_name: "Marte",
    radius: 3389.5,
    mass: 6.4171e23,
    gravity: 3.71,
    average_temperature: -65,
    distance_from_sun: 227900000,
    orbital_period: 687,
    rotation_period: 24.6,
    description: "O Planeta Vermelho, conhecido por sua cor avermelhada devido ao óxido de ferro em sua superfície.",
    curiosities: [
      "Possui as maiores montanhas do Sistema Solar",
      "Evidências de água no passado",
      "Tem duas luas: Fobos e Deimos",
      "Dia marciano é similar ao terrestre (24h 37min)"
    ],
    image_url: "/mars-red-texture.png",
    color: "#CD5C5C",
    moons_count: 2,
    created_at: "2024-01-01",
    updated_at: "2024-01-01",
  },
  {
    id: "5",
    name: "jupiter",
    portuguese_name: "Júpiter",
    radius: 69911,
    mass: 1.8982e27,
    gravity: 24.79,
    average_temperature: -110,
    distance_from_sun: 778500000,
    orbital_period: 4333,
    rotation_period: 9.9,
    description: "O maior planeta do Sistema Solar, um gigante gasoso com uma Grande Mancha Vermelha.",
    curiosities: [
      "Grande Mancha Vermelha (tempestade gigante)",
      "Mais de 95 luas conhecidas",
      "Massa maior que todos os outros planetas juntos",
      "Tem um sistema de anéis tênue"
    ],
    image_url: "/jupiter-gas-giant-planet-texture-bands.jpg",
    color: "#D8CA9D",
    moons_count: 95,
    created_at: "2024-01-01",
    updated_at: "2024-01-01",
  },
  {
    id: "6",
    name: "saturn",
    portuguese_name: "Saturno",
    radius: 58232,
    mass: 5.6834e26,
    gravity: 10.44,
    average_temperature: -140,
    distance_from_sun: 1432000000,
    orbital_period: 10759,
    rotation_period: 10.7,
    description: "Conhecido por seus anéis espetaculares, é um gigante gasoso com baixa densidade.",
    curiosities: [
      "Anéis espetaculares compostos de gelo e rocha",
      "Menor densidade que a água",
      "Mais de 146 luas conhecidas",
      "Titã é sua maior lua, maior que Mercúrio"
    ],
    image_url: "/saturn-realistic.jpg",
    color: "#FAD5A5",
    moons_count: 146,
    created_at: "2024-01-01",
    updated_at: "2024-01-01",
  },
  {
    id: "7",
    name: "uranus",
    portuguese_name: "Urano",
    radius: 25362,
    mass: 8.6810e25,
    gravity: 8.69,
    average_temperature: -195,
    distance_from_sun: 2867000000,
    orbital_period: 30687,
    rotation_period: -17.2,
    description: "Um gigante de gelo que gira de lado, com uma atmosfera rica em metano.",
    curiosities: [
      "Gira de lado (eixo inclinado 98°)",
      "Atmosfera rica em metano",
      "Tem 27 luas conhecidas",
      "É o planeta mais frio do Sistema Solar"
    ],
    image_url: "/uranus-realistic.jpg",
    color: "#4FD0E7",
    moons_count: 27,
    created_at: "2024-01-01",
    updated_at: "2024-01-01",
  },
  {
    id: "8",
    name: "neptune",
    portuguese_name: "Netuno",
    radius: 24622,
    mass: 1.0243e26,
    gravity: 11.15,
    average_temperature: -200,
    distance_from_sun: 4515000000,
    orbital_period: 60190,
    rotation_period: 16.1,
    description: "O planeta mais distante do Sol, um gigante de gelo com ventos extremamente rápidos.",
    curiosities: [
      "Ventos mais rápidos do Sistema Solar (até 2100 km/h)",
      "Tem 14 luas conhecidas",
      "Foi descoberto por cálculos matemáticos",
      "Tritão é sua maior lua com órbita retrógrada"
    ],
    image_url: "/neptune-realistic.jpg",
    color: "#4B70DD",
    moons_count: 14,
    created_at: "2024-01-01",
    updated_at: "2024-01-01",
  }
]

// Função para obter dados de um planeta específico
export function getPlanetByName(name: string): Planet | undefined {
  return FIXED_PLANETS.find(planet => planet.name.toLowerCase() === name.toLowerCase())
}

// Função para obter todos os planetas
export function getAllPlanets(): Planet[] {
  return FIXED_PLANETS
}
