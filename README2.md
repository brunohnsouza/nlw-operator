# DevRoast

Análise de código com IA e honestidade brutal. Cole seu código, seja critiquado.

## Funcionalidades

- **Análise de Código** - Envie código e receba feedback detalhado sobre qualidade
- **Modo Roast** - Alterne entre feedback gentil ou sarcasmo máximo
- **Leaderboard** - Veja os piores códigos submetidos ranqueados por nota de vergonha
- **Syntax Highlighting** - Blocos de código lindos com tema vesper
- **Score Ring** - Representação visual das notas de qualidade do código
- **Share Card** - Baixe uma imagem compartilhável com seu resultado

## Tecnologias

- **Framework**: Next.js 16 (App Router)
- **Styling**: Tailwind CSS v4
- **Linting**: Biome
- **Syntax Highlighting**: Shiki
- **Database**: PostgreSQL + Drizzle ORM
- **API**: tRPC
- **AI**: Google Gemini / Groq / OpenAI

## Pré-requisitos

1. **Node.js** 20+
2. **PostgreSQL** (pode usar Docker)
3. **API Key de IA** (uma das opções):
   - `GOOGLE_API_KEY` - Google Gemini
   - `GROQ_API_KEY` - Groq
   - `OPENAI_API_KEY` - OpenAI

### Variáveis de Ambiente

Crie um arquivo `.env` com:

```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/devroast

# AI (escolha uma)
GOOGLE_API_KEY=your_google_api_key
# ou
GROQ_API_KEY=your_groq_api_key
# ou
OPENAI_API_KEY=your_openai_api_key
```

## Começando

```bash
# Instalar dependências
npm install

# Configurar banco de dados
npm run db:push

# (Opcional) Popular banco com dados de exemplo
npm run db:seed

# Iniciar desenvolvimento
npm run dev
```

Acesse http://localhost:3000

## Scripts Disponíveis

| Comando | Descrição |
|---------|-----------|
| `npm run dev` | Iniciar servidor de desenvolvimento |
| `npm run build` | Build para produção |
| `npm run start` | Iniciar servidor de produção |
| `npm run lint` | Executar Biome linter |
| `npm run db:push` | Executar migrations do Drizzle |
| `npm run db:studio` | Abrir Drizzle Studio |
| `npm run db:seed` | Executar seed do banco |

## Estrutura do Projeto

```
src/
├── app/                    # Next.js App Router
│   ├── page.tsx            # Homepage
│   ├── layout.tsx          # Layout raiz
│   ├── globals.css         # Variáveis de tema Tailwind
│   ├── result/[id]/       # Página de resultado
│   ├── share/[id]/         # Página de share (download imagem)
│   ├── leaderboard/        # Página do leaderboard
│   ├── editor-section.tsx # Componente do editor
│   └── api/                # API Routes (OG Image, tRPC)
│
├── components/
│   ├── ui/                 # Componentes UI reutilizáveis
│   ├── leaderboard-*.tsx   # Componentes do leaderboard
│   ├── Share*.tsx          # Componentes de share
│   └── og/                 # Componentes OG Image
│
├── db/                     # Database (Drizzle)
│   ├── schema.ts           # Schema das tabelas
│   ├── seed.ts             # Seed de dados
│   └── index.ts            # Configuração drizzle
│
├── trpc/                   # tRPC
│   ├── init.ts             # Inicialização tRPC
│   ├── client.tsx          # Provider React
│   ├── server.tsx          # Server caller
│   ├── routers/           # Routers/Procedures
│   └── AGENTS.md           # Padrões tRPC
│
└── lib/                    # Utilitários
    ├── ai.ts               # Módulo de IA
    ├── utils.ts            # Funções utilitárias
    └── detect-language.ts  # Detecção de linguagem
```

## Páginas

| Rota | Descrição |
|------|-----------|
| `/` | Homepage - Editor de código, métricas e preview do leaderboard |
| `/result/[id]` | Resultado detalhado da análise (score, issues, diff) |
| `/share/[id]` | Página para baixar imagem compartilhável do resultado |
| `/leaderboard` | Leaderboard completo com paginação |
| `/components` | Showcase dos componentes UI |

## Padrões e Boas Práticas

### Componentes UI

- **Named exports**: Sempre use `export const Component`
- **tailwind-variants**: Para variantes e merge de classes
- **forwardRef**: Para permitir acesso à ref do elemento nativo
- **Extender props**: Estender propriedades nativas do HTML
- **Cores**: Usar variáveis do tema (`text-text-primary`, `bg-bg-surface`, etc)

### tRPC

- Usar `baseProcedure` como base
- sempre validar inputs com Zod
- Usar `superjson` para serialização
- Queries paralelas com `Promise.all` quando possível
- Para Server Components: usar `caller` de `@/trpc/server`

### Database (Drizzle)

- Usar `defaultRandom()` para UUIDs
- Usar `defaultNow()` para timestamps
- Tipar com `$inferSelect` e `$inferInsert`

### Cores por Score

O app usa lógica padronizada para cores baseadas no score (0-10):

| Score | Cor | Hex |
|-------|-----|-----|
| < 5 | Vermelho | #EF4444 |
| 5-7 | Amarelo | #F59E0B |
| >= 7 | Verde | #10B981 |

## Design System

O projeto usa um tema customizado com variáveis CSS:

```css
/* Cores de acento */
--color-accent-green: #10B981;
--color-accent-red: #EF4444;
--color-accent-amber: #F59E0B;

/* Cores de background */
--color-bg-page: #09090B;
--color-bg-surface: #18181B;
--color-bg-input: #27272A;

/* Cores de borda */
--color-border-primary: #27272A;

/* Cores de texto */
--color-text-primary: #FAFAFA;
--color-text-secondary: #A1A1AA;
--color-text-tertiary: #71717A;
```

## License

MIT
