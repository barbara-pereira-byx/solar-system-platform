"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import type { Quiz, QuizAnswer } from "@/lib/api"
import { Clock, CheckCircle, XCircle, ArrowRight, ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"

interface QuizInterfaceProps {
  quiz: Quiz
  onComplete: (answers: QuizAnswer[]) => void
}

export function QuizInterface({ quiz, onComplete }: QuizInterfaceProps) {
  const router = useRouter()
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>(new Array(quiz.questions.length).fill(-1))
  const [timeElapsed, setTimeElapsed] = useState(0)
  const [showFeedback, setShowFeedback] = useState(false)

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeElapsed((prev) => prev + 1)
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const handleAnswerSelect = (answerIndex: number) => {
    const newAnswers = [...selectedAnswers]
    newAnswers[currentQuestion] = answerIndex
    setSelectedAnswers(newAnswers)
  }

  const handleNext = () => {
    if (currentQuestion < quiz.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
      setShowFeedback(false)
    }
  }

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
      setShowFeedback(false)
    }
  }

  const handleShowFeedback = () => {
    setShowFeedback(true)
  }

  const handleFinishQuiz = () => {
    const answers: QuizAnswer[] = quiz.questions.map((question, index) => ({
      question_id: question.id,
      selected_answer: selectedAnswers[index],
      is_correct: selectedAnswers[index] === question.correct_answer,
    }))

    onComplete(answers)
  }

  const currentQ = quiz.questions[currentQuestion]
  const selectedAnswer = selectedAnswers[currentQuestion]
  const isAnswered = selectedAnswer !== -1
  const isLastQuestion = currentQuestion === quiz.questions.length - 1
  const allQuestionsAnswered = selectedAnswers.every((answer) => answer !== -1)

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

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <Button variant="ghost" onClick={() => router.push("/quizzes")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar aos Quizzes
          </Button>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              {formatTime(timeElapsed)}
            </div>
            <Badge className={getDifficultyColor(quiz.difficulty)}>{getDifficultyLabel(quiz.difficulty)}</Badge>
          </div>
        </div>
        <h1 className="text-3xl font-bold mb-2">{quiz.title}</h1>
        <p className="text-muted-foreground">{quiz.description}</p>
      </div>

      {/* Progress */}
      <Card className="mb-8">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">
              Pergunta {currentQuestion + 1} de {quiz.questions.length}
            </span>
            <span className="text-sm text-muted-foreground">
              {selectedAnswers.filter((a) => a !== -1).length} respondidas
            </span>
          </div>
          <Progress value={((currentQuestion + 1) / quiz.questions.length) * 100} className="h-2" />
        </CardContent>
      </Card>

      {/* Question */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-xl">{currentQ.question}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {currentQ.options.map((option, index) => {
            let buttonVariant: "default" | "outline" | "secondary" = "outline"
            let buttonClass = ""

            if (showFeedback) {
              if (index === currentQ.correct_answer) {
                buttonVariant = "default"
                buttonClass = "bg-green-500 hover:bg-green-600 text-white border-green-500"
              } else if (index === selectedAnswer && index !== currentQ.correct_answer) {
                buttonVariant = "secondary"
                buttonClass = "bg-red-500 hover:bg-red-600 text-white border-red-500"
              }
            } else if (index === selectedAnswer) {
              buttonVariant = "default"
            }

            return (
              <Button
                key={index}
                variant={buttonVariant}
                className={`w-full justify-start text-left h-auto p-4 ${buttonClass}`}
                onClick={() => !showFeedback && handleAnswerSelect(index)}
                disabled={showFeedback}
              >
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full border-2 flex items-center justify-center text-sm font-medium">
                    {String.fromCharCode(65 + index)}
                  </div>
                  <span className="flex-1">{option}</span>
                  {showFeedback && index === currentQ.correct_answer && (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  )}
                  {showFeedback && index === selectedAnswer && index !== currentQ.correct_answer && (
                    <XCircle className="h-5 w-5 text-red-500" />
                  )}
                </div>
              </Button>
            )
          })}
        </CardContent>
      </Card>

      {/* Feedback */}
      {showFeedback && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {selectedAnswer === currentQ.correct_answer ? (
                <CheckCircle className="h-5 w-5 text-green-500" />
              ) : (
                <XCircle className="h-5 w-5 text-red-500" />
              )}
              {selectedAnswer === currentQ.correct_answer ? "Correto!" : "Incorreto"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">{currentQ.explanation}</p>
          </CardContent>
        </Card>
      )}

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <Button variant="outline" onClick={handlePrevious} disabled={currentQuestion === 0}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Anterior
        </Button>

        <div className="flex gap-2">
          {isAnswered && !showFeedback && (
            <Button variant="outline" onClick={handleShowFeedback}>
              Ver Explicação
            </Button>
          )}

          {isLastQuestion ? (
            <Button onClick={handleFinishQuiz} disabled={!allQuestionsAnswered}>
              Finalizar Quiz
            </Button>
          ) : (
            <Button onClick={handleNext} disabled={!isAnswered}>
              Próxima
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          )}
        </div>
      </div>

      {/* Question Overview */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Visão Geral das Perguntas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-5 md:grid-cols-10 gap-2">
            {quiz.questions.map((_, index) => (
              <Button
                key={index}
                variant={
                  index === currentQuestion ? "default" : selectedAnswers[index] !== -1 ? "secondary" : "outline"
                }
                size="sm"
                className="aspect-square p-0"
                onClick={() => {
                  setCurrentQuestion(index)
                  setShowFeedback(false)
                }}
              >
                {index + 1}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
