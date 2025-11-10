# 🌌 Sistema Solar Interativo - Planetário Universitário

Uma plataforma educacional imersiva desenvolvida em Next.js que oferece visualizações 3D do Sistema Solar, dados científicos atualizados e atividades interativas para estudantes e professores.

## 📋 Índice

- [Sobre o Projeto](#sobre-o-projeto)
- [Funcionalidades](#funcionalidades)
- [Tecnologias Utilizadas](#tecnologias-utilizadas)
- [Pré-requisitos](#pré-requisitos)
- [Instalação](#instalação)
- [Execução](#execução)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Páginas e Rotas](#páginas-e-rotas)
- [Componentes Principais](#componentes-principais)
- [Scripts Disponíveis](#scripts-disponíveis)
- [Configurações](#configurações)
- [Contribuição](#contribuição)

## 🚀 Sobre o Projeto

O **Sistema Solar Interativo** é uma plataforma educacional desenvolvida para complementar as atividades do planetário universitário. A aplicação oferece uma experiência imersiva de aprendizado sobre astronomia através de:

- Visualizações 3D interativas dos planetas
- Dados científicos precisos e atualizados
- Quizzes educativos personalizados
- Comparações entre planetas e simulações de gravidade

## ✨ Funcionalidades

### 🌍 Para Estudantes
- **Exploração 3D**: Modelos tridimensionais interativos dos planetas com simulações de órbitas
- **Dados Científicos**: Informações detalhadas sobre massa, raio, gravidade, temperatura e curiosidades
- **Comparador de Planetas**: Compare diferentes corpos celestes lado a lado
- **Calculadora de Peso**: Simule seu peso em diferentes planetas
- **Quizzes Interativos**: Atividades educativas para reforçar o aprendizado

### 👨‍🏫 Para Professores
- **Dashboard Analítico**: Visão geral do desempenho da turma
- **Relatórios de Quiz**: Acompanhe o progresso individual dos alunos
- **Métricas de Engajamento**: Analise o uso da plataforma pelos estudantes
- **Progresso dos Alunos**: Monitore o desenvolvimento educacional

### 🎨 Interface
- **Tema Escuro/Claro**: Alternância entre temas para melhor experiência
- **Design Responsivo**: Funciona perfeitamente em desktop, tablet e mobile
- **Navegação Intuitiva**: Interface limpa e fácil de usar
- **Animações Suaves**: Transições e efeitos visuais envolventes

## 🛠 Tecnologias Utilizadas

### Frontend
- **Next.js 14** - Framework React com App Router
- **React 18** - Biblioteca para interfaces de usuário
- **TypeScript** - Tipagem estática para JavaScript
- **Tailwind CSS** - Framework CSS utilitário
- **Radix UI** - Componentes acessíveis e customizáveis

### 3D e Visualizações
- **Three.js** - Biblioteca para gráficos 3D
- **React Three Fiber** - Integração do Three.js com React
- **React Three Drei** - Utilitários para React Three Fiber
- **Recharts** - Biblioteca para gráficos e visualizações

### UI/UX
- **Lucide React** - Ícones modernos
- **Geist Font** - Tipografia otimizada
- **Class Variance Authority** - Gerenciamento de variantes CSS
- **Tailwind Merge** - Otimização de classes CSS

### Desenvolvimento
- **ESLint** - Linting de código
- **PostCSS** - Processamento de CSS
- **Vercel Analytics** - Análise de performance

## 📋 Pré-requisitos

Antes de começar, certifique-se de ter instalado:

- **Node.js** (versão 18.0 ou superior)
- **npm**, **yarn** ou **pnpm** (gerenciador de pacotes)
- **Git** (para controle de versão)

### Verificar instalações:
```bash
node --version
npm --version
git --version
```

## 🔧 Instalação

### 1. Clone o repositório
```bash
git clone https://github.com/seu-usuario/solar-system-platform.git
cd solar-system-platform
```

### 2. Instale as dependências

**Usando npm:**
```bash
npm install
```

**Usando yarn:**
```bash
yarn install
```

**Usando pnpm:**
```bash
pnpm install
```

### 3. Configuração (opcional)
Se necessário, crie um arquivo `.env.local` na raiz do projeto:
```bash
# Exemplo de variáveis de ambiente
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## 🚀 Execução

### Desenvolvimento
Para executar o projeto em modo de desenvolvimento:

```bash
npm run dev
# ou
yarn dev
# ou
pnpm dev
```

A aplicação estará disponível em: **http://localhost:3000**

### Produção
Para fazer o build e executar em produção:

```bash
# Build da aplicação
npm run build

# Executar em produção
npm run start
```

### Linting
Para verificar e corrigir problemas de código:

```bash
npm run lint
```

## 📁 Estrutura do Projeto

```
solar-system-platform/
├── 📁 app/                          # App Router do Next.js 14
│   ├── 📁 comparar/                 # Página de comparação de planetas
│   ├── 📁 explorar/                 # Página de exploração do sistema solar
│   ├── 📁 planeta/[id]/             # Páginas dinâmicas dos planetas
│   ├── 📁 quizzes/                  # Sistema de quizzes
│   │   └── 📁 [id]/                 # Quiz específico por ID
│   ├── 📄 globals.css               # Estilos globais
│   ├── 📄 layout.tsx                # Layout principal da aplicação
│   └── 📄 page.tsx                  # Página inicial
│
├── 📁 components/                   # Componentes React reutilizáveis
│   ├── 📁 planets/                  # Componentes relacionados aos planetas
│   │   ├── 📄 planet-comparison.tsx # Comparador de planetas
│   │   ├── 📄 planet-detail.tsx     # Detalhes do planeta
│   │   └── 📄 weight-calculator.tsx # Calculadora de peso
│   │
│   ├── 📁 quizzes/                  # Componentes do sistema de quiz
│   │   ├── 📄 quiz-interface.tsx    # Interface do quiz
│   │   └── 📄 quiz-results.tsx      # Resultados do quiz
│   │
│   ├── 📁 solar-system/             # Componentes do sistema solar 3D
│   │   ├── 📄 planet-mesh.tsx       # Mesh 3D dos planetas
│   │   ├── 📄 solar-system-3d.tsx   # Sistema solar 3D principal
│   │   ├── 📄 solar-system-controls.tsx # Controles da visualização
│   │   └── 📄 working-solar-system.tsx  # Sistema solar funcional
│   │
│   ├── 📁 teachers/                 # Componentes para professores
│   │   ├── 📄 overview-dashboard.tsx # Dashboard geral
│   │   ├── 📄 platform-analytics.tsx # Analytics da plataforma
│   │   ├── 📄 quiz-reports.tsx      # Relatórios de quiz
│   │   └── 📄 student-progress.tsx  # Progresso dos estudantes
│   │
│   ├── 📁 ui/                       # Componentes de UI (Radix UI + shadcn)
│   │   ├── 📄 button.tsx            # Componente de botão
│   │   ├── 📄 card.tsx              # Componente de card
│   │   ├── 📄 dialog.tsx            # Componente de modal
│   │   └── 📄 ...                   # Outros componentes UI
│   │
│   ├── 📄 navigation.tsx            # Navegação principal
│   ├── 📄 theme-provider.tsx        # Provedor de tema
│   └── 📄 theme-toggle.tsx          # Alternador de tema
│
├── 📁 hooks/                        # Custom React Hooks
│   ├── 📄 use-mobile.ts             # Hook para detecção mobile
│   └── 📄 use-toast.ts              # Hook para notificações
│
├── 📁 lib/                          # Utilitários e configurações
│   ├── 📄 api.ts                    # Funções de API
│   └── 📄 utils.ts                  # Funções utilitárias
│
├── 📁 public/                       # Arquivos estáticos
│   ├── 📄 earth-planet-texture-blue-green.jpg
│   ├── 📄 jupiter-gas-giant-planet-texture-bands.jpg
│   ├── 📄 mars-red-texture.png
│   ├── 📄 mercury-texture.png
│   ├── 📄 venus-texture.png
│   └── 📄 ...                       # Outras texturas e imagens
│
├── 📁 styles/                       # Estilos adicionais
│   └── 📄 globals.css               # CSS global adicional
│
├── 📄 .gitignore                    # Arquivos ignorados pelo Git
├── 📄 components.json               # Configuração do shadcn/ui
├── 📄 next.config.mjs               # Configuração do Next.js
├── 📄 package.json                  # Dependências e scripts
├── 📄 postcss.config.mjs            # Configuração do PostCSS
├── 📄 tailwind.config.js            # Configuração do Tailwind CSS
└── 📄 tsconfig.json                 # Configuração do TypeScript
```

## 🗺 Páginas e Rotas

| Rota | Descrição | Componente |
|------|-----------|------------|
| `/` | Página inicial com apresentação da plataforma | `app/page.tsx` |
| `/explorar` | Visualização 3D do sistema solar | `app/explorar/page.tsx` |
| `/planeta/[id]` | Detalhes específicos de cada planeta | `app/planeta/[id]/page.tsx` |
| `/comparar` | Comparação entre planetas | `app/comparar/page.tsx` |
| `/quizzes` | Lista de quizzes disponíveis | `app/quizzes/page.tsx` |
| `/quizzes/[id]` | Quiz específico | `app/quizzes/[id]/page.tsx` |

## 🧩 Componentes Principais

### Sistema Solar 3D
- **`working-solar-system.tsx`**: Componente principal do sistema solar interativo
- **`planet-mesh.tsx`**: Renderização 3D individual dos planetas
- **`solar-system-controls.tsx`**: Controles de navegação e zoom

### Interface de Usuário
- **`navigation.tsx`**: Barra de navegação responsiva
- **`theme-provider.tsx`**: Gerenciamento de temas claro/escuro
- **Componentes UI**: Biblioteca completa baseada em Radix UI

### Funcionalidades Educacionais
- **`quiz-interface.tsx`**: Sistema interativo de perguntas e respostas
- **`planet-comparison.tsx`**: Ferramenta de comparação entre planetas
- **`weight-calculator.tsx`**: Calculadora de peso em diferentes gravidades

## 📜 Scripts Disponíveis

| Script | Comando | Descrição |
|--------|---------|-----------|
| **Desenvolvimento** | `npm run dev` | Inicia o servidor de desenvolvimento |
| **Build** | `npm run build` | Cria build otimizado para produção |
| **Produção** | `npm run start` | Executa a aplicação em modo produção |
| **Linting** | `npm run lint` | Verifica e corrige problemas de código |

## ⚙️ Configurações

### Next.js (`next.config.mjs`)
```javascript
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,  // Ignora erros de ESLint no build
  },
  typescript: {
    ignoreBuildErrors: true,   // Ignora erros de TypeScript no build
  },
  images: {
    unoptimized: true,         // Desabilita otimização de imagens
  },
}
```

### TypeScript (`tsconfig.json`)
- **Target**: ES6
- **Module**: ESNext
- **JSX**: Preserve
- **Paths**: Alias `@/*` para importações absolutas

### Tailwind CSS
- **Framework**: Tailwind CSS v4
- **Plugins**: Animações e componentes customizados
- **Tema**: Suporte a modo escuro/claro

## 🤝 Contribuição

1. **Fork** o projeto
2. Crie uma **branch** para sua feature (`git checkout -b feature/AmazingFeature`)
3. **Commit** suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. **Push** para a branch (`git push origin feature/AmazingFeature`)
5. Abra um **Pull Request**

### Padrões de Código
- Use **TypeScript** para tipagem
- Siga as convenções do **ESLint**
- Mantenha componentes **pequenos e reutilizáveis**
- Documente **funções complexas**

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 📞 Suporte

Para dúvidas ou suporte:
- 📧 Email: suporte@planetario.edu.br
- 🐛 Issues: [GitHub Issues](https://github.com/seu-usuario/solar-system-platform/issues)
- 📖 Documentação: [Wiki do Projeto](https://github.com/seu-usuario/solar-system-platform/wiki)

---

**Desenvolvido com ❤️ para educação em astronomia**