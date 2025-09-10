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
import { ArrowLeft, AlertTriangle } from "lucide-react"

export default function QuizPage() {
  const params = useParams()
  const router = useRouter()
  const [quiz, setQuiz] = useState<Quiz | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [quizState, setQuizState] = useState<"taking" | "completed">("taking")
  const [result, setResult] = useState<QuizResult | null>(null)

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

        const quizId = Number.parseInt(params.id as string)
        if (isNaN(quizId)) {
          setError("ID do quiz inválido")
          return
        }

        const foundQuiz = mockQuizzes.find((q) => q.id === quizId)
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
      user_name: "Usuário",
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

    // Save quiz result
    const quizResults = JSON.parse(localStorage.getItem("quizResults") || "[]")
    quizResults.push(quizResult)
    localStorage.setItem("quizResults", JSON.stringify(quizResults))
  }

  const handleRetakeQuiz = () => {
    setQuizState("taking")
    setResult(null)
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
    <div className="min-h-screen bg-background">
      <Navigation />
      {quizState === "taking" ? (
        <QuizInterface quiz={quiz} onComplete={handleQuizComplete} />
      ) : (
        <QuizResults quiz={quiz} result={result!} onRetake={handleRetakeQuiz} />
      )}
    </div>
  )
}
