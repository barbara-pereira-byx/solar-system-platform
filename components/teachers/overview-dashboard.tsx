"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Users, BookOpen, Trophy, Clock, TrendingUp, TrendingDown, Download, RefreshCw } from "lucide-react"

export function OverviewDashboard() {
  // Mock data - in real app, this would come from API
  const stats = {
    totalStudents: 156,
    activeStudents: 89,
    completedQuizzes: 342,
    averageScore: 78,
    totalTimeSpent: 2847, // minutes
    popularQuiz: "Planetas Rochosos",
  }

  const recentActivity = [
    {
      student: "Ana Silva",
      action: "Completou quiz 'Gigantes Gasosos'",
      score: 85,
      time: "2 horas atrás",
    },
    {
      student: "João Santos",
      action: "Explorou Júpiter no Sistema Solar 3D",
      time: "3 horas atrás",
    },
    {
      student: "Maria Costa",
      action: "Completou quiz 'Planetas Rochosos'",
      score: 92,
      time: "5 horas atrás",
    },
    {
      student: "Pedro Lima",
      action: "Usou calculadora de peso em Marte",
      time: "1 dia atrás",
    },
    {
      student: "Sofia Oliveira",
      action: "Comparou Terra e Vênus",
      time: "1 dia atrás",
    },
  ]

  const quizPerformance = [
    { name: "Planetas Rochosos", attempts: 89, avgScore: 82, difficulty: "Fácil" },
    { name: "Gigantes Gasosos", attempts: 67, avgScore: 75, difficulty: "Médio" },
    { name: "Sistema Solar Avançado", attempts: 23, avgScore: 68, difficulty: "Difícil" },
  ]

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Alunos</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalStudents}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">{stats.activeStudents} ativos</span> esta semana
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Quizzes Completados</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.completedQuizzes}</div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="inline h-3 w-3 mr-1" />
              +12% desde a semana passada
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pontuação Média</CardTitle>
            <Trophy className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.averageScore}%</div>
            <p className="text-xs text-muted-foreground">
              <TrendingDown className="inline h-3 w-3 mr-1" />
              -3% desde a semana passada
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tempo Total</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Math.round(stats.totalTimeSpent / 60)}h</div>
            <p className="text-xs text-muted-foreground">
              {Math.round(stats.totalTimeSpent / stats.totalStudents)} min por aluno
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Quiz Performance */}
        <Card>
          <CardHeader>
            <CardTitle>Desempenho por Quiz</CardTitle>
            <CardDescription>Estatísticas dos quizzes mais utilizados</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {quizPerformance.map((quiz, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{quiz.name}</span>
                    <Badge
                      variant="outline"
                      className={
                        quiz.difficulty === "Fácil"
                          ? "text-green-600 border-green-200"
                          : quiz.difficulty === "Médio"
                            ? "text-yellow-600 border-yellow-200"
                            : "text-red-600 border-red-200"
                      }
                    >
                      {quiz.difficulty}
                    </Badge>
                  </div>
                  <span className="text-sm text-muted-foreground">{quiz.attempts} tentativas</span>
                </div>
                <div className="flex items-center gap-2">
                  <Progress value={quiz.avgScore} className="flex-1 h-2" />
                  <span className="text-sm font-medium w-12">{quiz.avgScore}%</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Atividade Recente</CardTitle>
              <CardDescription>Últimas ações dos alunos na plataforma</CardDescription>
            </div>
            <Button variant="outline" size="sm">
              <RefreshCw className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">{activity.student}</p>
                    <p className="text-sm text-muted-foreground">{activity.action}</p>
                    {activity.score && (
                      <Badge variant="secondary" className="mt-1">
                        {activity.score}% de acerto
                      </Badge>
                    )}
                  </div>
                  <span className="text-xs text-muted-foreground flex-shrink-0">{activity.time}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Ações Rápidas</CardTitle>
          <CardDescription>Ferramentas úteis para gerenciar sua turma</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2 bg-transparent">
              <Download className="h-5 w-5" />
              <span className="text-sm">Exportar Relatórios</span>
            </Button>
            <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2 bg-transparent">
              <Users className="h-5 w-5" />
              <span className="text-sm">Gerenciar Alunos</span>
            </Button>
            <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2 bg-transparent">
              <BookOpen className="h-5 w-5" />
              <span className="text-sm">Criar Quiz</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
