# Roast Creation Feature Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement the ability for users to submit code snippets and receive AI-powered analysis (roasts) with roast mode toggle.

**Architecture:** 
- Create OpenAI service for code analysis
- Add tRPC mutation for creating roasts and query for fetching by ID
- Update EditorSection to handle submission and redirect
- Update ResultPage to fetch real data instead of mock

**Tech Stack:** Next.js 16, tRPC, Drizzle, OpenAI (gpt-4o-mini), zod

---

## File Structure

```
src/
├── db/
│   └── schema.ts              # Add columns to submissions table
├── lib/
│   └── ai.ts                 # NEW: OpenAI service
├── trpc/
│   └── routers/
│       └── _app.ts           # Add roasts router
├── app/
│   ├── editor-section.tsx    # Add onSubmit handler
│   └── result/[id]/
│       └── page.tsx          # Fetch from tRPC
└── components/
    └── ui/
        └── result-skeleton.tsx  # NEW: Loading skeleton for result page
```

---

## Task 1: Database Schema Migration

**Files:**
- Modify: `src/db/schema.ts`

- [ ] **Step 1: Add jsonb import to schema.ts**

Add `jsonb` to the imports from `drizzle-orm/pg-core`:

```typescript
import {
  boolean,
  decimal,
  jsonb,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
```

- [ ] **Step 2: Add new columns to submissions table**

Add these columns to the existing `submissions` table (after `score`):

```typescript
verdict: text("verdict"),
roastTitle: text("roast_title"),  
issues: jsonb("issues"),
diff: jsonb("diff"),
```

Note: Make them nullable initially as per migration notes.

- [ ] **Step 3: Add types for Issue and DiffLine**

Add these type exports at the end of the file (after existing types):

```typescript
export type Issue = {
  type: "critical" | "warning" | "good";
  title: string;
  description: string;
};

export type DiffLine = {
  type: "context" | "removed" | "added";
  code: string;
};
```

- [ ] **Step 4: Commit**

```bash
git add src/db/schema.ts
git commit -m "feat: add columns to submissions table for roast analysis"
```

---

## Task 2: OpenAI Service

**Files:**
- Create: `src/lib/ai.ts`

- [ ] **Step 1: Create src/lib/ai.ts**

```typescript
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export interface Issue {
  type: "critical" | "warning" | "good";
  title: string;
  description: string;
}

export interface DiffLine {
  type: "context" | "removed" | "added";
  code: string;
}

export interface AnalyzeCodeResult {
  score: number;
  verdict: string;
  roastTitle: string;
  issues: Issue[];
  diff: DiffLine[];
}

const SYSTEM_PROMPT_ROAST = `You are a brutal code reviewer who roasts terrible code. 
Be sarcastic, harsh, and use creative insults.
Output ONLY valid JSON in this exact format:
{
  "score": number (0-10),
  "verdict": "short_verdict_string",
  "roastTitle": "creative_insult_title",
  "issues": [{"type": "critical"|"warning"|"good", "title": "...", "description": "..."}],
  "diff": [{"type": "context"|"removed"|"added", "code": "..."}]
}`;

const SYSTEM_PROMPT_GENTLE = `You are a helpful code reviewer who provides constructive feedback.
Be kind but honest. Focus on helping the developer improve.
Output ONLY valid JSON in this exact format:
{
  "score": number (0-10),
  "verdict": "short_verdict_string", 
  "roastTitle": "helpful_title",
  "issues": [{"type": "critical"|"warning"|"good", "title": "...", "description": "..."}],
  "diff": [{"type": "context"|"removed"|"added", "code": "..."}]
}`;

export async function analyzeCode({
  code,
  language,
  roastMode,
}: {
  code: string;
  language: string;
  roastMode: boolean;
}): Promise<AnalyzeCodeResult> {
  const systemPrompt = roastMode ? SYSTEM_PROMPT_ROAST : SYSTEM_PROMPT_GENTLE;

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content: systemPrompt,
      },
      {
        role: "user",
        content: `Analyze this ${language} code:\n\n${code}`,
      },
    ],
    response_format: { type: "json_object" },
  });

  const content = response.choices[0]?.message?.content;
  if (!content) {
    throw new Error("No response from OpenAI");
  }

  const result = JSON.parse(content) as AnalyzeCodeResult;
  
  // Validate and sanitize
  if (typeof result.score !== "number" || result.score < 0 || result.score > 10) {
    result.score = Math.max(0, Math.min(10, Number(result.score) || 5));
  }
  
  return result;
}
```

- [ ] **Step 2: Install openai package**

```bash
npm install openai
```

- [ ] **Step 3: Commit**

```bash
git add src/lib/ai.ts package.json package-lock.json
git commit -m "feat: add OpenAI service for code analysis"
```

---

## Task 3: tRPC Router

**Files:**
- Modify: `src/trpc/routers/_app.ts`

- [ ] **Step 1: Add roasts router to _app.ts**

Add the new router after the existing routers. Import types at the top:

```typescript
import { analyzeCode, type Issue, type DiffLine } from "@/lib/ai";
import { submissions } from "@/db/schema";
import { z } from "zod";
import { eq } from "drizzle-orm";
```

Then add the router:

```typescript
roasts: router({
  analyze: baseProcedure
    .input(
      z.object({
        code: z.string().min(1).max(2000),
        language: z.enum([
          "javascript",
          "typescript",
          "python",
          "go",
          "rust",
          "html",
          "css",
          "json",
        ]),
        roastMode: z.boolean(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { code, language, roastMode } = input;

      // Call OpenAI
      const analysis = await analyzeCode({
        code,
        language,
        roastMode,
      });

      // Save to database
      const [submission] = await ctx.db
        .insert(submissions)
        .values({
          code,
          language,
          roastMode,
          score: analysis.score.toString(),
          verdict: analysis.verdict,
          roastTitle: analysis.roastTitle,
          issues: analysis.issues,
          diff: analysis.diff,
        })
        .returning();

      return { id: submission.id };
    }),

  getById: baseProcedure
    .input(z.object({ id: z.string().uuid() }))
    .query(async ({ ctx, input }) => {
      const [submission] = await ctx.db
        .select()
        .from(submissions)
        .where(eq(submissions.id, input.id));

      if (!submission) {
        throw new Error("Roast not found");
      }

      return {
        id: submission.id,
        code: submission.code,
        language: submission.language,
        roastMode: submission.roastMode,
        score: Number(submission.score),
        verdict: submission.verdict,
        roastTitle: submission.roastTitle,
        issues: submission.issues as Issue[],
        diff: submission.diff as DiffLine[],
        createdAt: submission.createdAt,
      };
    }),
}),
```

- [ ] **Step 2: Add imports for Issue and DiffLine types**

Make sure to import or define these types at the top of the file.

- [ ] **Step 3: Commit**

```bash
git add src/trpc/routers/_app.ts
git commit -m "feat: add roasts.analyze and roasts.getById tRPC endpoints"
```

---

## Task 4: EditorSection Update

**Files:**
- Modify: `src/app/editor-section.tsx`

- [ ] **Step 1: Add onSubmit prop and import**

Add useRouter and update the component. Note: For now, use "javascript" as default language. A language selector would be a future enhancement:

```typescript
"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { CodeEditor } from "@/components/ui/code-editor";
import { Toggle } from "@/components/ui/toggle";
import { useTRPC } from "@/trpc/client";

interface EditorSectionProps {
  initialCode: string;
  onSubmit?: (
    code: string,
    language: string,
    roastMode: boolean
  ) => Promise<void>;
}

export function EditorSection({ initialCode, onSubmit }: EditorSectionProps) {
  const router = useRouter();
  const trpc = useTRPC();
  const [code, setCode] = useState(initialCode);
  const [roastMode, setRoastMode] = useState(true);
  const [isOverLimit, setIsOverLimit] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const hasCode = code.trim().length > 0;

  const handleSubmit = async () => {
    if (!hasCode || isOverLimit || isLoading) return;

    setIsLoading(true);
    try {
      if (onSubmit) {
        await onSubmit(code, "javascript", roastMode);
      } else {
        const result = await trpc.roasts.analyze.mutate({
          code,
          language: "javascript", // TODO: Get from language selector
          roastMode,
        });
        router.push(`/result/${result.id}`);
      }
    } catch (error) {
      console.error("Failed to analyze code:", error);
      alert("Failed to analyze code. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };
```

- [ ] **Step 2: Update button to use handleSubmit**

Replace the Button component to use the handler:

```typescript
<Button
  variant="primary"
  disabled={!hasCode || isOverLimit || isLoading}
  onClick={handleSubmit}
>
  {isLoading ? "$ analyzing..." : "$ roast_my_code"}
</Button>
```

- [ ] **Step 3: Commit**

```bash
git add src/app/editor-section.tsx
git commit -m "feat: add onSubmit handler and loading state to EditorSection"
```

---

## Task 5: ResultPage Update

**Files:**
- Modify: `src/app/result/[id]/page.tsx`

- [ ] **Step 1: Update ResultPage to fetch from tRPC**

Replace the static mock data with real data fetching:

```typescript
import { cacheLife } from "next/cache";
import { notFound } from "next/navigation";

import {
  AnalysisCard,
  AnalysisCardDescription,
  AnalysisCardLabel,
  AnalysisCardTitle,
} from "@/components/ui/analysis-card";
import { CodeBlock } from "@/components/ui/code-block";
import { DiffLine } from "@/components/ui/diff-line";
import { ScoreRing } from "@/components/ui/score-ring";
import { caller } from "@/trpc/server";

interface ResultPageProps {
  params: Promise<{ id: string }>;
}

export default async function ResultPage({ params }: ResultPageProps) {
  "use cache";
  cacheLife("days");

  const { id } = await params;

  let data;
  try {
    data = await caller.roasts.getById({ id });
  } catch {
    notFound();
  }

  const STATIC_DATA = {
    score: data.score,
    verdict: data.verdict,
    roastTitle: data.roastTitle,
    language: data.language,
    lines: data.code.split("\n").length,
    code: data.code,
    issues: data.issues,
    diff: data.diff,
  };

  return (
    <div className="flex min-h-[calc(100vh-3.5rem)] flex-col items-center px-20 py-10">
      <div className="flex w-full max-w-4xl flex-col gap-10">
        <div className="flex items-center justify-center gap-12">
          <ScoreRing value={STATIC_DATA.score} />
          <div className="flex flex-1 flex-col gap-4">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-accent-red" />
              <span className="font-mono text-sm font-medium text-accent-red">
                verdict: {STATIC_DATA.verdict}
              </span>
            </div>
            <p className="font-mono text-xl leading-relaxed text-text-primary">
              &quot;{STATIC_DATA.roastTitle}&quot;
            </p>
            <div className="flex items-center gap-4">
              <span className="font-mono text-xs text-text-tertiary">
                lang: {STATIC_DATA.language}
              </span>
              <span className="font-mono text-xs text-text-tertiary">·</span>
              <span className="font-mono text-xs text-text-tertiary">
                {STATIC_DATA.lines} lines
              </span>
            </div>
          </div>
        </div>

        <div className="h-px w-full bg-border-primary" />

        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <span className="font-mono text-sm font-bold text-accent-green">
              {"//"}
            </span>
            <span className="font-mono text-sm font-bold text-text-primary">
              your_submission
            </span>
          </div>
          <div className="rounded-lg border border-border-primary bg-bg-input">
            <CodeBlock code={STATIC_DATA.code} lang={STATIC_DATA.language} />
          </div>
        </div>

        <div className="h-px w-full bg-border-primary" />

        <div className="flex flex-col gap-6">
          <div className="flex items-center gap-2">
            <span className="font-mono text-sm font-bold text-accent-green">
              {"//"}
            </span>
            <span className="font-mono text-sm font-bold text-text-primary">
              detailed_analysis
            </span>
          </div>
          <div className="grid grid-cols-2 gap-5">
            {STATIC_DATA.issues.map((issue, index) => (
              <AnalysisCard key={index}>
                <AnalysisCardLabel variant={issue.type}>
                  {issue.type}
                </AnalysisCardLabel>
                <AnalysisCardTitle>{issue.title}</AnalysisCardTitle>
                <AnalysisCardDescription>
                  {issue.description}
                </AnalysisCardDescription>
              </AnalysisCard>
            ))}
          </div>
        </div>

        <div className="h-px w-full bg-border-primary" />

        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <span className="font-mono text-sm font-bold text-accent-green">
              {"//"}
            </span>
            <span className="font-mono text-sm font-bold text-text-primary">
              suggested_fix
            </span>
          </div>
          <div className="rounded-lg border border-border-primary bg-bg-input">
            <div className="flex h-10 items-center border-b border-border-primary px-4">
              <span className="font-mono text-xs text-text-secondary">
                your_code.ts → improved_code.ts
              </span>
            </div>
            <div className="flex flex-col">
              {STATIC_DATA.diff.map((line, index) => (
                <DiffLine key={index} type={line.type} code={line.code} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
```

Note: The existing page.tsx is already structured well - we're just replacing the hardcoded STATIC_DATA with dynamic data from the database.

- [ ] **Step 3: Commit**

```bash
git add src/app/result/\[id\]/page.tsx
git commit -m "feat: update ResultPage to fetch from tRPC instead of mock data"
```

---

## Task 6: Error Handling & Testing

- [ ] **Step 1: Test the flow manually**

1. Start dev server: `npm run dev`
2. Go to homepage
3. Enter some code
4. Toggle roast mode
5. Click submit
6. Should redirect to /result/[id] with analysis

- [ ] **Step 2: Test error cases**

1. Test with invalid UUID - should show 404
2. Test with API error - should show error message

- [ ] **Step 3: Commit any fixes**

```bash
git add .
git commit -m "fix: handle error cases in roast creation flow"
```

---

## Final Review

- [ ] Run `npm run build` to verify everything compiles
- [ ] Run `npm run lint` to check for linting issues
- [ ] All acceptance criteria met:
  - User can submit code (up to 2000 chars) ✓
  - User can toggle roast mode on/off ✓
  - Clicking submit calls OpenAI and creates roast in DB ✓
  - User is redirected to result page showing analysis ✓
  - Result page displays: score, verdict, code, issues, suggested fix ✓
  - Roast mode produces sarcastic vs constructive output ✓
  - Errors are handled gracefully with user feedback ✓
