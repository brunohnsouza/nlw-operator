import { cn } from "@/lib/utils";
import { CodePreview } from "./code-preview";

export interface LeaderboardTableRootProps {
	className?: string;
	children: React.ReactNode;
}

export function LeaderboardTableRoot({
	className,
	children,
}: LeaderboardTableRootProps) {
	return (
		<div className={cn("border border-border-primary bg-bg-page", className)}>
			{children}
		</div>
	);
}

export interface LeaderboardTableHeaderProps {
	className?: string;
}

export function LeaderboardTableHeader({
	className,
}: LeaderboardTableHeaderProps) {
	return (
		<div
			className={cn(
				"flex h-10 items-center border-b border-border-primary bg-bg-surface px-5",
				className,
			)}
		>
			<span className="w-[50px] font-mono text-xs font-medium text-text-tertiary">
				#
			</span>
			<span className="w-[70px] font-mono text-xs font-medium text-text-tertiary">
				score
			</span>
			<span className="flex-1 font-mono text-xs font-medium text-text-tertiary">
				code
			</span>
			<span className="w-[100px] font-mono text-xs font-medium text-text-tertiary">
				lang
			</span>
		</div>
	);
}

export interface LeaderboardTableRowProps {
	rank: number;
	score: number;
	code: string;
	language: string;
	className?: string;
}

export function LeaderboardTableRow({
	rank,
	score,
	code,
	language,
	className,
}: LeaderboardTableRowProps) {
	const scoreColor =
		score < 5
			? "text-accent-red"
			: score < 7
				? "text-accent-amber"
				: "text-accent-green";

	return (
		<div
			className={cn(
				"flex items-start border-b border-border-primary px-5 py-4 last:border-b-0",
				className,
			)}
		>
			<span className="w-[50px] pt-1 font-mono text-sm text-text-tertiary">
				{rank}
			</span>
			<span
				className={cn("w-[70px] pt-1 font-mono text-sm font-bold", scoreColor)}
			>
				{score.toFixed(1)}
			</span>
			<span className="flex-1 truncate font-mono text-xs text-text-secondary">
				<CodePreview code={code} lang={language} maxLines={3} />
			</span>
			<span className="w-[100px] pl-4 pt-1 font-mono text-xs text-text-tertiary">
				{language}
			</span>
		</div>
	);
}
