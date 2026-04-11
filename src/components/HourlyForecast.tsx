import type { HourlyPoint } from "../types/weather";
import { COLORS, MONO_FONT } from "../lib/constants";
import { SlideHeader } from "./SlideHeader";
import { WeatherIcon } from "./WeatherIcon";

interface Props {
	data: HourlyPoint[];
}

export function HourlyForecast({ data }: Props) {
	const hours = data.slice(0, 12);

	return (
		<div className="flex flex-col h-full">
			<SlideHeader title="Hourly Forecast" />

			<div className="flex-1 overflow-hidden">
				{hours.map((h, i) => {
					const timeStr = h.time.toLocaleTimeString("en-US", {
						hour: "numeric",
						hour12: true,
					});
					const isNow = i === 0;
					return (
						<div
							key={h.time.toISOString()}
							className="flex items-center justify-between px-4 py-1.5"
							style={{
								borderBottom: `1px solid ${COLORS.border}`,
								background: isNow ? "rgba(0,85,160,0.25)" : undefined,
							}}
						>
							<span
								className="text-xs font-bold w-16"
								style={{
									color: isNow ? COLORS.gold : COLORS.textSecondary,
									letterSpacing: "0.05em",
								}}
							>
								{isNow ? "NOW" : timeStr}
							</span>
							<WeatherIcon
								code={h.conditionCode}
								isDay={h.isDay}
								className="text-lg w-8 text-center"
							/>
							<span
								className="text-xs w-20 text-center truncate"
								style={{ color: COLORS.textDim }}
							>
								{h.conditionLabel}
							</span>
							<span
								className="text-sm font-bold w-14 text-right"
								style={{ color: COLORS.textPrimary, fontFamily: MONO_FONT }}
							>
								{h.tempF}°F
							</span>
							{h.precipChancePct > 0 && (
								<span
									className="text-xs w-10 text-right"
									style={{ color: COLORS.blueAccent }}
								>
									{h.precipChancePct}%
								</span>
							)}
							{h.precipChancePct === 0 && <span className="w-10" />}
						</div>
					);
				})}
			</div>
		</div>
	);
}
