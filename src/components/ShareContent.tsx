"use client";

import html2canvas from "html2canvas";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";

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
				<div className="flex items-center justify-between">
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
						className="font-mono text-xs text-text-tertiary hover:text-text-primary"
					>
						← back
					</button>
				</div>

				<div className="flex flex-col items-center gap-6">
					<div
						ref={cardRef}
						style={{
							backgroundColor: "#0C0C0C",
							width: 600,
							height: 315,
							display: "flex",
							flexDirection: "column",
							alignItems: "center",
							justifyContent: "center",
							padding: 32,
							gap: 14,
						}}
					>
						<div
							style={{
								display: "flex",
								alignItems: "center",
								gap: 4,
								height: 20,
								marginBottom: 14,
							}}
						>
							<span
								style={{
									color: "#10B981",
									fontSize: 12,
									fontWeight: 700,
									fontFamily: "JetBrains Mono, monospace",
								}}
							>
								&gt;
							</span>
							<span
								style={{
									color: "#FAFAFA",
									fontSize: 10,
									fontWeight: 500,
									fontFamily: "JetBrains Mono, monospace",
								}}
							>
								devroast
							</span>
						</div>

						<div
							style={{
								display: "flex",
								alignItems: "flex-end",
								gap: 2,
								height: 85,
								marginBottom: 14,
							}}
						>
							<span
								style={{
									color: "#F59E0B",
									fontSize: 80,
									fontWeight: 900,
									lineHeight: 1,
									fontFamily: "JetBrains Mono, monospace",
								}}
							>
								{roast.score.toFixed(1)}
							</span>
							<span
								style={{
									color: "#737373",
									fontSize: 28,
									fontWeight: 400,
									lineHeight: 1,
									fontFamily: "JetBrains Mono, monospace",
								}}
							>
								/10
							</span>
						</div>

						<div
							style={{
								display: "flex",
								alignItems: "center",
								gap: 4,
								height: 20,
								marginBottom: 14,
							}}
						>
							<div
								style={{
									width: 6,
									height: 6,
									borderRadius: "50%",
									backgroundColor: "#EF4444",
								}}
							/>
							<span
								style={{
									color: "#EF4444",
									fontSize: 10,
									fontWeight: 400,
									fontFamily: "JetBrains Mono, monospace",
								}}
							>
								{roast.verdict || "unknown"}
							</span>
						</div>

						<div
							style={{
								color: "#737373",
								fontSize: 8,
								fontWeight: 400,
								fontFamily: "JetBrains Mono, monospace",
								marginBottom: 14,
							}}
						>
							lang: {roast.language} · {roast.code.split("\n").length} lines
						</div>

						<div
							style={{
								color: "#FAFAFA",
								fontSize: 11,
								fontWeight: 400,
								fontFamily: "IBM Plex Mono, monospace",
								textAlign: "center",
								lineHeight: 1.4,
							}}
						>
							&quot;{roast.roastTitle || "No title"}&quot;
						</div>
					</div>

					<button
						type="button"
						onClick={handleDownload}
						disabled={downloading}
						className="rounded bg-accent-green px-6 py-3 font-mono text-sm font-medium text-bg-page transition-colors hover:bg-accent-green/90 disabled:opacity-50"
					>
						{downloading ? "downloading..." : "↓ download image"}
					</button>
				</div>

				<div className="mt-8 text-center">
					<p className="font-mono text-xs text-text-tertiary">
						Click download to save the image
					</p>
				</div>
			</div>
		</div>
	);
}
