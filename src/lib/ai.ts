import Groq from "groq-sdk";
import type { DiffLine, Issue } from "@/db/schema";

const SYSTEM_PROMPT_ROAST = `You are DevRoast, a brutally honest code reviewer. Your goal is to roast bad code with sarcastic, harsh humor. Be direct, witty, and don't hold back. Rate the code from 0-10 where 0 is absolutely terrible and 10 is perfect code. Find as many critical issues as possible.`;

const SYSTEM_PROMPT_GENTLE = `You are DevRoast, a helpful and encouraging code reviewer. Your goal is to provide constructive feedback to help developers improve. Be kind, supportive, and educational. Rate the code from 0-10 where 0 is needs major work and 10 is excellent code. Focus on providing helpful, actionable feedback.`;

export type AnalyzeCodeResult = {
	score: number;
	verdict: string;
	roastTitle: string;
	issues: Issue[];
	diff: DiffLine[];
};

function getGroqClient() {
	const apiKey = process.env.GROQ_API_KEY;
	if (!apiKey) {
		throw new Error("GROQ_API_KEY environment variable is not set");
	}
	return new Groq({ apiKey });
}

export async function analyzeCode({
	code,
	language,
	roastMode,
}: {
	code: string;
	language: string;
	roastMode: boolean;
}): Promise<AnalyzeCodeResult> {
	const systemPrompt = roastMode ? SYSTEM_PROMPT_ROAST : SYSTEM_PROMPT_GENTLE;

	const chatCompletion = await getGroqClient().chat.completions.create({
		messages: [
			{ role: "system", content: systemPrompt },
			{
				role: "user",
				content: `Analyze this ${language} code and provide a review.

Code:
\`\`\`${language}
${code}
\`\`\`

Return ONLY valid JSON (no markdown, no explanation) with this exact structure:
{
  "score": number between 0-10,
  "verdict": "one sentence verdict",
  "roastTitle": "catchy title for the review",
  "issues": [
    {
      "type": "critical" or "warning" or "good",
      "title": "issue title",
      "description": "detailed explanation"
    }
  ],
  "diff": [
    {
      "type": "context" or "removed" or "added",
      "code": "line of code"
    }
  ]
}`,
			},
		],
		model: "llama-3.3-70b-versatile",
		response_format: { type: "json_object" },
	});

	const message = chatCompletion.choices[0]?.message;

	if (!message) {
		throw new Error("Failed to get analysis response from Groq");
	}

	const content = message.content;

	if (!content) {
		throw new Error("Failed to get analysis text from Groq");
	}

	const parsed = JSON.parse(content) as AnalyzeCodeResult;

	const score = Math.max(0, Math.min(10, Number(parsed.score) || 5));

	return {
		score: Math.round(score * 10) / 10,
		verdict: parsed.verdict || "needs improvement",
		roastTitle: parsed.roastTitle || "Code Review",
		issues: parsed.issues || [],
		diff: parsed.diff || [],
	};
}
