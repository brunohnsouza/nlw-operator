# Roast Creation Feature - Design Spec

**Date:** 2026-03-17
**Status:** Approved

## Overview

Implement the ability for users to submit code snippets and receive AI-powered analysis (roasts). Users can choose between "roast mode" (sarcastic) or gentle feedback mode.

## User Flow

1. User types code in editor on homepage
2. User optionally toggles "roast mode" on/off
3. User clicks "$ roast_my_code" button
4. System calls tRPC mutation with code + roastMode
5. Mutation invokes OpenAI API for analysis
6. Result is saved to database
7. User is redirected to `/result/[id]` with the analysis

## Database Schema

**Note:** Extend existing `submissions` table in `src/db/schema.ts` with new columns:

### Existing Columns (already in table)
- `id` (uuid, primary key)
- `code` (text)
- `language` (text)
- `roastMode` (boolean)
- `score` (decimal)
- `createdAt` (timestamp)

### New Columns (add via migration)
| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| verdict | text | not null | Verdict string |
| roastTitle | text | not null | AI-generated roast title |
| issues | jsonb | not null | Array of issues (see Issue type below) |
| diff | jsonb | not null | Array of code changes (see DiffLine type below) |

> **Migration note:** Make new columns nullable initially, then backfill with default values for existing rows before adding NOT NULL constraint.

### Issue Type

```typescript
type Issue = {
  type: "critical" | "warning" | "good";
  title: string;
  description: string;
};
```

### Diff Type

```typescript
type DiffLine = {
  type: "context" | "removed" | "added";
  code: string;
};
```

## tRPC API

> **Note:** The existing `roastLevelEnum` in schema.ts is not used. We use `roastMode: boolean` instead for simplicity.

### Mutation: `roasts.analyze`

**Input:**
```typescript
const AnalyzeCodeInput = z.object({
  code: z.string().min(1).max(2000),
  language: z.enum(['javascript', 'typescript', 'python', 'go', 'rust', 'html', 'css', 'json']),
  roastMode: z.boolean(),
});
```

**Output:**
```typescript
{
  id: string; // created submission ID for redirect
}
```

### Query: `roasts.getById`

**Input:**
```typescript
const GetRoastByIdInput = z.object({
  id: z.string().uuid(),
});
```

**Output:**
```typescript
{
  id: string;
  code: string;
  language: string;
  roastMode: boolean;
  score: number; // Convert from decimal string: Number(row.score)
  verdict: string;
  roastTitle: string;
  issues: Issue[];
  diff: DiffLine[];
  createdAt: Date;
}
```

## OpenAI Integration

**Service:** `src/lib/ai.ts`

```typescript
interface AnalyzeCodeParams {
  code: string;
  language: string;
  roastMode: boolean;
}

interface AnalyzeCodeResult {
  score: number;
  verdict: string;
  roastTitle: string;
  issues: Issue[];
  diff: DiffLine[];
}

export async function analyzeCode(params: AnalyzeCodeParams): Promise<AnalyzeCodeResult>;
```

**Configuration:**
- Model: `gpt-4o-mini` (cost-effective)
- API Key: from `OPENAI_API_KEY` env variable

**Prompt Strategy:**
- `roastMode: true` → sarcastic, harsh feedback, creative insults
- `roastMode: false` → constructive, helpful feedback

**Response Format:** JSON matching Issue and Diff types

## Frontend Changes

### EditorSection (`src/app/editor-section.tsx`) - MODIFY

- Add `onSubmit` callback prop:
  ```typescript
  onSubmit: (code: string, language: string, roastMode: boolean) => Promise<void>;
  ```
- Call mutation on button click
- Redirect to `/result/[id]` on success

### ResultPage (`src/app/result/[id]/page.tsx`)

- Remove static mock data
- Fetch data via tRPC query `roasts.getById`
- Use existing components: ScoreRing, CodeBlock, AnalysisCard, DiffLine
- Add loading/skeleton states

## Error Handling

| Scenario | Handling |
|----------|----------|
| Empty/too long code | Button disabled (already implemented) |
| OpenAI API error | Show error toast, allow retry |
| Network error | Show error message, allow retry |
| Invalid roast ID | Show 404 page |

## Validation Rules

- Code: max 2000 characters (enforced in CodeEditor)
- Language: must be supported (javascript, typescript, python, go, rust, html, css, json)
- Rate limiting: TBD based on usage

## Security Considerations

- Sanitize code input before API call
- Do not expose API keys in client
- Validate all inputs on server side
- Use parameterized queries (Drizzle handles this)

## Acceptance Criteria

1. [ ] User can submit code (up to 2000 chars)
2. [ ] User can toggle roast mode on/off
3. [ ] Clicking submit calls OpenAI and creates roast in DB
4. [ ] User is redirected to result page showing analysis
5. [ ] Result page displays: score, verdict, code, issues, suggested fix
6. [ ] Roast mode produces sarcastic vs constructive output
7. [ ] Errors are handled gracefully with user feedback

## Future Enhancements (Out of Scope)

- Share roast functionality
- Leaderboard integration
- User authentication
- Rate limiting
