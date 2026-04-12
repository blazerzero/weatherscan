import { COLORS } from "@/lib/constants";
import type { HourlyPoint } from "@/types/weather";
import { WeatherIcon } from "./WeatherIcon";
import styles from "./HourlyForecast.module.scss";

interface Props {
	data: HourlyPoint[];
	timezone?: string;
}

export function HourlyForecast({ data, timezone }: Props) {
	const tz = timezone ?? Intl.DateTimeFormat().resolvedOptions().timeZone;
	const hours = data.slice(0, 12);

	return (
		<div className={styles.container}>
			<div className={styles.list}>
				{hours.map((h, i) => {
					const timeStr = h.time.toLocaleTimeString("en-US", {
						hour: "numeric",
						hour12: true,
						timeZone: tz,
					});
					const isNow = i === 0;
					return (
						<div
							key={h.time.toISOString()}
							className={styles.row}
							style={{
								borderBottom: `1px solid ${COLORS.border}`,
								background: isNow ? "rgba(42,82,188,0.4)" : undefined,
							}}
						>
							<span
								className={styles.time}
								style={{
									color: isNow ? COLORS.gold : COLORS.textSecondary,
								}}
							>
								{isNow ? "NOW" : timeStr}
							</span>
							<WeatherIcon
								code={h.conditionCode}
								isDay={h.isDay}
								className={styles.icon}
							/>
							<span
								className={styles.condition}
								style={{ color: COLORS.textDim }}
							>
								{h.conditionLabel}
							</span>
							<span
								className={styles.temp}
								style={{ color: COLORS.textPrimary }}
							>
								{h.tempF}
							</span>
							{h.precipChancePct > 0 && (
								<span
									className={styles.precip}
									style={{ color: COLORS.blueAccent }}
								>
									{h.precipChancePct}%
								</span>
							)}
							{h.precipChancePct === 0 && <span className={styles.precipSpacer} />}
						</div>
					);
				})}
			</div>
		</div>
	);
}
