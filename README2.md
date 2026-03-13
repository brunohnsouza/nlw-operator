# DevRoast

AI-powered code review with brutal honesty. Paste your code, get roasted.

## Features

- **Code Analysis** - Submit code and receive detailed feedback on code quality
- **Roast Mode** - Toggle between gentle feedback or maximum sarcasm
- **Leaderboard** - See the worst code submissions ranked by shame score
- **Syntax Highlighting** - Beautiful code blocks with vesper theme
- **Score Ring** - Visual representation of code quality scores

## Tech Stack

- Next.js 16 (App Router)
- Tailwind CSS
- Biome (linting & formatting)
- Shiki (syntax highlighting)
- Base UI (accessible primitives)

## Getting Started

```bash
npm install
npm run dev
```

## Project Structure

```
src/
├── app/              # Next.js pages
├── components/ui/    # Reusable UI components
└── lib/              # Utilities
```

## Commands

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run Biome linter
