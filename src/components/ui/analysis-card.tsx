import { tv } from "tailwind-variants";

import { cn } from "@/lib/utils";

const analysisCardVariants = tv({
	base: "w-[480px] rounded-lg border border-border-primary bg-bg-page p-5 flex flex-col gap-3",
});

export type AnalysisCardProps = {
	className?: string;
	children: React.ReactNode;
};

export function AnalysisCard({ className, children }: AnalysisCardProps) {
	return <div className={analysisCardVariants({ className })}>{children}</div>;
}

export function AnalysisCardHeader({ className, children }: AnalysisCardProps) {
	return (
		<div className={cn("flex items-center gap-2 font-mono text-xs", className)}>
			{children}
		</div>
	);
}

export function AnalysisCardTitle({ className, children }: AnalysisCardProps) {
	return (
		<span className={cn("font-mono text-sm text-text-primary", className)}>
			{children}
		</span>
	);
}

export function AnalysisCardDescription({
	className,
	children,
}: AnalysisCardProps) {
	return (
		<p
			className={cn(
				"font-mono text-xs leading-relaxed text-text-secondary",
				className,
			)}
		>
			{children}
		</p>
	);
}

export function AnalysisCardLabel({
	className,
	children,
	variant = "critical",
}: AnalysisCardProps & { variant?: "critical" | "warning" | "good" }) {
	const colorClass =
		variant === "critical"
			? "accent-red"
			: variant === "warning"
				? "accent-amber"
				: "accent-green";

	return (
		<div className={cn("flex items-center gap-2", className)}>
			<span className={cn("h-2 w-2 rounded-full", `bg-${colorClass}`)} />
			<span className={cn("font-mono text-xs", `text-${colorClass}`)}>
				{children}
			</span>
		</div>
	);
}
