# Leaderboard Page Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement the full leaderboard page displaying 20 worst code submissions with collapsible preview and syntax highlighting.

**Architecture:** Server Component fetches data via tRPC caller, renders header with metrics, lists entries using reusable components (CodePreview, CodeBlockClient). Loading state uses Suspense with skeleton.

**Tech Stack:** Next.js 16 (App Router), tRPC, @base-ui/react Collapsible, Shiki (syntax highlighting)

---

## File Structure

- **Create:** `src/components/leaderboard-page-content.tsx` - Server Component fetching data
- **Create:** `src/components/ui/leaderboard-page-skeleton.tsx` - Loading skeleton
- **Modify:** `src/components/ui/leaderboard-entry.tsx` - Use CodePreview for collapsible
- **Modify:** `src/app/leaderboard/page.tsx` - Add Suspense + Server Component

---

### Task 1: Modify LeaderboardEntry to use CodePreview (Collapsible)

**Files:**
- Modify: `src/components/ui/leaderboard-entry.tsx`

- [ ] **Step 1: Read current LeaderboardEntry component**

```bash
cat src/components/ui/leaderboard-entry.tsx
```

- [ ] **Step 2: Replace CodeBlock import with CodePreview**

```typescript
import { CodePreview } from "./code-preview";
```

- [ ] **Step 3: Replace CodeBlock usage with CodePreview**

```typescript
// Replace this line:
<CodeBlock code={code} lang={language} showLineNumbers />

// With this:
<CodePreview code={code} lang={language} maxLines={3} />
```

- [ ] **Step 4: Run lint to verify**

```bash
npm run lint
```

- [ ] **Step 5: Commit**

```bash
git add src/components/ui/leaderboard-entry.tsx
git commit -m "feat: use CodePreview in LeaderboardEntry for collapsible"
```

---

### Task 2: Create LeaderboardPageSkeleton

**Files:**
- Create: `src/components/ui/leaderboard-page-skeleton.tsx`

- [ ] **Step 1: Create skeleton component**

```typescript
"use client";

export function LeaderboardPageSkeleton() {
	return (
		<div className="flex flex-col gap-10 animate-pulse">
			{/* Header Skeleton */}
			<div className="flex flex-col gap-4">
				<div className="flex flex-col gap-2">
					<div className="h-8 w-64 rounded bg-bg-surface" />
					<div className="h-5 w-96 rounded bg-bg-surface" />
				</div>
				<div className="flex gap-2">
					<div className="h-4 w-32 rounded bg-bg-surface" />
					<div className="h-4 w-4 rounded bg-bg-surface" />
					<div className="h-4 w-24 rounded bg-bg-surface" />
				</div>
			</div>

			{/* Entries Skeleton - 20 entries */}
			<div className="flex flex-col gap-5">
				{Array.from({ length: 20 }).map((_, i) => (
					<div
						key={i}
						className="flex flex-col rounded-lg border border-border-primary bg-bg-page"
					>
						{/* Entry Header */}
						<div className="flex h-12 items-center justify-between border-b border-border-primary px-5">
							<div className="flex items-center gap-4">
								<div className="h-4 w-8 rounded bg-bg-surface" />
								<div className="h-4 w-12 rounded bg-bg-surface" />
							</div>
							<div className="flex items-center gap-3">
								<div className="h-4 w-20 rounded bg-bg-surface" />
								<div className="h-4 w-12 rounded bg-bg-surface" />
							</div>
						</div>
						{/* Code Preview */}
						<div className="h-20 bg-bg-input" />
					</div>
				))}
			</div>
		</div>
	);
}
```

- [ ] **Step 2: Write to file**

```bash
cat > src/components/ui/leaderboard-page-skeleton.tsx << 'EOF'
"use client";

export function LeaderboardPageSkeleton() {
	return (
		<div className="flex flex-col gap-10 animate-pulse">
			{/* Header Skeleton */}
			<div className="flex flex-col gap-4">
				<div className="flex flex-col gap-2">
					<div className="h-8 w-64 rounded bg-bg-surface" />
					<div className="h-5 w-96 rounded bg-bg-surface" />
				</div>
				<div className="flex gap-2">
					<div className="h-4 w-32 rounded bg-bg-surface" />
					<div className="h-4 w-4 rounded bg-bg-surface" />
					<div className="h-4 w-24 rounded bg-bg-surface" />
				</div>
			</div>

			{/* Entries Skeleton - 20 entries */}
			<div className="flex flex-col gap-5">
				{Array.from({ length: 20 }).map((_, i) => (
					<div
						key={i}
						className="flex flex-col rounded-lg border border-border-primary bg-bg-page"
					>
						{/* Entry Header */}
						<div className="flex h-12 items-center justify-between border-b border-border-primary px-5">
							<div className="flex items-center gap-4">
								<div className="h-4 w-8 rounded bg-bg-surface" />
								<div className="h-4 w-12 rounded bg-bg-surface" />
							</div>
							<div className="flex items-center gap-3">
								<div className="h-4 w-20 rounded bg-bg-surface" />
								<div className="h-4 w-12 rounded bg-bg-surface" />
							</div>
						</div>
						{/* Code Preview */}
						<div className="h-20 bg-bg-input" />
					</div>
				))}
			</div>
		</div>
	);
}
EOF
```

- [ ] **Step 3: Commit**

```bash
git add src/components/ui/leaderboard-page-skeleton.tsx
git commit -m "feat: add LeaderboardPageSkeleton loading component"
```

---

### Task 3: Create LeaderboardPageContent Server Component

**Files:**
- Create: `src/components/leaderboard-page-content.tsx`

- [ ] **Step 1: Create Server Component**

```typescript
import { caller } from "@/trpc/server";
import { LeaderboardEntry } from "@/components/ui/leaderboard-entry";

export async function LeaderboardPageContent() {
	const data = await caller.leaderboard.getLeaderboard();

	return (
		<div className="flex flex-col gap-10">
			{/* Header */}
			<div className="flex flex-col gap-4">
				<div className="flex items-center gap-3">
					<span className="font-mono text-[32px] font-bold text-accent-green">
						{">"}
					</span>
					<h1 className="font-mono text-[28px] font-bold text-text-primary">
						shame_leaderboard
					</h1>
				</div>
				<p className="font-mono text-sm text-text-secondary">
					{"// the most roasted code on the internet"}
				</p>
				<div className="flex items-center gap-2">
					<span className="font-mono text-xs text-text-tertiary">
						{data.totalSubmissions.toLocaleString()} submissions
					</span>
					<span className="font-mono text-xs text-text-tertiary">·</span>
					<span className="font-mono text-xs text-text-tertiary">
						avg score: {data.avgScore.toFixed(1)}/10
					</span>
				</div>
			</div>

			{/* Entries */}
			<div className="flex flex-col gap-5">
				{data.entries.map((entry) => (
					<div
						key={entry.id}
						className="rounded-lg border border-border-primary bg-bg-page"
					>
						<LeaderboardEntry
							rank={entry.rank}
							score={Number(entry.score)}
							language={entry.language}
							linesCount={entry.linesCount}
							code={entry.code}
						/>
					</div>
				))}
			</div>
		</div>
	);
}
```

- [ ] **Step 2: Write to file**

```bash
cat > src/components/leaderboard-page-content.tsx << 'EOF'
import { caller } from "@/trpc/server";
import { LeaderboardEntry } from "@/components/ui/leaderboard-entry";

export async function LeaderboardPageContent() {
	const data = await caller.leaderboard.getLeaderboard();

	return (
		<div className="flex flex-col gap-10">
			{/* Header */}
			<div className="flex flex-col gap-4">
				<div className="flex items-center gap-3">
					<span className="font-mono text-[32px] font-bold text-accent-green">
						{">"}
					</span>
					<h1 className="font-mono text-[28px] font-bold text-text-primary">
						shame_leaderboard
					</h1>
				</div>
				<p className="font-mono text-sm text-text-secondary">
					{"// the most roasted code on the internet"}
				</p>
				<div className="flex items-center gap-2">
					<span className="font-mono text-xs text-text-tertiary">
						{data.totalSubmissions.toLocaleString()} submissions
					</span>
					<span className="font-mono text-xs text-text-tertiary">·</span>
					<span className="font-mono text-xs text-text-tertiary">
						avg score: {data.avgScore.toFixed(1)}/10
					</span>
				</div>
			</div>

			{/* Entries */}
			<div className="flex flex-col gap-5">
				{data.entries.map((entry) => (
					<div
						key={entry.id}
						className="rounded-lg border border-border-primary bg-bg-page"
					>
						<LeaderboardEntry
							rank={entry.rank}
							score={Number(entry.score)}
							language={entry.language}
							linesCount={entry.linesCount}
							code={entry.code}
						/>
					</div>
				))}
			</div>
		</div>
	);
}
EOF
```

- [ ] **Step 3: Commit**

```bash
git add src/components/leaderboard-page-content.tsx
git commit -m "feat: add LeaderboardPageContent Server Component"
```

---

### Task 4: Update Leaderboard Page

**Files:**
- Modify: `src/app/leaderboard/page.tsx`

- [ ] **Step 1: Read current page**

```bash
cat src/app/leaderboard/page.tsx
```

- [ ] **Step 2: Replace page content**

```typescript
import { Suspense } from "react";
import { LeaderboardPageContent } from "@/components/leaderboard-page-content";
import { LeaderboardPageSkeleton } from "@/components/ui/leaderboard-page-skeleton";

export default function LeaderboardPage() {
	return (
		<div className="flex min-h-[calc(100vh-3.5rem)] flex-col items-center px-20 py-10">
			<div className="flex w-full max-w-4xl flex-col gap-10">
				<Suspense fallback={<LeaderboardPageSkeleton />}>
					<LeaderboardPageContent />
				</Suspense>
			</div>
		</div>
	);
}
```

- [ ] **Step 3: Write to file**

```bash
cat > src/app/leaderboard/page.tsx << 'EOF'
import { Suspense } from "react";
import { LeaderboardPageContent } from "@/components/leaderboard-page-content";
import { LeaderboardPageSkeleton } from "@/components/ui/leaderboard-page-skeleton";

export default function LeaderboardPage() {
	return (
		<div className="flex min-h-[calc(100vh-3.5rem)] flex-col items-center px-20 py-10">
			<div className="flex w-full max-w-4xl flex-col gap-10">
				<Suspense fallback={<LeaderboardPageSkeleton />}>
					<LeaderboardPageContent />
				</Suspense>
			</div>
		</div>
	);
}
EOF
```

- [ ] **Step 4: Run build to verify**

```bash
npm run build
```

- [ ] **Step 5: Commit**

```bash
git add src/app/leaderboard/page.tsx
git commit -m "feat: update leaderboard page with tRPC integration"
```

---

## Summary

This plan creates:
1. Modified `LeaderboardEntry` to use `CodePreview` (collapsible)
2. New `LeaderboardPageSkeleton` component for loading state
3. New `LeaderboardPageContent` Server Component for data fetching
4. Updated `leaderboard/page.tsx` with Suspense wrapper

All components reuse existing patterns from the homepage implementation.
