import cn from "classnames";
import { useEffect, useState } from "react";
import type { DailyForecast, HourlyPoint, LocationInfo } from "@/types/weather";
import styles from "./BottomStrip.module.scss";
import { FiveDayFooter } from "./FiveDayFooter";
import { HourlyFooter } from "./HourlyFooter";

interface Props {
	hourly: HourlyPoint[];
	daily: DailyForecast[];
	location: LocationInfo;
}

export function BottomStrip({ hourly, daily, location }: Props) {
	const [view, setView] = useState<"hourly" | "daily">("hourly");
	const [visible, setVisible] = useState(true);

	useEffect(() => {
		const DISPLAY_MS = 10_000;
		const FADE_MS = 350;
		const timer = setInterval(() => {
			setVisible(false);
			setTimeout(() => {
				setView((v) => (v === "hourly" ? "daily" : "hourly"));
				setVisible(true);
			}, FADE_MS);
		}, DISPLAY_MS);
		return () => clearInterval(timer);
	}, []);

	return (
		<div className={cn(styles.strip, visible && styles.visible)}>
			{view === "hourly" ? (
				<HourlyFooter key="hourly" hourly={hourly} location={location} />
			) : (
				<FiveDayFooter key="daily" daily={daily} location={location} />
			)}
		</div>
	);
}
