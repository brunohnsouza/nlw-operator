import { cacheLife } from "next/cache";
import Link from "next/link";

import {
	LeaderboardTableHeader,
	LeaderboardTableRoot,
	LeaderboardTableRow,
} from "@/components/ui/leaderboard-table";
import { caller } from "@/trpc/server";

export const LeaderboardSkeleton = () => {
	return (
		<div className="flex flex-col gap-4 animate-pulse">
			<div className="flex flex-col gap-1">
				<div className="h-7 w-48 rounded bg-bg-surface" />
				<div className="h-4 w-72 rounded bg-bg-surface" />
			</div>
			<LeaderboardTableRoot>
				<LeaderboardTableHeader />
				<div className="flex flex-col">
					{[1, 2, 3].map((i) => (
						<div
							key={i}
							className="flex items-center border-b border-border-primary px-5 py-4 last:border-b-0"
						>
							<div className="w-[50px] h-4 rounded bg-bg-surface" />
							<div className="w-[70px] h-4 ml-2 rounded bg-bg-surface" />
							<div className="flex-1 h-4 ml-4 rounded bg-bg-surface" />
							<div className="w-[100px] h-4 ml-4 rounded bg-bg-surface" />
						</div>
					))}
				</div>
			</LeaderboardTableRoot>
			<div className="flex justify-center pt-2">
				<div className="h-3 w-48 rounded bg-bg-surface" />
			</div>
		</div>
	);
};

export async function LeaderboardSection() {
	"use cache";
	cacheLife("hours");

	const data = await caller.leaderboard.getTop3();

	const hasEntries = data.entries.length > 0;

	return (
		<div className="flex flex-col gap-4">
			<div className="flex items-center justify-between">
				<h2 className="font-mono text-sm font-bold text-text-primary">
					<span className="text-accent-green">{"//"}</span> shame_leaderboard
				</h2>
			</div>
			<p className="font-mono text-xs text-text-tertiary">
				{"// the worst code on the internet, ranked by shame"}
			</p>
			<LeaderboardTableRoot>
				<LeaderboardTableHeader />
				{hasEntries ? (
					data.entries.map((entry) => (
						<LeaderboardTableRow
							key={entry.id}
							rank={entry.rank}
							score={Number(entry.score)}
							code={entry.code}
							language={entry.language}
						/>
					))
				) : (
					<div className="flex flex-col items-center justify-center py-12">
						<p className="font-mono text-sm text-text-tertiary">
							{"// ainda não há registros dos piores códigos"}
						</p>
						<p className="font-mono text-xs text-text-secondary mt-1">
							seja o primeiro a submitir!
						</p>
					</div>
				)}
			</LeaderboardTableRoot>
			{hasEntries && (
				<div className="flex justify-center pt-2">
					<span className="font-mono text-xs text-text-tertiary">
						{`showing top 3 of ${data.totalSubmissions.toLocaleString()} · `}
						<Link
							href="/leaderboard"
							className="text-text-secondary hover:text-text-primary transition-colors"
						>
							view full leaderboard &gt;&gt;
						</Link>
					</span>
				</div>
			)}
		</div>
	);
}
