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
<LeaderboardTableRoot>
  <LeaderboardTableHeader />
  <LeaderboardTableRow rank={1} score={9.2} ... />
</LeaderboardTableRoot>

// ❌ Bad - props
<LeaderboardTable entries={[]} showHeader />
```

### Creating New Components

1. Use tailwind-variants for variants
2. Extend native HTML props
3. Use forwardRef when needed
4. All colors via Tailwind theme variables (e.g., `text-accent-green`)

## Colors (Tailwind Theme)

Defined in `src/app/globals.css` `@theme`:
- `--color-accent-green`, `--color-accent-red`, `--color-accent-amber`
- `--color-bg-page`, `--color-bg-surface`, `--color-bg-input`
- `--color-border-primary`
- `--color-text-primary`, `--color-text-secondary`, `--color-text-tertiary`

## Commands

- `npm run dev` - Development
- `npm run build` - Production build
- `npm run lint` - Biome check
