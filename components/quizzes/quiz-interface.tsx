"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
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
  const [textAnswers, setTextAnswers] = useState<string[]>(new Array(quiz.questions.length).fill(''))
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
    const answers: QuizAnswer[] = quiz.questions.map((question, index) => {
      const isTextQuestion = !question.options || question.options.length === 0
      return {
        question_id: question.id,
        selected_answer: selectedAnswers[index],
        text_answer: isTextQuestion ? textAnswers[index] : undefined,
        is_correct: isTextQuestion ? true : selectedAnswers[index] === question.correct_answer,
      }
    })

    onComplete(answers)
  }

  const currentQ = quiz.questions[currentQuestion]
  const selectedAnswer = selectedAnswers[currentQuestion]
  const isAnswered = selectedAnswer !== -1
  const isLastQuestion = currentQuestion === quiz.questions.length - 1
  const allQuestionsAnswered = selectedAnswers.every((answer, index) => {
    const question = quiz.questions[index]
    const isTextQuestion = !question.options || question.options.length === 0
    return isTextQuestion ? textAnswers[index]?.trim() : answer !== -1
  })

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
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <Button variant="ghost" onClick={() => router.push("/quizzes")} className="hover:bg-muted/50">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar aos Quizzes
            </Button>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted/30 px-3 py-1.5 rounded-full">
                <Clock className="h-4 w-4" />
                {formatTime(timeElapsed)}
              </div>
              <Badge className={getDifficultyColor(quiz.difficulty)}>{getDifficultyLabel(quiz.difficulty)}</Badge>
            </div>
          </div>
          <div className="text-center mb-6">
            <h1 className="text-4xl font-bold mb-3 bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">{quiz.title}</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">{quiz.description}</p>
          </div>
        </div>

        {/* Progress */}
        <Card className="mb-8 border-0 shadow-lg bg-card/50 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-base font-semibold">
                Pergunta {currentQuestion + 1} de {quiz.questions.length}
              </span>
              <span className="text-sm text-muted-foreground bg-muted/30 px-3 py-1 rounded-full">
                {selectedAnswers.filter((a) => a !== -1).length} respondidas
              </span>
            </div>
            <Progress value={((currentQuestion + 1) / quiz.questions.length) * 100} className="h-3" />
          </CardContent>
        </Card>

        {/* Question */}
        <Card className="mb-8 border-0 shadow-xl bg-card/80 backdrop-blur-sm">
          <CardHeader className="pb-4">
            <CardTitle className="text-2xl leading-relaxed">{currentQ.question}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 pt-2">
          {currentQ.options && currentQ.options.length > 0 ? currentQ.options.map((option, index) => {
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
                className={`w-full justify-start text-left h-auto p-5 transition-all duration-200 hover:scale-[1.02] ${buttonClass}`}
                onClick={() => !showFeedback && handleAnswerSelect(index)}
                disabled={showFeedback}
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full border-2 flex items-center justify-center text-sm font-bold bg-background shadow-sm">
                    {String.fromCharCode(65 + index)}
                  </div>
                  <span className="flex-1 text-left text-base leading-relaxed">{option}</span>
                  {showFeedback && index === currentQ.correct_answer && (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  )}
                  {showFeedback && index === selectedAnswer && index !== currentQ.correct_answer && (
                    <XCircle className="h-5 w-5 text-red-500" />
                  )}
                </div>
              </Button>
            )
          }) : (!currentQ.options || currentQ.options.length === 0) ? (
            <div className="space-y-4">
              <Textarea
                value={textAnswers[currentQuestion] || ''}
                onChange={(e) => {
                  const newTextAnswers = [...textAnswers]
                  newTextAnswers[currentQuestion] = e.target.value
                  setTextAnswers(newTextAnswers)
                  // Mark as answered if there's text
                  const newAnswers = [...selectedAnswers]
                  newAnswers[currentQuestion] = e.target.value.trim() ? 0 : -1
                  setSelectedAnswers(newAnswers)
                }}
                placeholder="Digite sua resposta aqui..."
                rows={4}
                className="w-full p-4 text-base"
                disabled={showFeedback}
              />
              {showFeedback && (
                <div className="bg-muted/50 p-4 rounded-lg">
                  <p className="text-sm text-muted-foreground mb-2">Sua resposta:</p>
                  <p className="text-base">{textAnswers[currentQuestion] || 'Não respondido'}</p>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center text-muted-foreground py-4">
              Nenhuma alternativa disponível para esta pergunta.
            </div>
          )}
        </CardContent>
      </Card>

        {/* Feedback */}
        {showFeedback && (
          <Card className="mb-8 border-0 shadow-lg bg-card/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-xl">
                {selectedAnswer === currentQ.correct_answer ? (
                  <CheckCircle className="h-6 w-6 text-green-500" />
                ) : (
                  <XCircle className="h-6 w-6 text-red-500" />
                )}
                {selectedAnswer === currentQ.correct_answer ? "Correto!" : "Incorreto"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-base leading-relaxed">{currentQ.explanation}</p>
            </CardContent>
          </Card>
        )}

        {/* Navigation */}
        <div className="flex items-center justify-between pt-4">
          <Button variant="outline" onClick={handlePrevious} disabled={currentQuestion === 0} className="px-6 py-2">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Anterior
          </Button>

          <div className="flex gap-3">
            {isAnswered && !showFeedback && (
              <Button variant="outline" onClick={handleShowFeedback} className="px-6 py-2">
                Ver Explicação
              </Button>
            )}

            {isLastQuestion ? (
              <Button onClick={handleFinishQuiz} disabled={!allQuestionsAnswered} className="px-8 py-2 text-base">
                Finalizar Quiz
              </Button>
            ) : (
              <Button onClick={handleNext} disabled={!isAnswered} className="px-6 py-2">
                Próxima
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            )}
          </div>
        </div>

        {/* Question Overview */}
        <Card className="mt-8 border-0 shadow-lg bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-lg">Visão Geral das Perguntas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-5 md:grid-cols-10 gap-3">
              {quiz.questions.map((_, index) => (
                <Button
                  key={index}
                  variant={
                    index === currentQuestion ? "default" : selectedAnswers[index] !== -1 ? "secondary" : "outline"
                  }
                  size="sm"
                  className="aspect-square p-0 text-sm font-semibold transition-all duration-200 hover:scale-110"
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
    </div>
  )
}
