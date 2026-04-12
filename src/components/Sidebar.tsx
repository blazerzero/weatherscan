import { useEffect, useState } from "react";
import { MapContainer, TileLayer } from "react-leaflet";
import { fetchRadarFrames, radarTileUrl } from "@/api/rainviewer";
import { AudioPlayer } from "@/components/AudioPlayer";
import { WeatherIcon } from "@/components/WeatherIcon";
import type { CurrentConditions, LocationInfo } from "@/types/weather";
import "leaflet/dist/leaflet.css";
import styles from "./Sidebar.module.scss";

interface Props {
	location: LocationInfo | null;
	current: CurrentConditions | null;
	isLoading: boolean;
}

export function Sidebar({ location, current, isLoading }: Props) {
	const [now, setNow] = useState(new Date());
	const [radarUrl, setRadarUrl] = useState<string | null>(null);

	useEffect(() => {
		const id = setInterval(() => setNow(new Date()), 1000);
		return () => clearInterval(id);
	}, []);

	useEffect(() => {
		let cancelled = false;
		fetchRadarFrames().then((data) => {
			if (cancelled || !data) return;
			const latest = data.radar.past[data.radar.past.length - 1];
			if (latest) setRadarUrl(radarTileUrl(data.host, latest.path));
		});
		return () => {
			cancelled = true;
		};
	}, []);

	const tz =
		location?.timezone ?? Intl.DateTimeFormat().resolvedOptions().timeZone;
	const city = location?.city ?? "---";

	const timeStr = now.toLocaleTimeString("en-US", {
		timeZone: tz,
		hour: "numeric",
		minute: "2-digit",
		second: "2-digit",
		hour12: true,
	});
	const dateStr = now.toLocaleDateString("en-US", {
		timeZone: tz,
		month: "short",
		day: "numeric",
	});

	const secondaryStat = current
		? `humidity ${current.humidityPct}%`
		: isLoading
			? "acquiring data..."
			: "";

	return (
		<div
			className={styles.sidebar}
			style={{
				background:
					"linear-gradient(160deg, #72bde8 0%, #4a9ad0 50%, #3a80bc 100%)",
			}}
		>
			{/* Decorative circular arc */}
			<svg
				className={styles.decorativeArc}
				style={{
					width: "160%",
					height: "160%",
					right: "-30%",
					top: "-20%",
					opacity: 0.18,
				}}
				viewBox="0 0 400 500"
			>
				<circle
					cx="280"
					cy="180"
					r="220"
					fill="none"
					stroke="white"
					strokeWidth="3"
				/>
				<circle
					cx="280"
					cy="180"
					r="170"
					fill="none"
					stroke="white"
					strokeWidth="1.5"
				/>
			</svg>

			{/* Date / time — top right */}
			<div className={styles.dateTime}>
				<div className={styles.dateTimeInner}>
					<div
						style={{
							color: "#0d1f3a",
							fontSize: "1rem",
							fontWeight: 700,
						}}
					>
						{dateStr}
					</div>
					<div
						style={{
							color: "#0d1f3a",
							fontSize: "1rem",
							fontWeight: 700,
						}}
					>
						{timeStr}
					</div>
				</div>
			</div>

			{/* weatherscan wordmark */}
			<div className={styles.wordmark}>
				<div
					style={{
						color: "#1a5a9a",
						fontSize: "2rem",
						fontWeight: 700,
						letterSpacing: "-0.01em",
						textAlign: "right",
					}}
				>
					weatherscan
				</div>
			</div>

			{/* City name band */}
			<div
				className={styles.cityBand}
				style={{ background: "#c8aa38" }}
			>
				<div
					style={{
						color: "#0d1f3a",
						fontSize: "1.5rem",
						fontWeight: 700,
						textAlign: "center",
					}}
				>
					{city}
				</div>
			</div>

			{/* now / temperature / icon */}
			<div className={styles.currentWeather}>
				<div style={{ color: "#0d1f3a", fontSize: "1.5rem", fontWeight: 900 }}>
					now
				</div>
				<div className={styles.tempRow}>
					<div
						style={{
							color: "#0a1420",
							fontSize: "3.75rem",
							fontWeight: 700,
							lineHeight: 1,
						}}
					>
						{current?.temperatureF ?? "--"}
					</div>
					{current && (
						<WeatherIcon
							code={current.conditionCode}
							isDay={current.isDay}
							className={styles.currentIcon}
						/>
					)}
				</div>
				<div
					style={{ color: "#1a3a6a", fontSize: "1.5rem", marginTop: "0.375rem" }}
				>
					{secondaryStat}
				</div>
			</div>

			{/* Flexible spacer */}
			<div className={styles.spacer} />

			{/* PAST 3 HOURS label + mini radar */}
			<div className={styles.radarSection}>
				<div
					className={styles.radarLabel}
					style={{ background: "rgba(15,25,55,0.75)", color: "#aaccee" }}
				>
					PAST 3 HOURS
				</div>
				<div style={{ height: "9rem", position: "relative" }}>
					{location?.coords ? (
						<MapContainer
							center={[location.coords.lat, location.coords.lon]}
							zoom={6}
							zoomControl={false}
							scrollWheelZoom={false}
							dragging={false}
							doubleClickZoom={false}
							keyboard={false}
							attributionControl={false}
							style={{ height: "100%", width: "100%", background: "#1a2d44" }}
						>
							<TileLayer
								url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
								maxZoom={19}
							/>
							{radarUrl && (
								<TileLayer url={radarUrl} opacity={0.7} maxZoom={18} />
							)}
						</MapContainer>
					) : (
						<div
							className={styles.radarPlaceholder}
							style={{ background: "#1a2d44", color: "#5577aa" }}
						>
							{isLoading ? "loading…" : "no location"}
						</div>
					)}
				</div>
			</div>

			{/* Audio player */}
			<div
				className={styles.audioRow}
				style={{ background: "rgba(10,15,40,0.6)" }}
			>
				<AudioPlayer />
			</div>
		</div>
	);
}
