import { useQuery } from "@tanstack/react-query";
import type { Coordinates, LocationInfo, WeatherData } from "../types/weather";
import { fetchCurrentAndForecast, reverseGeocode } from "../api/openMeteo";
import { enrichWithNWS, fetchAlerts } from "../api/nws";
import { FIVE_MIN, THIRTY_MIN } from "../lib/constants";

async function loadWeather(coords: Coordinates): Promise<WeatherData> {
	// 1. Reverse-geocode to get city/state info
	const rawLocation = await reverseGeocode(coords);
	const baseLocation: LocationInfo = rawLocation ?? {
		coords,
		city: "Unknown",
		state: "",
		country: "",
		isUS: false,
		timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
	};

	// 2. Enrich with NWS data if US
	const location = await enrichWithNWS(baseLocation);

	// 3. Fetch forecast data + alerts in parallel
	const [{ current, hourly, daily }, alerts] = await Promise.all([
		fetchCurrentAndForecast(coords),
		fetchAlerts(location),
	]);

	return { location, current, hourly, daily, alerts };
}

export function useWeather(coords: Coordinates | null) {
	return useQuery<WeatherData>({
		queryKey: ["weather", coords?.lat, coords?.lon],
		queryFn: () => loadWeather(coords!),
		enabled: coords != null,
		staleTime: FIVE_MIN,
		refetchInterval: FIVE_MIN,
		// Keep previous data visible while refetching
		placeholderData: (prev) => prev,
	});
}

export function useWeatherForLocation(location: LocationInfo | null) {
	// Hourly/daily refetch less frequently
	return useQuery<{
		hourly: WeatherData["hourly"];
		daily: WeatherData["daily"];
	}>({
		queryKey: ["forecast", location?.coords.lat, location?.coords.lon],
		queryFn: async () => {
			const { hourly, daily } = await fetchCurrentAndForecast(location!.coords);
			return { hourly, daily };
		},
		enabled: location != null,
		staleTime: THIRTY_MIN,
		refetchInterval: THIRTY_MIN,
		placeholderData: (prev) => prev,
	});
}
