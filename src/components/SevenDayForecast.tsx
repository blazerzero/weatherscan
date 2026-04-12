import { COLORS } from "@/lib/constants";
import type { DailyForecast } from "@/types/weather";
import { WeatherIcon } from "./WeatherIcon";

interface Props {
	data: DailyForecast[];
}

export function SevenDayForecast({ data }: Props) {
	const days = data.slice(0, 7);

	return (
		<div className="flex h-full">
			{days.map((d, i) => {
				const dayLabel =
					i === 0
						? "Today"
						: d.date.toLocaleDateString("en-US", { weekday: "short" });

				return (
					<div
						key={d.date.toISOString()}
						className="flex-1 flex flex-col items-center"
						style={{
							borderRight:
								i < days.length - 1
									? `1px solid ${COLORS.borderDark}`
									: "none",
						}}
					>
						{/* Day name header */}
						<div
							className="w-full text-center py-1 font-bold text-base uppercase tracking-wide"
							style={{
								background: COLORS.panelMid,
								color: i === 0 ? COLORS.gold : COLORS.textPrimary,
							}}
						>
							{dayLabel}
						</div>

						{/* Icon + condition area */}
						<div
							className="flex-1 w-full flex flex-col items-center justify-center gap-1 py-2 px-1"
							style={{ background: COLORS.panelBg }}
						>
							<WeatherIcon
								code={d.conditionCode}
								isDay
								className="text-3xl"
							/>
							<span
								className="text-sm font-bold text-center leading-tight"
								style={{ color: COLORS.textPrimary }}
							>
								{d.conditionLabel}
							</span>
						</div>

						{/* High temp */}
						<div
							className="w-full text-center py-2"
							style={{ background: COLORS.blueBright }}
						>
							<span
								className="text-4xl font-bold"
								style={{ color: COLORS.textPrimary }}
							>
								{d.highF}
							</span>
						</div>

						{/* Low temp */}
						<div
							className="w-full text-center py-2"
							style={{ background: COLORS.panelDark }}
						>
							<span
								className="text-2xl"
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
