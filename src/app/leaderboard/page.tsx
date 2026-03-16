import { LeaderboardEntry } from "@/components/ui/leaderboard-entry";

const LEADERBOARD_DATA = [
	{
		rank: 1,
		score: 1.2,
		language: "javascript",
		linesCount: 3,
		code: `eval(prompt("enter code"))
document.write(response)
// trust the user lol`,
	},
	{
		rank: 2,
		score: 2.8,
		language: "python",
		linesCount: 4,
		code: `import os
os.system("rm -rf /")
# YOLO`,
	},
	{
		rank: 3,
		score: 3.5,
		language: "javascript",
		linesCount: 2,
		code: `var password = "123456"
console.log(password)`,
	},
	{
		rank: 4,
		score: 4.1,
		language: "typescript",
		linesCount: 5,
		code: `function divide(a: any, b: any): any {
  return a / b
}
// any for the win`,
	},
	{
		rank: 5,
		score: 5.6,
		language: "go",
		linesCount: 3,
		code: `func main() {
  // no error handling
  data, _ := http.Get("http://localhost")
}`,
	},
];

export default function LeaderboardPage() {
	return (
		<div className="flex min-h-[calc(100vh-3.5rem)] flex-col items-center px-20 py-10">
			<div className="flex w-full max-w-4xl flex-col gap-10">
				<div className="flex flex-col gap-4">
					<div className="flex items-center gap-3">
						<span className="font-mono text-[32px] font-bold text-accent-green">
							{"</>"}
						</span>
						<h1 className="font-mono text-[28px] font-bold text-text-primary">
							shame_leaderboard
						</h1>
					</div>
					<p className="font-mono text-sm text-text-secondary">
						{"// the most roasted code on the internet"}
					</p>
					<div className="flex items-center gap-2">
						<span className="font-mono text-xs text-text-tertiary">
							2,847 submissions
						</span>
						<span className="font-mono text-xs text-text-tertiary">·</span>
						<span className="font-mono text-xs text-text-tertiary">
							avg score: 4.2/10
						</span>
					</div>
				</div>

				<div className="flex flex-col gap-5">
					{LEADERBOARD_DATA.map((entry) => (
						<div
							key={entry.rank}
							className="rounded-lg border border-border-primary bg-bg-page"
						>
							<LeaderboardEntry
								rank={entry.rank}
								score={entry.score}
								language={entry.language}
								linesCount={entry.linesCount}
								code={entry.code}
							/>
						</div>
					))}
				</div>
			</div>
		</div>
	);
}
