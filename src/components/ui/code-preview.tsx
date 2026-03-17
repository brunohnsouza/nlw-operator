"use client";

import { Collapsible } from "@base-ui/react";
import { useState } from "react";
import { CodeBlockClient } from "./code-block-client";

export interface CodePreviewProps {
	code: string;
	lang: string;
	maxLines?: number;
}

export function CodePreview({ code, lang, maxLines = 3 }: CodePreviewProps) {
	const [open, setOpen] = useState(false);
	const lines = code.split("\n");
	const preview = lines.slice(0, maxLines).join("\n");
	const hasMore = lines.length > maxLines;

	return (
		<Collapsible.Root open={open} onOpenChange={setOpen}>
			<div className="flex flex-col gap-2">
				<code className="font-mono text-xs text-text-secondary whitespace-pre-wrap">
					{preview}
				</code>
				{hasMore && !open && (
					<button
						type="button"
						onClick={() => setOpen(true)}
						className="self-start font-mono text-xs text-accent-green hover:text-accent-green/80 transition-colors"
					>
						show more
					</button>
				)}
				{open && (
					<button
						type="button"
						onClick={() => setOpen(false)}
						className="self-start font-mono text-xs text-text-tertiary hover:text-text-secondary transition-colors"
					>
						show less
					</button>
				)}
				<Collapsible.Panel>
					<div className="mr-4">
						<CodeBlockClient code={code} lang={lang} showLineNumbers />
					</div>
				</Collapsible.Panel>
			</div>
		</Collapsible.Root>
	);
}
