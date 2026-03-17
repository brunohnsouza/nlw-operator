import { Suspense } from "react";
import { LeaderboardPageContent } from "@/components/leaderboard-page-content";
import { LeaderboardPageSkeleton } from "@/components/ui/leaderboard-page-skeleton";

export default function LeaderboardPage() {
	return (
		<div className="flex min-h-[calc(100vh-3.5rem)] flex-col items-center px-20 py-10">
			<div className="flex w-full max-w-4xl flex-col gap-10">
				<Suspense fallback={<LeaderboardPageSkeleton />}>
					<LeaderboardPageContent />
				</Suspense>
			</div>
		</div>
	);
}
