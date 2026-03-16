import { initTRPC } from "@trpc/server";
import { cache } from "react";
import superjson from "superjson";
import { db } from "@/db";

export type Context = {
	db: typeof db;
};

export const createTRPCContext = cache(async (): Promise<Context> => {
	return {
		db,
	};
});

const t = initTRPC.context<Context>().create({
	transformer: superjson,
});

export const router = t.router;
export const baseProcedure = t.procedure;
