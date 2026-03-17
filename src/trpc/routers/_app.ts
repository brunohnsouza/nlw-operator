import { asc, avg, count, sql } from "drizzle-orm";
import { z } from "zod";
import { type DiffLine, type Issue, submissions } from "@/db/schema";
import { analyzeCode } from "@/lib/ai";
import { baseProcedure, router } from "../init";

const languageEnum = z.enum([
	"javascript",
	"typescript",
	"python",
	"go",
	"rust",
	"html",
	"css",
	"json",
]);

export const appRouter = router({
	roasts: router({
		analyze: baseProcedure
			.input(
				z.object({
					code: z.string(),
					language: languageEnum,
					roastMode: z.boolean(),
				}),
			)
			.mutation(async ({ ctx, input }) => {
				const result = await analyzeCode({
					code: input.code,
					language: input.language,
					roastMode: input.roastMode,
				});

				const [submission] = await ctx.db
					.insert(submissions)
					.values({
						code: input.code,
						language: input.language,
						score: result.score.toString(),
						roastMode: input.roastMode,
						verdict: result.verdict,
						roastTitle: result.roastTitle,
						issues: result.issues as Issue[],
						diff: result.diff as DiffLine[],
					})
					.returning();

				return { id: submission.id };
			}),
		getById: baseProcedure
			.input(z.object({ id: z.string().uuid() }))
			.query(async ({ ctx, input }) => {
				const [submission] = await ctx.db
					.select()
					.from(submissions)
					.where(sql`${submissions.id} = ${input.id}`);

				if (!submission) {
					throw new Error("Roast not found");
				}

				return {
					id: submission.id,
					code: submission.code,
					language: submission.language,
					roastMode: submission.roastMode,
					score: Number(submission.score),
					verdict: submission.verdict,
					roastTitle: submission.roastTitle,
					issues: submission.issues as Issue[],
					diff: submission.diff as DiffLine[],
					createdAt: submission.createdAt,
				};
			}),
	}),
	metrics: router({
		getStats: baseProcedure.query(async ({ ctx }) => {
			const [totalResult, avgResult] = await Promise.all([
				ctx.db.select({ count: count() }).from(submissions),
				ctx.db.select({ avg: avg(submissions.score) }).from(submissions),
			]);

			return {
				totalRoasted: totalResult[0]?.count ?? 0,
				avgScore: avgResult[0]?.avg ? Number(avgResult[0].avg) : 0,
			};
		}),
	}),
	leaderboard: router({
		getLeaderboard: baseProcedure
			.input(
				z.object({
					page: z.number().int().positive().default(1),
				}),
			)
			.query(async ({ ctx, input }) => {
				const PAGE_SIZE = 20;
				const offset = (input.page - 1) * PAGE_SIZE;

				const [countResult, avgResult, entries] = await Promise.all([
					ctx.db.select({ count: count() }).from(submissions),
					ctx.db.select({ avg: avg(submissions.score) }).from(submissions),
					ctx.db
						.select()
						.from(submissions)
						.orderBy(asc(submissions.score))
						.limit(PAGE_SIZE)
						.offset(offset),
				]);

				const totalSubmissions = countResult[0]?.count ?? 0;
				const totalPages = Math.ceil(totalSubmissions / PAGE_SIZE);

				return {
					entries: entries.map((e, i) => ({
						...e,
						rank: offset + i + 1,
						linesCount: e.code.split("\n").length,
					})),
					totalSubmissions,
					avgScore: avgResult[0]?.avg ? Number(avgResult[0].avg) : 0,
					page: input.page,
					totalPages,
					pageSize: PAGE_SIZE,
				};
			}),
		getTop3: baseProcedure.query(async ({ ctx }) => {
			const [countResult, entries] = await Promise.all([
				ctx.db.select({ count: count() }).from(submissions),
				ctx.db
					.select()
					.from(submissions)
					.orderBy(asc(submissions.score))
					.limit(3),
			]);

			if (entries.length === 0) {
				return {
					entries: [],
					totalSubmissions: 0,
				};
			}

			return {
				entries: entries.map((e, i) => ({
					...e,
					rank: i + 1,
					linesCount: e.code.split("\n").length,
				})),
				totalSubmissions: countResult[0]?.count ?? 0,
			};
		}),
	}),
});

export type AppRouter = typeof appRouter;
