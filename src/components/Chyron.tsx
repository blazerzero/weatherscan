import { useMemo } from "react";
import { useNationalHeadlines } from "@/hooks/useAlerts";
import type { WeatherAlert } from "@/types/weather";

interface Props {
	localAlerts: WeatherAlert[];
	locationName: string;
}

const FALLBACK_HEADLINES = [
	"WeatherScan — Your local weather, always on.",
	"Visit weather.gov for official forecasts and warnings.",
	"Have a weather emergency? Call 911.",
	"Turn around, don't drown — never drive through flooded roads.",
	"Lightning safety: if thunder roars, go indoors.",
	"Stay weather-aware — sign up for local emergency alerts.",
];

export function Chyron({ localAlerts, locationName }: Props) {
	const { data: nationalHeadlines } = useNationalHeadlines();

	const items = useMemo(() => {
		const localItems = localAlerts.map(
			(a) => `⚠ ${a.event.toUpperCase()} — ${a.areaDesc}: ${a.headline}`,
		);
		const nationalItems = (nationalHeadlines ?? []).map((h) => `🌐 ${h}`);
		const combined = [...localItems, ...nationalItems];
		return combined.length > 0 ? combined : FALLBACK_HEADLINES;
	}, [localAlerts, nationalHeadlines]);

	const text = items.join("   ·   ");
	const doubled = `${text}   ·   ${text}`;

	const hasAlerts = localAlerts.length > 0;

	return (
		<div
			className="flex items-center shrink-0 overflow-hidden"
			style={{
				height: "2.25rem",
				background: "#484848",
				borderTop: "2px solid #606060",
			}}
		>
			{/* Station logo zone */}
			<div
				className="shrink-0 h-full flex items-center justify-center px-3 gap-1.5"
				style={{
					background: "#333333",
					borderRight: "2px solid #606060",
					minWidth: "7rem",
				}}
			>
				<div
					className="text-sm font-bold uppercase tracking-widest leading-tight text-center"
					style={{ color: hasAlerts ? "#ffcc00" : "#cccccc" }}
				>
					{hasAlerts ? "⚠ ALERT" : locationName.toUpperCase()}
				</div>
			</div>

			{/* Arrow separator */}
			<div
				className="shrink-0 text-sm"
				style={{ color: "#888888", padding: "0 0.25rem" }}
			>
				▶
			</div>

			{/* Scrolling text */}
			<div className="flex-1 overflow-hidden h-full flex items-center">
				<div
					className="chyron-track text-sm font-bold whitespace-nowrap"
					style={{
						color: hasAlerts ? "#ffcc00" : "#e8e8e8",
						letterSpacing: "0.04em",
					}}
				>
					{doubled}
				</div>
			</div>
		</div>
	);
}
