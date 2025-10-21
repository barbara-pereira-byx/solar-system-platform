"use client"

import { useState, useEffect } from "react"
import { Navigation } from "@/components/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { LoadingSpinner } from "@/components/loading-spinner"
import { Progress } from "@/components/ui/progress"
import type { Quiz } from "@/lib/api"
import { BookOpen, Clock, Trophy, Star, Play, CheckCircle } from "lucide-react"
import Link from "next/link"

export default function QuizzesPage() {
  const [quizzes, setQuizzes] = useState<Quiz[]>([])
  const [loading, setLoading] = useState(true)
  const [completedQuizzes, setCompletedQuizzes] = useState<number[]>([])

  // Mock quiz data (fallback)
  const mockQuizzes: Quiz[] = [
    {
      id: 1,
      title: "Planetas Rochosos",
      description: "Teste seus conhecimentos sobre Mercúrio, Vênus, Terra e Marte",
      difficulty: "easy",
      questions: [
        {
          id: 1,
          question: "Qual é o planeta mais próximo do Sol?",
          options: ["Mercúrio", "Vênus", "Terra", "Marte"],
          correct_answer: 0,
          explanation: "Mercúrio é o planeta mais próximo do Sol, a uma distância média de 57,9 milhões de km.",
        },
        {
          id: 2,
          question: "Qual planeta é conhecido como 'Planeta Vermelho'?",
          options: ["Mercúrio", "Vênus", "Terra", "Marte"],
          correct_answer: 3,
          explanation: "Marte é conhecido como Planeta Vermelho devido ao óxido de ferro em sua superfície.",
        },
        {
          id: 3,
          question: "Qual planeta tem a atmosfera mais densa?",
          options: ["Mercúrio", "Vênus", "Terra", "Marte"],
          correct_answer: 1,
          explanation: "Vênus tem uma atmosfera extremamente densa, 90 vezes mais densa que a da Terra.",
        },
        {
          id: 4,
          question: "Quantas luas a Terra possui?",
          options: ["0", "1", "2", "3"],
          correct_answer: 1,
          explanation: "A Terra possui apenas uma lua natural, simplesmente chamada de Lua.",
        },
        {
          id: 5,
          question: "Qual planeta tem o dia mais longo?",
          options: ["Mercúrio", "Vênus", "Terra", "Marte"],
          correct_answer: 1,
          explanation: "Vênus tem o dia mais longo, com uma rotação que dura 243 dias terrestres.",
        },
      ],
      created_at: "2024-01-01",
    },
    {
      id: 2,
      title: "Gigantes Gasosos",
      description: "Explore os mistérios de Júpiter, Saturno, Urano e Netuno",
      difficulty: "medium",
      questions: [
        {
          id: 6,
          question: "Qual é o maior planeta do Sistema Solar?",
          options: ["Júpiter", "Saturno", "Urano", "Netuno"],
          correct_answer: 0,
          explanation: "Júpiter é o maior planeta, com mais massa que todos os outros planetas combinados.",
        },
        {
          id: 7,
          question: "Qual planeta é famoso por seus anéis?",
          options: ["Júpiter", "Saturno", "Urano", "Netuno"],
          correct_answer: 1,
          explanation:
            "Saturno é famoso por seus espetaculares anéis, embora outros gigantes gasosos também os tenham.",
        },
        {
          id: 8,
          question: "Quantas luas Júpiter possui aproximadamente?",
          options: ["12", "27", "53", "95"],
          correct_answer: 3,
          explanation: "Júpiter possui mais de 95 luas conhecidas, incluindo as quatro grandes luas galileanas.",
        },
        {
          id: 9,
          question: "Qual planeta tem rotação retrógrada além de Vênus?",
          options: ["Júpiter", "Saturno", "Urano", "Netuno"],
          correct_answer: 2,
          explanation: "Urano tem uma rotação peculiar, girando 'de lado' com um eixo inclinado em 98 graus.",
        },
        {
          id: 10,
          question: "Qual é a característica mais marcante de Netuno?",
          options: ["Anéis", "Grande Mancha Vermelha", "Ventos extremos", "Muitas luas"],
          correct_answer: 2,
          explanation: "Netuno possui os ventos mais rápidos do Sistema Solar, chegando a 2.100 km/h.",
        },
      ],
      created_at: "2024-01-01",
    },
    {
      id: 3,
      title: "Sistema Solar Avançado",
      description: "Desafio para especialistas em astronomia",
      difficulty: "hard",
      questions: [
        {
          id: 11,
          question: "Qual é a velocidade de escape da Terra?",
          options: ["7,9 km/s", "11,2 km/s", "16,7 km/s", "25,0 km/s"],
          correct_answer: 1,
          explanation: "A velocidade de escape da Terra é 11,2 km/s, necessária para escapar da gravidade terrestre.",
        },
        {
          id: 12,
          question: "Qual lua de Júpiter tem atividade vulcânica?",
          options: ["Europa", "Ganimedes", "Io", "Calisto"],
          correct_answer: 2,
          explanation: "Io é a lua mais vulcanicamente ativa do Sistema Solar devido às forças de maré de Júpiter.",
        },
        {
          id: 13,
          question: "Qual é o período orbital de Halley?",
          options: ["50 anos", "76 anos", "100 anos", "150 anos"],
          correct_answer: 1,
          explanation: "O cometa Halley tem um período orbital de aproximadamente 76 anos.",
        },
        {
          id: 14,
          question: "Qual planeta tem a maior inclinação axial?",
          options: ["Terra", "Marte", "Urano", "Netuno"],
          correct_answer: 2,
          explanation: "Urano tem uma inclinação axial de 98°, praticamente girando de lado.",
        },
        {
          id: 15,
          question: "Qual é a temperatura no núcleo do Sol?",
          options: ["1 milhão °C", "6 milhões °C", "15 milhões °C", "50 milhões °C"],
          correct_answer: 2,
          explanation: "O núcleo do Sol atinge temperaturas de aproximadamente 15 milhões de graus Celsius.",
        },
      ],
      created_at: "2024-01-01",
    },
  ]

  useEffect(() => {
    const loadQuizzes = async () => {
      try {
        setLoading(true)
        
        // Try to fetch from API first
        const response = await fetch('/api/quizzes')
        if (response.ok) {
          const apiQuizzes = await response.json()
          // Transform API data to match the expected format
          const transformedQuizzes: Quiz[] = apiQuizzes.map((quiz: any) => ({
            id: quiz.id,
            title: quiz.title,
            description: quiz.description || '',
            difficulty: 'medium' as const,
            questions: quiz.questions.map((q: any) => ({
              id: q.id,
              question: q.question,
              options: q.options || [],
              correct_answer: 0, // This would need to be determined based on the correctAnswer field
              explanation: q.explanation || '',
            })),
            estimated_time: quiz.questions.length * 30, // 30 seconds per question
            total_questions: quiz.questions.length,
            created_at: quiz.createdAt,
            updated_at: quiz.updatedAt,
          }))
          setQuizzes(transformedQuizzes)
          const completed = JSON.parse(localStorage.getItem("completedQuizzes") || "[]")
          setCompletedQuizzes(completed)
          setLoading(false)
          return
        }
        
        // Fallback to mock data
        setQuizzes(mockQuizzes)
        const completed = JSON.parse(localStorage.getItem("completedQuizzes") || "[]")
        setCompletedQuizzes(completed)
        setLoading(false)
      } catch (error) {
        console.error('Error loading quizzes:', error)
        setQuizzes(mockQuizzes)
        const completed = JSON.parse(localStorage.getItem("completedQuizzes") || "[]")
        setCompletedQuizzes(completed)
        setLoading(false)
      }
    }
    
    loadQuizzes()
  }, [])

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "easy":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      case "medium":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
      case "hard":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
    }
  }

  const getDifficultyLabel = (difficulty: string) => {
    switch (difficulty) {
      case "easy":
        return "Fácil"
      case "medium":
        return "Médio"
      case "hard":
        return "Difícil"
      default:
        return difficulty
    }
  }

  const getCompletionRate = () => {
    if (quizzes.length === 0) return 0
    return (completedQuizzes.length / quizzes.length) * 100
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
          <div className="text-center">
            <LoadingSpinner size="lg" className="mb-4" />
            <p className="text-lg text-muted-foreground">Carregando quizzes...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">Quizzes Educacionais</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Teste seus conhecimentos sobre o Sistema Solar com nossos quizzes interativos
          </p>
        </div>

        {/* Progress Overview */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5" />
              Seu Progresso
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-1">{completedQuizzes.length}</div>
                <p className="text-sm text-muted-foreground">Quizzes Completados</p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-1">{quizzes.length}</div>
                <p className="text-sm text-muted-foreground">Total Disponível</p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-1">{getCompletionRate().toFixed(0)}%</div>
                <p className="text-sm text-muted-foreground">Taxa de Conclusão</p>
              </div>
            </div>
            <div className="mt-4">
              <Progress value={getCompletionRate()} className="h-2" />
            </div>
          </CardContent>
        </Card>

        {/* Quiz List */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {quizzes.map((quiz) => {
            const isCompleted = completedQuizzes.includes(quiz.id)

            return (
              <Card key={quiz.id} className="group hover:shadow-lg transition-all duration-300">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="flex items-center gap-2 mb-2">
                        <BookOpen className="h-5 w-5" />
                        {quiz.title}
                        {isCompleted && <CheckCircle className="h-4 w-4 text-green-500" />}
                      </CardTitle>
                      <CardDescription>{quiz.description}</CardDescription>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mt-3">
                    <Badge className={getDifficultyColor(quiz.difficulty)}>{getDifficultyLabel(quiz.difficulty)}</Badge>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      {quiz.questions.length} perguntas
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Dificuldade:</span>
                      <div className="flex items-center gap-1">
                        {[1, 2, 3].map((star) => (
                          <Star
                            key={star}
                            className={`h-4 w-4 ${
                              star <= (quiz.difficulty === "easy" ? 1 : quiz.difficulty === "medium" ? 2 : 3)
                                ? "fill-yellow-400 text-yellow-400"
                                : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Tempo estimado:</span>
                      <span>{Math.ceil(quiz.questions.length * 1.5)} min</span>
                    </div>
                    {isCompleted && (
                      <div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400">
                        <CheckCircle className="h-4 w-4" />
                        Quiz completado
                      </div>
                    )}
                  </div>
                  <Button asChild className="w-full mt-4" variant={isCompleted ? "outline" : "default"}>
                    <Link href={`/quizzes/${quiz.id}`}>
                      <Play className="h-4 w-4 mr-2" />
                      {isCompleted ? "Refazer Quiz" : "Iniciar Quiz"}
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Tips Section */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Dicas para um Melhor Desempenho</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium mb-2">Antes de começar:</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Explore os planetas na seção "Explorar"</li>
                  <li>• Leia as informações detalhadas de cada planeta</li>
                  <li>• Use a calculadora de peso para entender gravidade</li>
                  <li>• Compare diferentes planetas para ver as diferenças</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-2">Durante o quiz:</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Leia cada pergunta com atenção</li>
                  <li>• Não tenha pressa, pense bem antes de responder</li>
                  <li>• Use o processo de eliminação quando em dúvida</li>
                  <li>• Leia as explicações para aprender mais</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
