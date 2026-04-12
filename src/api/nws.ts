import type { LocationInfo, WeatherAlert } from "@/types/weather";

const BASE = "https://api.weather.gov";
const HEADERS = {
	"User-Agent": "WeatherScan/1.0 (weather@weatherscan.app)",
	Accept: "application/ld+json",
};

/** Enrich a US LocationInfo with NWS grid data (office + zone ID) */
export async function enrichWithNWS(
	location: LocationInfo,
): Promise<LocationInfo> {
	if (!location.isUS) return location;
	try {
		const res = await fetch(
			`${BASE}/points/${location.coords.lat.toFixed(4)},${location.coords.lon.toFixed(4)}`,
			{ headers: HEADERS },
		);
		if (!res.ok) return location;
		const data = (await res.json()) as NWSPointsResponse;
		const [, office, gridX, gridY] =
			(data.forecastGridData ?? "").match(
				/\/gridpoints\/([A-Z]+)\/(\d+),(\d+)/,
			) ?? [];
		return {
			...location,
			nwsOffice: office,
			nwsGridX: gridX ? Number(gridX) : undefined,
			nwsGridY: gridY ? Number(gridY) : undefined,
			nwsZoneId: data.county ?? data.forecastZone ?? undefined,
			timezone: data.timeZone ?? location.timezone,
		};
	} catch {
		return location;
	}
}

/** Fetch active weather alerts for a US location */
export async function fetchAlerts(
	location: LocationInfo,
): Promise<WeatherAlert[]> {
	if (!location.isUS) return [];
	try {
		const params = new URLSearchParams({
			point: `${location.coords.lat.toFixed(4)},${location.coords.lon.toFixed(4)}`,
			status: "actual",
		});
		const res = await fetch(`${BASE}/alerts/active?${params}`, {
			headers: HEADERS,
		});
		if (!res.ok) return [];
		const data = (await res.json()) as NWSAlertsResponse;
		return (data["@graph"] ?? []).map(parseAlert);
	} catch {
		return [];
	}
}

/** Fetch a handful of recent national weather alerts for the chyron */
export async function fetchNationalHeadlines(): Promise<string[]> {
	try {
		const params = new URLSearchParams({
			status: "actual",
			severity: "Severe,Extreme",
			limit: "20",
		});
		const res = await fetch(`${BASE}/alerts/active?${params}`, {
			headers: HEADERS,
		});
		if (!res.ok) return [];
		const data = (await res.json()) as NWSAlertsResponse;
		return (data["@graph"] ?? []).map((a) =>
			`${a.event}: ${a.areaDesc ?? ""}`.trim(),
		);
	} catch {
		return [];
	}
}

function parseAlert(a: NWSAlert): WeatherAlert {
	return {
		id: a.id ?? String(Math.random()),
		headline: a.headline ?? a.event ?? "Weather Alert",
		description: a.description ?? "",
		severity: normalizeSeverity(a.severity),
		urgency: a.urgency ?? "Unknown",
		event: a.event ?? "Alert",
		onset: a.onset ? new Date(a.onset) : null,
		expires: a.expires ? new Date(a.expires) : null,
		areaDesc: a.areaDesc ?? "",
	};
}

export function normalizeSeverity(s?: string): WeatherAlert["severity"] {
	if (s === "Extreme") return "Extreme";
	if (s === "Severe") return "Severe";
	if (s === "Moderate") return "Moderate";
	if (s === "Minor") return "Minor";
	return "Unknown";
}

// ---- raw API shapes ----

interface NWSPointsResponse {
	forecastGridData?: string;
	county?: string;
	forecastZone?: string;
	timeZone?: string;
}

interface NWSAlert {
	id?: string;
	headline?: string;
	description?: string;
	severity?: string;
	urgency?: string;
	event?: string;
	onset?: string;
	expires?: string;
	areaDesc?: string;
}

interface NWSAlertsResponse {
	"@graph"?: NWSAlert[];
}
