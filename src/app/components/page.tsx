"use client";

import { useState } from "react";

import {
	AnalysisCard,
	AnalysisCardDescription,
	AnalysisCardLabel,
	AnalysisCardTitle,
} from "@/components/ui/analysis-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CodeBlockClient } from "@/components/ui/code-block-client";
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
		<div className="min-h-screen bg-bg-page flex flex-col items-center px-20 py-12">
			<div className="w-full max-w-4xl flex flex-col gap-10">
				{/* Header */}
				<div className="flex items-center gap-3">
					<span className="font-mono text-2xl font-bold text-accent-green">
						{">"}
					</span>
					<h1 className="font-mono text-2xl font-bold text-text-primary">
						component_library
					</h1>
				</div>

				{/* Typography Section */}
				<section className="flex flex-col gap-5">
					<div className="flex items-center gap-2">
						<span className="font-mono text-sm font-bold text-accent-green">
							{"//"}
						</span>
						<span className="font-mono text-sm font-bold text-text-primary">
							typography
						</span>
					</div>
					<div className="flex flex-col gap-5 pl-6">
						<p className="font-mono text-4xl font-bold text-text-primary">
							paste your code. get roasted.
						</p>
						<p className="font-mono text-sm text-text-secondary">
							description text sample
						</p>
						<p className="font-mono text-xs text-text-tertiary">
							lang: javascript · 7 lines
						</p>
						<p className="font-mono text-[13px] text-[#FFC799]">
							{`function calculateTotal()`}
						</p>
					</div>
				</section>

				{/* Buttons Section */}
				<section className="flex flex-col gap-5">
					<div className="flex items-center gap-2">
						<span className="font-mono text-sm font-bold text-accent-green">
							{"//"}
						</span>
						<span className="font-mono text-sm font-bold text-text-primary">
							buttons
						</span>
					</div>
					<div className="flex flex-wrap gap-4 pl-6">
						<Button variant="primary">$ roast_my_code</Button>
						<Button variant="secondary">$ share_roast</Button>
						<Button variant="outline">$ view_all &gt;&gt;</Button>
					</div>
				</section>

				{/* Toggle Section */}
				<section className="flex flex-col gap-5">
					<div className="flex items-center gap-2">
						<span className="font-mono text-sm font-bold text-accent-green">
							{"//"}
						</span>
						<span className="font-mono text-sm font-bold text-text-primary">
							toggle
						</span>
					</div>
					<div className="flex items-center gap-8 pl-6">
						<Toggle pressed={toggleOn} onPressedChange={setToggleOn}>
							<span
								className={
									toggleOn ? "text-accent-green" : "text-text-secondary"
								}
							>
								roast mode
							</span>
						</Toggle>
						<Toggle disabled>
							<span className="text-text-secondary">disabled</span>
						</Toggle>
					</div>
				</section>

				{/* Badge Section */}
				<section className="flex flex-col gap-5">
					<div className="flex items-center gap-2">
						<span className="font-mono text-sm font-bold text-accent-green">
							{"//"}
						</span>
						<span className="font-mono text-sm font-bold text-text-primary">
							badge_status
						</span>
					</div>
					<div className="flex flex-wrap gap-6 pl-6">
						<Badge variant="critical">critical</Badge>
						<Badge variant="warning">warning</Badge>
						<Badge variant="good">good</Badge>
						<Badge variant="verdict">needs_serious_help</Badge>
					</div>
				</section>

				{/* Cards Section */}
				<section className="flex flex-col gap-5">
					<div className="flex items-center gap-2">
						<span className="font-mono text-sm font-bold text-accent-green">
							{"//"}
						</span>
						<span className="font-mono text-sm font-bold text-text-primary">
							cards
						</span>
					</div>
					<div className="pl-6">
						<AnalysisCard>
							<AnalysisCardLabel variant="critical">critical</AnalysisCardLabel>
							<AnalysisCardTitle>
								using var instead of const/let
							</AnalysisCardTitle>
							<AnalysisCardDescription>
								the var keyword is function-scoped rather than block-scoped,
								which can lead to unexpected behavior and bugs. modern
								javascript uses const for immutable bindings and let for mutable
								ones.
							</AnalysisCardDescription>
						</AnalysisCard>
					</div>
				</section>

				{/* Code Block Section */}
				<section className="flex flex-col gap-5">
					<div className="flex items-center gap-2">
						<span className="font-mono text-sm font-bold text-accent-green">
							{"//"}
						</span>
						<span className="font-mono text-sm font-bold text-text-primary">
							code_block
						</span>
					</div>
					<div className="pl-6">
						<CodeBlockClient
							code={sampleCode}
							lang="javascript"
							filename="calculate.js"
							showHeader
						/>
					</div>
				</section>

				{/* Diff Line Section */}
				<section className="flex flex-col gap-5">
					<div className="flex items-center gap-2">
						<span className="font-mono text-sm font-bold text-accent-green">
							{"//"}
						</span>
						<span className="font-mono text-sm font-bold text-text-primary">
							diff_line
						</span>
					</div>
					<div className="pl-6 w-[560px] rounded-lg border border-border-primary bg-bg-page overflow-hidden">
						<DiffLine type="removed" code="var total = 0;" />
						<DiffLine type="added" code="const total = 0;" />
						<DiffLine
							type="context"
							code="for (let i = 0; i < items.length; i++) {"
						/>
					</div>
				</section>

				{/* Table Row Section */}
				<section className="flex flex-col gap-5">
					<div className="flex items-center gap-2">
						<span className="font-mono text-sm font-bold text-accent-green">
							{"//"}
						</span>
						<span className="font-mono text-sm font-bold text-text-primary">
							table_row
						</span>
					</div>
					<div className="pl-6 border border-border-primary bg-bg-page">
						<div className="flex items-center px-5 py-4 border-b border-border-primary">
							<span className="w-10 font-mono text-sm text-text-tertiary">
								#1
							</span>
							<span className="w-[60px] font-mono text-sm font-bold text-accent-red">
								2.1
							</span>
							<span className="flex-1 font-mono text-xs text-text-secondary truncate">
								function calculateTotal(items) {"{ var total = 0; ..."}
							</span>
							<span className="w-[100px] font-mono text-xs text-text-tertiary">
								javascript
							</span>
						</div>
					</div>
				</section>

				{/* Navbar Section */}
				<section className="flex flex-col gap-5">
					<div className="flex items-center gap-2">
						<span className="font-mono text-sm font-bold text-accent-green">
							{"//"}
						</span>
						<span className="font-mono text-sm font-bold text-text-primary">
							navbar
						</span>
					</div>
					<div className="pl-6 flex items-center h-14 px-6 bg-bg-page border-b border-border-primary">
						<span className="font-mono text-xl font-bold text-accent-green">
							{">"}
						</span>
						<span className="font-mono text-lg font-medium text-text-primary ml-2">
							devroast
						</span>
						<span className="flex-1" />
						<span className="font-mono text-sm text-text-secondary">
							leaderboard
						</span>
					</div>
				</section>

				{/* Score Ring Section */}
				<section className="flex flex-col gap-5">
					<div className="flex items-center gap-2">
						<span className="font-mono text-sm font-bold text-accent-green">
							{"//"}
						</span>
						<span className="font-mono text-sm font-bold text-text-primary">
							score_ring
						</span>
					</div>
					<div className="flex items-center gap-8 pl-6">
						<ScoreRing value={3.5} />
						<ScoreRing value={6.8} />
						<ScoreRing value={9.2} />
					</div>
				</section>
			</div>
		</div>
	);
}
