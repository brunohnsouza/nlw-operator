import { tv } from "tailwind-variants";

import { cn } from "@/lib/utils";

export type DiffLineType = "removed" | "added" | "context";

const diffLineVariants = tv({
	base: "flex gap-2 py-2 px-4 font-mono text-sm",
	variants: {
		type: {
			removed: "bg-red-950/50 text-text-secondary",
			added: "bg-emerald-950/50 text-text-primary",
			context: "bg-transparent text-text-tertiary",
		},
	},
	defaultVariants: {
		type: "context",
	},
});

export interface DiffLineProps {
	type: DiffLineType;
	code: string;
	className?: string;
}

const prefixMap = {
	removed: "-",
	added: "+",
	context: " ",
} as const;

const prefixColorMap = {
	removed: "text-accent-red",
	added: "text-accent-green",
	context: "text-text-tertiary",
} as const;

export function DiffLine({ type, code, className }: DiffLineProps) {
	return (
		<div className={diffLineVariants({ type, className })}>
			<span className={cn("w-4", prefixColorMap[type])}>{prefixMap[type]}</span>
			<code className="flex-1">{code}</code>
		</div>
	);
}
