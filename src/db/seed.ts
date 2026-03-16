import { faker } from "@faker-js/faker";
import pg from "pg";

const pool = new pg.Pool({
	connectionString: process.env.DATABASE_URL,
});

const languages = [
	"javascript",
	"typescript",
	"python",
	"java",
	"go",
	"rust",
	"csharp",
	"ruby",
	"php",
	"sql",
];

const roasts = [
	"This code is so bad, even your mother would cringe.",
	"Are you serious? This is worse than my first Hello World.",
	"I've seen better code in a Fortune 500 codebase... oh wait, no I haven't.",
	"This is why we can't have nice things.",
	"Congratulations! You've achieved maximum spaghetti.",
	"Your code is like a onion - it has layers and makes people cry.",
	"Did you learn programming from a tutorial that was written by AI... in 2024?",
	"This code is so messy, even grep can't find the bugs.",
	"I've seen more structure in a pile of garbage.",
	"This is the coding equivalent of finger painting in the dark.",
	"Your variable names are more confusing than the plot of Inception.",
	"This code would fail a code review from a sentient toaster.",
	"If this code were a person, it would be on a list.",
	"This is what happens when you copy-paste from Stack Overflow without understanding.",
	"I've seen better architecture in a sandcastle.",
	"This code screams \"I don't know what I'm doing\".",
	"Your function does too much. It's basically having an existential crisis.",
	"This is the worst code I've seen since... well, the last guy.",
	"If this were a car, it wouldn't pass inspection.",
	"This code would make any senior developer cry.",
	"You've managed to combine every anti-pattern into one file. Impressive!",
	"This code is like a maze. Good luck finding the exit.",
	"I'd rather debug production on a Friday afternoon than read this.",
	"Your code quality is inversely proportional to your confidence.",
	'This is what happens when you skip the "how to code" part.',
	"Even my cat could write better code, and she doesn't have thumbs.",
	"This code is the reason we can't have nice things in production.",
	"I'm honestly impressed you managed to make it this far.",
	"This code would make a junior developer question their career choices.",
	"Did you write this while being attacked by bees?",
];

const gentleFeedbacks = [
	"Consider breaking this into smaller functions for better readability.",
	"Using const instead of var would improve code consistency.",
	"You might want to add error handling for better robustness.",
	"Consider adding type annotations for better code clarity.",
	"This could benefit from some comments explaining the logic.",
	"Breaking this down into smaller units would help with testing.",
	"Using meaningful variable names would improve maintainability.",
	"Consider extracting this into a reusable function.",
	"Adding input validation would make this more reliable.",
	"This could be simplified using a more functional approach.",
];

async function seed() {
	console.log("🌱 Seeding database...");

	const client = await pool.connect();

	try {
		await client.query("BEGIN");

		const submissions = [];
		const _feedbacks = [];

		for (let i = 0; i < 100; i++) {
			const isRoast = faker.datatype.boolean();
			const language = faker.helpers.arrayElement(languages);
			const score = isRoast
				? Number(faker.number.float({ min: 0, max: 4.9, fractionDigits: 1 }))
				: Number(faker.number.float({ min: 5, max: 10, fractionDigits: 1 }));

			const codeSnippet = faker.lorem.paragraphs(2);
			const createdAt = faker.date.between({
				from: "2024-01-01",
				to: "2024-12-31",
			});

			const submissionResult = await client.query(
				`INSERT INTO submissions (id, code, language, score, roast_mode, created_at)
				 VALUES ($1, $2, $3, $4, $5, $6)
				 RETURNING id`,
				[
					faker.string.uuid(),
					codeSnippet,
					language,
					score.toString(),
					isRoast,
					createdAt,
				],
			);

			const submissionId = submissionResult.rows[0].id;
			submissions.push(submissionId);

			const feedbackContent = isRoast
				? faker.helpers.arrayElement(roasts)
				: faker.helpers.arrayElement(gentleFeedbacks);

			await client.query(
				`INSERT INTO feedbacks (id, submission_id, content, created_at)
				 VALUES ($1, $2, $3, $4)`,
				[faker.string.uuid(), submissionId, feedbackContent, createdAt],
			);

			if ((i + 1) % 10 === 0) {
				console.log(`  ✓ Inserted ${i + 1}/100 submissions`);
			}
		}

		await client.query("COMMIT");
		console.log("✅ Seeding completed!");
		console.log(`  📊 Total submissions: 100`);
		console.log(`  📊 Total feedbacks: 100`);
	} catch (error) {
		await client.query("ROLLBACK");
		console.error("❌ Seeding failed:", error);
		throw error;
	} finally {
		client.release();
		await pool.end();
	}
}

seed();
