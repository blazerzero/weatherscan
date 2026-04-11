import { useEffect, useRef, useState } from "react";
import type { WeatherData, SlideType } from "../types/weather";
import { useSlideRotation } from "../hooks/useSlideRotation";
import { HourlyForecast } from "./HourlyForecast";
import { SevenDayForecast } from "./SevenDayForecast";
import { RadarSlide } from "./RadarSlide";
import { AlertsSlide } from "./AlertsSlide";

interface Props {
	data: WeatherData;
}

const SLIDE_LABELS: Record<SlideType, string> = {
	hourly: "HRLY",
	"7day": "7DAY",
	radar: "RADAR",
	alerts: "ALRT",
};

export function SlidePanel({ data }: Props) {
	const slides: SlideType[] = [
		"hourly",
		"7day",
		"radar",
		...(data.alerts.length > 0 ? ["alerts" as const] : []),
	];

	const { current, index, goTo } = useSlideRotation(slides);
	const [visible, setVisible] = useState(true);
	const prevSlide = useRef(current);

	// Crossfade when slide changes
	useEffect(() => {
		if (current === prevSlide.current) return;
		setVisible(false);
		const timer = setTimeout(() => {
			prevSlide.current = current;
			setVisible(true);
		}, 300);
		return () => clearTimeout(timer);
	}, [current]);

	return (
		<section className="flex flex-col h-full">
			{/* Slide content */}
			<div
				className="flex-1 overflow-hidden"
				style={{
					opacity: visible ? 1 : 0,
					transition: "opacity 0.3s ease",
				}}
			>
				{current === "hourly" && <HourlyForecast data={data.hourly} />}
				{current === "7day" && <SevenDayForecast data={data.daily} />}
				{current === "radar" && <RadarSlide coords={data.location.coords} />}
				{current === "alerts" && <AlertsSlide alerts={data.alerts} />}
			</div>

			{/* Tab bar */}
			<div className="flex shrink-0" style={{ borderTop: "2px solid #1a4070" }}>
				{slides.map((slide, i) => {
					const active = i === index;
					const isAlert = slide === "alerts";
					return (
						<button
							key={slide}
							onClick={() => goTo(i)}
							className="flex-1 py-1 text-xs font-bold tracking-widest uppercase cursor-pointer transition-all"
							style={{
								background: active ? "#003366" : "transparent",
								color: active ? (isAlert ? "#ff8800" : "#00aaff") : "#557799",
								borderRight:
									i < slides.length - 1 ? "1px solid #1a4070" : undefined,
								textShadow: active ? "0 0 8px currentColor" : undefined,
								border: "none",
								outline: "none",
							}}
						>
							{isAlert && data.alerts.length > 0
								? `⚠ ${SLIDE_LABELS[slide]}`
								: SLIDE_LABELS[slide]}
						</button>
					);
				})}
			</div>
		</section>
	);
}
