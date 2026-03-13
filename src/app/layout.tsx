import "./globals.css";

import { Navbar } from "@/components/ui/navbar";

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body className="bg-bg-page">
				<Navbar />
				<main>{children}</main>
			</body>
		</html>
	);
}
