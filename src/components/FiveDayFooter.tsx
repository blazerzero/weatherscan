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
			<div
				className={styles.header}
				style={{ background: "#c8aa38", borderTop: "2px solid #a08828" }}
			>
				<span className={styles.city} style={{ color: "#0d1f3a" }}>
					{location.city.toUpperCase()}:
				</span>
				<span className={styles.label} style={{ color: "#1a2d7a" }}>
					5 DAY FORECAST
				</span>
			</div>

			<div
				className={styles.columns}
				style={{
					background:
						"linear-gradient(180deg, #8ab4e4 0%, #6090cc 50%, #5080bc 100%)",
				}}
			>
				{days.map((d, i) => {
					const dayLabel = d.date
						.toLocaleDateString("en-US", { weekday: "short", timeZone: tz })
						.toUpperCase();
					return (
						<div
							key={d.date.toISOString()}
							className={styles.column}
							style={{
								borderRight:
									i < days.length - 1 ? "1px solid #3a5888" : undefined,
							}}
						>
							<div
								className={styles.dayHeader}
								style={{ background: i === 0 ? "#9abce8" : "#5a7ec0" }}
							>
								<span className={styles.dayName} style={{ color: "#0a1840" }}>
									{dayLabel}
								</span>
							</div>

							<div className={styles.dayBody}>
								<WeatherIcon
									code={d.conditionCode}
									isDay
									className={styles.icon}
								/>
								<div className={styles.temps}>
									<span className={styles.highTemp} style={{ color: "#0a1428" }}>
										{d.highF}
									</span>
									<span className={styles.lowTemp} style={{ color: "#333333" }}>
										{d.lowF}
									</span>
								</div>
							</div>
						</div>
					);
				})}
			</div>
		</div>
	);
}
