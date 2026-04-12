import { renderHook, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { useGeolocation } from "./useGeolocation";

// Helper to mock navigator.geolocation
function mockGeoSuccess(lat: number, lon: number) {
	const watchPosition = vi.fn((onSuccess) => {
		onSuccess({
			coords: { latitude: lat, longitude: lon },
		} as GeolocationPosition);
		return 1; // watchId
	});
	vi.stubGlobal("navigator", {
		...navigator,
		geolocation: { watchPosition, clearWatch: vi.fn() },
	});
}

function mockGeoError(code: number) {
	const watchPosition = vi.fn((_, onError) => {
		onError({ code } as GeolocationPositionError);
		return 1;
	});
	vi.stubGlobal("navigator", {
		...navigator,
		geolocation: { watchPosition, clearWatch: vi.fn() },
	});
}

function mockGeoUnavailable() {
	vi.stubGlobal("navigator", { ...navigator, geolocation: undefined });
}

describe("useGeolocation", () => {
	afterEach(() => {
		vi.unstubAllGlobals();
	});

	it("starts in loading state", () => {
		// Don't resolve the position right away
		const watchPosition = vi.fn(() => 1);
		vi.stubGlobal("navigator", {
			...navigator,
			geolocation: { watchPosition, clearWatch: vi.fn() },
		});
		const { result } = renderHook(() => useGeolocation());
		expect(result.current.status).toBe("loading");
	});

	it("transitions to success with coordinates on permission granted", async () => {
		mockGeoSuccess(40.7128, -74.006);
		const { result } = renderHook(() => useGeolocation());
		await waitFor(() => expect(result.current.status).toBe("success"));
		if (result.current.status === "success") {
			expect(result.current.coords.lat).toBeCloseTo(40.7128);
			expect(result.current.coords.lon).toBeCloseTo(-74.006);
		}
	});

	it("transitions to denied on PERMISSION_DENIED error", async () => {
		mockGeoError(GeolocationPositionError.PERMISSION_DENIED);
		const { result } = renderHook(() => useGeolocation());
		await waitFor(() => expect(result.current.status).toBe("denied"));
	});

	it("transitions to error on POSITION_UNAVAILABLE", async () => {
		mockGeoError(GeolocationPositionError.POSITION_UNAVAILABLE);
		const { result } = renderHook(() => useGeolocation());
		await waitFor(() => expect(result.current.status).toBe("error"));
	});

	it("transitions to error on TIMEOUT", async () => {
		mockGeoError(GeolocationPositionError.TIMEOUT);
		const { result } = renderHook(() => useGeolocation());
		await waitFor(() => expect(result.current.status).toBe("error"));
	});

	it("goes to denied when geolocation API is unavailable", async () => {
		mockGeoUnavailable();
		const { result } = renderHook(() => useGeolocation());
		await waitFor(() => expect(result.current.status).toBe("denied"));
	});

	it("calls clearWatch on unmount", () => {
		const clearWatch = vi.fn();
		vi.stubGlobal("navigator", {
			...navigator,
			geolocation: { watchPosition: vi.fn(() => 42), clearWatch },
		});
		const { unmount } = renderHook(() => useGeolocation());
		unmount();
		expect(clearWatch).toHaveBeenCalledWith(42);
	});
});
