import OpenAI from "openai";
import type { DiffLine, Issue } from "@/db/schema";

const openai = new OpenAI({
	apiKey: process.env.OPENAI_API_KEY,
});

const SYSTEM_PROMPT_ROAST = `You are DevRoast, an brutally honest code reviewer. Your goal is to roast bad code with sarcastic, harsh humor. Be direct, witty, and don't hold back. Rate the code from 0-10 where 0 is absolutely terrible and 10 is perfect code. Find as many critical issues as possible.`;

const SYSTEM_PROMPT_GENTLE = `You are DevRoast, a helpful and encouraging code reviewer. Your goal is to provide constructive feedback to help developers improve. Be kind, supportive, and educational. Rate the code from 0-10 where 0 is needs major work and 10 is excellent code. Focus on providing helpful, actionable feedback.`;

export type AnalyzeCodeResult = {
	score: number;
	verdict: string;
	roastTitle: string;
	issues: Issue[];
	diff: DiffLine[];
};

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

	const response = await openai.chat.completions.create({
		model: "gpt-4o-mini",
		messages: [
			{ role: "system", content: systemPrompt },
			{
				role: "user",
				content: `Analyze this ${language} code and provide a brutally honest review:

\`\`\`${language}
${code}
\`\`\`

Return a JSON response with exactly this structure:
{
  "score": <number 0-10>,
  "verdict": "<one sentence verdict>",
  "roastTitle": "<catchy title for the review>",
  "issues": [
    {
      "type": "critical" | "warning" | "good",
      "title": "<issue title>",
      "description": "<detailed explanation>"
    }
  ],
  "diff": [
    {
      "type": "context" | "removed" | "added",
      "code": "<line of code>"
    }
  ]
}`,
			},
		],
		response_format: {
			type: "json_schema",
			json_schema: {
				name: "code_review",
				schema: {
					type: "object",
					properties: {
						score: { type: "number" },
						verdict: { type: "string" },
						roastTitle: { type: "string" },
						issues: {
							type: "array",
							items: {
								type: "object",
								properties: {
									type: {
										type: "string",
										enum: ["critical", "warning", "good"],
									},
									title: { type: "string" },
									description: { type: "string" },
								},
								required: ["type", "title", "description"],
							},
						},
						diff: {
							type: "array",
							items: {
								type: "object",
								properties: {
									type: {
										type: "string",
										enum: ["context", "removed", "added"],
									},
									code: { type: "string" },
								},
								required: ["type", "code"],
							},
						},
					},
					required: ["score", "verdict", "roastTitle", "issues", "diff"],
					additionalProperties: false,
				},
				strict: true,
			},
		},
	});

	const message = response.choices[0]?.message;

	if (!message) {
		throw new Error("Failed to get analysis response from OpenAI");
	}

	const content = message.content;

	if (!content) {
		throw new Error("Failed to get analysis text from OpenAI");
	}

	const result = JSON.parse(content) as AnalyzeCodeResult;

	return {
		score: Math.round(result.score * 10) / 10,
		verdict: result.verdict,
		roastTitle: result.roastTitle,
		issues: result.issues,
		diff: result.diff,
	};
}
