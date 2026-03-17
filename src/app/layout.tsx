import "./globals.css";

import { Suspense } from "react";
import { Navbar } from "@/components/ui/navbar";
import { TRPCReactProvider } from "@/trpc/client";

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body className="bg-bg-page">
				<TRPCReactProvider>
					<Navbar />
					<Suspense fallback={null}>
						<main>{children}</main>
					</Suspense>
				</TRPCReactProvider>
			</body>
		</html>
	);
}
