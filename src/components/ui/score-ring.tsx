"use client";

import { cn } from "@/lib/utils";

export interface ScoreRingProps {
	value: number;
	max?: number;
	size?: number;
	className?: string;
}

function getScoreColor(value: number, max: number): string {
	const percentage = (value / max) * 100;
	if (percentage >= 70) return "var(--color-accent-green)";
	if (percentage >= 40) return "var(--color-accent-amber)";
	return "var(--color-accent-red)";
}

export function ScoreRing({
	value,
	max = 10,
	size = 180,
	className,
}: ScoreRingProps) {
	const radius = (size - 8) / 2;
	const circumference = 2 * Math.PI * radius;
	const normalizedValue = Math.min(Math.max(value, 0), max);
	const percentage = (normalizedValue / max) * 100;
	const dashOffset = circumference - (percentage / 100) * circumference;
	const strokeColor = getScoreColor(normalizedValue, max);

	return (
		<div
			className={cn("relative inline-block", className)}
			style={{ width: size, height: size }}
		>
			<svg
				width={size}
				height={size}
				className="absolute inset-0 -rotate-90"
				role="img"
				aria-label={`Score: ${normalizedValue} out of ${max}`}
			>
				<title>{`Score: ${normalizedValue} out of ${max}`}</title>
				<circle
					cx={size / 2}
					cy={size / 2}
					r={radius}
					fill="none"
					stroke="var(--color-border-primary)"
					strokeWidth={4}
				/>
				<circle
					cx={size / 2}
					cy={size / 2}
					r={radius}
					fill="none"
					stroke={strokeColor}
					strokeWidth={4}
					strokeDasharray={circumference}
					strokeDashoffset={dashOffset}
					strokeLinecap="round"
				/>
			</svg>
			<div className="absolute inset-0 flex flex-col items-center justify-center">
				<span className="font-mono text-5xl font-bold leading-none text-text-primary">
					{normalizedValue.toFixed(1)}
				</span>
				<span className="font-mono text-base leading-none text-text-tertiary">
					/{max}
				</span>
			</div>
		</div>
	);
}
