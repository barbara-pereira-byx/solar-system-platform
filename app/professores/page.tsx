"use client"

import { useState, useEffect } from "react"
import { Navigation } from "@/components/navigation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { OverviewDashboard } from "@/components/teachers/overview-dashboard"
import { QuizReports } from "@/components/teachers/quiz-reports"
import { StudentProgress } from "@/components/teachers/student-progress"
import { PlatformAnalytics } from "@/components/teachers/platform-analytics"
import { LoadingSpinner } from "@/components/loading-spinner"
import { Users, BookOpen, BarChart3, TrendingUp, GraduationCap } from "lucide-react"

export default function ProfessoresPage() {
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("overview")

  useEffect(() => {
    // Simulate loading
    setTimeout(() => {
      setLoading(false)
    }, 1000)
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
          <div className="text-center">
            <LoadingSpinner size="lg" className="mb-4" />
            <p className="text-lg text-muted-foreground">Carregando dashboard...</p>
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
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
              <GraduationCap className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Dashboard do Professor</h1>
              <p className="text-muted-foreground">Acompanhe o progresso e desempenho dos seus alunos</p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Visão Geral
            </TabsTrigger>
            <TabsTrigger value="quizzes" className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              Relatórios de Quiz
            </TabsTrigger>
            <TabsTrigger value="students" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Progresso dos Alunos
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Análises
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-6">
            <OverviewDashboard />
          </TabsContent>

          <TabsContent value="quizzes" className="mt-6">
            <QuizReports />
          </TabsContent>

          <TabsContent value="students" className="mt-6">
            <StudentProgress />
          </TabsContent>

          <TabsContent value="analytics" className="mt-6">
            <PlatformAnalytics />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
