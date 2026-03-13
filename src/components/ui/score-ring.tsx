"use client";

import { useId } from "react";

import { cn } from "@/lib/utils";

export interface ScoreRingProps {
	value: number;
	max?: number;
	size?: number;
	className?: string;
}

export function ScoreRing({
	value,
	max = 10,
	size = 180,
	className,
}: ScoreRingProps) {
	const id = useId();
	const radius = (size - 8) / 2;
	const circumference = 2 * Math.PI * radius;
	const normalizedValue = Math.min(Math.max(value, 0), max);
	const percentage = (normalizedValue / max) * 100;
	const dashOffset = circumference - (percentage / 100) * circumference;

	const gradientId = `score-ring-gradient-${id}`;

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
				<defs>
					<linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
						<stop offset="0%" stopColor="var(--color-accent-green)" />
						<stop offset="35%" stopColor="var(--color-accent-amber)" />
						<stop offset="36%" stopColor="transparent" />
					</linearGradient>
				</defs>
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
					stroke={`url(#${gradientId})`}
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
