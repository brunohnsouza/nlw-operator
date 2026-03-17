import { notFound } from "next/navigation";
import { ShareButton } from "@/components/ShareButton";
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

	const ogImageUrl = `/api/og/${id}`;

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

export default async function ResultPage({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	const { id } = await params;

	const roast = await caller.roasts.getById({ id }).catch(() => {
		notFound();
		return null;
	});

	if (!roast) {
		notFound();
	}

	const linesCount = roast.code.split("\n").length;

	return (
		<div className="flex min-h-[calc(100vh-3.5rem)] flex-col items-center px-20 py-10">
			<div className="flex w-full max-w-4xl flex-col gap-10">
				<div className="flex items-center justify-center gap-12">
					<ScoreRing value={roast.score} />
					<div className="flex flex-1 flex-col gap-4">
						<div className="flex items-center gap-2">
							<span className="h-2 w-2 rounded-full bg-accent-red" />
							<span className="font-mono text-sm font-medium text-accent-red">
								verdict: {roast.verdict}
							</span>
						</div>
						<p className="font-mono text-xl leading-relaxed text-text-primary">
							&quot;{roast.roastTitle}&quot;
						</p>
						<div className="flex items-center gap-4">
							<span className="font-mono text-xs text-text-tertiary">
								lang: {roast.language}
							</span>
							<span className="font-mono text-xs text-text-tertiary">·</span>
							<span className="font-mono text-xs text-text-tertiary">
								{linesCount} lines
							</span>
						</div>
						<div className="flex items-center gap-3">
							<ShareButton roastId={roast.id} />
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
					<CodeBlock code={roast.code} lang={roast.language} />
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
						{roast.issues.map((issue, index) => (
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
					<div className="border border-border-primary bg-bg-input">
						<div className="flex h-10 items-center border-b border-border-primary px-4">
							<span className="font-mono text-xs text-text-secondary">
								your_code.ts → improved_code.ts
							</span>
						</div>
						<div className="flex flex-col">
							{roast.diff.map((line, index) => (
								<DiffLine key={index} type={line.type} code={line.code} />
							))}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
