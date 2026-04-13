import type { CurrentConditions as CC } from "@/types/weather";
import styles from "./CurrentConditions.module.scss";
import { WeatherIcon } from "./WeatherIcon";

interface Props {
	data: CC;
}

export function CurrentConditions({ data }: Props) {
	const windStr =
		data.windSpeedMph === 0
			? "Calm"
			: `${data.windDirCardinal} ${data.windSpeedMph} mph`;
	const gustStr = data.windGustMph ? `${data.windGustMph} mph` : "none";

	const rows = [
		{ label: "Humidity", value: `${data.humidityPct}%` },
		{ label: "Dew Point", value: `${data.dewpointF}º` },
		{ label: "Pressure", value: `${data.pressureInHg} ↓` },
		{ label: "Wind", value: windStr },
		{ label: "Gusts", value: gustStr },
		{ label: "Wind Chill", value: `${data.feelsLikeF}º` },
	];

	return (
		<div className={styles.container}>
			{/* Left column — labeled data rows */}
			<div className={styles.dataCol}>
				{rows.map(({ label, value }) => (
					<div key={label} className={styles.dataRow}>
						<span className={styles.dataLabel}>{label}</span>
						<span className={styles.dataValue}>{value}</span>
					</div>
				))}
			</div>

			{/* Vertical divider */}
			<div className={styles.divider} />

			{/* Right column — icon + condition label + large temp */}
			<div className={styles.iconCol}>
				<WeatherIcon
					code={data.conditionCode}
					isDay={data.isDay}
					className={styles.conditionIcon}
					size="6rem"
				/>
				<div className={styles.conditionLabel}>{data.conditionLabel}</div>
				<div className={styles.temperature}>{data.temperatureF}</div>
			</div>
		</div>
	);
}
