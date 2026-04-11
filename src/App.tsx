import { useState, useEffect } from "react";
import { useGeolocation } from "./hooks/useGeolocation";
import { useWeather } from "./hooks/useWeather";
import { Header } from "./components/Header";
import { CurrentConditions } from "./components/CurrentConditions";
import { SlidePanel } from "./components/SlidePanel";
import { Chyron } from "./components/Chyron";
import { AudioPlayer } from "./components/AudioPlayer";
import { LocationSearch } from "./components/LocationSearch";
import type { Coordinates, LocationInfo } from "./types/weather";
import { enrichWithNWS } from "./api/nws";

export function App() {
	const geo = useGeolocation();

	// Allow manual override from the location search form
	const [manualLocation, setManualLocation] = useState<LocationInfo | null>(
		null,
	);

	const coords: Coordinates | null =
		manualLocation?.coords ?? (geo.status === "success" ? geo.coords : null);

	const { data, isLoading, isError } = useWeather(coords);

	// When manual location is selected, enrich it with NWS data
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

	const showLocationSearch = geo.status === "denied" && !manualLocation;

	return (
		<div
			className="scanlines flex flex-col h-screen w-screen overflow-hidden relative"
			style={{
				background:
					"linear-gradient(180deg, #000d1a 0%, #001433 60%, #000d1a 100%)",
			}}
		>
			{/* Header bar */}
			<Header location={data?.location ?? manualLocation ?? null} />

			{/* Audio player (top-right corner) */}
			<div
				className="absolute top-1 right-[7rem] z-20"
				style={{ top: "0.3rem" }}
			>
				<AudioPlayer />
			</div>

			{/* Main content area */}
			<div className="flex flex-1 overflow-hidden">
				{showLocationSearch ? (
					<LocationSearch onLocationFound={(loc) => setManualLocation(loc)} />
				) : isLoading && !data ? (
					<LoadingScreen />
				) : isError ? (
					<ErrorScreen onRetry={() => setManualLocation(null)} />
				) : data ? (
					<>
						{/* Left panel — current conditions (fixed width) */}
						<div className="flex flex-col shrink-0" style={{ width: "14rem" }}>
							<CurrentConditions data={data.current} />
						</div>

						{/* Divider */}
						<div
							style={{
								width: "2px",
								background:
									"linear-gradient(180deg, #1a4070 0%, #003366 50%, #1a4070 100%)",
							}}
						/>

						{/* Right panel — rotating slides */}
						<div className="flex-1 overflow-hidden">
							<SlidePanel data={data} />
						</div>
					</>
				) : null}
			</div>

			{/* Chyron */}
			{data && (
				<Chyron localAlerts={data.alerts} locationName={data.location.city} />
			)}

			{/* Stale data indicator */}
			{data && isLoading && (
				<div
					className="absolute top-12 right-2 text-xs px-2 py-0.5 rounded"
					style={{
						background: "rgba(0,0,0,0.6)",
						color: "#557799",
						border: "1px solid #1a4070",
					}}
				>
					Updating...
				</div>
			)}
		</div>
	);
}

function LoadingScreen() {
	return (
		<div className="flex flex-col items-center justify-center flex-1 gap-4">
			<div
				className="text-2xl font-bold tracking-widest uppercase animate-pulse"
				style={{ color: "#00aaff" }}
			>
				Acquiring Data...
			</div>
			<div className="text-xs" style={{ color: "#557799" }}>
				Fetching conditions for your location
			</div>
		</div>
	);
}

function ErrorScreen({ onRetry }: { onRetry: () => void }) {
	return (
		<div className="flex flex-col items-center justify-center flex-1 gap-4">
			<div className="text-2xl font-bold" style={{ color: "#ff3300" }}>
				Unable to Load Weather
			</div>
			<div className="text-xs" style={{ color: "#557799" }}>
				Check your connection and try again.
			</div>
			<button
				onClick={onRetry}
				className="px-4 py-1.5 rounded text-sm font-bold uppercase tracking-wider cursor-pointer"
				style={{
					background: "#003366",
					color: "#00aaff",
					border: "1px solid #0055a0",
				}}
			>
				Retry
			</button>
		</div>
	);
}
