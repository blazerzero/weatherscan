import { COLORS } from "@/lib/constants";
import type { CurrentConditions as CC } from "@/types/weather";
import { WeatherIcon } from "./WeatherIcon";

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
		<div className="flex h-full">
			{/* Left column — labeled data rows */}
			<div
				className="flex flex-col justify-center gap-0 px-5 py-4"
				style={{ flex: "0 0 55%" }}
			>
				{rows.map(({ label, value }) => (
					<div
						key={label}
						className="flex items-baseline justify-between py-1"
						style={{
							borderBottom: "1px solid rgba(255,255,255,0.1)",
						}}
					>
						<span
							className="font-bold text-base"
							style={{ color: COLORS.gold, minWidth: "7rem" }}
						>
							{label}
						</span>
						<span
							className="font-bold text-base text-right"
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
			<div className="flex flex-col items-center justify-center gap-3 flex-1 px-4">
				<WeatherIcon
					code={data.conditionCode}
					isDay={data.isDay}
					className="text-6xl leading-none"
				/>
				<div
					className="text-base font-bold text-center"
					style={{ color: "#ffffff" }}
				>
					{data.conditionLabel}
				</div>
				<div
					className="font-bold leading-none"
					style={{
						color: "#ffffff",
						fontSize: "4rem",
						fontFamily: "Overpass, sans-serif",
						textShadow: "0 2px 16px rgba(80,130,255,0.4)",
					}}
				>
					{data.temperatureF}
				</div>
			</div>
		</div>
	);
}
