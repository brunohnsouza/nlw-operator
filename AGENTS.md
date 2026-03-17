# DevRoast - Project Guidelines

## Overview

AI-powered code review app with brutal feedback. Built with Next.js 16, Tailwind CSS, Biome.

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Styling**: Tailwind CSS v4
- **Linting**: Biome
- **Syntax Highlighting**: Shiki (theme: vesper)
- **Primitives**: @base-ui/react

## UI Components

Located in `src/components/ui/`. All components use:
- Named exports (never default)
- tailwind-variants for variants
- `cn()` util (twMerge + clsx) for className merging

### Pattern: Composition over Props

```tsx
// ✅ Good - composition
<ComponentRoot>
  <ComponentChild />
</ComponentRoot>

// ❌ Bad - props
<Component prop1="" prop2="" />
```

### Creating New Components

1. Use tailwind-variants for variants
2. Extend native HTML props
3. Use forwardRef when needed
4. All colors via Tailwind theme variables

## Colors (Tailwind Theme)

Defined in `src/app/globals.css` `@theme`:
- `--color-accent-*` (green, red, amber)
- `--color-bg-*` (page, surface, input)
- `--color-border-*`
- `--color-text-*` (primary, secondary, tertiary)

## Commands

- `npm run dev` - Development
- `npm run build` - Production build
- `npm run lint` - Biome check

## Documentação Detalhada

Padrões específicos de cada área:

- [Componentes UI](./src/components/ui/AGENTS.md) - Componentes, variantes, tailwind-variants
- [tRPC](./src/trpc/AGENTS.md) - API, procedures, client/server
- [Drizzle](./src/db/AGENTS.md) - ORM, schema, queries
- [Utils](./src/lib/AGENTS.md) - Funções utilitárias

##Specs

Decisões técnicas documentadas em `specs/`:
- [tRPC](./specs/trpc.md)
- [Drizzle](./specs/drizzle.md)
