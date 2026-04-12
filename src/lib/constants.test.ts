import { describe, expect, it } from "vitest";
import { COLORS, FIVE_MIN, MONO_FONT, THIRTY_MIN } from "./constants";

describe("time interval constants", () => {
	it("FIVE_MIN is 300 000 ms", () => expect(FIVE_MIN).toBe(300_000));
	it("THIRTY_MIN is 1 800 000 ms", () => expect(THIRTY_MIN).toBe(1_800_000));
	it("THIRTY_MIN is exactly 6× FIVE_MIN", () =>
		expect(THIRTY_MIN).toBe(FIVE_MIN * 6));
});

describe("COLORS", () => {
	it("contains all expected keys", () => {
		const keys: (keyof typeof COLORS)[] = [
			"blueDarkest",
			"blueDark",
			"blueMid",
			"blueLight",
			"blueBright",
			"blueAccent",
			"cyan",
			"gold",
			"goldDark",
			"orange",
			"red",
			"green",
			"textPrimary",
			"textSecondary",
			"textTertiary",
			"textDim",
			"border",
			"borderDark",
		];
		for (const key of keys) {
			expect(COLORS).toHaveProperty(key);
		}
	});

	it("all values are valid hex color strings", () => {
		for (const value of Object.values(COLORS)) {
			expect(value).toMatch(/^#[0-9a-f]{6}$/i);
		}
	});

	it("cyan is a valid blue hex value", () =>
		expect(COLORS.cyan).toMatch(/^#[0-9a-f]{6}$/i));
	it("gold is a valid hex value", () =>
		expect(COLORS.gold).toMatch(/^#[0-9a-f]{6}$/i));
	it("red is a valid hex value", () =>
		expect(COLORS.red).toMatch(/^#[0-9a-f]{6}$/i));
	it("border is a valid hex value", () =>
		expect(COLORS.border).toMatch(/^#[0-9a-f]{6}$/i));
});

describe("MONO_FONT", () => {
	it("contains Courier New", () => expect(MONO_FONT).toContain("Courier New"));
	it("includes a monospace fallback", () =>
		expect(MONO_FONT).toContain("monospace"));
});
