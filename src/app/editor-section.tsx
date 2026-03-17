"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { CodeEditor } from "@/components/ui/code-editor";
import { Toggle } from "@/components/ui/toggle";
import { useTRPC } from "@/trpc/client";

interface EditorSectionProps {
	initialCode: string;
}

export function EditorSection({ initialCode }: EditorSectionProps) {
	const router = useRouter();
	const trpc = useTRPC();
	const [code, setCode] = useState(initialCode);
	const [roastMode, setRoastMode] = useState(true);
	const [isOverLimit, setIsOverLimit] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const hasCode = code.trim().length > 0;

	const analyzeMutation = useMutation(trpc.roasts.analyze.mutationOptions());

	const handleSubmit = async () => {
		if (!hasCode || isOverLimit) return;

		setError(null);

		try {
			const result = await analyzeMutation.mutateAsync({
				code,
				language: "javascript",
				roastMode,
			});
			router.push(`/result/${result.id}`);
		} catch (err) {
			setError(err instanceof Error ? err.message : "Failed to analyze code");
		}
	};

	return (
		<>
			{/* Code Editor */}
			<CodeEditor
				value={code}
				onChange={setCode}
				onLimitChange={setIsOverLimit}
				className="h-[360px]"
			/>

			{/* Error Alert */}
			{error && (
				<div className="rounded-md bg-accent-red/10 border border-accent-red p-3 text-accent-red text-sm">
					{error}
				</div>
			)}

			{/* Actions Bar */}
			<div className="flex items-center justify-between">
				<div className="flex items-center gap-4">
					<Toggle pressed={roastMode} onPressedChange={setRoastMode}>
						<span
							className={roastMode ? "text-accent-green" : "text-text-tertiary"}
						>
							roast mode
						</span>
					</Toggle>
					<span className="font-mono text-xs text-text-tertiary">
						{roastMode
							? "// maximum sarcasm enabled"
							: "// gentle feedback mode"}
					</span>
				</div>
				<Button
					variant="primary"
					disabled={!hasCode || isOverLimit || analyzeMutation.isPending}
					onClick={handleSubmit}
				>
					{analyzeMutation.isPending ? "roasting..." : "$ roast_my_code"}
				</Button>
			</div>
		</>
	);
}
