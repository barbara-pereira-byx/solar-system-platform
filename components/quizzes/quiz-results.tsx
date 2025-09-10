"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import type { Quiz, QuizResult } from "@/lib/api"
import { Trophy, RotateCcw, Home, CheckCircle, XCircle, Star, Share2 } from "lucide-react"
import Link from "next/link"

interface QuizResultsProps {
  quiz: Quiz
  result: QuizResult
  onRetake: () => void
}

export function QuizResults({ quiz, result, onRetake }: QuizResultsProps) {
  const correctAnswers = result.answers.filter((answer) => answer.is_correct).length
  const percentage = result.score

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600 dark:text-green-400"
    if (score >= 60) return "text-yellow-600 dark:text-yellow-400"
    return "text-red-600 dark:text-red-400"
  }

  const getScoreMessage = (score: number) => {
    if (score >= 90) return "Excelente! Você domina o assunto!"
    if (score >= 80) return "Muito bom! Você tem um ótimo conhecimento!"
    if (score >= 70) return "Bom trabalho! Continue estudando!"
    if (score >= 60) return "Razoável. Revise alguns conceitos."
    return "Precisa estudar mais. Não desista!"
  }

  const getStarRating = (score: number) => {
    if (score >= 90) return 5
    if (score >= 80) return 4
    if (score >= 70) return 3
    if (score >= 60) return 2
    return 1
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Resultado do Quiz: ${quiz.title}`,
          text: `Acabei de completar o quiz "${quiz.title}" com ${percentage}% de acertos!`,
          url: window.location.href,
        })
      } catch (err) {
        console.log("Erro ao compartilhar:", err)
      }
    } else {
      // Fallback: copy to clipboard
      const text = `Acabei de completar o quiz "${quiz.title}" com ${percentage}% de acertos! ${window.location.origin}/quizzes/${quiz.id}`
      navigator.clipboard.writeText(text)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <Trophy className="h-8 w-8 text-primary" />
        </div>
        <h1 className="text-3xl font-bold mb-2">Quiz Concluído!</h1>
        <p className="text-muted-foreground">{quiz.title}</p>
      </div>

      {/* Score Card */}
      <Card className="mb-8 border-2 border-primary/20">
        <CardHeader className="text-center">
          <CardTitle className="text-4xl font-bold mb-2">
            <span className={getScoreColor(percentage)}>{percentage}%</span>
          </CardTitle>
          <CardDescription className="text-lg">{getScoreMessage(percentage)}</CardDescription>
          <div className="flex items-center justify-center gap-1 mt-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`h-6 w-6 ${
                  star <= getStarRating(percentage) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                }`}
              />
            ))}
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-6 text-center">
            <div>
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">{correctAnswers}</div>
              <p className="text-sm text-muted-foreground">Respostas Corretas</p>
            </div>
            <div>
              <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                {result.total_questions - correctAnswers}
              </div>
              <p className="text-sm text-muted-foreground">Respostas Incorretas</p>
            </div>
            <div>
              <div className="text-2xl font-bold text-primary">{result.total_questions}</div>
              <p className="text-sm text-muted-foreground">Total de Perguntas</p>
            </div>
          </div>
          <div className="mt-6">
            <Progress value={percentage} className="h-3" />
          </div>
        </CardContent>
      </Card>

      {/* Detailed Results */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Revisão das Respostas</CardTitle>
          <CardDescription>Veja como você se saiu em cada pergunta</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {quiz.questions.map((question, index) => {
            const userAnswer = result.answers.find((a) => a.question_id === question.id)
            const isCorrect = userAnswer?.is_correct || false

            return (
              <div key={question.id} className="border rounded-lg p-4">
                <div className="flex items-start gap-3 mb-3">
                  <div className="flex-shrink-0">
                    {isCorrect ? (
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-500 mt-0.5" />
                    )}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium mb-2">
                      {index + 1}. {question.question}
                    </h4>
                    <div className="space-y-2">
                      {question.options.map((option, optionIndex) => {
                        let optionClass = "text-muted-foreground"
                        let badge = null

                        if (optionIndex === question.correct_answer) {
                          optionClass = "text-green-600 dark:text-green-400 font-medium"
                          badge = (
                            <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                              Correta
                            </Badge>
                          )
                        } else if (optionIndex === userAnswer?.selected_answer && !isCorrect) {
                          optionClass = "text-red-600 dark:text-red-400 font-medium"
                          badge = (
                            <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
                              Sua resposta
                            </Badge>
                          )
                        }

                        return (
                          <div key={optionIndex} className="flex items-center justify-between">
                            <span className={optionClass}>
                              {String.fromCharCode(65 + optionIndex)}. {option}
                            </span>
                            {badge}
                          </div>
                        )
                      })}
                    </div>
                    <div className="mt-3 p-3 bg-muted/50 rounded-lg">
                      <p className="text-sm text-muted-foreground">
                        <strong>Explicação:</strong> {question.explanation}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button onClick={onRetake} variant="outline" size="lg">
          <RotateCcw className="h-4 w-4 mr-2" />
          Refazer Quiz
        </Button>
        <Button onClick={handleShare} variant="outline" size="lg">
          <Share2 className="h-4 w-4 mr-2" />
          Compartilhar Resultado
        </Button>
        <Button asChild size="lg">
          <Link href="/quizzes">
            <Home className="h-4 w-4 mr-2" />
            Outros Quizzes
          </Link>
        </Button>
      </div>

      {/* Recommendations */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Próximos Passos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium mb-2">Para melhorar seu desempenho:</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Explore os planetas na seção "Explorar"</li>
                <li>• Use as ferramentas de comparação</li>
                <li>• Leia as informações detalhadas de cada planeta</li>
                <li>• Pratique com outros quizzes</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">Recursos recomendados:</h4>
              <div className="space-y-2">
                <Button asChild variant="outline" size="sm" className="w-full justify-start bg-transparent">
                  <Link href="/explorar">Explorar Sistema Solar 3D</Link>
                </Button>
                <Button asChild variant="outline" size="sm" className="w-full justify-start bg-transparent">
                  <Link href="/comparar">Comparar Planetas</Link>
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
