# 🎓 Configuração do Sistema Administrativo

Este documento explica como configurar e usar o sistema administrativo para professores.

## 📋 Pré-requisitos

1. **Node.js** (versão 18+)
2. **npm** ou **pnpm**

## 🚀 Configuração Inicial

### 1. Configurar Banco de Dados

O projeto usa **SQLite** por padrão, que é criado automaticamente. Não é necessário configurar um banco de dados externo.

Crie um arquivo `.env` na raiz do projeto com:

```env
# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here"

# App
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### 2. Configurar Prisma

```bash
# Gerar cliente Prisma
npm run db:generate

# Aplicar schema ao banco
npm run db:push

# Popular banco com dados iniciais
npm run db:seed
```

### 3. Executar Aplicação

```bash
npm run dev
```

## 🔐 Acesso Administrativo

Após executar o seed, você terá acesso com:

- **Email**: `admin@planetario.edu.br`
- **Senha**: `admin123`

Acesse: `http://localhost:3000/admin/login`

## 🌍 Populando Sistema Solar Completo

Para popular o banco com todos os planetas e luas do sistema solar:

```bash
npm run db:populate
```

Este comando criará:
- **8 planetas** do sistema solar (Mercúrio, Vênus, Terra, Marte, Júpiter, Saturno, Urano, Netuno)
- **16 luas** principais (incluindo a Lua da Terra, luas de Marte, luas galileanas de Júpiter, etc.)
- **8 campos de comparação** (massa, raio, gravidade, temperatura, distância, período orbital, período de rotação, número de luas)
- **2 quizzes** de exemplo (Planetas Rochosos e Gigantes Gasosos)

### Atualizando Sistema Solar Completo

Para atualizar o banco com todas as luas e dados corrigidos:

```bash
npm run db:update
```

Este comando atualizará:
- **8 planetas** com dados científicos precisos
- **23 luas** completas (incluindo todas as luas principais de cada planeta)
- **Texturas corretas** para todos os planetas
- **Posicionamento orbital** corrigido para evitar sobreposição

## 🎯 Funcionalidades Disponíveis

### 📊 Dashboard Principal
- Visão geral do sistema
- Estatísticas de quizzes e perguntas
- Ações rápidas

### 📝 Gerenciamento de Quizzes
- **Criar quizzes** educativos
- **Adicionar perguntas** de múltipla escolha, verdadeiro/falso ou texto livre
- **Associar perguntas** a planetas específicos
- **Definir pontuação** e explicações

### 👥 Gerenciamento de Usuários
- **Criar/Editar/Excluir** professores e administradores
- **Definir permissões** (teacher/admin)
- **Gerenciar senhas** e informações de acesso

## 🌍 Dados Fixos do Sistema

### Planetas
Os dados dos planetas são **fixos** e não podem ser modificados pelo administrador. Isso inclui:
- **Informações científicas**: massa, raio, gravidade, temperatura
- **Texturas** e cores dos planetas
- **Distâncias** e posições orbitais
- **Número de luas** e características orbitais

### Comparações
Os campos de comparação também são **fixos** e incluem:
- **Massa** (kg)
- **Raio** (km)
- **Gravidade** (m/s²)
- **Temperatura** (°C)
- **Distância do Sol** (km)
- **Período Orbital** (dias)
- **Período de Rotação** (horas)
- **Número de Luas**

Todos os dados são baseados em informações científicas precisas e são carregados automaticamente nas páginas de exploração e comparação.

## 📁 Estrutura do Sistema

```
app/admin/
├── login/              # Página de login
├── page.tsx            # Dashboard principal
├── quizzes/            # Gerenciamento de quizzes
│   └── [id]/questions/ # Perguntas de um quiz
├── users/              # Gerenciamento de usuários
└── settings/           # Configurações gerais

api/admin/
├── quizzes/            # APIs de quizzes
├── quiz-questions/     # APIs de perguntas
└── teachers/           # APIs de usuários
```

## 🗄️ Modelos de Dados

### Quiz & QuizQuestion
- Sistema flexível de perguntas
- Suporte a múltiplos tipos de questão
- Associação com planetas específicos

### Dados Fixos
- **Planetas**: Informações científicas precisas, texturas e configurações visuais
- **Comparações**: Campos de comparação pré-definidos com formatação automática
- **Dados carregados** de arquivos estáticos para garantir consistência

## 🔧 Comandos Úteis

```bash
# Desenvolvimento
npm run dev

# Build para produção
npm run build

# Executar em produção
npm run start

# Banco de dados
npm run db:generate    # Gerar cliente Prisma
npm run db:push        # Aplicar schema
npm run db:migrate     # Criar migração
npm run db:seed        # Popular dados iniciais
```

## 🌐 Páginas Públicas Melhoradas

### ⚖️ Nova Página de Comparação
- **Calculadora de peso** interativa (permite peso zero)
- **Múltiplos métodos de comparação**:
  - Comparação de peso por gravidade
  - Características físicas (massa, raio, gravidade, luas)
  - Características orbitais (distância, períodos)
  - Ambiente e temperatura
- **Seleção intuitiva** de planetas (até 3)
- **Dados fixos** dos planetas
- **Interface com abas** para diferentes tipos de comparação

### 🚀 Exploração e Quizzes
- **Dados fixos** dos planetas e comparações carregados automaticamente
- **Sistema de quizzes** configurável pelo administrador
- **Integração completa** com sistema administrativo

### 🌌 Sistema Solar 3D Melhorado
- **Posicionamento orbital** corrigido para evitar sobreposição
- **Escalas proporcionais** baseadas no tamanho real dos planetas
- **Texturas corretas** para todos os planetas
- **Anéis de Saturno** visíveis
- **23 luas** incluídas no sistema
- **Animações suaves** e controles intuitivos

## 🛡️ Segurança

- **Autenticação** obrigatória para todas as rotas admin
- **Autorização** baseada em roles (teacher/admin)
- **Validação** de dados em todas as APIs
- **Sanitização** de inputs do usuário

## 🎨 Interface

- **Design responsivo** para desktop e mobile
- **Tema escuro/claro** automático
- **Componentes acessíveis** com Radix UI
- **Feedback visual** para todas as ações

## 📈 Próximos Passos

1. **Sistema de upload** de texturas
2. **Relatórios** de uso dos estudantes
3. **Analytics** de performance dos quizzes
4. **Backup automático** do banco de dados
5. **API pública** para integração com outros sistemas

## 🆘 Suporte

Para dúvidas ou problemas:
- Verifique os logs do console
- Confirme a configuração do banco de dados
- Teste a conectividade com PostgreSQL
- Verifique as variáveis de ambiente

---

**Desenvolvido com ❤️ para educação em astronomia**
