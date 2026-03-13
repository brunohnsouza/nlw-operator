import {
	LeaderboardTableHeader,
	LeaderboardTableRoot,
	LeaderboardTableRow,
} from "@/components/ui/leaderboard-table";

export default function LeaderboardPage() {
	return (
		<div className="flex min-h-[calc(100vh-3.5rem)] flex-col items-center px-10 py-12">
			<div className="flex w-full max-w-[960px] flex-col gap-8">
				<div className="flex flex-col gap-3">
					<h1 className="font-mono text-4xl font-bold text-text-primary">
						<span className="text-accent-green">{"//"}</span> shame_leaderboard
					</h1>
					<p className="font-mono text-sm text-text-secondary">
						{"// the worst code on the internet, ranked by shame"}
					</p>
				</div>

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
			</div>
		</div>
	);
}
