import { COLORS } from "@/lib/constants";
import type { DailyForecast } from "@/types/weather";
import { WeatherIcon } from "./WeatherIcon";
import styles from "./SevenDayForecast.module.scss";

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
					<div
						key={d.date.toISOString()}
						className={styles.dayCol}
						style={{
							borderRight:
								i < days.length - 1 ? `1px solid ${COLORS.borderDark}` : "none",
						}}
					>
						{/* Day name header */}
						<div
							className={styles.dayHeader}
							style={{
								background: COLORS.panelMid,
								color: i === 0 ? COLORS.gold : COLORS.textPrimary,
							}}
						>
							{dayLabel}
						</div>

						{/* Icon + condition area */}
						<div
							className={styles.iconArea}
							style={{ background: COLORS.panelBg }}
						>
							<WeatherIcon code={d.conditionCode} isDay className={styles.icon} />
							<span
								className={styles.conditionLabel}
								style={{ color: COLORS.textPrimary }}
							>
								{d.conditionLabel}
							</span>
						</div>

						{/* High temp */}
						<div
							className={styles.highTemp}
							style={{ background: COLORS.blueBright }}
						>
							<span
								className={styles.highTempValue}
								style={{ color: COLORS.textPrimary }}
							>
								{d.highF}
							</span>
						</div>

						{/* Low temp */}
						<div
							className={styles.lowTemp}
							style={{ background: COLORS.panelDark }}
						>
							<span
								className={styles.lowTempValue}
								style={{ color: COLORS.textSecondary }}
							>
								{d.lowF}
							</span>
						</div>
					</div>
				);
			})}
		</div>
	);
}
