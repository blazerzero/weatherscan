import "@testing-library/jest-dom/vitest";
import { vi } from "vitest";

// happy-dom doesn't implement GeolocationPositionError — polyfill it
if (typeof GeolocationPositionError === "undefined") {
	Object.defineProperty(globalThis, "GeolocationPositionError", {
		value: class GeolocationPositionError {
			static readonly PERMISSION_DENIED = 1;
			static readonly POSITION_UNAVAILABLE = 2;
			static readonly TIMEOUT = 3;
			readonly PERMISSION_DENIED = 1;
			readonly POSITION_UNAVAILABLE = 2;
			readonly TIMEOUT = 3;
			constructor(
				public code: number,
				public message = "",
			) {}
		},
		writable: false,
	});
}

// Stub leaflet — it relies on a DOM environment it can't fully set up in happy-dom
vi.mock("leaflet", () => ({
	default: {},
	map: vi.fn(),
	tileLayer: vi.fn(),
	icon: vi.fn(),
}));

vi.mock("react-leaflet", () => ({
	MapContainer: ({ children }: { children: React.ReactNode }) => children,
	TileLayer: () => null,
	useMap: vi.fn(),
}));

// Stub lottie-web — it accesses canvas APIs unavailable in happy-dom
vi.mock("lottie-web", () => ({
	default: { loadAnimation: vi.fn(() => ({ destroy: vi.fn() })) },
}));

// Stub global fetch so tests must opt-in via vi.stubGlobal or vi.spyOn
if (typeof globalThis.fetch === "undefined") {
	globalThis.fetch = vi.fn();
}
