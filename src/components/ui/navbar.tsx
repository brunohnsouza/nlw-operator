import Link from "next/link";

export function Navbar() {
	return (
		<header className="flex h-14 items-center justify-between border-b border-border-primary bg-bg-page px-10">
			<Link
				href="/"
				className="flex items-center gap-2 font-mono text-lg font-medium text-text-primary"
			>
				<span className="text-accent-green text-xl font-bold">&gt;</span>
				<span>devroast</span>
			</Link>

			<nav className="flex items-center gap-6">
				<Link
					href="/leaderboard"
					className="font-mono text-sm text-text-secondary hover:text-text-primary transition-colors"
				>
					leaderboard
				</Link>
			</nav>
		</header>
	);
}
