/**
 * Categorises a UV index value into a human-readable label with the numeric
 * prefix, e.g. "3 Moderate", "8 V.High".
 */
export function uvLabel(uv: number): string {
	if (uv <= 2) return `${uv} Low`;
	if (uv <= 5) return `${uv} Moderate`;
	if (uv <= 7) return `${uv} High`;
	if (uv <= 10) return `${uv} V.High`;
	return `${uv} Extreme`;
}

/**
 * Formats a nullable Date as a short weekday + date + time string, or "--"
 * when the date is null.
 * e.g. "Mon, Jun 3, 12:00 AM"
 */
export function formatAlertTime(d: Date | null): string {
	if (!d) return "--";
	return d.toLocaleString("en-US", {
		weekday: "short",
		month: "short",
		day: "numeric",
		hour: "2-digit",
		minute: "2-digit",
		hour12: true,
	});
}
