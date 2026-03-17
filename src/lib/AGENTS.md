# Utilitários (lib/)

## Estrutura

```
src/lib/
├── utils.ts              # Funções utilitárias
└── detect-language.ts    # Detecção de linguagem
```

## cn() - Merge de Classes

Utilitário para merge de classes do Tailwind:

```typescript
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

**Uso:**

```tsx
import { cn } from "@/lib/utils";

// Com tailwind-variants (já faz merge automaticamente)
<div className={buttonVariants({ variant, className })} />

// Sem tv, usar cn()
<div className={cn("base-class", condition && "conditional-class")} />
```

## Detect Language

Detecção de linguagem baseada em conteúdo:

```typescript
// Exemplo de uso
import { detectLanguage } from "@/lib/detect-language";

const lang = detectLanguage(code);
```

## Regras

- Colocar utilitários compartilhados em `src/lib/`
- Usar `@/` import alias para paths
- Manter funções pequenas e focadas
- Exportar apenas o necessário
