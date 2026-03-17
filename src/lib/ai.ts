import { GoogleGenerativeAI } from "@google/generative-ai";
import type { DiffLine, Issue } from "@/db/schema";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY ?? "");

const SYSTEM_PROMPT_ROAST = `You are DevRoast, a brutally honest code reviewer. Your goal is to roast bad code with sarcastic, harsh humor. Be direct, witty, and don't hold back. Rate the code from 0-10 where 0 is absolutely terrible and 10 is perfect code. Find as many critical issues as possible.`;

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

	const model = genAI.getGenerativeModel({
		model: "gemini-2.0-flash",
		systemInstruction: systemPrompt,
	});

	const prompt = `Analyze this ${language} code and provide a review.

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
}`;

	const result = await model.generateContent({
		contents: [{ role: "user", parts: [{ text: prompt }] }],
		generationConfig: {
			responseMimeType: "application/json",
			temperature: 0.7,
		},
	});

	const response = result.response;

	if (!response) {
		throw new Error("Failed to get analysis response from Gemini");
	}

	const text = response.text();

	if (!text) {
		throw new Error("Failed to get analysis text from Gemini");
	}

	const cleanedText = text.replace(/```json?/g, "").trim();
	const parsed = JSON.parse(cleanedText) as AnalyzeCodeResult;

	const score = Math.max(0, Math.min(10, Number(parsed.score) || 5));

	return {
		score: Math.round(score * 10) / 10,
		verdict: parsed.verdict || "needs improvement",
		roastTitle: parsed.roastTitle || "Code Review",
		issues: parsed.issues || [],
		diff: parsed.diff || [],
	};
}
