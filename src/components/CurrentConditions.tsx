import { COLORS } from "@/lib/constants";
import type { CurrentConditions as CC } from "@/types/weather";
import { WeatherIcon } from "./WeatherIcon";
import styles from "./CurrentConditions.module.scss";

interface Props {
	data: CC;
}

export function CurrentConditions({ data }: Props) {
	const windStr =
		data.windSpeedMph === 0
			? "Calm"
			: `${data.windDirCardinal} ${data.windSpeedMph}`;
	const gustStr = data.windGustMph ? String(data.windGustMph) : "none";

	const rows = [
		{ label: "Humidity", value: `${data.humidityPct}%` },
		{ label: "Dew Point", value: `${data.dewpointF}` },
		{ label: "Pressure", value: `${data.pressureInHg} ↓` },
		{ label: "Wind", value: windStr },
		{ label: "Gusts", value: gustStr },
		{ label: "Wind Chill", value: `${data.feelsLikeF}` },
	];

	return (
		<div className={styles.container}>
			{/* Left column — labeled data rows */}
			<div className={styles.dataCol}>
				{rows.map(({ label, value }) => (
					<div
						key={label}
						className={styles.dataRow}
						style={{
							borderBottom: "1px solid rgba(255,255,255,0.1)",
						}}
					>
						<span
							className={styles.dataLabel}
							style={{ color: COLORS.gold }}
						>
							{label}
						</span>
						<span
							className={styles.dataValue}
							style={{ color: "#ffffff" }}
						>
							{value}
						</span>
					</div>
				))}
			</div>

			{/* Vertical divider */}
			<div
				style={{
					width: "1px",
					background: "rgba(255,255,255,0.15)",
					margin: "1rem 0",
				}}
			/>

			{/* Right column — icon + condition label + large temp */}
			<div className={styles.iconCol}>
				<WeatherIcon
					code={data.conditionCode}
					isDay={data.isDay}
					className={styles.conditionIcon}
				/>
				<div
					className={styles.conditionLabel}
					style={{ color: "#ffffff" }}
				>
					{data.conditionLabel}
				</div>
				<div
					className={styles.temperature}
					style={{
						color: "#ffffff",
						textShadow: "0 2px 16px rgba(80,130,255,0.4)",
					}}
				>
					{data.temperatureF}
				</div>
			</div>
		</div>
	);
}
