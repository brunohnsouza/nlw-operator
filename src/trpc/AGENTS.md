# Padrões tRPC

## Estrutura de Arquivos

```
src/trpc/
├── init.ts           # tRPC server init (t, router, baseProcedure)
├── query-client.ts   # makeQueryClient factory
├── client.tsx        # TRPCProvider (Client Component)
├── server.tsx        # Server caller (RSC)
└── routers/
    └── _app.ts       # Main router com procedures
```

## Setup Inicial

### 1. init.ts

Criar contexto e inicializar tRPC:

```typescript
import { initTRPC } from "@trpc/server";
import { cache } from "react";
import superjson from "superjson";
import { db } from "@/db";

export type Context = {
  db: typeof db;
};

export const createTRPCContext = cache(async (): Promise<Context> => {
  return { db };
});

const t = initTRPC.context<Context>().create({
  transformer: superjson,
});

export const router = t.router;
export const baseProcedure = t.procedure;
```

### 2. Routers (_app.ts)

Estrutura de routers com organização por domínio:

```typescript
import { baseProcedure, router } from "../init";

export const appRouter = router({
  metrics: router({
    getStats: baseProcedure.query(async ({ ctx }) => {
      return { /* dados */ };
    }),
  }),
  // Adicionar mais domínios aqui
});

export type AppRouter = typeof appRouter;
```

## Padrões de Procedures

### Query

```typescript
baseProcedure.query(async ({ ctx }) => {
  return dados;
});
```

### Mutation

```typescript
baseProcedure
  .input(zodSchema)
  .mutation(async ({ ctx, input }) => {
    return resultado;
  });
```

## Client Usage

### Client Components

```typescript
import { useTRPC } from "@/trpc/client";

export function Component() {
  const trpc = useTRPC();
  const { data } = trpc.metrics.getStats.useQuery();
}
```

### Server Components (Prefetch)

```typescript
import { createTRPCOptionsProxy } from "@trpc/tanstack-react-query";
import { cache } from "react";
import { createTRPCContext } from "@/trpc/init";
import { appRouter } from "@/trpc/routers/_app";

const getTRPC = cache(async () => {
  const ctx = await createTRPCContext();
  return createTRPCOptionsProxy(appRouter, ctx);
});

export default async function Page() {
  const trpc = await getTRPC();
  await trpc.metrics.getStats.prefetch();
  
  return <HydrationBoundary state={trpc.metrics.getStats dehydrate()}>
    {/* conteúdo */}
  </HydrationBoundary>;
}
```

### Server Components (Simples - Sem Hydration)

Para Server Components puros que não precisam de hydration no cliente:

```typescript
import { caller } from "@/trpc/server";

export async function ServerComponent() {
  const data = await caller.leaderboard.getLeaderboard();
  
  return <div>{/* render data */}</div>;
}
```

Use `caller` quando:
- Não precisa de revalidação client-side
- Dados são fetched apenas no servidor
- Não há interação com queries client-side

## Dependências

```bash
npm install @trpc/server @trpc/client @trpc/tanstack-react-query @tanstack/react-query zod superjson client-only server-only
```

## Regras

- Usar `baseProcedure` como base para todas as procedures
- sempre validar inputs com Zod
- usar `superjson` para serialização de dados
- organizar routers por domínio (metrics, submissions, etc)
- usar `Promise.all` para queries paralelas quando possível

## Queries Paralelas

Quando uma procedure precisa buscar múltiplos dados independentes, usar `Promise.all` para executar em paralelo:

```typescript
// ❌ Sequencial - mais lento
const [countResult] = await ctx.db.select({ count: count() }).from(submissions);
const [avgResult] = await ctx.db.select({ avg: avg(submissions.score) }).from(submissions);
const entries = await ctx.db.select().from(submissions).orderBy(asc(score)).limit(3);

// ✅ Paralelo - mais rápido
const [countResult, avgResult, entries] = await Promise.all([
  ctx.db.select({ count: count() }).from(submissions),
  ctx.db.select({ avg: avg(submissions.score) }).from(submissions),
  ctx.db.select().from(submissions).orderBy(asc(score)).limit(3),
]);
```
