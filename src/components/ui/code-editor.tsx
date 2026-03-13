"use client";

import { useId, useState } from "react";

import { cn } from "@/lib/utils";

export interface CodeEditorProps {
	value?: string;
	onChange?: (value: string) => void;
	placeholder?: string;
	className?: string;
	rows?: number;
}

export function CodeEditor({
	value: controlledValue,
	onChange,
	placeholder = "// paste your code here...",
	className,
	rows = 16,
}: CodeEditorProps) {
	const id = useId();
	const [internalValue, setInternalValue] = useState(controlledValue || "");
	const value = controlledValue !== undefined ? controlledValue : internalValue;

	const handleChange = (newValue: string) => {
		setInternalValue(newValue);
		onChange?.(newValue);
	};

	const lineCount = value.split("\n").length || rows;

	return (
		<div
			className={cn(
				"flex flex-col rounded-lg border border-border-primary bg-bg-input overflow-hidden",
				className,
			)}
		>
			{/* Window Header */}
			<div className="flex h-10 items-center gap-3 border-b border-border-primary px-4">
				<span className="h-3 w-3 rounded-full bg-red-500" />
				<span className="h-3 w-3 rounded-full bg-amber-500" />
				<span className="h-3 w-3 rounded-full bg-emerald-500" />
			</div>

			{/* Editor Content */}
			<div className="flex flex-1 overflow-hidden">
				{/* Line Numbers */}
				<div className="flex flex-col border-r border-border-primary bg-bg-surface py-4 px-3 text-right font-mono text-xs leading-6 text-text-tertiary">
					{Array.from({ length: lineCount }, (_, i) => (
						<span key={i}>{i + 1}</span>
					))}
				</div>

				{/* Code Input */}
				<textarea
					id={id}
					value={value}
					onChange={(e) => handleChange(e.target.value)}
					placeholder={placeholder}
					spellCheck={false}
					className="flex-1 resize-none bg-transparent p-4 font-mono text-sm leading-6 text-text-primary placeholder:text-text-tertiary focus:outline-none"
					rows={lineCount}
				/>
			</div>
		</div>
	);
}
