# Padrões de Componentes UI

## Estrutura de Arquivos

```
src/
├── app/
│   └── globals.css        (variáveis de tema no @theme)
└── components/ui/
    ├── button.tsx
    ├── toggle.tsx
    ├── badge.tsx
    ├── analysis-card.tsx
    ├── code-block.tsx
    ├── diff-line.tsx
    ├── table-row.tsx
    ├── score-ring.tsx
    └── AGENTS.md
```

## Cores do Tema

Todas as cores do projeto devem ser definidas na diretiva `@theme` em `src/app/globals.css`:

```css
@theme {
  --color-accent-green: #10B981;
  --color-accent-red: #EF4444;
  --color-accent-amber: #F59E0B;

  --color-bg-page: #09090B;
  --color-bg-surface: #18181B;
  --color-bg-input: #27272A;

  --color-border-primary: #27272A;

  --color-text-primary: #FAFAFA;
  --color-text-secondary: #A1A1AA;
  --color-text-tertiary: #71717A;
}
```

**Uso nos componentes:**

```tsx
// Classes do Tailwind com as variáveis
<div className="bg-bg-page text-text-primary border-border-primary" />
<span className="text-accent-green" />
```

## Padrões para Novos Componentes

### 1. Named Exports

Sempre usar **named exports**, nunca default exports:

```tsx
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(...);
```

### 2. Extender Propriedades Nativas

Estender as propriedades nativas do elemento HTML correspondente:

```tsx
import { type ButtonHTMLAttributes, forwardRef } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}
```

### 3. Usar tailwind-variants (tv)

Utilizar `tailwind-variants` para definir variantes e fazer merge automático de classes:

```tsx
import { tv, type VariantProps } from "tailwind-variants";

export const buttonVariants = tv({
  base: "classes-base",
  variants: {
    variant: { ... },
    size: { ... },
  },
  defaultVariants: { ... },
});

type Props = VariantProps<typeof componentVariants>;
```

### 4. forwardRef para Refs

Sempre usar `forwardRef` para permitir acesso à ref do elemento nativo:

```tsx
export const Component = forwardRef<HTMLButtonElement, Props>(
  ({ className, variant, ...props }, ref) => {
    return <button ref={ref} className={...} {...props} />;
  },
);

Component.displayName = "Component";
```

### 5. Padrão de Nomenclatura

- **Arquivo**: `kebab-case.tsx` (ex: `button.tsx`, `text-input.tsx`)
- **Componente**: `PascalCase` (ex: `Button`, `TextInput`)
- **Variants**: `camelCase` (ex: `primary`, `secondary`)

### 6. Template para Novo Componente

```tsx
import { type ElementHTMLAttributes, forwardRef } from "react";

import { tv, type VariantProps } from "tailwind-variants";

export const componentVariants = tv({
  base: "classes-base-sempre-aplicadas",
  variants: {
    variant: {
      primary: "classes-primary",
      secondary: "classes-secondary",
    },
    size: {
      sm: "classes-sm",
      md: "classes-md",
    },
  },
  defaultVariants: {
    variant: "primary",
    size: "md",
  },
});

type ComponentProps = ElementHTMLAttributes<HTMLElement> &
  VariantProps<typeof componentVariants>;

export const Component = forwardRef<HTMLElement, ComponentProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <element
        ref={ref}
        className={componentVariants({ variant, size, className })}
        {...props}
      />
    );
  },
);

Component.displayName = "Component";
```

### 7. Dependências

Instalar as seguintes dependências para componentes UI:

```bash
npm install clsx tailwind-merge tailwind-variants @base-ui/react
```

- `clsx`: Para condicionalismo de classes
- `tailwind-merge`: Para merges de classes (usado internamente pelo tv)
- `tailwind-variants`: Para definição de variantes com merge automático
- `@base-ui/react`: Para componentes comportamentais (Toggle, Switch, etc)

### 8. Componentes Comportamentais

Para componentes que requerem comportamento interativo (Toggle, Switch, etc), usar primitivos do `@base-ui/react`:

```tsx
import { Toggle as BaseToggle } from "@base-ui/react/toggle";

export interface ToggleProps {
  className?: string;
  defaultPressed?: boolean;
  pressed?: boolean;
  onPressedChange?: (pressed: boolean) => void;
  disabled?: boolean;
}

export function Toggle(props: ToggleProps) {
  return <BaseToggle {...props} />;
}
```

### 9. Componentes Server-Side (Shiki)

Para componentes que usam Shiki para highlight de código, criar como Server Components:

```tsx
import { createHighlighter } from "shiki";

let highlighter: Highlighter | null = null;

async function getHighlighterInstance() {
  if (!highlighter) {
    highlighter = await createHighlighter({
      themes: ["vesper"],
      langs: ["javascript", "typescript"],
    });
  }
  return highlighter;
}

export async function CodeBlock({ code, lang = "javascript" }) {
  const hl = await getHighlighterInstance();
  const html = hl.codeToHtml(code, { lang, theme: "vesper" });

  return <div dangerouslySetInnerHTML={{ __html: html }} />;
}
```
