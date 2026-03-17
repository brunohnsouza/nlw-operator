import { forwardRef } from "react";

import { tv, type VariantProps } from "tailwind-variants";

export const shareCardVariants = tv({
	base: "flex flex-col items-center justify-center bg-bg-page border border-border-primary",
	variants: {
		size: {
			sm: "w-[300px] h-[158px] p-4 gap-4",
			md: "w-[600px] h-[315px] p-8 gap-7",
		},
	},
	defaultVariants: {
		size: "md",
	},
});

type ShareCardProps = VariantProps<typeof shareCardVariants> & {
	score: number;
	verdict: string | null;
	language: string;
	linesCount: number;
	roastTitle: string | null;
	className?: string;
};

export const ShareCard = forwardRef<HTMLDivElement, ShareCardProps>(
	(
		{ size, score, verdict, language, linesCount, roastTitle, className },
		ref,
	) => {
		const isMd = size === "md";

		return (
			<div ref={ref} className={shareCardVariants({ size, className })}>
				{/* Logo Row */}
				<div
					className="flex items-center justify-center gap-2"
					style={{ height: isMd ? 24 : 12 }}
				>
					<span
						className="text-accent-green font-mono"
						style={{ fontSize: isMd ? 12 : 6, fontWeight: 700 }}
					>
						&gt;
					</span>
					<span
						className="text-text-primary font-mono"
						style={{ fontSize: isMd ? 10 : 5, fontWeight: 500 }}
					>
						devroast
					</span>
				</div>

				{/* Score Row - aligned to end for proper baseline */}
				<div
					className="flex items-end justify-center"
					style={{ gap: 2, height: isMd ? 85 : 42 }}
				>
					<span
						className="text-accent-amber font-mono"
						style={{
							fontSize: isMd ? 80 : 40,
							fontWeight: 900,
							lineHeight: 1,
						}}
					>
						{score.toFixed(1)}
					</span>
					<span
						className="text-text-tertiary font-mono"
						style={{
							fontSize: isMd ? 28 : 14,
							fontWeight: 400,
							lineHeight: 1,
						}}
					>
						/10
					</span>
				</div>

				{/* Verdict Row - centered vertically */}
				<div
					className="flex items-center justify-center gap-2"
					style={{ height: isMd ? 24 : 12 }}
				>
					<div
						className="rounded-full bg-accent-red"
						style={{
							width: isMd ? 12 : 6,
							height: isMd ? 12 : 6,
							flexShrink: 0,
						}}
					/>
					<span
						className="text-accent-red font-mono"
						style={{ fontSize: isMd ? 10 : 5, fontWeight: 400 }}
					>
						{verdict || "unknown"}
					</span>
				</div>

				{/* Lang Info */}
				<div
					className="text-text-tertiary font-mono text-center"
					style={{ fontSize: isMd ? 8 : 4 }}
				>
					lang: {language} · {linesCount} lines
				</div>

				{/* Quote */}
				<div
					className="text-text-primary text-center"
					style={{
						fontSize: isMd ? 11 : 5.5,
						lineHeight: 1.5,
					}}
				>
					&quot;{roastTitle || "No title"}&quot;
				</div>
			</div>
		);
	},
);

ShareCard.displayName = "ShareCard";
