import { type ButtonHTMLAttributes, forwardRef } from "react";

import { tv, type VariantProps } from "tailwind-variants";

export const buttonVariants = tv({
	base: "inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-900 disabled:pointer-events-none disabled:opacity-50",
	variants: {
		variant: {
			primary: "bg-emerald-500 text-zinc-950 hover:bg-emerald-400",
			secondary: "bg-zinc-800 text-zinc-100 hover:bg-zinc-700",
			outline: "border border-zinc-600 text-zinc-100 hover:bg-zinc-800",
			ghost: "text-zinc-100 hover:bg-zinc-800",
			danger: "bg-red-600 text-white hover:bg-red-500",
		},
		size: {
			sm: "h-8 px-3 text-xs",
			md: "h-10 px-6 text-sm",
			lg: "h-12 px-8 text-base",
		},
	},
	defaultVariants: {
		variant: "primary",
		size: "md",
	},
});

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> &
	VariantProps<typeof buttonVariants>;

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
	({ className, variant, size, ...props }, ref) => {
		return (
			<button
				ref={ref}
				className={buttonVariants({ variant, size, className })}
				{...props}
			/>
		);
	},
);

Button.displayName = "Button";
