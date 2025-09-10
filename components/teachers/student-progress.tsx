"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Filter, Download, Eye, TrendingUp, TrendingDown, Clock, Trophy } from "lucide-react"

export function StudentProgress() {
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState("name")
  const [selectedStudent, setSelectedStudent] = useState<string | null>(null)

  // Mock student data
  const students = [
    {
      id: "1",
      name: "Ana Silva",
      email: "ana.silva@escola.com",
      totalQuizzes: 3,
      completedQuizzes: 3,
      averageScore: 92,
      totalTime: 165, // minutes
      lastActivity: "2 horas atrás",
      trend: "up",
      recentScores: [85, 92, 95],
      badges: ["Explorador", "Quiz Master"],
    },
    {
      id: "2",
      name: "João Santos",
      email: "joao.santos@escola.com",
      totalQuizzes: 3,
      completedQuizzes: 2,
      averageScore: 78,
      totalTime: 120,
      lastActivity: "1 dia atrás",
      trend: "up",
      recentScores: [72, 84],
      badges: ["Iniciante"],
    },
    {
      id: "3",
      name: "Maria Costa",
      email: "maria.costa@escola.com",
      totalQuizzes: 3,
      completedQuizzes: 3,
      averageScore: 95,
      totalTime: 180,
      lastActivity: "3 horas atrás",
      trend: "stable",
      recentScores: [94, 95, 96],
      badges: ["Explorador", "Quiz Master", "Estrela"],
    },
    {
      id: "4",
      name: "Pedro Lima",
      email: "pedro.lima@escola.com",
      totalQuizzes: 3,
      completedQuizzes: 2,
      averageScore: 65,
      totalTime: 95,
      lastActivity: "2 dias atrás",
      trend: "down",
      recentScores: [70, 60],
      badges: [],
    },
    {
      id: "5",
      name: "Sofia Oliveira",
      email: "sofia.oliveira@escola.com",
      totalQuizzes: 3,
      completedQuizzes: 1,
      averageScore: 88,
      totalTime: 45,
      lastActivity: "1 semana atrás",
      trend: "stable",
      recentScores: [88],
      badges: ["Iniciante"],
    },
  ]

  const filteredStudents = students.filter((student) => student.name.toLowerCase().includes(searchTerm.toLowerCase()))

  const sortedStudents = [...filteredStudents].sort((a, b) => {
    switch (sortBy) {
      case "name":
        return a.name.localeCompare(b.name)
      case "score":
        return b.averageScore - a.averageScore
      case "progress":
        return b.completedQuizzes / b.totalQuizzes - a.completedQuizzes / a.totalQuizzes
      case "activity":
        return new Date(b.lastActivity).getTime() - new Date(a.lastActivity).getTime()
      default:
        return 0
    }
  })

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "up":
        return <TrendingUp className="h-4 w-4 text-green-500" />
      case "down":
        return <TrendingDown className="h-4 w-4 text-red-500" />
      default:
        return <div className="h-4 w-4" />
    }
  }

  const getProgressColor = (percentage: number) => {
    if (percentage >= 80) return "text-green-600"
    if (percentage >= 60) return "text-yellow-600"
    return "text-red-600"
  }

  return (
    <div className="space-y-6">
      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filtros e Busca
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-64">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar aluno..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="min-w-48">
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name">Ordenar por Nome</SelectItem>
                  <SelectItem value="score">Ordenar por Pontuação</SelectItem>
                  <SelectItem value="progress">Ordenar por Progresso</SelectItem>
                  <SelectItem value="activity">Ordenar por Atividade</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button>
              <Download className="h-4 w-4 mr-2" />
              Exportar
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Class Overview */}
      <div className="grid md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total de Alunos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{students.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Alunos Ativos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{students.filter((s) => s.completedQuizzes > 0).length}</div>
            <p className="text-xs text-muted-foreground">
              {Math.round((students.filter((s) => s.completedQuizzes > 0).length / students.length) * 100)}% da turma
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Média da Turma</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.round(students.reduce((acc, student) => acc + student.averageScore, 0) / students.length)}%
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Taxa de Conclusão</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.round(
                (students.reduce((acc, student) => acc + student.completedQuizzes, 0) /
                  students.reduce((acc, student) => acc + student.totalQuizzes, 0)) *
                  100,
              )}
              %
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Student List */}
      <Card>
        <CardHeader>
          <CardTitle>Progresso Individual dos Alunos</CardTitle>
          <CardDescription>Acompanhe o desempenho de cada aluno na plataforma</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {sortedStudents.map((student) => (
              <div key={student.id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <Avatar>
                      <AvatarFallback>{getInitials(student.name)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-medium">{student.name}</h3>
                      <p className="text-sm text-muted-foreground">{student.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {getTrendIcon(student.trend)}
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4 mr-2" />
                      Detalhes
                    </Button>
                  </div>
                </div>

                <div className="grid md:grid-cols-4 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Progresso</p>
                    <div className="flex items-center gap-2">
                      <Progress
                        value={(student.completedQuizzes / student.totalQuizzes) * 100}
                        className="flex-1 h-2"
                      />
                      <span className="text-sm font-medium">
                        {student.completedQuizzes}/{student.totalQuizzes}
                      </span>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm text-muted-foreground">Pontuação Média</p>
                    <p className={`text-lg font-bold ${getProgressColor(student.averageScore)}`}>
                      {student.averageScore}%
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-muted-foreground">Tempo Total</p>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">
                        {Math.round(student.totalTime / 60)}h {student.totalTime % 60}min
                      </span>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm text-muted-foreground">Última Atividade</p>
                    <p className="font-medium">{student.lastActivity}</p>
                  </div>
                </div>

                {/* Recent Scores */}
                <div className="mb-4">
                  <p className="text-sm text-muted-foreground mb-2">Pontuações Recentes</p>
                  <div className="flex gap-2">
                    {student.recentScores.map((score, index) => (
                      <Badge key={index} variant="outline" className={getProgressColor(score)}>
                        {score}%
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Badges */}
                {student.badges.length > 0 && (
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Conquistas</p>
                    <div className="flex gap-2">
                      {student.badges.map((badge, index) => (
                        <Badge key={index} className="flex items-center gap-1">
                          <Trophy className="h-3 w-3" />
                          {badge}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
