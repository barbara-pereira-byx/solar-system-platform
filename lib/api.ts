const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE || "https://api-planetario.univ.br"

export interface Planet {
  id: number
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
  model_url?: string
  color: string
  moons_count: number
  created_at: string
  updated_at: string
}

export interface Moon {
  id: number
  name: string
  portuguese_name: string
  planet: number
  radius: number
  mass: number
  distance_from_planet: number
  orbital_period: number
  description: string
  image_url: string
  model_url?: string
}

export interface Quiz {
  id: number
  title: string
  description: string
  difficulty: "easy" | "medium" | "hard"
  questions: QuizQuestion[]
  created_at: string
}

export interface QuizQuestion {
  id: number
  question: string
  options: string[]
  correct_answer: number
  explanation: string
}

export interface QuizResult {
  id: number
  quiz: number
  user_name: string
  score: number
  total_questions: number
  completed_at: string
  answers: QuizAnswer[]
}

export interface QuizAnswer {
  question_id: number
  selected_answer: number
  is_correct: boolean
}

class ApiClient {
  private baseUrl: string

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl
  }

  private async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`

    try {
      const response = await fetch(url, {
        headers: {
          "Content-Type": "application/json",
          ...options?.headers,
        },
        ...options,
      })

      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`)
      }

      return await response.json()
    } catch (error) {
      console.error(`API request failed for ${endpoint}:`, error)
      throw error
    }
  }

  // Planet endpoints
  async getPlanets(): Promise<Planet[]> {
    return this.request<Planet[]>("/api/planets/")
  }

  async getPlanet(id: number): Promise<Planet> {
    return this.request<Planet>(`/api/planets/${id}/`)
  }

  // Moon endpoints
  async getMoons(planetId?: number): Promise<Moon[]> {
    const endpoint = planetId ? `/api/moons/?planet=${planetId}` : "/api/moons/"
    return this.request<Moon[]>(endpoint)
  }

  async getMoon(id: number): Promise<Moon> {
    return this.request<Moon>(`/api/moons/${id}/`)
  }

  // Quiz endpoints
  async getQuizzes(): Promise<Quiz[]> {
    return this.request<Quiz[]>("/api/quizzes/")
  }

  async getQuiz(id: number): Promise<Quiz> {
    return this.request<Quiz>(`/api/quizzes/${id}/`)
  }

  async submitQuizResult(result: Omit<QuizResult, "id" | "completed_at">): Promise<QuizResult> {
    return this.request<QuizResult>("/api/quiz-results/", {
      method: "POST",
      body: JSON.stringify(result),
    })
  }

  // Comparison endpoint
  async comparePlanets(planetIds: number[]): Promise<Planet[]> {
    const params = planetIds.map((id) => `ids=${id}`).join("&")
    return this.request<Planet[]>(`/api/planets/compare/?${params}`)
  }
}

export const apiClient = new ApiClient()

// Utility functions for data formatting
export const formatMass = (mass: number): string => {
  if (mass >= 1e24) {
    return `${(mass / 1e24).toFixed(2)} × 10²⁴ kg`
  }
  return `${mass.toExponential(2)} kg`
}

export const formatDistance = (distance: number): string => {
  if (distance >= 1e9) {
    return `${(distance / 1e9).toFixed(2)} bilhões km`
  }
  if (distance >= 1e6) {
    return `${(distance / 1e6).toFixed(2)} milhões km`
  }
  return `${distance.toLocaleString("pt-BR")} km`
}

export const formatTemperature = (temp: number): string => {
  return `${temp}°C`
}

export const formatPeriod = (days: number): string => {
  if (days >= 365) {
    const years = (days / 365).toFixed(1)
    return `${years} anos terrestres`
  }
  return `${days.toFixed(1)} dias terrestres`
}
