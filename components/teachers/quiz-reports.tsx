"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"
import { Download, Filter, BookOpen, Users, Clock, Target } from "lucide-react"

export function QuizReports() {
  const [selectedQuiz, setSelectedQuiz] = useState("all")
  const [timeRange, setTimeRange] = useState("week")

  // Mock data
  const quizzes = [
    { id: "all", name: "Todos os Quizzes" },
    { id: "1", name: "Planetas Rochosos" },
    { id: "2", name: "Gigantes Gasosos" },
    { id: "3", name: "Sistema Solar Avançado" },
  ]

  const scoreDistribution = [
    { range: "90-100%", count: 23, color: "#22c55e" },
    { range: "80-89%", count: 45, color: "#84cc16" },
    { range: "70-79%", count: 38, color: "#eab308" },
    { range: "60-69%", count: 28, color: "#f97316" },
    { range: "0-59%", count: 12, color: "#ef4444" },
  ]

  const weeklyProgress = [
    { week: "Sem 1", attempts: 45, avgScore: 72 },
    { week: "Sem 2", attempts: 52, avgScore: 75 },
    { week: "Sem 3", attempts: 48, avgScore: 78 },
    { week: "Sem 4", attempts: 61, avgScore: 80 },
  ]

  const questionAnalysis = [
    {
      question: "Qual é o planeta mais próximo do Sol?",
      correctRate: 92,
      attempts: 156,
      difficulty: "Fácil",
    },
    {
      question: "Qual planeta tem a atmosfera mais densa?",
      correctRate: 68,
      attempts: 156,
      difficulty: "Médio",
    },
    {
      question: "Qual é a velocidade de escape da Terra?",
      correctRate: 34,
      attempts: 89,
      difficulty: "Difícil",
    },
    {
      question: "Quantas luas Júpiter possui aproximadamente?",
      correctRate: 45,
      attempts: 134,
      difficulty: "Médio",
    },
  ]

  const topPerformers = [
    { name: "Maria Costa", score: 95, quizzes: 3, time: "2h 15min" },
    { name: "Ana Silva", score: 92, quizzes: 3, time: "1h 45min" },
    { name: "João Santos", score: 88, quizzes: 2, time: "1h 30min" },
    { name: "Pedro Lima", score: 85, quizzes: 3, time: "2h 05min" },
    { name: "Sofia Oliveira", score: 82, quizzes: 2, time: "1h 20min" },
  ]

  return (
    <div className="space-y-6">
      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filtros de Relatório
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-48">
              <label className="text-sm font-medium mb-2 block">Quiz</label>
              <Select value={selectedQuiz} onValueChange={setSelectedQuiz}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {quizzes.map((quiz) => (
                    <SelectItem key={quiz.id} value={quiz.id}>
                      {quiz.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1 min-w-48">
              <label className="text-sm font-medium mb-2 block">Período</label>
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="week">Última semana</SelectItem>
                  <SelectItem value="month">Último mês</SelectItem>
                  <SelectItem value="quarter">Último trimestre</SelectItem>
                  <SelectItem value="year">Último ano</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end">
              <Button>
                <Download className="h-4 w-4 mr-2" />
                Exportar
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Summary Stats */}
      <div className="grid md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Tentativas</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">342</div>
            <p className="text-xs text-muted-foreground">+18% desde o período anterior</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Alunos Únicos</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">89</div>
            <p className="text-xs text-muted-foreground">57% dos alunos cadastrados</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tempo Médio</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8.5min</div>
            <p className="text-xs text-muted-foreground">Por tentativa de quiz</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taxa de Conclusão</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">94%</div>
            <p className="text-xs text-muted-foreground">Quizzes iniciados vs finalizados</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts and Analysis */}
      <Tabs defaultValue="distribution" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="distribution">Distribuição de Notas</TabsTrigger>
          <TabsTrigger value="progress">Progresso Semanal</TabsTrigger>
          <TabsTrigger value="questions">Análise de Questões</TabsTrigger>
          <TabsTrigger value="performers">Top Performers</TabsTrigger>
        </TabsList>

        <TabsContent value="distribution" className="space-y-6">
          <div className="grid lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Distribuição de Pontuações</CardTitle>
                <CardDescription>Como os alunos estão se saindo nos quizzes</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={scoreDistribution}
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="count"
                      label={({ range, count }) => `${range}: ${count}`}
                    >
                      {scoreDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Estatísticas Detalhadas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {scoreDistribution.map((item, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-4 h-4 rounded" style={{ backgroundColor: item.color }} />
                      <span className="font-medium">{item.range}</span>
                    </div>
                    <div className="text-right">
                      <div className="font-bold">{item.count} alunos</div>
                      <div className="text-sm text-muted-foreground">
                        {((item.count / scoreDistribution.reduce((acc, curr) => acc + curr.count, 0)) * 100).toFixed(1)}
                        %
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="progress" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Progresso Semanal</CardTitle>
              <CardDescription>Evolução das tentativas e pontuações ao longo do tempo</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={weeklyProgress}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="week" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip />
                  <Bar yAxisId="left" dataKey="attempts" fill="#3b82f6" name="Tentativas" />
                  <Bar yAxisId="right" dataKey="avgScore" fill="#10b981" name="Pontuação Média %" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="questions" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Análise por Questão</CardTitle>
              <CardDescription>Identifique questões que precisam de mais atenção</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {questionAnalysis.map((question, index) => (
                  <div key={index} className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="font-medium">{question.question}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge
                            variant="outline"
                            className={
                              question.difficulty === "Fácil"
                                ? "text-green-600 border-green-200"
                                : question.difficulty === "Médio"
                                  ? "text-yellow-600 border-yellow-200"
                                  : "text-red-600 border-red-200"
                            }
                          >
                            {question.difficulty}
                          </Badge>
                          <span className="text-sm text-muted-foreground">{question.attempts} tentativas</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold">{question.correctRate}%</div>
                        <div className="text-sm text-muted-foreground">Taxa de acerto</div>
                      </div>
                    </div>
                    <Progress value={question.correctRate} className="h-2" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performers" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Melhores Desempenhos</CardTitle>
              <CardDescription>Alunos com as melhores pontuações médias</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topPerformers.map((student, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center font-bold text-primary">
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-medium">{student.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {student.quizzes} quizzes • {student.time} total
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-primary">{student.score}%</div>
                      <div className="text-sm text-muted-foreground">Média geral</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
