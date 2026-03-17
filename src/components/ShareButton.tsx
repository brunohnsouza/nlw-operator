"use client";

import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";

interface ShareButtonProps {
	roastId: string;
}

export function ShareButton({ roastId }: ShareButtonProps) {
	const router = useRouter();

	const handleShare = () => {
		router.push(`/share/${roastId}`);
	};

	return (
		<Button variant="outline" size="sm" onClick={handleShare}>
			$ share_roast
		</Button>
	);
}
