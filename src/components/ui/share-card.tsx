import { forwardRef } from "react";

import { tv, type VariantProps } from "tailwind-variants";

export const shareCardVariants = tv({
	base: "flex flex-col items-center justify-center bg-bg-page",
	variants: {
		size: {
			sm: "w-[300px] h-[158px] p-4 gap-2",
			md: "w-[600px] h-[315px] p-8 gap-3.5",
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
		return (
			<div ref={ref} className={shareCardVariants({ size, className })}>
				<div
					className="flex items-center gap-1"
					style={{ height: size === "md" ? 20 : 10 }}
				>
					<span
						className="text-accent-green font-mono"
						style={{ fontSize: size === "md" ? 12 : 6, fontWeight: 700 }}
					>
						&gt;
					</span>
					<span
						className="text-text-primary font-mono"
						style={{ fontSize: size === "md" ? 10 : 5, fontWeight: 500 }}
					>
						devroast
					</span>
				</div>

				<div
					className="flex items-end"
					style={{ gap: 2, height: size === "md" ? 85 : 42 }}
				>
					<span
						className="text-accent-amber font-mono"
						style={{
							fontSize: size === "md" ? 80 : 40,
							fontWeight: 900,
							lineHeight: 1,
						}}
					>
						{score.toFixed(1)}
					</span>
					<span
						className="text-text-tertiary font-mono"
						style={{
							fontSize: size === "md" ? 28 : 14,
							fontWeight: 400,
							lineHeight: 1,
						}}
					>
						/10
					</span>
				</div>

				<div
					className="flex items-center gap-1"
					style={{ height: size === "md" ? 20 : 10 }}
				>
					<div
						className="rounded-full bg-accent-red"
						style={{
							width: size === "md" ? 6 : 3,
							height: size === "md" ? 6 : 3,
						}}
					/>
					<span
						className="text-accent-red font-mono"
						style={{ fontSize: size === "md" ? 10 : 5, fontWeight: 400 }}
					>
						{verdict || "unknown"}
					</span>
				</div>

				<div
					className="text-text-tertiary font-mono"
					style={{ fontSize: size === "md" ? 8 : 4 }}
				>
					lang: {language} · {linesCount} lines
				</div>

				<div
					className="text-text-primary text-center"
					style={{ fontSize: size === "md" ? 11 : 5.5, lineHeight: 1.4 }}
				>
					&quot;{roastTitle || "No title"}&quot;
				</div>
			</div>
		);
	},
);

ShareCard.displayName = "ShareCard";
