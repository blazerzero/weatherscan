import { WeatherIcon } from "@/components/WeatherIcon";
import type { HourlyPoint, LocationInfo } from "@/types/weather";
import styles from "./HourlyFooter.module.scss";

interface Props {
	hourly: HourlyPoint[];
	location: LocationInfo;
}

export function HourlyFooter({ hourly, location }: Props) {
	const tz = location.timezone;

	// Pick up to 4 slots from the target hours that are at least 3 hours away
	const currentLocalHour =
		parseInt(
			new Intl.DateTimeFormat("en-US", {
				hour: "numeric",
				hour12: false,
				timeZone: tz,
			}).format(new Date()),
		) % 24;
	const TARGET_HOURS = new Set(
		currentLocalHour >= 20 ? [6, 12, 15, 17, 20] : [0, 6, 12, 15, 17, 20],
	);
	const minTime = Date.now() + 3 * 60 * 60 * 1000;
	const slots = hourly
		.filter((h) => {
			if (h.time.getTime() < minTime) return false;
			const localHour =
				parseInt(
					new Intl.DateTimeFormat("en-US", {
						hour: "numeric",
						hour12: false,
						timeZone: tz,
					}).format(h.time),
				) % 24;
			return TARGET_HOURS.has(localHour);
		})
		.slice(0, 4);

	const firstTime = slots[0]?.time;
	const dayName = firstTime
		? firstTime
				.toLocaleDateString("en-US", { weekday: "long", timeZone: tz })
				.toUpperCase()
		: "TODAY";

	const temps = slots.map((h) => h.tempF);
	const minT = Math.min(...temps);
	const maxT = Math.max(...temps);
	const tempRange = maxT - minT || 1;
	const BAR_MIN = 20;
	const BAR_MAX = 72;

	return (
		<div>
			<div className={styles.header}>
				<span className={styles.city}>{location.city.toUpperCase()}:</span>
				<span className={styles.label}>{dayName}'S FORECAST</span>
			</div>

			<div className={styles.columns}>
				{slots.map((h, i) => {
					const rawHour = h.time.toLocaleTimeString("en-US", {
						timeZone: tz,
						hour: "numeric",
						hour12: true,
					});
					const timeLabel =
						rawHour === "12 PM" ? "noon" : rawHour.toLowerCase();

					const barH =
						BAR_MIN + ((h.tempF - minT) / tempRange) * (BAR_MAX - BAR_MIN);

					return (
						<div key={h.time.toISOString()} className={styles.column}>
							<div className={styles.slotBody}>
								<WeatherIcon
									code={h.conditionCode}
									isDay={h.isDay}
									className={styles.icon}
									size="7rem"
								/>
								<div className={styles.tempBar}>
									<span className={styles.temp}>{h.tempF}</span>
									<div
										className={styles.bar}
										style={
											{
												"--bar-h": `${barH}px`,
												"--bar-delay": `${i * 120}ms`,
											} as React.CSSProperties
										}
									/>
								</div>
							</div>

							<div className={styles.timeBand}>
								<span className={styles.timeLabel}>{timeLabel}</span>
							</div>
						</div>
					);
				})}
			</div>
		</div>
	);
}
