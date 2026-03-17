import Link from "next/link";
import { LeaderboardEntry } from "@/components/ui/leaderboard-entry";
import { caller } from "@/trpc/server";

interface LeaderboardPageContentProps {
	searchParams: Promise<{ page?: string }>;
}

export async function LeaderboardPageContent({
	searchParams,
}: LeaderboardPageContentProps) {
	const params = await searchParams;
	const page = Number(params.page) || 1;

	const data = await caller.leaderboard.getLeaderboard({ page });

	const hasNextPage = page < data.totalPages;
	const hasPrevPage = page > 1;

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

			{/* Pagination */}
			{(hasPrevPage || hasNextPage) && (
				<div className="flex items-center justify-center gap-4">
					{hasPrevPage && (
						<Link
							href={`/leaderboard?page=${page - 1}`}
							className="font-mono text-sm text-text-secondary hover:text-text-primary transition-colors"
						>
							{"<"} prev
						</Link>
					)}
					<span className="font-mono text-xs text-text-tertiary">
						page {data.page} of {data.totalPages}
					</span>
					{hasNextPage && (
						<Link
							href={`/leaderboard?page=${page + 1}`}
							className="font-mono text-sm text-text-secondary hover:text-text-primary transition-colors"
						>
							next {">"}
						</Link>
					)}
				</div>
			)}
		</div>
	);
}
