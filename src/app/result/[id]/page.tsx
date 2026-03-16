import {
	AnalysisCard,
	AnalysisCardDescription,
	AnalysisCardLabel,
	AnalysisCardTitle,
} from "@/components/ui/analysis-card";
import { CodeBlock } from "@/components/ui/code-block";
import { DiffLine } from "@/components/ui/diff-line";
import { ScoreRing } from "@/components/ui/score-ring";

export default function ResultPage() {
	const STATIC_DATA = {
		score: 3.5,
		verdict: "needs_serious_help",
		roastTitle:
			"this code looks like it was written during a power outage... in 2005.",
		language: "javascript",
		lines: 16,
		code: `function calculateTotal(items) {
  var total = 0;
  for (var i = 0; i < items.length; i++) {
    total = total + items[i].price;
  }
  return total;
}

function calculateTax(subtotal) {
  return subtotal * 1.1;
}

function calculateCurrency(amount, currency) {
  // TODO: handle currency conversion
  return amount;
}`,
		issues: [
			{
				type: "critical" as const,
				title: "using var instead of const/let",
				description:
					"var is function-scoped and leads to hoisting bugs. use const by default, let when reassignment is needed.",
			},
			{
				type: "critical" as const,
				title: "imperative loop pattern",
				description:
					"for loops are verbose and error-prone. use .reduce() or .map() for cleaner, functional transformations.",
			},
			{
				type: "good" as const,
				title: "clear naming conventions",
				description:
					"calculateTotal and items are descriptive, self-documenting names that communicate intent without comments.",
			},
			{
				type: "good" as const,
				title: "single responsibility",
				description:
					"the function does one thing well — calculates a total. no side effects, no mixed concerns, no hidden complexity.",
			},
		],
		diff: [
			{ type: "context" as const, code: "function calculateTotal(items) {" },
			{ type: "removed" as const, code: "  var total = 0;" },
			{
				type: "removed" as const,
				code: "  for (var i = 0; i < items.length; i++) {",
			},
			{ type: "removed" as const, code: "    total = total + items[i].price;" },
			{ type: "removed" as const, code: "  }" },
			{ type: "removed" as const, code: "  return total;" },
			{
				type: "added" as const,
				code: "  return items.reduce((sum, item) => sum + item.price, 0);",
			},
			{ type: "context" as const, code: "}" },
		],
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
						<div className="flex items-center gap-3">
							<button
								type="button"
								className="rounded border border-border-primary px-4 py-2 font-mono text-xs text-text-primary transition-colors hover:bg-bg-surface"
							>
								$ share_roast
							</button>
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
