import { cacheLife } from "next/cache";
import { LeaderboardEntry } from "@/components/ui/leaderboard-entry";
import { caller } from "@/trpc/server";

export async function LeaderboardPageContent() {
	"use cache";
	cacheLife("hours");

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
						className="border border-border-primary bg-bg-page"
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
