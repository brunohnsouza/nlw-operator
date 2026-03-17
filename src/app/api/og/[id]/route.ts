import { NextResponse } from "next/server";
import RoastImage from "@/components/og/RoastImage";
import { caller } from "@/trpc/server";

export async function GET(
	_request: Request,
	{ params }: { params: Promise<{ id: string }> },
) {
	const { id } = await params;

	try {
		const roast = await caller.roasts.getById({ id });

		if (!roast) {
			return new NextResponse("Roast not found", { status: 404 });
		}

		const { score, verdict, language, roastTitle, code } = roast;
		const linesCount = code.split("\n").length;

		const image = await RoastImage({
			score,
			verdict: verdict || "unknown",
			language: language || "unknown",
			linesCount,
			roastTitle: roastTitle || "No title",
		});

		return new NextResponse(image.body, {
			headers: {
				"Content-Type": "image/png",
				"Cache-Control": "public, max-age=31536000, immutable",
			},
		});
	} catch (error) {
		console.error("Error generating OG image:", error);
		return new NextResponse("Error generating image", { status: 500 });
	}
}
