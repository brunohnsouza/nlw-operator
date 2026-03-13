import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { tv, type VariantProps } from "tailwind-variants";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export const badgeVariants = tv({
	base: "inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-mono",
	variants: {
		variant: {
			critical: "bg-red-950/50 text-accent-red",
			warning: "bg-amber-950/50 text-accent-amber",
			good: "bg-emerald-950/50 text-accent-green",
			verdict: "bg-red-950/50 text-accent-red",
		},
	},
	defaultVariants: {
		variant: "good",
	},
});

type BadgeProps = VariantProps<typeof badgeVariants> & {
	className?: string;
	children: React.ReactNode;
};

export function Badge({ className, variant, children }: BadgeProps) {
	const dotColor =
		variant === "critical" || variant === "verdict"
			? "bg-accent-red"
			: variant === "warning"
				? "bg-accent-amber"
				: "bg-accent-green";

	return (
		<span className={badgeVariants({ variant, className })}>
			<span className={cn("h-2 w-2 rounded-full", dotColor)} />
			{children}
		</span>
	);
}
