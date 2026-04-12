import type { DailyForecast } from "@/types/weather";
import styles from "./SevenDayForecast.module.scss";
import { WeatherIcon } from "./WeatherIcon";

interface Props {
	data: DailyForecast[];
}

export function SevenDayForecast({ data }: Props) {
	const days = data.slice(0, 7);

	return (
		<div className={styles.container}>
			{days.map((d, i) => {
				const dayLabel =
					i === 0
						? "Today"
						: d.date.toLocaleDateString("en-US", { weekday: "short" });

				return (
					<div key={d.date.toISOString()} className={styles.dayCol}>
						{/* Day name header */}
						<div className={styles.dayHeader}>{dayLabel}</div>

						{/* Icon + condition area */}
						<div className={styles.iconArea}>
							<WeatherIcon
								code={d.conditionCode}
								isDay
								className={styles.icon}
								size="8rem"
							/>
							<span className={styles.conditionLabel}>{d.conditionLabel}</span>
						</div>

						{/* High temp */}
						<div className={styles.highTemp}>
							<span className={styles.highTempValue}>{d.highF}</span>
						</div>

						{/* Low temp */}
						<div className={styles.lowTemp}>
							<span className={styles.lowTempValue}>{d.lowF}</span>
						</div>
					</div>
				);
			})}
		</div>
	);
}
