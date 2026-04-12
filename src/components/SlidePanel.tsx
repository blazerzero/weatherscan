import { useEffect, useRef, useState } from "react";
import type { WeatherData, SlideType } from "@/types/weather";
import { AlertsSlide } from "./AlertsSlide";
import { CurrentConditions } from "./CurrentConditions";
import { HourlyForecast } from "./HourlyForecast";
import { RadarSlide } from "./RadarSlide";
import { SevenDayForecast } from "./SevenDayForecast";
import { SlideHeader } from "./SlideHeader";

interface Props {
	data: WeatherData;
	current: SlideType;
}

const SLIDE_TITLES: Record<SlideType, string> = {
	currently: "Currently",
	hourly: "Hourly Forecast",
	"7day": "7-Day Forecast",
	radar: "Local Radar",
	alerts: "Active Alerts",
};

export function SlidePanel({ data, current }: Props) {
	const [visible, setVisible] = useState(true);
	const prevSlide = useRef(current);

	useEffect(() => {
		if (current === prevSlide.current) return;
		setVisible(false);
		const timer = setTimeout(() => {
			prevSlide.current = current;
			setVisible(true);
		}, 300);
		return () => clearTimeout(timer);
	}, [current]);

	const city = data.location.city;

	return (
		<section className="flex flex-col h-full">
			{/* Shared slide header */}
			<SlideHeader
				title={
					current === "alerts" && data.alerts.length > 0
						? `Active Alerts (${data.alerts.length})`
						: SLIDE_TITLES[current]
				}
				city={city}
				alert={current === "alerts"}
			/>

			{/* Slide content */}
			<div
				className="flex-1 overflow-hidden"
				style={{ opacity: visible ? 1 : 0, transition: "opacity 0.3s ease" }}
			>
				{current === "currently" && <CurrentConditions data={data.current} />}
				{current === "hourly" && <HourlyForecast data={data.hourly} timezone={data.location.timezone} />}
				{current === "7day" && <SevenDayForecast data={data.daily} />}
				{current === "radar" && <RadarSlide coords={data.location.coords} />}
				{current === "alerts" && <AlertsSlide alerts={data.alerts} />}
			</div>
		</section>
	);
}
