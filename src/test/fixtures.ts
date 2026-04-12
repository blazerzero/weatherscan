/**
 * Shared test fixtures for component and hook tests.
 */
import type {
	CurrentConditions,
	DailyForecast,
	HourlyPoint,
	LocationInfo,
	WeatherAlert,
	WeatherData,
} from "@/types/weather";

export const LOCATION: LocationInfo = {
	coords: { lat: 39.95, lon: -75.16 },
	city: "Philadelphia",
	state: "PA",
	country: "US",
	isUS: true,
	timezone: "America/New_York",
};

export const CURRENT: CurrentConditions = {
	temperatureF: 72,
	feelsLikeF: 68,
	dewpointF: 55,
	humidityPct: 58,
	visibilityMiles: 10,
	windDirDeg: 270,
	windDirCardinal: "W",
	windSpeedMph: 12,
	windGustMph: 18,
	pressureInHg: 30.12,
	uvIndex: 3,
	conditionCode: 2,
	conditionLabel: "Partly Cloudy",
	isDay: true,
	observedAt: new Date("2024-06-01T14:00:00Z"),
};

export const CURRENT_NIGHT: CurrentConditions = {
	...CURRENT,
	isDay: false,
	conditionCode: 0,
	conditionLabel: "Clear",
};

export const CURRENT_CALM: CurrentConditions = {
	...CURRENT,
	windSpeedMph: 0,
	windGustMph: null,
};

export const HOURLY: HourlyPoint[] = Array.from({ length: 12 }, (_, i) => ({
	time: new Date(Date.UTC(2024, 5, 1, i)),
	tempF: 65 + i,
	conditionCode: i % 3 === 0 ? 0 : 2,
	conditionLabel: i % 3 === 0 ? "Clear" : "Partly Cloudy",
	precipChancePct: i * 5,
	isDay: i >= 6 && i < 20,
}));

export const DAILY: DailyForecast[] = Array.from({ length: 7 }, (_, i) => ({
	date: new Date(Date.UTC(2024, 5, 1 + i, 12)),
	highF: 75 + i,
	lowF: 55 + i,
	conditionCode: i % 2 === 0 ? 0 : 61,
	conditionLabel: i % 2 === 0 ? "Clear" : "Light Rain",
	precipChancePct: i % 2 === 0 ? 0 : 70,
	sunrise: new Date(Date.UTC(2024, 5, 1 + i, 9, 30)),
	sunset: new Date(Date.UTC(2024, 5, 1 + i, 23, 0)),
}));

export const ALERT: WeatherAlert = {
	id: "NWS-TEST-001",
	headline: "Tornado Watch in effect until 9 PM EDT",
	description: "A tornado watch has been issued for the following counties.",
	severity: "Severe",
	urgency: "Expected",
	event: "Tornado Watch",
	onset: new Date("2024-06-01T18:00:00Z"),
	expires: new Date("2024-06-02T01:00:00Z"),
	areaDesc: "Philadelphia County; Bucks County",
};

export const EXTREME_ALERT: WeatherAlert = {
	...ALERT,
	id: "NWS-TEST-002",
	event: "Tornado Warning",
	severity: "Extreme",
};

export const WEATHER_DATA: WeatherData = {
	location: LOCATION,
	current: CURRENT,
	hourly: HOURLY,
	daily: DAILY,
	alerts: [],
};

export const WEATHER_DATA_WITH_ALERTS: WeatherData = {
	...WEATHER_DATA,
	alerts: [ALERT],
};
