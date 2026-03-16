import hljs from "highlight.js";

const LANGUAGE_ALIASES: Record<string, string> = {
	js: "javascript",
	ts: "typescript",
	py: "python",
	rb: "ruby",
	yml: "yaml",
	sh: "bash",
	zsh: "bash",
	shell: "bash",
	md: "markdown",
	cpp: "cpp",
	csharp: "csharp",
	fs: "fsharp",
	objectivec: "objectivec",
	ml: "ocaml",
};

export const SUPPORTED_LANGUAGES = [
	{ value: "auto", label: "Auto-detect" },
	{ value: "javascript", label: "JavaScript" },
	{ value: "typescript", label: "TypeScript" },
	{ value: "python", label: "Python" },
	{ value: "rust", label: "Rust" },
	{ value: "go", label: "Go" },
	{ value: "html", label: "HTML" },
	{ value: "css", label: "CSS" },
	{ value: "json", label: "JSON" },
	{ value: "sql", label: "SQL" },
	{ value: "bash", label: "Bash" },
	{ value: "java", label: "Java" },
	{ value: "csharp", label: "C#" },
	{ value: "cpp", label: "C++" },
	{ value: "php", label: "PHP" },
	{ value: "ruby", label: "Ruby" },
	{ value: "swift", label: "Swift" },
	{ value: "kotlin", label: "Kotlin" },
	{ value: "scala", label: "Scala" },
	{ value: "yaml", label: "YAML" },
	{ value: "markdown", label: "Markdown" },
] as const;

export type SupportedLanguage =
	| (typeof LANGUAGE_ALIASES)[keyof typeof LANGUAGE_ALIASES]
	| string;

export function detectLanguage(code: string): string {
	if (!code || code.trim().length < 10) {
		return "javascript";
	}

	const result = hljs.highlightAuto(code);

	if (!result.language) {
		return "javascript";
	}

	const detected = result.language.toLowerCase();

	return LANGUAGE_ALIASES[detected] || detected;
}

export function isValidLanguage(lang: string): boolean {
	const normalized = lang.toLowerCase();
	if (normalized === "auto") return true;
	return (
		LANGUAGE_ALIASES[normalized] !== undefined ||
		SUPPORTED_LANGUAGES.some((l) => l.value === normalized)
	);
}

export function normalizeLanguage(lang: string): string {
	if (lang === "auto") return "auto";
	const normalized = lang.toLowerCase();
	return LANGUAGE_ALIASES[normalized] || normalized;
}
