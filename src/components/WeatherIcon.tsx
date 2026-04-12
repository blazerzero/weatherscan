/**
 * Maps WMO weather codes to simple SVG-based icons using Unicode symbols.
 * Renders as a styled <span> for retro consistency.
 */

interface Props {
	code: number;
	isDay: boolean;
	className?: string;
}

function getSymbol(code: number, isDay: boolean): string {
	if (code === 0) return isDay ? "☀" : "★";
	if (code === 1) return isDay ? "🌤" : "🌤";
	if (code === 2) return "⛅";
	if (code === 3) return "☁";
	if (code === 45 || code === 48) return "🌫";
	if (code >= 51 && code <= 57) return "🌦";
	if (code >= 61 && code <= 67) return "🌧";
	if (code >= 71 && code <= 77) return "❄";
	if (code >= 80 && code <= 82) return "🌧";
	if (code >= 85 && code <= 86) return "🌨";
	if (code === 95) return "⛈";
	if (code >= 96) return "⛈";
	return "?";
}

export function WeatherIcon({ code, isDay, className = "" }: Props) {
	return (
		<span
			className={className}
			role="img"
			aria-label={`weather condition ${code}`}
			style={{
				fontFamily: "Apple Color Emoji, Segoe UI Emoji, sans-serif",
				fontSize: "4rem",
			}}
		>
			{getSymbol(code, isDay)}
		</span>
	);
}
