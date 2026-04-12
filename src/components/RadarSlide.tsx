import { useEffect, useState } from "react";
import { MapContainer, TileLayer } from "react-leaflet";
import { fetchRadarFrames, radarTileUrl } from "@/api/rainviewer";
import type { Coordinates } from "@/types/weather";
import "leaflet/dist/leaflet.css";
import styles from "./RadarSlide.module.scss";

interface Props {
	coords: Coordinates;
}

export function RadarSlide({ coords }: Props) {
	const [radarUrl, setRadarUrl] = useState<string | null>(null);

	useEffect(() => {
		let cancelled = false;
		fetchRadarFrames().then((data) => {
			if (cancelled || !data) return;
			// Use the most recent past frame
			const past = data.radar.past;
			const latest = past[past.length - 1];
			if (latest) {
				setRadarUrl(radarTileUrl(data.host, latest.path));
			}
		});
		return () => {
			cancelled = true;
		};
	}, []);

	return (
		<div className={styles.container}>
			<div className={styles.mapArea}>
				<MapContainer
					center={[coords.lat, coords.lon]}
					zoom={7}
					zoomControl={false}
					scrollWheelZoom={false}
					dragging={false}
					doubleClickZoom={false}
					keyboard={false}
					attributionControl={false}
					className={styles.map}
				>
					<TileLayer
						url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
						maxZoom={19}
					/>
					{radarUrl && <TileLayer url={radarUrl} opacity={0.7} maxZoom={18} />}
				</MapContainer>

				{!radarUrl && (
					<div className={styles.loadingOverlay}>Loading radar...</div>
				)}
			</div>
		</div>
	);
}
