"use client";

import { useEffect, useState } from "react";
import { createHighlighter, type Highlighter } from "shiki";
import css from "shiki/langs/css.mjs";
import go from "shiki/langs/go.mjs";
import html from "shiki/langs/html.mjs";
import javascript from "shiki/langs/javascript.mjs";
import json from "shiki/langs/json.mjs";
import python from "shiki/langs/python.mjs";
import rust from "shiki/langs/rust.mjs";
import typescript from "shiki/langs/typescript.mjs";

let highlighter: Highlighter | null = null;

async function getHighlighterInstance() {
	if (!highlighter) {
		highlighter = await createHighlighter({
			themes: ["vesper"],
			langs: [javascript, typescript, python, rust, go, html, css, json],
		});
	}
	return highlighter;
}

export interface CodeBlockClientProps {
	code: string;
	lang?: string;
	showLineNumbers?: boolean;
	showHeader?: boolean;
	filename?: string;
	className?: string;
}

export function CodeBlockClient({
	code,
	lang = "javascript",
	showLineNumbers = true,
	showHeader = false,
	filename,
	className,
}: CodeBlockClientProps) {
	const [htmlOutput, setHtmlOutput] = useState("");
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		let mounted = true;
		getHighlighterInstance().then((hl) => {
			if (mounted) {
				setHtmlOutput(hl.codeToHtml(code, { lang, theme: "vesper" }));
				setIsLoading(false);
			}
		});
		return () => {
			mounted = false;
		};
	}, [code, lang]);

	const lines = code.split("\n");

	if (isLoading) {
		return (
			<div
				className={`border border-border-primary bg-bg-input overflow-hidden ${
					className ?? ""
				}`}
			>
				<div className="flex">
					{showLineNumbers && (
						<div className="w-10 min-w-[40px] border-r border-border-primary bg-[#101010] py-3 px-[10px] text-right">
							{lines.map((_, i) => (
								<div
									key={i}
									className="font-mono text-xs leading-6 text-text-tertiary"
								>
									{i + 1}
								</div>
							))}
						</div>
					)}
					<div className="flex-1 bg-[#101010] overflow-x-auto p-3">
						<code className="font-mono text-xs text-text-secondary">
							{code}
						</code>
					</div>
				</div>
			</div>
		);
	}

	return (
		<div
			className={`border border-border-primary bg-bg-input overflow-hidden ${
				className ?? ""
			}`}
		>
			{showHeader && (
				<div className="flex h-10 items-center gap-3 border-b border-border-primary px-4">
					<span className="h-2.5 w-2.5 rounded-full bg-red-500" />
					<span className="h-2.5 w-2.5 rounded-full bg-amber-500" />
					<span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
					{filename && (
						<span className="ml-auto font-mono text-xs text-text-tertiary">
							{filename}
						</span>
					)}
				</div>
			)}
			<div className="flex">
				{showLineNumbers && (
					<div className="w-10 min-w-[40px] border-r border-border-primary bg-[#101010] py-3 px-[10px] text-right">
						{lines.map((_, i) => (
							<div
								key={i}
								className="font-mono text-xs leading-6 text-text-tertiary"
							>
								{i + 1}
							</div>
						))}
					</div>
				)}
				<div
					className="flex-1 bg-[#101010] overflow-x-auto p-3"
					dangerouslySetInnerHTML={{ __html: htmlOutput }}
				/>
			</div>
		</div>
	);
}
