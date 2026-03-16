"use client";

import NumberFlow from "@number-flow/react";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useTRPC } from "@/trpc/client";

function MetricsDisplay({
	totalRoasted,
	avgScore,
}: {
	totalRoasted: number;
	avgScore: number;
}) {
	return (
		<div className="flex justify-center gap-6">
			<span className="font-mono text-xs text-text-tertiary">
				<NumberFlow value={totalRoasted} format={{ notation: "compact" }} />
				{" codes roasted"}
			</span>
			<span className="font-mono text-xs text-text-tertiary">·</span>
			<span className="font-mono text-xs text-text-tertiary">
				{"avg score: "}
				<NumberFlow
					value={avgScore}
					format={{ minimumFractionDigits: 1, maximumFractionDigits: 1 }}
				/>
				<span>{"/10"}</span>
			</span>
		</div>
	);
}

export function MetricsSection() {
	const trpc = useTRPC();
	const { data } = useQuery(trpc.metrics.getStats.queryOptions());

	// Forçar animação: iniciar com 0 e só atualizar quando dados chegarem
	const [displayData, setDisplayData] = useState({
		totalRoasted: 0,
		avgScore: 0,
	});

	useEffect(() => {
		if (data) {
			setDisplayData({
				totalRoasted: data.totalRoasted,
				avgScore: data.avgScore,
			});
		}
	}, [data]);

	return (
		<MetricsDisplay
			totalRoasted={displayData.totalRoasted}
			avgScore={displayData.avgScore}
		/>
	);
}
