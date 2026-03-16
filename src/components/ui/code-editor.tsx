"use client";

import { ChevronDown, Circle, CircleDot } from "lucide-react";
import {
	useCallback,
	useEffect,
	useId,
	useMemo,
	useRef,
	useState,
} from "react";

import { detectLanguage, type SupportedLanguage } from "@/lib/detect-language";
import { cn } from "@/lib/utils";

const LANGUAGE_LABELS: Record<string, string> = {
	javascript: "JavaScript",
	typescript: "TypeScript",
	python: "Python",
	rust: "Rust",
	go: "Go",
	html: "HTML",
	css: "CSS",
	json: "JSON",
	sql: "SQL",
	bash: "Bash",
	java: "Java",
	csharp: "C#",
	cpp: "C++",
	php: "PHP",
	ruby: "Ruby",
	swift: "Swift",
	kotlin: "Kotlin",
	scala: "Scala",
	yaml: "YAML",
	markdown: "Markdown",
};

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
	const textareaRef = useRef<HTMLTextAreaElement>(null);
	const highlightRef = useRef<HTMLDivElement>(null);
	const [internalValue, setInternalValue] = useState(controlledValue || "");
	const [selectedLanguage, setSelectedLanguage] =
		useState<SupportedLanguage>("javascript");
	const [detectedLanguage, setDetectedLanguage] =
		useState<SupportedLanguage>("javascript");
	const [highlightedHtml, setHighlightedHtml] = useState("");
	const [isDropdownOpen, setIsDropdownOpen] = useState(false);

	const value = controlledValue !== undefined ? controlledValue : internalValue;
	const currentLanguage = selectedLanguage;

	const handleChange = useCallback(
		(newValue: string) => {
			setInternalValue(newValue);
			onChange?.(newValue);

			if (newValue.trim()) {
				const detected = detectLanguage(newValue);
				setDetectedLanguage(detected);
				setSelectedLanguage(detected);
			}
		},
		[onChange],
	);

	const handleInput = useCallback(
		(e: React.FormEvent<HTMLTextAreaElement>) => {
			handleChange(e.currentTarget.value);
		},
		[handleChange],
	);

	const handleScroll = useCallback(() => {
		if (textareaRef.current && highlightRef.current) {
			highlightRef.current.scrollTop = textareaRef.current.scrollTop;
			highlightRef.current.scrollLeft = textareaRef.current.scrollLeft;
		}
	}, []);

	const handleLanguageSelect = useCallback((lang: SupportedLanguage) => {
		setSelectedLanguage(lang);
		setIsDropdownOpen(false);
	}, []);

	const getLabel = useMemo(() => {
		return LANGUAGE_LABELS[currentLanguage] || currentLanguage;
	}, [currentLanguage]);

	const highlightCode = useCallback(
		async (code: string, lang: SupportedLanguage) => {
			if (!code.trim()) {
				setHighlightedHtml("");
				return;
			}

			const hljs = (await import("highlight.js")).default;
			try {
				const result = hljs.highlight(code, {
					language: lang,
					ignoreIllegals: true,
				});
				setHighlightedHtml(result.value);
			} catch {
				const result = hljs.highlightAuto(code);
				setHighlightedHtml(result.value);
			}
		},
		[],
	);

	useEffect(() => {
		highlightCode(value, currentLanguage);
	}, [value, currentLanguage, highlightCode]);

	const lineCount = value.split("\n").length || rows;

	return (
		<div
			className={cn(
				"flex flex-col rounded-lg border border-border-primary bg-bg-input overflow-hidden",
				className,
			)}
		>
			{/* Window Header */}
			<div className="flex h-10 items-center justify-between border-b border-border-primary px-4">
				<div className="flex items-center gap-3">
					<Circle className="h-3 w-3 fill-red-500 text-red-500" />
					<CircleDot className="h-3 w-3 fill-amber-500 text-amber-500" />
					<CircleDot className="h-3 w-3 fill-emerald-500 text-emerald-500" />
				</div>

				{/* Language Selector */}
				<div className="relative">
					<button
						type="button"
						onClick={() => setIsDropdownOpen(!isDropdownOpen)}
						className="flex items-center gap-2 rounded px-2 py-1 text-xs text-text-secondary hover:bg-bg-surface transition-colors"
					>
						<span>{getLabel}</span>
						<ChevronDown
							className={cn(
								"h-3 w-3 transition-transform",
								isDropdownOpen && "rotate-180",
							)}
						/>
					</button>

					{isDropdownOpen && (
						<div className="absolute right-0 top-full z-50 mt-1 w-40 rounded-md border border-border-primary bg-bg-surface py-1 shadow-lg">
							{Object.entries(LANGUAGE_LABELS).map(([lang, label]) => (
								<button
									key={lang}
									type="button"
									onClick={() => handleLanguageSelect(lang)}
									className={cn(
										"w-full px-3 py-1.5 text-left text-xs hover:bg-bg-input transition-colors",
										currentLanguage === lang
											? "text-accent-green bg-accent-green/10"
											: "text-text-secondary",
									)}
								>
									{label}
								</button>
							))}
						</div>
					)}
				</div>
			</div>

			{/* Editor Content */}
			<div className="flex flex-1 overflow-hidden relative">
				{/* Line Numbers */}
				<div className="flex flex-col border-r border-border-primary bg-bg-surface py-4 px-3 text-right font-mono text-xs leading-6 text-text-tertiary select-none">
					{Array.from({ length: lineCount }, (_, i) => (
						<span key={i}>{i + 1}</span>
					))}
				</div>

				{/* Code Editor with Highlight */}
				<div className="flex-1 relative overflow-hidden">
					{/* Highlight Layer */}
					<div
						ref={highlightRef}
						className="absolute inset-0 overflow-auto p-4 font-mono text-sm leading-6 whitespace-pre-wrap break-words pointer-events-none"
						aria-hidden="true"
					>
						{highlightedHtml ? (
							<code
								className="hljs"
								dangerouslySetInnerHTML={{ __html: highlightedHtml }}
							/>
						) : (
							<code className="text-text-primary">{value || placeholder}</code>
						)}
					</div>

					{/* Textarea Layer */}
					<textarea
						ref={textareaRef}
						id={id}
						value={value}
						onInput={handleInput}
						onScroll={handleScroll}
						placeholder={placeholder}
						spellCheck={false}
						className="absolute inset-0 w-full h-full resize-none bg-transparent p-4 font-mono text-sm leading-6 text-transparent caret-text-primary placeholder:text-text-tertiary focus:outline-none"
						rows={lineCount}
					/>
				</div>
			</div>
		</div>
	);
}
