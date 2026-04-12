import { useNationalHeadlines } from "@/hooks/useAlerts";
import type { WeatherAlert } from "@/types/weather";
import cn from "classnames";
import { useMemo } from "react";
import styles from "./Chyron.module.scss";

interface Props {
	localAlerts: WeatherAlert[];
	locationName: string;
}

const FALLBACK_HEADLINES = [
	"Weatherscan — Your local weather, always on.",
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

	const text = items.join(" • ");
	const doubled = `${text} • ${text}`;

	const hasAlerts = localAlerts.length > 0;

	return (
		<div className={styles.chyron}>
			{/* Station logo zone */}
			<div className={styles.logoZone}>
				<div className={cn(styles.stationName, hasAlerts && styles.hasAlerts)}>
					{hasAlerts ? "⚠ ALERT" : locationName.toUpperCase()}
				</div>
			</div>

			{/* Arrow separator */}
			<div className={styles.arrow}>▶</div>

			{/* Scrolling text */}
			<div className={styles.scrollArea}>
				<div
					data-testid="chyron-track"
					className={cn(styles.scrollTrack, hasAlerts && styles.hasAlerts)}
				>
					{doubled}
				</div>
			</div>
		</div>
	);
}
