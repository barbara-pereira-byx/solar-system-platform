"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"
import { TrendingUp, Users, Clock, Globe, BookOpen, Calculator, BarChart3 } from "lucide-react"

export function PlatformAnalytics() {
  // Mock analytics data
  const usageData = [
    { date: "01/12", users: 45, sessions: 67, avgTime: 12 },
    { date: "02/12", users: 52, sessions: 78, avgTime: 15 },
    { date: "03/12", users: 48, sessions: 71, avgTime: 11 },
    { date: "04/12", users: 61, sessions: 89, avgTime: 18 },
    { date: "05/12", users: 58, sessions: 82, avgTime: 16 },
    { date: "06/12", users: 65, sessions: 95, avgTime: 20 },
    { date: "07/12", users: 72, sessions: 108, avgTime: 22 },
  ]

  const featureUsage = [
    { feature: "Sistema Solar 3D", usage: 89, color: "#3b82f6" },
    { feature: "Quizzes", usage: 76, color: "#10b981" },
    { feature: "Comparação de Planetas", usage: 54, color: "#f59e0b" },
    { feature: "Calculadora de Peso", usage: 43, color: "#ef4444" },
    { feature: "Detalhes dos Planetas", usage: 67, color: "#8b5cf6" },
  ]

  const deviceData = [
    { device: "Desktop", count: 156, percentage: 52 },
    { device: "Mobile", count: 98, percentage: 33 },
    { device: "Tablet", count: 45, percentage: 15 },
  ]

  const engagementMetrics = [
    { metric: "Taxa de Retorno", value: 68, target: 70, unit: "%" },
    { metric: "Tempo Médio por Sessão", value: 16.5, target: 15, unit: "min" },
    { metric: "Páginas por Sessão", value: 4.2, target: 4, unit: "" },
    { metric: "Taxa de Conclusão de Quiz", value: 94, target: 90, unit: "%" },
  ]

  const popularContent = [
    { title: "Júpiter - O Gigante Gasoso", views: 234, engagement: 85 },
    { title: "Quiz: Planetas Rochosos", views: 189, engagement: 92 },
    { title: "Comparação: Terra vs Marte", views: 156, engagement: 78 },
    { title: "Sistema Solar 3D", views: 298, engagement: 88 },
    { title: "Calculadora de Peso em Marte", views: 134, engagement: 71 },
  ]

  const learningPaths = [
    { path: "Exploração Básica", students: 89, completion: 76 },
    { path: "Planetas Rochosos", students: 67, completion: 82 },
    { path: "Gigantes Gasosos", students: 45, completion: 68 },
    { path: "Sistema Solar Avançado", students: 23, completion: 91 },
  ]

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Usuários Ativos</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">156</div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="inline h-3 w-3 mr-1" />
              +12% esta semana
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sessões Totais</CardTitle>
            <Globe className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">590</div>
            <p className="text-xs text-muted-foreground">Últimos 7 dias</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tempo Médio</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">16.5min</div>
            <p className="text-xs text-muted-foreground">Por sessão</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taxa de Engajamento</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">84%</div>
            <p className="text-xs text-muted-foreground">Acima da meta</p>
          </CardContent>
        </Card>
      </div>

      {/* Analytics Tabs */}
      <Tabs defaultValue="usage" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="usage">Uso da Plataforma</TabsTrigger>
          <TabsTrigger value="features">Recursos</TabsTrigger>
          <TabsTrigger value="engagement">Engajamento</TabsTrigger>
          <TabsTrigger value="content">Conteúdo</TabsTrigger>
        </TabsList>

        <TabsContent value="usage" className="space-y-6">
          <div className="grid lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Usuários Ativos por Dia</CardTitle>
                <CardDescription>Evolução do uso da plataforma</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={usageData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Area type="monotone" dataKey="users" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.3} />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Dispositivos Utilizados</CardTitle>
                <CardDescription>Como os alunos acessam a plataforma</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {deviceData.map((device, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-4 h-4 bg-primary rounded" />
                        <span className="font-medium">{device.device}</span>
                      </div>
                      <div className="text-right">
                        <div className="font-bold">{device.count}</div>
                        <div className="text-sm text-muted-foreground">{device.percentage}%</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Sessões e Tempo de Uso</CardTitle>
              <CardDescription>Análise detalhada do engajamento diário</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={usageData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip />
                  <Line yAxisId="left" type="monotone" dataKey="sessions" stroke="#10b981" strokeWidth={2} />
                  <Line yAxisId="right" type="monotone" dataKey="avgTime" stroke="#f59e0b" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="features" className="space-y-6">
          <div className="grid lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Uso por Recurso</CardTitle>
                <CardDescription>Quais funcionalidades são mais utilizadas</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={featureUsage} layout="horizontal">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="feature" type="category" width={120} />
                    <Tooltip />
                    <Bar dataKey="usage" fill="#3b82f6" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Detalhes dos Recursos</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {featureUsage.map((feature, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {feature.feature === "Sistema Solar 3D" && <Globe className="h-4 w-4" />}
                        {feature.feature === "Quizzes" && <BookOpen className="h-4 w-4" />}
                        {feature.feature === "Comparação de Planetas" && <BarChart3 className="h-4 w-4" />}
                        {feature.feature === "Calculadora de Peso" && <Calculator className="h-4 w-4" />}
                        {feature.feature === "Detalhes dos Planetas" && <Users className="h-4 w-4" />}
                        <span className="font-medium">{feature.feature}</span>
                      </div>
                      <span className="text-sm font-bold">{feature.usage}%</span>
                    </div>
                    <Progress value={feature.usage} className="h-2" />
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="engagement" className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Métricas de Engajamento</CardTitle>
                <CardDescription>Indicadores de qualidade da experiência</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {engagementMetrics.map((metric, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{metric.metric}</span>
                      <div className="flex items-center gap-2">
                        <span className="font-bold">
                          {metric.value}
                          {metric.unit}
                        </span>
                        <Badge variant={metric.value >= metric.target ? "default" : "secondary"}>
                          Meta: {metric.target}
                          {metric.unit}
                        </Badge>
                      </div>
                    </div>
                    <Progress value={(metric.value / metric.target) * 100} className="h-2" />
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Caminhos de Aprendizagem</CardTitle>
                <CardDescription>Taxa de conclusão por trilha</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {learningPaths.map((path, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{path.path}</span>
                      <div className="text-right">
                        <div className="font-bold">{path.completion}%</div>
                        <div className="text-sm text-muted-foreground">{path.students} alunos</div>
                      </div>
                    </div>
                    <Progress value={path.completion} className="h-2" />
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="content" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Conteúdo Mais Popular</CardTitle>
              <CardDescription>Páginas e recursos com maior engajamento</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {popularContent.map((content, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <h4 className="font-medium">{content.title}</h4>
                      <p className="text-sm text-muted-foreground">{content.views} visualizações</p>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-primary">{content.engagement}%</div>
                      <div className="text-sm text-muted-foreground">Engajamento</div>
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
