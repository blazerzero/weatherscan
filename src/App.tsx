import { useEffect, useState } from "react";
import { enrichWithNWS } from "@/api/nws";
import { BottomStrip } from "@/components/BottomStrip";
import { CategoryTicker } from "@/components/CategoryTicker";
import { Chyron } from "@/components/Chyron";
import { ErrorScreen } from "@/components/ErrorScreen";
import { LoadingScreen } from "@/components/LoadingScreen";
import { LocationSearch } from "@/components/LocationSearch";
import { Sidebar } from "@/components/Sidebar";
import { SlidePanel } from "@/components/SlidePanel";
import { useGeolocation } from "@/hooks/useGeolocation";
import { useSlideRotation } from "@/hooks/useSlideRotation";
import { useWeather } from "@/hooks/useWeather";
import type { Coordinates, LocationInfo, SlideType } from "@/types/weather";
import styles from "./App.module.scss";

export function App() {
	const geo = useGeolocation();
	const [manualLocation, setManualLocation] = useState<LocationInfo | null>(
		null,
	);

	const coords: Coordinates | null =
		manualLocation?.coords ?? (geo.status === "success" ? geo.coords : null);

	const { data, isLoading, isError } = useWeather(coords);

	// biome-ignore lint/correctness/useExhaustiveDependencies: coords identity guards against re-enrichment loop
	useEffect(() => {
		if (!manualLocation) return;
		let cancelled = false;
		enrichWithNWS(manualLocation).then((enriched) => {
			if (!cancelled) setManualLocation(enriched);
		});
		return () => {
			cancelled = true;
		};
	}, [manualLocation?.coords.lat, manualLocation?.coords.lon]);

	const showLocationSearch =
		geo.status === "denied" && !manualLocation && !data;
	const activeLocation = data?.location ?? manualLocation ?? null;

	const slides: SlideType[] = [
		"currently",
		"hourly",
		"7day",
		"radar",
		...(data?.alerts && data.alerts.length > 0 ? (["alerts"] as const) : []),
	];
	const { current, index: slideIndex } = useSlideRotation(slides);

	return (
		<div
			className={styles.app}
			style={{
				background:
					"linear-gradient(160deg, #72bde8 0%, #4a9ad0 50%, #3a80bc 100%)",
			}}
		>
			<div className={styles.mainRow}>
				<div className={styles.sidebarCol}>
					{showLocationSearch ? (
						<LocationSearch onLocationFound={(loc) => setManualLocation(loc)} />
					) : (
						<Sidebar
							location={activeLocation}
							current={data?.current ?? null}
							isLoading={isLoading && !data}
						/>
					)}
				</div>

				<div className={styles.contentCol}>
					<CategoryTicker
						city={activeLocation?.city ?? null}
						slides={slides}
						activeIndex={slideIndex}
					/>

					<div className={styles.mainPanel} style={{ background: "#2244b0" }}>
						{isLoading && !data ? (
							<LoadingScreen />
						) : isError ? (
							<ErrorScreen onRetry={() => setManualLocation(null)} />
						) : data ? (
							<SlidePanel data={data} current={current} />
						) : null}
					</div>

					{data && (
						<BottomStrip
							hourly={data.hourly}
							daily={data.daily}
							location={data.location}
						/>
					)}
				</div>
			</div>

			{data && (
				<Chyron localAlerts={data.alerts} locationName={data.location.city} />
			)}

			{data && isLoading && (
				<div
					className={styles.staleIndicator}
					style={{
						background: "rgba(0,0,0,0.55)",
						color: "#99bbdd",
						border: "1px solid #2a44a8",
					}}
				>
					Updating…
				</div>
			)}
		</div>
	);
}
