# Leaderboard Page Design

## Overview

Full leaderboard page displaying the 20 worst code submissions with collapsible code preview and syntax highlighting, following the same pattern as the homepage's shame leaderboard.

## Layout Structure

### Header Section (following Pencil design)
- Title: `> shame_leaderboard`
- Subtitle: `// the most roasted code on the internet`
- Stats row: `2,847 submissions · avg score: 4.2/10`

### Entries List
- 20 entries total (no pagination)
- Each entry: collapsed by default showing 3 lines + "show more" button
- On expand: full syntax highlighting + "show less" button

## Data Flow

### tRPC Procedure

Existing `leaderboard.getLeaderboard` already returns:
- `entries`: array of { id, rank, score, code, language, linesCount }
- `totalSubmissions`: number
- `avgScore`: number

No changes needed to the procedure - it already supports fetching entries.

### Server Component

`LeaderboardPageContent` (Server Component):
- Fetches data via `caller.leaderboard.getLeaderboard()`
- Renders header with metrics
- Renders list of entries using existing `LeaderboardEntry` component

### Client Components

- `CodePreview`: Reused from homepage - handles collapsible behavior
- `CodeBlockClient`: Reused from homepage - client-side syntax highlighting

## Components

### LeaderboardPageSkeleton
Simple skeleton with animated placeholders:
- Header placeholder (title, subtitle, stats)
- 20 entry placeholders with rank, score, code preview, language

### LeaderboardEntry (modification needed)
- Currently uses Server `CodeBlock` component directly
- Needs to be modified to use `CodePreview` for collapsible behavior
- Keep existing header: rank, score, language, linesCount

## Loading State

- Wrap page content in `<Suspense fallback={<LeaderboardPageSkeleton />}>`
- Server-side data fetching with hydration

## Acceptance Criteria

1. Page displays header with title, subtitle, and metrics
2. 20 entries are displayed in a list
3. Each entry is collapsed by default showing 3 lines
4. "show more" button expands to full syntax highlighted code
5. "show less" button collapses back to preview
6. Loading shows skeleton while fetching data
7. No pagination - all 20 shown at once

## Implementation Notes

- Reuse existing components where possible
- Use `CodePreview` and `CodeBlockClient` from homepage implementation
- Follow same patterns: Server Components + Suspense for loading
