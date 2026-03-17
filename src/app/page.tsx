import { Suspense } from "react";

import {
	LeaderboardSection,
	LeaderboardSkeleton,
} from "@/components/leaderboard-section";
import { MetricsSection } from "@/components/ui/metrics-section";
import { EditorSection } from "./editor-section";

export const revalidate = 3600; // 1 hour

const sampleCode = `function calculateTotal(items) {
  var total = 0;
  for (var i = 0; i < items.length; i++) {
    total += items[i].price;
  }
  return total;
}

// TODO: handle tax calculation
// TODO: handle currency conversion
}`;

export default function HomePage() {
	return (
		<div className="flex min-h-[calc(100vh-3.5rem)] flex-col items-center px-10 py-12">
			<div className="flex w-full max-w-[960px] flex-col gap-8">
				{/* Hero Section */}
				<div className="flex flex-col gap-3 text-center">
					<h1 className="font-mono text-4xl font-bold text-text-primary">
						<span className="text-accent-green">$</span> paste your code. get
						roasted.
					</h1>
					<p className="font-mono text-sm text-text-secondary">
						{
							"// drop your code below and we'll rate it — brutally honest or full roast mode"
						}
					</p>
				</div>

				{/* Code Editor Section */}
				<EditorSection initialCode={sampleCode} />

				{/* Metrics Section */}
				<MetricsSection />

				{/* Leaderboard Preview */}
				<Suspense fallback={<LeaderboardSkeleton />}>
					<LeaderboardSection />
				</Suspense>
			</div>
		</div>
	);
}
