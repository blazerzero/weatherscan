import { useEffect, useState } from "react";
import { MapContainer, TileLayer } from "react-leaflet";
import { fetchRadarFrames, radarTileUrl } from "@/api/rainviewer";
import { AudioPlayer } from "@/components/AudioPlayer";
import { WeatherIcon } from "@/components/WeatherIcon";
import type { CurrentConditions, LocationInfo } from "@/types/weather";
import "leaflet/dist/leaflet.css";
import styles from "./Sidebar.module.scss";
import { DateTime } from "luxon";

interface Props {
	location: LocationInfo | null;
	current: CurrentConditions | null;
	isLoading: boolean;
}

export function Sidebar({ location, current, isLoading }: Props) {
	const [now, setNow] = useState<DateTime>(DateTime.now());
	const [radarUrl, setRadarUrl] = useState<string | null>(null);

	useEffect(() => {
		const id = setInterval(() => setNow(DateTime.now()), 1000);
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

	const city = location?.city ?? "---";

	const dateStr = now.toFormat("LLL dd");
	const timeStr = now.toFormat("hh:mm:ss a").toLocaleLowerCase();

	const secondaryStat = current
		? `humidity ${current.humidityPct}%`
		: isLoading
			? "acquiring data..."
			: "";

	return (
		<div className={styles.sidebar}>
			{/* Decorative circular arc */}
			<svg className={styles.decorativeArc} viewBox="0 0 400 500">
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
					<div className={styles.dateTimeText}>{dateStr}</div>
					<div className={styles.dateTimeText}>{timeStr}</div>
				</div>
			</div>

			{/* weatherscan wordmark */}
			<div className={styles.wordmark}>
				<div className={styles.wordmarkText}>weatherscan</div>
			</div>

			<div className={styles.currentWeatherWrapper}>
				{/* City name band */}
				<div className={styles.cityBand}>
					<div className={styles.cityName}>{city}</div>
				</div>

				{/* now / temperature / icon */}
				<div className={styles.currentWeather}>
					<div className={styles.nowLabel}>now</div>
					<div className={styles.tempRow}>
						<div className={styles.temperature}>
							{current?.temperatureF ?? "--"}
						</div>
						{current && (
							<WeatherIcon
								code={current.conditionCode}
								isDay={current.isDay}
								className={styles.currentIcon}
								size="7rem"
							/>
						)}
					</div>
					<div className={styles.secondaryStat}>{secondaryStat}</div>
				</div>

				<div className={styles.currentWeatherWrapperShadow} />
			</div>

			{/* PAST 3 HOURS label + mini radar */}
			<div className={styles.radarSection}>
				<div className={styles.radarLabel}>PAST 3 HOURS</div>
				<div className={styles.radarContainer}>
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
							className={styles.radarMap}
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
						<div className={styles.radarPlaceholder}>
							{isLoading ? "loading…" : "no location"}
						</div>
					)}
				</div>
			</div>

			{/* Audio player */}
			<div className={styles.audioRow}>
				<AudioPlayer />
			</div>
		</div>
	);
}
