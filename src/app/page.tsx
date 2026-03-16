"use client";

import Link from "next/link";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { CodeEditor } from "@/components/ui/code-editor";
import {
	LeaderboardTableHeader,
	LeaderboardTableRoot,
	LeaderboardTableRow,
} from "@/components/ui/leaderboard-table";
import { Toggle } from "@/components/ui/toggle";

const sampleCode = `function calculateTotal(items) {
  var total = 0;
  for (var i = 0; i < items.length; i++) {
    total += items[i].price;
  }
  return total;
}

// TODO: handle tax calculation
// TODO: handle currency conversion
}`;

export default function HomePage() {
	const [code, setCode] = useState(sampleCode);
	const [roastMode, setRoastMode] = useState(true);
	const [isOverLimit, setIsOverLimit] = useState(false);
	const hasCode = code.trim().length > 0;

	return (
		<div className="flex min-h-[calc(100vh-3.5rem)] flex-col items-center px-10 py-12">
			<div className="flex w-full max-w-[960px] flex-col gap-8">
				{/* Hero Section */}
				<div className="flex flex-col gap-3 text-center">
					<h1 className="font-mono text-4xl font-bold text-text-primary">
						<span className="text-accent-green">$</span> paste your code. get
						roasted.
					</h1>
					<p className="font-mono text-sm text-text-secondary">
						{
							"// drop your code below and we'll rate it — brutally honest or full roast mode"
						}
					</p>
				</div>

				{/* Code Editor */}
				<CodeEditor
					value={code}
					onChange={setCode}
					onLimitChange={setIsOverLimit}
					className="h-[360px]"
				/>

				{/* Actions Bar */}
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-4">
						<Toggle pressed={roastMode} onPressedChange={setRoastMode}>
							<span
								className={
									roastMode ? "text-accent-green" : "text-text-tertiary"
								}
							>
								roast mode
							</span>
						</Toggle>
						<span className="font-mono text-xs text-text-tertiary">
							{roastMode
								? "// maximum sarcasm enabled"
								: "// gentle feedback mode"}
						</span>
					</div>
					<Button variant="primary" disabled={!hasCode || isOverLimit}>
						$ roast_my_code
					</Button>
				</div>

				{/* Footer Hint */}
				<div className="flex justify-center gap-6">
					<span className="font-mono text-xs text-text-tertiary">
						2,847 codes roasted
					</span>
					<span className="font-mono text-xs text-text-tertiary">·</span>
					<span className="font-mono text-xs text-text-tertiary">
						avg score: 4.2/10
					</span>
				</div>

				{/* Leaderboard Preview */}
				<div className="flex flex-col gap-4">
					<div className="flex items-center justify-between">
						<h2 className="font-mono text-sm font-bold text-text-primary">
							<span className="text-accent-green">{"//"}</span>{" "}
							shame_leaderboard
						</h2>
						<Button variant="outline" size="sm">
							$ view_all &gt;&gt;
						</Button>
					</div>
					<p className="font-mono text-xs text-text-tertiary">
						{"// the worst code on the internet, ranked by shame"}
					</p>
					<LeaderboardTableRoot>
						<LeaderboardTableHeader />
						<LeaderboardTableRow
							rank={1}
							score={2.1}
							codePreview="function calculateTotal(items) { var total = 0; for (var i = 0; i < items.length; i++) { ..."
							language="javascript"
						/>
						<LeaderboardTableRow
							rank={2}
							score={3.5}
							codePreview="const add = (a, b) => { return a + b; } // no type safety, wow"
							language="javascript"
						/>
						<LeaderboardTableRow
							rank={3}
							score={4.8}
							codePreview="if (condition) { doSomething() } else { // empty }"
							language="javascript"
						/>
					</LeaderboardTableRoot>
					<div className="flex justify-center pt-2">
						<Link
							href="/leaderboard"
							className="font-mono text-xs text-text-tertiary hover:text-text-secondary transition-colors"
						>
							showing top 3 of 2,847 · view full leaderboard &gt;&gt;
						</Link>
					</div>
				</div>
			</div>
		</div>
	);
}
