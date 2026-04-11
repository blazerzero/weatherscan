import { describe, it, expect, vi } from "vitest";
import { fetchRadarFrames, radarTileUrl } from "./rainviewer";

// ---------------------------------------------------------------------------
// radarTileUrl
// ---------------------------------------------------------------------------

describe("radarTileUrl", () => {
	it("builds a valid Leaflet tile URL template", () => {
		const url = radarTileUrl(
			"https://tilecache.rainviewer.com",
			"/v2/radar/1234567890",
			2,
			1,
			0,
		);
		expect(url).toBe(
			"https://tilecache.rainviewer.com/v2/radar/1234567890/256/{z}/{x}/{y}/2/1_0.png",
		);
	});

	it("uses default color scheme (2), smooth (1), snow (0) when not specified", () => {
		const url = radarTileUrl(
			"https://tilecache.rainviewer.com",
			"/v2/radar/abc",
		);
		expect(url).toContain("/2/1_0.png");
	});

	it("respects custom color scheme", () => {
		const url = radarTileUrl(
			"https://tilecache.rainviewer.com",
			"/v2/radar/abc",
			4,
		);
		expect(url).toContain("/4/");
	});

	it("respects smooth=0", () => {
		const url = radarTileUrl(
			"https://tilecache.rainviewer.com",
			"/v2/radar/abc",
			2,
			0,
		);
		expect(url).toContain("0_0.png");
	});

	it("respects snow=1", () => {
		const url = radarTileUrl(
			"https://tilecache.rainviewer.com",
			"/v2/radar/abc",
			2,
			1,
			1,
		);
		expect(url).toContain("1_1.png");
	});

	it("includes Leaflet z/x/y placeholders", () => {
		const url = radarTileUrl(
			"https://tilecache.rainviewer.com",
			"/v2/radar/abc",
		);
		expect(url).toContain("{z}");
		expect(url).toContain("{x}");
		expect(url).toContain("{y}");
	});
});

// ---------------------------------------------------------------------------
// fetchRadarFrames
// ---------------------------------------------------------------------------

const MOCK_RAINVIEWER_RESPONSE = {
	host: "https://tilecache.rainviewer.com",
	radar: {
		past: [
			{ time: 1700000000, path: "/v2/radar/1700000000" },
			{ time: 1700000600, path: "/v2/radar/1700000600" },
		],
		nowcast: [{ time: 1700001200, path: "/v2/radar/1700001200" }],
	},
};

describe("fetchRadarFrames", () => {
	it("returns radar data with host and frames on success", async () => {
		vi.stubGlobal(
			"fetch",
			vi.fn().mockResolvedValue({
				ok: true,
				json: async () => MOCK_RAINVIEWER_RESPONSE,
			}),
		);
		const data = await fetchRadarFrames();
		expect(data).not.toBeNull();
		expect(data!.host).toBe("https://tilecache.rainviewer.com");
		expect(data!.radar.past).toHaveLength(2);
		expect(data!.radar.nowcast).toHaveLength(1);
	});

	it("returns the correct frame path", async () => {
		vi.stubGlobal(
			"fetch",
			vi.fn().mockResolvedValue({
				ok: true,
				json: async () => MOCK_RAINVIEWER_RESPONSE,
			}),
		);
		const data = await fetchRadarFrames();
		expect(data!.radar.past[1]!.path).toBe("/v2/radar/1700000600");
	});

	it("returns null on HTTP error", async () => {
		vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: false }));
		expect(await fetchRadarFrames()).toBeNull();
	});

	it("returns null on network failure", async () => {
		vi.stubGlobal(
			"fetch",
			vi.fn().mockRejectedValue(new Error("Network error")),
		);
		expect(await fetchRadarFrames()).toBeNull();
	});
});
