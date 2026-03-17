import { notFound } from "next/navigation";
import { ShareContent } from "@/components/ShareContent";
import { caller } from "@/trpc/server";

interface PageProps {
	params: Promise<{ id: string }>;
}

export default async function SharePage({ params }: PageProps) {
	const { id } = await params;

	const roast = await caller.roasts.getById({ id }).catch(() => null);

	if (!roast) {
		notFound();
	}

	return <ShareContent roast={roast} />;
}
