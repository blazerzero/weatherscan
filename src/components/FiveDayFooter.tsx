import { WeatherIcon } from "@/components/WeatherIcon";
import type { DailyForecast, LocationInfo } from "@/types/weather";
import styles from "./FiveDayFooter.module.scss";

interface Props {
	daily: DailyForecast[];
	location: LocationInfo;
}

export function FiveDayFooter({ daily, location }: Props) {
	const tz = location.timezone;
	const currentLocalHour =
		parseInt(
			new Intl.DateTimeFormat("en-US", {
				hour: "numeric",
				hour12: false,
				timeZone: tz,
			}).format(new Date()),
		) % 24;
	const start = currentLocalHour >= 16 ? 1 : 0;
	const days = daily.slice(start, start + 5);

	return (
		<div>
			<div className={styles.header}>
				<span className={styles.city}>{location.city.toUpperCase()}:</span>
				<span className={styles.labelDesktop}>5 DAY FORECAST</span>
				<span className={styles.labelTablet}>3 DAY FORECAST</span>
				<span className={styles.labelMobile}>2 DAY FORECAST</span>
			</div>

			<div className={styles.columns}>
				{days.map((d) => {
					const dayLabel = d.date
						.toLocaleDateString("en-US", { weekday: "short", timeZone: tz })
						.toUpperCase();
					return (
						<div key={d.date.toISOString()} className={styles.column}>
							<div className={styles.dayHeader}>
								<span className={styles.dayName}>{dayLabel}</span>
							</div>

							<div className={styles.dayBody}>
								<WeatherIcon
									code={d.conditionCode}
									isDay
									className={styles.icon}
									size="5rem"
								/>
								<div className={styles.temps}>
									<span className={styles.highTemp}>{d.highF}</span>
									<span className={styles.lowTemp}>{d.lowF}</span>
								</div>
							</div>
						</div>
					);
				})}
			</div>
		</div>
	);
}
