import { beforeEach, describe, expect, it, vi } from "vitest";
import {
	cToF,
	degToCardinal,
	fetchCurrentAndForecast,
	geocodeCity,
	hpaToInHg,
	kmToMiles,
	mpsToMph,
	reverseGeocode,
	wmoLabel,
} from "./openMeteo";

// ---------------------------------------------------------------------------
// Pure conversion utilities
// ---------------------------------------------------------------------------

describe("cToF", () => {
	it("converts 0°C to 32°F", () => expect(cToF(0)).toBe(32));
	it("converts 100°C to 212°F", () => expect(cToF(100)).toBe(212));
	it("converts -40°C to -40°F", () => expect(cToF(-40)).toBe(-40));
	it("converts 20°C to 68°F", () => expect(cToF(20)).toBe(68));
	it("rounds to nearest integer", () => expect(cToF(37)).toBe(99));
});

describe("kmToMiles", () => {
	it("converts 1 km", () => expect(kmToMiles(1)).toBe(0.6));
	it("converts 10 km", () => expect(kmToMiles(10)).toBe(6.2));
	it("converts 16.09 km (~10 miles)", () =>
		expect(kmToMiles(16.09)).toBeCloseTo(10, 0));
	it("handles 0", () => expect(kmToMiles(0)).toBe(0));
});

describe("hpaToInHg", () => {
	it("converts standard sea-level pressure (1013.25 hPa → ~29.92 inHg)", () => {
		expect(hpaToInHg(1013.25)).toBeCloseTo(29.92, 1);
	});
	it("converts 1000 hPa", () => expect(hpaToInHg(1000)).toBeCloseTo(29.53, 1));
	it("converts 1030 hPa", () => expect(hpaToInHg(1030)).toBeCloseTo(30.42, 1));
});

describe("mpsToMph", () => {
	it("converts 0 m/s to 0 mph", () => expect(mpsToMph(0)).toBe(0));
	it("converts 10 m/s to ~22 mph", () => expect(mpsToMph(10)).toBe(22));
	it("converts 44.7 m/s (~100 mph)", () =>
		expect(mpsToMph(44.7)).toBeCloseTo(100, 0));
});

// ---------------------------------------------------------------------------
// degToCardinal
// ---------------------------------------------------------------------------

describe("degToCardinal", () => {
	const cases: [number, string][] = [
		[0, "N"],
		[22.5, "NNE"],
		[45, "NE"],
		[67.5, "ENE"],
		[90, "E"],
		[135, "SE"],
		[180, "S"],
		[225, "SW"],
		[270, "W"],
		[315, "NW"],
		[337.5, "NNW"],
		[360, "N"], // wraps back to N
	];
	it.each(cases)("%i° → %s", (deg, expected) => {
		expect(degToCardinal(deg)).toBe(expected);
	});
});

// ---------------------------------------------------------------------------
// wmoLabel
// ---------------------------------------------------------------------------

describe("wmoLabel", () => {
	describe("clear / cloudy", () => {
		it("code 0 day → Clear", () => expect(wmoLabel(0, true)).toBe("Clear"));
		it("code 0 night → Clear", () => expect(wmoLabel(0, false)).toBe("Clear"));
		it("code 1 → Mostly Clear", () =>
			expect(wmoLabel(1, true)).toBe("Mostly Clear"));
		it("code 2 → Partly Cloudy", () =>
			expect(wmoLabel(2, true)).toBe("Partly Cloudy"));
		it("code 3 → Overcast", () => expect(wmoLabel(3, true)).toBe("Overcast"));
	});

	describe("fog", () => {
		it("code 45 → Foggy", () => expect(wmoLabel(45, true)).toBe("Foggy"));
		it("code 48 → Foggy", () => expect(wmoLabel(48, true)).toBe("Foggy"));
	});

	describe("drizzle", () => {
		it("code 51 → Light Drizzle", () =>
			expect(wmoLabel(51, true)).toBe("Light Drizzle"));
		it("code 53 → Drizzle", () => expect(wmoLabel(53, true)).toBe("Drizzle"));
		it("code 55 → Heavy Drizzle", () =>
			expect(wmoLabel(55, true)).toBe("Heavy Drizzle"));
		it("code 56 → Freezing Drizzle", () =>
			expect(wmoLabel(56, true)).toBe("Freezing Drizzle"));
		it("code 57 → Freezing Drizzle", () =>
			expect(wmoLabel(57, true)).toBe("Freezing Drizzle"));
	});

	describe("rain", () => {
		it("code 61 → Light Rain", () =>
			expect(wmoLabel(61, true)).toBe("Light Rain"));
		it("code 63 → Rain", () => expect(wmoLabel(63, true)).toBe("Rain"));
		it("code 65 → Heavy Rain", () =>
			expect(wmoLabel(65, true)).toBe("Heavy Rain"));
		it("code 66 → Freezing Rain", () =>
			expect(wmoLabel(66, true)).toBe("Freezing Rain"));
		it("code 67 → Freezing Rain", () =>
			expect(wmoLabel(67, true)).toBe("Freezing Rain"));
	});

	describe("snow", () => {
		it("code 71 → Light Snow", () =>
			expect(wmoLabel(71, true)).toBe("Light Snow"));
		it("code 73 → Snow", () => expect(wmoLabel(73, true)).toBe("Snow"));
		it("code 75 → Heavy Snow", () =>
			expect(wmoLabel(75, true)).toBe("Heavy Snow"));
		it("code 77 → Snow Grains", () =>
			expect(wmoLabel(77, true)).toBe("Snow Grains"));
	});

	describe("showers", () => {
		it("code 80 → Light Showers", () =>
			expect(wmoLabel(80, true)).toBe("Light Showers"));
		it("code 81 → Showers", () => expect(wmoLabel(81, true)).toBe("Showers"));
		it("code 82 → Heavy Showers", () =>
			expect(wmoLabel(82, true)).toBe("Heavy Showers"));
		it("code 85 → Snow Showers", () =>
			expect(wmoLabel(85, true)).toBe("Snow Showers"));
		it("code 86 → Snow Showers", () =>
			expect(wmoLabel(86, true)).toBe("Snow Showers"));
	});

	describe("thunderstorms", () => {
		it("code 95 → Thunderstorm", () =>
			expect(wmoLabel(95, true)).toBe("Thunderstorm"));
		it("code 96 → Severe Thunderstorm", () =>
			expect(wmoLabel(96, true)).toBe("Severe Thunderstorm"));
		it("code 99 → Severe Thunderstorm", () =>
			expect(wmoLabel(99, true)).toBe("Severe Thunderstorm"));
	});

	it("unknown code → Unknown", () =>
		expect(wmoLabel(999, true)).toBe("Unknown"));
});

// ---------------------------------------------------------------------------
// fetchCurrentAndForecast — mock fetch
// ---------------------------------------------------------------------------

const MOCK_OPEN_METEO_RESPONSE = {
	current: {
		time: "2024-01-15T12:00",
		temperature_2m: 20,
		apparent_temperature: 18,
		dew_point_2m: 10,
		relative_humidity_2m: 55,
		visibility: 10000,
		wind_direction_10m: 270,
		wind_speed_10m: 5,
		wind_gusts_10m: 8,
		surface_pressure: 1013,
		uv_index: 3,
		weather_code: 2,
		is_day: 1,
	},
	hourly: {
		time: Array.from(
			{ length: 48 },
			(_, i) => `2024-01-15T${String(i).padStart(2, "0")}:00`,
		),
		temperature_2m: Array.from({ length: 24 }, (_, i) => 15 + i * 0.5),
		weather_code: Array(24).fill(2),
		precipitation_probability: Array(24).fill(10),
		is_day: Array(24).fill(1),
	},
	daily: {
		time: [
			"2024-01-15",
			"2024-01-16",
			"2024-01-17",
			"2024-01-18",
			"2024-01-19",
			"2024-01-20",
			"2024-01-21",
		],
		temperature_2m_max: [22, 24, 20, 18, 21, 25, 23],
		temperature_2m_min: [10, 12, 8, 6, 9, 13, 11],
		weather_code: [2, 3, 61, 61, 2, 0, 1],
		precipitation_probability_max: [0, 5, 80, 60, 10, 0, 0],
		sunrise: [
			"2024-01-15T07:00",
			"2024-01-16T07:01",
			"2024-01-17T07:01",
			"2024-01-18T07:02",
			"2024-01-19T07:02",
			"2024-01-20T07:02",
			"2024-01-21T07:03",
		],
		sunset: [
			"2024-01-15T17:30",
			"2024-01-16T17:31",
			"2024-01-17T17:32",
			"2024-01-18T17:33",
			"2024-01-19T17:34",
			"2024-01-20T17:35",
			"2024-01-21T17:36",
		],
	},
};

describe("fetchCurrentAndForecast", () => {
	beforeEach(() => {
		vi.stubGlobal(
			"fetch",
			vi.fn().mockResolvedValue({
				ok: true,
				json: async () => MOCK_OPEN_METEO_RESPONSE,
			}),
		);
	});

	it("converts current temperature from Celsius to Fahrenheit", async () => {
		const { current } = await fetchCurrentAndForecast({
			lat: 40.7,
			lon: -74.0,
		});
		expect(current.temperatureF).toBe(cToF(20)); // 68
	});

	it("converts feels-like temperature", async () => {
		const { current } = await fetchCurrentAndForecast({
			lat: 40.7,
			lon: -74.0,
		});
		expect(current.feelsLikeF).toBe(cToF(18)); // 64
	});

	it("sets wind direction cardinal from degrees", async () => {
		const { current } = await fetchCurrentAndForecast({
			lat: 40.7,
			lon: -74.0,
		});
		expect(current.windDirCardinal).toBe("W");
	});

	it("sets wind gust when present", async () => {
		const { current } = await fetchCurrentAndForecast({
			lat: 40.7,
			lon: -74.0,
		});
		expect(current.windGustMph).toBe(mpsToMph(8));
	});

	it("converts visibility from meters to miles", async () => {
		const { current } = await fetchCurrentAndForecast({
			lat: 40.7,
			lon: -74.0,
		});
		expect(current.visibilityMiles).toBe(kmToMiles(10));
	});

	it("returns all hourly points", async () => {
		const { hourly } = await fetchCurrentAndForecast({ lat: 40.7, lon: -74.0 });
		expect(hourly).toHaveLength(48);
	});

	it("returns 7 daily forecasts", async () => {
		const { daily } = await fetchCurrentAndForecast({ lat: 40.7, lon: -74.0 });
		expect(daily).toHaveLength(7);
	});

	it("converts daily high temperatures", async () => {
		const { daily } = await fetchCurrentAndForecast({ lat: 40.7, lon: -74.0 });
		expect(daily[0]!.highF).toBe(cToF(22));
		expect(daily[0]!.lowF).toBe(cToF(10));
	});

	it("maps precipitation probability to daily forecast", async () => {
		const { daily } = await fetchCurrentAndForecast({ lat: 40.7, lon: -74.0 });
		expect(daily[2]!.precipChancePct).toBe(80);
	});

	it("assigns correct condition labels via wmoLabel", async () => {
		const { current } = await fetchCurrentAndForecast({
			lat: 40.7,
			lon: -74.0,
		});
		expect(current.conditionLabel).toBe("Partly Cloudy");
	});

	it("marks isDay correctly", async () => {
		const { current } = await fetchCurrentAndForecast({
			lat: 40.7,
			lon: -74.0,
		});
		expect(current.isDay).toBe(true);
	});

	it("throws on non-ok response", async () => {
		vi.stubGlobal(
			"fetch",
			vi.fn().mockResolvedValue({ ok: false, status: 500 }),
		);
		await expect(
			fetchCurrentAndForecast({ lat: 40.7, lon: -74.0 }),
		).rejects.toThrow("Open-Meteo error: 500");
	});

	it("calls the correct API endpoint", async () => {
		await fetchCurrentAndForecast({ lat: 40.7128, lon: -74.006 });
		const calledUrl = (globalThis.fetch as ReturnType<typeof vi.fn>).mock
			.calls[0][0] as string;
		expect(calledUrl).toContain("api.open-meteo.com/v1/forecast");
		expect(calledUrl).toContain("latitude=40.7128");
		expect(calledUrl).toContain("longitude=-74.006");
	});
});

// ---------------------------------------------------------------------------
// reverseGeocode — mock fetch
// ---------------------------------------------------------------------------

describe("reverseGeocode", () => {
	it("returns a LocationInfo with city, state, country", async () => {
		vi.stubGlobal(
			"fetch",
			vi.fn().mockResolvedValue({
				ok: true,
				json: async () => ({
					address: { city: "New York", state: "New York", country_code: "us" },
				}),
			}),
		);
		const loc = await reverseGeocode({ lat: 40.7, lon: -74.0 });
		expect(loc).not.toBeNull();
		expect(loc!.city).toBe("New York");
		expect(loc!.state).toBe("New York");
		expect(loc!.country).toBe("US");
		expect(loc!.isUS).toBe(true);
	});

	it("falls back to town if city is missing", async () => {
		vi.stubGlobal(
			"fetch",
			vi.fn().mockResolvedValue({
				ok: true,
				json: async () => ({
					address: { town: "Smallville", country_code: "us" },
				}),
			}),
		);
		const loc = await reverseGeocode({ lat: 40.0, lon: -75.0 });
		expect(loc!.city).toBe("Smallville");
	});

	it("returns null on non-ok response", async () => {
		vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: false }));
		const loc = await reverseGeocode({ lat: 0, lon: 0 });
		expect(loc).toBeNull();
	});

	it("returns null on network failure", async () => {
		vi.stubGlobal(
			"fetch",
			vi.fn().mockRejectedValue(new Error("Network error")),
		);
		const loc = await reverseGeocode({ lat: 0, lon: 0 });
		expect(loc).toBeNull();
	});

	it("marks non-US locations correctly", async () => {
		vi.stubGlobal(
			"fetch",
			vi.fn().mockResolvedValue({
				ok: true,
				json: async () => ({
					address: { city: "London", state: "England", country_code: "gb" },
				}),
			}),
		);
		const loc = await reverseGeocode({ lat: 51.5, lon: -0.1 });
		expect(loc!.isUS).toBe(false);
		expect(loc!.country).toBe("GB");
	});
});

// ---------------------------------------------------------------------------
// geocodeCity — mock fetch
// ---------------------------------------------------------------------------

describe("geocodeCity", () => {
	it("returns a LocationInfo for a found city", async () => {
		vi.stubGlobal(
			"fetch",
			vi.fn().mockResolvedValue({
				ok: true,
				json: async () => ({
					results: [
						{
							name: "Philadelphia",
							latitude: 39.95,
							longitude: -75.16,
							country_code: "US",
							admin1: "Pennsylvania",
							timezone: "America/New_York",
						},
					],
				}),
			}),
		);
		const loc = await geocodeCity("Philadelphia");
		expect(loc).not.toBeNull();
		expect(loc!.city).toBe("Philadelphia");
		expect(loc!.state).toBe("Pennsylvania");
		expect(loc!.isUS).toBe(true);
		expect(loc!.coords.lat).toBeCloseTo(39.95);
	});

	it("returns null when no results", async () => {
		vi.stubGlobal(
			"fetch",
			vi.fn().mockResolvedValue({
				ok: true,
				json: async () => ({ results: [] }),
			}),
		);
		expect(await geocodeCity("xyzzy")).toBeNull();
	});

	it("returns null on non-ok response", async () => {
		vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: false }));
		expect(await geocodeCity("anywhere")).toBeNull();
	});
});
