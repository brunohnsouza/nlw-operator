import { avg, count } from "drizzle-orm";
import { submissions } from "@/db/schema";
import { baseProcedure, router } from "../init";

export const appRouter = router({
	metrics: router({
		getStats: baseProcedure.query(async ({ ctx }) => {
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
});

export type AppRouter = typeof appRouter;
