'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { ThemeToggle } from '@/components/theme-toggle'
import { 
  Plus, 
  Edit, 
  Trash2, 
  Save, 
  X,
  HelpCircle,
  ArrowLeft
} from 'lucide-react'
import Link from 'next/link'

interface Quiz {
  id: string
  title: string
  description?: string
}

interface Planet {
  id: string
  name: string
  displayName: string
}

interface QuizQuestion {
  id: string
  quizId: string
  planetId?: string
  question: string
  type: string
  options?: any
  correctAnswer: string
  explanation?: string
  points: number
  order: number
  isActive: boolean
  planet?: {
    displayName: string
  }
}

export default function QuizQuestionsPage() {
  const params = useParams()
  const router = useRouter()
  const { data: session, status } = useSession()
  const quizId = params.id as string

  const [quiz, setQuiz] = useState<Quiz | null>(null)
  const [planets, setPlanets] = useState<Planet[]>([])
  const [questions, setQuestions] = useState<QuizQuestion[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingQuestion, setEditingQuestion] = useState<QuizQuestion | null>(null)
  const [error, setError] = useState('')
  const [isSaving, setIsSaving] = useState(false)

  const [formData, setFormData] = useState({
    planetId: '',
    question: '',
    type: 'multiple_choice',
    options: '',
    correctAnswer: '',
    explanation: '',
    points: '1',
    order: '0',
    isActive: true
  })

  useEffect(() => {
    if (status === 'loading') return

    if (!session) {
      router.push('/admin/login')
      return
    }

    if (session.user.role !== 'teacher' && session.user.role !== 'admin') {
      router.push('/')
      return
    }

    if (quizId) {
      fetchQuiz()
      fetchPlanets()
      fetchQuestions()
    }
  }, [session, status, router, quizId])

  const fetchQuiz = async () => {
    try {
      const response = await fetch(`/api/admin/quizzes/${quizId}`)
      if (response.ok) {
        const data = await response.json()
        setQuiz(data)
      }
    } catch (error) {
      console.error('Error fetching quiz:', error)
    }
  }

  const fetchPlanets = async () => {
    try {
      const response = await fetch('/api/admin/planets')
      if (response.ok) {
        const data = await response.json()
        setPlanets(data)
      }
    } catch (error) {
      console.error('Error fetching planets:', error)
    }
  }

  const fetchQuestions = async () => {
    try {
      const response = await fetch(`/api/admin/quiz-questions?quizId=${quizId}`)
      if (response.ok) {
        const data = await response.json()
        setQuestions(data)
      } else {
        setError('Erro ao carregar perguntas')
      }
    } catch (error) {
      setError('Erro ao carregar perguntas')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    setError('')

    try {
      const url = editingQuestion ? `/api/admin/quiz-questions/${editingQuestion.id}` : '/api/admin/quiz-questions'
      const method = editingQuestion ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          quizId,
          planetId: formData.planetId || null
        }),
      })

      if (response.ok) {
        await fetchQuestions()
        setIsDialogOpen(false)
        setEditingQuestion(null)
        resetForm()
      } else {
        setError('Erro ao salvar pergunta')
      }
    } catch (error) {
      setError('Erro ao salvar pergunta')
    } finally {
      setIsSaving(false)
    }
  }

  const handleEdit = (question: QuizQuestion) => {
    setEditingQuestion(question)
    setFormData({
      planetId: question.planetId || '',
      question: question.question,
      type: question.type,
      options: question.options ? JSON.stringify(question.options) : '',
      correctAnswer: question.correctAnswer,
      explanation: question.explanation || '',
      points: question.points.toString(),
      order: question.order.toString(),
      isActive: question.isActive
    })
    setIsDialogOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir esta pergunta?')) return

    try {
      const response = await fetch(`/api/admin/quiz-questions/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        await fetchQuestions()
      } else {
        setError('Erro ao excluir pergunta')
      }
    } catch (error) {
      setError('Erro ao excluir pergunta')
    }
  }

  const resetForm = () => {
    setFormData({
      planetId: '',
      question: '',
      type: 'multiple_choice',
      options: '',
      correctAnswer: '',
      explanation: '',
      points: '1',
      order: '0',
      isActive: true
    })
  }

  const openCreateDialog = () => {
    setEditingQuestion(null)
    resetForm()
    setIsDialogOpen(true)
  }

  const getQuestionTypeLabel = (type: string) => {
    switch (type) {
      case 'multiple_choice': return 'Múltipla Escolha'
      case 'true_false': return 'Verdadeiro/Falso'
      case 'text': return 'Texto Livre'
      default: return type
    }
  }

  if (status === 'loading' || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (!session || (session.user.role !== 'teacher' && session.user.role !== 'admin')) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Acesso Negado</h2>
          <p className="text-muted-foreground">Redirecionando...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <div className="flex items-center space-x-2 mb-2">
            <Button variant="outline" size="sm" onClick={() => router.back()}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar
            </Button>
          </div>
          <h1 className="text-3xl font-bold">Perguntas do Quiz</h1>
          <p className="text-muted-foreground">
            {quiz?.title} - Gerencie as perguntas deste quiz
          </p>
        </div>
        <div className="flex gap-2">
          <ThemeToggle />
          <Link href="/admin/quizzes">
            <Button variant="outline">
              <X className="h-4 w-4 mr-2" />
              Voltar aos Quizzes
            </Button>
          </Link>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={openCreateDialog}>
                <Plus className="h-4 w-4 mr-2" />
                Nova Pergunta
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingQuestion ? 'Editar Pergunta' : 'Nova Pergunta'}
                </DialogTitle>
                <DialogDescription>
                  {editingQuestion ? 'Atualize a pergunta do quiz' : 'Adicione uma nova pergunta ao quiz'}
                </DialogDescription>
              </DialogHeader>

              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="planetId">Planeta Relacionado (Opcional)</Label>
                    <Select value={formData.planetId} onValueChange={(value) => setFormData({ ...formData, planetId: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione um planeta" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">Nenhum</SelectItem>
                        {planets.map((planet) => (
                          <SelectItem key={planet.id} value={planet.id}>
                            {planet.displayName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="type">Tipo de Pergunta</Label>
                    <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="multiple_choice">Múltipla Escolha</SelectItem>
                        <SelectItem value="true_false">Verdadeiro/Falso</SelectItem>
                        <SelectItem value="text">Texto Livre</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="question">Pergunta</Label>
                  <Textarea
                    id="question"
                    value={formData.question}
                    onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                    placeholder="Digite a pergunta..."
                    rows={3}
                    required
                  />
                </div>

                {formData.type === 'multiple_choice' && (
                  <div className="space-y-2">
                    <Label htmlFor="options">Opções (uma por linha)</Label>
                    <Textarea
                      id="options"
                      value={formData.options}
                      onChange={(e) => setFormData({ ...formData, options: e.target.value })}
                      placeholder="Opção A&#10;Opção B&#10;Opção C&#10;Opção D"
                      rows={4}
                    />
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="correctAnswer">Resposta Correta</Label>
                  {formData.type === 'true_false' ? (
                    <Select value={formData.correctAnswer} onValueChange={(value) => setFormData({ ...formData, correctAnswer: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione a resposta" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="true">Verdadeiro</SelectItem>
                        <SelectItem value="false">Falso</SelectItem>
                      </SelectContent>
                    </Select>
                  ) : (
                    <Input
                      id="correctAnswer"
                      value={formData.correctAnswer}
                      onChange={(e) => setFormData({ ...formData, correctAnswer: e.target.value })}
                      placeholder="Resposta correta..."
                      required
                    />
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="explanation">Explicação (Opcional)</Label>
                  <Textarea
                    id="explanation"
                    value={formData.explanation}
                    onChange={(e) => setFormData({ ...formData, explanation: e.target.value })}
                    placeholder="Explicação da resposta..."
                    rows={2}
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="points">Pontos</Label>
                    <Input
                      id="points"
                      type="number"
                      min="1"
                      value={formData.points}
                      onChange={(e) => setFormData({ ...formData, points: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="order">Ordem</Label>
                    <Input
                      id="order"
                      type="number"
                      value={formData.order}
                      onChange={(e) => setFormData({ ...formData, order: e.target.value })}
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="isActive"
                      checked={formData.isActive}
                      onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
                    />
                    <Label htmlFor="isActive">Ativo</Label>
                  </div>
                </div>

                <div className="flex justify-end space-x-2">
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancelar
                  </Button>
                  <Button type="submit" disabled={isSaving}>
                    {isSaving ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Salvando...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        Salvar
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-4">
        {questions.map((question, index) => (
          <Card key={question.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Badge variant="outline">#{index + 1}</Badge>
                  <CardTitle className="text-lg">{question.question}</CardTitle>
                </div>
                <div className="flex space-x-1">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEdit(question)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDelete(question.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Tipo:</span>
                    <Badge variant="secondary" className="ml-2">
                      {getQuestionTypeLabel(question.type)}
                    </Badge>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Pontos:</span>
                    <span className="ml-2 font-medium">{question.points}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Ordem:</span>
                    <span className="ml-2 font-medium">{question.order}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Status:</span>
                    <Badge variant={question.isActive ? "default" : "secondary"} className="ml-2">
                      {question.isActive ? 'Ativo' : 'Inativo'}
                    </Badge>
                  </div>
                </div>

                {question.planet && (
                  <div>
                    <span className="text-muted-foreground">Planeta:</span>
                    <Badge variant="outline" className="ml-2">
                      {question.planet.displayName}
                    </Badge>
                  </div>
                )}

                {question.options && (
                  <div>
                    <span className="text-muted-foreground">Opções:</span>
                    <div className="mt-1 space-y-1">
                      {Array.isArray(question.options) && question.options.map((option: string, idx: number) => (
                        <div key={idx} className="text-sm bg-gray-50 p-2 rounded">
                          {option}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div>
                  <span className="text-muted-foreground">Resposta Correta:</span>
                  <div className="mt-1 text-sm bg-green-50 p-2 rounded border border-green-200">
                    {question.correctAnswer}
                  </div>
                </div>

                {question.explanation && (
                  <div>
                    <span className="text-muted-foreground">Explicação:</span>
                    <div className="mt-1 text-sm bg-blue-50 p-2 rounded border border-blue-200">
                      {question.explanation}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {questions.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <HelpCircle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Nenhuma pergunta encontrada</h3>
            <p className="text-muted-foreground mb-4">
              Comece adicionando a primeira pergunta a este quiz
            </p>
            <Button onClick={openCreateDialog}>
              <Plus className="h-4 w-4 mr-2" />
              Adicionar Pergunta
            </Button>
          </CardContent>
        </Card>
      )}
      </div>
    </div>
  )
}
