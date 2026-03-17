"use client";

import html2canvas from "html2canvas";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { ShareCard } from "@/components/ui/share-card";

interface RoastData {
	id: string;
	score: number;
	verdict: string | null;
	language: string;
	roastTitle: string | null;
	code: string;
}

interface ShareContentProps {
	roast: RoastData;
}

export function ShareContent({ roast }: ShareContentProps) {
	const [downloading, setDownloading] = useState(false);
	const router = useRouter();
	const cardRef = useRef<HTMLDivElement>(null);

	const linesCount = roast.code.split("\n").length;

	const handleDownload = async () => {
		if (!cardRef.current) return;

		setDownloading(true);
		try {
			const canvas = await html2canvas(cardRef.current, {
				backgroundColor: "#0C0C0C",
				scale: 2,
			});

			const link = document.createElement("a");
			link.download = `devroast-${roast.id}.png`;
			link.href = canvas.toDataURL("image/png");
			link.click();
		} catch (error) {
			console.error("Error downloading image:", error);
		} finally {
			setDownloading(false);
		}
	};

	return (
		<div className="flex min-h-[calc(100vh-3.5rem)] flex-col items-center px-20 py-10">
			<div className="flex w-full max-w-4xl flex-col gap-8">
				<header className="flex items-center justify-between">
					<div className="flex items-center gap-2">
						<span className="font-mono text-sm font-bold text-accent-green">
							{"//"}
						</span>
						<span className="font-mono text-sm font-bold text-text-primary">
							share_your_roast
						</span>
					</div>
					<button
						type="button"
						onClick={() => router.back()}
						className="font-mono text-xs text-text-tertiary hover:text-text-primary hover:cursor-pointer"
					>
						← back
					</button>
				</header>

				<section className="flex flex-col items-center gap-6">
					<div ref={cardRef}>
						<ShareCard
							score={roast.score}
							verdict={roast.verdict}
							language={roast.language}
							linesCount={linesCount}
							roastTitle={roast.roastTitle}
						/>
					</div>

					<Button
						variant="primary"
						size="lg"
						onClick={handleDownload}
						disabled={downloading}
					>
						{downloading ? "downloading..." : "↓ download image"}
					</Button>
				</section>

				<footer className="mt-8 text-center">
					<p className="font-mono text-xs text-text-tertiary">
						Click download to save the image
					</p>
				</footer>
			</div>
		</div>
	);
}
