# Especificação: tRPC como Camada API/Back-end

## 1. Análise das Opções

### 1.1 Alternativas Pesquisadas

| Abordagem | Descrição |
|-----------|-----------|
| **tRPC + TanStack Query** | API type-safe sem geração de código, integração nativa com Next.js |
| REST API manual | Endpoints tradicionais sem type safety automático |
| GraphQL | Schema definido, boa opção mas mais complexo |

### 1.2 Estado Atual do Projeto

- Next.js 16 (App Router)
- Biome para lint
- Shiki para syntax highlight
- Tailwind CSS v4
- Sem camada API establecida

---

## 2. Recomendação

### ✅ Recomendado: tRPC v11 + TanStack Query

**Justificativa:**
1. **Type safety end-to-end** - Front-end e back-end compartilhando tipos automaticamente
2. **Integração com RSC** - Suporte nativo para Server Components do Next.js
3. **Zero código boilerplate** - Sem geração de schemas ou código
4. **Validação com Zod** - Input validation automática
5. **Padrão da comunidade** - Amplamente utilizado em projetos Next.js modernos

---

## 3. Arquitetura Proposta

### 3.1 Estrutura de Arquivos

```
src/
├── app/
│   ├── api/trpc/[trpc]/route.ts   # API handler
│   ├── layout.tsx                  # TRPCProvider wrapper
├── trpc/
│   ├── init.ts                     # tRPC server init
│   ├── query-client.ts             # QueryClient factory
│   ├── client.tsx                 # Client components provider
│   ├── server.tsx                 # Server caller (RSC)
│   └── routers/
│       └── _app.ts                 # Main router
```

### 3.2 Fluxo de Dados

```
┌─────────────────────────────────────────────────────────┐
│  Server Components (RSC)                                │
│  ├── Prefetch via server.ts (createTRPCOptionsProxy)   │
│  └── Hydration boundary para client                     │
├─────────────────────────────────────────────────────────┤
│  Client Components                                      │
│  ├── useTRPC() hooks via @tanstack-react-query         │
│  └── QueryClient provider em layout.tsx                 │
├─────────────────────────────────────────────────────────┤
│  API Layer                                              │
│  ├── app/api/trpc/[trpc]/route.ts (fetch adapter)      │
│  └── Validação Zod em procedures                        │
└─────────────────────────────────────────────────────────┘
```

---

## 4. Decisões Tomadas ✅

| Decisão | Valor |
|---------|-------|
| Biblioteca | tRPC v11 |
| Data fetching | @tanstack/react-query v5 |
| Validação | Zod |
| Serialização | superjson |
| Adapter | Fetch (Next.js App Router) |
| Estrutura | src/trpc/ |

---

## 5. To-Dos para Implementação

### Fase 1: Setup e Instalação

- [ ] **Instalar dependências**
  ```
  npm install @trpc/server @trpc/client @trpc/tanstack-react-query @tanstack/react-query zod client-only server-only superjson
  ```

- [ ] **Criar `trpc/init.ts`**
  - initTRPC com contexto
  - baseProcedure
  - createTRPCRouter

- [ ] **Criar `trpc/routers/_app.ts`**
  - Router principal com procedures de exemplo

- [ ] **Criar API handler `app/api/trpc/[trpc]/route.ts`**
  - fetchRequestHandler do tRPC

### Fase 2: Client Setup

- [ ] **Criar `trpc/query-client.ts`**
  - makeQueryClient factory
  - defaultShouldDehydrateQuery
  - staleTime configurado

- [ ] **Criar `trpc/client.tsx`**
  - TRPCProvider com QueryClientProvider
  - createTRPCClient com httpBatchLink

- [ ] **Criar `trpc/server.tsx`**
  - createTRPCOptionsProxy para prefetch em RSC

- [ ] **Atualizar `app/layout.tsx`**
  - Importar e wrap com Provider

### Fase 3: Exemplo de Uso

- [ ] **Criar procedure de exemplo**
  - Query: hello world

- [ ] **Demonstrar uso em Client Component**
  - useTRPC hook

- [ ] **Demonstrar prefetch em Server Component**
  - HydrationBoundary

---

## 6. Perguntas em Aberto

1. **Auth?** - Integrar com Clerk ou NextAuth depois?
2. **Database?** - Preparar para Drizzle/Prisma?
3. **Módulos?** - Separar routers por domínio desde o início?

---

## 7. Decisões Finais Confirmadas ✅

| Decisão | Valor |
|---------|-------|
| Versão tRPC | v11 |
| Validação | Zod |
| Serialização | superjson |
| Client hooks | useTRPC() do @trpc/tanstack-react-query |
| Server prefetch | createTRPCOptionsProxy |
| API endpoint | /api/trpc/[trpc] |