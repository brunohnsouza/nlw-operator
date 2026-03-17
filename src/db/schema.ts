import {
	boolean,
	decimal,
	jsonb,
	pgEnum,
	pgTable,
	text,
	timestamp,
	uuid,
} from "drizzle-orm/pg-core";

export const roastLevelEnum = pgEnum("roast_level", ["gentle", "roast"]);

export type DiffLine = {
	type: "added" | "removed" | "unchanged";
	content: string;
	lineNumber: number;
};

export type Issue = {
	severity: "error" | "warning" | "info";
	message: string;
	line?: number;
	code?: string;
};

export const submissions = pgTable("submissions", {
	id: uuid("id").primaryKey().defaultRandom(),
	code: text("code").notNull(),
	language: text("language").notNull(),
	score: decimal("score", { precision: 3, scale: 1 }).notNull(),
	roastMode: boolean("roast_mode").notNull().default(true),
	verdict: text("verdict"),
	roastTitle: text("roast_title"),
	issues: jsonb("issues").$type<Issue[]>(),
	diff: jsonb("diff").$type<DiffLine[]>(),
	createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const feedbacks = pgTable("feedbacks", {
	id: uuid("id").primaryKey().defaultRandom(),
	submissionId: uuid("submission_id").notNull(),
	content: text("content").notNull(),
	createdAt: timestamp("created_at").notNull().defaultNow(),
});

export type Submission = typeof submissions.$inferSelect;
export type NewSubmission = typeof submissions.$inferInsert;
export type Feedback = typeof feedbacks.$inferSelect;
export type NewFeedback = typeof feedbacks.$inferInsert;
