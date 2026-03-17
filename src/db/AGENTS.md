# Padrões Drizzle ORM

## Estrutura de Arquivos

```
src/db/
├── index.ts      # Conexão e instância drizzle
├── schema.ts     # Definição de tabelas
└── seed.ts       # Seed de dados (opcional)
```

## Schema

### Definição de Tabelas

```typescript
import {
  boolean,
  decimal,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

export const roastLevelEnum = pgEnum("roast_level", ["gentle", "roast"]);

export const submissions = pgTable("submissions", {
  id: uuid("id").primaryKey().defaultRandom(),
  code: text("code").notNull(),
  language: text("language").notNull(),
  score: decimal("score", { precision: 3, scale: 1 }).notNull(),
  roastMode: boolean("roast_mode").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});
```

### Tipos Inferidos

```typescript
export type Submission = typeof submissions.$inferSelect;
export type NewSubmission = typeof submissions.$inferInsert;
```

## Conexão (index.ts)

```typescript
import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import * as schema from "./schema";

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
});

export const db = drizzle(pool, { schema });
```

## Queries Comuns

### Select

```typescript
const result = await db.select().from(submissions);
```

### Insert

```typescript
const [submission] = await db
  .insert(submissions)
  .values({ code: "...", language: "typescript", score: "7.5" })
  .returning();
```

### Update

```typescript
await db
  .update(submissions)
  .set({ score: "8.0" })
  .where(eq(submissions.id, id));
```

### Delete

```typescript
await db.delete(submissions).where(eq(submissions.id, id));
```

### Joins

```typescript
db.select({
  id: submissions.id,
  code: submissions.code,
  feedback: feedbacks.content,
})
  .from(submissions)
  .innerJoin(feedbacks, eq(feedbacks.submissionId, submissions.id));
```

### Aggregations

```typescript
import { count, avg, sql } from "drizzle-orm";

const [result] = await db
  .select({
    total: count(),
    avgScore: avg(submissions.score),
  })
  .from(submissions);
```

## Com Docker Compose

```yaml
services:
  postgres:
    image: postgres:16-alpine
    environment:
      POSTGRES_USER: devroast
      POSTGRES_PASSWORD: devroast
      POSTGRES_DB: devroast
    ports:
      - "5432:5432"
```

## Commands

```bash
npm run db:push    # Executar migrations
npm run db:studio  # Abrir Drizzle Studio
npm run db:seed    # Executar seed
```

## Dependências

```bash
npm install drizzle-orm drizzle-kit pg
```

## Boas Práticas

- Usar `defaultRandom()` para UUIDs
- Usar `defaultNow()` para timestamps
- sempre tipar com `$inferSelect` e `$inferInsert`
- Exportar tipos para uso em outras partes do código
