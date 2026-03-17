# OG Image Generation Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement automatic Open Graph image generation for roast shareable links using @vercel/og

**Architecture:** Dynamic OG images rendered via @vercel/og (React → PNG). No AI, no external APIs. Images generated on-the-fly with HTTP cache headers.

**Tech Stack:** Next.js 16 App Router, @vercel/og, Drizzle ORM

---

## File Structure

```
src/
├── app/
│   ├── api/
│   │   └── og/
│   │       └── [id]/
│   │           └── route.ts    # OG image API endpoint
│   └── result/
│       └── [id]/
│           └── page.tsx        # Modify: add share functionality + metadata
├── components/
│   └── og/
│       └── RoastImage.tsx      # Create: React component for OG template
└── lib/
    └── og-utils.ts             # Create: helper functions for OG generation
```

---

## Task 1: Install @vercel/og dependency

- [ ] **Step 1: Install @vercel/og**

Run: `npm install @vercel/og`

---

## Task 2: Create OG Template Component

**Files:**
- Create: `src/components/og/RoastImage.tsx`

- [ ] **Step 1: Create RoastImage component**

```tsx
import { ImageResponse } from "next/og";

export const runtime = "edge";

export const alt = "DevRoast - Code Review";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

interface RoastImageProps {
  score: number;
  verdict: string;
  language: string;
  linesCount: number;
  roastTitle: string;
}

export default function RoastImage({
  score,
  verdict,
  language,
  linesCount,
  roastTitle,
}: RoastImageProps) {
  return new ImageResponse(
    (
      <div
        style={{
          backgroundColor: "#0C0C0C",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: 64,
        }}
      >
        {/* Logo Row */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            marginBottom: 28,
          }}
        >
          <span
            style={{
              color: "#10B981",
              fontSize: 24,
              fontWeight: 700,
              fontFamily: "JetBrains Mono",
            }}
          >
            &gt;
          </span>
          <span
            style={{
              color: "#FAFAFA",
              fontSize: 20,
              fontWeight: 500,
              fontFamily: "JetBrains Mono",
            }}
          >
            devroast
          </span>
        </div>

        {/* Score Row */}
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            gap: 4,
            marginBottom: 28,
          }}
        >
          <span
            style={{
              color: "#F59E0B",
              fontSize: 160,
              fontWeight: 900,
              lineHeight: 1,
              fontFamily: "JetBrains Mono",
            }}
          >
            {score.toFixed(1)}
          </span>
          <span
            style={{
              color: "#737373",
              fontSize: 56,
              fontWeight: 400,
              lineHeight: 1,
              fontFamily: "JetBrains Mono",
            }}
          >
            /10
          </span>
        </div>

        {/* Verdict Row */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            marginBottom: 28,
          }}
        >
          <div
            style={{
              width: 12,
              height: 12,
              borderRadius: "50%",
              backgroundColor: "#EF4444",
            }}
          />
          <span
            style={{
              color: "#EF4444",
              fontSize: 20,
              fontWeight: 400,
              fontFamily: "JetBrains Mono",
            }}
          >
            {verdict}
          </span>
        </div>

        {/* Info */}
        <div
          style={{
            color: "#737373",
            fontSize: 16,
            fontWeight: 400,
            fontFamily: "JetBrains Mono",
            marginBottom: 28,
          }}
        >
          lang: {language} · {linesCount} lines
        </div>

        {/* Quote */}
        <div
          style={{
            color: "#FAFAFA",
            fontSize: 22,
            fontWeight: 400,
            fontFamily: "IBM Plex Mono",
            textAlign: "center",
            maxWidth: "100%",
            lineHeight: 1.5,
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          "{roastTitle}"
        </div>
      </div>
    ),
    { ...size }
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/og/RoastImage.tsx
git commit -m "feat: add RoastImage OG template component"
```

---

## Task 3: Create OG API Route

**Files:**
- Create: `src/app/api/og/[id]/route.ts`

- [ ] **Step 1: Create OG API route**

```typescript
import { NextResponse } from "next/server";
import { caller } from "@/trpc/server";
import RoastImage from "@/components/og/RoastImage";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const roast = await caller.roasts.getById({ id });

    if (!roast) {
      return new NextResponse("Roast not found", { status: 404 });
    }

    const { score, verdict, language, roastTitle, code } = roast;
    const linesCount = code.split("\n").length;

    const image = await RoastImage({
      score,
      verdict: verdict || "unknown",
      language: language || "unknown",
      linesCount,
      roastTitle: roastTitle || "No title",
    });

    return new NextResponse(image.body, {
      headers: {
        "Content-Type": "image/png",
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch (error) {
    console.error("Error generating OG image:", error);
    return new NextResponse("Error generating image", { status: 500 });
  }
}
```

- [ ] **Step 2: Commit**

```bash
git add src/app/api/og/\[id\]/route.ts
git commit -m "feat: add OG image API endpoint"
```

---

## Task 4: Update Result Page with Share Functionality

**Files:**
- Modify: `src/app/result/[id]/page.tsx`
- Create: `src/components/ShareButton.tsx`

- [ ] **Step 1: Create ShareButton client component**

Create `src/components/ShareButton.tsx`:

```tsx
"use client";

import { useState } from "react";

interface ShareButtonProps {
  roastId: string;
}

export function ShareButton({ roastId }: ShareButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    const url = `${window.location.origin}/result/${roastId}`;
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      type="button"
      onClick={handleShare}
      className="rounded border border-border-primary px-4 py-2 font-mono text-xs text-text-primary transition-colors hover:bg-bg-surface"
    >
      {copied ? "$ copied!" : "$ share_roast"}
    </button>
  );
}
```

- [ ] **Step 2: Update ResultPage with metadata and ShareButton**

Update `src/app/result/[id]/page.tsx`:

Add import:
```typescript
import { ShareButton } from "@/components/ShareButton";
import { generateMetadata } from "next";
```

Add metadata generation (export at top level, after imports):
```typescript
export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  
  const roast = await caller.roasts.getById({ id }).catch(() => null);
  
  if (!roast) {
    return { title: "Roast Not Found" };
  }

  const ogImageUrl = `${process.env.NEXT_PUBLIC_BASE_URL || ""}/api/og/${id}`;

  return {
    title: `DevRoast - ${roast.roastTitle}`,
    description: `Score: ${roast.score}/10 - ${roast.verdict}`,
    openGraph: {
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: roast.roastTitle,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      images: [ogImageUrl],
    },
  };
}
```

Replace the share button JSX with the ShareButton component:
```tsx
<ShareButton roastId={roast.id} />
```

- [ ] **Step 3: Commit**

```bash
git add src/app/result/\[id\]/page.tsx src/components/ShareButton.tsx
git commit -m "feat: add share functionality and OG metadata to result page"
```

---

## Task 5: Run Lint and Verify

- [ ] **Step 1: Run lint**

Run: `npm run lint`

- [ ] **Step 2: Run build**

Run: `npm run build`

- [ ] **Step 3: Commit**

```bash
git add .
git commit -m "feat: implement OG image generation for roast sharing"
```

---

## Verification

1. Visit `/result/[id]` for a roast
2. Click "$ share_roast" button
3. Verify URL is copied to clipboard
4. Visit the copied URL (should be `/api/og/[id]`)
5. Verify OG image is generated with correct data
6. Test sharing on social media (should show OG image)

---

## Edge Cases to Test

- Roast not found (404)
- Missing data (score, verdict, language)
- Very long roast title (truncation)
- Different scores (0-10)
