// Dados sobre asteroides e objetos do sistema solar exterior

export interface Asteroid {
  id: string
  name: string
  portuguese_name: string
  radius: number
  mass: number
  distance_from_sun: number
  orbital_period: number
  description: string
  curiosities: string[]
  type: 'asteroid' | 'comet' | 'dwarf_planet'
  location: 'main_belt' | 'kuiper_belt' | 'oort_cloud'
  color: string
  image_url?: string
}

// Principais asteroides do Cinturão Principal
export const MAIN_BELT_ASTEROIDS: Asteroid[] = [
  {
    id: "asteroid-1",
    name: "ceres",
    portuguese_name: "Ceres",
    radius: 473,
    mass: 9.1e20,
    distance_from_sun: 413700000,
    orbital_period: 1682,
    description: "O maior objeto do cinturão de asteroides e classificado como planeta anão. Possui água congelada e possível oceano subterrâneo.",
    curiosities: [
      "Maior objeto do cinturão de asteroides",
      "Classificado como planeta anão desde 2006",
      "Possui água congelada nos polos",
      "Possível oceano líquido subterrâneo",
      "Representa 25% da massa total do cinturão"
    ],
    type: "dwarf_planet",
    location: "main_belt",
    color: "#C0C0C0",
    image_url: "https://images-assets.nasa.gov/image/PIA22660/PIA22660~orig.jpg"
  },
  {
    id: "asteroid-2",
    name: "vesta",
    portuguese_name: "Vesta",
    radius: 262.7,
    mass: 2.59e20,
    distance_from_sun: 353400000,
    orbital_period: 1325,
    description: "O segundo maior asteroide do cinturão principal, com uma grande cratera no polo sul e superfície basáltica.",
    curiosities: [
      "Segundo maior asteroide do cinturão principal",
      "Possui uma cratera gigante no polo sul",
      "Superfície basáltica similar à Lua",
      "Fonte de meteoritos HED na Terra",
      "Tem montanhas de 22 km de altura"
    ],
    type: "asteroid",
    location: "main_belt",
    color: "#8B7355",
    image_url: "https://images-assets.nasa.gov/image/PIA15678/PIA15678~orig.jpg"
  },
  {
    id: "asteroid-3",
    name: "pallas",
    portuguese_name: "Palas",
    radius: 272,
    mass: 2.04e20,
    distance_from_sun: 414500000,
    orbital_period: 1686,
    description: "O terceiro maior asteroide, com órbita inclinada e superfície rica em carbono.",
    curiosities: [
      "Terceiro maior asteroide do cinturão",
      "Órbita muito inclinada (34.8°)",
      "Superfície rica em carbono",
      "Formato irregular e alongado",
      "Descoberto em 1802"
    ],
    type: "asteroid",
    location: "main_belt",
    color: "#2F2F2F",
    image_url: "https://images-assets.nasa.gov/image/PIA23170/PIA23170~orig.jpg"
  },
  {
    id: "asteroid-4",
    name: "hygiea",
    portuguese_name: "Hígia",
    radius: 217,
    mass: 8.67e19,
    distance_from_sun: 470300000,
    orbital_period: 2029,
    description: "O quarto maior asteroide, com formato quase esférico e superfície escura.",
    curiosities: [
      "Quarto maior asteroide do cinturão",
      "Formato quase perfeitamente esférico",
      "Superfície muito escura (albedo 0.07)",
      "Possível planeta anão",
      "Família de asteroides associada"
    ],
    type: "asteroid",
    location: "main_belt",
    color: "#2F2F2F",
    image_url: "https://images-assets.nasa.gov/image/PIA23171/PIA23171~orig.jpg"
  }
]

// Objetos do Cinturão de Kuiper
export const KUIPER_BELT_OBJECTS: Asteroid[] = [
  {
    id: "kbo-1",
    name: "pluto",
    portuguese_name: "Plutão",
    radius: 1188.3,
    mass: 1.31e22,
    distance_from_sun: 5906400000,
    orbital_period: 90560,
    description: "Ex-planeta, agora classificado como planeta anão. Possui cinco luas conhecidas, sendo Caronte a maior.",
    curiosities: [
      "Ex-nono planeta do Sistema Solar",
      "Reclassificado como planeta anão em 2006",
      "Possui cinco luas conhecidas",
      "Órbita excêntrica e inclinada",
      "Atmosfera tênue de nitrogênio"
    ],
    type: "dwarf_planet",
    location: "kuiper_belt",
    color: "#D2B48C",
    image_url: "https://images-assets.nasa.gov/image/PIA19952/PIA19952~orig.jpg"
  },
  {
    id: "kbo-2",
    name: "eris",
    portuguese_name: "Éris",
    radius: 1163,
    mass: 1.66e22,
    distance_from_sun: 10120000000,
    orbital_period: 203830,
    description: "Planeta anão mais massivo que Plutão, localizado no disco disperso além do Cinturão de Kuiper.",
    curiosities: [
      "Mais massivo que Plutão",
      "Descoberta causou reclassificação de Plutão",
      "Órbita muito excêntrica (557 anos)",
      "Possui uma lua chamada Disnomia",
      "Superfície coberta de gelo de metano"
    ],
    type: "dwarf_planet",
    location: "kuiper_belt",
    color: "#F5F5DC",
    image_url: "https://images-assets.nasa.gov/image/PIA21464/PIA21464~orig.jpg"
  },
  {
    id: "kbo-3",
    name: "makemake",
    portuguese_name: "Makemake",
    radius: 715,
    mass: 3.1e21,
    distance_from_sun: 6850000000,
    orbital_period: 112897,
    description: "Planeta anão do Cinturão de Kuiper, com superfície avermelhada rica em metano.",
    curiosities: [
      "Terceiro maior planeta anão conhecido",
      "Superfície avermelhada rica em metano",
      "Não possui atmosfera detectável",
      "Possui uma pequena lua",
      "Descoberto em 2005"
    ],
    type: "dwarf_planet",
    location: "kuiper_belt",
    color: "#CD853F",
    image_url: "https://images-assets.nasa.gov/image/PIA19056/PIA19056~orig.jpg"
  },
  {
    id: "kbo-4",
    name: "haumea",
    portuguese_name: "Haumea",
    radius: 816,
    mass: 4.01e21,
    distance_from_sun: 6484000000,
    orbital_period: 103774,
    description: "Planeta anão com formato alongado devido à rotação rápida, possui anéis e duas luas.",
    curiosities: [
      "Formato alongado como um ovo",
      "Rotação mais rápida do Sistema Solar (3.9h)",
      "Possui sistema de anéis",
      "Duas luas conhecidas",
      "Superfície coberta de gelo cristalino"
    ],
    type: "dwarf_planet",
    location: "kuiper_belt",
    color: "#F0F8FF",
    image_url: "https://images-assets.nasa.gov/image/PIA21464/PIA21464~orig.jpg"
  }
]

// Cometas famosos da Nuvem de Oort
export const OORT_CLOUD_OBJECTS: Asteroid[] = [
  {
    id: "comet-1",
    name: "halley",
    portuguese_name: "Cometa Halley",
    radius: 5.5,
    mass: 2.2e14,
    distance_from_sun: 17800000000, // Afélio
    orbital_period: 27375, // 75 anos
    description: "O cometa mais famoso, visível da Terra a cada 75 anos. Sua última passagem foi em 1986.",
    curiosities: [
      "Cometa mais famoso da história",
      "Visível da Terra a cada 75 anos",
      "Última passagem em 1986",
      "Próxima passagem em 2061",
      "Registrado há mais de 2000 anos"
    ],
    type: "comet",
    location: "oort_cloud",
    color: "#E6E6FA",
    image_url: "https://images-assets.nasa.gov/image/PIA18117/PIA18117~orig.jpg"
  },
  {
    id: "comet-2",
    name: "hale-bopp",
    portuguese_name: "Cometa Hale-Bopp",
    radius: 30,
    mass: 1.3e16,
    distance_from_sun: 52700000000, // Afélio
    orbital_period: 912500, // 2500 anos
    description: "Um dos cometas mais brilhantes do século XX, visível a olho nu por 18 meses.",
    curiosities: [
      "Um dos cometas mais brilhantes do século XX",
      "Visível a olho nu por 18 meses (1996-1997)",
      "Núcleo de 40 km de diâmetro",
      "Órbita de aproximadamente 2500 anos",
      "Descoberto independentemente por dois astrônomos"
    ],
    type: "comet",
    location: "oort_cloud",
    color: "#B0E0E6",
    image_url: "https://images-assets.nasa.gov/image/PIA01288/PIA01288~orig.jpg"
  },
  {
    id: "comet-3",
    name: "hyakutake",
    portuguese_name: "Cometa Hyakutake",
    radius: 2.5,
    mass: 1.0e13,
    distance_from_sun: 34600000000, // Afélio
    orbital_period: 51075, // 140 anos
    description: "Cometa que passou muito próximo da Terra em 1996, desenvolvendo uma cauda espetacular.",
    curiosities: [
      "Passou muito próximo da Terra em 1996",
      "Desenvolveu cauda de 100 milhões de km",
      "Descoberto apenas dois meses antes da passagem",
      "Órbita de aproximadamente 140 anos",
      "Visível a olho nu por vários meses"
    ],
    type: "comet",
    location: "oort_cloud",
    color: "#F0F8FF",
    image_url: "https://images-assets.nasa.gov/image/PIA01289/PIA01289~orig.jpg"
  }
]

// Função para obter todos os asteroides
export function getAllAsteroids(): Asteroid[] {
  return [...MAIN_BELT_ASTEROIDS, ...KUIPER_BELT_OBJECTS, ...OORT_CLOUD_OBJECTS]
}

// Função para obter asteroides por localização
export function getAsteroidsByLocation(location: 'main_belt' | 'kuiper_belt' | 'oort_cloud'): Asteroid[] {
  return getAllAsteroids().filter(asteroid => asteroid.location === location)
}

// Função para obter asteroides por tipo
export function getAsteroidsByType(type: 'asteroid' | 'comet' | 'dwarf_planet'): Asteroid[] {
  return getAllAsteroids().filter(asteroid => asteroid.type === type)
}

// Informações sobre as regiões do Sistema Solar
export const SOLAR_SYSTEM_REGIONS = {
  main_belt: {
    name: "Cinturão Principal de Asteroides",
    portuguese_name: "Cinturão Principal",
    description: "Região entre Marte e Júpiter contendo a maioria dos asteroides conhecidos.",
    distance_range: "329-478 milhões de km do Sol",
    object_count: "Mais de 1 milhão de asteroides",
    curiosities: [
      "Contém cerca de 4% da massa da Lua",
      "Ceres representa 25% da massa total",
      "Formado por material que não conseguiu formar um planeta",
      "Influenciado pela gravidade de Júpiter",
      "Fonte da maioria dos meteoritos que atingem a Terra"
    ]
  },
  kuiper_belt: {
    name: "Kuiper Belt",
    portuguese_name: "Cinturão de Kuiper",
    description: "Região além de Netuno contendo objetos gelados e planetas anões.",
    distance_range: "30-50 UA do Sol",
    object_count: "Mais de 100.000 objetos > 100km",
    curiosities: [
      "Lar de Plutão e outros planetas anões",
      "Objetos compostos principalmente de gelo",
      "Fonte de cometas de período curto",
      "Descoberto teoricamente antes da observação",
      "Similar ao cinturão de asteroides, mas 20x mais largo"
    ]
  },
  oort_cloud: {
    name: "Oort Cloud",
    portuguese_name: "Nuvem de Oort",
    description: "Nuvem esférica de objetos gelados na periferia do Sistema Solar.",
    distance_range: "2.000-100.000 UA do Sol",
    object_count: "Trilhões de objetos gelados",
    curiosities: [
      "Fonte dos cometas de período longo",
      "Nunca foi observada diretamente",
      "Marca o limite gravitacional do Sistema Solar",
      "Formada por objetos ejetados pelos planetas gigantes",
      "Estende-se até quase meio caminho da estrela mais próxima"
    ]
  }
}