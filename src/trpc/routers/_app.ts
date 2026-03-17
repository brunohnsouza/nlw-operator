import { baseProcedure, router } from "../init";

export const appRouter = router({
	metrics: router({
		getStats: baseProcedure.query(async ({ ctx: _ctx }) => {
			// Mock para teste - retornar valores maiores para ver animação
			// TODO: remover quando DB estiver pronto
			return {
				totalRoasted: 2847,
				avgScore: 4.2,
			};

			// Código real (comentar acima para ativar)
			// const [totalResult] = await ctx.db
			// 	.select({ count: count() })
			// 	.from(submissions);
			// const [avgResult] = await ctx.db
			// 	.select({ avg: avg(submissions.score) })
			// 	.from(submissions);
			// return {
			// 	totalRoasted: totalResult?.count ?? 0,
			// 	avgScore: avgResult?.avg ? Number(avgResult.avg) : 0,
			// };
		}),
	}),
	leaderboard: router({
		getLeaderboard: baseProcedure.query(async ({ ctx: _ctx }) => {
			// Mock para teste
			// TODO: remover quando DB estiver pronto
			return {
				entries: [
					{
						id: "1",
						rank: 1,
						score: "2.1",
						code: `function calculateTotal(items) {
  var total = 0;
  for (var i = 0; i < items.length; i++) {
    total += items[i].price;
  }
  return total;
}`,
						language: "javascript",
						linesCount: 8,
					},
					{
						id: "2",
						rank: 2,
						score: "3.5",
						code: `const add = (a, b) => {
  // no type safety, wow
  return a + b;
}`,
						language: "javascript",
						linesCount: 4,
					},
					{
						id: "3",
						rank: 3,
						score: "4.8",
						code: `if (condition) {
  doSomething();
} else {
  // empty
}`,
						language: "javascript",
						linesCount: 5,
					},
				],
				totalSubmissions: 2847,
				avgScore: 4.2,
			};

			// Código real (comentar acima para ativar)
			// const [countResult, avgResult, entries] = await Promise.all([
			// 	ctx.db
			// 		.select({ count: count() })
			// 		.from(submissions),
			// 	ctx.db
			// 		.select({ avg: avg(submissions.score) })
			// 		.from(submissions),
			// 	ctx.db
			// 		.select()
			// 		.from(submissions)
			// 		.orderBy(asc(submissions.score))
			// 		.limit(3),
			// ]);

			// return {
			// 	entries: entries.map((e, i) => ({
			// 		...e,
			// 		rank: i + 1,
			// 		linesCount: e.code.split("\n").length,
			// 	})),
			// 	totalSubmissions: countResult[0]?.count ?? 0,
			// 	avgScore: avgResult[0]?.avg ? Number(avgResult[0].avg) : 0,
			// };
		}),
	}),
});

export type AppRouter = typeof appRouter;
