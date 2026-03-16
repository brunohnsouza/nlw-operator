"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { CodeEditor } from "@/components/ui/code-editor";
import { Toggle } from "@/components/ui/toggle";

interface EditorSectionProps {
	initialCode: string;
}

export function EditorSection({ initialCode }: EditorSectionProps) {
	const [code, setCode] = useState(initialCode);
	const [roastMode, setRoastMode] = useState(true);
	const [isOverLimit, setIsOverLimit] = useState(false);
	const hasCode = code.trim().length > 0;

	return (
		<>
			{/* Code Editor */}
			<CodeEditor
				value={code}
				onChange={setCode}
				onLimitChange={setIsOverLimit}
				className="h-[360px]"
			/>

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
				<Button variant="primary" disabled={!hasCode || isOverLimit}>
					$ roast_my_code
				</Button>
			</div>
		</>
	);
}
