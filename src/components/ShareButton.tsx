"use client";

import { useRouter } from "next/navigation";

interface ShareButtonProps {
	roastId: string;
}

export function ShareButton({ roastId }: ShareButtonProps) {
	const router = useRouter();

	const handleShare = () => {
		router.push(`/share/${roastId}`);
	};

	return (
		<button
			type="button"
			onClick={handleShare}
			className="rounded border border-border-primary px-4 py-2 font-mono text-xs text-text-primary transition-colors hover:bg-bg-surface"
		>
			$ share_roast
		</button>
	);
}
