import cn from "classnames";
import { type ReactNode, useEffect, useRef, useState } from "react";
import type { MainPanelSlideType, WeatherData } from "@/types/weather";
import { AlertsSlide } from "./AlertsSlide";
import { CurrentConditions } from "./CurrentConditions";
import { RadarSlide } from "./RadarSlide";
import { SevenDayForecast } from "./SevenDayForecast";
import { SlideHeader } from "./SlideHeader";
import styles from "./SlidePanel.module.scss";

interface Props {
	data: WeatherData;
	current: MainPanelSlideType;
}

const FORECAST_TITLE = (
	<>
		<span className={styles.title7desktop}>7-Day Forecast</span>
		<span className={styles.title7tablet}>5-Day Forecast</span>
		<span className={styles.title7mobile}>3-Day Forecast</span>
	</>
);

const SLIDE_TITLES: Record<MainPanelSlideType, ReactNode> = {
	currently: "Currently",
	"7day": FORECAST_TITLE,
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

	return (
		<section className={styles.panel}>
			{/* Shared slide header */}
			<SlideHeader
				title={
					current === "alerts" && data.alerts.length > 0
						? `Active Alerts (${data.alerts.length})`
						: SLIDE_TITLES[current]
				}
				alert={current === "alerts"}
			/>

			{/* Slide content */}
			<div className={cn(styles.content, visible && styles.visible)}>
				{current === "currently" && <CurrentConditions data={data.current} />}
				{current === "7day" && <SevenDayForecast data={data.daily} />}
				{current === "radar" && <RadarSlide coords={data.location.coords} />}
				{current === "alerts" && <AlertsSlide alerts={data.alerts} />}
			</div>
		</section>
	);
}
