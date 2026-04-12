import { COLORS } from "@/lib/constants";
import type { HourlyPoint } from "@/types/weather";
import { WeatherIcon } from "./WeatherIcon";

interface Props {
	data: HourlyPoint[];
	timezone?: string;
}

export function HourlyForecast({ data, timezone }: Props) {
	const tz = timezone ?? Intl.DateTimeFormat().resolvedOptions().timeZone;
	const hours = data.slice(0, 12);

	return (
		<div className="flex flex-col h-full">
			<div className="flex-1 overflow-hidden">
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
							className="flex items-center justify-between px-4 py-1.5"
							style={{
								borderBottom: `1px solid ${COLORS.border}`,
								background: isNow ? "rgba(42,82,188,0.4)" : undefined,
							}}
						>
							<span
								className="text-sm font-bold w-16"
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
								className="text-sm w-20 text-center truncate"
								style={{ color: COLORS.textDim }}
							>
								{h.conditionLabel}
							</span>
							<span
								className="text-base font-bold w-14 text-right"
								style={{ color: COLORS.textPrimary }}
							>
								{h.tempF}
							</span>
							{h.precipChancePct > 0 && (
								<span
									className="text-sm w-10 text-right"
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
