// Dados fixos dos quizzes para funcionar sem banco de dados
export interface Quiz {
  id: string
  title: string
  description: string
  difficulty: 'EASY' | 'MEDIUM' | 'HARD'
  isActive: boolean
  order: number
  questions: QuizQuestion[]
}

export interface QuizQuestion {
  id: string
  question: string
  options: string[]
  correctAnswer: number
  explanation: string
  order: number
  isActive: boolean
}

export const FIXED_QUIZZES: Quiz[] = [
  {
    id: "1",
    title: "Sistema Solar Básico",
    description: "Teste seus conhecimentos básicos sobre o Sistema Solar",
    difficulty: "EASY",
    isActive: true,
    order: 1,
    questions: [
      {
        id: "1",
        question: "Qual é o planeta mais próximo do Sol?",
        options: ["Vênus", "Mercúrio", "Terra", "Marte"],
        correctAnswer: 1,
        explanation: "Mercúrio é o planeta mais próximo do Sol, a uma distância média de 57,9 milhões de km.",
        order: 1,
        isActive: true
      },
      {
        id: "2", 
        question: "Quantos planetas existem no Sistema Solar?",
        options: ["7", "8", "9", "10"],
        correctAnswer: 1,
        explanation: "Existem 8 planetas no Sistema Solar desde que Plutão foi reclassificado como planeta anão em 2006.",
        order: 2,
        isActive: true
      }
    ]
  },
  {
    id: "2",
    title: "Planetas Gigantes",
    description: "Aprenda sobre os gigantes gasosos do Sistema Solar",
    difficulty: "MEDIUM",
    isActive: true,
    order: 2,
    questions: [
      {
        id: "3",
        question: "Qual é o maior planeta do Sistema Solar?",
        options: ["Saturno", "Júpiter", "Netuno", "Urano"],
        correctAnswer: 1,
        explanation: "Júpiter é o maior planeta do Sistema Solar, com massa maior que todos os outros planetas juntos.",
        order: 1,
        isActive: true
      }
    ]
  }
]

export function getAllQuizzes(): Quiz[] {
  return FIXED_QUIZZES
}

export function getQuizById(id: string): Quiz | undefined {
  return FIXED_QUIZZES.find(quiz => quiz.id === id)
}