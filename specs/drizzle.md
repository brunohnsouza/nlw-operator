# Especificação - Drizzle ORM

## Visão Geral

- **Objetivo**: Implementar persistência de dados com Drizzle ORM + PostgreSQL
- **Tipo**: Sistema anónimo de análise de código com feedback persistido

---

## Docker Compose

```yaml
services:
  postgres:
    image: postgres:16-alpine
    container_name: devroast-db
    environment:
      POSTGRES_USER: devroast
      POSTGRES_PASSWORD: devroast
      POSTGRES_DB: devroast
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U devroast"]
      interval: 5s
      timeout: 5s
      retries: 5

volumes:
  postgres_data:
```

---

## Tabelas

### 1. `submissions`

Armazena as submissões de código.

| Coluna | Tipo | Descrição |
|--------|------|-----------|
| `id` | `uuid` | PK, UUID v4 |
| `code` | `text` | Código submetido |
| `language` | `varchar(50)` | Linguagem (manual) |
| `score` | `decimal(3,1)` | Nota (0-10) |
| `roast_mode` | `boolean` | Modo roast (true=sarcástico) |
| `created_at` | `timestamp` | Data de criação |

### 2. `feedbacks`

Armazena o feedback gerado pela IA para cada submissão.

| Coluna | Tipo | Descrição |
|--------|------|-----------|
| `id` | `uuid` | PK, UUID v4 |
| `submission_id` | `uuid` | FK para submissions |
| `content` | `text` | Texto do roast/feedback |
| `created_at` | `timestamp` | Data de criação |

---

## Enums

```sql
CREATE TYPE roast_level AS ENUM ('gentle', 'roast');
```

```typescript
export const roastLevelEnum = pgEnum('roast_level', ['gentle', 'roast']);
```

---

## Schema Drizzle

```typescript
import { pgTable, text, uuid, timestamp, decimal, boolean, pgEnum } from 'drizzle-orm/pg-core';

export const roastLevelEnum = pgEnum('roast_level', ['gentle', 'roast']);

export const submissions = pgTable('submissions', {
  id: uuid('id').primaryKey().defaultRandom(),
  code: text('code').notNull(),
  language: varchar('language', { length: 50 }).notNull(),
  score: decimal('score', { precision: 3, scale: 1 }).notNull(),
  roastMode: boolean('roast_mode').notNull().default(true),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

export const feedbacks = pgTable('feedbacks', {
  id: uuid('id').primaryKey().defaultRandom(),
  submissionId: uuid('submission_id').notNull().references(() => submissions.id),
  content: text('content').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});
```

---

## To-Dos para Implementação

- [ ] Adicionar dependências: `drizzle-orm`, `drizzle-kit`, `pg`
- [ ] Criar `docker-compose.yml` com PostgreSQL
- [ ] Criar arquivo `.env` com `DATABASE_URL`
- [ ] Criar `src/db/schema.ts` com schema acima
- [ ] Criar `src/db/index.ts` com conexão e drizzle instance
- [ ] Criar `drizzle.config.ts` para migrations
- [ ] Adicionar scripts em `package.json`:
  - `db:push` - Executar migrations
  - `db:studio` - Abrir Drizzle Studio
- [ ] Criar seed inicial (opcional)

---

## Queries Comuns

```typescript
// Listar leaderboard (piores notas)
db.select()
  .from(submissions)
  .orderBy(sql`${submissions.score} ASC`)
  .limit(100);

// Buscar submissão com feedback
db.select({
  id: submissions.id,
  code: submissions.code,
  score: submissions.score,
  feedback: feedbacks.content,
})
.from(submissions)
.innerJoin(feedbacks, eq(feedbacks.submissionId, submissions.id))
.where(eq(submissions.id, id));

// Estatísticas
db.select({
  total: sql<number>`count(*)`,
  avgScore: sql<number>`avg(${submissions.score})`,
}).from(submissions);
```
