import { ImageResponse } from "next/og";

export const runtime = "edge";

export const alt = "DevRoast - Code Review";
export const size = {
	width: 1200,
	height: 630,
};
export const contentType = "image/png";

interface RoastImageProps {
	score: number;
	verdict: string;
	language: string;
	linesCount: number;
	roastTitle: string;
}

export default function RoastImage({
	score,
	verdict,
	language,
	linesCount,
	roastTitle,
}: RoastImageProps) {
	return new ImageResponse(
		<div
			style={{
				backgroundColor: "#0C0C0C",
				width: "100%",
				height: "100%",
				display: "flex",
				flexDirection: "column",
				alignItems: "center",
				justifyContent: "center",
				padding: 64,
			}}
		>
			<div
				style={{
					display: "flex",
					alignItems: "center",
					gap: 8,
					marginBottom: 28,
				}}
			>
				<span
					style={{
						color: "#10B981",
						fontSize: 24,
						fontWeight: 700,
						fontFamily: "JetBrains Mono",
					}}
				>
					&gt;
				</span>
				<span
					style={{
						color: "#FAFAFA",
						fontSize: 20,
						fontWeight: 500,
						fontFamily: "JetBrains Mono",
					}}
				>
					devroast
				</span>
			</div>

			<div
				style={{
					display: "flex",
					alignItems: "baseline",
					gap: 4,
					marginBottom: 28,
				}}
			>
				<span
					style={{
						color: "#F59E0B",
						fontSize: 160,
						fontWeight: 900,
						lineHeight: 1,
						fontFamily: "JetBrains Mono",
					}}
				>
					{score.toFixed(1)}
				</span>
				<span
					style={{
						color: "#737373",
						fontSize: 56,
						fontWeight: 400,
						lineHeight: 1,
						fontFamily: "JetBrains Mono",
					}}
				>
					/10
				</span>
			</div>

			<div
				style={{
					display: "flex",
					alignItems: "center",
					gap: 8,
					marginBottom: 28,
				}}
			>
				<div
					style={{
						width: 12,
						height: 12,
						borderRadius: "50%",
						backgroundColor: "#EF4444",
					}}
				/>
				<span
					style={{
						color: "#EF4444",
						fontSize: 20,
						fontWeight: 400,
						fontFamily: "JetBrains Mono",
					}}
				>
					{verdict}
				</span>
			</div>

			<div
				style={{
					color: "#737373",
					fontSize: 16,
					fontWeight: 400,
					fontFamily: "JetBrains Mono",
					marginBottom: 28,
				}}
			>
				lang: {language} · {linesCount} lines
			</div>

			<div
				style={{
					color: "#FAFAFA",
					fontSize: 22,
					fontWeight: 400,
					fontFamily: "IBM Plex Mono",
					textAlign: "center",
					maxWidth: "100%",
					lineHeight: 1.5,
					display: "-webkit-box",
					WebkitLineClamp: 2,
					WebkitBoxOrient: "vertical",
					overflow: "hidden",
				}}
			>
				"{roastTitle}"
			</div>
		</div>,
		{ ...size },
	);
}
