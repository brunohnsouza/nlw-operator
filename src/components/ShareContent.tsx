"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

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
	const imageUrl = `/api/og/${roast.id}`;

	const handleDownload = async () => {
		setDownloading(true);
		try {
			const response = await fetch(imageUrl);
			const blob = await response.blob();
			const url = window.URL.createObjectURL(blob);
			const a = document.createElement("a");
			a.href = url;
			a.download = `devroast-${roast.id}.png`;
			document.body.appendChild(a);
			a.click();
			window.URL.revokeObjectURL(url);
			document.body.removeChild(a);
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
					<div className="overflow-hidden rounded-lg border border-border-primary">
						<Image
							src={imageUrl}
							alt={`Roast: ${roast.roastTitle}`}
							width={1200}
							height={630}
							className="max-w-full h-auto"
						/>
					</div>

					<div className="flex gap-4">
						<button
							type="button"
							onClick={handleDownload}
							disabled={downloading}
							className="rounded bg-accent-green px-6 py-3 font-mono text-sm font-medium text-bg-page transition-colors hover:bg-accent-green/90 disabled:opacity-50"
						>
							{downloading ? "downloading..." : "↓ download image"}
						</button>
						<button
							type="button"
							onClick={() => {
								navigator.clipboard.writeText(window.location.href);
							}}
							className="rounded border border-border-primary px-6 py-3 font-mono text-sm text-text-primary transition-colors hover:bg-bg-surface"
						>
							$ copy link
						</button>
					</div>
				</div>

				<div className="mt-8 text-center">
					<p className="font-mono text-xs text-text-tertiary">
						Share this image on social media to show off your code review
					</p>
				</div>
			</div>
		</div>
	);
}
