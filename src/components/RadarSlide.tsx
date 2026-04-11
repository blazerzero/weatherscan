import { useEffect, useState } from "react";
import { MapContainer, TileLayer } from "react-leaflet";
import type { Coordinates } from "../types/weather";
import { fetchRadarFrames, radarTileUrl } from "../api/rainviewer";
import { COLORS } from "../lib/constants";
import { SlideHeader } from "./SlideHeader";
import "leaflet/dist/leaflet.css";

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
		<div className="flex flex-col h-full">
			<SlideHeader title="Local Radar" />
			<div className="flex-1 relative">
				<MapContainer
					center={[coords.lat, coords.lon]}
					zoom={7}
					zoomControl={false}
					scrollWheelZoom={false}
					dragging={false}
					doubleClickZoom={false}
					keyboard={false}
					attributionControl={false}
					style={{ height: "100%", width: "100%", background: COLORS.blueDark }}
				>
					<TileLayer
						url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
						maxZoom={19}
					/>
					{radarUrl && <TileLayer url={radarUrl} opacity={0.7} maxZoom={18} />}
				</MapContainer>

				{!radarUrl && (
					<div
						className="absolute inset-0 flex items-center justify-center text-sm"
						style={{ color: COLORS.textDim, pointerEvents: "none" }}
					>
						Loading radar...
					</div>
				)}
			</div>
		</div>
	);
}
