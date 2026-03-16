"use client";

import { useState } from "react";

import {
	AnalysisCard,
	AnalysisCardDescription,
	AnalysisCardLabel,
	AnalysisCardTitle,
} from "@/components/ui/analysis-card";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { CodeBlock } from "@/components/ui/code-block";
import { DiffLine } from "@/components/ui/diff-line";
import { ScoreRing } from "@/components/ui/score-ring";
import { Toggle } from "@/components/ui/toggle";

const sampleCode = `function calculateTotal(items) {
  var total = 0;
  for (var i = 0; i < items.length; i++) {
    total += items[i].price;
  }
  return total;
}`;

export default function ComponentsPage() {
	const [toggleOn, setToggleOn] = useState(false);

	return (
		<div className="min-h-screen bg-bg-page p-8">
			<h1 className="mb-8 text-3xl font-bold text-text-primary">Components</h1>

			<section className="mb-8">
				<h2 className="mb-4 text-xl font-semibold text-text-secondary">
					Button
				</h2>
				<div className="mb-4 flex flex-wrap gap-4">
					<Button variant="primary">Primary</Button>
					<Button variant="secondary">Secondary</Button>
					<Button variant="outline">Outline</Button>
					<Button variant="ghost">Ghost</Button>
					<Button variant="danger">Danger</Button>
				</div>
				<div className="mb-4 flex items-center gap-4">
					<Button size="sm">Small</Button>
					<Button size="md">Medium</Button>
					<Button size="lg">Large</Button>
				</div>
				<div className="flex flex-wrap gap-4">
					<Button>Default</Button>
					<Button disabled>Disabled</Button>
					<button
						type="button"
						className={buttonVariants({ variant: "primary" })}
					>
						Via TV
					</button>
				</div>
			</section>

			<section className="mb-8">
				<h2 className="mb-4 text-xl font-semibold text-text-secondary">
					Toggle
				</h2>
				<div className="flex items-center gap-8">
					<Toggle pressed={toggleOn} onPressedChange={setToggleOn}>
						<span
							className={toggleOn ? "text-accent-green" : "text-text-tertiary"}
						>
							roast mode
						</span>
					</Toggle>
					<Toggle disabled>
						<span className="text-text-tertiary">disabled</span>
					</Toggle>
				</div>
			</section>

			<section className="mb-8">
				<h2 className="mb-4 text-xl font-semibold text-text-secondary">
					Badge
				</h2>
				<div className="flex flex-wrap gap-4">
					<Badge variant="critical">critical</Badge>
					<Badge variant="warning">warning</Badge>
					<Badge variant="good">good</Badge>
					<Badge variant="verdict">needs_serious_help</Badge>
				</div>
			</section>

			<section className="mb-8">
				<h2 className="mb-4 text-xl font-semibold text-text-secondary">
					AnalysisCard
				</h2>
				<AnalysisCard>
					<AnalysisCardLabel variant="critical">critical</AnalysisCardLabel>
					<AnalysisCardTitle>using var instead of const/let</AnalysisCardTitle>
					<AnalysisCardDescription>
						the var keyword is function-scoped rather than block-scoped, which
						can lead to unexpected behavior and bugs. modern javascript uses
						const for immutable bindings and let for mutable ones.
					</AnalysisCardDescription>
				</AnalysisCard>
			</section>

			<section className="mb-8">
				<h2 className="mb-4 text-xl font-semibold text-text-secondary">
					CodeBlock
				</h2>
				<CodeBlock
					code={sampleCode}
					lang="javascript"
					filename="calculate.js"
					showHeader
				/>
			</section>

			<section className="mb-8">
				<h2 className="mb-4 text-xl font-semibold text-text-secondary">
					DiffLine
				</h2>
				<div className="w-[560px] rounded-lg border border-border-primary bg-bg-page">
					<DiffLine type="removed" code="var total = 0;" />
					<DiffLine type="added" code="const total = 0;" />
					<DiffLine
						type="context"
						code="for (let i = 0; i < items.length; i++) {"
					/>
				</div>
			</section>

			<section className="mb-8">
				<h2 className="mb-4 text-xl font-semibold text-text-secondary">
					ScoreRing
				</h2>
				<div className="flex items-center gap-8">
					<ScoreRing value={3.5} />
					<ScoreRing value={6.8} />
					<ScoreRing value={9.2} />
				</div>
			</section>
		</div>
	);
}
