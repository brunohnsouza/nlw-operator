import { forwardRef, type HTMLAttributes } from "react";

import { CodePreview } from "./code-preview";

export interface LeaderboardEntryProps extends HTMLAttributes<HTMLDivElement> {
	rank: number;
	score: number;
	code: string;
	language: string;
	linesCount: number;
}

export const LeaderboardEntry = forwardRef<
	HTMLDivElement,
	LeaderboardEntryProps
>(({ rank, score, code, language, linesCount, className, ...props }, ref) => {
	const scoreColor =
		score < 5
			? "text-accent-red"
			: score < 7
				? "text-accent-amber"
				: "text-accent-green";

	return (
		<div ref={ref} className={className} {...props}>
			<div className="flex h-12 items-center justify-between border-b border-border-primary px-5">
				<div className="flex items-center gap-4">
					<span className="flex items-center gap-1.5 font-mono text-sm">
						<span className="text-text-tertiary">#</span>
						<span className="font-bold text-accent-amber">{rank}</span>
					</span>
					<span className="flex items-center gap-1.5 font-mono text-sm">
						<span className="text-text-tertiary">score:</span>
						<span className={`font-bold ${scoreColor}`}>
							{score.toFixed(1)}
						</span>
					</span>
				</div>
				<div className="flex items-center gap-3">
					<span className="font-mono text-sm text-text-secondary">
						{language}
					</span>
					<span className="font-mono text-sm text-text-tertiary">
						{linesCount} lines
					</span>
				</div>
			</div>
			<CodePreview code={code} lang={language} maxLines={3} />
		</div>
	);
});

LeaderboardEntry.displayName = "LeaderboardEntry";
