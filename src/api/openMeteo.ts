import type {
	Coordinates,
	CurrentConditions,
	DailyForecast,
	HourlyPoint,
	LocationInfo,
} from "@/types/weather";

const BASE = "https://api.open-meteo.com/v1";
const GEO_BASE = "https://geocoding-api.open-meteo.com/v1";

// WMO Weather Interpretation Codes → human-readable label
export function wmoLabel(code: number): string {
	switch (code) {
		case 0:
			return "Clear";
		case 1:
			return "Mostly Sunny";
		case 2:
			return "Partly Cloudy";
		case 3:
			return "Cloudy";
		case 45:
		case 48:
			return "Fog";
		case 51:
		case 53:
		case 55:
			return "Drizzle";
		case 56:
		case 57:
			return "Freezing Drizzle";
		case 66:
		case 67:
			return "Freezing Rain";
		case 61:
		case 63:
		case 65:
			return "Rain";
		case 71:
		case 85:
			return "Snow Showers";
		case 73:
		case 77:
			return "Snow";
		case 75:
		case 86:
			return "Heavy Snow";
		case 80:
		case 81:
		case 82:
			return "Showers";
		case 95:
			return "Thunderstorms";
		case 96:
		case 99:
			return "Severe Thunderstorms";
		default:
			return "Unknown";
	}
}

export function degToCardinal(deg: number): string {
	const dirs = [
		"N",
		"NNE",
		"NE",
		"ENE",
		"E",
		"ESE",
		"SE",
		"SSE",
		"S",
		"SSW",
		"SW",
		"WSW",
		"W",
		"WNW",
		"NW",
		"NNW",
	];
	return dirs[Math.round(deg / 22.5) % 16] ?? "N";
}

export function cToF(c: number): number {
	return Math.round((c * 9) / 5 + 32);
}

export function kmToMiles(km: number): number {
	return Math.round(km * 0.621371 * 10) / 10;
}

export function hpaToInHg(hpa: number): number {
	return Math.round(hpa * 0.02953 * 100) / 100;
}

export function mpsToMph(mps: number): number {
	return Math.round(mps * 2.23694);
}

export async function fetchCurrentAndForecast(coords: Coordinates): Promise<{
	current: CurrentConditions;
	hourly: HourlyPoint[];
	daily: DailyForecast[];
}> {
	const params = new URLSearchParams({
		latitude: String(coords.lat),
		longitude: String(coords.lon),
		current: [
			"temperature_2m",
			"apparent_temperature",
			"dew_point_2m",
			"relative_humidity_2m",
			"visibility",
			"wind_direction_10m",
			"wind_speed_10m",
			"wind_gusts_10m",
			"surface_pressure",
			"uv_index",
			"weather_code",
			"is_day",
		].join(","),
		hourly: [
			"temperature_2m",
			"weather_code",
			"precipitation_probability",
			"is_day",
		].join(","),
		daily: [
			"temperature_2m_max",
			"temperature_2m_min",
			"weather_code",
			"precipitation_probability_max",
			"sunrise",
			"sunset",
		].join(","),
		temperature_unit: "celsius",
		wind_speed_unit: "ms",
		precipitation_unit: "mm",
		timezone: "auto",
		forecast_days: "7",
		forecast_hours: "48",
	});

	const res = await fetch(`${BASE}/forecast?${params}`);
	if (!res.ok) throw new Error(`Open-Meteo error: ${res.status}`);
	const data = (await res.json()) as OpenMeteoResponse;

	// open-meteo returns wall-clock times in the location's local timezone.
	// Appending "Z" would treat them as UTC, which is wrong. Instead, subtract
	// the UTC offset so the resulting Date represents the correct instant.
	const toUtc = (localStr: string) =>
		new Date(
			new Date(localStr + "Z").getTime() - data.utc_offset_seconds * 1000,
		);

	const c = data.current;
	const isDay = c.is_day === 1;

	const current: CurrentConditions = {
		temperatureF: cToF(c.temperature_2m),
		feelsLikeF: cToF(c.apparent_temperature),
		dewpointF: cToF(c.dew_point_2m),
		humidityPct: Math.round(c.relative_humidity_2m),
		visibilityMiles: kmToMiles(c.visibility / 1000),
		windDirDeg: c.wind_direction_10m,
		windDirCardinal: degToCardinal(c.wind_direction_10m),
		windSpeedMph: mpsToMph(c.wind_speed_10m),
		windGustMph: c.wind_gusts_10m != null ? mpsToMph(c.wind_gusts_10m) : null,
		pressureInHg: hpaToInHg(c.surface_pressure),
		uvIndex: Math.round(c.uv_index),
		conditionCode: c.weather_code,
		conditionLabel: wmoLabel(c.weather_code),
		isDay,
		observedAt: toUtc(c.time),
	};

	const hourly: HourlyPoint[] = data.hourly.time.slice(0, 48).map((t, i) => ({
		time: toUtc(t),
		tempF: cToF(data.hourly.temperature_2m[i] ?? 0),
		conditionCode: data.hourly.weather_code[i] ?? 0,
		conditionLabel: wmoLabel(data.hourly.weather_code[i] ?? 0),
		precipChancePct: data.hourly.precipitation_probability[i] ?? 0,
		isDay: (data.hourly.is_day[i] ?? 1) === 1,
	}));

	console.log(data.daily);

	const daily: DailyForecast[] = data.daily.time.map((t, i) => ({
		date: new Date(t + "T12:00:00Z"),
		highF: cToF(data.daily.temperature_2m_max[i] ?? 0),
		lowF: cToF(data.daily.temperature_2m_min[i] ?? 0),
		conditionCode: data.daily.weather_code[i] ?? 0,
		conditionLabel: wmoLabel(data.daily.weather_code[i] ?? 0),
		precipChancePct: data.daily.precipitation_probability_max[i] ?? 0,
		sunrise: toUtc(data.daily.sunrise[i] ?? t + "T06:00:00"),
		sunset: toUtc(data.daily.sunset[i] ?? t + "T18:00:00"),
	}));

	return { current, hourly, daily };
}

export async function geocodeCity(query: string): Promise<LocationInfo | null> {
	const params = new URLSearchParams({
		name: query,
		count: "1",
		language: "en",
		format: "json",
	});
	const res = await fetch(`${GEO_BASE}/search?${params}`);
	if (!res.ok) return null;
	const data = (await res.json()) as { results?: GeoResult[] };
	const r = data.results?.[0];
	if (!r) return null;
	return geoResultToLocation(r);
}

export async function reverseGeocode(
	coords: Coordinates,
): Promise<LocationInfo | null> {
	// Open-Meteo doesn't have a reverse geocode endpoint; we use a free nominatim-compatible API
	const params = new URLSearchParams({
		lat: String(coords.lat),
		lon: String(coords.lon),
		format: "json",
	});
	try {
		const res = await fetch(
			`https://nominatim.openstreetmap.org/reverse?${params}`,
			{
				headers: { "Accept-Language": "en", "User-Agent": "Weatherscan/1.0" },
			},
		);
		if (!res.ok) return null;
		const data = (await res.json()) as NominatimReverse;
		const addr = data.address;
		const city =
			addr.city ??
			addr.town ??
			addr.village ??
			addr.municipality ??
			addr.county ??
			"Unknown";
		const state = addr.state ?? "";
		const country = addr.country_code?.toUpperCase() ?? "";
		return {
			coords,
			city,
			state,
			country,
			isUS: country === "US",
			timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
		};
	} catch {
		return null;
	}
}

function geoResultToLocation(r: GeoResult): LocationInfo {
	return {
		coords: { lat: r.latitude, lon: r.longitude },
		city: r.name,
		state: r.admin1 ?? "",
		country: r.country_code?.toUpperCase() ?? "",
		isUS: r.country_code?.toUpperCase() === "US",
		timezone: r.timezone ?? Intl.DateTimeFormat().resolvedOptions().timeZone,
	};
}

// ---- raw API response shapes ----

interface OpenMeteoResponse {
	utc_offset_seconds: number;
	current: {
		time: string;
		temperature_2m: number;
		apparent_temperature: number;
		dew_point_2m: number;
		relative_humidity_2m: number;
		visibility: number;
		wind_direction_10m: number;
		wind_speed_10m: number;
		wind_gusts_10m: number | null;
		surface_pressure: number;
		uv_index: number;
		weather_code: number;
		is_day: number;
	};
	hourly: {
		time: string[];
		temperature_2m: number[];
		weather_code: number[];
		precipitation_probability: number[];
		is_day: number[];
	};
	daily: {
		time: string[];
		temperature_2m_max: number[];
		temperature_2m_min: number[];
		weather_code: number[];
		precipitation_probability_max: number[];
		sunrise: string[];
		sunset: string[];
	};
}

interface GeoResult {
	name: string;
	latitude: number;
	longitude: number;
	country_code: string;
	admin1?: string;
	timezone?: string;
}

interface NominatimReverse {
	address: {
		city?: string;
		town?: string;
		village?: string;
		municipality?: string;
		county?: string;
		state?: string;
		country_code?: string;
	};
}
