"use client";

export function LeaderboardPageSkeleton() {
	return (
		<div className="flex flex-col gap-10">
			{/* Header - Static (no skeleton) */}
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
				<div className="flex gap-2 animate-pulse">
					<div className="h-4 w-32 rounded bg-bg-surface" />
					<div className="h-4 w-4 rounded bg-bg-surface" />
					<div className="h-4 w-24 rounded bg-bg-surface" />
				</div>
			</div>

			{/* Entries Skeleton - 20 entries */}
			<div className="flex flex-col gap-5 animate-pulse">
				{Array.from({ length: 20 }).map((_, i) => (
					<div
						key={i}
						className="flex flex-col border border-border-primary bg-bg-page"
					>
						{/* Entry Header */}
						<div className="flex h-12 items-center justify-between border-b border-border-primary px-5">
							<div className="flex items-center gap-4">
								<div className="h-4 w-8 rounded bg-bg-surface" />
								<div className="h-4 w-12 rounded bg-bg-surface" />
							</div>
							<div className="flex items-center gap-3">
								<div className="h-4 w-20 rounded bg-bg-surface" />
								<div className="h-4 w-12 rounded bg-bg-surface" />
							</div>
						</div>
						{/* Code Preview */}
						<div className="h-20 bg-bg-input" />
					</div>
				))}
			</div>
		</div>
	);
}
