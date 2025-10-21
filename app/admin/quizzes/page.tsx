'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
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
  BookOpen,
  HelpCircle
} from 'lucide-react'
import Link from 'next/link'

interface Quiz {
  id: string
  title: string
  description?: string
  isActive: boolean
  order: number
  createdAt: string
  updatedAt: string
  questions: QuizQuestion[]
}

interface QuizQuestion {
  id: string
  question: string
  type: string
  points: number
  isActive: boolean
  order: number
  planetId?: string
}

export default function QuizzesPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [quizzes, setQuizzes] = useState<Quiz[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingQuiz, setEditingQuiz] = useState<Quiz | null>(null)
  const [error, setError] = useState('')
  const [isSaving, setIsSaving] = useState(false)

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    isActive: true,
    order: '0'
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

    fetchQuizzes()
  }, [session, status, router])

  const fetchQuizzes = async () => {
    try {
      const response = await fetch('/api/admin/quizzes')
      if (response.ok) {
        const data = await response.json()
        setQuizzes(data)
      } else {
        setError('Erro ao carregar quizzes')
      }
    } catch (error) {
      setError('Erro ao carregar quizzes')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    setError('')

    try {
      const url = editingQuiz ? `/api/admin/quizzes/${editingQuiz.id}` : '/api/admin/quizzes'
      const method = editingQuiz ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        await fetchQuizzes()
        setIsDialogOpen(false)
        setEditingQuiz(null)
        resetForm()
      } else {
        setError('Erro ao salvar quiz')
      }
    } catch (error) {
      setError('Erro ao salvar quiz')
    } finally {
      setIsSaving(false)
    }
  }

  const handleEdit = (quiz: Quiz) => {
    setEditingQuiz(quiz)
    setFormData({
      title: quiz.title,
      description: quiz.description || '',
      isActive: quiz.isActive,
      order: quiz.order.toString()
    })
    setIsDialogOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este quiz? Todas as perguntas também serão excluídas.')) return

    try {
      const response = await fetch(`/api/admin/quizzes/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        await fetchQuizzes()
      } else {
        setError('Erro ao excluir quiz')
      }
    } catch (error) {
      setError('Erro ao excluir quiz')
    }
  }

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      isActive: true,
      order: '0'
    })
  }

  const openCreateDialog = () => {
    setEditingQuiz(null)
    resetForm()
    setIsDialogOpen(true)
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
          <h1 className="text-3xl font-bold">Gerenciar Quizzes</h1>
          <p className="text-muted-foreground">
            Crie e gerencie quizzes educativos para os estudantes
          </p>
        </div>
        <div className="flex gap-2">
          <ThemeToggle />
          <Link href="/admin">
            <Button variant="outline">
              <X className="h-4 w-4 mr-2" />
              Voltar
            </Button>
          </Link>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={openCreateDialog}>
                <Plus className="h-4 w-4 mr-2" />
                Novo Quiz
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>
                  {editingQuiz ? 'Editar Quiz' : 'Novo Quiz'}
                </DialogTitle>
                <DialogDescription>
                  {editingQuiz ? 'Atualize as informações do quiz' : 'Crie um novo quiz educativo'}
                </DialogDescription>
              </DialogHeader>

              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Título do Quiz</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Quiz sobre o Sistema Solar"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Descrição</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Descrição do quiz..."
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="order">Ordem de Exibição</Label>
                    <Input
                      id="order"
                      type="number"
                      value={formData.order}
                      onChange={(e) => setFormData({ ...formData, order: e.target.value })}
                      placeholder="1"
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {quizzes.map((quiz) => (
          <Card key={quiz.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <BookOpen className="h-5 w-5" />
                  <CardTitle className="text-lg">{quiz.title}</CardTitle>
                </div>
                <div className="flex space-x-1">
                  <Link href={`/admin/quizzes/${quiz.id}/questions`}>
                    <Button size="sm" variant="outline">
                      <HelpCircle className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEdit(quiz)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDelete(quiz.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <CardDescription>
                {quiz.description || 'Sem descrição'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Perguntas:</span>
                  <Badge variant="secondary">
                    {quiz.questions.length}
                  </Badge>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Status:</span>
                  <Badge variant={quiz.isActive ? "default" : "secondary"}>
                    {quiz.isActive ? 'Ativo' : 'Inativo'}
                  </Badge>
                </div>

                {quiz.questions.length > 0 && (
                  <div className="space-y-2">
                    <span className="text-sm text-muted-foreground">Perguntas ativas:</span>
                    <div className="flex flex-wrap gap-1">
                      {quiz.questions
                        .filter(q => q.isActive)
                        .slice(0, 3)
                        .map((question, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {question.type === 'multiple_choice' ? 'Múltipla escolha' : 
                             question.type === 'true_false' ? 'Verdadeiro/Falso' : 'Texto livre'}
                          </Badge>
                        ))}
                      {quiz.questions.filter(q => q.isActive).length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{quiz.questions.filter(q => q.isActive).length - 3}
                        </Badge>
                      )}
                    </div>
                  </div>
                )}

                <div className="pt-2">
                  <Link href={`/admin/quizzes/${quiz.id}/questions`}>
                    <Button variant="outline" size="sm" className="w-full">
                      <HelpCircle className="h-4 w-4 mr-2" />
                      Gerenciar Perguntas
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {quizzes.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Nenhum quiz encontrado</h3>
            <p className="text-muted-foreground mb-4">
              Comece criando o primeiro quiz educativo
            </p>
            <Button onClick={openCreateDialog}>
              <Plus className="h-4 w-4 mr-2" />
              Criar Quiz
            </Button>
          </CardContent>
        </Card>
      )}
      </div>
    </div>
  )
}
