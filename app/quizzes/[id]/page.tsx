"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Navigation } from "@/components/navigation"
import { QuizInterface } from "@/components/quizzes/quiz-interface"
import { QuizResults } from "@/components/quizzes/quiz-results"
import { LoadingSpinner } from "@/components/loading-spinner"
import type { Quiz, QuizResult, QuizAnswer } from "@/lib/api"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, AlertTriangle, User, Play } from "lucide-react"

export default function QuizPage() {
  const params = useParams()
  const router = useRouter()
  const [quiz, setQuiz] = useState<Quiz | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [quizState, setQuizState] = useState<"name" | "taking" | "completed">("name")
  const [result, setResult] = useState<QuizResult | null>(null)
  const [userName, setUserName] = useState('')
  const [nameError, setNameError] = useState('')

  // Mock quiz data (same as in quizzes page)
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
    const loadQuiz = async () => {
      try {
        setLoading(true)
        setError(null)

        const quizId = params.id as string
        if (!quizId) {
          setError("ID do quiz inválido")
          return
        }

        // Try to fetch from API first
        try {
          const response = await fetch(`/api/quizzes/${quizId}`)
          if (response.ok) {
            const apiQuiz = await response.json()
            // Transform API data to match the expected format
            const transformedQuiz: Quiz = {
              id: apiQuiz.id,
              title: apiQuiz.title,
              description: apiQuiz.description || '',
              difficulty: 'medium' as const,
              questions: apiQuiz.questions.map((q: any, index: number) => {
                let options = []
                let correctAnswerIndex = 0
                
                if (q.type === 'true_false') {
                  options = ['Verdadeiro', 'Falso']
                  correctAnswerIndex = q.correctAnswer === 'true' ? 0 : 1
                } else if (Array.isArray(q.options)) {
                  options = q.options
                  if (options.length > 0 && q.correctAnswer) {
                    const foundIndex = options.findIndex(opt => opt === q.correctAnswer)
                    correctAnswerIndex = foundIndex >= 0 ? foundIndex : 0
                  }
                }
                
                return {
                  id: q.id,
                  question: q.question,
                  options,
                  correct_answer: correctAnswerIndex,
                  explanation: q.explanation || '',
                }
              }),
              created_at: apiQuiz.createdAt,
            }
            setQuiz(transformedQuiz)
            return
          }
        } catch (apiError) {
          console.log('API fetch failed, trying mock data:', apiError)
        }

        // Fallback to mock data with numeric ID
        const numericId = Number.parseInt(quizId)
        const foundQuiz = mockQuizzes.find((q) => q.id === numericId)
        if (!foundQuiz) {
          setError("Quiz não encontrado")
          return
        }

        setQuiz(foundQuiz)
      } catch (err) {
        setError("Erro ao carregar o quiz")
        console.error("Error loading quiz:", err)
      } finally {
        setLoading(false)
      }
    }

    loadQuiz()
  }, [params.id])

  const handleQuizComplete = (answers: QuizAnswer[]) => {
    if (!quiz) return

    const correctAnswers = answers.filter((answer) => answer.is_correct).length
    const score = (correctAnswers / quiz.questions.length) * 100

    const quizResult: QuizResult = {
      id: Date.now(),
      quiz: quiz.id,
      user_name: userName || "Usuário Anônimo",
      score: Math.round(score),
      total_questions: quiz.questions.length,
      completed_at: new Date().toISOString(),
      answers,
    }

    setResult(quizResult)
    setQuizState("completed")

    // Save to localStorage
    const completedQuizzes = JSON.parse(localStorage.getItem("completedQuizzes") || "[]")
    if (!completedQuizzes.includes(quiz.id)) {
      completedQuizzes.push(quiz.id)
      localStorage.setItem("completedQuizzes", JSON.stringify(completedQuizzes))
    }

    // Save quiz result with detailed answers
    const quizResults = JSON.parse(localStorage.getItem("quizResults") || "[]")
    quizResults.push(quizResult)
    localStorage.setItem("quizResults", JSON.stringify(quizResults))
    
    // Save to ranking
    const ranking = JSON.parse(localStorage.getItem("quizRanking") || "[]")
    ranking.push({
      name: userName || "Usuário Anônimo",
      quiz: quiz.title,
      score: Math.round(score),
      date: new Date().toISOString(),
      quiz_id: quiz.id
    })
    // Sort by score descending
    ranking.sort((a, b) => b.score - a.score)
    localStorage.setItem("quizRanking", JSON.stringify(ranking))
  }

  const handleRetakeQuiz = () => {
    setQuizState("name")
    setResult(null)
    setUserName('')
  }
  
  const checkNameExists = (name: string) => {
    const ranking = JSON.parse(localStorage.getItem("quizRanking") || "[]")
    return ranking.some((entry: any) => 
      entry.name.toLowerCase() === name.toLowerCase() && 
      entry.quiz_id === quiz?.id
    )
  }

  const handleStartQuiz = () => {
    const trimmedName = userName.trim()
    if (!trimmedName) {
      setNameError('Por favor, digite seu nome')
      return
    }
    
    if (checkNameExists(trimmedName)) {
      setNameError('Este nome já foi usado neste quiz. Escolha outro nome.')
      return
    }
    
    setNameError('')
    setQuizState("taking")
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
          <div className="text-center">
            <LoadingSpinner size="lg" className="mb-4" />
            <p className="text-lg text-muted-foreground">Carregando quiz...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error || !quiz) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <Button variant="ghost" onClick={() => router.back()} className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>{error || "Quiz não encontrado"}</AlertDescription>
          </Alert>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <Navigation />
      {quizState === "name" ? (
        <div className="container mx-auto px-4 py-8 max-w-md">
          <Button variant="ghost" onClick={() => router.back()} className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
          <Card className="border-0 shadow-xl bg-card/80 backdrop-blur-sm">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <User className="h-8 w-8 text-primary" />
              </div>
              <CardTitle className="text-2xl">{quiz.title}</CardTitle>
              <p className="text-muted-foreground">{quiz.description}</p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="userName" className="text-base font-medium">
                  Qual é o seu nome?
                </Label>
                <Input
                  id="userName"
                  value={userName}
                  onChange={(e) => {
                    setUserName(e.target.value)
                    if (nameError) setNameError('')
                  }}
                  placeholder="Digite seu nome..."
                  className={`text-base p-3 ${nameError ? 'border-red-500' : ''}`}
                  onKeyPress={(e) => e.key === 'Enter' && handleStartQuiz()}
                />
                {nameError && (
                  <p className="text-sm text-red-500 mt-1">{nameError}</p>
                )}
              </div>
              <div className="bg-muted/30 p-4 rounded-lg space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Perguntas:</span>
                  <span className="font-medium">{quiz.questions.length}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Tempo estimado:</span>
                  <span className="font-medium">{Math.ceil(quiz.questions.length * 1.5)} min</span>
                </div>
              </div>
              <Button 
                onClick={handleStartQuiz} 
                disabled={!userName.trim()}
                className="w-full py-3 text-base"
              >
                <Play className="h-4 w-4 mr-2" />
                Iniciar Quiz
              </Button>
            </CardContent>
          </Card>
        </div>
      ) : quizState === "taking" ? (
        <QuizInterface quiz={quiz} onComplete={handleQuizComplete} />
      ) : (
        <QuizResults quiz={quiz} result={result!} onRetake={handleRetakeQuiz} />
      )}
    </div>
  )
}
