"use client";

import { useState } from "react";

interface ShareButtonProps {
	roastId: string;
}

export function ShareButton({ roastId }: ShareButtonProps) {
	const [copied, setCopied] = useState(false);

	const handleShare = async () => {
		const url = `${window.location.origin}/result/${roastId}`;
		await navigator.clipboard.writeText(url);
		setCopied(true);
		setTimeout(() => setCopied(false), 2000);
	};

	return (
		<button
			type="button"
			onClick={handleShare}
			className="rounded border border-border-primary px-4 py-2 font-mono text-xs text-text-primary transition-colors hover:bg-bg-surface"
		>
			{copied ? "$ copied!" : "$ share_roast"}
		</button>
	);
}
