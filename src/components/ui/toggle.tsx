import { Toggle as BaseToggle } from "@base-ui/react/toggle";

import { cn } from "@/lib/utils";

export interface ToggleProps {
	className?: string;
	defaultPressed?: boolean;
	pressed?: boolean;
	onPressedChange?: (pressed: boolean) => void;
	disabled?: boolean;
	children?: React.ReactNode;
}

export function Toggle({
	className,
	defaultPressed,
	pressed,
	onPressedChange,
	disabled,
	children,
}: ToggleProps) {
	return (
		<BaseToggle
			className={cn("flex items-center gap-2.5 hover:cursor-pointer", className)}
			defaultPressed={defaultPressed}
			pressed={pressed}
			onPressedChange={onPressedChange}
			disabled={disabled}
		>
			<div
				className={cn(
					"relative h-[23px] w-10 rounded-full p-[3px] transition-colors",
					pressed ? "bg-accent-green" : "bg-border-primary",
				)}
			>
				<div
					className={cn(
						"block h-4 w-4 rounded-full bg-[#0a0a0a] transition-transform",
						pressed ? "translate-x-4" : "translate-x-0",
					)}
				/>
			</div>
			{children}
		</BaseToggle>
	);
}
